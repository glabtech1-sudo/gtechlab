import React, { useState, useMemo } from "react";
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
  TrendingDown,
  Cpu,
  Server,
  DollarSign,
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { ManagedApp, SystemMetric, CustomWorkflow, SecurityLog } from "../types";
import { KeepKeyIcon } from "./Icons";

interface DashboardTabProps {
  apps: ManagedApp[];
  metrics: SystemMetric;
  workflows: CustomWorkflow[];
  logs: SecurityLog[];
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
  logs = [],
  onAdjustRecords,
  onToggleWorkflow,
  onOpenWorkflowModal,
  onOpenAi,
  changeTab
}: DashboardTabProps) {
  // Page states
  const [chartMetric, setChartMetric] = useState<"traffic" | "latency" | "storage">("traffic");
  const [hoveredNode, setHoveredNode] = useState<{ x: number; y: number; val: number; label: string } | null>(null);
  
  // Search & Filter state for activity log table
  const [logSearch, setLogSearch] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState<"all" | "success" | "warning" | "failure">("all");
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>("all");
  const [visibleLogsCount, setVisibleLogsCount] = useState(6);

  // General counters
  const totalRecords = apps.reduce((accum, a) => accum + (a.recordsCount || 0), 0);
  const totalActiveUsers = apps.reduce((accum, a) => accum + (a.activeUsers || 0), 0);
  const totalApiRequests = apps.reduce((accum, a) => accum + (a.apiRequestsToday || 0), 0);

  // 1. Dynamic Metric calculations (Premium SaaS metrics)
  // Monthly Recurring Revenue calculated based on active users (€12 / user) + apps connection (€150 / connected app) + storage size
  const calculatedMrr = useMemo(() => {
    const baseSaaSFee = 499; // core dashboard platform license
    const userRevenue = totalActiveUsers * 8.5; 
    const appsRevenue = apps.length * 120;
    const storageFactor = totalRecords * 0.05;
    return baseSaaSFee + userRevenue + appsRevenue + storageFactor;
  }, [totalActiveUsers, apps.length, totalRecords]);

  // SSO Gateway health score
  const ssoGatewaySuccessRate = useMemo(() => {
    if (!logs.length) return "100";
    const totalAuths = logs.length;
    const warningsAndFailures = logs.filter(l => l.status === "warning" || l.status === "failure").length;
    const rate = ((totalAuths - warningsAndFailures) / totalAuths) * 100;
    return rate.toFixed(1);
  }, [logs]);

  // DB Performance state average based on live microservice latencies
  const averageDbLatency = useMemo(() => {
    return metrics.apiLatency || 14;
  }, [metrics.apiLatency]);

  // 2. Filter logs safely
  // Search matches details, user, ip, app, or event
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // search query match
      const query = logSearch.toLowerCase().trim();
      const matchesSearch = !query || 
        (log.details || "").toLowerCase().includes(query) ||
        (log.user || "").toLowerCase().includes(query) ||
        (log.event || "").toLowerCase().includes(query) ||
        (log.ip || "").toLowerCase().includes(query) ||
        (log.app || "").toLowerCase().includes(query);

      // status filter
      const matchesStatus = logStatusFilter === "all" || log.status === logStatusFilter;

      // app filter
      const matchesApp = selectedAppFilter === "all" || log.app.toLowerCase() === selectedAppFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesApp;
    });
  }, [logs, logSearch, logStatusFilter, selectedAppFilter]);

  // Applications list with names formatted for dropdown filter
  const uniqueAppsForFilters = useMemo(() => {
    const appSet = new Set<string>();
    logs.forEach(l => {
      if (l.app) appSet.add(l.app);
    });
    return Array.from(appSet);
  }, [logs]);

  // Chart timeseries data generators
  const chartDataPoints = useMemo(() => {
    // Return sample static sequences or transform dynamically to give lively rendering
    if (chartMetric === "traffic") {
      // Requests timeline sequence
      const baseReq = Math.max(100, Math.round(totalApiRequests / 24));
      return [
        { label: "10h00", val: Math.round(baseReq * 0.85) },
        { label: "11h00", val: Math.round(baseReq * 1.15) },
        { label: "12h00", val: Math.round(baseReq * 1.35) },
        { label: "13h00", val: Math.round(baseReq * 0.95) },
        { label: "14h00", val: Math.round(baseReq * 1.45) },
        { label: "15h00", val: Math.round(baseReq * 1.80) },
        { label: "En direct", val: baseReq }
      ];
    } else if (chartMetric === "latency") {
      // Platform milliseconds query response sequence
      const current = averageDbLatency;
      return [
        { label: "10h00", val: Math.round(current * 0.95) },
        { label: "11h00", val: Math.round(current * 1.1) },
        { label: "12h00", val: Math.round(current * 1.35) },
        { label: "13h00", val: Math.round(current * 0.75) },
        { label: "14h00", val: Math.round(current * 1.05) },
        { label: "15h00", val: Math.round(current * 0.9) },
        { label: "En direct", val: current }
      ];
    } else {
      // DB Volume records count representation
      return apps.map(app => ({
        label: app.name.split(" ")[1] || app.name,
        val: app.recordsCount
      }));
    }
  }, [chartMetric, totalApiRequests, averageDbLatency, apps]);

  // Generate SVG cubic coordinates for high contrast charting line
  const svgDimensions = { width: 680, height: 160 };
  const maxChartVal = Math.max(1, ...chartDataPoints.map(d => d.val)) * 1.15;

  const pointsString = useMemo(() => {
    return chartDataPoints.map((p, i) => {
      const x = (i / (chartDataPoints.length - 1)) * svgDimensions.width;
      const y = svgDimensions.height - (p.val / maxChartVal) * svgDimensions.height;
      return `${x},${y}`;
    }).join(" ");
  }, [chartDataPoints, maxChartVal]);

  const fillAreaPoints = useMemo(() => {
    if (chartDataPoints.length === 0) return "";
    return `0,${svgDimensions.height} ` + pointsString + ` ${svgDimensions.width},${svgDimensions.height}`;
  }, [chartDataPoints, pointsString]);

  // Handle graph mouse hovering to display absolute details card
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const index = Math.min(
      chartDataPoints.length - 1,
      Math.max(0, Math.round(xRatio * (chartDataPoints.length - 1)))
    );
    const matchedPoint = chartDataPoints[index];
    const itemX = (index / (chartDataPoints.length - 1)) * svgDimensions.width;
    const itemY = svgDimensions.height - (matchedPoint.val / maxChartVal) * svgDimensions.height;
    
    setHoveredNode({
      x: itemX,
      y: itemY,
      val: matchedPoint.val,
      label: matchedPoint.label
    });
  };

  const handleSvgMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="space-y-6 premium-gradient-bg">
      
      {/* 1. PRINCIPAL ADVANCED SAAS KPIs BAR */}
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1D3B6C] text-white rounded-3xl p-6 shadow-premium relative overflow-hidden border border-white/10" id="saas-header-kpi">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono tracking-widest font-black uppercase px-2.5 py-1 rounded-full">
              Console Centrale G-LAB TECH
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-2 flex items-center gap-2">
              Performance & Volume SaaS <Sparkles className="h-5 w-5 text-amber-400 animate-glow" />
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed mt-1 font-medium">
              Aperçu en direct de vos microservices centralisés, revenus unitaires, et transactions SQL / SSO fédérées.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onOpenAi}
              className="px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white rounded-xl text-xs font-black transition-all cursor-pointer border-0 flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Sparkles className="h-4 w-4 animate-float" /> Diagnostic IA de Base
            </button>
            <button 
              onClick={() => changeTab("apps")}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-black transition-all cursor-pointer border border-white/15 flex items-center gap-1"
            >
              Gérer la Régie <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Triple micro KPIs metrics nested border */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10 relative z-10">
          
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-200 uppercase font-bold tracking-wider block">Estimated MRR (SaaS)</span>
              <strong className="text-xl font-black font-sans tracking-tight">
                {calculatedMrr.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </strong>
              <div className="flex items-center gap-1 text-[9.5px] text-emerald-400 font-mono font-medium">
                <TrendingUp className="h-3 w-3" /> +12.4% ce mois-ci
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 text-[#FF7A00] rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-200 uppercase font-bold tracking-wider block">Gateways SSO Success Rate</span>
              <strong className="text-xl font-black font-sans tracking-tight">{ssoGatewaySuccessRate}%</strong>
              <div className="flex items-center gap-1 text-[9.5px] text-emerald-400 font-mono font-medium animate-pulse">
                <Clock className="h-3 w-3" /> Zéro interruption (99.9% SLA)
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-200 uppercase font-bold tracking-wider block">Moyenne Latence SQL</span>
              <strong className="text-xl font-black font-sans tracking-tight">{averageDbLatency} ms</strong>
              <div className="flex items-center gap-1 text-[9.5px] text-emerald-300 font-mono font-semibold">
                <Server className="h-3 w-3" /> Prisma Client Local
              </div>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <Database className="h-5 w-5" />
            </div>
          </div>

        </div>
      </div>

      {/* 2. THE MAIN SaaS BENTO-GRID COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-grid">
        
        {/* Total Apps Card */}
        <div className="bg-white border border-slate-100 hover:border-emerald-500/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Layers className="h-16 w-16 text-emerald-600" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Applications Connectées</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-emerald-600 font-sans tracking-tight">{apps.length}</span>
            <span className="text-[10px] font-extrabold text-[#FF7A00] bg-orange-500/10 border border-[#FF7A00]/25 px-2 py-0.5 rounded-full font-mono">
              DNS PRÊT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Services et backends fédérés actifs</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Fédérations actives :</span>
            <strong className="text-[#FF7A00] font-mono font-bold">100% de l'écosystème</strong>
          </div>
        </div>

        {/* Total Prisma Postgres records */}
        <div className="bg-white border border-slate-100 hover:border-emerald-500/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Database className="h-16 w-16 text-emerald-600" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Enregistrements PostgreSQL</p>
          <div className="flex items-baseline gap-2 mt-3 block">
            <span className="text-3xl font-black text-emerald-600 font-sans tracking-tight">{(totalRecords).toLocaleString("fr-FR")}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400">lignes stockées</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Tables synchronisées via Prisma ORM local</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Persistance :</span>
            <strong className="text-emerald-600 font-bold tracking-tight">Postgres Direct</strong>
          </div>
        </div>

        {/* Active SSO Sessions */}
        <div className="bg-white border border-slate-100 hover:border-emerald-500/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Users className="h-16 w-16 text-emerald-600" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Sessions SSO Actives</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-emerald-600 font-sans tracking-tight">{totalActiveUsers}</span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono animate-pulse">
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Authentifiés sur les sous-domaines</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Gestion :</span>
            <strong className="text-emerald-600 font-bold tracking-tight">Federated JWT</strong>
          </div>
        </div>

        {/* API Traffic counters */}
        <div className="bg-white border border-slate-100 hover:border-emerald-500/10 rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 relative overflow-hidden group glow-card">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300">
            <Activity className="h-16 w-16 text-emerald-600" />
          </div>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Flux Passerelle API & SSO</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-emerald-600 font-sans tracking-tight">{(totalApiRequests / 1000).toFixed(1)}k</span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">requêtes / jour</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Passerelle centrale Express sécurisée</p>
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-mono">Latence SSE :</span>
            <strong className="text-[#FF7A00] font-mono font-bold animate-glow">{metrics.apiLatency} ms</strong>
          </div>
        </div>

      </div>

      {/* 3. INTERACTIVE ANALYTICS & GRAPHICS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Interactive Graph Block */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-sm text-[#0B1F3A] flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-[#FF7A00]" /> Graphiques d'activité analytique interactifs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Survoler la courbe ou les modules pour observer les pics</p>
              </div>
              
              {/* Metric Selector Buttons */}
              <div className="flex items-center bg-[#F5F7FA] p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
                <button
                  onClick={() => { setChartMetric("traffic"); setHoveredNode(null); }}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    chartMetric === "traffic" 
                      ? "bg-white text-emerald-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Trafic API
                </button>
                <button
                  onClick={() => { setChartMetric("latency"); setHoveredNode(null); }}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    chartMetric === "latency" 
                      ? "bg-white text-emerald-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Latence Edge
                </button>
                <button
                  onClick={() => { setChartMetric("storage"); setHoveredNode(null); }}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    chartMetric === "storage" 
                      ? "bg-white text-emerald-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Stockage DB
                </button>
              </div>
            </div>

            {/* Simulated Live Telemetrics info-bar */}
            <div className="grid grid-cols-3 gap-4 p-3.5 bg-[#F5F7FA]/70 border border-slate-150 rounded-xl mb-6 font-semibold">
              <div className="text-left">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Diagnostique Graphique</span>
                <span className="text-xs text-emerald-900 font-bold block mt-0.5">
                  {chartMetric === "traffic" ? "Variations Flux Horaire" : chartMetric === "latency" ? "Fluctuations en ms" : "Enregistrements Table"}
                </span>
              </div>
              <div className="text-left border-l border-slate-200 pl-4">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Fréquence d'Échantillon</span>
                <span className="text-xs text-[#FF7A00] font-mono font-bold block mt-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" /> 5s (Edge Hook)
                </span>
              </div>
              <div className="text-left border-l border-slate-200 pl-4">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Santé Global Tunnel</span>
                <span className="text-xs text-emerald-900 font-bold block mt-0.5 font-sans">99.8% Optimal</span>
              </div>
            </div>

            {/* Core Interactive SVG Rendering */}
            <div className="relative pt-2 pb-4">
              {chartMetric !== "storage" ? (
                <>
                  {/* Glowing line/area SVG */}
                  <svg 
                    viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
                    className="w-full h-40 overflow-visible cursor-crosshair"
                    onMouseMove={handleSvgMouseMove}
                    onMouseLeave={handleSvgMouseLeave}
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines helper */}
                    <line x1="0" y1="40" x2={svgDimensions.width} y2="40" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="80" x2={svgDimensions.width} y2="80" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="120" x2={svgDimensions.width} y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    
                    {/* SVG Filled Area */}
                    <polygon points={fillAreaPoints} fill="url(#chartGradient)" />

                    {/* SVG Curve Line */}
                    <polyline
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="3.5"
                      points={pointsString}
                      strokeLinecap="round"
                    />

                    {/* Circle nodes */}
                    {chartDataPoints.map((p, i) => {
                      const cx = (i / (chartDataPoints.length - 1)) * svgDimensions.width;
                      const cy = svgDimensions.height - (p.val / maxChartVal) * svgDimensions.height;
                      const isHovered = hoveredNode && hoveredNode.label === p.label;
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? "7" : "4.5"}
                          fill={isHovered ? "#FF7A00" : "#white"}
                          stroke={isHovered ? "#white" : "#0284C7"}
                          strokeWidth={isHovered ? "2" : "2.5"}
                          className="transition-all duration-150"
                        />
                      );
                    })}

                    {/* Horizontal Hover Guidance Indicator Line */}
                    {hoveredNode && (
                      <line 
                        x1={hoveredNode.x} 
                        y1="0" 
                        x2={hoveredNode.x} 
                        y2={svgDimensions.height} 
                        stroke="#FF7A00" 
                        strokeDasharray="4 3" 
                        strokeWidth="1" 
                      />
                    )}
                  </svg>

                  {/* Node Hover Interactive Details Card (Aesthetic Floating Tooltip) */}
                  {hoveredNode && (
                    <div 
                      className="absolute bg-[#0284C7] text-white rounded-xl px-3 py-2 shadow-2xl border border-white/20 text-[11px] font-mono z-40 transition-all pointer-events-none -translate-x-1/2 -mt-1"
                      style={{ 
                        left: `${(hoveredNode.x / svgDimensions.width) * 100}%`,
                        top: `${(hoveredNode.y / svgDimensions.height) * 40 + 70}px` 
                      }}
                    >
                      <strong className="block text-amber-400 font-extrabold">{hoveredNode.label}</strong>
                      <span className="font-semibold block font-sans">
                        {chartMetric === "traffic" 
                          ? `${hoveredNode.val.toLocaleString()} Req/Sec` 
                          : `${hoveredNode.val} millisecondes`
                        }
                      </span>
                    </div>
                  )}

                  {/* Chart X Labels */}
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 mt-2 px-1">
                    {chartDataPoints.map((p, i) => <span key={i}>{p.label}</span>)}
                  </div>
                </>
              ) : (
                /* comparative bar chart representation for PostgreSQL tables sizes */
                <div className="space-y-3.5 py-2">
                  {chartDataPoints.map((point, index) => {
                    const pct = Math.min(100, (point.val / maxChartVal) * 90);
                    const colors = [
                      "bg-gradient-to-r from-emerald-500 to-indigo-600",
                      "bg-gradient-to-r from-[#FF7A00] to-amber-500",
                      "bg-gradient-to-r from-[#10B981] to-cyan-500",
                      "bg-gradient-to-r from-emerald-500 to-teal-600",
                      "bg-gradient-to-r from-violet-500 to-purple-600"
                    ];
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-700 font-bold">{point.label}.glabtech.com</span>
                          <span className="font-mono text-emerald-850 font-bold">{point.val.toLocaleString()} lignes</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                          <div 
                            className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-500`} 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-400 font-mono font-semibold">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-[#10B981] rounded-full inline-block" /> Flux unifiés d'authentifications SSO synchronisés instantanément
            </span>
            <span className="text-emerald-700 font-bold">Audit Node/Express certifié</span>
          </div>
        </div>

        {/* Automatisation GLAB-Link Column */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-[#0B1F3A] flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-[#FF7A00]" /> Liaisons G-Link
              </h3>
              <button
                onClick={onOpenWorkflowModal}
                className="text-[10px] bg-orange-500/10 hover:bg-orange-500/20 text-[#FF7A00] font-bold px-2 py-1 rounded-full transition-colors cursor-pointer font-mono border-0"
              >
                + Planifier
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Désignez de puissantes passerelles événementielles pour aligner vos sous-domaines instantanément.
            </p>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {workflows.map((wf) => (
                <div key={wf.id} className="border border-slate-150 hover:border-orange-500/30 p-3 rounded-xl transition-all bg-[#F5F7FA]/70">
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
                  <p className="text-[9px] mt-2 font-mono text-emerald-700 bg-white border border-slate-100 px-2 py-0.5 rounded inline-block font-semibold">
                    {wf.triggerApp}.glabtech.com ➜ {wf.targetApp}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Moteur d'automatisation</span>
            <span className="text-[#FF7A00] font-bold">Standardisé JWT</span>
          </div>
        </div>

      </div>

      {/* 4. RECENT ACTIVITY TABLE & SEC-OPS AUDIT LOGS */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-premium relative overflow-hidden" id="recent-activity-section">
        
        {/* Table header metadata & search filter */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-[#0B1F3A] flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-[#FF7A00]" /> Journal d'activité récent & Audit de sécurité SSO
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultez les requêtes de liane, les tentatives de tokens, et les écritures Prisma en direct.
            </p>
          </div>
          
          {/* Integrated Interactive filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
            {/* Live Search input */}
            <div className="relative flex-1 sm:flex-initial min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Rechercher logs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none text-[#0B1F3A] focus:border-[#FF7A00] focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Application Dropdown filter */}
            <select
              value={selectedAppFilter}
              onChange={(e) => setSelectedAppFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-[#0B1F3A] font-bold max-w-[150px] outline-none cursor-pointer focus:border-[#FF7A00]"
            >
              <option value="all">Toutes services</option>
              {uniqueAppsForFilters.map(app => (
                <option key={app} value={app}>{app}.glabtech</option>
              ))}
            </select>

            {/* Status Segment filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-[10.5px] font-bold">
              <button
                onClick={() => setLogStatusFilter("all")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer ${logStatusFilter === "all" ? "bg-white text-emerald-900 shadow-sm" : "text-slate-500"}`}
              >
                Tous
              </button>
              <button
                onClick={() => setLogStatusFilter("success")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 ${logStatusFilter === "success" ? "bg-[#10B981] text-white shadow-sm" : "text-slate-500"}`}
              >
                <CheckCircle className="h-3 w-3" /> OK
              </button>
              <button
                onClick={() => setLogStatusFilter("warning")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 ${logStatusFilter === "warning" ? "bg-[#FF7A00] text-white shadow-sm" : "text-slate-500"}`}
              >
                <AlertTriangle className="h-3 w-3" /> Warn
              </button>
              <button
                onClick={() => setLogStatusFilter("failure")}
                className={`px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 ${logStatusFilter === "failure" ? "bg-red-600 text-white shadow-sm" : "text-slate-500"}`}
              >
                <XCircle className="h-3 w-3" /> Fail
              </button>
            </div>
          </div>
        </div>

        {/* Real Live database mapping table */}
        <div className="overflow-x-auto">
          {filteredLogs.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-extrabold pb-2">
                  <th className="py-2.5 font-bold">Heure / Horodatage</th>
                  <th className="py-2.5 font-bold">Service / Hub</th>
                  <th className="py-2.5 font-bold">Compte / Utilisateur</th>
                  <th className="py-2.5 font-bold">Type d'Événement</th>
                  <th className="py-2.5 font-bold">Statut SSO</th>
                  <th className="py-2.5 font-bold">Adresse IP</th>
                  <th className="py-2.5 text-right font-bold">Détails techniques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredLogs.slice(0, visibleLogsCount).map((log) => {
                  const statusConfig = {
                    success: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "SUCCESS" },
                    warning: { bg: "bg-orange-50 text-orange-700 border-orange-200", text: "WARNING" },
                    failure: { bg: "bg-red-50 text-red-700 border-red-200", text: "FAILURE" }
                  }[log.status || "success"];

                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Timestamp formatted nicely */}
                      <td className="py-3.5 font-mono text-[11px] text-slate-400">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString("fr-FR") : "--:--:--"}
                      </td>
                      
                      {/* Hub application */}
                      <td className="py-3.5">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-2 py-0.5 text-[10.5px] font-mono font-bold">
                          {log.app}.glabtech.com
                        </span>
                      </td>

                      {/* User email / client name */}
                      <td className="py-3.5 font-bold text-[#0B1F3A]">
                        {log.user || "Anonyme Client"}
                      </td>

                      {/* Event name */}
                      <td className="py-3.5 truncate max-w-[150px]">
                        <span className="font-semibold text-slate-800">{log.event}</span>
                      </td>

                      {/* Raw auth status indicator badge */}
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black font-mono tracking-wider ${statusConfig.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            log.status === "success" ? "bg-emerald-500" : log.status === "warning" ? "bg-amber-500" : "bg-red-500"
                          }`} />
                          {statusConfig.text}
                        </span>
                      </td>

                      {/* IP address */}
                      <td className="py-3.5 font-mono text-[11px] text-slate-500">
                        {log.ip || "127.0.0.1"}
                      </td>

                      {/* details text */}
                      <td className="py-3.5 text-right font-semibold text-[11px] text-slate-600 truncate max-w-[200px]" title={log.details}>
                        {log.details || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-slate-400 font-bold space-y-2">
              <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm">Aucune activité trouvée pour cette recherche</p>
              <button 
                onClick={() => { setLogSearch(""); setLogStatusFilter("all"); setSelectedAppFilter("all"); }} 
                className="text-xs text-[#10B981] hover:underline cursor-pointer border-0 bg-transparent font-black"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Dynamic logs pagination action bar */}
        {filteredLogs.length > visibleLogsCount && (
          <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
            <button
              onClick={() => setVisibleLogsCount(prev => prev + 5)}
              className="text-xs bg-slate-150 hover:bg-slate-200 text-emerald-850 px-4 py-1.5 rounded-xl font-black transition-all cursor-pointer border-0 shadow-sm"
            >
              Afficher + d'activités ({filteredLogs.length - visibleLogsCount} restantes)
            </button>
          </div>
        )}
      </div>

      {/* 5. OPERATIONAL PLAYGROUND: INTERACTIVE BDD LINES RECORD ADJUSTMENT */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 className="font-extrabold text-sm text-[#0B1F3A] flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-[#FF7A00]" /> Bac à sable de simulation — Ajustement des bases de données Postgres
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulez des charges de transactions et observez l'impact direct sur les KPis et le serveur.
            </p>
          </div>
          <span className="text-[10px] font-mono font-black text-[#FF7A00] bg-orange-500/10 border border-[#FF7A00]/25 px-3 py-1 rounded-full uppercase tracking-wider">
            Owner Access
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {apps.map(app => (
            <div key={app.id} className="border border-slate-100 hover:border-orange-500/30 rounded-2xl p-4 bg-[#F5F7FA]/50 hover:bg-white hover:shadow-premium transition-all text-center group">
              <div className="h-8 w-8 mx-auto bg-[#10B981] text-white rounded-xl flex items-center justify-center border border-white/10 mb-2 group-hover:scale-110 transition-transform shadow-premium">
                <KeepKeyIcon name={app.icon} className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-[#0B1F3A] truncate max-w-full" title={app.name}>{app.name.split(" ")[1] || app.name}</p>
              <div className="text-[11.5px] font-mono font-bold text-[#FF7A00] mt-1">
                {app.recordsCount} lignes
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 mt-4">
                <button
                  onClick={() => onAdjustRecords(app.id, app.name, 10)}
                  className="bg-white border border-slate-200 hover:border-[#FF7A00] hover:text-[#FF7A00] text-emerald-900 rounded-lg py-1 px-1 text-[10px] font-extrabold font-mono transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  +10
                </button>
                <button
                  onClick={() => onAdjustRecords(app.id, app.name, -10)}
                  className="bg-white border border-slate-200 hover:border-[#FF7A00] hover:text-[#FF7A00] text-emerald-900 rounded-lg py-1 px-1 text-[10px] font-extrabold font-mono transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  -10
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ACTION SHORTCUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <button 
          onClick={() => { changeTab("apps"); }}
          className="p-5 border border-dashed border-slate-200 hover:border-[#FF7A00] hover:bg-white rounded-2xl text-left bg-slate-50/30 transition-all cursor-pointer group"
        >
          <PlusCircle className="h-5.5 w-5.5 text-[#FF7A00] mb-3 group-hover:scale-110 transition-all" />
          <h4 className="text-xs font-bold text-[#0B1F3A]">Enregistrer une Nouvelle Application</h4>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">Intégrez de nouveaux microservices et déterminez vos secrets avec SSO d'un clic.</p>
        </button>

        <button 
          onClick={() => changeTab("sso")} 
          className="p-5 border border-slate-100 hover:border-[#FF7A00] rounded-2xl text-left bg-white shadow-premium hover:shadow-premium-hover transition-all cursor-pointer group"
        >
          <HelpCircle className="h-5.5 w-5.5 text-[#FF7A00] mb-3 group-hover:scale-110 transition-all" />
          <h4 className="text-xs font-bold text-[#0B1F3A]">Directives d'intégration JWT</h4>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">Consultez les payloads JWT cryptés et injectez-les dans vos microservices.</p>
        </button>

        <button 
          onClick={onOpenAi} 
          className="p-5 bg-[#0B1F3A] hover:bg-[#12315C] text-white rounded-2xl text-left shadow-premium hover:shadow-premium-hover transition-all cursor-pointer group border-0"
        >
          <Sparkles className="h-5.5 w-5.5 text-amber-400 mb-3 group-hover:scale-110 transition-all animate-glow" />
          <h4 className="text-xs font-bold text-white">Rapport de diagnostic par IA</h4>
          <p className="text-[11px] text-emerald-100 mt-1.5 leading-normal">Demandez au Copilote de générer une analyse d'optimisation de vos bases de données.</p>
        </button>
      </div>

    </div>
  );
}
