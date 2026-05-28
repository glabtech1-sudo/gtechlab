import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Boxes, 
  KeyRound, 
  ShieldAlert, 
  User, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Settings,
  Database,
  Building,
  Menu,
  X,
  Building2,
  CreditCard,
  Users as UsersIcon,
  BarChart3,
  Bell,
  Wrench
} from "lucide-react";
import { PortalUser, UserRole } from "../types";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  user: PortalUser;
  setUser: (user: PortalUser) => void;
  onOpenAi: () => void;
  onLogout?: () => void;
}

const ROLES: UserRole[] = ["Global Owner", "CTO Developer", "Finance Admin", "HR Manager", "Guest Client"];
const TENANTS = ["GLABTECH HQ (Europe)", "GLABTECH North America", "GLABTECH Global Corp", "Sandbox Testing Lab"];

export default function Sidebar({ currentTab, setTab, user, setUser, onOpenAi, onLogout }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact set of sidebar pages requested
  const navigationItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, desc: "Vue globale intelligente" },
    { id: "apps", label: "Applications", icon: Boxes, desc: "Gérer vos microservices unifiés" },
    { id: "organizations", label: "Organizations", icon: Building2, desc: "Multi-tenant logic silos" },
    { id: "billing", label: "Billing", icon: CreditCard, desc: "Cycle de facturation & Stripe" },
    { id: "users", label: "Users & Rôles", icon: UsersIcon, desc: "Fédération SSO d'utilisateurs" },
    { id: "analytics", label: "Analytics", icon: BarChart3, desc: "Trafics et latences de ping" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Fils d'alertes SecOps" },
    { id: "settings", label: "Settings", icon: Settings, desc: "Paramètres de sécurité & RSA" },
    { id: "support", label: "Support", icon: Wrench, desc: "Assistance VIP & Audit par IA" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden h-16 border-b border-white/10 bg-brand-blue/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 text-white">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-tr from-brand-orange to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/20 animate-float">
            <span className="font-mono text-white font-extrabold text-lg">G</span>
          </div>
          <span className="font-sans font-black text-lg tracking-wider text-white">GLABTECH</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenAi} 
            className="p-1.5 rounded-full bg-white/5 text-brand-orange hover:bg-white/10 transition-colors"
            title="Copilote IA"
          >
            <Sparkles className="h-5 w-5 animate-pulse text-brand-orange" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1.5 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar background overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0B1F3A]/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-16 bottom-0 left-0 w-72 bg-brand-blue border-r border-white/10 z-40 flex flex-col justify-between transition-transform duration-300 lg:top-0 lg:translate-x-0 text-white
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header section (Desktop) */}
        <div className="flex-1 overflow-y-auto select-none">
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-white/10">
            <div className="h-10 w-10 bg-gradient-to-tr from-brand-orange to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/25 animate-float">
              <span className="font-sans text-white font-black text-xl tracking-tighter">G</span>
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-xl tracking-tight text-white">GLABTECH</h1>
              <p className="text-[10px] font-mono tracking-widest text-brand-orange uppercase font-bold animate-glow">CONSOLES UNIFIÉES</p>
            </div>
          </div>

          {/* Tenant Quick Swap */}
          <div className="p-4 border-b border-white/10 bg-white/[0.02]">
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Tenant Actif</label>
            <div className="relative">
              <select 
                value={user.tenant}
                onChange={(e) => setUser({ ...user, tenant: e.target.value })}
                className="w-full text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-brand-orange/50 cursor-pointer hover:bg-white/10 transition-colors"
              >
                {TENANTS.map(t => <option key={t} value={t} className="bg-brand-blue text-white">{t}</option>)}
              </select>
              <ChevronRight className="h-4 w-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none rotate-90" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold px-2 mb-3">Espaces de travail</p>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                      ? "bg-white/10 text-white border-l-2 border-brand-orange shadow-orange-glow" 
                      : "text-slate-350 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 duration-300 ${isActive ? "text-brand-orange" : "text-slate-400 group-hover:text-brand-orange"}`} />
                  <div>
                    <p className="text-sm font-semibold tracking-wide">{item.label}</p>
                    <p className="text-[10px] text-slate-400 tracking-tight">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer profile area */}
        <div className="p-4 border-t border-white/10 bg-white/[0.01]">
          {profileOpen ? (
            <div className="bg-brand-blue/90 border border-white/10 rounded-xl p-3 mb-3 shadow-xl backdrop-blur-md animate-motion-in">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                <span className="text-xs font-bold text-slate-200">Ajuster le Rôle</span>
                <button onClick={() => setProfileOpen(false)} className="text-[10px] text-brand-orange hover:underline font-mono">Fermer</button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Rôle Utilisateur</label>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      let dept = "Administration";
                      if (r === "CTO Developer") dept = "Ingénierie";
                      if (r === "Finance Admin") dept = "Comptabilité";
                      if (r === "HR Manager") dept = "Ressources Humaines";
                      if (r === "Guest Client") dept = "Externe";
                      setUser({ ...user, role: r, department: dept });
                    }}
                    className="w-full text-xs bg-white/5 border border-white/10 text-white rounded-md p-1.5 focus:outline-none cursor-pointer"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role} className="bg-brand-blue text-white">{role}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5">
                  <span>MFA Sécurisé :</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${user.mfaEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-orange/15 text-brand-orange'}`}>
                    {user.mfaEnabled ? 'ACTIVE-JWT' : 'BYPASS'}
                  </span>
                </div>
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="w-full mt-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono text-[10px] rounded font-black cursor-pointer transition-colors text-center"
                  >
                    DÉCONNEXION DU SSO
                  </button>
                )}
              </div>
            </div>
          ) : null}

          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border border-white/20 bg-white/5" 
                  referrerPolicy="no-referrer"
                />
                <div className="h-2 w-2 rounded-full bg-brand-orange border border-brand-blue absolute right-0.5 bottom-0.5 animate-pulse shadow-orange-glow" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{user.name}</h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px] font-medium font-mono">{user.role}</p>
              </div>
            </div>
            <Settings className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}
