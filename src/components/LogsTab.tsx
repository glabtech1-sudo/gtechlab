import React, { useState } from "react";
import { 
  Terminal, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  RotateCw, 
  Download,
  AlertCircle
} from "lucide-react";
import { SecurityLog } from "../types";

interface LogsTabProps {
  logs: SecurityLog[];
  onRefresh: () => void;
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export default function LogsTab({ logs, onRefresh, onNotify }: LogsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    onNotify("Journal d'audit exporté au format CSV avec succès.", "success");
  };

  return (
    <div className="space-y-6 premium-gradient-bg">

      {/* Audit Banner overview */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
          <Terminal className="h-16 w-16 text-brand-orange animate-float" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
            <Terminal className="h-4.5 w-4.5 text-brand-orange" /> Journal SecOps & Audit de Conformité Central
          </h3>
          <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-medium">
            Chaque action d'authentification ou synchronisation sur glabeboutique.com est historisée de manière immuable.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <button 
            onClick={onRefresh}
            className="p-3 border border-slate-200 rounded-xl bg-white text-slate-600 hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer"
            title="Rafraîchir les logs"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          
          <button 
            onClick={handleExport}
            className="bg-brand-blue hover:bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-premium"
          >
            <Download className="h-4 w-4" /> Exporter journal (.csv)
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="h-4.5 w-4.5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Rechercher par événement, utilisateur, action, application..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-slate-200 hover:border-brand-blue/20 rounded-xl pl-10 pr-4 py-3 bg-[#F5F7FA]/75 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange/45 transition-all text-brand-blue font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold"><Filter className="h-4 w-4" /> Statut SecOps:</span>
          {["ALL", "success", "warning"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                statusFilter === st 
                  ? "bg-brand-blue text-white shadow-premium" 
                  : "bg-brand-blue/[0.03] text-brand-blue hover:bg-brand-blue/5 border border-brand-blue/5"
              }`}
            >
              {st === "ALL" ? "Tous" : st === "success" ? "Succès" : "Alertes"}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table/List */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-slate-100 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                <th className="py-4.5 px-5">Horodatage (UTC)</th>
                <th className="py-4.5 px-5">Événement SecOps</th>
                <th className="py-4.5 px-5">Utilisateur</th>
                <th className="py-4.5 px-5">Service</th>
                <th className="py-4.5 px-5">Adresse IP</th>
                <th className="py-4.5 px-5">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    Aucun événement d'audit ne correspond aux filtres actifs.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isWarning = log.status === "warning";
                  return (
                    <tr key={log.id} className="hover:bg-[#F5F7FA]/30 transition-colors">
                      <td className="py-4 px-5 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString("fr-FR")}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-black">
                          {isWarning ? (
                            <AlertTriangle className="h-4.5 w-4.5 text-brand-orange animate-pulse" />
                          ) : (
                            <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shadow-sm" />
                          )}
                          <span className={isWarning ? "text-brand-orange" : "text-brand-blue"}>{log.event}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono font-extrabold text-slate-700 whitespace-nowrap">
                        {log.user}
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black bg-brand-blue/5 text-brand-blue border border-brand-blue/5 inline-block uppercase">
                          {log.app.replace("glab-", "")}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-500 whitespace-nowrap">
                        {log.ip}
                      </td>
                      <td className="py-4 px-5 text-slate-600 leading-normal max-w-sm truncate font-medium" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
