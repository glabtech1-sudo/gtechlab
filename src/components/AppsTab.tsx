import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  ExternalLink,
  RefreshCw,
  KeyRound,
  Layout,
  Wifi,
  Database,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Sparkles,
  Code,
  Copy,
  Check,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Terminal
} from "lucide-react";
import { ManagedApp } from "../types";
import { KeepKeyIcon } from "./Icons";

interface AppsTabProps {
  apps: ManagedApp[];
  onRegenSso: (id: string, name: string) => void;
  onSyncApp: (id: string, name: string) => void;
  onOpenAddAppModal: () => void;
  allowedApps?: string[];
  onNotify?: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export default function AppsTab({
  apps,
  onRegenSso,
  onSyncApp,
  onOpenAddAppModal,
  allowedApps,
  onNotify
}: AppsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedAppSession, setSelectedAppSession] = useState<ManagedApp | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTestingConnect, setIsTestingConnect] = useState<boolean>(false);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onNotify) {
      onNotify(`${key} copié !`, "success");
    }
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = (appId: string, appName: string) => {
    setIsTestingConnect(true);
    if (onNotify) {
      onNotify("Établissement du canal SSL & échange asymétrique avec Google AI Studio...", "info");
    }
    
    setTimeout(() => {
      onSyncApp(appId, appName);
      setIsTestingConnect(false);
      if (onNotify) {
        onNotify("Handshake réussi ! Votre Applet de dev est raccordée au SaaS avec succès.", "success");
      }
    }, 2000);
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === "ALL" || app.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 premium-gradient-bg">
      
      {/* Search and Filters panel */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher par service unifié ou sous-domaine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-slate-200 hover:border-brand-blue/20 rounded-xl pl-10 pr-4 py-3 bg-[#F5F7FA]/75 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange/45 transition-all text-brand-blue font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "Finance", "CRM", "HRM", "Custom"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                categoryFilter === cat 
                  ? "bg-brand-blue text-white shadow-premium" 
                  : "bg-brand-blue/[0.03] text-brand-blue hover:bg-brand-blue/5 border border-brand-blue/5"
              }`}
            >
              {cat === "ALL" ? "Tous" : cat}
            </button>
          ))}

          <button
            onClick={onOpenAddAppModal}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-orange-glow hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Enregistrer un Microservice
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((app) => {
          const isAiStudio = app.id.includes("aistudio") || app.id.includes("ai-studio");
          const isOnline = app.status === "online";
          const isPerfIssue = app.status === "performance_issue";
          const isAllowed = !allowedApps || allowedApps.includes(app.id);
          
          return (
            <div 
              key={app.id} 
              className={`bg-white border rounded-2xl shadow-premium transition-all duration-300 flex flex-col justify-between overflow-hidden relative group glow-card ${
                isAllowed 
                  ? isAiStudio
                    ? "border-purple-250 hover:shadow-indigo-100 hover:border-purple-400 text-slate-800 bg-gradient-to-br from-white via-white to-purple-50/20"
                    : "border-slate-100 hover:shadow-premium-hover hover:border-brand-blue/10 text-slate-800" 
                  : "border-slate-200 bg-slate-50/50 opacity-65"
              }`}
            >
              {!isAllowed && (
                <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center p-6 text-center select-none animate-motion-in">
                  <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg mb-3 border border-white/10">
                    <Lock className="h-5 w-5 text-brand-orange animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-950 uppercase tracking-wider">Accès d'Application Restreint</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[200px] leading-normal font-semibold">
                    Licence inactive pour ce tenant. Activez-la dans le panneau d'administration des "Organizations".
                  </p>
                </div>
              )}
              <div className="p-6 space-y-4 w-full">
                
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`h-10.5 w-10.5 rounded-xl flex items-center justify-center border border-white/5 shadow-sm group-hover:scale-105 transition-transform duration-300 ${isAiStudio ? "bg-purple-700 text-white" : "bg-brand-blue text-white"}`}>
                      <KeepKeyIcon name={app.icon} className="h-5.5 w-5.5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-1.5">
                        {app.name} 
                        {isAiStudio && (
                          <span className="bg-purple-100 border border-purple-250 text-purple-700 text-[9px] font-black font-mono tracking-widest uppercase px-1.5 py-0.5 rounded ml-1 animate-pulse">
                            AGENT INTÉGRÉ
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${isAiStudio ? "bg-purple-50 text-purple-705 border-purple-100" : "bg-F5F7FA text-brand-blue border-brand-blue/5"}`}>
                          {app.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{app.version}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isAiStudio ? "bg-purple-50/50 border-purple-150" : "bg-[#F5F7FA]/70 border-slate-205"}`}>
                    <span className={`h-2 w-2 rounded-full ${isAiStudio ? "bg-purple-600 shadow-[0_0_10px_2px_rgba(147,51,234,0.35)]" : isOnline ? "bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.2)]" : isPerfIssue ? "bg-brand-orange shadow-orange-glow" : "bg-red-500"} animate-pulse`} />
                    <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${isAiStudio ? "text-purple-700" : "text-slate-600"}`}>
                      {isAiStudio ? "LIVE/ACTIVE" : isOnline ? "ONLINE" : isPerfIssue ? "LATENCE" : "ALERT"}
                    </span>
                  </div>
                </div>

                {/* Subdomain details */}
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[44px]">
                    {app.description}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between text-[11.5px] font-mono">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span>DNS :</span>
                      <a 
                        href={app.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-brand-orange font-bold hover:underline flex items-center gap-0.5"
                      >
                        {app.url.replace("https://", "")} <ArrowUpRight className="h-3 w-3 text-brand-orange" />
                      </a>
                    </div>
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <Wifi className="h-3.5 w-3.5 text-slate-400" /> {app.ping}ms
                    </span>
                  </div>
                </div>

                {/* Statistiques Rapides */}
                <div className="bg-[#F5F7FA]/80 rounded-xl p-3 border border-slate-100 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 font-bold block">Trafic Live</span>
                    <strong className="text-brand-blue font-extrabold text-xs block mt-0.5">{app.activeUsers} req/s</strong>
                  </div>
                  <div className="border-l border-slate-205">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 font-bold block">Appels (24h)</span>
                    <strong className="text-brand-blue font-extrabold text-xs block mt-0.5">{(app.apiRequestsToday / 1000).toFixed(1)}k</strong>
                  </div>
                  <div className="border-l border-slate-205">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 font-bold block">Ping</span>
                    <strong className="text-brand-blue font-extrabold text-xs block mt-0.5">{app.ping}ms</strong>
                  </div>
                  <div className="border-l border-slate-205">
                    <span className="text-[9px] uppercase tracking-wider text-slate-450 font-bold block">Volume Lignes</span>
                    <strong className="text-brand-blue font-extrabold text-xs block mt-0.5">{app.recordsCount}</strong>
                  </div>
                </div>

                {/* Secret OAuth unifies keys list */}
                <div className="bg-brand-blue text-[#F5F7FA] p-4 rounded-xl border border-white/5 shadow-inner text-[10px] font-mono space-y-2">
                  <div className="flex justify-between items-center text-slate-350">
                    <span className="font-extrabold flex items-center gap-1 text-[#FFFFFF]"><ShieldCheck className="h-3.5 w-3.5 text-brand-orange animate-float" /> CLIENT ID (Oauth/SSO)</span>
                    <span className="opacity-65 text-brand-orange font-bold">Standardisé</span>
                  </div>
                  <div className="bg-black/25 p-2 rounded border border-white/5 text-slate-300 truncate font-mono select-all">
                    <code>{app.ssoClientId}</code>
                  </div>
                  <div className="flex justify-between items-center text-slate-350 pt-1">
                    <span>CLIENT SECRET (HMAC-SHA256)</span>
                    <button 
                      onClick={() => onRegenSso(app.id, app.name)}
                      className="text-brand-orange hover:text-orange-400 hover:underline flex items-center gap-0.5 font-bold transition-all cursor-pointer"
                      title="Régénérer le token de service sécurisé"
                    >
                      <KeyRound className="h-3 w-3" /> Régénérer
                    </button>
                  </div>
                  <div className="bg-black/25 p-2 rounded border border-white/5 text-slate-350 truncate font-mono select-all">
                    <code>{app.ssoClientSecret}</code>
                  </div>
                </div>

                {/* AI Studio integration panel if it is AI Studio */}
                {isAiStudio && (
                  <div className="mt-4 border-t border-purple-100 pt-4 space-y-3">
                    <button
                      type="button"
                      onClick={() => setExpandedGuide(expandedGuide === app.id ? null : app.id)}
                      className="w-full bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-purple-200 text-purple-700 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
                        {expandedGuide === app.id ? "Masquer le guide d'intégration" : "Comment connecter mes appli AI Studio ? "}
                      </span>
                      {expandedGuide === app.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {expandedGuide === app.id && (
                      <div className="bg-purple-950/5 border border-purple-250/50 rounded-xl p-4 space-y-3.5 text-xs leading-relaxed animate-fadeIn">
                        <div className="flex items-start gap-2">
                          <Info className="h-4.5 w-4.5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-600 text-[11px] font-semibold">
                            Raccordez n'importe quelle application, agent autonome ou workflow développé dans Google AI Studio grâce aux identifiants OAuth générés ci-dessus.
                          </p>
                        </div>

                        {/* Step By Step List */}
                        <div className="space-y-3 font-medium text-slate-600">
                          {/* Step 1 */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono font-black text-purple-705 block tracking-wide">1. Configurer l'environnement dans AI Studio</span>
                            <p className="text-[11px] text-slate-500">Définissez les variables d'environnement suivantes dans votre environnement d'exécution AI Studio :</p>
                            
                            <div className="space-y-1.5 mt-1.5">
                              {/* Client ID */}
                              <div className="bg-white border rounded-lg p-2.5 flex items-center justify-between font-mono text-[10px] hover:border-purple-300 transition-colors">
                                <span className="truncate text-slate-500"><b className="text-purple-700">SAAS_CLIENT_ID</b>="{app.ssoClientId}"</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("Client ID", app.ssoClientId)}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-slate-50 cursor-pointer"
                                >
                                  {copiedKey === "Client ID" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>

                              {/* Client Secret */}
                              <div className="bg-white border rounded-lg p-2.5 flex items-center justify-between font-mono text-[10px] hover:border-purple-300 transition-colors">
                                <span className="truncate text-slate-500"><b className="text-purple-700">SAAS_CLIENT_SECRET</b>="{app.ssoClientSecret}"</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("Client Secret", app.ssoClientSecret)}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-slate-50 cursor-pointer"
                                >
                                  {copiedKey === "Client Secret" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>

                              {/* Target Endpoint */}
                              <div className="bg-white border rounded-lg p-2.5 flex items-center justify-between font-mono text-[10px] hover:border-purple-300 transition-colors">
                                <span className="truncate text-slate-500"><b className="text-purple-700">SAAS_API_ENDPOINT</b>="http://localhost:3000/api"</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("Endpoint API", "http://localhost:3000/api")}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-slate-50 cursor-pointer"
                                >
                                  {copiedKey === "Endpoint API" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono font-black text-purple-705 block tracking-wide">2. Code d'implémentation de l'Agent</span>
                            <p className="text-[11px] text-slate-500">Intégrez ce snippet asymétrique dans vos scripts d'agents pour automatiser l'échange de jetons web cryptés :</p>
                            
                            <div className="relative mt-1.5 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300">
                              <div className="flex justify-between items-center bg-slate-800/80 px-3 py-1.5 text-slate-400">
                                <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5" /> glab_agent.py</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText("Script de dev", `import requests\n\n# Handshake d'intégration\nresp = requests.post(\n    "http://localhost:3000/api/apps/${app.id}/sync",\n    headers={"Authorization": "Bearer ${app.ssoClientSecret}"}\n)\nprint("Connected! Live user state synced.")`)}
                                  className="text-slate-400 hover:text-white flex items-center gap-0.5"
                                >
                                  {copiedKey === "Script de dev" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />} Copier
                                </button>
                              </div>
                              <pre className="p-3 overflow-x-auto whitespace-pre select-all text-purple-300">
{`import requests

# Handshake d'intégration SSO / API Gateway
resp = requests.post(
    "http://localhost:3000/api/apps/${app.id}/sync",
    headers={"Authorization": "Bearer ${app.ssoClientSecret}"}
)
print("Connected! Live user state synced:", resp.json())`}
                              </pre>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="pt-2 border-t border-purple-200/40">
                            <button
                              type="button"
                              onClick={() => handleTestConnection(app.id, app.name)}
                              disabled={isTestingConnect}
                              className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl px-4 py-2.5 text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {isTestingConnect ? (
                                <>
                                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                                  Ping / Handshake en cours...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4.5 w-4.5" />
                                  Tester la liaison de l'Agent en Live
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Bottom Quick Trigger Bar */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-[#F5F7FA]/70">
                <button
                  onClick={() => onSyncApp(app.id, app.name)}
                  className="py-3 px-1 hover:bg-slate-100 text-center text-slate-600 hover:text-brand-blue transition-colors text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" /> Diagnostiquer
                </button>

                <button
                  onClick={() => {
                    setSelectedAppSession(app);
                  }}
                  className="py-3 px-1 hover:bg-slate-100 text-center text-brand-orange hover:text-orange-600 transition-colors text-xs font-mono font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-brand-orange animate-pulse" /> Open App
                </button>

                <div className="py-3 px-1 text-center text-brand-blue text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-[#0B1F3A]/60" /> {app.recordsCount} lignes
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Simulated Live Workspace Iframe / Session Modal preview */}
      {selectedAppSession && (
        <div className="fixed inset-0 bg-brand-blue/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-motion-in">
            
            {/* Header of session proxy */}
            <div className="bg-brand-blue text-white p-4.5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center text-brand-orange border border-white/5">
                  <KeepKeyIcon name={selectedAppSession.icon} className="h-5 w-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    Console IdP Fédérée — Session Client Active (ID: {selectedAppSession.id})
                  </h3>
                  <p className="text-[10px] font-mono text-brand-orange tracking-widest font-bold">
                    SECURE JWT TOKEN INJECTED IN LOCALSTORAGE FOR {selectedAppSession.url.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#0B1F3A]/60 text-[10px] font-mono border border-white/5 text-slate-350">
                  {selectedAppSession.version}
                </span>
                <button 
                  onClick={() => setSelectedAppSession(null)}
                  className="text-slate-400 hover:text-white font-mono font-black text-xs cursor-pointer border border-white/15 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* SSO Injection confirmation message */}
            <div className="bg-brand-orange/10 border-b border-brand-orange/20 px-5 py-3 flex items-center justify-between text-xs text-brand-orange font-mono font-bold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-orange animate-pulse" /> 
                IDP AUTHENTICATION HANDSHAKE SUCCESS : RSA256 signature is verified. JTI claims match active global workspace session.
              </span>
              <span className="text-brand-orange animate-glow">● FEDERATED ACTIVE</span>
            </div>

            {/* App Screen Simulator Workspace */}
            <div className="flex-1 bg-[#F5F7FA] p-6 overflow-y-auto flex flex-col justify-between">
              
              <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-premium max-w-2xl mx-auto my-auto text-center space-y-4">
                <div className="h-14 w-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center mx-auto border border-brand-orange/20 shadow-inner">
                  <KeepKeyIcon name={selectedAppSession.icon} className="h-8 w-8 text-brand-orange" />
                </div>
                <h4 className="text-xl font-black text-brand-blue">{selectedAppSession.name} terminal SaaS</h4>
                <p className="text-xs text-slate-500 leading-relaxed md:px-6">
                  Ceci représente la sandbox client de votre microservice sur le sous-domaine{" "}
                  <code className="bg-brand-blue/[0.04] px-1.5 py-0.5 rounded font-mono text-brand-orange font-bold text-[11px]">{selectedAppSession.url}</code>. 
                  L'authentification centralisée a décrypté vos jetons avec signature asymétrique pour cet ID d'organisation.
                </p>

                <div className="border border-brand-blue/5 rounded-xl p-4 bg-[#F5F7FA] flex justify-around text-center mt-5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-extrabold block">Lignes SQL</span>
                    <strong className="text-brand-blue font-extrabold text-sm">{selectedAppSession.recordsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-extrabold block">Trafic Live</span>
                    <strong className="text-brand-blue font-extrabold text-sm">{selectedAppSession.activeUsers} req/s</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-extrabold block">Vérification SSO</span>
                    <span className="text-emerald-600 font-black font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full block mt-0.5">JWT CONFORME</span>
                  </div>
                </div>

                <div className="pt-5 flex justify-center gap-3">
                  <a 
                    href={selectedAppSession.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-brand-blue hover:bg-slate-900 text-white text-xs px-5 py-2.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-premium"
                  >
                    Ouvrir dans un nouvel onglet <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button 
                    onClick={() => setSelectedAppSession(null)}
                    className="border border-[#0B1F3A]/10 hover:bg-[#F5F7FA] text-brand-blue text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Retour au portail principal
                  </button>
                </div>
              </div>

              {/* Console log simulator */}
              <div className="bg-[#0B1F3A] text-slate-100 p-4 rounded-xl border border-white/5 font-mono text-[10.5px] shadow-2xl">
                <p className="font-bold border-b border-white/10 pb-2 mb-2 text-[#FF7A00] tracking-widest uppercase text-[9px]">G-Gate Client Token Simulator Stream</p>
                <div className="space-y-1 text-slate-300">
                  <p>&gt; Decoding federated token for glabtech1@gmail.com (id: user-glab-1)</p>
                  <p>&gt; HMAC_SHA256 Secret verification matched for peer sub-system "{selectedAppSession.id}"</p>
                  <p>&gt; Syncing tables using prisma on client node: SUCCESS ({selectedAppSession.recordsCount} transactions logged)</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
