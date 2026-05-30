import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  PlusCircle,
  FolderOpen,
  DollarSign,
  Briefcase,
  Layers,
  Activity,
  Plus,
  Laptop
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import { PortalUser, ManagedApp, SecurityLog, SystemMetric, ChatMessage, CustomWorkflow } from "./types";
import DashboardTab from "./components/DashboardTab";
import AppsTab from "./components/AppsTab";
import OrgTab from "./components/OrgTab";
import SsoTab from "./components/SsoTab";
import LogsTab from "./components/LogsTab";
import CopilotDrawer from "./components/CopilotDrawer";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import { 
  OrganizationsTab, 
  BillingTab, 
  UsersTab, 
  AnalyticsTab, 
  NotificationsTab, 
  SettingsTab, 
  SupportTab,
  TenantData,
  ApprovalsTab
} from "./components/ExtraTabs";

export default function App() {
  // Current logged in user (with custom role simulator)
  const [user, setUser] = useState<PortalUser>({
    id: "user-glab-gildas",
    name: "Anges Gildas",
    email: "anges.gildas@gmail.com",
    role: "Global Owner",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    tenant: "GLABTECH HQ (Europe)",
    department: "Directoire Général",
    mfaEnabled: true,
    lastLogin: new Date().toISOString()
  });

  // Comprehensive multi-tenant system state
  const [tenants, setTenants] = useState<Record<string, TenantData>>({
    "GLABTECH HQ (Europe)": {
      databaseName: "db-cl_prod_par",
      region: "Paris (AWS-eu-west-3)",
      securityLevel: "Maximal (RSA-4096)",
      autoBackups: true,
      allowedApps: ["glab-aistudio-connector", "glab-hotel", "glab-resto", "glab-erp", "glab-crm", "glab-market", "glab-travel", "glab-hopital", "glab-ecommerce", "glab-school", "glab-gazolplus", "glab-trustfinance", "glab-comptabilite", "glab-rhsysteme"],
      plan: "Enterprise Premium",
      price: 349,
      seatsUsed: 14,
      seatsMax: 100,
      stripeConnected: true,
      stripeApiKey: "pk_test_51Mz9HQ_HQ_EUROPE_KEY",
      invoices: [
        { date: "27 Mai 2026", user: "anges.gildas@gmail.com", plan: "Enterprise Premium", price: 349.00, ref: "stripe_sso_88b1f7e02ad6" },
        { date: "27 Avril 2026", user: "anges.gildas@gmail.com", plan: "Enterprise Premium", price: 349.00, ref: "stripe_sso_77f1e6b3c92a" }
      ],
      users: [
        { id: "usr-gildas", name: "Anges Gildas", email: "anges.gildas@gmail.com", role: "Global Owner", status: "actif", lastLogin: "A l'instant", permissions: ["apps", "billing", "users", "settings"] },
        { id: "usr-1", name: "Glabtech Admin", email: "glabtech1@gmail.com", role: "Global Owner", status: "actif", lastLogin: "Y a 2 mins", permissions: ["apps", "billing", "users", "settings"] },
        { id: "usr-2", name: "Marc Lefèvre", email: "m.lefevre@glab.com", role: "CTO Developer", status: "actif", lastLogin: "Y a 20 mins", permissions: ["apps", "settings"] },
        { id: "usr-3", name: "Sophie Dupont", email: "s.dupont@glab.com", role: "Finance Admin", status: "actif", lastLogin: "Y a 3 heures", permissions: ["billing"] },
        { id: "usr-4", name: "Cécile Girard", email: "c.girard@glab.com", role: "HR Manager", status: "invité", lastLogin: "-", permissions: ["apps"] },
      ]
    },
    "GLABTECH North America": {
      databaseName: "db-cl_prod_nyc",
      region: "New-York (GCP-us-east1)",
      securityLevel: "Standard (HMAC-256)",
      autoBackups: false,
      allowedApps: ["glab-aistudio-connector", "glab-erp", "glab-crm", "glab-market", "glab-trustfinance", "glab-comptabilite", "glab-rhsysteme"],
      plan: "Business Suite",
      price: 99,
      seatsUsed: 3,
      seatsMax: 20,
      stripeConnected: true,
      stripeApiKey: "pk_test_51Mz9HQ_US_NORTHAM_KEY",
      invoices: [
        { date: "20 Mai 2026", user: "john.doe@glabtech-us.com", plan: "Business Suite", price: 99.00, ref: "stripe_sso_11e2f8c9d2bf" }
      ],
      users: [
        { id: "usr-201", name: "John Doe", email: "john.doe@glabtech-us.com", role: "Global Owner", status: "actif", lastLogin: "Y a 1 jour", permissions: ["apps", "billing", "users", "settings"] },
        { id: "usr-202", name: "Sarah Miller", email: "sarah.m@glabtech-us.com", role: "CTO Developer", status: "actif", lastLogin: "Y a 10 mins", permissions: ["apps"] },
        { id: "usr-203", name: "Bob Harris", email: "bob.fin@glabtech-us.com", role: "Finance Admin", status: "invité", lastLogin: "-", permissions: ["billing"] },
      ]
    },
    "GLABTECH Global Corp": {
      databaseName: "db-cl_global_sing",
      region: "Singapour (AWS-ap-southeast-1)",
      securityLevel: "Premium (RSA-2048)",
      autoBackups: true,
      allowedApps: ["glab-aistudio-connector", "glab-hotel", "glab-resto", "glab-erp", "glab-crm", "glab-market", "glab-travel", "glab-hopital", "glab-ecommerce", "glab-school", "glab-gazolplus", "glab-trustfinance", "glab-comptabilite", "glab-rhsysteme"],
      plan: "Enterprise Premium",
      price: 349,
      seatsUsed: 2,
      seatsMax: 100,
      stripeConnected: false,
      stripeApiKey: "",
      invoices: [],
      users: [
        { id: "usr-301", name: "CEO Singapore", email: "ceo.sing@glabtech-global.com", role: "Global Owner", status: "actif", lastLogin: "Y a 4 heures", permissions: ["apps", "billing", "users", "settings"] },
        { id: "usr-302", name: "Dev System", email: "dev.sys@glabtech-global.com", role: "CTO Developer", status: "actif", lastLogin: "Y a 1 heure", permissions: ["apps", "settings"] },
      ]
    },
    "Sandbox Testing Lab": {
      databaseName: "db-cl_sandbox_lnd",
      region: "London (GCP-europe-west2)",
      securityLevel: "Standard (HMAC-256)",
      autoBackups: false,
      allowedApps: ["glab-aistudio-connector", "glab-hotel", "glab-resto", "glab-gazolplus"],
      plan: "Starter Sandbox",
      price: 0,
      seatsUsed: 2,
      seatsMax: 10,
      stripeConnected: false,
      stripeApiKey: "",
      invoices: [],
      users: [
        { id: "usr-401", name: "Sandbox Tester", email: "sandbox.owner@glabeboutique.com", role: "Global Owner", status: "actif", lastLogin: "A l'instant", permissions: ["apps", "billing", "users", "settings"] },
        { id: "usr-402", name: "Guest Client", email: "guest.tester@glabeboutique.com", role: "Guest Client", status: "actif", lastLogin: "Y a 5 jours", permissions: ["apps"] },
      ]
    }
  });

  // Portal State
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register">("login");
  const [currentTab, setTab] = useState<string>("dashboard");
  const [apps, setApps] = useState<ManagedApp[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [workflows, setWorkflows] = useState<CustomWorkflow[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric>({
    timestamp: new Date().toISOString(),
    cpu: 12,
    memory: 2.7,
    networkIn: 240,
    networkOut: 650,
    apiLatency: 18
  });

  // UI state variables
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Modal to add application
  const [addAppModalOpen, setAddAppModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [newAppDesc, setNewAppDesc] = useState("");
  const [newAppCat, setNewAppCat] = useState("Custom");
  const [newAppUrl, setNewAppUrl] = useState("");
  const [newAppVer, setNewAppVer] = useState("v1.0.0");
  const [newAppIcon, setNewAppIcon] = useState("Layers");

  // Modal to add custom automation workflow
  const [addWorkflowModalOpen, setAddWorkflowModalOpen] = useState(false);
  const [wfName, setWfName] = useState("");
  const [wfDesc, setWfDesc] = useState("");
  const [wfTriggerApp, setWfTriggerApp] = useState("glab-hotel");
  const [wfTriggerEvent, setWfTriggerEvent] = useState("Création dossier patient");
  const [wfTargetApp, setWfTargetApp] = useState("glab-erp");
  const [wfTargetAction, setWfTargetAction] = useState("Générer fiche comptable tiers");

  // Fetch status message or operation notifications
  const [globalNotification, setGlobalNotification] = useState<{message: string, type: 'success' | 'warn' | 'info'} | null>(null);

  // Periodically poll backend for metrics, apps, logs and workflows
  const fetchApps = async () => {
    try {
      const res = await fetch("/api/apps");
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        setApps(data);
      } else {
        console.warn("fetchApps: Non-JSON response or invalid status", res.status);
      }
    } catch (e) {
      console.warn("fetchApps silent retry warning:", e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        setLogs(data);
      } else {
        console.warn("fetchLogs: Non-JSON response or invalid status", res.status);
      }
    } catch (e) {
      console.warn("fetchLogs silent retry warning:", e);
    }
  };

  const fetchWorkflows = async () => {
    try {
      const res = await fetch("/api/workflows");
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        setWorkflows(data);
      } else {
        console.warn("fetchWorkflows: Non-JSON response or invalid status", res.status);
      }
    } catch (e) {
      console.warn("fetchWorkflows silent retry warning:", e);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/metrics");
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        setMetrics(data);
      } else {
        console.warn("fetchMetrics: Non-JSON response or invalid status", res.status);
      }
    } catch (e) {
      console.warn("fetchMetrics silent retry warning:", e);
    }
  };

  // Initial load & Polling Intervals
  useEffect(() => {
    fetchApps();
    fetchLogs();
    fetchWorkflows();
    fetchMetrics();

    const appInterval = setInterval(fetchApps, 12000);
    const logsInterval = setInterval(fetchLogs, 15000);
    const metricsInterval = setInterval(fetchMetrics, 5000);

    // Initial greeting in Copilot chat
    setChatMessages([
      {
        id: "init",
        role: "model",
        text: "Bonjour ! Je suis le Copilote Intelligent GLABTECH. Je supervise les six microservices (hotel, resto, crm, erp, market, hopital) connectés à glabeboutique.com.\n\nQuelle opération d'audit, de synchronisation Postgres ou de configuration d'automatisme inter-tenant souhaitez-vous effectuer ?",
        timestamp: new Date().toISOString()
      }
    ]);

    return () => {
      clearInterval(appInterval);
      clearInterval(logsInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  // Helper trigger notification
  const showNotification = (msg: string, type: 'success' | 'warn' | 'info' = 'success') => {
    setGlobalNotification({ message: msg, type });
    setTimeout(() => {
      setGlobalNotification(null);
    }, 4500);
  };

  // Handler: Add Application
  const handleAddAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    try {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAppName,
          description: newAppDesc,
          category: newAppCat,
          url: newAppUrl,
          version: newAppVer,
          icon: newAppIcon
        })
      });

      if (res.ok) {
        await res.json();
        fetchApps();
        fetchLogs();
        setAddAppModalOpen(false);
        showNotification(`L'application unifiée '${newAppName}' a été intégrée sous SSO.`, 'success');
        
        // Reset fields
        setNewAppName("");
        setNewAppDesc("");
        setNewAppCat("Custom");
        setNewAppUrl("");
        setNewAppVer("v1.0.0");
        setNewAppIcon("Layers");
      }
    } catch (err) {
      showNotification("Erreur de communication avec le serveur principal.", "warn");
    }
  };

  // Handler: Add Workflow Automation
  const handleAddWorkflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName.trim()) return;

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wfName,
          description: wfDesc,
          triggerApp: wfTriggerApp,
          triggerEvent: wfTriggerEvent,
          targetApp: wfTargetApp,
          targetAction: wfTargetAction
        })
      });

      if (res.ok) {
        await res.json();
        fetchWorkflows();
        fetchLogs();
        setAddWorkflowModalOpen(false);
        showNotification(`Liaison '${wfName}' activée avec succès !`, 'success');
        
        setWfName("");
        setWfDesc("");
      }
    } catch (err) {
      showNotification("Impossible de créer le pont de communication réseau.", "warn");
    }
  };

  // Handler: Toggle workflow active state
  const handleToggleWorkflow = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/toggle`, { method: "POST" });
      if (res.ok) {
        const item = await res.json();
        fetchWorkflows();
        showNotification(`Le pont intelligent '${name}' est maintenant ${item.active ? 'activé' : 'désactivé'}.`, 'info');
      }
    } catch (e) {
      showNotification("Erreur d'infrastructure réseau.", "warn");
    }
  };

  // Handler: Regenerate SSO credentials for an app
  const handleRegenSso = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/apps/${id}/sso-regen`, { method: "POST" });
      if (res.ok) {
        await res.json();
        fetchApps();
        fetchLogs();
        showNotification(`Secret d'authentification SSO régénéré pour ${name}.`, 'success');
      }
    } catch (e) {
      console.warn("handleRegenSso error", e);
    }
  };

  // Handler: Manual sync request (simulates ping latency test & resets status)
  const handleSyncApp = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/apps/${id}/sync`, { method: "POST" });
      if (res.ok) {
        await res.json();
        fetchApps();
        fetchLogs();
        showNotification(`Diagnostic réseau OK pour ${name}. Code de retour synchronisé.`, 'success');
      }
    } catch (e) {
      console.warn("handleSyncApp error", e);
    }
  };

  // Handler: Modify live sandbox record counts (+/- employees, billing lines, clients etc)
  const handleAdjustRecords = async (id: string, name: string, amount: number) => {
    try {
      const res = await fetch(`/api/apps/${id}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      if (res.ok) {
        await res.json();
        fetchApps();
        showNotification(`Enregistrement mis à jour pour ${name} (${amount > 0 ? '+' : ''}${amount}).`, 'success');
      }
    } catch (e) {
      console.warn("handleAdjustRecords error", e);
    }
  };

  // Copilot Agent chat handler
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || newMsg;
    if (!textToSend.trim() || isSendingMsg) return;

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...chatMessages, userMessage];
    setChatMessages(updatedHistory);
    setNewMsg("");
    setIsSendingMsg(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedHistory })
      });

      if (res.ok) {
        const reply = await res.json();
        setChatMessages(prev => [
          ...prev, 
          {
            id: `back-${Date.now()}`,
            role: "model",
            text: reply.text || "Pardon, je n'ai pas pu compiler de réponse pour le moment.",
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        throw new Error("HTTP reply non optimal.");
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          text: "⚠️ Erreur réseau ou Service IA indisponible. Nous appliquons nos diagnostics intégrés d'architectures SaaS : vos six applications sont connectées et les jetons d'identité JWT unifiés garantissent la fluidité d'automatisation.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: "init",
        role: "model",
        text: "Historique réinitialisé. Je suis de nouveau à votre service pour superviser l'écosystème Glablab.",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const erpApp = apps.find(a => a.id === "glab-erp");
  const isErpHighLatency = erpApp && erpApp.ping > 100;

  if (showLanding) {
    return (
      <LandingPage 
        onEnterApp={(mode) => {
          setAuthInitialMode(mode || "login");
          setShowLanding(false);
        }} 
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthPage 
        initialMode={authInitialMode}
        onAuthSuccess={(authedUser) => {
          setUser(authedUser);
          setIsAuthenticated(true);
        }}
        onBackToLanding={() => setShowLanding(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Notification toast */}
      {globalNotification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-slate-900 border border-slate-800 text-white shadow-2xl rounded-xl p-4 flex items-start gap-3 animate-motion-in">
          <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 animate-ping" />
          <div className="flex-1">
            <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Signal Portail</p>
            <p className="text-xs text-slate-200 mt-0.5 font-medium leading-normal">{globalNotification.message}</p>
          </div>
          <button 
            onClick={() => setGlobalNotification(null)} 
            className="text-slate-400 hover:text-white ml-auto"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          setTab={setTab} 
          user={user} 
          setUser={setUser}
          onOpenAi={() => setIsCopilotOpen(true)}
          onLogout={() => {
            setIsAuthenticated(false);
            setShowLanding(true);
            showNotification("Déconnexion SSO sécurisée accomplie avec révocation instantanée du JWT.", "success");
          }}
        />

        {/* Dynamic Client Stage Viewport */}
        <main className="flex-1 lg:pl-72 min-h-screen transition-all pb-16">
          
          {/* Header Banner */}
          <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-30 justify-between items-center bg-white/95 backdrop-blur">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                  SaaS Unified Console
                </span>
                <span className="text-xs text-slate-350">•</span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  🌐 Domaine Principal : glabeboutique.com
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 mt-1">
                {currentTab === "dashboard" && "Console Centrale Intelligence d'Entreprise"}
                {currentTab === "apps" && "Régies de vos Microservices Multi-Applications"}
                {currentTab === "sso" && "Passerelle SSO & Directives d'Identité JWT"}
                {currentTab === "logs" && "Centre d'Audit SecOps & Conformité"}
              </h2>
            </div>

            {/* Quick Actions Header Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLanding(true)}
                className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
                title="Page d'accueil SaaS"
              >
                <Laptop className="h-3.5 w-3.5 text-slate-400" />
                <span>Page d'accueil SaaS</span>
              </button>

              <button
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-950 to-emerald-950 hover:from-slate-900 hover:to-emerald-900 text-white px-4 py-2.5 rounded-lg text-xs font-extrabold shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-450 animate-pulse" />
                <span>Copilote IA</span>
              </button>

              <button
                onClick={() => {
                  fetchApps();
                  fetchLogs();
                  fetchWorkflows();
                  fetchMetrics();
                  showNotification("Actualisation en direct de l'ensemble de glabeboutique.com accomplie.", "info");
                }}
                className="p-2.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                title="Synchroniser"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Subheader multi-tenant SSO claims state */}
          <div className="bg-slate-950 text-slate-350 text-[11px] px-6 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Tenant : <strong className="text-white">Isolé logiquement par ID d'organisation</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Raccordement SSO : <strong>PRISMA & SUPABASE JWT VALIDES</strong></span>
              <span className="text-slate-700">|</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] font-mono border border-slate-800 text-emerald-400">
                Tenant: {user.tenant}
              </span>
            </div>
          </div>

          <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* Warning diagnostic banner for high ERP latency */}
            {isErpHighLatency && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-750 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">Alerte de Connectivité - erp.glabeboutique.com</h4>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Le noyau ERP signale une latence de ping anormale de ({erpApp.ping}ms). Les transactions stockées de facturation s'exécutent normalement via le SSO mais nous vous suggérons de demander à notre Copilote IA d'exécuter un diagnostic système rapide.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsCopilotOpen(true);
                    handleSendChat("Fais-moi un rapport détaillé sur l'anomalie de connexion de l'ERP erp.glabeboutique.com et des résolutions recommandées.");
                  }}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-bold font-mono transition-all cursor-pointer whitespace-nowrap"
                >
                  Diagnostic IA
                </button>
              </div>
            )}

            {/* ========================================================
               TAB 1: GLOBAL TABLEAU DE BORD
               ======================================================== */}
            {currentTab === "dashboard" && (
              <DashboardTab 
                apps={apps}
                metrics={metrics}
                workflows={workflows}
                logs={logs}
                onAdjustRecords={handleAdjustRecords}
                onToggleWorkflow={handleToggleWorkflow}
                onOpenWorkflowModal={() => setAddWorkflowModalOpen(true)}
                onOpenAi={() => setIsCopilotOpen(true)}
                changeTab={setTab}
              />
            )}

            {/* ========================================================
               TAB 2: REGIE D'APPLICATIONS (hotel, resto, crm, etc)
               ======================================================== */}
            {currentTab === "apps" && (
              <AppsTab 
                apps={apps}
                onRegenSso={handleRegenSso}
                onSyncApp={handleSyncApp}
                onOpenAddAppModal={() => setAddAppModalOpen(true)}
                allowedApps={tenants[user.tenant]?.allowedApps}
                onNotify={showNotification}
              />
            )}

            {/* ========================================================
               TAB 3: ORGANISATIONS ET ABONNEMENTS
               ======================================================== */}
            {currentTab === "organizations" && (
              <OrganizationsTab 
                user={user}
                setUser={setUser}
                tenants={tenants}
                setTenants={setTenants}
                apps={apps}
                onSyncApp={handleSyncApp}
                onNotify={showNotification}
              />
            )}

            {/* ========================================================
               TAB 4: CYCLE DE FACTURATION & STRIPE
               ======================================================== */}
            {currentTab === "billing" && (
              <BillingTab 
                user={user}
                tenants={tenants}
                setTenants={setTenants}
                onNotify={showNotification}
              />
            )}

            {/* ========================================================
               TAB 5: USERS & ROLES
               ======================================================== */}
            {currentTab === "users" && (
              <UsersTab 
                user={user}
                tenants={tenants}
                setTenants={setTenants}
                onNotify={showNotification}
              />
            )}

            {/* ========================================================
               TAB 6: ANALYTICS & MONITORING
               ======================================================== */}
            {currentTab === "analytics" && (
              <AnalyticsTab metrics={metrics} apps={apps} />
            )}

            {/* ========================================================
               TAB 7: NOTIFICATIONS SECOPS
               ======================================================== */}
            {currentTab === "notifications" && (
              <NotificationsTab user={user} onNotify={showNotification} />
            )}

            {/* ========================================================
               TAB 8: PARAMETRES & DISPOSITIFS RSA
               ======================================================== */}
            {currentTab === "settings" && (
              <SettingsTab user={user} setUser={setUser} onNotify={showNotification} />
            )}

            {/* ========================================================
               TAB 9: SUPPORT VIP & IA
               ======================================================== */}
            {currentTab === "support" && (
              <SupportTab />
            )}

            {/* ========================================================
               TAB 10: APPROBATIONS & LICENCES (CLIENTS)
               ======================================================== */}
            {currentTab === "approvals" && (
              <ApprovalsTab 
                user={user}
                tenants={tenants}
                setTenants={setTenants}
                apps={apps}
                onNotify={showNotification}
              />
            )}

          </div>
        </main>
      </div>

      {/* Interactive side copilot agent */}
      <CopilotDrawer 
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        messages={chatMessages}
        newMsg={newMsg}
        setNewMsg={setNewMsg}
        onSend={handleSendChat}
        isSending={isSendingMsg}
        onClear={handleClearChat}
      />

      {/* ========================================================
         MODAL: ADD NEW MANAGED APPLICATION
         ======================================================== */}
      {addAppModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-motion-in">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <PlusCircle className="h-4.5 w-4.5 text-emerald-450" /> Enregistrer un sous-domaine
              </h3>
              <button 
                onClick={() => setAddAppModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAppSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nom du service unifié *</label>
                <input 
                  type="text" 
                  placeholder="Ex : Glab Market Sync"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Descriptif fonctionnel</label>
                <textarea 
                  placeholder="Décrivez l'intégration ou les APIs hébergées..."
                  value={newAppDesc}
                  onChange={(e) => setNewAppDesc(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 h-16 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Catégorie SSO</label>
                  <select 
                    value={newAppCat}
                    onChange={(e) => setNewAppCat(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="HRM">HRM</option>
                    <option value="Finance">Finance</option>
                    <option value="CRM">CRM</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Icône Métier</label>
                  <select 
                    value={newAppIcon}
                    onChange={(e) => setNewAppIcon(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Building">Bâtiment / Hôtel</option>
                    <option value="Layers">Couches / POS</option>
                    <option value="Briefcase">Mallette / CRM</option>
                    <option value="Database">Données / ERP</option>
                    <option value="DollarSign">Devises / Market</option>
                    <option value="Users">Utilisateurs / Hôpital</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Fédération DNS (Subdomain URL) *</label>
                <input 
                  type="text" 
                  placeholder="Ex : https://market.glabeboutique.com"
                  required
                  value={newAppUrl}
                  onChange={(e) => setNewAppUrl(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setAddAppModalOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sauvegarder l'intégration
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================
         MODAL: ADD NEW CUSTOM BACKEND WORKFLOW LIAISON
         ======================================================== */}
      {addWorkflowModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-motion-in">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                Planifier un automatisme G-Link
              </h3>
              <button 
                onClick={() => setAddWorkflowModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddWorkflowSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Nom du workflow</label>
                <input 
                  type="text" 
                  placeholder="Ex : Facturation automatique Resto ➜ ERP"
                  required
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Règle de propagation d'événements</label>
                <textarea 
                  placeholder="Décrivez l'action déclenchée à travers les APIs..."
                  value={wfDesc}
                  onChange={(e) => setWfDesc(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 h-16 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Service Émetteur</label>
                  <select 
                    value={wfTriggerApp}
                    onChange={(e) => setWfTriggerApp(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    {apps.map(a => <option key={a.id} value={a.id}>{a.name.split(" ")[1] || a.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Service Récepteur</label>
                  <select 
                    value={wfTargetApp}
                    onChange={(e) => setWfTargetApp(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    {apps.map(a => <option key={a.id} value={a.id}>{a.name.split(" ")[1] || a.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setAddWorkflowModalOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-4 py-2"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Activer le workflow G-Link
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
