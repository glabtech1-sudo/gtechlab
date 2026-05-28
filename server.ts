import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { apiGatewayRouter } from "./src/server/routes";
import { 
  rateLimiter, 
  auditLogger, 
  buildErrorHandler,
  configureSecurityHeaders,
  inputSanitizerMiddleware,
  csrfGuardMiddleware
} from "./src/server/utils";
import { DbService } from "./src/server/dbService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Gateway Global Security Infrastructure (HSTS, No-Sniff, CSP, XSS-Filter)
app.use(configureSecurityHeaders);
app.use(inputSanitizerMiddleware);
app.use(csrfGuardMiddleware);
app.use(rateLimiter);
app.use(auditLogger);

// Initialize dual-mode backend database routing
DbService.checkConnection().then((connected) => {
  if (connected) {
    console.info("⚡️ Connecté PostgreSQL via Prisma Client.");
  } else {
    console.warn("⚠️ Mode de secours : base transitionnelle en mémoire active.");
  }
});

// Note: apiGatewayRouter is mounted below to ensure inline paths are processed correctly without route collision.


// Initialize server-side Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// IN-MEMORY LIVE STATE DB FOR GLABTECH ARCHITECTURE (Odoo/HubSpot/Zoho alternative)
let managedApps = [
  {
    id: "glab-hotel",
    name: "G-HOTEL",
    description: "hotel.glabtech.com - Solution complète de gestion hôtelière : réservations de chambres, conciergerie, plannings de nuitées et facturation automatisée.",
    category: "Custom" as const,
    url: "https://hotel.glabtech.com",
    status: "online" as const,
    version: "v4.5.1",
    icon: "Building",
    ping: 15,
    activeUsers: 48,
    apiRequestsToday: 12400,
    ssoConnected: true,
    ssoClientId: "client_id_hotel_7bf2c5",
    ssoClientSecret: "sec_hotel_cf52a0d8c11fb355",
    lastSync: new Date().toISOString(),
    recordsCount: 340,
  },
  {
    id: "glab-resto",
    name: "G-RESTO",
    description: "resto.glabtech.com - Terminaux point de vente (POS) tactiles, gestion optimale des tables, commandes en cuisine en temps réel et contrôle des stocks d'ingrédients.",
    category: "Custom" as const,
    url: "https://resto.glabtech.com",
    status: "online" as const,
    version: "v3.2.0",
    icon: "Layers",
    ping: 22,
    activeUsers: 34,
    apiRequestsToday: 18900,
    ssoConnected: true,
    ssoClientId: "client_id_resto_11e8a9",
    ssoClientSecret: "sec_resto_f82bc94a11dbf212",
    lastSync: new Date().toISOString(),
    recordsCount: 840,
  },
  {
    id: "glab-erp",
    name: "G-ERP",
    description: "erp.glabtech.com - Noyau de planification des ressources de l'entreprise : comptabilité analytique, ressources humaines (HRM), approvisonnements et workflows de validation.",
    category: "HRM" as const,
    url: "https://erp.glabtech.com",
    status: "performance_issue" as const,
    version: "v6.0.4",
    icon: "Database",
    ping: 114,
    activeUsers: 128,
    apiRequestsToday: 41000,
    ssoConnected: true,
    ssoClientId: "client_id_erp_cc82a3",
    ssoClientSecret: "sec_erp_df82bc94a112abfe",
    lastSync: new Date().toISOString(),
    recordsCount: 5410,
  },
  {
    id: "glab-crm",
    name: "G-CRM",
    description: "crm.glabtech.com - Gestion de la relation client unifiée : pipelines commerciaux de leads, campagnes emailing intelligentes et tickets de support client.",
    category: "CRM" as const,
    url: "https://crm.glabtech.com",
    status: "online" as const,
    version: "v5.1.2",
    icon: "Briefcase",
    ping: 19,
    activeUsers: 104,
    apiRequestsToday: 34200,
    ssoConnected: true,
    ssoClientId: "client_id_crm_992bf1",
    ssoClientSecret: "sec_crm_001fe478aa92e21b",
    lastSync: new Date().toISOString(),
    recordsCount: 1950,
  },
  {
    id: "glab-market",
    name: "G-MARKET",
    description: "market.glabtech.com - Place de marché B2B globale : transactions commerciales inter-entreprises, contrats automatisés et courtage de commissions en direct.",
    category: "Finance" as const,
    url: "https://market.glabtech.com",
    status: "online" as const,
    version: "v2.8.9",
    icon: "DollarSign",
    ping: 14,
    activeUsers: 82,
    apiRequestsToday: 24700,
    ssoConnected: true,
    ssoClientId: "client_id_market_21aef4",
    ssoClientSecret: "sec_market_77e92bf114aab732",
    lastSync: new Date().toISOString(),
    recordsCount: 1280,
  },
  {
    id: "glab-travel",
    name: "G-TRAVEL",
    description: "travel.glabtech.com - Logistique de transport et agences de voyages : plannings des trajets de flottes, billetterie électronique intégrée et réservations de vols.",
    category: "Custom" as const,
    url: "https://travel.glabtech.com",
    status: "online" as const,
    version: "v1.4.0",
    icon: "Compass",
    ping: 25,
    activeUsers: 62,
    apiRequestsToday: 15300,
    ssoConnected: true,
    ssoClientId: "client_id_travel_ec18b3",
    ssoClientSecret: "sec_travel_882ca91f0a12e34d",
    lastSync: new Date().toISOString(),
    recordsCount: 615,
  },
  {
    id: "glab-hopital",
    name: "G-HOPITAL",
    description: "hopital.glabtech.com - Gestion hospitalière et de soins de santé : suivi des dossiers cliniques, planification des gardes des urgentistes et lits disponibles.",
    category: "Custom" as const,
    url: "https://hopital.glabtech.com",
    status: "online" as const,
    version: "v1.2.9",
    icon: "Activity",
    ping: 31,
    activeUsers: 56,
    apiRequestsToday: 8200,
    ssoConnected: true,
    ssoClientId: "client_id_hopital_aa21f9",
    ssoClientSecret: "sec_hopital_33a7e91d8ffb221a",
    lastSync: new Date().toISOString(),
    recordsCount: 412,
  },
  {
    id: "glab-ecommerce",
    name: "G-E-COMMERCE",
    description: "ecommerce.glabtech.com - Boutique en ligne grand public multicanale : panier d'achat persistant, passerelle bancaire Stripe et synchronisation de facturation.",
    category: "Finance" as const,
    url: "https://ecommerce.glabtech.com",
    status: "online" as const,
    version: "v2.1.0",
    icon: "ShoppingCart",
    ping: 18,
    activeUsers: 145,
    apiRequestsToday: 48900,
    ssoConnected: true,
    ssoClientId: "client_id_ecommerce_ef21bc",
    ssoClientSecret: "sec_ecommerce_442ae9dbf18ca412",
    lastSync: new Date().toISOString(),
    recordsCount: 2240,
  },
  {
    id: "glab-school",
    name: "G-SCHOOL",
    description: "school.glabtech.com - Plateforme scolaire et académique : fiches d'élèves, bulletins scolaires, notes de contrôle continu et portail professeurs-parents.",
    category: "Custom" as const,
    url: "https://school.glabtech.com",
    status: "online" as const,
    version: "v3.0.5",
    icon: "GraduationCap",
    ping: 20,
    activeUsers: 190,
    apiRequestsToday: 31200,
    ssoConnected: true,
    ssoClientId: "client_id_school_77f4ab",
    ssoClientSecret: "sec_school_b91da8efb102ca14",
    lastSync: new Date().toISOString(),
    recordsCount: 1840,
  },
  {
    id: "glab-gazolplus",
    name: "G-GAZOL PLUS",
    description: "gazolplus.glabtech.com - Système de supervision de stations-service pétrolières : ventes à la pompe réelles, tracking de cuve et cartes de fidélisation.",
    category: "Custom" as const,
    url: "https://gazolplus.glabtech.com",
    status: "online" as const,
    version: "v1.0.8",
    icon: "Zap",
    ping: 28,
    activeUsers: 45,
    apiRequestsToday: 9100,
    ssoConnected: true,
    ssoClientId: "client_id_gazolplus_88a2bf",
    ssoClientSecret: "sec_gazolplus_dd82cfe1149e9fac",
    lastSync: new Date().toISOString(),
    recordsCount: 390,
  },
  {
    id: "glab-trustfinance",
    name: "G-TRUST FINANCE",
    description: "trustfinance.glabtech.com - Solution fintech d'investissement, garde de fonds fiduciaires, audits de conformité de transactions et gestion de trésorerie multi-devises.",
    category: "Finance" as const,
    url: "https://trustfinance.glabtech.com",
    status: "online" as const,
    version: "v2.0.1",
    icon: "Lock",
    ping: 11,
    activeUsers: 34,
    apiRequestsToday: 18200,
    ssoConnected: true,
    ssoClientId: "client_id_trustfinance_3df58b",
    ssoClientSecret: "sec_trustfinance_098ca7efb123fac9",
    lastSync: new Date().toISOString(),
    recordsCount: 712,
  },
  {
    id: "glab-comptabilite",
    name: "G-COMPTABILITE",
    description: "comptabilite.glabtech.com - Grand livre comptable automatisé, bilans financiers certifiés, déclarations fiscales dématérialisées et calcul d'amortissements.",
    category: "Finance" as const,
    url: "https://comptabilite.glabtech.com",
    status: "online" as const,
    version: "v4.1.0",
    icon: "BookOpen",
    ping: 16,
    activeUsers: 88,
    apiRequestsToday: 29500,
    ssoConnected: true,
    ssoClientId: "client_id_comptabilite_f42ab9",
    ssoClientSecret: "sec_comptabilite_cc18da9e9fab23df",
    lastSync: new Date().toISOString(),
    recordsCount: 4120,
  },
  {
    id: "glab-rhsysteme",
    name: "G-RH SYSTEME",
    description: "rhsysteme.glabtech.com - Suite de pilotage des ressources humaines : fiches de paie dématérialisées, suivi d'absences et évaluation annuelle des collaborateurs.",
    category: "HRM" as const,
    url: "https://rhsysteme.glabtech.com",
    status: "online" as const,
    version: "v2.5.3",
    icon: "Fingerprint",
    ping: 19,
    activeUsers: 112,
    apiRequestsToday: 32000,
    ssoConnected: true,
    ssoClientId: "client_id_rhsysteme_a89fac",
    ssoClientSecret: "sec_rhsysteme_ee7cf8a29bd890ac",
    lastSync: new Date().toISOString(),
    recordsCount: 1530,
  }
];

let securityLogs = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    event: "Token JWT Généré via Supabase SSO",
    user: "glabtech1@gmail.com",
    app: "glab-erp",
    ip: "109.12.98.24",
    status: "success" as const,
    details: "Signature asymétrique validée pour l'organisation GLABTECH HQ.",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    event: "Tentative d'accès hors-limite bloquée",
    user: "Anonyme",
    app: "glab-hotel",
    ip: "193.250.4.15",
    status: "warning" as const,
    details: "Tentative d'appel à l'API sans Bearer JWT valide. Requête parée par GLABTECH API Gateway.",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    event: "Webhook de paiement Stripe acquitté",
    user: "Stripe Event Daemon",
    app: "glab-market",
    ip: "54.187.200.12",
    status: "success" as const,
    details: "Cycle de facturation de l'abonnement SaaS mensuel validé par carte bancaire.",
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    event: "Rotation programmée des clés secrètes",
    user: "System Admin (Cron)",
    app: "glab-resto",
    ip: "127.0.0.1",
    status: "success" as const,
    details: "Algorithme HS256 : régénération unifiée des clés pour toutes les applications multi-tenant.",
  }
];

let customWorkflows = [
  {
    id: "workflow-1",
    name: "Admission Hopital vers ERP",
    description: "Créer un dossier de facturation tiers dans Glab ERP dès qu'une fiche clinique de patient est initialisée sur hopital.glabtech.com.",
    triggerApp: "glab-hopital",
    triggerEvent: "Création dossier patient",
    targetApp: "glab-erp",
    targetAction: "Générer fiche comptable tiers",
    active: true
  },
  {
    id: "workflow-2",
    name: "Vente Boutique vers Factures",
    description: "Créer instantanément une note comptable et déduire les stocks de l'ERP si un achat est validé sur market.glabtech.com.",
    triggerApp: "glab-market",
    triggerEvent: "Paiement réussi",
    targetApp: "glab-erp",
    targetAction: "Mettre à jour inventaires & exports",
    active: true
  }
];

// SaaS active pricing metadata
let enterpriseBilling = {
  currentPlan: "Enterprise Premium",
  expiryDate: "2027-05-27T00:00:00Z",
  monthlyPrice: 349.00,
  activeCurrency: "EUR",
  activeOrganizations: [
    { id: "org-1", label: "GLABTECH HQ (Europe)", seatsUsed: 14, seatsMax: 50 },
    { id: "org-2", label: "Sandbox Testing Lab", seatsUsed: 3, seatsMax: 50 }
  ],
  ssoClaims: {
    iss: "https://auth.glabtech.com",
    aud: "glab-federated-sso",
    allowedDomains: ["glabtech.com", "glabtech.com"]
  }
};

// DYNAMIC PERFORMANCE METRICS COMPILATION
function getSystemMetrics() {
  return {
    timestamp: new Date().toISOString(),
    cpu: Math.floor(Math.random() * 20) + 10, // 10-30%
    memory: Math.round((2.4 + Math.random() * 0.3) * 10) / 10, // 2.4 - 2.7 GB
    networkIn: Math.floor(Math.random() * 250) + 150, // 150-400 KB/s
    networkOut: Math.floor(Math.random() * 900) + 300, // 300-1200 KB/s
    apiLatency: Math.floor(Math.random() * 40) + 15, // 15-55ms
  };
}

// REST APIs
app.get("/api/apps", (req, res) => {
  res.json(managedApps);
});

// Update or add an app integration
app.post("/api/apps", (req, res) => {
  const { name, description, category, url, version, icon } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "Les champs Nom et Catégorie sont obligatoires." });
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const existingIndex = managedApps.findIndex(a => a.id === id);
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  const updatedApp = {
    id: existingIndex >= 0 ? managedApps[existingIndex].id : id,
    name,
    description: description || "Aucune description fournie.",
    category: category as any,
    url: url || `https://${id}.glabtech.com`,
    status: "online" as const,
    version: version || "v1.0.0",
    icon: icon || "Layers",
    ping: Math.floor(Math.random() * 30) + 10,
    activeUsers: 0,
    apiRequestsToday: 0,
    ssoConnected: true,
    ssoClientId: `client_id_${id}_${randomSuffix}`,
    ssoClientSecret: `sec_${id}_${Math.random().toString(36).substring(2, 10)}`,
    lastSync: new Date().toISOString(),
    recordsCount: 0
  };

  if (existingIndex >= 0) {
    managedApps[existingIndex] = { ...managedApps[existingIndex], ...updatedApp };
  } else {
    managedApps.push(updatedApp);
  }

  securityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: "Portail: Nouvelle Application Enregistrée",
    user: "glabtech1@gmail.com",
    app: updatedApp.id,
    ip: "109.12.98.24",
    status: "success" as const,
    details: `Application unifiée '${name}' déclarée de manière sécurisée sous le SSO.`
  });

  res.json(updatedApp);
});

// Regenerate SSO credentials
app.post("/api/apps/:id/sso-regen", (req, res) => {
  const { id } = req.params;
  const appIndex = managedApps.findIndex(a => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application introuvable." });
  }

  const randomString = Math.random().toString(36).substring(2, 10);
  managedApps[appIndex].ssoClientId = `client_id_${id}_${Math.random().toString(36).substring(2, 6)}`;
  managedApps[appIndex].ssoClientSecret = `sec_${id}_${randomString}`;
  managedApps[appIndex].lastSync = new Date().toISOString();

  securityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: "Régénération SSO Clés",
    user: "glabtech1@gmail.com",
    app: id,
    ip: "109.12.98.24",
    status: "warning" as const,
    details: "Déclenchement d'un cycle de rotation des secrets client OAuth unifiés."
  });

  res.json(managedApps[appIndex]);
});

// Trigger virtual synchronization
app.post("/api/apps/:id/sync", (req, res) => {
  const { id } = req.params;
  const appIndex = managedApps.findIndex(a => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application introuvable." });
  }

  managedApps[appIndex].lastSync = new Date().toISOString();
  managedApps[appIndex].ping = Math.floor(Math.random() * 25) + 12;
  managedApps[appIndex].status = "online";
  managedApps[appIndex].apiRequestsToday += Math.floor(Math.random() * 400) + 100;

  securityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: "Synchronisation Manuelle Déclenchée",
    user: "glabtech1@gmail.com",
    app: id,
    ip: "109.12.98.24",
    status: "success" as const,
    details: "Mise à jour du schéma PostgreSQL via Prisma ORM achevée avec succès."
  });

  res.json(managedApps[appIndex]);
});

// Edit specific records simulation for dashboard direct interaction
app.post("/api/apps/:id/records", (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const appIndex = managedApps.findIndex(a => a.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "Application introuvable." });
  }

  const change = Number(amount) || 1;
  managedApps[appIndex].recordsCount = Math.max(0, managedApps[appIndex].recordsCount + change);
  managedApps[appIndex].apiRequestsToday += 1;
  managedApps[appIndex].lastSync = new Date().toISOString();

  res.json(managedApps[appIndex]);
});

// Logs API
app.get("/api/logs", (req, res) => {
  res.json(securityLogs);
});

// Get/Set custom workflows
app.get("/api/workflows", (req, res) => {
  res.json(customWorkflows);
});

app.post("/api/workflows", (req, res) => {
  const { name, description, triggerApp, triggerEvent, targetApp, targetAction } = req.body;
  if (!name || !triggerApp || !targetApp) {
    return res.status(400).json({ error: "Données de workflow incomplètes." });
  }

  const newWorkflow = {
    id: `workflow-${Date.now()}`,
    name,
    description: description || "Pont d'automatisation intelligente inter-applications",
    triggerApp,
    triggerEvent: triggerEvent || "Événement standard",
    targetApp,
    targetAction: targetAction || "Mise à jour base de données",
    active: true
  };

  customWorkflows.push(newWorkflow);

  securityLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: "Création Automatisation GLAB-Link",
    user: "glabtech1@gmail.com",
    app: "Portail GLABTECH AI",
    ip: "109.12.98.24",
    status: "success" as const,
    details: `Workflow intelligent '${name}' déployé: Relie '${triggerApp}' à '${targetApp}'.`
  });

  res.json(newWorkflow);
});

app.post("/api/workflows/:id/toggle", (req, res) => {
  const { id } = req.params;
  const wIndex = customWorkflows.findIndex(w => w.id === id);
  if (wIndex === -1) {
    return res.status(404).json({ error: "Workflow introuvable." });
  }

  customWorkflows[wIndex].active = !customWorkflows[wIndex].active;
  res.json(customWorkflows[wIndex]);
});

// Billing details
app.get("/api/billing", (req, res) => {
  res.json(enterpriseBilling);
});

app.post("/api/billing/plan", (req, res) => {
  const { plan } = req.body;
  if (plan) {
    enterpriseBilling.currentPlan = plan;
    enterpriseBilling.monthlyPrice = plan === "Enterprise Premium" ? 349.00 : plan === "Pro Scale" ? 149.00 : 0;
  }
  res.json(enterpriseBilling);
});

// Live metrics
app.get("/api/metrics", (req, res) => {
  res.json(getSystemMetrics());
});

// INTELLIGENT OMNI-PORTAL COPILOT (GEMINI INTEGRATION)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Format du chat invalide." });
  }

  const aiClient = getGeminiClient();
  if (!aiClient) {
    // Elegant fallback simulation
    const userMsg = messages[messages.length - 1]?.text || "";
    let reply = `[Mode Simulation Assistée GLABTECH] Bonjour ! C'est le Copilote Intelligent GLABTECH. Je simule mes réponses de secours car aucune clé GEMINI_API_KEY n'a été raccordée. 

Voici un rapport analysé de votre écosystème multi-applications (glabtech.com) :
- **hotel.glabtech.com (Glab Hotel) :** ${managedApps[0].recordsCount} réservations (Statut : En ligne - 15ms)
- **resto.glabtech.com (Glab Resto) :** ${managedApps[1].recordsCount} tickets cuisine (Statut : En ligne - 22ms)
- **crm.glabtech.com (Glab CRM) :** ${managedApps[2].recordsCount} comptes clients (Statut : En ligne - 19ms)
- **erp.glabtech.com (Glab ERP) :** ${managedApps[3].recordsCount} lignes base de données (Statut : Latence anormale de 114ms)
- **market.glabtech.com (Glab Market) :** ${managedApps[4].recordsCount} commandes validées (Statut : En ligne - 28ms)
- **hopital.glabtech.com (Glab Hopital) :** ${managedApps[5].recordsCount} patients suivis (Statut : En ligne - 31ms)

**Analyse de glabtech.com :**
L'anomalie détectée sur **Glab ERP Logistics** (114ms) provient d'un cycle intense d'écriture de l'ORM Prisma. Je vous suggère de vider les tampons de cache ou de planifier une synchronisation via notre passerelle unifiée. 

Comment puis-je vous aider aujourd'hui ? Je peux générer des scripts SSO unifiés, simuler des logs de débogage ou formuler des commandes d'automatisation.`;
    
    return res.json({ text: reply });
  }

  try {
    const activeAppsSummary = managedApps.map(a => 
      `- ${a.name} (${a.url}): ${a.recordsCount} enregistrements persistés, Statut: ${a.status}, Ping: ${a.ping}ms, Version: ${a.version}`
    ).join("\n");

    const recentLogsSummary = securityLogs.slice(0, 3).map(l => 
      `* [${l.timestamp}] Evénement: ${l.event} sur ${l.app} (${l.status}) -> ${l.details}`
    ).join("\n");

    const systemInstruction = `Tu es l'Intelligence Artificielle et le Copilote d'ingénierie centrale de GLABTECH (glabtech.com). Ton rôle est d'accompagner l'administrateur dans la supervision de sa plateforme SaaS unifiée.

Tu disposes des informations réelles de la plateforme en temps réel ci-dessous :
--- ÉTAT DES SERVICES MULTI-APPLICATIONS ---
${activeAppsSummary}

--- WORKFLOWS INTELLIGENTS DE LIAISONS ---
${customWorkflows.map(w => `- ${w.name}: de ${w.triggerApp} vers ${w.targetApp} (${w.active ? 'Actif' : 'Inactif'})`).join("\n")}

--- LOGS DE SECURITE SECURISES RECENTS ---
${recentLogsSummary}

Prends en compte ces données réelles pour répondre de façon pertinente, ultra professionnelle, précise et pragmatique.
Réponds exclusivement en français. Conserve un ton corporate, expert, novateur et sécurisant.
Tu peux suggérer des solutions d'ingénierie, analyser des tendances de pannes, rédiger des rapports d'audit de sécurité, ou aider l'utilisateur à automatiser des liaisons inter-applications.`;

    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini call error:", error);
    res.status(500).json({ error: `Une erreur s'est produite lors de l'appel à l'IA: ${error.message || error}` });
  }
});

// Primary Endpoint Route Mappings (API Gateway Hub)
app.use("/api", apiGatewayRouter);

// Registrar for centralized error boundaries catchings
app.use(buildErrorHandler);

// Vite or Static file serving middleware setup
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GLABTECH custom server running on port ${PORT}`);
  });
};

startServer();
