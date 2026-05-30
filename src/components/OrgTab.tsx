import React, { useState, useEffect } from "react";
import { 
  Building, 
  Users, 
  CreditCard,
  Crown,
  Check,
  CheckCircle2,
  Lock,
  Plus,
  RefreshCw,
  TrendingUp,
  Sliders
} from "lucide-react";
import { PortalUser } from "../types";

interface OrgTabProps {
  user: PortalUser;
  setUser: React.Dispatch<React.SetStateAction<PortalUser>>;
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export default function OrgTab({ user, setUser, onNotify }: OrgTabProps) {
  const [billingInfo, setBillingInfo] = useState({
    currentPlan: "Enterprise Premium",
    monthlyPrice: 349.00,
    seatsUsed: 14,
    seatsMax: 50,
  });

  const [activeOrg, setActiveOrg] = useState("GLABTECH HQ (Europe)");
  const [customApiKey, setCustomApiKey] = useState("");
  const [stripeConnected, setStripeConnected] = useState(false);

  // Load backend billing
  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch("/api/billing");
        if (res.ok) {
          const data = await res.json();
          const org = data.activeOrganizations.find((o: any) => o.label === activeOrg) || data.activeOrganizations[0];
          setBillingInfo({
            currentPlan: data.currentPlan,
            monthlyPrice: data.monthlyPrice,
            seatsUsed: org?.seatsUsed || 12,
            seatsMax: org?.seatsMax || 50,
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBilling();
  }, [activeOrg]);

  const handleSwitchPlan = async (planName: string, price: number) => {
    try {
      const res = await fetch("/api/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName })
      });
      if (res.ok) {
        const data = await res.json();
        setBillingInfo(prev => ({
          ...prev,
          currentPlan: data.currentPlan,
          monthlyPrice: data.monthlyPrice
        }));
        onNotify(`Abonnement GLABTECH mis à niveau : ${planName}`, "success");
      }
    } catch (e) {
      onNotify("Erreur de modification du plan tarifaire.", "warn");
    }
  };

  const handleSwitchOrg = (orgName: string) => {
    setActiveOrg(orgName);
    setUser(prev => ({
      ...prev,
      tenant: orgName
    }));
    onNotify(`Changement de contexte organisation : ${orgName}`, "info");
  };

  return (
    <div className="space-y-6 premium-gradient-bg">

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Tenant Orgs & Team Seats */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Tenant switch widget */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium">
            <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
              <Building className="h-5 w-5 text-brand-orange animate-pulse" /> Structure Multi-Tenant de l'Organisation
            </h3>
            <p className="text-xs text-slate-500 mt-2.5 mb-5 font-medium leading-relaxed">
              La plateforme GLABTECH isole logiquement les bases de données par organisation ("tenant"). Basculez instantanément de contexte ci-dessous.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "GLABTECH HQ (Europe)", region: "europe-west2 (GCP)", databases: "6 micro-dbs Active" },
                { name: "Sandbox Testing Lab", region: "europe-west3 (GCP)", databases: "3 micro-dbs Active" },
              ].map((org) => {
                const isSelected = activeOrg === org.name;
                return (
                  <button
                    key={org.name}
                    onClick={() => handleSwitchOrg(org.name)}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected 
                        ? "border-brand-orange bg-brand-orange/[0.02] shadow-premium scale-[1.01]" 
                        : "border-slate-100 hover:border-brand-blue/15 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0B1F3A]">{org.name}</span>
                      {isSelected && <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse shadow-orange-glow" />}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-1.5 font-bold">Région Cloud : {org.region}</p>
                    <p className="text-[10px] font-mono font-black mt-3 text-brand-orange uppercase tracking-wide">{org.databases}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User management simulator list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-orange" /> Collaborateurs & Permissions SSO
                </h3>
                <p className="text-[11.5px] text-slate-400 mt-1 font-bold">Membres affiliés au tenant : {activeOrg}</p>
              </div>
              <span className="text-[10px] font-mono font-black px-3 py-1 rounded-full bg-[#F5F7FA] text-brand-blue border border-brand-blue/5">
                {billingInfo.seatsUsed} / {billingInfo.seatsMax} collaborateurs
              </span>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-55 bg-[#F5F7FA]/30">
              {[
                { name: "Glabtech Admin", email: "glabtech1@gmail.com", role: "Global Owner", access: "Toutes subdomains", status: "Actif" },
                { name: "Marc Dupont", email: "m.dupont@glabeboutique.com", role: "Manager CRM/Facture", access: "crm.glabeboutique.com", status: "Actif" },
                { name: "Sophie Laurent", email: "s.laurent@glabeboutique.com", role: "Directeur Clinique", access: "hopital.glabeboutique.com", status: "Actif" },
                { name: "Yann Dubois", email: "y.dubois@glabeboutique.com", role: "Technicien POS", access: "resto.glabeboutique.com", status: "Hors-ligne" },
              ].map((member, i) => (
                <div key={i} className="p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-brand-blue font-black">{member.name}</strong>
                      <span className="text-[9.5px] bg-[#F5F7FA] border border-brand-blue/5 px-2.5 py-0.5 rounded-full text-brand-blue font-mono font-extrabold">{member.role}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-450 font-mono mt-1 font-semibold">{member.email}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[9.5px] text-slate-400 uppercase font-mono block">Droits SSO</span>
                      <strong className="text-xs text-slate-700 font-mono font-bold">{member.access}</strong>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_1px_rgba(16,185,129,0.35)]" title={member.status} />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNotify("Formulaire d'invitation SSO envoyé par e-mail en mode Sandbox.", "info")}
              className="mt-5 w-full border border-dashed border-slate-250 hover:border-brand-orange hover:bg-brand-orange/[0.01] transition-all text-slate-600 hover:text-brand-orange text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Inviter un nouvel ingénieur ou collaborateur
            </button>
          </div>

        </div>

        {/* Column 2: Subscription Plans & Paid integrations */}
        <div className="space-y-6">
          
          {/* Pricing Selector cards */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium space-y-5">
            <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-orange" /> Gestion de l'abonnement
            </h3>
            
            <div className="bg-brand-blue text-white rounded-2xl p-5 relative overflow-hidden shadow-premium">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center pointer-events-none"></div>
              <Crown className="h-5 w-5 text-brand-orange absolute top-4 right-4 animate-float" />
              <span className="text-[10px] font-mono tracking-widest text-[#FF7A00] uppercase font-black">Plan Actuel</span>
              <h4 className="text-base font-extrabold mt-1.5">{billingInfo.currentPlan}</h4>
              <p className="text-3xl font-black mt-2.5 text-white">{billingInfo.monthlyPrice}€<span className="text-xs text-[#F5F7FA]/70 font-normal"> /mois</span></p>
              <p className="text-[10px] text-slate-350 mt-3 font-mono">Facturation Hostinger unifiée • Prochaine échéance le 27 Juin 2026</p>
            </div>

            {/* Simulated Upgrades */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-widest font-black block">Changer de palier SaaS</span>
              
              <button 
                onClick={() => handleSwitchPlan("Enterprise Premium", 349)}
                className={`w-full text-left p-4 rounded-xl border text-xs flex justify-between items-center transition-all cursor-pointer ${
                  billingInfo.currentPlan === "Enterprise Premium" 
                    ? "border-brand-orange bg-[#F5F7FA]/70 shadow-sm" 
                    : "border-slate-100 hover:border-brand-blue/15"
                }`}
              >
                <div>
                  <strong className="text-brand-blue font-black block">Enterprise Premium (Odoo/Zoho)</strong>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-medium">Multi-tenant illimité • SSO federated • JWT</p>
                </div>
                <span className="font-mono font-black text-brand-blue">349€</span>
              </button>

              <button 
                onClick={() => handleSwitchPlan("Pro Scale", 149)}
                className={`w-full text-left p-4 rounded-xl border text-xs flex justify-between items-center transition-all cursor-pointer ${
                  billingInfo.currentPlan === "Pro Scale" 
                    ? "border-brand-orange bg-[#F5F7FA]/70 shadow-sm" 
                    : "border-slate-100 hover:border-brand-blue/15"
                }`}
              >
                <div>
                  <strong className="text-brand-blue font-black block">Pro Scale Edition</strong>
                  <p className="text-[10px] text-slate-450 mt-0.5 font-medium font-semibold">Jusqu'à 3 sous-domaines • API Gateway</p>
                </div>
                <span className="font-mono font-black text-brand-blue">149€</span>
              </button>
            </div>
          </div>

          {/* Stripe credentials payment simulation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium space-y-4">
            <h3 className="font-extrabold text-sm text-brand-blue flex items-center gap-2">
              <Sliders className="h-5 w-5 text-brand-orange" /> Intégration Passerelle Stripe
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Raccordez de vrais paiements pour vos fiches clients e-commerce. Déclenche des webhooks instantanément.
            </p>

            <div className="space-y-2.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black block">Clé Publique Test Stripe (pk_test_...)</span>
              <input 
                type="text" 
                placeholder="Introduisez votre clé pk_test_..."
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl py-3 px-3.5 focus:outline-none focus:ring-1 focus:ring-brand-orange/45 text-brand-blue font-medium bg-[#F5F7FA]/70 focus:bg-white transition-all"
              />
              <button 
                onClick={() => {
                  if (customApiKey.trim()) {
                    setStripeConnected(true);
                    onNotify("Clé API Stripe Test sauvegardée avec succès.", "success");
                  } else {
                    onNotify("Veuillez introduire une clé valide.", "warn");
                  }
                }}
                className="w-full bg-brand-blue hover:bg-slate-900 text-white text-xs font-black py-3 rounded-xl transition-all cursor-pointer shadow-premium"
              >
                Enregistrer la clé test
              </button>
            </div>

            {stripeConnected && (
              <div className="bg-brand-blue p-4 rounded-xl border border-white/5 text-[10.5px] text-[#F5F7FA] font-mono space-y-1.5 shadow-inner">
                <span className="font-bold flex items-center gap-1.5 text-brand-orange">● PASSERELLE STRIPE CONNECTABLE</span>
                <p className="text-[9.5px] text-slate-300 leading-normal">Trafic redirigé vers : market.glabeboutique.com pour les facturations clients l'après-midi.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
