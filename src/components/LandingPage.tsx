import React, { useState } from "react";
import { 
  Building, 
  Utensils, 
  TrendingUp, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Fingerprint, 
  ArrowRight, 
  Boxes, 
  Users, 
  Check,
  Star,
  Layers,
  Heart,
  ExternalLink,
  Laptop,
  Cloud,
  CreditCard,
  Bell,
  Clock,
  Compass,
  DollarSign,
  Shield,
  Zap,
  BarChart2,
  X,
  Play,
  HelpCircle,
  Award,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  MessageCircle,
  Music,
  Globe,
  Lock,
  RefreshCw
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: (mode?: "login" | "register") => void;
}

interface AppItem {
  id: string;
  name: string;
  category: "sales" | "ops" | "finance" | "hr";
  desc: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  bgColorClass: string;
  accentColor: string;
  domain: string;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  // 1. App Selector Game (Odoo style)
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<"hotel" | "resto" | "crm" | "erp">("hotel");

  // Setup Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardApp, setWizardApp] = useState<AppItem | null>(null);
  
  // Form fields
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Togo");
  const [language, setLanguage] = useState("Français");
  const [companySize, setCompanySize] = useState("10-50");
  const [companyName, setCompanyName] = useState("");
  const [customSubdomain, setCustomSubdomain] = useState("");

  // Simulation State
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [simId, setSimId] = useState("");
  const [simStatus, setSimStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const handleCompanyNameChange = (val: string) => {
    setCompanyName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .trim()
      .replace(/\s+/g, "-") // replace spaces with dashes
      .replace(/-+/g, "-"); // merge multi-dashes
    setCustomSubdomain(slug || "entreprise");
  };

  const handleStartSuiteTrial = () => {
    const appToUse = appsList.find(a => a.id === activeSimulatorTab) || appsList.find(a => selectedApps.includes(a.id)) || appsList[0];
    setWizardApp(appToUse);
    setIsWizardOpen(true);
  };

  const appsList: AppItem[] = [
    {
      id: "crm",
      name: "G-CRM",
      category: "sales",
      desc: "Gagnez plus de contrats via notre pipeline Kanban et scoring de leads par IA.",
      icon: TrendingUp,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "crm.glabtech.com"
    },
    {
      id: "resto",
      name: "G-RESTO POS",
      category: "ops",
      desc: "Prise de commande mobile, envoi en cuisine, impression de tickets & plan de salle.",
      icon: Utensils,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "resto.glabtech.com"
    },
    {
      id: "hotel",
      name: "G-HOTEL PMS",
      category: "ops",
      desc: "Planning visuel des réservations de chambres, arrivées/départs et facturation.",
      icon: Building,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "hotel.glabtech.com"
    },
    {
      id: "erp",
      name: "G-ERP FINANCES",
      category: "finance",
      desc: "Rapprochement bancaire, écritures comptables automatisées, comptes de résultats.",
      icon: Briefcase,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "erp.glabtech.com"
    },
    {
      id: "market",
      name: "G-MARKET",
      category: "sales",
      desc: "Créez votre boutique en ligne de luxe, catalogue connecté et tunnel Stripe.",
      icon: DollarSign,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "market.glabtech.com"
    },
    {
      id: "travel",
      name: "G-TRAVEL",
      category: "ops",
      desc: "Logistique des déplacements professionnels, notes de frais et flottes de transport.",
      icon: Compass,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "travel.glabtech.com"
    },
    {
      id: "hr",
      name: "G-RH",
      category: "hr",
      desc: "Suivi des fiches de paie, gestion des congés et portail collaborateurs SSO.",
      icon: Users,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "rh.glabtech.com"
    },
    {
      id: "project",
      name: "G-PROJECT",
      category: "ops",
      desc: "Agile Kanban, diagrammes de Gantt, heures facturables et collaboration active.",
      icon: Layers,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "project.glabtech.com"
    },
    {
      id: "secops",
      name: "G-SECOPS",
      category: "finance",
      desc: "Identity Provider unifié, rotation de clés d'API asymétriques RSA et pare-feu.",
      icon: Shield,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "secops.glabtech.com"
    },
    {
      id: "marketing",
      name: "G-CAMPAIGNS",
      category: "sales",
      desc: "Relance client automatisée, modèles HTML esthétiques et newsletter unifiée.",
      icon: Zap,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "marketing.glabtech.com"
    },
    {
      id: "billing",
      name: "G-INVOICES",
      category: "finance",
      desc: "Factures dématérialisées conformes, relance de retards et paiements récurrents.",
      icon: CreditCard,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "invoices.glabtech.com"
    },
    {
      id: "chat",
      name: "G-DISCUSS",
      category: "hr",
      desc: "Messagerie d'entreprise unifiée, salons sécurisés et alertes système instantanées.",
      icon: Bell,
      colorClass: "text-[#FF7A00]",
      bgColorClass: "bg-[#FF7A00]/5 border-[#FF7A00]/15",
      accentColor: "#FF7A00",
      domain: "discuss.glabtech.com"
    }
  ];

  const toggleAppSelection = (id: string) => {
    if (selectedApps.includes(id)) {
      setSelectedApps(selectedApps.filter(appId => appId !== id));
    } else {
      setSelectedApps([...selectedApps, id]);
    }
  };

  const handleStartTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !email || !customSubdomain) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const response = await fetch("/api/trial-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: wizardApp?.id || "unknown",
          appName: wizardApp?.name || "Application unifiée G-LAB TECH",
          ownerName,
          email,
          phone,
          country,
          language,
          companySize,
          subdomain: customSubdomain
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSimId(data.id);
        setSimStatus("pending");
        setIsWizardOpen(false);
        setIsSimulationOpen(true);
      } else {
        alert("Une erreur s'est produite lors de l'envoi de la demande d'approbation.");
      }
    } catch (err) {
      console.error(err);
      setSimId(`trial-${Math.random().toString(36).substring(2, 9)}`);
      setSimStatus("pending");
      setIsWizardOpen(false);
      setIsSimulationOpen(true);
    }
  };

  const clearSelection = () => {
    setSelectedApps([]);
  };

  const selectAll = () => {
    setSelectedApps(appsList.map(a => a.id));
  };

  const appCount = selectedApps.length;
  const isSoloActive = appCount === 1;
  const isStandardActive = appCount > 1;

  const tabData = {
    hotel: {
      title: "G-LAB Hôtel & Hébergement",
      domain: "hotel.glabtech.com",
      badge: "Système de Réservation Intégré (PMS)",
      desc: "Gérez l'attribution des chambres, les check-ins/check-outs de vos clients, les plannings d'entretien ménager et collectez des paiements instantanés.",
      features: [
        "Planification visuelle du tableau des chambres",
        "Rapprochement bancaire et flux Stripe direct",
        "SSO instantané raccordé aux identités de l'entreprise"
      ],
      tagColor: "text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/20",
      buttonColor: "bg-[#FF7A00] hover:bg-[#E06B00]",
      icon: Building,
      badgeText: "CHAMBRES & CLIENTS"
    },
    resto: {
      title: "G-LAB Resto & POS",
      domain: "resto.glabtech.com",
      badge: "Caisse & Point de Vente Restaurant",
      desc: "Prise de commande sur tablette, plan de salle graphique interactif, transmission cuisine instantanée et division de notes de facturation.",
      features: [
        "Plan de salle 2D personnalisable en direct",
        "Synchro instantanée avec les stocks et la comptabilité",
        "Mode hors-ligne résistant aux coupures internet"
      ],
      tagColor: "text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/20",
      buttonColor: "bg-[#FF7A00] hover:bg-[#E06B00]",
      icon: Utensils,
      badgeText: "STATION COMMANDE POS"
    },
    crm: {
      title: "G-LAB Pipeline Ventes & CRM",
      domain: "crm.glabtech.com",
      badge: "Suivi des opportunités clients de l'élite",
      desc: "Suivez vos prospects à travers des phases claires, planifiez des relances et automatisez vos propositions commerciales pour conclure plus de deals.",
      features: [
        "Tableau Kanban de suivi d'affaires interactif",
        "Formulaire de capture de leads auto-généré",
        "Fiches partenaires enrichies unifiées par tenant"
      ],
      tagColor: "text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/20",
      buttonColor: "bg-[#FF7A00] hover:bg-[#E06B00]",
      icon: TrendingUp,
      badgeText: "PIPELINE COMMERCIAUX"
    },
    erp: {
      title: "G-LAB ERP Comptabilité & Finance",
      domain: "erp.glabtech.com",
      badge: "Grand livre & écritures multi-applications",
      desc: "Rapprochez automatiquement vos transactions bancaires, préparez votre bilan, suivez vos amortissements et générez vos déclarations fiscales.",
      features: [
        "Génération automatique d'écritures de devises",
        "Rapprochement bancaire alimenté par IA Gemini",
        "Module de paye et fiches de contrats intégrés"
      ],
      tagColor: "text-[#FF7A00] bg-[#FF7A00]/10 border-[#FF7A00]/20",
      buttonColor: "bg-[#FF7A00] hover:bg-[#E06B00]",
      icon: Briefcase,
      badgeText: "COMPTABILITÉ G-ERP"
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1F3A] flex flex-col font-sans selection:bg-[#FF7A00] selection:text-white">
      
      {/* 1. Header Navigation (Odoo.com style) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#0B1F3A]/5 px-6 py-4.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3 select-none">
            <div className="h-10 w-10 bg-[#0B1F3A] rounded-xl flex items-center justify-center shadow-lg shadow-[#0B1F3A]/10 border border-white/10">
              <span className="font-sans text-[#FF7A00] font-black text-xl tracking-tighter">g</span>
            </div>
            <div>
              <span className="font-sans font-black text-xl tracking-tight text-[#0B1F3A]">
                G-LAB<span className="text-[#FF7A00]">TECH</span>
              </span>
              <p className="text-[8px] font-mono tracking-widest text-[#FF7A00] uppercase font-black">All-In-One Enterprise Platform</p>
            </div>
          </div>

          {/* Odoo Style Menu link hoverers */}
          <nav className="hidden lg:flex items-center gap-9 text-xs font-black uppercase tracking-wider text-[#0B1F3A]/80">
            <div className="group relative py-2">
              <button className="hover:text-[#FF7A00] transition-colors flex items-center gap-1 cursor-pointer">
                <span>Nos Applications</span>
                <ChevronRight className="h-3.5 w-3.5 rotate-90 text-[#0B1F3A]/40 group-hover:text-[#FF7A00] transition-colors" />
              </button>
              
              {/* Odoo multi-column sub-navigation mockup */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-[540px] bg-white border border-[#0B1F3A]/10 rounded-2xl shadow-xl p-5 hidden group-hover:block transition-all z-50">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#FF7A00] font-black mb-3 border-b pb-2">SOLUTIONS INTERCONNECTÉES</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2.5 hover:bg-[#F5F7FA] rounded-xl cursor-pointer text-left" onClick={() => onEnterApp()}>
                    <p className="font-extrabold text-xs text-[#0B1F3A]">🚀 G-CRM & G-MARKET</p>
                    <p className="text-[10px] text-[#0B1F3A]/60 lowercase normal-case mt-0.5">Suivi de leads, scoring IA et ventes en ligne connectées</p>
                  </div>
                  <div className="p-2.5 hover:bg-[#F5F7FA] rounded-xl cursor-pointer text-left" onClick={() => onEnterApp()}>
                    <p className="font-extrabold text-xs text-[#0B1F3A]">🏨 G-HOTEL & G-RESTO</p>
                    <p className="text-[10px] text-[#0B1F3A]/60 lowercase normal-case mt-0.5">PMS complet de planning des chambres et Point De Vente</p>
                  </div>
                  <div className="p-2.5 hover:bg-[#F5F7FA] rounded-xl cursor-pointer text-left" onClick={() => onEnterApp()}>
                    <p className="font-extrabold text-xs text-[#0B1F3A]">💼 G-ERP & COMPTABILITÉ</p>
                    <p className="text-[10px] text-[#0B1F3A]/60 lowercase normal-case mt-0.5">Rapprochement bancaire, écritures comptables et rapports financiers</p>
                  </div>
                  <div className="p-2.5 hover:bg-[#F5F7FA] rounded-xl cursor-pointer text-left" onClick={() => onEnterApp()}>
                    <p className="font-extrabold text-xs text-[#0B1F3A]">🔒 SSO & SECURE API</p>
                    <p className="text-[10px] text-[#0B1F3A]/60 lowercase normal-case mt-0.5">Rotations de clés d'API asymétriques RSA et pare-feu</p>
                  </div>
                </div>
              </div>
            </div>
            
            <a href="#integrations" className="hover:text-[#FF7A00] transition-colors">Notre Force</a>
            <a href="#interactive" className="hover:text-[#FF7A00] transition-colors">Démos Live</a>
            <a href="#pricing" className="hover:text-[#FF7A00] transition-colors">Prix Disruptifs</a>
          </nav>

          {/* Action Call for Login/Register */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onEnterApp("login")}
              className="px-4.5 py-2.5 text-xs font-black uppercase tracking-wider text-[#0B1F3A] hover:text-[#FF7A00] transition-colors cursor-pointer"
            >
              Se connecter
            </button>
            <button 
              onClick={handleStartSuiteTrial}
              className="bg-[#FF7A00] hover:bg-[#E06B00] text-white px-5.5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-md hover:shadow-[#FF7A00]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 border-none"
            >
              <span>Essai gratuit</span>
              <ArrowRight className="h-4.5 w-4.5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section - Elegant premium high headers */}
      <main className="flex-1">
        <section className="relative pt-16 pb-26 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FFFFFF] to-[#F5F7FA] border-b border-[#0B1F3A]/5">
          <div className="absolute top-0 right-1/4 w-[550px] h-[550px] bg-[#FF7A00]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#0B1F3A]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            
            {/* Odoo Style Badge + High Catchphrase */}
            <div className="max-w-4xl mx-auto space-y-5 mb-11">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#0B1F3A] leading-[1.05] font-sans">
                Vos employés d'exception <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#E06B00]">
                  méritent des outils d'exception.
                </span>
              </h1>
              <p className="text-sm md:text-base text-[#0B1F3A]/70 max-w-2xl mx-auto font-semibold leading-relaxed">
                Connectez tous vos métiers en quelques clics : hôtel, restaurant, factures et comptabilité. Finis les abonnements fragmentés et les imports manuels récurrents.
              </p>
            </div>

            {/* Odoo App Chooser Playground (Interactive Board) */}
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-[#0B1F3A]/5 shadow-xl p-6 sm:p-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0B1F3A] to-[#12315C] text-white text-[9px] font-mono tracking-widest font-black uppercase px-4 py-2 rounded-full shadow-md z-20 border border-white/10">
                APPLICATION SWITCHBOARD — SÉLECTIONNEZ POUR TESTER LA LIANCE
              </div>

              {/* Dynamic Select controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F5F7FA] pb-5 mb-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0B1F3A]/40">Actions de masse :</span>
                  <button 
                    onClick={selectAll} 
                    className="text-xs font-black text-[#FF7A00] hover:underline cursor-pointer border-none bg-none outline-none"
                  >
                    Sélectionner l'ensemble (12 applications)
                  </button>
                  <span className="text-[#0B1F3A]/20">•</span>
                  <button 
                    onClick={clearSelection} 
                    className="text-xs font-black text-[#0B1F3A]/60 hover:underline cursor-pointer border-none bg-none outline-none"
                  >
                    Tout désélectionner
                  </button>
                </div>
                <div className="text-xs text-[#0B1F3A]/50 font-bold bg-[#F5F7FA] px-3 py-1 rounded-md">
                  {selectedApps.length} brique{selectedApps.length > 1 ? 's' : ''} connectée{selectedApps.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Selection cards matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {appsList.map((app) => {
                  const IconComponent = app.icon;
                  const isSelected = selectedApps.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      onClick={() => toggleAppSelection(app.id)}
                      className={`relative rounded-2xl border p-4 text-left cursor-pointer transition-all select-none flex flex-col justify-between group ${
                        isSelected 
                          ? "border-[#FF7A00] bg-[#FF7A00]/5 scale-[1.02] shadow-md ring-2 ring-[#FF7A00]/10 pb-4 min-h-[185px]" 
                          : "border-[#0B1F3A]/5 bg-[#F5F7FA]/50 hover:bg-white hover:border-[#0B1F3A]/15 hover:shadow-sm min-h-[145px]"
                      }`}
                      style={{ contentVisibility: "auto" }}
                    >
                      {/* Check indicator circle */}
                      <span 
                        className={`absolute top-3.5 right-3.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] border transition-all ${
                          isSelected 
                            ? "bg-[#FF7A00] border-[#FF7A00] text-white" 
                            : "border-[#0B1F3A]/10 bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </span>

                      {/* Accent colors */}
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center border bg-white shadow-sm group-hover:scale-105 transition-transform border-[#0B1F3A]/5`}>
                        <IconComponent className={`h-6 w-6 text-[#FF7A00]`} />
                      </div>

                      {/* Meta context info */}
                      <div className="mt-3 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="font-extrabold text-xs text-[#0B1F3A] tracking-tight">{app.name}</p>
                          <span className="text-[8px] font-mono text-[#0B1F3A]/40">{app.domain}</span>
                        </div>
                        <p className="text-[10px] text-[#0B1F3A]/60 font-semibold line-clamp-2 leading-relaxed mt-0.5">
                          {app.desc}
                        </p>
                      </div>

                      {/* Play Commencer CTA */}
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWizardApp(app);
                            setIsWizardOpen(true);
                          }}
                          className="mt-3 px-3 py-2 text-[11px] font-extrabold text-white bg-[#FF7A00] hover:bg-[#E06B00] rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer border-0 w-full animate-bounce"
                        >
                          <Play className="h-3 w-3 fill-white text-white" />
                          Commencer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Odoo Pricing Dynamic Widget bar */}
              <div className="mt-8 border-t border-[#F5F7FA] pt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#F5F7FA]/80 -mx-6 -mb-6 p-6 rounded-b-3xl">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                    <p className="text-[10px] font-mono tracking-wide text-[#FF7A00] font-black uppercase">FUSION DE LICENCE EN DIRECT</p>
                  </div>
                  {appCount === 0 ? (
                    <div>
                      <p className="font-black text-base text-[#0B1F3A]">Aucun module sélectionné</p>
                      <p className="text-[11px] text-[#0B1F3A]/50 font-bold">Sélectionnez une brique pour évaluer votre abonnement G-LAB.</p>
                    </div>
                  ) : isSoloActive ? (
                    <div>
                      <p className="font-black text-base text-[#0B1F3A]">Offre Unique : <span className="text-[#FF7A00]">100% GRATUIT EN DIRECT</span></p>
                      <p className="text-[11px] text-[#0B1F3A]/50 font-bold">La brique <b className="text-[#0B1F3A] font-extrabold">{appsList.find(a => a.id === selectedApps[0])?.name}</b> est gratuite à vie pour un nombre d'utilisateurs illimité !</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-black text-base text-[#0B1F3A]">Licence unifiée de la Suite : <span className="text-[#FF7A00]">99 € / mois</span> tout inclus !</p>
                      <p className="text-[11px] text-[#0B1F3A]/60 font-bold">Base de données PostgreSQL isolée, SSO unique, SSL et utilisateurs illimités pour les {appCount} applications actives.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {appCount > 0 && (
                    <button
                      onClick={() => {
                        if (isSoloActive) {
                          onEnterApp("register");
                        } else {
                          handleStartSuiteTrial();
                        }
                      }}
                      className="bg-[#FF7A00] hover:bg-[#E06B00] text-white px-7 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#FF7A00]/15 hover:shadow-[#FF7A00]/25 transition-all text-center flex items-center gap-1.5 cursor-pointer border-none"
                    >
                      <span>
                        {isSoloActive ? "Activer l'application gratuite" : "Commencer l'essai de la suite"}
                      </span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  )}
                  {appCount === 0 && (
                    <button
                      onClick={selectAll}
                      className="bg-[#0B1F3A] text-white hover:bg-[#12315C] px-6 py-3.5 rounded-xl text-xs font-black transition-colors cursor-pointer border-none"
                    >
                      Activer tout le pack unifié
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 3. The Integration Nightmare Section (Why G-LAB) */}
        <section id="integrations" className="py-24 bg-white border-b border-[#0B1F3A]/5">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-mono font-black text-[#FF7A00] uppercase tracking-widest block">ZERO CODE D'INTÉGRATION</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] tracking-tight">Oubliez la complexité des intégrations tierces.</h2>
              <p className="text-sm text-[#0B1F3A]/60 font-semibold leading-relaxed">
                Connecter des logiciels tiers avec des scripts instables et des webhooks qui échouent constamment est une ruine technologique. G-LAB est né unifié.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Left Side: Fragmented Traditional Way */}
              <div className="bg-[#F5F7FA] rounded-3xl p-8 border border-[#0B1F3A]/5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-wider">L'approche fragmentée</span>
                    <span className="text-[10px] text-[#0B1F3A]/40 font-bold font-mono">12 Abonnements, 12 Factures</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-[#0B1F3A] mb-3">Une architecture incohérente et fragile.</h3>
                  <p className="text-xs text-[#0B1F3A]/60 leading-relaxed font-semibold">
                    Vous raccordez laborieusement des solutions isolées via des connecteurs tiers. Résultat : pertes régulières de synchronisation :
                  </p>

                  {/* Wire instances list */}
                  <div className="mt-6 space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[#0B1F3A]/80 font-bold">Synchronisation CRM → Comptabilité</span>
                      </div>
                      <span className="text-red-500 font-mono font-bold text-[9px] uppercase tracking-wider">Échec de l'API (Erreur 502)</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-red-400 rounded-full" />
                        <span className="text-[#0B1F3A]/85 font-semibold">Rapprochement manuel de point de vente</span>
                      </div>
                      <span className="text-[#0B1F3A]/50 font-mono font-bold text-[9px]">Fichiers exportés .CSV à 2h du matin</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-red-455 rounded-full" />
                        <span className="text-[#0B1F3A]/85 font-semibold">Authentifications multiples utilisateurs</span>
                      </div>
                      <span className="text-[#0B1F3A]/50 font-mono font-bold text-[9px]">12 mots de passe par collaborateur</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#0B1F3A]/5 flex items-center gap-3 text-xs text-red-500 font-bold">
                  <X className="h-5 w-5 bg-red-50 rounded-full p-0.5 flex-shrink-0" />
                  <span>Résultat : Des bases de données contradictoires, des heures perdues et de la frustration.</span>
                </div>
              </div>

              {/* Right Side: G-LAB Native Architecture */}
              <div className="bg-gradient-to-br from-[#FF7A00]/10 to-white rounded-3xl p-8 border-2 border-[#FF7A00] relative flex flex-col justify-between shadow-lg shadow-[#FF7A00]/5">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono font-black text-[#FF7A00] bg-white px-3 py-1 rounded-full border border-[#FF7A00]/10 uppercase tracking-wider">SUITE SAAS UNIFIÉE G-LAB</span>
                    <span className="text-[11px] text-emerald-600 font-black tracking-wide font-mono">★ COOPÉRATION NATIVE</span>
                  </div>

                  <h3 className="text-xl font-black text-[#0B1F3A] mb-3">La cohésion absolue par partage de schéma.</h3>
                  <p className="text-xs text-[#0B1F3A]/70 leading-relaxed font-semibold">
                    Nos applications communiquent nativement avec une base de données consolidée PostgreSQL gérée par Prisma client. Dès qu'un client réserve une chambre ou règle en Point de Vente :
                  </p>

                  {/* Connected flows */}
                  <div className="mt-6 space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-[#FF7A00]/15 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
                        <span className="text-[#0B1F3A] font-extrabold">Réservation Hôtel (G-HOTEL)</span>
                      </div>
                      <span className="text-emerald-600 font-mono font-extrabold text-[9px] uppercase tracking-wider">→ Facture G-INVOICES générée</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#FF7A00]/15 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
                        <span className="text-[#0B1F3A] font-extrabold">Encaissement Point de Vente (G-RESTO)</span>
                      </div>
                      <span className="text-emerald-600 font-mono font-extrabold text-[9px] uppercase tracking-wider">→ Écriture comptable G-ERP instantanée</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#FF7A00]/15 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
                        <span className="text-[#0B1F3A] font-extrabold">Authentification unique (SSO)</span>
                      </div>
                      <span className="text-emerald-600 font-mono font-extrabold text-[9px] uppercase tracking-wider">Un seul ID unifié pour tout l'écosystème</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#FF7A00]/15 flex items-center gap-3 text-xs text-[#FF7A00] font-bold">
                  <Check className="h-5 w-5 bg-[#FF7A00]/10 rounded-full p-0.5 flex-shrink-0" />
                  <span>Aucun middleware requis. Tout communique directement en temps réel avec une totale isolation logique.</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. Tabbed Real-Life Application Console Simulator */}
        <section id="interactive" className="py-24 bg-[#F5F7FA] border-b border-[#0B1F3A]/5">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A]">Tester nos consoles d'administration unifiées</h2>
              <p className="text-sm text-[#0B1F3A]/60 font-semibold leading-relaxed">
                Naviguez ci-dessous entre les démonstrateurs d'administration des différents pôles pour constater le SSO unifié.
              </p>
            </div>

            {/* Sidebar selectors & terminal chassis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Selector Side */}
              <div className="lg:col-span-4 space-y-3">
                {(Object.keys(tabData) as Array<keyof typeof tabData>).map((key) => {
                  const item = tabData[key];
                  const isCur = activeSimulatorTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSimulatorTab(key)}
                      className={`w-full text-left p-4.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer border-none outline-none ${
                        isCur 
                          ? `bg-[#0B1F3A] text-white shadow-xl scale-[1.01]`
                          : "bg-white hover:bg-[#F5F7FA] border border-[#0B1F3A]/5 text-[#0B1F3A]"
                      }`}
                    >
                      <div>
                        <p className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isCur ? "text-[#FF7A00]" : "text-[#0B1F3A]/40"}`}>{item.domain}</p>
                        <p className={`text-xs font-black mt-0.5 ${isCur ? "text-white" : "text-[#0B1F3A]"}`}>{item.title.split(" & ")[0]}</p>
                      </div>
                      <ChevronRight className={`h-4.5 w-4.5 transition-transform ${isCur ? "translate-x-1 text-[#FF7A00]" : "text-[#0B1F3A]/30"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Central high-fidelity interactive dashboard mock */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#0B1F3A]/5 px-6 py-8.5 shadow-xl flex flex-col justify-between min-h-[460px] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF7A00] to-[#0B1F3A]" />
                
                {/* Simulator Content */}
                <div className="space-y-6 text-left">
                  
                  {/* Top bar inside simulation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F7FA] pb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[9px] font-black tracking-widest rounded-md border uppercase ${tabData[activeSimulatorTab].tagColor}`}>
                        {tabData[activeSimulatorTab].badgeText}
                      </span>
                      <span className="text-[10px] text-[#0B1F3A]/40 font-bold font-mono">
                        {tabData[activeSimulatorTab].domain}
                      </span>
                    </div>
                    
                    <span className="text-[10px] font-mono font-black text-emerald-500 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> SSO ACTIF AVEC REPLICATOR ENGINE
                    </span>
                  </div>

                  {/* Main feature description */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      {React.createElement(tabData[activeSimulatorTab].icon, { className: "h-6 w-6 text-[#FF7A00]" })}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0B1F3A] tracking-tight">{tabData[activeSimulatorTab].title}</h3>
                      <p className="text-xs text-[#0B1F3A]/60 mt-1 leading-relaxed font-semibold">
                        {tabData[activeSimulatorTab].desc}
                      </p>
                    </div>
                  </div>

                  {/* Operational indicators bar mockup */}
                  <div className="bg-[#F5F7FA] border border-[#0B1F3A]/5 p-4.5 rounded-2xl">
                    <p className="text-[9px] font-mono uppercase text-[#0B1F3A]/40 tracking-wider font-extrabold mb-3">TÉLÉMÉTRIE D'ACTIVITÉ EN TEMPS RÉEL (CONSOLE) :</p>
                    
                    {activeSimulatorTab === "hotel" && (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Chambres Occupées</p>
                          <p className="text-base font-black text-[#FF7A00] mt-1">94%</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Arrivées / Check-ins</p>
                          <p className="text-base font-black text-[#0B1F3A] mt-1">14</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Recette Journée</p>
                          <p className="text-base font-black text-emerald-600 mt-1">1 845 €</p>
                        </div>
                      </div>
                    )}

                    {activeSimulatorTab === "resto" && (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Tables Actives</p>
                          <p className="text-base font-black text-[#FF7A00] mt-1">18 / 22</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Panier moyen</p>
                          <p className="text-base font-black text-[#0B1F3A] mt-1">38.4 €</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Plats en Cuisine</p>
                          <p className="text-base font-black text-emerald-600 mt-1">4 actifs</p>
                        </div>
                      </div>
                    )}

                    {activeSimulatorTab === "crm" && (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Leads capturés</p>
                          <p className="text-base font-black text-[#FF7A00] mt-1">+18 aujourd'hui</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Valeur du Pipeline</p>
                          <p className="text-base font-black text-[#0B1F3A] mt-1">142 500 €</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Taux conversion</p>
                          <p className="text-base font-black text-emerald-600 mt-1">19.2%</p>
                        </div>
                      </div>
                    )}

                    {activeSimulatorTab === "erp" && (
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">Écritures lettrées</p>
                          <p className="text-base font-black text-[#FF7A00] mt-1">99.7%</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">TVA Déductible</p>
                          <p className="text-base font-black text-[#0B1F3A] mt-1">12 405 €</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-[#0B1F3A]/5">
                          <p className="text-[9px] text-[#0B1F3A]/50 font-bold uppercase tracking-wider">CA Trimestre</p>
                          <p className="text-base font-black text-emerald-600 mt-1">94 380 €</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* List of sub-features */}
                  <div className="border-t border-[#F5F7FA] pt-5">
                    <p className="text-[9px] font-mono uppercase text-[#0B1F3A]/40 tracking-wider font-extrabold mb-3">CONFORMITÉ DU PROTOCOLE INTERNE :</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {tabData[activeSimulatorTab].features.map((feat, ix) => (
                        <div key={ix} className="flex items-center gap-2 text-xs font-semibold text-[#0B1F3A]/80">
                          <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="pt-8 flex justify-end">
                  <button 
                    onClick={() => onEnterApp()}
                    className={`text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-2 ${tabData[activeSimulatorTab].buttonColor} transition-colors border-none`}
                  >
                    <span>Lancer l'application unifiée</span>
                    <ExternalLink className="h-4.5 w-4.5 text-white" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* 5. G-LAB Advantages Bento grid */}
        <section className="py-24 bg-white border-b border-[#0B1F3A]/5">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
              <span className="text-xs font-mono font-black text-[#FF7A00] uppercase tracking-widest block font-extrabold">FONCTIONS & INFRASTRUCTURE</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#0B1F3A] tracking-tight">Une technologie pensée pour l'entreprise</h2>
              <p className="text-sm text-[#0B1F3A]/60 font-semibold leading-relaxed">
                Profitez d'un cluster cloud haut de gamme conçu pour isoler vos données transactionnelles tout en conservant une fluidité de navigation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-[#F5F7FA] hover:bg-white border border-[#0B1F3A]/5 rounded-2xl p-6.5 hover:border-[#FF7A00] hover:shadow-md transition-all text-left">
                <div className="h-10 w-10 bg-[#FF7A00]/10 rounded-xl flex items-center justify-center text-[#FF7A00] mb-4 shadow-sm">
                  <Fingerprint className="h-5.5 w-5.5" />
                </div>
                <h4 className="font-extrabold text-[#0B1F3A] text-xs uppercase tracking-wider">Sécurité SSO centralisée</h4>
                <p className="text-[11px] text-[#0B1F3A]/65 mt-2 leading-relaxed font-semibold">
                  Un seul set de droits d'utilisateurs partagé, s'appuyant sur des hashes asymétriques pour éliminer les fuites de comptes.
                </p>
              </div>

              <div className="bg-[#F5F7FA] hover:bg-white border border-[#0B1F3A]/5 rounded-2xl p-6.5 hover:border-[#FF7A00] hover:shadow-md transition-all text-left">
                <div className="h-10 w-10 bg-[#FF7A00]/10 rounded-xl flex items-center justify-center text-[#FF7A00] mb-4 shadow-sm">
                  <ShieldCheck className="h-5.5 w-5.5" />
                </div>
                <h4 className="font-extrabold text-[#0B1F3A] text-xs uppercase tracking-wider">Isolation logique des tables</h4>
                <p className="text-[11px] text-[#0B1F3A]/65 mt-2 leading-relaxed font-semibold">
                  Grâce aux schémas Prisma et PostgreSQL de pointe, votre base de données est cloisonnée de manière logique et impénétrable.
                </p>
              </div>

              <div className="bg-[#F5F7FA] hover:bg-white border border-[#0B1F3A]/5 rounded-2xl p-6.5 hover:border-[#FF7A00] hover:shadow-md transition-all text-left">
                <div className="h-10 w-10 bg-[#FF7A00]/10 rounded-xl flex items-center justify-center text-[#FF7A00] mb-4 shadow-sm">
                  <Cloud className="h-5.5 w-5.5" />
                </div>
                <h4 className="font-extrabold text-[#0B1F3A] text-xs uppercase tracking-wider font-black">Cluster Cloud Run</h4>
                <p className="text-[11px] text-[#0B1F3A]/65 mt-2 leading-relaxed font-semibold">
                  Vos services démarrent instantanément à la demande sur des processeurs haut de gamme avec sauvegarde toutes les heures.
                </p>
              </div>

              <div className="bg-[#F5F7FA] hover:bg-white border border-[#0B1F3A]/5 rounded-2xl p-6.5 hover:border-[#FF7A00] hover:shadow-md transition-all text-left">
                <div className="h-10 w-10 bg-[#FF7A00]/10 rounded-xl flex items-center justify-center text-[#FF7A00] mb-4 shadow-sm">
                  <Sparkles className="h-5.5 w-5.5" />
                </div>
                <h4 className="font-extrabold text-[#0B1F3A] text-xs uppercase tracking-wider">Audit intelligent IA</h4>
                <p className="text-[11px] text-[#0B1F3A]/65 mt-2 leading-relaxed font-semibold">
                  Un copilote Gemini intégré disponible en permanence pour analyser vos goulots et optimiser les flux métiers.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 6. Pricing Section (Standardized Solo vs Full Suite) */}
        <section id="pricing" className="py-24 bg-gradient-to-b from-white to-[#F5F7FA]">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
              <span className="text-xs font-mono font-black text-[#FF7A00] uppercase tracking-widest block font-extrabold">TARFICATION SANS SURPRISE</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#0B1F3A] tracking-tight">Une clarté tarifaire à toute épreuve</h2>
              <p className="text-sm text-[#0B1F3A]/60 font-semibold leading-relaxed">
                Optez pour le modèle qui soutient votre vélocité. Aucun frais d'installation masqué.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Plan Solo */}
              <div className="bg-white border border-[#0B1F3A]/5 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:scale-[1.01] transition-all relative text-left">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-black text-[#0B1F3A] uppercase tracking-wide">Unique App</h3>
                    <span className="text-[8px] font-mono uppercase bg-emerald-50 text-emerald-600 font-extrabold px-2 py-0.5 rounded border border-emerald-150">A vie</span>
                  </div>
                  <p className="text-xs text-[#0B1F3A]/50 font-semibold">Idéal pour démarrer avec un pôle métier précis.</p>
                  
                  <div className="my-6">
                    <span className="text-4xl font-black text-[#0B1F3A]">0 €</span>
                    <span className="text-xs text-[#0B1F3A]/60 font-bold"> / mois à vie</span>
                  </div>

                  <ul className="space-y-3 pt-5 border-t border-[#F5F7FA] text-xs font-semibold text-[#0B1F3A]/70">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>1 application de votre choix</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Utilisateurs illimités sur l'app</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Hébergement cloud & sécurité SSL</span>
                    </li>
                    <li className="flex items-center gap-2 text-[#0B1F3A]/30 font-medium line-through">
                      <span>Accès aux 11 autres applications</span>
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => onEnterApp("register")}
                  className="mt-8 w-full bg-[#0B1F3A] hover:bg-[#12315C] text-white text-xs font-black uppercase tracking-wider py-4 rounded-2xl transition-all cursor-pointer shadow border-none"
                >
                  Choisir mon application gratuite
                </button>
              </div>

              {/* Suite Standard (Our highlight) */}
              <div className="bg-white border-3 border-[#FF7A00] rounded-3xl p-7 flex flex-col justify-between shadow-xl relative scale-[1.03] hover:scale-[1.04] transition-all z-10 text-left">
                <span className="absolute top-4 right-4 bg-gradient-to-r from-[#FF7A00] to-[#E06B00] text-white text-[8px] font-mono tracking-widest uppercase font-black px-3.5 py-1.5 rounded-full shadow-sm">
                  RECOMMANDÉ POUR REORGANISATION
                </span>
                <div>
                  <h3 className="text-base font-black text-[#0B1F3A] uppercase tracking-wide">Suite Complète</h3>
                  <p className="text-xs text-[#0B1F3A]/60 font-bold">Connectez l'ensemble de votre réseau G-LAB.</p>
                  
                  <div className="my-6">
                    <span className="text-4xl font-black text-[#0B1F3A]">99 €</span>
                    <span className="text-xs text-[#0B1F3A]/60 font-black"> / mois (sans engagement)</span>
                  </div>

                  <ul className="space-y-3 pt-5 border-t border-[#F5F7FA] text-xs font-bold text-[#0B1F3A]">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span className="text-[#0B1F3A]">Les 12 applications clés incluses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Utilisateurs réseau illimités</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Synchronisation SQL native & SSO unifié</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Support de pôle technique prioritaire 24/7</span>
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={handleStartSuiteTrial}
                  className="mt-8 w-full bg-gradient-to-r from-[#FF7A00] to-[#E06B00] hover:to-[#C25D00] text-white text-xs font-black uppercase tracking-widest py-4.5 rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#FF7A00]/20 border-none"
                >
                  Démarrer l'essai (Gratuit 1 Heure)
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-[#0B1F3A] text-white border border-white/5 rounded-3xl p-7 flex flex-col justify-between shadow-premium transition-all text-left">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">Dédié Cloud</h3>
                  <p className="text-xs text-white/50 mt-1 font-semibold">Pour les holdings hôtelières et franchises complexes.</p>
                  
                  <div className="my-6">
                    <span className="text-3xl font-black text-[#FF7A00]">Sur-Mesure</span>
                    <span className="text-xs text-white/50"> / devis selon volume</span>
                  </div>

                  <ul className="space-y-3 pt-5 border-t border-white/10 text-xs font-semibold text-white/80">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Hébergement sur cluster Kubernetes dédié</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Isolation absolue IP, DNS et DB physiques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Contrat d'engagement de service de 99,99%</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#FF7A00] flex-shrink-0" />
                      <span>Support et SecOps d'urgence attitré</span>
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => onEnterApp("login")}
                  className="mt-8 w-full bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider py-4 rounded-2xl transition-all cursor-pointer border-none"
                >
                  Demander un entretien technique
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 7. Testimonials */}
        <section className="py-24 bg-white border-t border-[#0B1F3A]/5">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
              <span className="text-xs font-mono font-black text-[#FF7A00] uppercase tracking-widest block font-extrabold font-black">TEMOIGNAGES DE CONFIANCE</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#0B1F3A] tracking-tight">Ils ont unifié leur croissance</h2>
              <p className="text-sm text-[#0B1F3A]/60 font-semibold leading-relaxed">
                Découvrez pourquoi des centaines de décisionnaires ont choisi d'abandonner les systèmes séparés.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-[#F5F7FA] border border-[#0B1F3A]/5 rounded-2xl p-6.5 flex flex-col justify-between text-left" style={{ contentVisibility: "auto" }}>
                <div>
                  <div className="flex text-[#FF7A00] gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-[#FF7A00] text-[#FF7A00]" />)}
                  </div>
                  <p className="text-xs font-bold text-[#0B1F3A]/80 leading-relaxed italic">
                    "La suite G-LAB a restructuré notre logistique hôtelière. Nos équipes navigant entre l'attribution de fiches de paie G-RH et la facturation d'hôtel sans saisie redondante, nous économisons des dizaines d'heures par mois."
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-[#0B1F3A]/5 pt-4 mt-6">
                  <div className="h-10 w-10 bg-[#0B1F3A] rounded-full flex items-center justify-center font-black text-xs text-white">
                    GL
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0B1F3A] text-xs">Guillaume Lambert</h4>
                    <p className="text-[10px] text-[#0B1F3A]/50 font-mono">Président, Suite Hôtelière Grand-Ouest</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F7FA] border border-[#0B1F3A]/5 rounded-2xl p-6.5 flex flex-col justify-between text-left" style={{ contentVisibility: "auto" }}>
                <div>
                  <div className="flex text-[#FF7A00] gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-[#FF7A00] text-[#FF7A00]" />)}
                  </div>
                  <p className="text-xs font-bold text-[#0B1F3A]/80 leading-relaxed italic">
                    "Automatiser la distribution entre G-RESTO et notre comptabilité comptable unifiée nous a évité tout risque d'erreur fiscale mensuelle de saisie. C'est l'unification la plus puissante du marché !"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-[#0B1F3A]/5 pt-4 mt-6">
                  <div className="h-10 w-10 bg-[#0B1F3A] rounded-full flex items-center justify-center font-black text-xs text-white">
                    SD
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0B1F3A] text-xs">Sophie Dupont</h4>
                    <p className="text-[10px] text-[#0B1F3A]/50 font-mono">DCI Exécutive, Groupe Brasseurs Belges</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F7FA] border border-[#0B1F3A]/5 rounded-2xl p-6.5 flex flex-col justify-between text-left" style={{ contentVisibility: "auto" }}>
                <div>
                  <div className="flex text-[#FF7A00] gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 fill-[#FF7A00] text-[#FF7A00]" />)}
                  </div>
                  <p className="text-xs font-bold text-[#0B1F3A]/80 leading-relaxed italic">
                    "La robustesse du SSO unifié nous a permis de passer les audits SecOps les plus drastiques de notre groupe de transport. G-LAB est parfait pour les professionnels exigeants."
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-[#0B1F3A]/5 pt-4 mt-6">
                  <div className="h-10 w-10 bg-[#0B1F3A] rounded-full flex items-center justify-center font-black text-xs text-white">
                    ML
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0B1F3A] text-xs">Marc Lefèvre</h4>
                    <p className="text-[10px] text-[#0B1F3A]/50 font-mono">Directeur Informatique, Holding Travel Logistics</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* 8. Footer Section - Styled in brand deep blue #0B1F3A and orange #FF7A00 accents */}
      <footer className="bg-[#0B1F3A] text-white border-t border-white/5 pt-16 pb-8 px-6 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/5 pb-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                <span className="font-sans text-[#FF7A00] font-black text-xl tracking-tighter">g</span>
              </div>
              <span className="font-sans font-black text-xl tracking-tight text-white">G-LAB<span className="text-[#FF7A00]">TECH</span></span>
            </div>
            <p className="text-[11px] text-white/60 font-semibold leading-relaxed">
              La suite en ligne d'accélération d'affaires pour entreprises ambitieuses. Raccordez vos terminaux hôteliers, factures et comptabilités sous un même portail de sécurité logicalisé.
            </p>
            
            {/* Contact Social Logos */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Twitter / X"
                aria-label="Twitter / X"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/25 transition-all cursor-pointer"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Facebook"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/25 transition-all cursor-pointer"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/25 transition-all cursor-pointer"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="WhatsApp"
                aria-label="WhatsApp"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/25 transition-all cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="TikTok"
                aria-label="TikTok"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#FE2C55] hover:bg-[#FE2C55]/10 hover:border-[#FE2C55]/25 transition-all cursor-pointer"
              >
                <Music className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-[#0077B5] hover:bg-[#0077B5]/10 hover:border-[#0077B5]/25 transition-all cursor-pointer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="GitHub"
                aria-label="GitHub"
                className="h-8.5 w-8.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-2 text-[8px] text-white/40 font-mono flex items-center gap-2 flex-wrap font-bold">
              <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase">PROTÉGÉ PAR CLE RSA</span>
              <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase">PRE-PROD EN DIRECT</span>
              <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase">CONFORMITÉ RGPD</span>
            </div>
          </div>

          {/* Apps Column list */}
          <div className="md:col-span-3 space-y-3.5 text-left font-sans">
            <h4 className="text-[9px] font-mono uppercase tracking-widest text-[#FF7A00] font-black">Applications G-Lab</h4>
            <div className="flex flex-col gap-2 text-xs text-white/75 font-semibold">
              <button onClick={() => onEnterApp()} className="hover:text-[#FF7A00] text-left cursor-pointer transition-colors border-none bg-transparent outline-none">G-HOTEL Reservation PMS</button>
              <button onClick={() => onEnterApp()} className="hover:text-[#FF7A00] text-left cursor-pointer transition-colors border-none bg-transparent outline-none">G-RESTO POS Restauration</button>
              <button onClick={() => onEnterApp()} className="hover:text-[#FF7A00] text-left cursor-pointer transition-colors border-none bg-transparent outline-none">G-ERP Finances Comptabilité</button>
              <button onClick={() => onEnterApp()} className="hover:text-[#FF7A00] text-left cursor-pointer transition-colors border-none bg-transparent outline-none">G-CRM Pipelines Commerciaux</button>
              <button onClick={() => onEnterApp()} className="hover:text-[#FF7A00] text-left cursor-pointer transition-colors border-none bg-transparent outline-none">G-MARKET Luxe Platine</button>
            </div>
          </div>

          {/* Resources Column list */}
          <div className="md:col-span-2 space-y-3.5 text-left">
            <h4 className="text-[9px] font-mono uppercase tracking-widest text-white/50 font-black">Liens Rapides</h4>
            <div className="flex flex-col gap-2 text-xs text-white/75 font-semibold">
              <a href="#integrations" className="hover:text-[#FF7A00] transition-colors">Notre Force</a>
              <a href="#interactive" className="hover:text-[#FF7A00] transition-colors">Démonstrateurs Live</a>
              <a href="#pricing" className="hover:text-[#FF7A00] transition-colors">Politique Tarifaire</a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-[9px] font-mono uppercase tracking-widest text-[#FF7A00] font-black">Newsletter Technique</h4>
            <p className="text-[11px] text-white/60 font-semibold leading-relaxed">
              Restez informé sur nos mises à jour d'ingénierie et de conformité financière.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Ex. admin@hotelgrand.com" 
                className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none w-full"
              />
              <button 
                onClick={() => alert("Adresse courriel simulée enregistrée avec succès.")}
                className="bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-black uppercase px-4 py-2 rounded-lg transition-colors cursor-pointer border-none"
              >
                Inscrire
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[10px] text-white/40 font-mono font-semibold">
          <p>&copy; 2026 G-LAB TECH. Tous droits réservés. Intégré et isolé via l'authentification unifiée.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Charte de Confidentialité</a>
            <span>•</span>
            <a href="#" className="hover:text-[#FF7A00] transition-colors">CGU / CGV</a>
          </div>
        </div>

      </footer>

      {/* 1. SETUP WIZARD MODAL: DÉMARRER MAINTENANT */}
      {isWizardOpen && wizardApp && (
        <div className="fixed inset-0 bg-[#0B1F3A]/70 backdrop-blur-md z-50 flex items-center justify-center p-3 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#0B1F3A]/10 shadow-2xl max-w-xl w-full overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            
            {/* Header branding band - Compact */}
            <div className="bg-[#0B1F3A] text-white p-4.5 sm:p-5 relative overflow-hidden pb-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/10 rounded-full blur-xl pointer-events-none" />
              <button 
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="absolute top-3.5 right-3.5 h-7 w-7 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="p-0.5 px-2 bg-[#FF7A00] text-white text-[8px] font-black rounded tracking-wider uppercase font-mono">DÉMARRER MAINTENANT</span>
                <span className="text-white/45 text-[10px] font-mono">•</span>
                <span className="text-white/70 text-[10px] font-semibold">Instance : {wizardApp.name}</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-black mt-2 text-white tracking-tight leading-none uppercase">Configurez votre essai d'une heure</h3>
              <p className="text-white/60 text-[10px] leading-normal mt-1">
                Générez votre espace sandbox isolé en moins de 30 secondes chrono sous notre DNS fédéré SSO.
              </p>
            </div>

            {/* Content Form - Compact & Responsive */}
            <form onSubmit={handleStartTrial} className="p-4 sm:p-5 space-y-3.5 text-left font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Proprietaire Full name */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Nom et Prénoms du Propriétaire *</label>
                  <input 
                    type="text" 
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ex. Pierre-Marie Dubois"
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Adresse Email *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex. p.dubois@votreentreprise.com"
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Mot de Passe *</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  />
                </div>

                {/* Tel number */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Numéro de Téléphone</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex. +228 90 12 34 56"
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  />
                </div>

                {/* Pays list selection with West African countries */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Pays d'origine *</label>
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  >
                    <option value="Togo">Togo</option>
                    <option value="Bénin">Bénin</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Cap-Vert">Cap-Vert</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Gambie">Gambie</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Guinée">Guinée</option>
                    <option value="Guinée-Bissau">Guinée-Bissau</option>
                    <option value="Libéria">Libéria</option>
                    <option value="Mali">Mali</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigéria">Nigéria</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Canada">Canada</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Maroc">Maroc</option>
                    <option value="Tunisie">Tunisie</option>
                  </select>
                </div>

                {/* Langue list selection */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Langue Préférée *</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  >
                    <option value="Français">Français</option>
                    <option value="English">English (US)</option>
                    <option value="Español">Español</option>
                    <option value="Deutsch">Deutsch</option>
                  </select>
                </div>

                {/* Taille entreprise */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Taille de l'entreprise *</label>
                  <select 
                    value={companySize} 
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  >
                    <option value="1-5">1 - 5 employés</option>
                    <option value="10-50">10-50 employés</option>
                    <option value="50-250">50-250 employés</option>
                    <option value="250-1000">250-1000 employés</option>
                    <option value="1000+">1000+ employés Enterprise</option>
                  </select>
                </div>

                {/* Nom entreprise */}
                <div>
                  <label className="block text-[9px] font-mono tracking-wider font-extrabold text-[#0B1F3A]/60 uppercase mb-1">Nom de l'Entreprise / Marque *</label>
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                    placeholder="Ex. Dubois Hôtel Group"
                    className="w-full bg-[#F5F7FA] border border-[#0B1F3A]/10 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] rounded-lg px-3 py-1.5 text-xs font-bold text-[#0B1F3A] outline-none"
                  />
                </div>

              </div>

              {/* DOMAIN GENERATOR ZONE - Compact */}
              <div className="bg-[#F5F7FA] rounded-xl p-3 border border-[#0B1F3A]/5 space-y-1">
                <span className="text-[9px] font-mono tracking-wider font-black text-[#0B1F3A]/50 block uppercase">Nom de Domaine d'Entreprise Généré</span>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-[#0B1F3A]/5 font-mono text-xs text-[#0B1F3A] shadow-sm">
                  <Globe className="h-4 w-4 text-[#FF7A00]" />
                  <span className="font-extrabold text-[#FF7A00] select-all">{customSubdomain || "xxx"}</span>
                  <span className="font-black text-[#0B1F3A]">.glabtech.com</span>
                </div>
                <p className="text-[8px] text-[#0B1F3A]/45 leading-relaxed font-semibold">
                  * Votre domaine d'essai sera configuré au format de liane SSO <code className="bg-white px-1">xxx.glabtech.com/trial</code> dès approbation par l'administrateur.
                </p>
              </div>

              {/* Action feet - Compact */}
              <div className="flex justify-between items-center pt-1.5 gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsWizardOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-lg transition-all cursor-pointer border-0"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-md border-0"
                >
                  Confirmer et Tester
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 2. DYNAMIC LIVE BROWSER SIMULATOR: TRIAL INSTANCE */}
      {isSimulationOpen && (
        <div className="fixed inset-0 bg-[#0B1F3A]/90 backdrop-blur-lg z-50 flex flex-col justify-between p-4 font-sans animate-fadeIn text-[#0B1F3A]">
          <div className="bg-white rounded-3xl border border-[#0B1F3A]/20 shadow-2xl w-full max-w-6xl mx-auto flex-1 flex flex-col overflow-hidden">
            
            {/* Simulation Header Address Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              
              {/* Dynamic URL address bar */}
              <div className="flex-1 max-w-xl mx-auto flex items-center bg-black/45 border border-white/10 rounded-xl px-4 py-1.5 text-slate-200 font-mono text-[11px] gap-2">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">https://</span>
                <span className="text-white font-extrabold text-[12px]">{customSubdomain}.glabtech.com</span>
                <span className="text-white/40">/trial</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full font-mono font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-ping" />
                  <span>PREVIEW ACTIVE</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsSimulationOpen(false)}
                  className="text-xs text-white/50 hover:text-white bg-white/10 px-3 py-1 bg-transparent border-0 rounded-xl cursor-pointer transition-all"
                >
                  Fermer Aperçu
                </button>
              </div>
            </div>

            {/* Simulated Live Alert System */}
            <div className={`p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-4 font-sans ${
              simStatus === "approved" 
                ? "bg-emerald-50 text-emerald-950 border-emerald-200" 
                : "bg-amber-50 text-amber-900 border-amber-205"
            }`}>
              <div className="flex items-center gap-3">
                <div role="status" className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                  simStatus === "approved" ? "bg-emerald-500 text-white animate-pulse" : "bg-amber-500 text-white"
                }`}>
                  {simStatus === "approved" ? <Check className="h-4.5 w-4.5" /> : <RefreshCw className="h-4.5 w-4.5 animate-spin" />}
                </div>
                <div className="text-left font-sans text-xs">
                  <p className="font-extrabold uppercase tracking-wide">
                    {simStatus === "approved" 
                      ? "✓ Demande d'approbation d'essai approuvée par l'admin principal" 
                      : "⏳ Demande d'essai envoyée à l'administrateur principal (en attente d'approbation SSO)"
                    }
                  </p>
                  <p className="text-[11px] text-[#0B1F3A]/60 font-semibold">
                    {simStatus === "approved"
                      ? "Votre workspace d'essai premium G-LAB TECH est désormais lié et déverrouillé."
                      : "Pendant que l'administrateur approuve votre compte dans la Gestion SSO de la console centrale, découvrez les fonctionnalités actives."
                    }
                  </p>
                </div>
              </div>

              {simStatus !== "approved" && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-950">Statut: En Attente</span>
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        const r = await fetch(`/api/trial-requests`);
                        if (r.ok) {
                          const l = await r.json();
                          const found = l.find((x: any) => x.subdomain === customSubdomain || x.id === simId);
                          if (found && found.status !== "pending") {
                            setSimStatus(found.status);
                            alert(`Félicitations ! Statut détecté sur le serveur central : ${found.status}.`);
                          } else {
                            const testApprove = await fetch(`/api/trial-requests/${simId}/status`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "approved" })
                            });
                            if (testApprove.ok) {
                              setSimStatus("approved");
                            } else {
                              setSimStatus("approved");
                            }
                          }
                        } else {
                          setSimStatus("approved");
                        }
                      } catch (err) {
                        setSimStatus("approved");
                      }
                    }}
                    className="bg-[#0B1F3A] hover:bg-[#0B1F3A]/85 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0"
                  >
                    Simuler Approbation Directe Admin
                  </button>
                </div>
              )}
            </div>

            {/* Trial workspace active modules interface dashboard */}
            <div className="flex-1 bg-slate-50 p-6 sm:p-8 overflow-y-auto text-left flex flex-col">
              
              {/* Dashboard stats block */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-xl font-bold text-[#0B1F3A] tracking-tight">Console d'administration - {wizardApp?.name || "Suite d'essai unifiée"}</h4>
                  <p className="text-xs text-[#0B1F3A]/60 font-medium font-bold">Base de données isolée : <code className="bg-[#0B1F3A]/5 px-1 font-mono">{customSubdomain}_prod_db</code> • Région : Paris Edge</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 text-[10px] font-mono bg-[#FF7A00]/10 text-[#FF7A00] font-bold rounded-full border border-[#FF7A00]/25">PLAN D'ESSAI : 1 HEURE RESTANTE</span>
                </div>
              </div>

              {/* Grid content representing sandbox trial experience */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* Visual metric card 1 */}
                <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block font-bold">Chiffre d'Affaire Estimé</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">0.00 &euro;</span>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: "35%" }} />
                  </div>
                  <p className="text-[10px] text-slate-500">Prêt pour capture de ventes. Enregistrements en cours.</p>
                </div>

                {/* Visual metric card 2 */}
                <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block font-bold">Utilisateurs actifs sandbox</span>
                  <span className="text-2xl font-black text-[#0B1F3A] font-mono">1 / {companySize} implémenté</span>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: "10%" }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">Administrateur principal : {ownerName || "Administrateur d'essai"}</p>
                </div>

                {/* Visual metric card 3 */}
                <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block font-bold">Synchronisation SSO</span>
                  <span className={`text-sm font-black font-mono block ${simStatus === 'approved' ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {simStatus === "approved" ? "● SYNCHRONISÉ ET ACTIF (SSO)" : "◐ EN ATTENTE D'ANNUAIRE"}
                  </span>
                  <div className="flex gap-1.5 pt-1.5 font-mono">
                    <span className="text-[9px] bg-[#F5F7FA] px-1.5 py-0.5 rounded font-bold text-[#0B1F3A]/60 font-medium">ISS: glabtech</span>
                    <span className="text-[9px] bg-[#F5F7FA] px-1.5 py-0.5 rounded font-bold text-[#0B1F3A]/60 font-medium">AUD: Central SSO</span>
                  </div>
                </div>

              </div>

              {/* Dynamic app simulation representation depending on the chosen application */}
              <div className="bg-white border border-[#0B1F3A]/5 rounded-2xl p-6 flex-1 shadow-sm flex flex-col justify-between">
                <div>
                  <h5 className="text-[#0B1F3A] font-extrabold text-sm mb-2 uppercase flex items-center gap-1.5">
                    🎮 Environnement de simulation interactif : {wizardApp?.name || "Service Unifié"}
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 font-semibold">
                    Votre instance d'évaluation est connectée à liane SSO centralisée. Vous pouvez modifier des données d'essai à la volée pour tester la réactivité en temps réel :
                  </p>

                  <div className="space-y-4 font-sans text-left">
                    <div className="bg-[#F5F7FA] p-4 rounded-xl border border-[#0B1F3A]/5">
                      <div className="flex justify-between items-center text-xs pb-1.5">
                        <strong className="text-[#0B1F3A]">Ajouter de la donnée d'activité</strong>
                        <span className="text-[10px] bg-[#FF7A00]/10 text-[#FF7A00] px-2 py-0.5 rounded font-bold uppercase">Mise à jour directe</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                        Chaque élément de facturation fictif injecté ci-dessous sera immédiatement répercuté sous l'adresse <code className="bg-white px-1 font-bold text-[#FF7A00] font-mono">{customSubdomain}.glabtech.com</code> et synchronisera un audit dans la gestion SSO d'identité.
                      </p>
                      
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => alert(`Enregistrement simulé ajouté avec succès à ${wizardApp?.name}!`)}
                          className="px-4 py-2 bg-[#FF7A00] hover:bg-[#E06B00] text-white text-xs font-black rounded-lg transition-colors cursor-pointer border-0"
                        >
                          Injecter +1 Transaction Fictive
                        </button>
                        <button 
                          type="button"
                          onClick={() => alert(`Rapprochement bancaire simulé validé pour ${wizardApp?.name}!`)}
                          className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/95 text-white text-xs font-black rounded-lg transition-colors cursor-pointer border-0"
                        >
                          Lancer Diagnostic de Liance
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>Application de simulation v1.0.0-trial (Mode Isolateur)</span>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setSimStatus("approved");
                    }} 
                    className="text-[#FF7A00] hover:underline"
                  >
                    Activer instantanément la console d'essai
                  </a>
                </div>
              </div>

            </div>

            {/* Simulated footer bar */}
            <div className="bg-[#F5F7FA] p-4 border-t text-center text-xs text-[#0B1F3A]/50 font-semibold flex items-center justify-between">
              <span>Hébergé en direct via la Sandbox sur Hostinger Edge</span>
              <button 
                type="button"
                onClick={() => setIsSimulationOpen(false)}
                className="bg-[#0B1F3A] text-white rounded-xl px-4 py-2 text-xs font-black transition-colors cursor-pointer border-none"
              >
                Fermer l'Environnement d'Aperçu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
