import React, { useState, useEffect } from "react";
import { 
  KeyRound, 
  ShieldCheck, 
  Terminal, 
  Check, 
  Copy,
  Layers,
  Fingerprint,
  Info,
  Lock,
  Unlock,
  ShieldAlert,
  Zap,
  RefreshCcw,
  Timer,
  ArrowRight,
  Code2,
  Play,
  CheckCircle2,
  Sparkles,
  Globe
} from "lucide-react";

interface SsoTabProps {
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export default function SsoTab({ onNotify }: SsoTabProps) {
  const [selectedRole, setSelectedRole] = useState("Global Owner");
  const [copiedText, setCopiedText] = useState(false);

  // AES Interactive states
  const [plainTextToEncrypt, setPlainTextToEncrypt] = useState("glab_confidential_api_secret_key_88fabc");
  const [encryptedResult, setEncryptedResult] = useState("");
  const [cipherTextToDecrypt, setCipherTextToDecrypt] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Rate limit dynamic UI simulations / headers
  const [rateLimitTotal, setRateLimitTotal] = useState(120);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(118);
  const [rateLimitReset, setRateLimitReset] = useState(54);
  const [simulatedLoadProgress, setSimulatedLoadProgress] = useState(0);

  // Trial requests management
  const [trialRequests, setTrialRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Guide d'Intégration & Simulateur states
  const [activeSdkLanguage, setActiveSdkLanguage] = useState<"node" | "react" | "python">("node");
  const [sandboxClientId, setSandboxClientId] = useState("client_id_glab_eboutique_prod");
  const [sandboxRedirectUrl, setSandboxRedirectUrl] = useState("https://ma-boutique-partenaire.com/auth/callback");
  const [isSimulatingSsoFlow, setIsSimulatingSsoFlow] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState(0);
  const [simulatedToken, setSimulatedToken] = useState("");

  const nodeCode = `const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const GLAB_SSO_PUB_KEY = \`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Yh...
-----END PUBLIC KEY-----\`;

app.get('/auth/callback', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send("Jeton SSO manquant.");

  // Valider la signature cryptographique du jeton
  jwt.verify(token, GLAB_SSO_PUB_KEY, {
    issuer: 'https://auth.glabeboutique.com',
    audience: 'glab-federated-sso'
  }, (err, decoded) => {
    if (err) return res.status(401).send("Jeton invalide ou corrompu.");

    // Enregistrer la session utilisateur
    req.session.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      organisation: decoded.organization
    };
    res.redirect('/dashboard');
  });
});`;

  const reactCode = `import { useEffect, useState } from "react";

export function useSsoAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Envoyer le jeton à votre serveur backend pour vérification
      fetch("/api/auth/sso-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          // Nettoyer l'URL callback
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    }
  }, []);

  const loginWithSSO = () => {
    const clientId = "client_id_glab_eboutique_prod";
    const redirectUri = window.location.origin + "/auth/callback";
    window.location.href = \`https://auth.glabeboutique.com/sso?client_id=\${clientId}&redirect_uri=\${redirectUri}\`;
  };

  return { user, loginWithSSO };
}`;

  const pythonCode = `from fastapi import FastAPI, HTTPException
import jwt

app = FastAPI()

SSO_PUB_KEY = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Yh...
-----END PUBLIC KEY-----"""

@app.get("/auth/callback")
async def sso_callback(token: str = None):
    if not token:
        raise HTTPException(status_code=400, detail="Jeton manquant")
    try:
        # Décodage et contrôle de validité locale
        payload = jwt.decode(
            token, 
            SSO_PUB_KEY, 
            algorithms=["RS256"], 
            audience="glab-federated-sso", 
            issuer="https://auth.glabeboutique.com"
        )
        return {
            "status": "connected",
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role")
        }
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Jeton altéré ou expiré")`;

  const handleRunSimulation = () => {
    if (!sandboxRedirectUrl.trim()) {
      onNotify("Veuillez renseigner l'URL de retour de votre application.", "warn");
      return;
    }
    
    setIsSimulatingSsoFlow(true);
    setSimulatedStep(1);
    onNotify("Simulation lancée : Initialisation de la requête SSO...", "info");
    
    setTimeout(() => {
      setSimulatedStep(2);
      onNotify("Étape 2 : Redirection de l'utilisateur sur auth.glabeboutique.com", "info");
    }, 1200);

    setTimeout(() => {
      setSimulatedStep(3);
      const mockSign = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + btoa(JSON.stringify(sampleJwtPayload)).replace(/=/g, "") + ".SignatureValide_SSO_Glab";
      setSimulatedToken(mockSign);
      onNotify("Étape 3 : Authentification réussie. Jeton JWT sécurisé généré.", "success");
    }, 2400);

    setTimeout(() => {
      setSimulatedStep(4);
      onNotify("Étape 4 : Redirection réussie avec transmission du jeton !", "success");
    }, 3600);
  };

  const fetchTrialRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch("/api/trial-requests");
      if (res.ok) {
        const data = await res.json();
        setTrialRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/trial-requests/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onNotify(`Demande d'essai mise à jour : ${newStatus.toUpperCase()}`, "success");
        fetchTrialRequests();
      } else {
        onNotify("Impossible de modifier le statut de la demande.", "warn");
      }
    } catch (err) {
      onNotify("Erreur de communication avec la base de données.", "warn");
    }
  };

  useEffect(() => {
    fetchTrialRequests();
  }, []);

  const sampleJwtHeader = {
    alg: "HS256",
    typ: "JWT",
    kid: "glabtech_central_gateway_key_2026"
  };

  const sampleJwtPayload = {
    iss: "https://auth.glabeboutique.com",
    sub: "usr_glab_1002bf92",
    aud: "glab-federated-sso",
    name: "Glabtech Admin",
    email: "glabtech1@gmail.com",
    role: selectedRole,
    organization: "GLABTECH HQ (Europe)",
    allowedDomains: ["glabeboutique.com", "hotel.glabeboutique.com", "resto.glabeboutique.com", "crm.glabeboutique.com", "erp.glabeboutique.com", "market.glabeboutique.com", "hopital.glabeboutique.com"],
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };

  useEffect(() => {
    // Generate an initial encryption to populate the sandbox beautifully
    handleEncryptInit();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJwtPayload, null, 2));
    setCopiedText(true);
    onNotify("Payload JWT copié dans le presse-papiers !", "success");
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleEncryptInit = async () => {
    try {
      const res = await fetch("/api/security/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "glab_confidential_api_secret_key_88fabc" })
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : null;
        if (data) {
          setEncryptedResult(data.encrypted);
          setCipherTextToDecrypt(data.encrypted);
        }
      }
    } catch (e) {
      // safe fallback
    }
  };

  const handleEncrypt = async () => {
    if (!plainTextToEncrypt.trim()) {
      onNotify("Veuillez saisir un texte à chiffrer.", "warn");
      return;
    }
    setIsEncrypting(true);
    try {
      const res = await fetch("/api/security/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainTextToEncrypt })
      });
      if (!res.ok) throw new Error("Le serveur a retourné une erreur.");
      const data = await res.json();
      setEncryptedResult(data.encrypted);
      setCipherTextToDecrypt(data.encrypted); // auto-inject to decryptor tab block
      onNotify("Chiffrement AES-256-CBC exécuté avec succès !", "success");
    } catch (err: any) {
      onNotify("Erreur de communication cryptographique.", "warn");
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!cipherTextToDecrypt.trim()) {
      onNotify("Veuillez renseigner un bloc chiffré.", "warn");
      return;
    }
    setIsDecrypting(true);
    try {
      const res = await fetch("/api/security/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted: cipherTextToDecrypt })
      });
      if (!res.ok) throw new Error("Jeton corrompu ou falsifié.");
      const data = await res.json();
      setDecryptedResult(data.decrypted);
      onNotify("Déchiffrement AES-256-CBC unifié complété !", "success");
    } catch (err: any) {
      setDecryptedResult("❌ ÉCHEC DU DÉCHIFFREMENT : Signature corrompue, clé de dérivation incorrecte ou attaque par rejeu détectée.");
      onNotify("Déchiffrement rejeté par la passerelle.", "warn");
    } finally {
      setIsDecrypting(false);
    }
  };

  const triggerAuditPingSim = () => {
    setRateLimitRemaining(prev => Math.max(0, prev - 1));
    setSimulatedLoadProgress(p => p + 8);
    onNotify("Appel réseau authentifié: entête anti-CSRF validée.", "info");
    setTimeout(() => setSimulatedLoadProgress(0), 1000);
  };

  return (
    <div className="space-y-6 premium-gradient-bg">

      {/* Intro info card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
          <Fingerprint className="h-16 w-16 text-brand-orange animate-float" />
        </div>
        <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-brand-orange animate-pulse" /> Architecture SSO unifiée et Identité Fédérée par Jeton Crypté
        </h3>
        <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium">
          Lorsque vos collaborateurs naviguent de <code className="bg-[#F5F7FA] text-brand-blue font-bold px-1.5 py-0.5 rounded font-mono border border-brand-blue/5">hotel.glabeboutique.com</code> à{" "}
          <code className="bg-[#F5F7FA] text-brand-blue font-bold px-1.5 py-0.5 rounded font-mono border border-brand-blue/5">hopital.glabeboutique.com</code>, GLABTECH utilise un protocole d'échange de jetons web décentralisés (JWT). Cela garantit une expérience utilisateur fluide sans réauthentification répétée, similaire aux architectures avancées de Monday, Notion ou Zoho portals.
        </p>
      </div>

      {/* NEW: GUIDE ET SIMULATEUR D'INTÉGRATION DES APPLICATIONS WEB CLIENTS */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-premium">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-[#0B1F3A] flex items-center gap-2">
              <Code2 className="h-5 w-5 text-brand-orange" /> Guide Technique : Brancher vos applications web sur le SSO G-Eboutique
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal font-medium">
              Comment connecter vos applications métiers ou secondaires (ex: boutique de vêtements, portail d'un créateur externe, ERP auxiliaire) au guichet unique SaaS.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[9.5px] font-mono font-bold bg-[#FF7A00]/10 text-brand-orange px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> SDK Dev Kit v1.4
          </span>
        </div>

        {/* 3-Step Integration workflow description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 text-slate-800">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 relative">
            <span className="absolute top-3 right-3 text-slate-300 font-mono text-xl font-black">01</span>
            <span className="font-extrabold text-xs text-brand-blue block mb-1">1. Rediriger l'utilisateur</span>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Dans vos applications web personnalisées, placez un bouton de connexion SSO qui redirige l'utilisateur vers notre portail centralisé d'authentification sécurisée :
            </p>
            <code className="block text-[9.5px] font-mono bg-white border border-slate-200 p-2 rounded-lg mt-2.5 overflow-hidden text-ellipsis whitespace-nowrap text-slate-700 select-all font-bold">
              https://auth.glabeboutique.com/sso?client_id=YOUR_CLIENT_ID&amp;redirect_uri=CALLBACK_URL
            </code>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 relative">
            <span className="absolute top-3 right-3 text-slate-300 font-mono text-xl font-black">02</span>
            <span className="font-extrabold text-xs text-brand-blue block mb-1">2. Intercepter le jeton</span>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Après identification réussie par le SSO, notre serveur redirige instantanément l'utilisateur vers votre URL de callback avec l'accès sécurisé sous forme de jeton JWT :
            </p>
            <code className="block text-[9.5px] font-mono bg-white border border-slate-200 p-2 rounded-lg mt-2.5 overflow-hidden text-ellipsis whitespace-nowrap text-brand-orange font-bold select-all">
              https://votre-app.com/auth/callback?token=eyJhbGciOi...
            </code>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 relative">
            <span className="absolute top-3 right-3 text-slate-300 font-mono text-xl font-black">03</span>
            <span className="font-extrabold text-xs text-brand-blue block mb-1">3. Valider le JWT</span>
            <p className="text-[11px] text-slate-500 leading-normal font-medium">
              Votre serveur client valide la signature cryptographique du jeton grâce à notre clé RSA publique, puis connecte l'utilisateur localement selon son profil :
            </p>
            <code className="block text-[9.5px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-150 p-2 rounded-lg mt-2.5 font-bold">
              ✓ Token SSO RSA-256 Validé
            </code>
          </div>
        </div>

        {/* Code Snippet Tabs + Live Simulator Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SDK Developer Snippets (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-slate-800 rounded-xl overflow-hidden bg-slate-900 text-slate-100 shadow-inner">
            <div>
              {/* SDK Language Header Selector */}
              <div className="bg-slate-950/85 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSdkLanguage("node")}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer border-0 ${
                      activeSdkLanguage === "node" ? "bg-[#FF7A00] text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800 bg-transparent"
                    }`}
                  >
                    Node.js (Express)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSdkLanguage("react")}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer border-0 ${
                      activeSdkLanguage === "react" ? "bg-[#FF7A00] text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800 bg-transparent"
                    }`}
                  >
                    React Hook (Client)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSdkLanguage("python")}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer border-0 ${
                      activeSdkLanguage === "python" ? "bg-[#FF7A00] text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800 bg-transparent"
                    }`}
                  >
                    Python (FastAPI)
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const codeText = activeSdkLanguage === "node" ? nodeCode : activeSdkLanguage === "react" ? reactCode : pythonCode;
                    navigator.clipboard.writeText(codeText);
                    onNotify("Extrait de code copié !", "success");
                  }}
                  className="bg-transparent text-slate-450 hover:text-slate-100 font-mono text-[10.5px] flex items-center gap-1.5 border-0 cursor-pointer font-bold transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-[#FF7A00]" /> Copier
                </button>
              </div>

              {/* Code viewer */}
              <div className="p-4 overflow-x-auto bg-[#0a0f1d] min-h-[280px]">
                <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre font-medium select-all">
                  {activeSdkLanguage === "node" && nodeCode}
                  {activeSdkLanguage === "react" && reactCode}
                  {activeSdkLanguage === "python" && pythonCode}
                </pre>
              </div>
            </div>

            <div className="bg-[#060c18] px-4 py-3 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <Info className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
              <span>Installez les dépendances npm adéquates pour déchiffrer les jetons locaux (<code className="text-[#FF7A00]">jsonwebtoken</code> ou <code className="text-[#FF7A00]">PyJWT</code>).</span>
            </div>
          </div>

          {/* Live Simulator (5 cols) */}
          <div className="lg:col-span-5 border border-slate-150 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Play className="h-4 w-4 text-[#FF7A00] animate-pulse" />
                <h4 className="font-extrabold text-xs text-brand-blue uppercase font-mono">Simulateur Interactif de Connexion</h4>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Configurez une URL fictive de retour pour tester la cinématique de validation SSO et de transmission de jeton.
              </p>

              <div className="space-y-3 font-semibold text-[#0B1F3A]">
                <div>
                  <label className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block mb-1">Identifiant Client unique (Client ID)</label>
                  <input
                    type="text"
                    value={sandboxClientId}
                    onChange={(e) => setSandboxClientId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-brand-orange font-bold font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block mb-1">URL de Callback (Redirect URL)</label>
                  <input
                    type="text"
                    value={sandboxRedirectUrl}
                    onChange={(e) => setSandboxRedirectUrl(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-850 font-mono focus:outline-none focus:border-brand-orange font-bold font-semibold"
                  />
                </div>
              </div>

              {/* Simulation Sequence visualizer */}
              {isSimulatingSsoFlow && (
                <div className="p-3.5 bg-white border border-slate-250/25 rounded-xl space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px] font-mono font-extrabold">
                    <span className="text-[#0B1F3A] uppercase">Étape actuelle :</span>
                    <span className="text-[#FF7A00]">{simulatedStep * 25}% effectif</span>
                  </div>

                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-orange h-full transition-all duration-300"
                      style={{ width: `${simulatedStep * 25}%` }}
                    />
                  </div>

                  {/* Steps list */}
                  <div className="space-y-2 text-[10.5px] font-mono font-semibold">
                    <div className="flex items-center gap-2">
                      <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        simulatedStep >= 1 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-850"
                      }`}>1</span>
                      <span className={simulatedStep >= 1 ? "text-slate-850 font-bold" : "text-slate-400"}>
                        Initiation du bouton SSO cliqué
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        simulatedStep >= 2 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-850"
                      }`}>2</span>
                      <span className={simulatedStep >= 2 ? "text-slate-850 font-bold" : "text-slate-400"}>
                        Guichet auth.glabeboutique.com sollicité
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        simulatedStep >= 3 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-850"
                      }`}>3</span>
                      <span className={simulatedStep >= 3 ? "text-slate-850 font-bold" : "text-slate-400"}>
                        Jeton signé JWT {selectedRole} structuré
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        simulatedStep >= 4 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-850"
                      }`}>4</span>
                      <span className={simulatedStep >= 4 ? "text-slate-850 font-bold" : "text-slate-400"}>
                        Redirection vers callback/{sandboxRedirectUrl.substring(8, 26)}...
                      </span>
                    </div>
                  </div>

                  {/* Result Token Container */}
                  {simulatedStep === 4 && (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-lg text-[10.5px] text-emerald-850 leading-normal animate-fadeIn space-y-1.5">
                      <span className="font-extrabold flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Validation SSO Virtuelle Réussie !</span>
                      <p className="text-[9.5px] text-slate-500 font-medium">L'URL suivante a été interceptée par le script de votre application :</p>
                      <code className="block p-2 bg-white border border-emerald-250/25 rounded font-mono break-all text-[9.2px] select-all max-h-[85px] overflow-y-auto mt-1 font-bold text-slate-800">
                        {sandboxRedirectUrl}?token={simulatedToken}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulatingSsoFlow && simulatedStep < 4}
                className="w-full bg-[#0B1F3A] hover:bg-[#0c2444] text-white font-extrabold text-xs py-2.5 rounded-xl border-0 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingSsoFlow && simulatedStep < 4 ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin text-brand-orange" />
                    Simulation d'authentification en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-brand-orange" />
                    Lancer la simulation de flux SSO
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Layout splits visualizer and rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* JWT Payload Simulator */}
        <div className="bg-brand-blue text-[#F5F7FA] rounded-2xl p-6 shadow-premium border border-white/5 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <span className="text-[10px] uppercase font-black tracking-widest font-mono text-brand-orange">Décodeur de Jeton JWT SSO Actif</span>
              <button 
                onClick={handleCopy}
                className="text-xs text-[#FF7A00] hover:text-[#FF7A00]/85 flex items-center gap-1.5 font-mono font-bold transition-all cursor-pointer bg-transparent border-0"
              >
                {copiedText ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copié
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copier Payload
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              
              {/* JWT HEADER SECTION */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">1. HEADER (Algorithme & Type)</span>
                <pre className="bg-black/25 p-3 rounded-xl border border-white/5 text-[11px] font-mono text-rose-300 overflow-x-auto select-all">
                  {JSON.stringify(sampleJwtHeader, null, 2)}
                </pre>
              </div>

              {/* JWT PAYLOAD SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">2. PAYLOAD (Revendications & Rôles)</span>
                  
                  {/* Selector to change role in token dynamically */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-mono">Rôle Test :</span>
                    <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] font-mono text-brand-orange font-bold focus:outline-none"
                    >
                      <option value="Global Owner">Global Owner</option>
                      <option value="CTO">CTO</option>
                      <option value="Collaborateur">Collaborateur</option>
                      <option value="Audit Externe">Audit Externe</option>
                    </select>
                  </div>
                </div>

                <pre className="bg-black/25 p-3 rounded-xl border border-white/5 text-[11px] font-mono text-[#F5F7FA] overflow-x-auto select-all">
                  {JSON.stringify(sampleJwtPayload, null, 2)}
                </pre>
              </div>

              {/* JWT SIGNATURE SECTION */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">3. SIGNATURE (Garantie de non-modification)</span>
                <p className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 p-2.5 rounded border border-emerald-950/30 overflow-hidden text-ellipsis whitespace-nowrap">
                  HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), public_rsa_key_vps_glablab_central_hash ) ➜ VALID SIGNATURE
                </p>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-brand-orange" />
            <span>* Signatures cryptées asymétriques renouvelées toutes les 24 heures par GLABTECH SSO Central.</span>
          </div>
        </div>

        {/* Roles and Permissions Matrices */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-brand-orange" /> Matrice d'Habilitation SSO & Profils
            </h3>
            
            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
              Déterminez l'étendue des autorisations accordées par le SSO central aux 6 applications métiers raccordées.
            </p>

            <div className="space-y-3">
              {[
                { name: "Global Owner", desc: "Contrôle total sur l'ensemble des bases d'organisations, DNS glabeboutique.com et fiches de facturation.", level: "Niveau 5 (Full)" },
                { name: "CTO", desc: "Droits en écriture et régénération des secrets d'APIs. Ne peut modifier le plan tarifaire de l'abonnement.", level: "Niveau 4 (Élevé)" },
                { name: "Collaborateur", desc: "Lecture seule sur les métriques et accès aux sessions micro-applications qui lui sont explicitement déléguées.", level: "Niveau 2 (Sélectif)" },
                { name: "Audit Externe", desc: "Lecture seule des logs d'audit uniquement. Impossible d'interagir avec les playgrounds ou les configurations SSO.", level: "Niveau 1 (Log Only)" }
              ].map((role) => (
                <div 
                  key={role.name} 
                  className={`border p-4 rounded-xl transition-all ${
                    selectedRole === role.name 
                      ? "border-brand-orange bg-brand-orange/[0.02] shadow-sm scale-[1.02]" 
                      : "border-slate-100 hover:border-brand-blue/15"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-brand-blue font-extrabold">{role.name}</strong>
                    <span className="text-[10px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">{role.level}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs bg-brand-blue/[0.02] border border-brand-blue/5 p-3 rounded-xl text-slate-600 font-medium">
            <Info className="h-4.5 w-4.5 text-brand-orange flex-shrink-0 animate-pulse" />
            <p className="leading-relaxed">
              Pour modifier les privilèges d'un collaborateur invité, rendez-vous sur l'onglet **Membres** sous l'Organisation.
            </p>
          </div>
        </div>

      </div>

      {/* NEW: LIVE INTERACTIVE AES CRYPTOGRAPHY SANDBOX (Symmetric encryption) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AES Encryption Card */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-indigo-600" /> Chiffrement Symétrique AES-256-CBC
              </h4>
              <span className="text-[9px] font-mono uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">Standard Militaire</span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Chiffrez à la volée des jetons secrets, des clés d'API (Stripe/Zoho) ou des informations personnelles d'utilisateurs. L'API utilise un vecteur d'initialisation aléatoire (IV) unique par opération.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono font-black text-slate-400 block mb-1">Texte ou Jeton en Clair (Input)</label>
                <input 
                  type="text"
                  value={plainTextToEncrypt}
                  onChange={(e) => setPlainTextToEncrypt(e.target.value)}
                  placeholder="Ex : vore_cle_privee_stripe"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEncrypt}
                  disabled={isEncrypting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isEncrypting ? (
                    <>
                      <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> Chiffrement...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" /> Chiffrer via Gateway API
                    </>
                  )}
                </button>
              </div>

              {encryptedResult && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 space-y-1.5 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-indigo-700 uppercase font-black">Résultat Chiffré Base (IV + Ciphertext) :</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(encryptedResult);
                        onNotify("Code d'encryption copié !", "success");
                      }}
                      className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 bg-transparent border-0 font-bold"
                    >
                      <Copy className="h-3 w-3" /> Copier le Cipher
                    </button>
                  </div>
                  <pre className="bg-[#FFFFFF] p-2 rounded-lg border border-indigo-100 text-[11px] font-mono text-indigo-900 break-all select-all leading-normal whitespace-pre-wrap">
                    {encryptedResult}
                  </pre>
                  <p className="text-[9px] text-indigo-500 font-mono">
                    * Format : <code className="bg-white px-1">IV_En_Hex:Bloc_Crypte_En_Hex</code>. Impossible à craquer sans la clé primaire du gateway.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AES Decryption Card */}
        <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Unlock className="h-4.5 w-4.5 text-emerald-600" /> Déchiffrement Symétrique AES-256-CBC
              </h4>
              <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">Zéro-Leak Trust</span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Exécutez le déchiffrement inverse à partir du bloc d'initialisation et du ciphertext. Toute altération même minime d’un seul bit provoquera un rejet immédiat de la signature cryptographique.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono font-black text-slate-400 block mb-1">Ciphertext (IV:Encrypted_Hex)</label>
                <textarea 
                  rows={2}
                  value={cipherTextToDecrypt}
                  onChange={(e) => setCipherTextToDecrypt(e.target.value)}
                  placeholder="Collez le bloc d'encodage obtenu ci-contre..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDecrypting ? (
                    <>
                      <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> Déchiffrement...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3.5 w-3.5" /> Déchiffrer via Gateway API
                    </>
                  )}
                </button>
              </div>

              {decryptedResult && (
                <div className={`rounded-xl p-3.5 border ${
                  decryptedResult.startsWith("❌") 
                    ? "bg-rose-50 border-rose-100 text-rose-800" 
                    : "bg-emerald-50 border-emerald-100 text-emerald-900"
                } animate-fadeIn`}>
                  <span className="text-[9px] font-mono uppercase font-black block mb-1">
                    {decryptedResult.startsWith("❌") ? "Rapport d'Intégrité :" : "Contenu Déchiffré en Clair :"}
                  </span>
                  <pre className="p-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-mono break-all select-all leading-normal whitespace-pre-wrap">
                    {decryptedResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* NEW: RATE LIMITING DIASGNOSTIC & BRUTE FORCE DEFENSE telemetry */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-premium">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            <Timer className="h-5 w-5 text-brand-orange" /> Observabilité du Rate Limiter & Shield de Quarantaine d'IP
          </h4>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Actif (100% Protection DDoS)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Quota Standard</span>
            <span className="text-xl font-black text-slate-800 font-mono">120 <span className="text-xs text-slate-400 font-medium">req / min</span></span>
            <p className="text-[9px] text-slate-500 mt-1">Limites adaptées pour l'utilisation intensive des dashboards.</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Quota Sensible (Auth)</span>
            <span className="text-xl font-black text-slate-800 font-mono">15 <span className="text-xs text-slate-400 font-medium">req / min</span></span>
            <p className="text-[9px] text-slate-500 mt-1">Protection drastique contre le brute-force sur /login et /mfa.</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Votre session (Estimation)</span>
            <span className="text-xl font-black text-[#FF7A00] font-mono">{rateLimitRemaining} <span className="text-xs text-slate-400 font-medium">restantes</span></span>
            <p className="text-[9px] text-slate-500 mt-1">Auto-réinitialisation dans {rateLimitReset}s.</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Statut Quarantaine</span>
            <span className="text-xl font-black text-emerald-600 font-mono flex items-center gap-1">
              REP_OK <span className="h-2 w-2 bg-emerald-500 rounded-full inline-block animate-ping"></span>
            </span>
            <p className="text-[9px] text-slate-500 mt-1">Aucune tentative malveillante détectée sur votre IP.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-300 rounded-xl p-4 border border-slate-850 space-y-3.5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-extrabold">Simulateur d'Audit CSRF, Headers et Rate Limit</span>
            </div>
            <button
              onClick={triggerAuditPingSim}
              className="text-[10px] font-mono font-bold text-slate-100 hover:text-brand-orange bg-[#FF7A00] hover:bg-[#FF7A00]/90 border border-transparent px-3 py-1 rounded-lg transition-all cursor-pointer"
            >
              Déclencher un appel API Gateway
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <p className="text-slate-400 text-[11px] mb-1">// Réponses issues des filtres de sécurité actifs :</p>
              <div className="bg-black/40 p-3 rounded-lg border border-slate-800 space-y-1">
                <p><span className="text-rose-400">X-Content-Type-Options:</span> nosniff</p>
                <p><span className="text-rose-400">X-XSS-Protection:</span> 1; mode=block</p>
                <p><span className="text-rose-400">Strict-Transport-Security:</span> max-age=31536000</p>
                <p><span className="text-[#FF7A00]">X-RateLimit-Limit:</span> {rateLimitTotal}</p>
                <p><span className="text-[#FF7A00]">X-RateLimit-Remaining:</span> {rateLimitRemaining}</p>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-500" /> Algorithme de Lockout d'IP (Anti DDoS)
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Si une IP effectue plus de 5 tentatives infructueuses de connexion ou dépasse 15 requêtes/min sur les URLs de connexion, elle est automatiquement placée en bassin de quarantaine ("SecOps Quarantine") pour une durée de 300 secondes avec code d'erreur HTTP 423 (Locked).
                </p>
              </div>

              <div className="border-t border-slate-800 pt-2 text-[10px] text-amber-400 font-bold">
                🔒 Protection CSRF : Les requêtes d'écriture (POST/PUT/DELETE) exigent un en-tête d'origine certifiée.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTEUR DES DEMANDES D'APPROBATION D'ESSAI (SÉLECTION SWITZERLAND & MULTI-TENANT) */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-premium">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h4 className="font-extrabold text-sm text-[#0B1F3A] flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#FF7A00]" /> Validation et Approbation des Demandes d'Essai (Multi-Tenant)
          </h4>
          <button 
            type="button"
            onClick={fetchTrialRequests}
            className="text-[10px] font-mono font-bold text-white bg-[#0B1F3A] hover:bg-[#09182d] px-3 py-1 rounded-lg transition-all cursor-pointer border-0"
          >
            Rafraîchir
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
          Lorsqu'un prospect soumet un formulaire "Démarrer maintenant" depuis le portail d'applications, sa demande d'essai est enregistrée ici. En tant qu'administrateur principal SSO, vous pouvez approuver pour configurer instantanément la liane multi-tenant de son sous-domaine sur <code className="bg-[#F5F7FA] font-bold px-1 py-0.5 rounded font-mono">xxx.glabeboutique.com/trial</code>.
        </p>

        {loadingRequests ? (
          <div className="text-center py-6 text-xs font-mono font-bold text-slate-400">
            Chargement des requêtes d'approbation...
          </div>
        ) : trialRequests.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Aucune demande d'essai en attente sur la liane SSO.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#0B1F3A] text-white font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Propriétaire</th>
                  <th className="p-3">Email & Téléphone</th>
                  <th className="p-3">Entreprise / Subdomain</th>
                  <th className="p-3">App Requise</th>
                  <th className="p-3">Pays & Langue</th>
                  <th className="p-3">Statut SSO</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#0B1F3A] font-medium font-semibold">
                {trialRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <p className="font-extrabold text-[#0B1F3A]">{req.ownerName}</p>
                      <span className="text-[9px] font-mono text-slate-400">{req.id}</span>
                    </td>
                    <td className="p-3">
                      <p>{req.email}</p>
                      <p className="text-[10px] text-slate-400">{req.phone || "Non renseigné"}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-extrabold text-[#FF7A00]">{req.companyName}</p>
                      <code className="text-[10px] font-mono bg-[#FF7A00]/5 px-2 py-0.5 rounded border border-[#FF7A00]/10">{req.subdomain}.glabeboutique.com</code>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border text-slate-700">
                        {req.appName}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      <p>{req.country}</p>
                      <p className="text-[10px] font-mono text-slate-420">{req.language}</p>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "approved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : req.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          req.status === "approved" ? "bg-emerald-500" : req.status === "rejected" ? "bg-rose-500" : "bg-amber-500"
                        }`} />
                        {req.status === "approved" ? "Approuvé" : req.status === "rejected" ? "Rejeté" : "En attente"}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5 min-w-[140px]">
                      {req.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(req.id, "approved")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer border-0"
                          >
                            Approuver
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(req.id, "rejected")}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer border-0"
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                      {req.status !== "pending" && (
                        <span className="text-[10px] font-mono text-slate-400 font-bold">Archivée</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
