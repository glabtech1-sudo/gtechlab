import React from "react";
import { 
  Activity, 
  Sparkles, 
  PlusCircle, 
  Layers, 
  Database, 
  Users, 
  Sliders, 
  HelpCircle, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Server
} from "lucide-react";
import { ManagedApp, SystemMetric, CustomWorkflow } from "../types";
import { KeepKeyIcon } from "./Icons";

interface DashboardTabProps {
  apps: ManagedApp[];
  metrics: SystemMetric;
  workflows: CustomWorkflow[];
  onAdjustRecords: (id: string, name: string, amount: number) => void;
  onToggleWorkflow: (id: string, name: string) => void;
  onOpenWorkflowModal: () => void;
  onOpenAi: () => void;
  changeTab: (tab: string) => void;
}

export default function DashboardTab({
  apps,
  metrics,
  workflows,
  onAdjustRecords,
  onToggleWorkflow,
  onOpenWorkflowModal,
  onOpenAi,
  changeTab
}: DashboardTabProps) {
  const totalRecords = apps.reduce((accum, a) => accum + (a.recordsCount || 0), 0);
  const totalActiveUsers = apps.reduce((accum, a) => accum + (a.activeUsers || 0), 0);
  const totalApiRequests = apps.reduce((accum, a) => accum + (a.apiRequestsToday || 0), 0);

  return (
    <div className="space-y-6 premium-gradient-bg">
      
      {/* 1. SaaS Bento-Grid Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-grid">
        
        {/* Total Apps Card */}
        <div className="bg-white border border-slate-100 hover:border-brand-blue/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Layers className="h-16 w-16 text-brand-blue" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Applications Connectées</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-brand-blue font-sans tracking-tight">{apps.length}</span>
            <span className="text-[10px] font-extrabold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full font-mono">
              DNS PRÊT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Services et backends fédérés actifs</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Fédérations actives :</span>
            <strong className="text-brand-orange font-mono font-bold">100% de l'écosystème</strong>
          </div>
        </div>

        {/* Total Prisma Postgres records */}
        <div className="bg-white border border-slate-100 hover:border-brand-blue/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Database className="h-16 w-16 text-brand-blue" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Enregistrements PostgreSQL</p>
          <div className="flex items-baseline gap-2 mt-3 block">
            <span className="text-3xl font-black text-brand-blue font-sans tracking-tight">{(totalRecords).toLocaleString()}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400">lignes stockées</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Tables synchronisées via Prisma ORM local</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Persistance :</span>
            <strong className="text-brand-blue font-bold tracking-tight">Postgres Direct</strong>
          </div>
        </div>

        {/* Active SSO Sessions */}
        <div className="bg-white border border-slate-100 hover:border-brand-blue/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Users className="h-16 w-16 text-brand-blue" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Sessions SSO Actives</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-brand-blue font-sans tracking-tight">{totalActiveUsers}</span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono animate-pulse">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Authentifiés sur les sous-domaines</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Gestion :</span>
            <strong className="text-brand-blue font-bold tracking-tight">Federated JWT</strong>
          </div>
        </div>

        {/* API Traffic counters */}
        <div className="bg-white border border-slate-100 hover:border-brand-blue/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Activity className="h-16 w-16 text-brand-blue" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Flux Passerelle API & SSO</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-brand-blue font-sans tracking-tight">{(totalApiRequests / 1000).toFixed(1)}k</span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">requêtes / jour</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Passerelle centrale Express sécurisée</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Latence SSE :</span>
            <strong className="text-brand-orange font-mono font-bold animate-glow">{metrics.apiLatency} ms</strong>
          </div>
        </div>

      </div>

      {/* 2. Telemetry and Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Node/Express Hostinger telemetrics */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium lg:col-span-2 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-brand-orange animate-pulse" /> Télémétrie de l'infrastructure Serveur
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Diagnostique d'exécution Node.js en temps réel</p>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-blue/[0.03] border border-brand-blue/5 px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#0B1F3A] font-bold">
              <Server className="h-3.5 w-3.5 text-brand-orange animate-float" /> Cœur : Linux OS (Cloud Run)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6 border border-brand-blue/5 rounded-xl p-4 bg-[#F5F7FA]">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Charge CPU Unifiée</span>
              <div className="flex items-baseline gap-1 mt-1">
                <strong className="text-xl font-black text-brand-blue">{metrics.cpu}%</strong>
                <span className="text-[9px] text-slate-400 font-mono">16 Cores</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-blue to-brand-orange h-1 rounded-full transition-all duration-300" style={{ width: `${metrics.cpu}%` }}></div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Allocation RAM</span>
              <div className="flex items-baseline gap-1 mt-1">
                <strong className="text-xl font-black text-brand-blue">{metrics.memory} Go</strong>
                <span className="text-[9px] text-slate-400 font-mono">/ 8 Go</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-brand-blue h-1 rounded-full transition-all duration-300" style={{ width: `${(metrics.memory / 8) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Bande Passante (Egress)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <strong className="text-xl font-black text-brand-blue">{metrics.networkOut} KB/s</strong>
                <span className="text-[9px] text-brand-orange font-mono">100 Mbps max</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-brand-orange h-1 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (metrics.networkOut / 1200) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* SVG representation of API requests split */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Répartition instantanée des flux clients sur glabtech.com</p>
            
            <div className="h-32 flex items-end gap-2 px-3 pt-4 border-b border-l border-slate-200 font-mono text-[9px] relative">
              {apps.map((a, i) => {
                const colors = [
                  "bg-gradient-to-t from-brand-blue to-slate-700",
                  "bg-gradient-to-t from-brand-orange to-amber-500",
                  "bg-gradient-to-t from-brand-blue via-brand-orange to-amber-500",
                  "bg-gradient-to-t from-indigo-900 to-indigo-700",
                  "bg-gradient-to-t from-[#FF7A00] to-orange-400",
                  "bg-gradient-to-t from-slate-900 to-slate-500"
                ];
                const heightPercentage = Math.min(95, Math.max(15, (a.apiRequestsToday / Math.max(1, totalApiRequests)) * 250));
                return (
                  <div 
                    key={a.id} 
                    className="w-full rounded-t flex items-end justify-center group relative cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    <div className="absolute bottom-full mb-2 bg-brand-blue text-white rounded px-2 py-1 text-[10px] font-mono hidden group-hover:block whitespace-nowrap z-30 shadow-premium border border-white/10">
                      {a.name}: {a.apiRequestsToday} requêtes
                    </div>
                    <div className={`w-full ${colors[i % colors.length]} h-2 rounded-t`} />
                  </div>
                );
              })}

              {/* Grid Lines helper */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-slate-50 pointer-events-none"></div>
              <div className="absolute left-0 right-0 top-2/4 border-t border-slate-50 pointer-events-none"></div>
              <div className="absolute left-0 right-0 top-3/4 border-t border-slate-50 pointer-events-none"></div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>hotel</span>
              <span>resto</span>
              <span>crm</span>
              <span>erp</span>
              <span>market</span>
              <span>hopital</span>
            </div>
          </div>
        </div>

        {/* Automatisation GLAB-Link Column */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-brand-orange" /> Liaisons G-Link
              </h3>
              <button
                onClick={onOpenWorkflowModal}
                className="text-[10px] bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-bold px-2 py-1 rounded-full transition-colors cursor-pointer font-mono"
              >
                + Planifier
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Désignez de puissantes passerelles événementielles pour aligner vos sous-domaines instantanément.
            </p>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {workflows.map((wf) => (
                <div key={wf.id} className="border border-slate-150 hover:border-brand-orange/30 p-3 rounded-xl transition-all bg-[#F5F7FA]/70">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">{wf.name}</span>
                    <button 
                      onClick={() => onToggleWorkflow(wf.id, wf.name)}
                      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold transition-all border ${
                        wf.active 
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20" 
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {wf.active ? "ACTIF" : "PAUSE"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">{wf.description}</p>
                  <p className="text-[9px] mt-2 font-mono text-brand-blue bg-white border border-slate-100 px-2 py-0.5 rounded inline-block font-semibold">
                    {wf.triggerApp}.glabtech.com ➜ {wf.targetApp}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Moteur d'automatisation</span>
            <span className="text-brand-orange font-bold">Standardisé JWT</span>
          </div>
        </div>

      </div>

      {/* 3. Operational Playground: Interactive State adjustment */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-brand-orange" /> Bac à sable administration — Ajustement en direct des bases Postgres
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulez des charges de transactions et observez l'impact instantané sur l'ensemble de glabtech.com.
            </p>
          </div>
          <span className="text-[10px] font-mono font-black text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Owner Access
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {apps.map(app => (
            <div key={app.id} className="border border-slate-100 hover:border-brand-orange/30 rounded-2xl p-4 bg-[#F5F7FA]/50 hover:bg-white hover:shadow-premium transition-all text-center group">
              <div className="h-8 w-8 mx-auto bg-brand-blue text-white rounded-xl flex items-center justify-center border border-white/10 mb-2 group-hover:scale-110 transition-transform shadow-premium">
                <KeepKeyIcon name={app.icon} className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-brand-blue truncate max-w-full" title={app.name}>{app.name.split(" ")[1] || app.name}</p>
              <div className="text-[11.5px] font-mono font-bold text-slate-450 mt-1">
                {app.recordsCount} lignes
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 mt-4">
                <button
                  onClick={() => onAdjustRecords(app.id, app.name, 10)}
                  className="bg-white border border-slate-200 hover:border-brand-orange hover:text-brand-orange text-[#0B1F3A] rounded-lg py-1 px-1 text-[10px] font-extrabold font-mono transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  +10
                </button>
                <button
                  onClick={() => onAdjustRecords(app.id, app.name, -10)}
                  className="bg-white border border-slate-200 hover:border-brand-orange hover:text-brand-orange text-[#0B1F3A] rounded-lg py-1 px-1 text-[10px] font-extrabold font-mono transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  -10
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button 
          onClick={() => { changeTab("apps"); }}
          className="p-5 border border-dashed border-slate-200 hover:border-brand-orange hover:bg-white rounded-2xl text-left bg-slate-55/30 transition-all cursor-pointer group"
        >
          <PlusCircle className="h-5.5 w-5.5 text-brand-orange mb-3 group-hover:scale-110 transition-all" />
          <h4 className="text-xs font-bold text-brand-blue">Enregistrer une Nouvelle Application</h4>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">Intégrez de nouveaux microservices et déterminez vos secrets avec SSO d'un clic.</p>
        </button>

        <button 
          onClick={() => changeTab("sso")} 
          className="p-5 border border-slate-100 hover:border-brand-orange rounded-2xl text-left bg-white shadow-premium hover:shadow-premium-hover transition-all cursor-pointer group"
        >
          <HelpCircle className="h-5.5 w-5.5 text-brand-orange mb-3 group-hover:scale-110 transition-all" />
          <h4 className="text-xs font-bold text-brand-blue">Directives d'intégration JWT</h4>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">Consultez les payloads JWT cryptés et injectez-les dans vos microservices.</p>
        </button>

        <button 
          onClick={onOpenAi} 
          className="p-5 bg-brand-blue hover:bg-slate-900 text-white rounded-2xl text-left shadow-premium hover:shadow-premium-hover transition-all cursor-pointer group"
        >
          <Sparkles className="h-5.5 w-5.5 text-brand-orange mb-3 group-hover:scale-110 transition-all animate-glow" />
          <h4 className="text-xs font-bold text-white">Rapport de diagnostic par IA</h4>
          <p className="text-[11px] text-slate-350 mt-1.5 leading-normal">Demandez au Copilote de générer une analyse d'optimisation de vos bases de données.</p>
        </button>
      </div>

    </div>
  );
}
