import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { DbService } from "./dbService";

const JWT_SECRET = process.env.JWT_SECRET || "glabtech_secure_super_secret_gateway_2026";

// Deriving a stable 32-byte key for AES-250 security from JWT_SECRET
const ENCRYPTION_KEY = crypto.createHash("sha256").update(JWT_SECRET).digest();
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// ========================================================
// 1. CRYPTO SIGNING / VERIFICATION CORE ENGINE (HARDENED)
// ========================================================
function base64url(str: string | Buffer): string {
  const buf = typeof str === "string" ? Buffer.from(str) : str;
  return buf.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function generateToken(payload: object, durationSeconds = 3600): string {
  const exp = Math.floor(Date.now() / 1000) + durationSeconds;
  const fullPayload = { 
    ...payload, 
    exp,
    iss: "https://auth.glabeboutique.com",
    aud: "glab-federated-sso"
  };
  
  const header = { alg: "HS256", typ: "JWT" };
  const h = base64url(JSON.stringify(header));
  const p = base64url(JSON.stringify(fullPayload));
  
  const signatureInput = `${h}.${p}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest();
  
  return `${signatureInput}.${base64url(signature)}`;
}

export function verifyToken(token: string): any {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  
  const [h, p, s] = parts;
  const signatureInput = `${h}.${p}`;
  
  // Algorithm hardening: verify headers actually define HS256 to block alg spoofing
  try {
    const headerStr = Buffer.from(h, "base64").toString("utf-8");
    const header = JSON.parse(headerStr);
    if (header.alg !== "HS256") {
      console.warn(`SECURITY ALERT: Algorithm spoofing attempt detected: ${header.alg}`);
      return null;
    }
  } catch {
    return null;
  }
  
  const verifiedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest();
  
  if (base64url(verifiedSignature) !== s) return null;
  
  try {
    const payloadStr = Buffer.from(p, "base64").toString("utf-8");
    const payload = JSON.parse(payloadStr);
    
    // Check validation claims (Issuer & Audience checks)
    if (payload.iss !== "https://auth.glabeboutique.com" || payload.aud !== "glab-federated-sso") {
      console.warn("SECURITY WARNING: Invalid token claim properties.");
      return null;
    }

    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
}

// PBKDF2 style hashing representation
export function secureHashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + JWT_SECRET).digest("hex");
}

// ========================================================
// 2. SYMMETRIC AES-256-CBC FIELD-LEVEL ENCRYPTION ENGINE
// ========================================================
export function encryptAES(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    // Prepend IV in hex format for decryption routing
    return iv.toString("hex") + ":" + encrypted;
  } catch (err) {
    console.error("AES encryption failure:", err);
    throw new Error("Erreur de chiffrement symétrique AES.");
  }
}

export function decryptAES(encryptedText: string): string {
  try {
    if (!encryptedText || !encryptedText.includes(":")) {
      return encryptedText; // Pass through if not cipher text format
    }
    const parts = encryptedText.split(":");
    const iv = Buffer.from(parts.shift() || "", "hex");
    const encryptedHex = parts.join(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("AES decryption failure (possibly wrong key or tampered):", err);
    throw new Error("Échec du déchiffrement. Jeton corrompu ou clé non certifiée.");
  }
}

// ========================================================
// 3. ADAPTIVE ROUTE RATE LIMITER (DIFFERENTIATED DOS & BRUTEFORCE QUOTAS)
// ========================================================
interface LimitEntry {
  count: number;
  resetAt: number;
  failedAttempts: number;
}
const ipMap = new Map<string, LimitEntry>();
const quarantineList = new Map<string, { quarantinedUntil: number; reason: string }>();

const GLOBAL_LIMIT_MS = 60000; // 1 minute window
const MAX_STANDARD_LIMIT = 120; // 120 req/min for average dashboard usage
const MAX_AUTH_LIMIT = 15; // 15 req/min strict constraint for login/mfa endpoints

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  
  // Verify Quarantine list state first
  const quarantine = quarantineList.get(ip);
  if (quarantine && now < quarantine.quarantinedUntil) {
    const remainingTime = Math.ceil((quarantine.quarantinedUntil - now) / 1000);
    return res.status(423).json({
      error: "Accès Bloqué (SecOps Quarantine)",
      message: `Cette adresse IP est temporairement mise en quarantaine en raison de comportements de brute-force répétés. Libération automatique dans ${remainingTime} secondes.`,
      reason: quarantine.reason
    });
  }

  // Clear expired quarantine
  if (quarantine && now >= quarantine.quarantinedUntil) {
    quarantineList.delete(ip);
  }

  // Detect route category matching for rate limiting
  const isAuthRoute = req.path.includes("/auth/login") || req.path.includes("/auth/mfa");
  const maxLimit = isAuthRoute ? MAX_AUTH_LIMIT : MAX_STANDARD_LIMIT;

  let entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + GLOBAL_LIMIT_MS, failedAttempts: entry?.failedAttempts || 0 };
    ipMap.set(ip, entry);
  } else {
    entry.count++;
  }
  
  // Expose safety telemetry headers for audits
  res.setHeader("X-RateLimit-Limit", maxLimit);
  res.setHeader("X-RateLimit-Remaining", Math.max(0, maxLimit - entry.count));
  res.setHeader("X-RateLimit-Reset", Math.ceil(entry.resetAt / 1000));
  
  if (entry.count > maxLimit) {
    // Increment failures if they keep spamming auth routes
    if (isAuthRoute) {
      entry.failedAttempts++;
      if (entry.failedAttempts >= 5) {
        // Quarantine IP for 5 minutes (300 seconds)
        quarantineList.set(ip, {
          quarantinedUntil: now + 300 * 1000,
          reason: "Trop de tentatives d'authentification infructueuses (Brute-Force Shield active)."
        });
        console.warn(`SECURITY COMPLIANCE: IP ${ip} put in quarantine due to brute-force limits.`);
      }
    }

    return res.status(429).json({
      error: "Trop de requêtes",
      message: isAuthRoute 
        ? "Trop de tentatives d'auth sur cette adresse IP. Temporisation brute-force active."
        : "Fréquence de requêtes excessive sur l'API Gateway. Réessayez dans 1 minute.",
      retryAfter: Math.ceil((entry.resetAt - now) / 1000)
    });
  }
  next();
}

// Function to increment auth failures specifically (called by routes on wrong pass)
export function reportFailedAuthAttempt(ip: string) {
  const entry = ipMap.get(ip);
  if (entry) {
    entry.failedAttempts++;
    if (entry.failedAttempts >= 6) {
      quarantineList.set(ip, {
        quarantinedUntil: Date.now() + 600 * 1000, // 10 minutes lock
        reason: "Succession d'identifiants incorrects sur l'écosystème unifié SSO."
      });
    }
  }
}

// ========================================================
// 4. SECURE AUTHENTICATION AND LEAK PREVENTION MIDDLEWARE
// ========================================================
export interface AuthenticatedRequest extends Request {
  userPayload?: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const tenantHeader = req.headers["x-tenant-id"] as string; 
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    DbService.createActivityLog({
      event: "Accès refusé",
      ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
      status: "warning",
      details: `Tentative d'accès anonyme bloquée sur ${req.method} ${req.path}`,
      userId: null,
      organizationId: tenantHeader || "org-glabtech-hq",
      applicationId: null
    }).catch(() => {});
    
    return res.status(401).json({
      error: "Non Authentifié",
      message: "Un jeton d'authentification Bearer JWT valide est requis pour interroger cette ressource."
    });
  }
  
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(403).json({
      error: "Jeton Invalide",
      message: "La signature du jeton JWT a expiré, est corrompue, ou provient d'une source non certifiée."
    });
  }
  
  req.userPayload = payload;
  next();
}

export function requirePermissions(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userPayload) {
      return res.status(401).json({ error: "Authentification requise" });
    }
    const { role } = req.userPayload;
    if (role === "Global Owner" || allowedRoles.includes(role)) {
      return next();
    }
    
    return res.status(403).json({
      error: "Permission Refusée",
      message: `Votre rôle '${role}' ne possède pas les assertions requises (RBAC) pour cette opération.`
    });
  };
}

// ========================================================
// 5. HELMET-STYLE CENTRAL SECURITY HEADERS (XSS & IFRAME ADJUSTED)
// ========================================================
export function configureSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent mime-type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Force secure browser XSS filter
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Referrer restrictions to protect authorization leakage
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Strict-Transport-Security (HSTS) - enforce HTTPS
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  /*
    CSP - Content Security Policy adjusted to ALLOW loading nested interactive previews on Google AI Studio 
    without triggering cross-origin inline scripts blocks, while restricting random asset injection.
  */
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://*.google.com https://*.googleapis.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: referrer *; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "connect-src 'self' ws: wss: https://*.google.com https://*.googleapis.com; " +
    "frame-ancestors 'self' https://*.google.com https://ai.studio https://*.run.app; " + // Secure embedding in AI Studio preview iframe
    "object-src 'none';"
  );

  next();
}

// ========================================================
// 6. XSS INPUT VALIDATION & SANITIZATION ENGINE (RECURSIVE)
// ========================================================
function sanitizeString(val: string): string {
  if (typeof val !== "string") return val;
  return val
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // remove script tags strictly
    .replace(/javascript:/gi, "") // remove protocol anchors
    .replace(/onerror\s*=/gi, "noerror=") // disable inline error triggers
    .replace(/onload\s*=/gi, "noload=") // disable inline load triggers
    .trim();
}

function recursiveSanitizer(obj: any): any {
  if (!obj) return obj;
  if (typeof obj === "string") {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => recursiveSanitizer(item));
  }
  if (typeof obj === "object") {
    const fresh: any = {};
    for (const key of Object.keys(obj)) {
      fresh[key] = recursiveSanitizer(obj[key]);
    }
    return fresh;
  }
  return obj;
}

export function inputSanitizerMiddleware(req: Request, res: Response, next: NextFunction) {
  // Sanitize body, query and route parameters against inline scripting
  if (req.body) req.body = recursiveSanitizer(req.body);
  if (req.query) req.query = recursiveSanitizer(req.query);
  if (req.params) req.params = recursiveSanitizer(req.params);
  next();
}

// ========================================================
// 7. CSRF PROTECTION INTERACTION GUARD
// ========================================================
export function csrfGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  // Omit GET/OPTIONS/HEAD checks
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const origin = req.headers["origin"] || req.headers["referer"];
  const host = req.headers["host"];

  // CSRF token validation: Check request carries explicit verification headers
  // During AI Studio previews, cross-site origin redirects are frequent. 
  // We check either referer domain matches host, or X-Requested-With header exists
  const hasRequestedHeader = req.headers["x-requested-with"] === "XMLHttpRequest" || req.headers["x-xsrf-token"] !== undefined;
  
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      // If requests come from outside domains without requested headers, reject
      if (originUrl.host !== host && !hasRequestedHeader && !originOptionallyValid(originUrl.hostname)) {
        return res.status(403).json({
          error: "Avertissement CSRF",
          message: "Action bloquée en raison de l'absence de jeton de session anti-CSRF unifié."
        });
      }
    } catch {
      // safe fallback
    }
  }
  next();
}

function originOptionallyValid(hostname: string): boolean {
  // Safe helper to allow google cloud run previews
  return hostname.endsWith(".run.app") || hostname === "localhost" || hostname.includes("google.com") || hostname.includes("ai.studio");
}

// ========================================================
// 8. CENTRALIZED AUDIT LOGGING AND MONITORS
// ========================================================
export function auditLogger(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalEnd = res.end;
  
  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    const duration = Date.now() - start;
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    const status = res.statusCode;
    
    if (req.userPayload && !req.path.startsWith("/api/metrics")) {
      const { id, organizationId } = req.userPayload;
      const isMutation = ["POST", "PUT", "DELETE"].includes(req.method);
      if (isMutation || status >= 400) {
        DbService.createActivityLog({
          event: `Requête API: ${req.method} ${req.path}`,
          ip,
          status: status >= 400 ? "failed" : "success",
          details: `Statut HTTP ${status} retourné en ${duration}ms. Route traitée par l'API Gateway.`,
          userId: id,
          organizationId: organizationId,
          applicationId: null
        }).catch(() => {});
      }
    }
    
    return originalEnd.call(this, chunk, encoding, callback);
  } as any;
  
  next();
}

// Central error boundaries handler
export function buildErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Central Error Handler Intercepted:", err);
  const status = err.statusCode || err.status || 500;
  
  res.status(status).json({
    error: "Erreur Système Interne",
    message: err.message || "Une exception imprévue a été capturée par l'API Gateway.",
    status,
    timestamp: new Date().toISOString()
  });
}
