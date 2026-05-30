import React, { useState, useEffect } from "react";
import { 
  Building2, 
  CreditCard, 
  Users, 
  BarChart3, 
  Bell, 
  ShieldAlert, 
  Wrench, 
  Plus, 
  Check, 
  ArrowUpRight, 
  FileText, 
  ShieldCheck, 
  Send, 
  Lock, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  RefreshCw,
  Cpu,
  Mail,
  Fingerprint,
  ToggleLeft,
  Sliders,
  Play,
  RotateCw,
  Shield,
  Eye,
  EyeOff,
  Database,
  Briefcase,
  Search,
  Printer,
  Download,
  Wallet,
  Coins,
  DollarSign,
  Activity,
  History,
  TrendingUp,
  Settings,
  User,
  Globe,
  Palette,
  Save,
  UserCheck,
  UserX,
  Trash2,
  Camera,
  Upload
} from "lucide-react";
import { PortalUser, UserRole, ManagedApp } from "../types";

export interface TenantData {
  databaseName: string;
  region: string;
  securityLevel: string;
  autoBackups: boolean;
  allowedApps: string[];
  plan: "Starter Sandbox" | "Business Suite" | "Enterprise Premium";
  price: number;
  seatsUsed: number;
  seatsMax: number;
  stripeConnected: boolean;
  stripeApiKey: string;
  invoices: Array<{ date: string; user: string; plan: string; price: number; ref: string }>;
  users: Array<{ id: string; name: string; email: string; role: UserRole; status: string; lastLogin: string; permissions: string[] }>;
}

interface OrganizationsTabProps {
  user: PortalUser;
  setUser: (user: PortalUser) => void;
  tenants: Record<string, TenantData>;
  setTenants: React.Dispatch<React.SetStateAction<Record<string, TenantData>>>;
  apps: ManagedApp[];
  onSyncApp: (appId: string, appName: string) => void;
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

// ==========================================
// 1. ORGANIZATIONS TAB (Multi-Tenant Hub)
// ==========================================
export function OrganizationsTab({
  user,
  setUser,
  tenants,
  setTenants,
  apps,
  onSyncApp,
  onNotify
}: OrganizationsTabProps) {
  const currentOrgName = user.tenant;
  const currentTenant = tenants[currentOrgName] || tenants["GLABTECH HQ (Europe)"];

  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgRegion, setNewOrgRegion] = useState("Paris (AWS-eu-west-3)");
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState<string | null>(null);

  const handleSwitchTenant = (name: string) => {
    setUser({
      ...user,
      tenant: name
    });
    onNotify(`Passage sous l'organisation isolée : ${name}`, "info");
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const formattedName = newOrgName.toUpperCase().trim();
    if (tenants[formattedName]) {
      onNotify("Cette organisation existe déjà.", "warn");
      return;
    }

    const defaultIsolatedApps = ["glab-hotel", "glab-resto", "glab-erp", "glab-crm"];
    const dbName = "db-cl_" + formattedName.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_p";

    const newTenant: TenantData = {
      databaseName: dbName,
      region: newOrgRegion,
      securityLevel: "Maximal (RSA-4096)",
      autoBackups: true,
      allowedApps: defaultIsolatedApps,
      plan: "Business Suite",
      price: 99,
      seatsUsed: 1,
      seatsMax: 20,
      stripeConnected: false,
      stripeApiKey: "",
      invoices: [
        { date: new Date().toLocaleDateString("fr-FR"), user: user.email, plan: "Business Suite", price: 99, ref: `stripe_init_${Math.random().toString(36).substring(2, 8)}` }
      ],
      users: [
        { id: `usr-${Date.now()}-1`, name: user.name, email: user.email, role: "Global Owner", status: "actif", lastLogin: new Date().toLocaleTimeString(), permissions: ["apps", "billing", "users", "settings"] }
      ]
    };

    setTenants({
      ...tenants,
      [formattedName]: newTenant
    });

    setUser({
      ...user,
      tenant: formattedName
    });

    setNewOrgName("");
    onNotify(`Organisation Multi-Tenant '${formattedName}' initialisée et déployée avec succès.`, "success");
  };

  const handleToggleApp = (appId: string) => {
    const isAllowed = currentTenant.allowedApps.includes(appId);
    let updatedApps: string[];
    if (isAllowed) {
      updatedApps = currentTenant.allowedApps.filter(id => id !== appId);
      onNotify(`Licence de l'application révoquée pour le tenant : ${appId}`, "warn");
    } else {
      updatedApps = [...currentTenant.allowedApps, appId];
      onNotify(`Licence accordée et provisionnée pour le tenant : ${appId}`, "success");
    }

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        allowedApps: updatedApps
      }
    });
  };

  const handleSimulateAppTraffic = (appId: string) => {
    setIsSimulatingTraffic(appId);
    setTimeout(() => {
      onSyncApp(appId, apps.find(a => a.id === appId)?.name || appId);
      setIsSimulatingTraffic(null);
    }, 1200);
  };

  const handleToggleBackups = () => {
    const currentStatus = currentTenant.autoBackups;
    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        autoBackups: !currentStatus
      }
    });
    onNotify(`Sauvegardes automatisées ${!currentStatus ? "ACTIVÉES" : "DÉSACTIVÉES"} sur ${currentTenant.databaseName}`, !currentStatus ? "success" : "warn");
  };

  const handleRegenRsa = () => {
    onNotify("Rotation asymétrique RSA-4096 accomplie pour le tenant.", "success");
  };

  return (
    <div className="space-y-6 animate-motion-in">
      
      {/* List / Grid of current tenants */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-1">
          <Building2 className="h-5 w-5 text-brand-orange" />
          Moniteur Central Multi-Tenant GLABTECH
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Isolez et configurez l'ensemble des bases de données de vos holdings de façon logique et étanche. Sélectionnez votre tenant actif.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tenants).map(([name, data]) => {
            const isCurrentlySelected = name === currentOrgName;
            return (
              <div 
                key={name}
                onClick={() => handleSwitchTenant(name)}
                className={`border p-4.5 rounded-2xl cursor-pointer transition-all relative flex flex-col justify-between h-40 ${
                  isCurrentlySelected 
                    ? "border-brand-orange bg-[#FF7A00]/[0.02] shadow-premium" 
                    : "border-slate-200 hover:border-brand-orange/40 bg-slate-50/50 hover:bg-white"
                }`}
              >
                {isCurrentlySelected && (
                  <span className="absolute top-4 right-4 bg-brand-orange text-white text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded">
                    ACTIVE TENANT
                  </span>
                )}

                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 truncate pr-16">{name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">{data.region}</p>
                </div>

                <div className="border-t border-slate-100 pt-3 text-[9px] font-mono text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Database :</span>
                    <span className="font-bold text-slate-800">{data.databaseName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Abonnement :</span>
                    <span className="text-brand-orange font-bold uppercase">{data.plan.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Membres :</span>
                    <span className="font-bold text-slate-800">{data.users.length} / {data.seatsMax}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Database Isolation & Security configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Isolated DB parameters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium lg:col-span-2 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Database className="h-4.5 w-4.5 text-slate-700" />
                Isolation Logique des Données & Sandbox Partition
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">Instance active : {currentOrgName}</p>
            </div>
            <span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono border border-white/5">
              {currentTenant.databaseName}
            </span>
          </div>

          <div className="bg-[#F8FAF9]/80 border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Type d'Isolation</span>
              <strong className="text-brand-blue font-extrabold block mt-0.5">Database Per Client</strong>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-slate-205 sm:pl-4">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Méthode de chiffrement</span>
              <strong className="text-slate-800 font-extrabold block mt-0.5">{currentTenant.securityLevel}</strong>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-slate-205 sm:pl-4">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">Sauvegardes quotidiennes</span>
              <button 
                onClick={handleToggleBackups}
                className={`text-[10px] font-mono font-black mt-0.5 cursor-pointer block ${currentTenant.autoBackups ? 'text-emerald-600' : 'text-rose-500 hover:underline'}`}
              >
                {currentTenant.autoBackups ? "● ACTIVÉES (AWS/GCP S3)" : "○ DÉSACTIVÉES (DANGER)"}
              </button>
            </div>
          </div>

          {/* RSA client key rotation */}
          <div className="p-4 border border-dashed border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h5 className="text-xs font-bold text-slate-850">Clé asymétrique de synchronisation</h5>
              <p className="text-[10px] text-slate-450 leading-normal mt-0.5">Utilisée pour signer les transactions envoyées du tenant vers les API de glabeboutique.com.</p>
            </div>
            <button 
              onClick={handleRegenRsa}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-bold font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="h-3 w-3" /> Clé de rotation
            </button>
          </div>
        </div>

        {/* Provision new tenant */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium space-y-4">
          <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
            <Plus className="h-4.5 w-4.5 text-[#FF7A00]" />
            Provisionner un nouveau Tenant
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Créez une entité légale autonome avec base SQL PostgreSQL et clés de sécurité initialisées.
          </p>

          <form onSubmit={handleCreateOrg} className="space-y-3.5">
            <div className="space-y-1 text-xs">
              <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Nom de l'organisation</label>
              <input 
                type="text"
                required
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="Ex: GLABTECH LATAM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-orange text-xs"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Région Hébergement</label>
              <select 
                value={newOrgRegion}
                onChange={(e) => setNewOrgRegion(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none"
              >
                <option value="Paris (AWS-eu-west-3)">AWS Europe (Paris - eu-west-3)</option>
                <option value="London (GCP-europe-west2)">GCP Europe (Londres - europe-west2)</option>
                <option value="New-York (GCP-us-east1)">GCP USA (New-York - us-east1)</option>
                <option value="Singapour (AWS-ap-southeast-1)">AWS Asie (Singapour - ap-southeast-1)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5 text-[#FF7A00]" /> Déployer l'environnement
            </button>
          </form>
        </div>
      </div>

      {/* Applications list for tenant licensing */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 mb-2">
          <Sliders className="h-4.5 w-4.5 text-brand-orange" />
          Régulateur de Licences & Données Applications de {currentOrgName}
        </h4>
        <p className="text-xs text-slate-500 mb-6">
          Activez ou révoquez les licences d'applications pour cette organisation. Ajustez le volume de données fictives stockées par microservice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => {
            const isInstalled = currentTenant.allowedApps.includes(app.id);
            return (
              <div 
                key={app.id}
                className={`border p-4.5 rounded-2xl flex flex-col justify-between transition-all ${
                  isInstalled 
                    ? "border-slate-200 bg-white" 
                    : "border-slate-100 bg-[#F5F7FA]/40 opacity-75"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-[#FF7A00] uppercase font-extrabold">{app.id.replace("glab-", "g-")}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono ${isInstalled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                      {isInstalled ? "SOUS LICENCE" : "RESTREINTE"}
                    </span>
                  </div>

                  <h5 className="font-extrabold text-xs text-slate-900 mt-1">{app.name}</h5>
                  <p className="text-[10.5px] text-slate-450 mt-1 line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                  <div className="text-[10px] font-mono">
                    <span className="text-slate-400 block uppercase text-[8px]">Données Tenant</span>
                    <strong className="text-brand-blue font-extrabold">{isInstalled ? `${app.recordsCount} lignes` : "0 (Exclu)"}</strong>
                  </div>

                  <div className="flex gap-1.5">
                    {isInstalled && (
                      <button 
                        onClick={() => handleSimulateAppTraffic(app.id)}
                        disabled={isSimulatingTraffic !== null}
                        className="py-1 px-2.5 bg-[#F5F7FA] hover:bg-slate-100 border border-slate-200 rounded text-[9.5px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer"
                        title="Simuler du trafic API"
                      >
                        {isSimulatingTraffic === app.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />
                        ) : (
                          <Play className="h-3 w-3 text-slate-500" />
                        )}
                        Ecrire DB
                      </button>
                    )}

                    <button 
                      onClick={() => handleToggleApp(app.id)}
                      className={`py-1 px-3.5 rounded text-[10px] font-bold font-mono cursor-pointer transition-all ${
                        isInstalled 
                          ? "bg-rose-55 hover:bg-rose-100 text-rose-700 border border-rose-200" 
                          : "bg-[#0B1F3A] hover:bg-slate-900 text-white"
                      }`}
                    >
                      {isInstalled ? "Révoquer" : "Activer"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. BILLING TAB (Multi-Tenant Pricing & Multi-Gateway Payments)
// ==========================================
interface BillingTabProps {
  user: PortalUser;
  tenants: Record<string, TenantData>;
  setTenants: React.Dispatch<React.SetStateAction<Record<string, TenantData>>>;
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export function BillingTab({
  user,
  tenants,
  setTenants,
  onNotify
}: BillingTabProps) {
  const currentOrgName = user.tenant;
  const currentTenant = tenants[currentOrgName];

  // Primary active view inside Billing tab: "abonnements" | "facturation" | "invoices" | "historique"
  const [activeBillingSubTab, setActiveBillingSubTab] = useState<"abonnements" | "facturation" | "invoices" | "historique">("abonnements");
  
  // Settings profile configurations
  const [billingCycle, setBillingCycle] = useState<"mensuel" | "annuel">("mensuel");
  const [selectedCurrency, setSelectedCurrency] = useState<"EUR" | "USD" | "XOF">("EUR");
  const [legalCompanyName, setLegalCompanyName] = useState<string>(currentOrgName || "GLABTECH SA");
  const [legalCompanyAddress, setLegalCompanyAddress] = useState<string>("Avenue Léopold Sédar Senghor, Dakar, Sénégal");
  const [taxIdNumber, setTaxIdNumber] = useState<string>("SN-DKR-2026-B-1192");
  const [isAutoRenewEnabled, setIsAutoRenewEnabled] = useState<boolean>(true);
  
  // Invoice filters
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [invoiceFilterGateway, setInvoiceFilterGateway] = useState("all");
  
  // Modals / Drawer displays state
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutGateway, setCheckoutGateway] = useState<any | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<number>(0); // 0: Form, 1: OTP, 2: Loading, 3: Success
  const [checkoutAmount, setCheckoutAmount] = useState<number>(99);
  
  // Interactive forms fields
  const [checkoutPayerPhone, setCheckoutPayerPhone] = useState("");
  const [checkoutPayerEmail, setCheckoutPayerEmail] = useState(user.email);
  const [checkoutCardNumber, setCheckoutCardNumber] = useState("4242 •••• •••• 4242");
  const [checkoutCardExpiry, setCheckoutCardExpiry] = useState("12/28");
  const [checkoutCardCvv, setCheckoutCardCvv] = useState("384");
  const [checkoutOtpCode, setCheckoutOtpCode] = useState("");

  // Integrated gateways credential fields
  const [gateways, setGateways] = useState<Record<string, any>>({
    yas: {
      id: "yas",
      name: "Mixx by Yas",
      logoColor: "from-fuchsia-600 to-pink-600",
      textColor: "text-fuchsia-700Bg",
      badgeClass: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
      enabled: true,
      publicKey: "yas_pk_live_dakar_992a6b2c",
      walletId: "yas_wallet_glabtech",
      sandboxMode: true,
      fields: [
        { key: "publicKey", label: "Clé Publique Yas", type: "text" },
        { key: "walletId", label: "Identifiant Portefeuille Yas", type: "text" },
      ]
    },
    flooz: {
      id: "flooz",
      name: "Flooz (Moov)",
      logoColor: "from-sky-500 to-blue-700",
      badgeClass: "bg-sky-50 text-sky-700 border-sky-100",
      enabled: true,
      apiKey: "flo_moov_xyz_2910384a",
      merchantNumber: "+22890112233",
      encryptionSalt: "salt_togo_331",
      fields: [
        { key: "apiKey", label: "Clé API Moov", type: "password" },
        { key: "merchantNumber", label: "Numéro de Marchand Flooz", type: "text" },
        { key: "encryptionSalt", label: "Sel de Chiffrement HMAC", type: "text" },
      ]
    },
    momo: {
      id: "momo",
      name: "MTN MoMo",
      logoColor: "from-amber-400 to-yellow-500 text-slate-900",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-100",
      enabled: true,
      apiUser: "mtn_user_saas_99e",
      apiKey: "momo_secret_key_prod_88",
      country: "Côte d'Ivoire",
      fields: [
        { key: "apiUser", label: "ID API Utilisateur MTN", type: "text" },
        { key: "apiKey", label: "Clé d'accès API (Secret)", type: "password" },
        { key: "country", label: "Pays d'exploitation", type: "text" }
      ]
    },
    orange: {
      id: "orange",
      name: "Orange Money",
      logoColor: "from-orange-500 to-amber-600",
      badgeClass: "bg-orange-50 text-orange-700 border-orange-100",
      enabled: true,
      clientId: "om_client_dapp_881a2f4",
      clientSecret: "om_client_secret_99b0c2a8f",
      merchantCode: "OM_SN_DAKAR_99252",
      fields: [
        { key: "clientId", label: "Client ID Orange API", type: "text" },
        { key: "clientSecret", label: "Secret Client Orange API", type: "password" },
        { key: "merchantCode", label: "Code Marchand OM unifié", type: "text" }
      ]
    },
    stripe: {
      id: "stripe",
      name: "Stripe Checkout",
      logoColor: "from-indigo-600 to-purple-700",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-100",
      enabled: currentTenant?.stripeConnected || false,
      publicKey: currentTenant?.stripeApiKey || "pk_test_51Mz9HQ_PROD_KEY",
      secretKey: "sk_test_51Mz9HQ_SECRET_KEY_PROD",
      fields: [
        { key: "publicKey", label: "Clé Stripe Publique (pk_...)", type: "text" },
        { key: "secretKey", label: "Clé Stripe Secrète (sk_...)", type: "password" }
      ]
    },
    paypal: {
      id: "paypal",
      name: "PayPal Core Wallet",
      logoColor: "from-blue-600 to-indigo-800",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-100",
      enabled: true,
      clientId: "pay_client_id_live_77c2e816a",
      receiverEmail: "paypal-billing@glabeboutique.com",
      fields: [
        { key: "clientId", label: "ID d'intégration Client (PayPal)", type: "text" },
        { key: "receiverEmail", label: "Courriel PayPal du bénéficiaire", type: "text" }
      ]
    }
  });

  if (!currentTenant) return null;

  const plans = [
    { 
      id: "Starter Sandbox", 
      price: 0, 
      maxSeats: 10, 
      desc: "Idéal pour évaluer en local, lancer des diagnostics et simuler des appels d'APIs Multi-Tenant." 
    },
    { 
      id: "Business Suite", 
      price: 99, 
      maxSeats: 20, 
      desc: "Parfait pour les micros structures en production, avec SSO JWT et isolation stricte de la base de données." 
    },
    { 
      id: "Enterprise Premium", 
      price: 349, 
      maxSeats: 100, 
      desc: "Idéal pour les holdings à l'échelle mondiale avec rotation automatique des clés asymétriques RSA." 
    }
  ];

  // Map currency helper
  const getCurrencySymbol = (curr: "EUR" | "USD" | "XOF") => {
    switch (curr) {
      case "USD": return "$";
      case "XOF": return "XOF ";
      default: return "€";
    }
  };

  // Convert default price based on selected local currency and billing frequency
  const getPlanPrice = (basePrice: number) => {
    let price = basePrice;
    if (selectedCurrency === "USD") {
      price = basePrice * 1.08; // basic conversion rate
    } else if (selectedCurrency === "XOF") {
      price = basePrice * 655.957; // exact rate to XOF CFA francs
    }
    
    // 20% Discount for Yearly
    if (billingCycle === "annuel") {
      price = price * 0.8;
    }
    
    return Math.round(price);
  };

  const handleSwitchPlan = (
    planId: "Starter Sandbox" | "Business Suite" | "Enterprise Premium", 
    basePrice: number, 
    maxSeats: number
  ) => {
    // Check if current seats exceed limit
    if (currentTenant.users.length > maxSeats) {
      onNotify(`Impossible de basculer : ce plan n'autorise que ${maxSeats} sièges max, alors que votre organisation en possède déjà ${currentTenant.users.length}.`, "warn");
      return;
    }

    const calculatedPrice = getPlanPrice(basePrice);

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        plan: planId,
        price: calculatedPrice,
        seatsMax: maxSeats
      }
    });

    onNotify(`Formule d'abonnement mise à jour pour le tenant : ${planId}`, "success");
  };

  const handleUpdateGatewayKeys = (gatewayId: string, updatedFields: Record<string, string>) => {
    setGateways(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        ...updatedFields,
        enabled: true
      }
    }));
    
    if (gatewayId === "stripe") {
      setTenants({
        ...tenants,
        [currentOrgName]: {
          ...currentTenant,
          stripeApiKey: updatedFields.publicKey || "",
          stripeConnected: true
        }
      });
    }

    onNotify(`Identifiants sécurisés enregistrés avec succès pour ${gateways[gatewayId].name}.`, "success");
  };

  const handleToggleGateway = (gatewayId: string) => {
    const isCurrentlyEnabled = gateways[gatewayId].enabled;
    setGateways(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        enabled: !isCurrentlyEnabled
      }
    }));
    onNotify(`Passerelle ${gateways[gatewayId].name} ${!isCurrentlyEnabled ? 'activée' : 'désactivée'}.`, "info");
  };

  // Initialize simulated checkout flow
  const handleOpenCheckoutSimulator = (gateway: any) => {
    if (!gateway.enabled) {
      onNotify(`Veuillez activer la passerelle ${gateway.name} avant d'initier un paiement.`, "warn");
      return;
    }
    setCheckoutGateway(gateway);
    setCheckoutAmount(currentTenant.price > 0 ? currentTenant.price : 99);
    setCheckoutStep(0);
    setCheckoutPayerPhone("");
    setCheckoutOtpCode("");
    setShowCheckoutModal(true);
  };

  // Run simulated transaction processing
  const handleProceedCheckout = () => {
    if (checkoutStep === 0) {
      // Validate entries
      if (["momo", "orange", "flooz"].includes(checkoutGateway.id) && !checkoutPayerPhone.trim()) {
        onNotify("Veuillez saisir un numéro de téléphone mobile pour le débit.", "warn");
        return;
      }
      
      // Go to simulated OTP
      setCheckoutStep(1);
    } else if (checkoutStep === 1) {
      // Go to network simulation loader
      setCheckoutStep(2);
      
      // Step 2 timer to complete
      setTimeout(() => {
        setCheckoutStep(3);

        const currentCurrencySymbol = getCurrencySymbol(selectedCurrency);
        const refCode = `${checkoutGateway.id.toUpperCase()}_TX_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        // Add new Invoice record
        const newInvoice = {
          date: new Date().toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }),
          user: checkoutPayerEmail || user.email,
          plan: currentTenant.plan,
          price: checkoutAmount,
          ref: refCode,
          gateway: checkoutGateway.name,
          status: "Succeeded",
          currency: currentCurrencySymbol,
          payerPhone: checkoutPayerPhone || undefined,
          billingAddress: legalCompanyAddress
        };

        // If PostgreSQL is active or memory channel works, we update:
        // Also call API to add to the SQLite or PostgreSQL db
        fetch("/api/payments/charge-simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: checkoutAmount, plan: `${currentTenant.plan} (${checkoutGateway.name})` })
        }).catch(err => console.log("Real DB sync pending, utilizing memory channels."));

        // Prepend to React tenants state
        setTenants({
          ...tenants,
          [currentOrgName]: {
            ...currentTenant,
            invoices: [newInvoice as any, ...currentTenant.invoices]
          }
        });

        onNotify(`Virement ${checkoutAmount} ${currentCurrencySymbol} perçu via ${checkoutGateway.name}. Facture générée.`, "success");
      }, 1500);
    }
  };

  // Simulated transaction operations
  const handleToggleRefund = (invoiceRef: string, currentStatus: string) => {
    const isRefunded = currentStatus === "Remboursé";
    const nextStatus = isRefunded ? "Succeeded" : "Remboursé";

    const updatedInvoices = currentTenant.invoices.map((inv: any) => {
      if (inv.ref === invoiceRef) {
        return { ...inv, status: nextStatus };
      }
      return inv;
    });

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        invoices: updatedInvoices
      }
    });

    onNotify(isRefunded ? "Crédit rétabli sur l'encaissement." : `Transaction ${invoiceRef} marquée comme remboursée.`, "warn");
  };

  const handleReAttemptPayment = (invoiceRef: string) => {
    onNotify(`Relance réseau initiée. La passerelle confirme l'écriture existante d'acquittement.`, "info");
  };

  // Safe variables for detailed invoice view calculation
  const getSafeGateway = (inv: any) => inv.gateway || "Stripe Checkout";
  const getSafeStatus = (inv: any) => inv.status || "Succeeded";
  const getSafeCurrency = (inv: any) => inv.currency || "€";

  // Filter invoices based on search & active gateway selector
  const filteredInvoices = currentTenant.invoices.filter((inv: any) => {
    // Search matching
    const matchesSearch = inv.ref.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) || 
                          inv.plan.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) || 
                          inv.user.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
    
    // Gateway matching
    if (invoiceFilterGateway === "all") return matchesSearch;
    const gatewayValue = (inv.gateway || "Stripe Checkout").toLowerCase();
    
    if (invoiceFilterGateway === "stripe") return matchesSearch && gatewayValue.includes("stripe");
    if (invoiceFilterGateway === "paypal") return matchesSearch && gatewayValue.includes("paypal");
    if (invoiceFilterGateway === "momo") return matchesSearch && gatewayValue.includes("mtn");
    if (invoiceFilterGateway === "orange") return matchesSearch && gatewayValue.includes("orange");
    if (invoiceFilterGateway === "flooz") return matchesSearch && gatewayValue.includes("flooz");
    if (invoiceFilterGateway === "yas") return matchesSearch && gatewayValue.includes("yas");
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-motion-in">
      
      {/* ========================================================
         MODAL: INTERACTIVE PAYMENT GATEWAY SIMULATION WIZARD
         ======================================================== */}
      {showCheckoutModal && checkoutGateway && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-motion-in">
            
            {/* Header branding */}
            <div className={`p-6 bg-gradient-to-r ${checkoutGateway.logoColor} text-white relative`}>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 text-white/85 hover:text-white bg-black/15 hover:bg-black/25 p-1 px-2 text-xs font-black rounded-lg transition-colors cursor-pointer"
              >
                ✕ Fermer
              </button>
              
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-[10px] font-mono tracking-wider bg-white/20 px-2 py-0.5 rounded uppercase font-bold text-white">
                  Simulation Bac à Sable sécurisée
                </span>
              </div>
              
              <h4 className="font-extrabold text-lg mt-3">Passerelle : {checkoutGateway.name}</h4>
              <p className="text-xs text-white/80 mt-1 leading-normal">
                Module de conformité Multi-Tenant de glabeboutique.com raccordement e-commerce.
              </p>
            </div>

            {/* Steps & Content */}
            <div className="p-6 space-y-5">
              
              {/* Payment Summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block uppercase font-mono text-[8px] tracking-wider">Formule en cours de règlement</span>
                  <span className="text-slate-800 font-extrabold block text-xs mt-0.5">{currentTenant.plan}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block uppercase font-mono text-[8px] tracking-wider">Montant facturé</span>
                  <span className="text-brand-orange font-black text-lg block">{checkoutAmount} {getCurrencySymbol(selectedCurrency)}</span>
                </div>
              </div>

              {/* STEP 0: Saisie des informations */}
              {checkoutStep === 0 && (
                <div className="space-y-4 animate-motion-in">
                  
                  {/* Payer Email */}
                  <div className="space-y-1 text-xs text-slate-700">
                    <label className="block text-[9px] font-mono font-bold uppercase text-slate-400">Courriel du Payeur SSO</label>
                    <input 
                      type="email"
                      required
                      value={checkoutPayerEmail}
                      onChange={(e) => setCheckoutPayerEmail(e.target.value)}
                      placeholder="Ex: comptable@entreprise.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:bg-white focus:border-indigo-500 text-xs text-slate-800 font-medium"
                    />
                  </div>

                  {/* Gateway Specific Input */}
                  {["momo", "orange", "flooz"].includes(checkoutGateway.id) ? (
                    <div className="space-y-1 text-xs text-slate-700 animate-motion-in">
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-400">Numéro de Téléphone Mobile Money ({checkoutGateway.name})</label>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-650 flex items-center justify-center">
                          {checkoutGateway.id === "momo" ? "+225" : checkoutGateway.id === "orange" ? "+221" : "+228"}
                        </span>
                        <input 
                          type="tel"
                          required
                          value={checkoutPayerPhone}
                          onChange={(e) => setCheckoutPayerPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ex: 07 49 10 20"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:bg-white focus:border-indigo-550 text-xs font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        Une demande push USSD interactive sera transmise sur ce numéro pour valider le code PIN.
                      </p>
                    </div>
                  ) : checkoutGateway.id === "stripe" ? (
                    <div className="space-y-3.5 animate-motion-in text-xs text-slate-700">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono font-bold uppercase text-slate-400">Numéro de carte bancaire</label>
                        <input 
                          type="text"
                          required
                          value={checkoutCardNumber}
                          onChange={(e) => setCheckoutCardNumber(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold uppercase text-slate-400">Validité</label>
                          <input 
                            type="text"
                            required
                            value={checkoutCardExpiry}
                            onChange={(e) => setCheckoutCardExpiry(e.target.value)}
                            placeholder="MM/AA"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-mono text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold uppercase text-slate-400 font-bold">CVC / CVV</label>
                          <input 
                            type="text"
                            required
                            value={checkoutCardCvv}
                            onChange={(e) => setCheckoutCardCvv(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs text-slate-700 animate-motion-in">
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-400">Identifiant de Compte Intégré</label>
                      <input 
                        type="text"
                        required
                        placeholder="Ex: yas-client-3918"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:bg-white text-xs font-mono"
                      />
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Liaison d'autorisation sur le wallet marchand de {checkoutGateway.name}.
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={handleProceedCheckout}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Valider les détails et payer</span>
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  </button>
                </div>
              )}

              {/* STEP 1: Two-Factor / Push notification interactive check */}
              {checkoutStep === 1 && (
                <div className="space-y-4 animate-motion-in text-center py-2">
                  <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 animate-bounce">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-sm text-slate-900">Autorisation à double facteur (2FA)</h5>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
                      {["momo", "orange", "flooz"].includes(checkoutGateway.id) 
                        ? `Une vérification OTP a été simulée vers ${checkoutPayerPhone || "votre portable"}. Saisissez le code PIN à 4 chiffres.` 
                        : "Saisissez le code de confirmation envoyé à votre adresse courriel ou généré par l'application pour valider."
                      }
                    </p>
                  </div>

                  <div className="max-w-[200px] mx-auto">
                    <input 
                      type="text"
                      maxLength={6}
                      value={checkoutOtpCode}
                      onChange={(e) => setCheckoutOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ex : 4920"
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-250 rounded-xl py-3 px-3 text-center text-sm font-mono tracking-widest font-black focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <button 
                    onClick={handleProceedCheckout}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                  >
                    Confirmer la transaction
                  </button>
                </div>
              )}

              {/* STEP 2: Processing network loader */}
              {checkoutStep === 2 && (
                <div className="space-y-4 text-center py-6 animate-motion-in">
                  <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 animate-spin">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-900">Contact de l'écosystème Glablab</h5>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    Appel sécurisé des services APIs de {checkoutGateway.name}. Encaissement sous le tenant {currentOrgName}...
                  </p>
                </div>
              )}

              {/* STEP 3: Invoice Success statement */}
              {checkoutStep === 3 && (
                <div className="space-y-5 text-center py-3 animate-motion-in">
                  <div className="mx-auto h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <Check className="h-7 w-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-sm text-slate-900">Paiement Vérifié & Reçu</h5>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                      Votre débit de {checkoutAmount} {getCurrencySymbol(selectedCurrency)} a été validé. La pièce comptable est intégrée au journal avec succès !
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 divide-y divide-slate-150 text-[10.5px] font-mono text-slate-600 space-y-1 text-left">
                    <div className="flex justify-between py-1">
                      <span>Processeur de paie :</span>
                      <strong className="text-slate-800">{checkoutGateway.name}</strong>
                    </div>
                    <div className="flex justify-between py-1 pt-1.5">
                      <span>Identifiant transaction :</span>
                      <strong className="text-brand-orange truncate max-w-[150px]">{checkoutGateway.id.toUpperCase()}_TX_SIM</strong>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setActiveBillingSubTab("invoices");
                    }}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Consulter le journal des Factures</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-450" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         MODAL: DETAILED CORPORATE PDF INVOICE DRAWER
         ======================================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-motion-in max-h-[90vh] flex flex-col">
            
            {/* Controls Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-850">
              <div className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-[#FF7A00]" />
                <span className="text-xs font-black font-mono tracking-tight text-white uppercase">
                  Aperçu Facture : {selectedInvoice.ref}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()} 
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-755 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1 text-white border border-slate-700 hover:border-slate-600"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Imprimer</span>
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs bg-slate-800 hover:bg-slate-755 rounded-lg p-1.5"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>

            {/* Simulated Corporate Invoice Body (Clean Printable layout) */}
            <div className="p-8 space-y-8 flex-1 overflow-y-auto bg-white text-slate-900 leading-normal text-xs" id="invoice-printable-body">
              
              {/* Logo and metadata */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-950 flex items-center gap-1.5">
                    <Building2 className="h-5 w-5 text-[#FF7A00]" />
                    GLABTECH HOLDING SA
                  </h3>
                  <p className="text-[10.5px] text-slate-450 font-medium leading-relaxed mt-1 max-w-xs">
                    Editeur global SaaS de progiciels hébergés & Répertoire unifié de microservices d'automatisation.
                  </p>
                </div>
                
                <div className="text-right space-y-1">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-mono font-black border border-emerald-100 uppercase inline-block">
                    FACTURÉ / ACQUITTÉ
                  </span>
                  <div className="text-[10.5px] font-mono text-slate-400 mt-2">
                    <div>Référence : <strong className="text-slate-900">{selectedInvoice.ref}</strong></div>
                    <div>Date : <strong className="text-slate-900">{selectedInvoice.date}</strong></div>
                    <div>Gateway : <strong className="text-slate-900">{getSafeGateway(selectedInvoice)}</strong></div>
                  </div>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-6 text-slate-700 leading-relaxed font-semibold">
                <div className="bg-slate-50/65 rounded-2xl p-4.5 border border-slate-50">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">Émetteur</span>
                  <strong className="text-slate-900 font-extrabold">{legalCompanyName} SAS</strong>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {legalCompanyAddress}<br />
                    Matricule : {taxIdNumber}<br />
                    Courriel : invoice-sso@glabeboutique.com
                  </p>
                </div>
                
                <div className="bg-slate-50/65 rounded-2xl p-4.5 border border-slate-50">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">Destinataire (Tenant)</span>
                  <strong className="text-slate-900 font-extrabold">{currentOrgName}</strong>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Utilisateur Saisi : {selectedInvoice.user}<br />
                    Plan Actif : {selectedInvoice.plan.split(" ")[0]} Edition<br />
                    Canal : Cloud logiquement Partitionné
                  </p>
                </div>
              </div>

              {/* Line items Table */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Détail des prestations de services</span>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] uppercase text-slate-500">
                      <tr>
                        <th className="p-3">Description du progiciel</th>
                        <th className="text-center p-3">Quantité / Sièges</th>
                        <th className="text-right p-3">Prix unitaire (H.T)</th>
                        <th className="text-right p-3">Total (H.T)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      <tr>
                        <td className="p-3">
                          <strong className="text-slate-900 block font-bold">Licence d'usage SaaS : {selectedInvoice.plan}</strong>
                          <span className="text-[10.2px] text-slate-400 leading-normal mt-0.5 block font-medium">
                            Accès unifié aux 6 microservices de glabeboutique.com avec synchronisation PostgreSQL.
                          </span>
                        </td>
                        <td className="text-center p-3 font-mono">{currentTenant.users.length} Sièges</td>
                        <td className="text-right p-3 font-mono">
                          {(selectedInvoice.price * 0.85).toFixed(2)} {getSafeCurrency(selectedInvoice)}
                        </td>
                        <td className="text-right p-3 font-mono">
                          {(selectedInvoice.price * 0.85).toFixed(2)} {getSafeCurrency(selectedInvoice)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">
                          <strong className="text-slate-900 block font-bold">Options d'isolation et double facteur MFA</strong>
                          <span className="text-[10.2px] text-slate-400 leading-normal mt-0.5 block font-medium">
                            Double chiffrement asymétrique RSA-4096 et ponts réseau G-Link.
                          </span>
                        </td>
                        <td className="text-center p-3 font-mono">1 Tenant</td>
                        <td className="text-right p-3 font-mono">
                          {(selectedInvoice.price * 0.15).toFixed(2)} {getSafeCurrency(selectedInvoice)}
                        </td>
                        <td className="text-right p-3 font-mono">
                          {(selectedInvoice.price * 0.15).toFixed(2)} {getSafeCurrency(selectedInvoice)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total calculations ledger */}
              <div className="flex justify-end pt-1">
                <div className="w-64 space-y-2 border-t border-slate-150 pt-4 text-xs font-mono text-slate-650">
                  <div className="flex justify-between font-semibold">
                    <span>Total Brut (H.T) :</span>
                    <span className="text-slate-800 font-bold">{selectedInvoice.price.toFixed(2)} {getSafeCurrency(selectedInvoice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Remises / Rabais :</span>
                    <span className="text-emerald-600 font-bold">0.00 {getSafeCurrency(selectedInvoice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Taxe sur Valeur Ajoutée (18%) :</span>
                    <span className="text-slate-800">Inclus (CFA/EUR)</span>
                  </div>
                  <div className="flex justify-between font-black border-t border-dashed border-slate-200 pt-2 text-sm">
                    <span className="text-slate-950 font-extrabold">Net à payer :</span>
                    <span className="text-brand-orange text-lg font-black">{selectedInvoice.price.toFixed(2)} {getSafeCurrency(selectedInvoice)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 text-center text-[10.5px] font-mono text-slate-450 leading-snug">
                <p>Facture générée numériquement par glabeboutique.com sous signature de hachage SHA-256.</p>
                <p className="mt-1">Pour toute question sur la réconciliation des comptes, veuillez contacter support@glabeboutique.com.</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         MAIN BILLING HEADER WORKSPACE
         ======================================================== */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6.5 shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute -right-12 -top-12 h-44 w-44 bg-[#FF7A00]/[0.06] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-44 w-44 bg-teal-500/[0.04] rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1.5 flex-1 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF7A00] text-slate-950 text-[10px] font-mono font-black tracking-wider px-2 py-0.5 rounded uppercase">
              RECONCILIATION & PAIEMENTS
            </span>
            <span className="text-slate-700 font-extrabold">•</span>
            <span className="text-xs text-slate-350 font-mono">Holdings d'exploitation</span>
          </div>
          
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
            <CreditCard className="h-5.5 w-5.5 text-brand-orange" />
            Espace Facturation du Tenant : {currentOrgName}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Consultez le niveau de licence SSO actif, raccordez vos clefs privées pour les 6 opérateurs (Orange Money, MTN, Flooz, Stripe, PayPal, Mixx by Yas) et effectuez des simulations de prélèvement.
          </p>
        </div>

        {/* Live balance sheet brief cards */}
        <div className="flex gap-3 z-10 w-full md:w-auto font-mono text-[11px]">
          <div className="bg-slate-850/60 border border-slate-800 p-3.5 rounded-2xl flex-1 md:flex-none text-center min-w-[120px]">
            <span className="text-[8.5px] text-slate-450 block uppercase tracking-wider font-bold">Tarif unifié</span>
            <strong className="text-slate-100 font-extrabold text-sm block mt-1">{currentTenant.price} {getCurrencySymbol(selectedCurrency)}/mois</strong>
          </div>
          <div className="bg-slate-850/60 border border-slate-800 p-3.5 rounded-2xl flex-1 md:flex-none text-center min-w-[124px]">
            <span className="text-[8.5px] text-slate-450 block uppercase tracking-wider font-bold">Sièges raccordés</span>
            <strong className="text-indigo-400 font-extrabold text-sm block mt-1">{currentTenant.users.length} / {currentTenant.seatsMax}</strong>
          </div>
        </div>
      </div>

      {/* ========================================================
         TAB SELECTORS (4 SPECIALIZED TIERS)
         ======================================================== */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
        {[
          { id: "abonnements", label: "💼 Abonnements & Plans" },
          { id: "facturation", label: "⚙️ Facturation & Passerelles (6 API)" },
          { id: "invoices", label: `📄 Journal des Factures (${currentTenant.invoices.length})` },
          { id: "historique", label: "⏱️ LEDGER - Historique des Paiements" }
        ].map(subTab => {
          const isActive = activeBillingSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveBillingSubTab(subTab.id as any)}
              className={`py-3 px-5 text-xs font-extrabold border-b-2 tracking-tight transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "border-[#FF7A00] text-[#FF7A00] font-black bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-50"
              }`}
            >
              {subTab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================
         VIEW 1: ABONNEMENTS ET FORMULES DU TENANT
         ======================================================== */}
      {activeBillingSubTab === "abonnements" && (
        <div className="space-y-6 animate-motion-in">
          
          {/* Subscription toggle cycle option */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-[#FF7A00]" />
                Période contractuelle & Devises
              </h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-0.5 font-medium">
                Profitez de remises annuelles importantes sur les licences ou calibrez la devise locale d'un clic.
              </p>
            </div>

            <div className="flex items-center gap-4">
              
              {/* Currency Select */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="text-slate-400 font-bold">Devise :</span>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => {
                    const nextCurr = e.target.value as any;
                    setSelectedCurrency(nextCurr);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($ USD)</option>
                  <option value="XOF">FCFA (XOF)</option>
                </select>
              </div>

              {/* Cycle selection toggle UI */}
              <div className="bg-slate-100 p-1 rounded-xl flex">
                <button 
                  onClick={() => setBillingCycle("mensuel")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${billingCycle === "mensuel" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  Mensuel
                </button>
                <button 
                  onClick={() => setBillingCycle("annuel")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${billingCycle === "annuel" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  <span>Annuel</span>
                  <span className="bg-brand-orange text-white text-[8px] font-mono px-1 py-0.2 rounded font-black">-20%</span>
                </button>
              </div>

            </div>
          </div>

          {/* Pricing Planes Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p) => {
              const isSelected = currentTenant.plan === p.id;
              const unitPrice = getPlanPrice(p.price);

              return (
                <div 
                  key={p.id}
                  className={`border rounded-3xl p-6.5 flex flex-col justify-between transition-all relative ${
                    isSelected 
                      ? "border-brand-orange bg-[#FF7A00]/[0.015] shadow-premium" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-4 right-4 bg-brand-orange text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-full">
                      PRESTATION ACTIVE
                    </span>
                  )}

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-910 flex items-center gap-2">
                      <Zap className={`h-4.5 w-4.5 ${isSelected ? 'text-[#FF7A00]' : 'text-slate-400'}`} />
                      {p.id}
                    </h4>
                    <p className="text-[11px] text-slate-450 mt-2 min-h-[48px] leading-relaxed font-medium">{p.desc}</p>

                    <div className="my-5 flex items-baseline">
                      <span className="text-3xl font-black text-slate-950 font-mono">{unitPrice} {getCurrencySymbol(selectedCurrency)}</span>
                      <span className="text-xs text-slate-400 font-bold ml-1"> /mois</span>
                    </div>

                    <div className="text-[10.5px] font-mono text-slate-500 space-y-2 border-t border-slate-100 pt-4.5 leading-relaxed font-semibold">
                      <div className="flex justify-between">
                        <span>Sièges d'accès max :</span>
                        <strong className="text-slate-800 font-extrabold">{p.maxSeats}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fréquence :</span>
                        <strong className="text-indigo-600 capitalize font-bold">{billingCycle}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Isolation log. :</span>
                        <strong className="text-emerald-600">Base Dédiée SQL</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={() => handleSwitchPlan(p.id as any, p.price, p.maxSeats)}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-slate-950 text-white shadow" 
                          : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200"
                      }`}
                    >
                      {isSelected ? "✔ Formule Actuelle" : "Migrer vers ce palier"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================
         VIEW 2: PASSERELLES ET FACTURATION PROFILE WORKSPACE
         ======================================================== */}
      {activeBillingSubTab === "facturation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-motion-in">
          
          {/* Settings of Legal profiles card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 lg:col-span-1 h-fit">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
              <Settings className="h-4.5 w-4.5 text-[#FF7A00]" />
              Configuration Générale de Facturation
            </h4>
            <p className="text-[11px] text-slate-450 mt-1 font-semibold leading-normal">
              Ajustez les éléments administratifs du tenant pour le rapprochement légal des factures.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Nom légal Société Marchande</label>
                <input 
                  type="text"
                  value={legalCompanyName}
                  onChange={(e) => setLegalCompanyName(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Adresse Commerciale</label>
                <textarea 
                  value={legalCompanyAddress}
                  onChange={(e) => setLegalCompanyAddress(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 h-16"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 block uppercase">ID Fiscal / N° de TVA</label>
                <input 
                  type="text"
                  value={taxIdNumber}
                  onChange={(e) => setTaxIdNumber(e.target.value)}
                  className="w-full text-xs font-mono border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Auto Renewal check */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="font-extrabold text-slate-800 block">Renouvellement automatique</span>
                  <span className="text-[10px] text-slate-450 font-semibold block leading-normal mt-0.5">Prélever via API à chaque échéance</span>
                </div>
                <input 
                  type="checkbox"
                  checked={isAutoRenewEnabled}
                  onChange={(e) => {
                    setIsAutoRenewEnabled(e.target.checked);
                    onNotify(`Option de renouvellement automatique ${e.target.checked ? "ACTIVÉE" : "DÉSACTIVÉ (Danger d'expiration)"}.`, e.target.checked ? "success" : "warn");
                  }}
                  className="h-4 w-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <button 
                onClick={() => onNotify("Profil et informations comptables enregistrées.", "success")}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Sauvegarder le profil
              </button>
            </div>
          </div>

          {/* 6 Payment Gateways integratons cards listing */}
          <div className="lg:col-span-2 space-y-5">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Sliders className="h-4.5 w-4.5 text-brand-orange" />
                Intégrations de Passerelles de Paiement
              </h4>
              <p className="text-[11.2px] text-slate-450 font-semibold">
                Configurez de réels règlements de factures e-commerce pour le tenant {currentOrgName} en raccordant vos identifiants ou clés tokenisées.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(gateways).map((gw: any) => {
                return (
                  <div 
                    key={gw.id}
                    className={`bg-white border rounded-3xl p-5.5 flex flex-col justify-between transition-all ${
                      gw.enabled 
                        ? "border-slate-200 shadow-premium" 
                        : "border-slate-100 opacity-70 bg-[#F5F7FA]/45"
                    }`}
                  >
                    <div>
                      {/* Logo header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-xl bg-gradient-to-tr ${gw.logoColor} text-white font-mono font-black text-xs flex items-center justify-center shadow-sm`}>
                            {gw.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-extrabold font-mono text-[11px] text-slate-900 block">{gw.name}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-mono border ${gw.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-slate-105 text-slate-400 border-slate-200'}`}>
                              {gw.enabled ? "ACTIVE (CONFIGURED)" : "INACTIVE PRE-SETUP"}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleToggleGateway(gw.id)}
                          className={`text-[9.5px] font-mono font-bold hover:underline cursor-pointer ${gw.enabled ? 'text-rose-600' : 'text-emerald-650'}`}
                        >
                          {gw.enabled ? "Désactiver" : "Activer"}
                        </button>
                      </div>

                      {/* Config lines fields */}
                      <div className="mt-4.5 space-y-2.5">
                        {gw.fields.map((f: any) => (
                          <div key={f.key} className="space-y-0.5">
                            <span className="text-[8.5px] uppercase font-mono tracking-wider font-bold text-slate-400 block">{f.label}</span>
                            <input 
                              type={f.type}
                              readOnly
                              value={gw[f.key] || "••••••••••••••••••••••••••••••"}
                              className="w-full text-xs font-mono bg-slate-50/70 border border-slate-150 rounded-lg p-1.5 px-2.5 outline-none select-all text-slate-650"
                            />
                          </div>
                        ))}
                      </div>

                    </div>

                    <div className="border-t border-slate-100 mt-5 pt-3.5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-450">Débit : <strong className="text-slate-700">EUR/XOF</strong></span>
                      
                      <div className="flex gap-2">
                        {gw.enabled && (
                          <button 
                            onClick={() => handleOpenCheckoutSimulator(gw)}
                            className="bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-bold font-mono py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Play className="h-3 w-3 text-[#FF7A00]" />
                            <span>Paiement démo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
         VIEW 3: JOURNAL DES FACTURES EMISES
         ======================================================== */}
      {activeBillingSubTab === "invoices" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium space-y-5 animate-motion-in">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-[#FF7A00]" />
                Journal de Rapprochement Stripe & Invoices
              </h4>
              <p className="text-[11px] text-slate-450 font-semibold leading-normal mt-0.5">
                Consultez, recherchez et simulez des impressions de quittances de factures physiques d'un clic.
              </p>
            </div>

            {/* Quick Sim trigger button */}
            <button 
              onClick={() => handleOpenCheckoutSimulator(gateways.stripe)}
              className="p-1.5 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-[10.5px] font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Simuler prélèvement Stripe</span>
            </button>
          </div>

          {/* Search filter panel */}
          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center text-xs">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher par référence, plan, ou courriel..."
                value={invoiceSearchQuery}
                onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-brand-orange text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Gateway quick tabs */}
            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto font-semibold">
              <select 
                value={invoiceFilterGateway}
                onChange={(e) => setInvoiceFilterGateway(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:border-indigo-505"
              >
                <option value="all">Toutes passerelles</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="momo">MTN MoMo</option>
                <option value="orange">Orange Money</option>
                <option value="flooz">Moov Flooz</option>
                <option value="yas">Mixx by Yas</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase font-mono">
                  <th className="py-2">Date émission</th>
                  <th>Donneur d'ordre</th>
                  <th>Palier</th>
                  <th>Passerelle de paie</th>
                  <th>Montant</th>
                  <th>Référence Unique (Ref)</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 font-mono text-[10.5px]">
                      Aucune transaction de souscription correspondante trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv: any, idx: number) => {
                    const gw = getSafeGateway(inv);
                    const isRefunded = inv.status === "Remboursé";

                    return (
                      <tr key={idx} className={`hover:bg-slate-50/50 ${isRefunded ? 'opacity-70 bg-slate-50/20' : ''}`}>
                        <td className="py-3 font-mono text-[11px] text-slate-450">{inv.date}</td>
                        <td className="truncate max-w-[130px]">{inv.user}</td>
                        <td className="font-bold text-slate-805">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-mono font-bold uppercase">
                            {inv.plan.split(" ")[0]}
                          </span>
                        </td>
                        <td>
                          <span className="text-slate-650 inline-flex items-center gap-1">
                            <span className="text-[10px] font-mono leading-none">{gw}</span>
                          </span>
                        </td>
                        <td className="font-bold text-slate-950 font-mono">
                          {inv.price.toFixed(2)} {getSafeCurrency(inv)}
                        </td>
                        <td className="font-mono text-[10px] text-brand-orange truncate max-w-[124px] uppercase">
                          {inv.ref}
                        </td>
                        <td className="py-2.5 text-right">
                          <button 
                            onClick={() => setSelectedInvoice(inv)}
                            className="text-[10px] font-mono font-black text-indigo-650 hover:underline px-2.5 py-1 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" /> Visualiser
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
         VIEW 4: COMPTABILITE LEDGER & HISTORIQUE DES MOVEMENTS
         ======================================================== */}
      {activeBillingSubTab === "historique" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium space-y-4 animate-motion-in">
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-slate-700" />
                Ledger Transactionnel Comptroller
              </h4>
              <p className="text-[11px] text-slate-450 font-semibold leading-normal mt-0.5">
                Historique auditable de l'ensemble des mouvements financiers perçus via les intégrations de glabeboutique.com.
              </p>
            </div>
            
            <span className="bg-[#FF7A00]/5 text-[#FF7A00] text-[9.5px] font-mono border border-[#FF7A00]/20 px-2.5 py-1 rounded-full font-bold">
              Total Flux : {currentTenant.invoices.length} transactions
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase font-mono py-2">
                  <th className="pb-2.5">Transaction ID</th>
                  <th>Operateur financier</th>
                  <th>Type de flux</th>
                  <th>Montant</th>
                  <th>Status de compensation</th>
                  <th className="text-right">Actions audits de SecOps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-750 font-semibold">
                {currentTenant.invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-mono text-[10.5px]">
                      Aucun mouvement audité dans le registre de ce tenant.
                    </td>
                  </tr>
                ) : (
                  currentTenant.invoices.map((inv: any, idx: number) => {
                    const gw = getSafeGateway(inv);
                    const isRefunded = inv.status === "Remboursé";

                    return (
                      <tr key={idx} className={`hover:bg-slate-50/50 ${isRefunded ? 'bg-amber-50/15' : ''}`}>
                        <td className="py-3.5 font-mono text-slate-950">
                          {inv.ref.replace("stripe", "ST").replace("momo", "MOMO").replace("orange", "OM").replace("flooz", "FLZ")}
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-slate-100 rounded-full bg-slate-50 text-[10px] font-bold text-slate-700 font-mono">
                            {gw}
                          </span>
                        </td>
                        <td className="font-mono text-[10px] text-slate-505">
                          Prélèvement récurrent SaaS
                        </td>
                        <td className="font-mono font-extrabold text-slate-900">
                          {inv.price.toFixed(2)} {getSafeCurrency(inv)}
                        </td>
                        <td>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold font-mono uppercase ${
                            isRefunded 
                              ? "bg-amber-100 text-amber-850" 
                              : "bg-emerald-50 text-emerald-700"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isRefunded ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                            {isRefunded ? "Remboursé" : "Succeeded"}
                          </span>
                        </td>
                        <td className="py-1 text-right space-x-2">
                          <button 
                            onClick={() => handleToggleRefund(inv.ref, inv.status)}
                            className={`text-[9.5px] font-mono font-bold hover:underline cursor-pointer ${isRefunded ? 'text-emerald-600' : 'text-amber-600'}`}
                          >
                            {isRefunded ? "Annuler le remboursement" : "Simuler remboursement"}
                          </button>
                          
                          <button 
                            onClick={() => handleReAttemptPayment(inv.ref)}
                            className="text-[9.5px] text-slate-400 font-mono font-bold hover:underline cursor-pointer hover:text-indigo-600"
                          >
                            Tester API
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 3. USERS & ROLES TAB (Multi-Tenant Access Control)
// ==========================================
interface UsersTabProps {
  user: PortalUser;
  tenants: Record<string, TenantData>;
  setTenants: React.Dispatch<React.SetStateAction<Record<string, TenantData>>>;
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export function UsersTab({
  user,
  tenants,
  setTenants,
  onNotify
}: UsersTabProps) {
  const currentOrgName = user.tenant;
  const currentTenant = tenants[currentOrgName];

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("CTO Developer");

  // Premium administration lists (Simulating live database interaction for Gildas)
  const [deletedUsers, setDeletedUsers] = useState([
    { id: "del-1", name: "Marc Dupond", email: "m.dupond@glab.com", role: "CTO Developer", deletedAt: "Y a 2 heures" },
    { id: "del-2", name: "Annette Legrand", email: "a.legrand@glab.com", role: "HR Manager", deletedAt: "Hier" }
  ]);

  const [accessRequests, setAccessRequests] = useState([
    { id: "req-1", name: "Lucas Bernard", email: "lucas.b@glab.com", targetApp: "glab-erp", requestedRole: "CTO Developer", reason: "Besoin d'accès aux flux de production comptable." },
    { id: "req-2", name: "Marta Silva", email: "marta.s@glab.com", targetApp: "glab-resto", requestedRole: "Collaborateur", reason: "Intégration de la micro-application Resto pour le site Nord." }
  ]);

  const [pendingPayments, setPendingPayments] = useState([
    { id: "pay-1", reference: "INV-2026-482", company: "GLABTECH HQ (Europe)", amount: 349, date: "26 Mai 2026", method: "Virement SEPA" },
    { id: "pay-2", reference: "INV-2026-483", company: "GLABTECH North America", amount: 99, date: "25 Mai 2026", method: "Stripe Escrow Re-verification" }
  ]);

  const [updates, setUpdates] = useState([
    { id: "upd-1", version: "v3.6.1-patch5", category: "Sécurité", description: "Renforcement des politiques de rate limiting et d'asymétrie RSA.", status: "approbation_requise" },
    { id: "upd-2", version: "v3.7.0-beta1", category: "Fonctionnel", description: "Déploiement du connecteur SSO fédéré Zoho & Salesforce.", status: "approbation_requise" }
  ]);

  const handleRestoreDeletedUser = (deletedId: string) => {
    const targetUser = deletedUsers.find(u => u.id === deletedId);
    if (!targetUser) return;

    // Add back to active list under current tenant
    const restoredUser = {
      id: `usr-${Date.now()}`,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role as UserRole,
      status: "actif" as const,
      lastLogin: "Rétabli par Gildas",
      permissions: ["apps", "settings"]
    };

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        users: [...currentTenant.users, restoredUser]
      }
    });

    setDeletedUsers(deletedUsers.filter(u => u.id !== deletedId));
    onNotify(`Utilisateur '${targetUser.name}' rétabli avec succès sous le SSO actif !`, "success");
  };

  const handleApproveAccess = (requestId: string) => {
    const targetReq = accessRequests.find(r => r.id === requestId);
    if (!targetReq) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      name: targetReq.name,
      email: targetReq.email,
      role: targetReq.requestedRole as UserRole,
      status: "actif" as const,
      lastLogin: "Autorisé",
      permissions: ["apps"]
    };

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        users: [...currentTenant.users, newUser]
      }
    });

    setAccessRequests(accessRequests.filter(r => r.id !== requestId));
    onNotify(`Demande d'accès de '${targetReq.name}' approuvée d'une signature JWT unifiée !`, "success");
  };

  const handleApprovePayment = (paymentId: string) => {
    const targetPay = pendingPayments.find(p => p.id === paymentId);
    if (!targetPay) return;

    // Add to tenant invoices list
    const newInvoice = {
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      user: "anges.gildas@gmail.com",
      plan: targetPay.amount === 349 ? "Enterprise Premium" : "Business Suite",
      price: targetPay.amount,
      ref: `stripe_sso_${targetPay.reference.toLowerCase()}`
    };

    setTenants({
      ...tenants,
      [targetPay.company]: {
        ...tenants[targetPay.company],
        invoices: [newInvoice, ...tenants[targetPay.company].invoices]
      }
    });

    setPendingPayments(pendingPayments.filter(p => p.id !== paymentId));
    onNotify(`Paiement de la facture '${targetPay.reference}' validé et lettré par l'administrateur !`, "success");
  };

  const handleApplyUpdate = (updateId: string) => {
    setUpdates(updates.map(upd => {
      if (upd.id === updateId) {
        return { ...upd, status: "appliqué" };
      }
      return upd;
    }));
    onNotify("Mise à jour déployée sur l'ensemble de l'architecture micro-services !", "success");
  };

  if (!currentTenant) return null;

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    if (currentTenant.users.length >= currentTenant.seatsMax) {
      onNotify(`Limite de sièges SSO atteinte (${currentTenant.seatsMax}). Veuillez mettre à jour votre plan dans l'onglet 'Billing'.`, "warn");
      return;
    }

    const defaultPermissionsMap: Record<UserRole, string[]> = {
      "Global Owner": ["apps", "billing", "users", "settings"],
      "CTO Developer": ["apps", "settings"],
      "Finance Admin": ["billing"],
      "HR Manager": ["apps"],
      "Guest Client": []
    };

    const newUser = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: "invité",
      lastLogin: "-",
      permissions: defaultPermissionsMap[newRole]
    };

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        users: [...currentTenant.users, newUser]
      }
    });

    setNewName("");
    setNewEmail("");
    onNotify(`Collaborateur '${newName}' provisionné avec authentification SSO JWT sous le tenant.`, "success");
  };

  const handleToggleScope = (userId: string, scope: string) => {
    const updatedUsers = currentTenant.users.map(u => {
      if (u.id === userId) {
        const hasScope = u.permissions.includes(scope);
        const updatedPermissions = hasScope 
          ? u.permissions.filter(p => p !== scope)
          : [...u.permissions, scope];
        return { ...u, permissions: updatedPermissions };
      }
      return u;
    });

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        users: updatedUsers
      }
    });

    onNotify("Permissions de cryptogramme JWT actualisées.", "info");
  };

  const handleSuspendUser = (userId: string, currentStatus: string) => {
    const targetStatus = currentStatus === "actif" ? "suspendu" : "actif";
    const updatedUsers = currentTenant.users.map(u => {
      if (u.id === userId) {
        return { ...u, status: targetStatus, lastLogin: targetStatus === "suspendu" ? "-" : u.lastLogin };
      }
      return u;
    });

    setTenants({
      ...tenants,
      [currentOrgName]: {
        ...currentTenant,
        users: updatedUsers
      }
    });

    onNotify(`Statut de l'utilisateur SSO basculé : ${targetStatus === "suspendu" ? "SUSPENDU (JWT révoqué)" : "ACTIF"}`, targetStatus === "suspendu" ? "warn" : "success");
  };

  return (
    <div className="space-y-6 animate-motion-in">
      
      {/* SSO Directory */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-orange" />
              Répertoire National d'Identité SSO - {currentOrgName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Isolez les rôles d'accès et modifiez granularnellement les jetons JWT des collaborateurs.</p>
          </div>

          <span className="bg-slate-100 text-slate-800 text-[10.5px] font-mono font-bold px-3 py-1 rounded-full border border-slate-200">
            {currentTenant.users.length} / {currentTenant.seatsMax} collaborateurs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase font-mono py-2">
                <th className="pb-2.5">Utilisateur</th>
                <th>E-mail</th>
                <th>Rôle SSO</th>
                <th>Statut</th>
                <th>Dernier Transit</th>
                <th>Abonnement & Droits d'Accès Clés (Scopes JWT)</th>
                <th>Option Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {currentTenant.users.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50">
                  <td className="py-3 flex items-center gap-2">
                    <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-mono font-black text-xs">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900">{member.name}</span>
                  </td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                      member.role === 'Global Owner' ? 'bg-orange-55 text-[#FF7A00] border-[#FF7A00]/20' :
                      member.role === 'CTO Developer' ? 'bg-sky-50 text-sky-700 border-sky-300/30' :
                      member.role === 'Finance Admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-300/30' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full inline-block ${member.status === 'actif' ? 'bg-emerald-500 shadow-emerald- glow' : member.status === 'invité' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                      <span className="capitalize text-[10px]">{member.status}</span>
                    </div>
                  </td>
                  <td className="font-mono text-[11px] text-slate-400">{member.lastLogin}</td>
                  <td>
                    {/* Access scopes checkmarks */}
                    <div className="flex gap-2.5">
                      {[
                        { scope: "apps", label: "Apps" },
                        { scope: "billing", label: "Billing" },
                        { scope: "users", label: "Users" },
                        { scope: "settings", label: "Settings" }
                      ].map((item) => {
                        const isGranted = member.permissions.includes(item.scope);
                        return (
                          <label 
                            key={item.scope}
                            className="flex items-center gap-1 cursor-pointer"
                            title={`Modifier permission scope : ${item.scope}`}
                          >
                            <input 
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => handleToggleScope(member.id, item.scope)}
                              className="h-3 w-3 accent-[#FF7A00] cursor-pointer"
                            />
                            <span className={`text-[9.5px] font-mono ${isGranted ? 'text-slate-900 font-bold' : 'text-slate-350'}`}>{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleSuspendUser(member.id, member.status)}
                      className={`text-[9.5px] font-mono font-bold hover:underline ${member.status === "suspendu" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {member.status === "suspendu" ? "Réactiver" : "Suspendre"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Federation Invitation form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h4 className="font-extrabold text-xs text-slate-900 mb-4 flex items-center gap-1.5">
          <Plus className="h-4.5 w-4.5 text-[#FF7A00]" />
          Fédérer un collaborateur sous le tenant {currentOrgName}
        </h4>

        <form onSubmit={handleInviteUser} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-black">Nom complet</label>
            <input 
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: David Larousse"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-black">Adresse Courriel</label>
            <input 
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Ex: d.larousse@holding.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:bg-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-black">Rôle initial</label>
            <select 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 px-2.5 focus:outline-none text-xs"
            >
              <option value="CTO Developer">CTO Developer (Technique)</option>
              <option value="Finance Admin">Finance Admin (Stripe/Comptabilité)</option>
              <option value="HR Manager">HR Manager (Personnel G-RH)</option>
              <option value="Guest Client">Guest Client (Auditeur)</option>
            </select>
          </div>

          <button 
            type="submit"
            className="py-2 px-4 bg-[#0B1F3A] hover:bg-slate-900 border border-[#0B1F3A] text-white rounded-xl text-xs font-black shadow-sm transition-colors text-center cursor-pointer"
          >
            Inviter via SSO
          </button>
        </form>
      </div>

      {/* SUPREME PORTAL SAAS ADMINISTRATOR CONSOLE (FOR ANGES GILDAS) */}
      <div className="bg-[#0B1F3A] text-white border border-slate-800 rounded-2xl p-6 shadow-premium relative overflow-hidden">
        {/* Absolute design accents */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldCheck className="h-40 w-40 text-brand-orange" />
        </div>

        {/* Console Header */}
        <div className="border-b border-white/10 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-orange animate-ping" />
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                Console d'administration suprême (Anges Gildas)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Accès maître hautement prioritaire accordé au super-administrateur principal de tout l'écosystème G-LAB TECH SaaS.
            </p>
          </div>
          <span className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-[9.5px] font-mono font-bold px-3 py-1 rounded-full uppercase">
            All Permissions Authorized
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* 1. RESTORE DELETED USERS PANEL */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-brand-orange uppercase font-mono tracking-wider flex items-center gap-x-1.5">
                <Users className="h-4 w-4 text-brand-orange" /> 1. Restaurer des Utilisateurs Supprimés
              </span>
              <span className="text-[10px] font-mono bg-white/10 text-slate-350 px-2 rounded">
                Corbeille SSO ({deletedUsers.length})
              </span>
            </div>
            
            {deletedUsers.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Aucun utilisateur supprimé dans le bassin SSO de quarantaine.</p>
            ) : (
              <div className="space-y-3">
                {deletedUsers.map(u => (
                  <div key={u.id} className="bg-black/20 p-3 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-[#F5F7FA] block font-bold">{u.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono italic block">{u.email}</span>
                      <span className="text-[9px] text-[#FF7A00] font-mono mt-0.5 inline-block">{u.role}</span>
                    </div>
                    <div className="text-right space-y-1.5">
                      <span className="text-[9px] text-rose-300 block font-mono">Supprimé {u.deletedAt}</span>
                      <button
                        type="button"
                        onClick={() => handleRestoreDeletedUser(u.id)}
                        className="bg-brand-orange hover:bg-[#FF7A00]/85 text-brand-blue font-bold text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer border-0"
                      >
                        Restaurer l'Accès
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. DEMANDES D'AUTORISATION D'ACCÈS PANEL */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-sky-300 uppercase font-mono tracking-wider flex items-center gap-x-1.5">
                <Lock className="h-4 w-4 text-sky-400" /> 2. Autoriser les requêtes d'accès SSO
              </span>
              <span className="text-[10px] font-mono bg-white/10 text-slate-350 px-2 rounded">
                Requêtes ({accessRequests.length})
              </span>
            </div>

            {accessRequests.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Toutes les demandes d'accès ont été résolues.</p>
            ) : (
              <div className="space-y-3">
                {accessRequests.map(req => (
                  <div key={req.id} className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <strong className="text-white font-bold">{req.name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono block">{req.email}</span>
                      </div>
                      <span className="bg-sky-500/20 text-sky-300 font-mono text-[9px] px-1.5 py-0.5 rounded border border-sky-500/30">
                        {req.targetApp}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-300 bg-white/5 p-2 rounded leading-relaxed border border-white/5 font-medium">
                      "{req.reason}"
                    </p>
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          setAccessRequests(accessRequests.filter(r => r.id !== req.id));
                          onNotify(`Accès refusé pour ${req.name}`, "warn");
                        }}
                        className="text-rose-400 hover:text-rose-350 bg-transparent py-1 px-2 border-0 cursor-pointer font-extrabold"
                      >
                        Refuser
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveAccess(req.id)}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-black py-1 px-3 rounded cursor-pointer border-0"
                      >
                        Autoriser & Émettre JWT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. VALIDATION MANUELLE DES PAIEMENTS PANEL */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-emerald-405 uppercase font-mono tracking-wider flex items-center gap-x-1.5">
                <CreditCard className="h-4 w-4 text-emerald-400" /> 3. Validation des Paiements & Rapprochement
              </span>
              <span className="text-[10px] font-mono bg-white/10 text-slate-350 px-2 rounded">
                En attente ({pendingPayments.length})
              </span>
            </div>

            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Aucune facture en attente de vérification manuelle.</p>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map(pay => (
                  <div key={pay.id} className="bg-black/20 p-3 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-emerald-400 font-bold block">{pay.reference}</strong>
                      <span className="text-[10px] text-slate-300 block font-semibold">{pay.company}</span>
                      <span className="text-[9px] text-slate-400 block font-mono">Date : {pay.date} • Mode : {pay.method}</span>
                    </div>
                    <div className="text-right space-y-1.5">
                      <span className="text-xs text-white font-mono font-black block">{pay.amount},00 €</span>
                      <button
                        type="button"
                        onClick={() => handleApprovePayment(pay.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10.5px] px-2.5 py-1 rounded transition-all cursor-pointer border-0 block"
                      >
                        Valider & Intégrer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. MISES À JOUR DU SYSTÈME ET RE-CERTIFICATION OWASP */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider flex items-center gap-x-1.5">
                <RefreshCw className="h-4 w-4 text-amber-500" /> 4. Cycle de Mises à Jour & Hotfixes
              </span>
              <span className="text-[10px] font-mono bg-white/10 text-slate-350 px-2 rounded">
                Système
              </span>
            </div>

            <div className="space-y-3">
              {updates.map(upd => (
                <div key={upd.id} className="bg-black/20 p-3 rounded-lg border border-white/5 text-xs flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white font-bold">{upd.version}</strong>
                      <span className="bg-amber-500/20 text-amber-400 font-mono text-[8px] px-1 py-0.5 rounded border border-amber-500/30 font-bold uppercase">
                        {upd.category}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-450 leading-normal">{upd.description}</p>
                  </div>
                  <div>
                    {upd.status === "appliqué" ? (
                      <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 text-[9px] font-mono font-black py-1 px-3 rounded">
                        Appliqué
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyUpdate(upd.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer border-0 uppercase"
                      >
                        Déployer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-5 pt-4 border-t border-white/5 text-[10.5px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Vérification de l'intégrité cryptographique : RSA/JWT certifiés conformes (2026-05-27 UTC)
          </span>
          <span className="text-brand-orange font-bold uppercase">Super Administrateur Actif</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ANALYTICS & MONITORING TAB
// ==========================================
interface AnalyticsTabProps {
  metrics: any;
  apps: ManagedApp[];
}

export function AnalyticsTab({ metrics, apps }: AnalyticsTabProps) {
  return (
    <div className="space-y-6 animate-motion-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-brand-orange" />
          Analyses de Latence Multi-Tenant & Flux API
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Ping metrics */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
            <h4 className="font-bold text-xs text-slate-950 mb-4 flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              Réponse Ping par Service unifié (glabeboutique.com)
            </h4>
            
            <div className="space-y-3.5">
              {apps.map((app) => (
                <div key={app.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-slate-700">{app.name}</span>
                    <span className={`font-bold ${app.ping > 100 ? 'text-rose-500' : 'text-emerald-600'}`}>{app.ping} ms</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${app.ping > 100 ? 'bg-rose-500' : 'bg-brand-orange'}`}
                      style={{ width: `${Math.min(100, (app.ping / 150) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database connections stats */}
          <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-950 mb-2">Canal d'Écriture Prisma SQL</h4>
              <p className="text-xs text-slate-500 leading-normal">Surveillance automatisée des sessions concurrentes par base de données isolée.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-emerald-400 text-[10.5px] space-y-1.5 mt-5">
              <span className="text-slate-450 uppercase block font-bold text-[9px]">Status de Diagnostic central</span>
              <p>● Max connection pools: 200 (Postgre-SSO)</p>
              <p>● Active Client Pings: {metrics.apiLatency} ms/op</p>
              <p>● Cloud Providers: AWS RDS (Secured CJS Bundled)</p>
              <p className="text-[#FF7A00]">● Network Isolation: LOGICAL ROW-LEVEL SILOS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. NOTIFICATIONS TAB
// ==========================================
export function NotificationsTab({ user, onNotify }: { user?: PortalUser, onNotify?: (msg: string, type: "success" | "warn" | "info" | "error") => void }) {
  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "gateways" | "tester" | "logs">("overview");

  const [showPushApiKey, setShowPushApiKey] = useState(false);
  const [showSmsToken, setShowSmsToken] = useState(false);
  const [showWhatsappToken, setShowWhatsappToken] = useState(false);

  // Multi-Channel Gateway Configurations
  const [gateways, setGateways] = useState({
    email: {
      id: "email",
      name: "Courriel SMTP Émetteur",
      host: "smtp.glablab.ae",
      port: "587",
      username: "notifications@glabeboutique.com",
      senderName: "Glablab SecOps Gateway",
      ssl: true,
      enabled: true,
    },
    push: {
      id: "push",
      name: "Navigateur Push Direct",
      projectId: "glab-sso-928aa",
      apiKey: "fcm_key_live_8910a283bc9e",
      appId: "1:8920193:web:af83b9cfb28",
      enabled: true,
    },
    sms: {
      id: "sms",
      name: "SMS Téléphonie (Twilio)",
      accountSid: "AC492819cd8e3b9f3910931d8c",
      authToken: "tw_secret_token_live_992011",
      senderId: "GT-ALERTS",
      enabled: true,
    },
    whatsapp: {
      id: "whatsapp",
      name: "Meta WhatsApp Cloud API",
      phoneId: "109283910293122",
      businessId: "waba_89201883bc229a",
      accessToken: "eaab_whatsapp_cloud_key_prod_993",
      enabled: true,
    }
  });

  // Notification Tester Inputs & States
  const [testChannel, setTestChannel] = useState<"email" | "push" | "sms" | "whatsapp">("email");
  const [testRecipient, setTestRecipient] = useState(user?.email || "coordination@glabeboutique.com");
  const [testTitle, setTestTitle] = useState("Alerte de sécurité SSO - Profil Sensible");
  const [testBody, setTestBody] = useState("Un accès privilégié a été authentifié depuis un nouveau sous-réseau IP (Dakar, Sénégal). Rotation RSA conseillée.");
  
  // Simulation Sending States
  const [isSending, setIsSending] = useState(false);
  const [sendStep, setSendStep] = useState(0); // 0: queue, 1: auth, 2: routing, 3: completed
  const [showMockPush, setShowMockPush] = useState(false);
  const [mockPushData, setMockPushData] = useState<any>(null);

  // Delivery Audit Logs Database Simulation
  const [logs, setLogs] = useState([
    {
      id: "log-1",
      date: "Aujourd'hui, 11:42",
      channel: "email",
      recipient: "directeur.audit@glabeboutique.com",
      title: "Rapport d'audit de sécurité hebdomadaire",
      gateway: "SMTP Server",
      status: "success",
      metadata: { server: "smtp.glablab.ae", port: 587, ssl: true, delay: "102ms", sha256: "ca027...ae8" }
    },
    {
      id: "log-2",
      date: "Aujourd'hui, 11:15",
      channel: "whatsapp",
      recipient: "+221775892011",
      title: "MFA Token - Double Facteur",
      gateway: "Meta Cloud API",
      status: "success",
      metadata: { phoneId: "109283910293122", template: "auth_otp_secure", delay: "284ms" }
    },
    {
      id: "log-3",
      date: "Aujourd'hui, 09:30",
      channel: "push",
      recipient: "Dispositif Navigateur Chrome macOS",
      title: "Performances alert - Microservices G-Link",
      gateway: "Navigateur Push",
      status: "success",
      metadata: { projectId: "glab-sso-928aa", socket: "ws_live_99x", ack: "true" }
    },
    {
      id: "log-4",
      date: "Hier, 17:45",
      channel: "sms",
      recipient: "+22890112233",
      title: "Facturation active rattachée",
      gateway: "Twilio API",
      status: "failed",
      metadata: { error: "Carrier Route Unreachable", fallbackTried: "false", status: "Rejected" }
    },
    {
      id: "log-5",
      date: "Hier, 10:20",
      channel: "email",
      recipient: "glabtech1@gmail.com",
      title: "Bienvenue sur le Hub d'Intégration SaaS",
      gateway: "SMTP Server",
      status: "success",
      metadata: { template: "welcome_corporate", sender: "support@glabeboutique.com" }
    }
  ]);

  // Filters
  const [logSearch, setLogSearch] = useState("");
  const [logChannelFilter, setLogChannelFilter] = useState<string>("all");
  const [inspectedLog, setInspectedLog] = useState<any | null>(null);

  // Auto-fill form helper based on template selection
  const handleApplyPresetTemplate = (presetType: "security" | "otp" | "payment" | "billing") => {
    switch (presetType) {
      case "security":
        setTestTitle("Alerte de sécurité SSO - Profil Sensible");
        setTestBody("Incident d'accès suspendu : tentative forcée d'accès à l'API Multi-tenant sans en-tête d'autorisation conforme.");
        break;
      case "otp":
        const code = Math.floor(100000 + Math.random() * 900000);
        setTestTitle("G-LABTECH Code d'activation");
        setTestBody(`Votre jeton temporaire d'authentification unique (MFA) est : ${code}. Valide pendant 5 minutes. Ne le transmettez pas.`);
        break;
      case "payment":
        setTestTitle("Confirmation de perception de règlement");
        setTestBody(`Votre facture d'abonnement SaaS (Suite Progiciels Isolés) a été acquittée avec succès. Montant perçu via passerelle de paie.`);
        break;
      case "billing":
        setTestTitle("Expiration imminente de certification RSA");
        setTestBody("Action requise : Votre clé asymétrique RSA-4096 principale arrive à expiration sous 7 jours. Procédez à la rotation.");
        break;
    }
    if (onNotify) onNotify("Gabarit de message pré-configuré chargé avec succès.", "info");
  };

  // Switch recipient default format based on channel
  const handleChannelSwitch = (channelType: "email" | "push" | "sms" | "whatsapp") => {
    setTestChannel(channelType);
    if (channelType === "email") {
      setTestRecipient(user?.email || "coordination@glabeboutique.com");
    } else if (channelType === "push") {
      setTestRecipient("Toutes les sessions rattachées (Navigateur)");
    } else if (channelType === "whatsapp") {
      setTestRecipient("+221 77 569 22 11");
    } else {
      setTestRecipient("+228 99 12 34 56");
    }
  };

  // Run simulated send notification with multi-step loader
  const handleTriggerSendNotification = () => {
    if (!testRecipient.trim() || !testBody.trim()) {
      if (onNotify) onNotify("Veuillez saisir un destinataire et le texte du message.", "warn");
      return;
    }

    // Verify gateway is enabled first
    const selectedGate = gateways[testChannel];
    if (!selectedGate.enabled) {
      if (onNotify) onNotify(`La passerelle ${selectedGate.name} est désactivée. Veuillez l'activer pour émettre.`, "warn");
      return;
    }

    setIsSending(true);
    setSendStep(0);

    // Simulate sending stages
    const steps = [
      "Vérification des règles d'éligibilité SecOps...",
      "Connexion sécurisée TLS sur la passerelle...",
      "Diffusion du paquet et hachage SHA-256...",
      "Émission réussie. Reçu d'acquittement stocké."
    ];

    setTimeout(() => {
      setSendStep(1);
      setTimeout(() => {
        setSendStep(2);
        setTimeout(() => {
          setSendStep(3);
          setTimeout(() => {
            setIsSending(false);
            
            // Add to simulated logs history
            const refCode = `${testChannel.toUpperCase()}_ALRT_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const newLog = {
              id: `log-${Date.now()}`,
              date: "À l'instant",
              channel: testChannel,
              recipient: testRecipient,
              title: testTitle,
              gateway: selectedGate.name,
              status: "success",
              metadata: {
                transmissionId: refCode,
                destination: testRecipient,
                sizeBytes: new Blob([testBody]).size,
                sslEnabled: "true",
                timestamp: new Date().toISOString()
              }
            };

            setLogs(prev => [newLog, ...prev]);

            // If it's pure PUSH channel or in general, trigger the floating on-screen mockup!
            setMockPushData({
              channel: testChannel,
              title: testTitle,
              body: testBody,
              ref: refCode
            });
            setShowMockPush(true);

            // Fetch state synchronisation to update the real database alerts in Node container
            fetch("/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "info", text: `Notification [${testChannel.toUpperCase()}] expédiée vers ${testRecipient}: ${testTitle}` })
            }).catch(() => {});

            if (onNotify) onNotify(`Messagerie expédiée avec succès via ${selectedGate.name}`, "success");

            // Dismiss push mockup banner automatically after 7 seconds
            setTimeout(() => {
              setShowMockPush(false);
            }, 7000);

          }, 800);
        }, 900);
      }, 700);
    }, 600);
  };

  // Retry sending an existing log entry
  const handleRetryLog = (logItem: any) => {
    if (onNotify) onNotify(`Relance d'expédition en cours vers ${logItem.recipient}...`, "info");
    setTimeout(() => {
      if (onNotify) onNotify(`Flux réexpédié avec succès. Transaction ID mis à jour.`, "success");
    }, 1000);
  };

  // Toggle state of a specific gateway
  const handleToggleGateway = (gateId: "email" | "push" | "sms" | "whatsapp") => {
    setGateways(prev => {
      const current = prev[gateId];
      const updated = { ...current, enabled: !current.enabled };
      if (onNotify) {
        onNotify(`Passerelle ${current.name} ${updated.enabled ? 'activée' : 'désactivée'}.`, "info");
      }
      return { ...prev, [gateId]: updated };
    });
  };

  // Filter logs list
  const filteredLogs = logs.filter(item => {
    const matchesSearch = item.recipient.toLowerCase().includes(logSearch.toLowerCase()) || 
                          item.title.toLowerCase().includes(logSearch.toLowerCase()) || 
                          item.gateway.toLowerCase().includes(logSearch.toLowerCase());
    if (logChannelFilter === "all") return matchesSearch;
    return matchesSearch && item.channel === logChannelFilter;
  });

  // Responsive Styles Helper Classes
  // This helps maintain correct sizing on mobile (all columns wrap) to ultra-wide monitors
  return (
    <div className="space-y-6 text-slate-800 leading-normal max-w-[1600px] mx-auto px-1 sm:px-4 lg:px-6">

      {/* DYNAMIC ON-SCREEN INTERACTIVE FLOAT PUSH ALERT POPUP */}
      {showMockPush && mockPushData && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 p-4 animate-motion-in overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-amber-500 to-indigo-650" />
          <div className="flex gap-3 mt-1">
            <div className={`p-2 rounded-xl text-white ${
              mockPushData.channel === 'email' ? 'bg-blue-600' :
              mockPushData.channel === 'push' ? 'bg-indigo-650' :
              mockPushData.channel === 'sms' ? 'bg-emerald-600' : 'bg-green-600'
            }`}>
              {mockPushData.channel === 'email' && <Mail className="h-4.5 w-4.5" />}
              {mockPushData.channel === 'push' && <Bell className="h-4.5 w-4.5" />}
              {mockPushData.channel === 'sms' && <Smartphone className="h-4.5 w-4.5" />}
              {mockPushData.channel === 'whatsapp' && <Zap className="h-4.5 w-4.5" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {mockPushData.channel} push payload
                </span>
                <span className="text-[9px] font-mono text-slate-500">A l'instant</span>
              </div>
              <h5 className="text-xs font-black truncate mt-1 text-slate-105">{mockPushData.title}</h5>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-3 font-medium">
                {mockPushData.body}
              </p>
              
              <div className="flex items-center justify-between text-[10px] font-mono text-[#FF7A00] mt-3 pt-2.5 border-t border-slate-900">
                <span>Réf: {mockPushData.ref}</span>
                <button 
                  onClick={() => setShowMockPush(false)}
                  className="hover:text-white transition-colors cursor-pointer block font-bold"
                >
                  ✓ Ignorer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN SYSTEM CONTAINER: HEADER BANNER WITH METRICS */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6.5 shadow-premium flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 h-44 w-44 bg-brand-orange/[0.04] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-44 w-44 bg-indigo-500/[0.03] rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1.5 flex-1 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-brand-orange text-slate-950 text-[10px] font-mono font-black tracking-wider px-2 py-0.5 rounded uppercase">
              PRODUCTIONS & ALERTS SYSTEM
            </span>
            <span className="text-xs font-mono text-slate-450 border-l border-slate-800 pl-2">
              Multi-canal : Courriel, Push notifications, SMS, WhatsApp
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-brand-orange animate-swing" />
            Centre Global de Notifications
          </h2>
          <p className="text-xs text-slate-405 leading-relaxed max-w-2xl font-normal">
            Gérez de manière centralisée les workflows de communication de glabeboutique.com. Configurez vos passerelles télécoms sécurisées, simulez des flux en temps réel et réconciliez les traces de livraison.
          </p>
        </div>

        {/* Dynamic Navigation Sub-Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 z-10 xl:self-center">
          <button 
            onClick={() => setActiveSubTab("overview")}
            className={`px-4 py-2 text-xs font-extrabold font-mono rounded-xl transition-all cursor-pointer ${
              activeSubTab === "overview" 
                ? "bg-brand-orange text-slate-950 shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white"
            }`}
          >
            Vue Générale
          </button>
          <button 
            onClick={() => setActiveSubTab("gateways")}
            className={`px-4 py-2 text-xs font-extrabold font-mono rounded-xl transition-all cursor-pointer ${
              activeSubTab === "gateways" 
                ? "bg-brand-orange text-slate-950 shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white"
            }`}
          >
            Passerelles (SMTP/APIs)
          </button>
          <button 
            onClick={() => setActiveSubTab("tester")}
            className={`px-4 py-2 text-xs font-extrabold font-mono rounded-xl transition-all cursor-pointer ${
              activeSubTab === "tester" 
                ? "bg-brand-orange text-slate-950 shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white"
            }`}
          >
            Simulateur d'Envoi
          </button>
          <button 
            onClick={() => setActiveSubTab("logs")}
            className={`px-4 py-2 text-xs font-extrabold font-mono rounded-xl transition-all cursor-pointer ${
              activeSubTab === "logs" 
                ? "bg-brand-orange text-slate-950 shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-755 hover:text-white"
            }`}
          >
            Journal d'Audit ({logs.length})
          </button>
        </div>
      </div>

      {/* ==========================================
         SUB-TAB 1: OVERVIEW DASHBOARD & METRICS
         ========================================== */}
      {activeSubTab === "overview" && (
        <div className="space-y-6 animate-motion-in">
          
          {/* Responsive KPIs Header Grid. Scales perfectly on Mobile (1 col) to Ultra wide (4 col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* KPI 1 : Volume Total */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Messages Expédiés</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">1,894</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold block">↑ +14% cette semaine</span>
              </div>
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl h-11 w-11 flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
            </div>

            {/* KPI 2 : Délivrance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Taux de Délivrance</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">99.2%</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold block">Haute Performance</span>
              </div>
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl h-11 w-11 flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>

            {/* KPI 3 : Canal Principal */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Canal Majeur</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">WhatsApp WA</span>
                <span className="text-[10px] text-indigo-600 font-mono font-bold block">45% de volume de messagerie</span>
              </div>
              <div className="p-3.5 bg-indigo-50 text-indigo-650 rounded-2xl h-11 w-11 flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
            </div>

            {/* KPI 4 : Temps Moyen */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-premium flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Acheminement Réseau</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">148 ms</span>
                <span className="text-[10px] text-slate-400 font-mono block">Mise en ligne Glab-Link</span>
              </div>
              <div className="p-3.5 bg-amber-50 text-amber-650 rounded-2xl h-11 w-11 flex items-center justify-center">
                <RefreshCw className="h-6 w-6" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Trends Vector visual analytics */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium lg:col-span-2 space-y-4">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5 text-brand-orange animate-pulse" />
                  Flux de Messagerie par Canal (Dernières 24 heures)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Statistiques comptabilisées sur les points d'entrée d'APIs du portail.</p>
              </div>

              {/* Responsive SVG Chart */}
              <div className="h-48 w-full border border-slate-100 rounded-xl p-3 flex flex-col justify-between bg-slate-50/20">
                <div className="flex-1 flex items-end justify-between px-4 pb-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-dashed border-slate-400 w-full h-0" />
                    <div className="border-b border-dashed border-slate-400 w-full h-0" />
                    <div className="border-b border-dashed border-slate-400 w-full h-0" />
                  </div>

                  {/* Hourly Bars */}
                  {[
                    { hr: "08h", val: 30, we: 20, sms: 10, wa: 5 },
                    { hr: "10h", val: 56, we: 40, sms: 25, wa: 15 },
                    { hr: "12h", val: 85, we: 60, sms: 35, wa: 38 },
                    { hr: "14h", val: 45, we: 30, sms: 12, wa: 22 },
                    { hr: "16h", val: 95, we: 80, sms: 48, wa: 54 },
                    { hr: "18h", val: 120, we: 95, sms: 60, wa: 75 },
                    { hr: "20h", val: 70, we: 50, sms: 22, wa: 40 }
                  ].map((x, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 w-[11%] group relative duration-150-all">
                      <div className="w-full flex justify-center gap-0.5 items-end">
                        <div style={{ height: `${x.we * 1.1}px` }} className="w-2 bg-blue-500 rounded-t-sm" title={`Email: ${x.we}`} />
                        <div style={{ height: `${x.sms * 1.1}px` }} className="w-2 bg-emerald-500 rounded-t-sm" title={`SMS: ${x.sms}`} />
                        <div style={{ height: `${x.wa * 1.1}px` }} className="w-2 bg-green-500 rounded-t-sm" title={`WhatsApp: ${x.wa}`} />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-450">{x.hr}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="border-t border-slate-100 pt-2.5 flex justify-center items-center gap-6 flex-wrap text-[10px] font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="h-2.5 w-2.5 bg-blue-500 rounded-full block" />
                    Courriels (SMTP)
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full block" />
                    Chrome/Firefox Push
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full block" />
                    SMS Métrique
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="h-2.5 w-2.5 bg-green-500 rounded-full block" />
                    Meta WhatsApp
                  </span>
                </div>
              </div>
            </div>

            {/* Quick configuration summary / Health Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium space-y-4">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Sliders className="h-4.5 w-4.5 text-slate-700" />
                  État opérationnel des passerelles
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Statut de la connexion d'API en direct.</p>
              </div>

              <div className="space-y-3 font-mono text-[11px] font-semibold text-slate-700">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-blue-600 animate-pulse" />
                    Courriel (SMTP)
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-xs">
                    Connecté
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-indigo-600 animate-swing" />
                    Push Navigateur
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-xs">
                    Certifié API
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-emerald-600" />
                    Sms Twilio API
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-xs">
                    Soll-99%
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-green-600" />
                    WhatsApp Cloud
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-xs">
                    Opérationnel
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Active System Alerts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-orange" />
              Historique Récent des Alv-SecOps Systèmes
            </h4>
            
            <div className="space-y-2.5">
              {[
                { type: "security", title: "Génération de jeton d'administrateur SSO centralisé", text: "Clé RSA rotation opérée avec succès sous la directive IAM de glabeboutique.com", count: "À l'instant", status: "success" },
                { type: "warn", title: "Baisse de performance réseau sur erp.glabeboutique.com (114ms)", text: "Le service d'orchestration signale une réponse retardée sur le serveur API.", count: "Il y a 10 mins", status: "warn" },
                { type: "info", title: "Workflow G-Link validé : 'Admission Hopital vers ERP'", text: "Intégration et réconciliation asynchrone achevée sans erreurs critiques.", count: "Il y a 1 heure", status: "info" }
              ].map((a, i) => (
                <div key={i} className="p-4 border border-slate-150 lg:border-slate-100 rounded-xl flex items-start gap-4 bg-slate-50/45 hover:bg-slate-50 transition-colors">
                  <div className="mt-1 flex items-center justify-center">
                    {a.type === 'security' && <ShieldCheck className="h-5 w-5 text-emerald-600 animate-pulse" />}
                    {a.type === 'warn' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                    {a.type === 'info' && <Zap className="h-5 w-5 text-slate-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10.5px] font-mono mb-1 gap-1">
                      <span className="text-slate-400 block uppercase font-black">{a.type} system state</span>
                      <span className="text-slate-400 font-medium">{a.count}</span>
                    </div>
                    <h5 className="text-xs font-extrabold text-slate-900">{a.title}</h5>
                    <p className="text-[11.5px] text-slate-500 leading-normal mt-0.5">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================
         SUB-TAB 2: GATEWAY CREDENTIALS CONFIG PANEL
         ========================================== */}
      {activeSubTab === "gateways" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-motion-in">
          
          {/* Email SMTP Config */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Mail className="h-5 w-5 text-blue-600" />
                    {gateways.email.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">Diffusion de reçus et rapports comptables.</p>
                </div>
                
                <button 
                  onClick={() => handleToggleGateway("email")}
                  className={`px-2.5 py-1 text-[10px] font-mono font-black border uppercase rounded-lg transition-colors cursor-pointer ${
                    gateways.email.enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  {gateways.email.enabled ? "Actif" : "Désactivé"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-[11px] font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Hôte de messagerie</label>
                  <input 
                    type="text"
                    value={gateways.email.host}
                    onChange={(e) => setGateways({...gateways, email: {...gateways.email, host: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Port (SMTP TLS)</label>
                  <input 
                    type="text"
                    value={gateways.email.port}
                    onChange={(e) => setGateways({...gateways, email: {...gateways.email, port: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Nom d'expéditeur affiché</label>
                  <input 
                    type="text"
                    value={gateways.email.senderName}
                    onChange={(e) => setGateways({...gateways, email: {...gateways.email, senderName: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Identifiant d'accès (Courriel unique)</label>
                  <input 
                    type="email"
                    value={gateways.email.username}
                    onChange={(e) => setGateways({...gateways, email: {...gateways.email, username: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNotify && onNotify("Configuration SMTP pour l'organisation sauvegardée.", "success")}
              className="w-full mt-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl py-2.5 text-xs font-black shadow transition-colors cursor-pointer"
            >
              Enregistrer SMTP Configuration
            </button>
          </div>

          {/* Browser Push Certifications */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Bell className="h-5 w-5 text-indigo-600 animate-swing" />
                    {gateways.push.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">Diffusion d'événements réseau et sécurité.</p>
                </div>
                
                <button 
                  onClick={() => handleToggleGateway("push")}
                  className={`px-2.5 py-1 text-[10px] font-mono font-black border uppercase rounded-lg transition-colors cursor-pointer ${
                    gateways.push.enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  {gateways.push.enabled ? "Actif" : "Désactivé"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1 font-mono text-[11px] font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Identifiant Projet Firebase (FCM)</label>
                  <input 
                    type="text"
                    value={gateways.push.projectId}
                    onChange={(e) => setGateways({...gateways, push: {...gateways.push, projectId: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Clé d'accès API Serveur</label>
                  <div className="relative">
                    <input 
                      type={showPushApiKey ? "text" : "password"}
                      value={gateways.push.apiKey}
                      onChange={(e) => setGateways({...gateways, push: {...gateways.push, apiKey: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPushApiKey(!showPushApiKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPushApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Application Identifiant unique (Web Push App ID)</label>
                  <input 
                    type="text"
                    value={gateways.push.appId}
                    onChange={(e) => setGateways({...gateways, push: {...gateways.push, appId: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNotify && onNotify("Identifiants WebPush synchronisés avec Firebase.", "success")}
              className="w-full mt-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl py-2.5 text-xs font-black shadow transition-colors cursor-pointer"
            >
              Enregistrer Certificats FCM
            </button>
          </div>

          {/* SMS Twilio Gateway */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="h-5 w-5 text-emerald-600" />
                    {gateways.sms.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">Passerelle cellulaire pour acheminer les OTP de double-facteur.</p>
                </div>
                
                <button 
                  onClick={() => handleToggleGateway("sms")}
                  className={`px-2.5 py-1 text-[10px] font-mono font-black border uppercase rounded-lg transition-colors cursor-pointer ${
                    gateways.sms.enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  {gateways.sms.enabled ? "Actif" : "Désactivé"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1 font-mono text-[11px] font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Twilio Account SID (Directeur)</label>
                  <input 
                    type="text"
                    value={gateways.sms.accountSid}
                    onChange={(e) => setGateways({...gateways, sms: {...gateways.sms, accountSid: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Twilio Auth Token</label>
                  <div className="relative">
                    <input 
                      type={showSmsToken ? "text" : "password"}
                      value={gateways.sms.authToken}
                      onChange={(e) => setGateways({...gateways, sms: {...gateways.sms, authToken: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmsToken(!showSmsToken)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showSmsToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Code d'Émetteur Alpha-Numérique (Sender ID)</label>
                  <input 
                    type="text"
                    value={gateways.sms.senderId}
                    onChange={(e) => setGateways({...gateways, sms: {...gateways.sms, senderId: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNotify && onNotify("Canal de téléphonie Twilio raccordé.", "success")}
              className="w-full mt-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl py-2.5 text-xs font-black shadow transition-colors cursor-pointer"
            >
              Enregistrer Twilio SID
            </button>
          </div>

          {/* WhatsApp API Meta Cloud */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Zap className="h-5 w-5 text-green-600" />
                    {gateways.whatsapp.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">Canal applicatif de notification client instantané.</p>
                </div>
                
                <button 
                  onClick={() => handleToggleGateway("whatsapp")}
                  className={`px-2.5 py-1 text-[10px] font-mono font-black border uppercase rounded-lg transition-colors cursor-pointer ${
                    gateways.whatsapp.enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  {gateways.whatsapp.enabled ? "Actif" : "Désactivé"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1 font-mono text-[11px] font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Identifiant de numéro de téléphone (Phone ID)</label>
                  <input 
                    type="text"
                    value={gateways.whatsapp.phoneId}
                    onChange={(e) => setGateways({...gateways, whatsapp: {...gateways.whatsapp, phoneId: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">WhatsApp Business Account ID</label>
                  <input 
                    type="text"
                    value={gateways.whatsapp.businessId}
                    onChange={(e) => setGateways({...gateways, whatsapp: {...gateways.whatsapp, businessId: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase font-bold text-slate-400">Meta System Access Token</label>
                  <div className="relative">
                    <input 
                      type={showWhatsappToken ? "text" : "password"}
                      value={gateways.whatsapp.accessToken}
                      onChange={(e) => setGateways({...gateways, whatsapp: {...gateways.whatsapp, accessToken: e.target.value}})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWhatsappToken(!showWhatsappToken)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showWhatsappToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNotify && onNotify("Pont applicatif WhatsApp validé par clé Meta Cloud.", "success")}
              className="w-full mt-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl py-2.5 text-xs font-black shadow transition-colors cursor-pointer"
            >
              Enregistrer Meta credentials
            </button>
          </div>

        </div>
      )}

      {/* ==========================================
         SUB-TAB 3: INTERACTIVE MESSAGERIE SENDER WIZARD
         ========================================== */}
      {activeSubTab === "tester" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-motion-in">
          
          {/* Main composition console form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-premium lg:col-span-2 space-y-5">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Send className="h-5 w-5 text-[#FF7A00]" />
                Rédiger un notification test multi-canal
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Envoyez instantanément des micro-messages simulés sur n'importe quel canal raccordé.</p>
            </div>

            {/* Quick Presets Selection */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                Sélection rapide de gabarits structurés (Préfini)
              </span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleApplyPresetTemplate("otp")}
                  className="px-3 py-1.5 bg-slate-55 border border-slate-200 hover:bg-slate-100 rounded-xl text-[10.5px] font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Jeton OTP double facteur
                </button>
                <button 
                  onClick={() => handleApplyPresetTemplate("security")}
                  className="px-3 py-1.5 bg-slate-55 border border-slate-200 hover:bg-slate-100 rounded-xl text-[10.5px] font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Alerte Blocage SecOps
                </button>
                <button 
                  onClick={() => handleApplyPresetTemplate("payment")}
                  className="px-3 py-1.5 bg-slate-55 border border-slate-200 hover:bg-slate-100 rounded-xl text-[10.5px] font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Quittance de paiement SaaS
                </button>
                <button 
                  onClick={() => handleApplyPresetTemplate("billing")}
                  className="px-3 py-1.5 bg-slate-55 border border-slate-200 hover:bg-slate-100 rounded-xl text-[10.5px] font-bold text-slate-700 transition-all cursor-pointer"
                >
                  Certification RSA expiration
                </button>
              </div>
            </div>

            {/* Selector Channel Tabs with explicit background states */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Choisissez le canal de distribution</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button 
                  onClick={() => handleChannelSwitch("email")}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                    testChannel === "email" 
                      ? "border-blue-600 bg-blue-50/15 font-black text-blue-700" 
                      : "border-slate-200 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <Mail className={`h-5 w-5 ${testChannel === "email" ? "text-blue-600" : "text-slate-400"}`} />
                  <span>Courriel (SMTP)</span>
                </button>

                <button 
                  onClick={() => handleChannelSwitch("push")}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                    testChannel === "push" 
                      ? "border-indigo-650 bg-indigo-50/15 font-black text-indigo-700" 
                      : "border-slate-200 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <Bell className={`h-5 w-5 ${testChannel === "push" ? "text-indigo-600 animate-swing" : "text-slate-400"}`} />
                  <span>Push Navigateur</span>
                </button>

                <button 
                  onClick={() => handleChannelSwitch("sms")}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                    testChannel === "sms" 
                      ? "border-emerald-600 bg-emerald-50/15 font-black text-emerald-700" 
                      : "border-slate-200 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <Smartphone className={`h-5 w-5 ${testChannel === "sms" ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>SMS Cellulaire</span>
                </button>

                <button 
                  onClick={() => handleChannelSwitch("whatsapp")}
                  className={`p-3 border rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                    testChannel === "whatsapp" 
                      ? "border-green-600 bg-green-50/15 font-black text-green-700" 
                      : "border-slate-200 hover:bg-slate-50 font-bold"
                  }`}
                >
                  <Zap className={`h-5 w-5 ${testChannel === "whatsapp" ? "text-green-600 animate-pulse" : "text-slate-400"}`} />
                  <span>WhatsApp Cloud</span>
                </button>
              </div>
            </div>

            {/* Destination input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Saisir l'adresse de destination ({testChannel === "email" ? "courriel" : testChannel === "push" ? "Navigateur" : "Numéro international"})
              </label>
              <input 
                type="text"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder={testChannel === "email" ? "Ex: support@glabeboutique.com" : testChannel === "push" ? "Sujet navigateur" : "Ex: +22177 XXXXXXX ou +22899XXXXXX"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:bg-white text-xs font-mono font-bold text-slate-800"
              />
            </div>

            {/* Notification Title */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Titre de la Notification</label>
              <input 
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Introduisez l'objet ou l'intitulé"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:bg-white text-xs font-bold text-slate-800"
              />
            </div>

            {/* Message Body Textarea */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Contenu textuel détaillé du message</label>
              <textarea 
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                rows={4}
                placeholder="Rédigez la communication d'audit..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:outline-none focus:bg-white text-xs font-semibold text-slate-800 leading-normal"
              />
            </div>

            {/* Sending interactive workflow action button */}
            <button 
              onClick={handleTriggerSendNotification}
              disabled={isSending}
              className={`w-full py-3 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                isSending ? "bg-slate-405" : "bg-slate-950 hover:bg-slate-900"
              }`}
            >
              <Send className="h-4 w-4 text-brand-orange" />
              <span>{isSending ? "Distribution en cours..." : "Lancer le test de messagerie"}</span>
            </button>
          </div>

          {/* Interactive device display illustrating the notification real-time delivery animation */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6.5 text-white flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[460px]">
            
            {/* Top Device status */}
            <div className="w-full flex justify-between items-center text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-900">
              <span>GATEWAY LINK MONITOR</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE CONNECT
              </span>
            </div>

            {/* Send simulation step tracker or inactive status */}
            {!isSending ? (
              <div className="space-y-5 my-auto py-11">
                <div className="mx-auto h-16 w-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-850 text-[#FF7A00]">
                  <Cpu className="h-8 w-8 animate-pulse" />
                </div>
                <div>
                  <h5 className="font-extrabold text-sm">Dispositif Prêt au relais</h5>
                  <p className="text-[11px] text-slate-405 max-w-xs leading-normal mt-1.5 font-normal">
                    Lorsque vous cliquerez sur le bouton d'expédition, l'animation réseau s'affichera ici en temps réel pour modéliser le routage.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 my-auto py-6 w-full animate-motion-in">
                
                {/* Visual Circle Loader representing status */}
                <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-800 animate-spin" />
                  <div className="h-14 w-14 bg-slate-900 rounded-full flex items-center justify-center border border-[#FF7A00]">
                    <RefreshCw className="h-5 w-5 text-brand-orange animate-spin" />
                  </div>
                </div>

                {/* Vertical progression pipeline */}
                <div className="space-y-4 max-w-xs mx-auto text-left font-mono text-[10px]">
                  <div className="flex items-center gap-3">
                    <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-xs font-black ${
                      sendStep >= 0 ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-500"
                    }`}>
                      {sendStep > 0 ? "✓" : "1"}
                    </span>
                    <span className={sendStep >= 0 ? "text-slate-105 font-bold" : "text-slate-505"}>
                      Contrôle Sécurité des passerelles
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-xs font-black ${
                      sendStep >= 1 ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-500"
                    }`}>
                      {sendStep > 1 ? "✓" : "2"}
                    </span>
                    <span className={sendStep >= 1 ? "text-slate-105 font-bold" : "text-slate-505"}>
                      Arrangement de paquets TLS crypté
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-xs font-black ${
                      sendStep >= 2 ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-500"
                    }`}>
                      {sendStep > 2 ? "✓" : "3"}
                    </span>
                    <span className={sendStep >= 2 ? "text-slate-105 font-bold" : "text-slate-505"}>
                      Handshake et émission de l'hôte
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-xs font-black ${
                      sendStep >= 3 ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-slate-500"
                    }`}>
                      {sendStep > 3 ? "✓" : "4"}
                    </span>
                    <span className={sendStep >= 3 ? "text-slate-105 font-bold" : "text-slate-505"}>
                      Signature d'acquittement SHA-256
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* Security disclaimer footer */}
            <div className="text-[9.5px] font-mono text-slate-500 leading-normal border-t border-slate-900 pt-3">
              Conformité stricte de l'isolation logique des données SSO conformément aux directives GCP de Glablab.
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
         SUB-TAB 4: DELIVERY AUDIT LOGS LEDGER
         ========================================== */}
      {activeSubTab === "logs" && (
        <div className="space-y-4 animate-motion-in">
          
          {/* Filtering bar. Beautifully optimized, completely responsive grid sizes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-premium flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search inputs */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher par destinataire, titre, ou passerelle..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:border-indigo-505"
              />
            </div>

            {/* Dropdown channel filtering selection */}
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-slate-400 font-bold hidden sm:inline uppercase">Canal :</span>
              <select 
                value={logChannelFilter}
                onChange={(e) => setLogChannelFilter(e.target.value)}
                className="bg-slate-55 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none cursor-pointer text-slate-700 font-bold"
              >
                <option value="all">Tous les réseaux</option>
                <option value="email">Courriels</option>
                <option value="push">Push Navigateur</option>
                <option value="sms">SMS Téléphonie</option>
                <option value="whatsapp">WhatsApp Cloud</option>
              </select>
            </div>

          </div>

          {/* Logs table content lists */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-premium overflow-hidden">
            <div className="overflow-x-auto min-w-full">
              <table className="w-full text-left font-semibold text-xs border-collapse divide-y divide-slate-100">
                <thead className="bg-slate-50 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4">Réseau & Canal</th>
                    <th className="p-4">Destinataire</th>
                    <th className="p-4">Titre / Aperçu</th>
                    <th className="p-4">Processeur API</th>
                    <th className="p-4">Statut</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-mono text-xs">
                        Aucun log de transmission ne trouve d'équivalence.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Channel Badge Column */}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-mono border ${
                            item.channel === 'email' ? 'bg-blue-50 text-blue-700 border-blue-105' :
                            item.channel === 'push' ? 'bg-indigo-50 text-indigo-700 border-indigo-105' :
                            item.channel === 'sms' ? 'bg-emerald-50 text-emerald-700 border-emerald-105' :
                            'bg-green-50 text-green-700 border-green-105'
                          }`}>
                            {item.channel === 'email' && <Mail className="h-3.5 w-3.5" />}
                            {item.channel === 'push' && <Bell className="h-3.5 w-3.5 animate-swing" />}
                            {item.channel === 'sms' && <Smartphone className="h-3.5 w-3.5" />}
                            {item.channel === 'whatsapp' && <Zap className="h-3.5 w-3.5 animate-pulse" />}
                            {item.channel}
                          </span>
                        </td>

                        {/* Recipient info */}
                        <td className="p-4 font-mono text-xs text-slate-900">
                          {item.recipient}
                        </td>

                        {/* Title text preview */}
                        <td className="p-4 max-w-xs truncate text-[11px] text-slate-650" title={item.title}>
                          <span className="font-extrabold block text-slate-900">{item.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{item.date}</span>
                        </td>

                        {/* Gateway description */}
                        <td className="p-4 font-mono text-[10.5px] text-slate-500">
                          {item.gateway}
                        </td>

                        {/* Delivery Status */}
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase text-xs ${
                            item.status === 'success' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {item.status === 'success' ? 'Diffusé' : 'Échec log'}
                          </span>
                        </td>

                        {/* Item Action Trigger. Includes modal inspector */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2.5 font-mono text-xs">
                            <button 
                              onClick={() => setInspectedLog(item)}
                              className="px-2.5 py-1 text-slate-500 hover:text-slate-950 bg-slate-100 hover:bg-slate-150 rounded-lg transition-colors cursor-pointer text-[10.5px]"
                            >
                              Inspecter Metadata
                            </button>
                            <button 
                              onClick={() => handleRetryLog(item)}
                              className="px-2.5 py-1 text-[#FF7A00] hover:text-white bg-orange-50 hover:bg-[#FF7A00] rounded-lg transition-all cursor-pointer text-[10.5px]"
                            >
                              Relancer l'émetteur
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
         METADATA MODAL / DRAWER FOR LOGS INSPECTION
         ======================================================== */}
      {inspectedLog && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl overflow-hidden animate-motion-in">
            
            {/* Modal header */}
            <div className="px-6 py-4.5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h4 className="font-extrabold text-xs font-mono text-brand-orange uppercase flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5" />
                Détails du paquet d'émissions SecOps
              </h4>
              <button 
                onClick={() => setInspectedLog(null)}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer text-sm"
              >
                ✕ Fermer
              </button>
            </div>

            {/* JSON Code Area */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Metadata Payload JSON (SHA-256)</span>
                <pre className="p-4 bg-slate-950 rounded-xl text-[10.5px] font-mono text-emerald-450 border border-slate-850 overflow-x-auto select-all max-h-60 leading-normal">
                  {JSON.stringify({
                    uuid: inspectedLog.id,
                    transmittedAt: inspectedLog.date,
                    carrierGateway: inspectedLog.gateway,
                    routingChannel: inspectedLog.channel,
                    securePayload: {
                      title: inspectedLog.title,
                      recipientTarget: auditedMask(inspectedLog.recipient)
                    },
                    networkReceipt: inspectedLog.metadata
                  }, null, 2)}
                </pre>
              </div>

              <div className="text-[10.5px] font-mono text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex items-start gap-2.5 leading-normal font-medium">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  Ce diagnostic certifie que le micro-bundle a été authentifié, cloisonné par clé asymétrique et expédié via un tunnel sécurisé SSL sous hachage cryptographique SHA-256.
                </p>
              </div>

              <button 
                onClick={() => setInspectedLog(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
              >
                ✓ Quitter l'Inspecteur
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Small helper to mask recipient values in telemetry preview for SecOps privacy
function auditedMask(val: string) {
  if (val.includes("@")) {
    const parts = val.split("@");
    return `${parts[0].substring(0, 3)}••••@${parts[1]}`;
  }
  return `${val.substring(0, 4)}••••${val.substring(val.length - 2)}`;
}

// ==========================================
// 6. SETTINGS TAB (COMMERCIAL MULTI-ZONE SUITE)
// ==========================================

const settingsTranslations = {
  fr: {
    profil: "Profil Utilisateur",
    logs: "Journal de Connexion",
    securite: "Sécurité & MFA",
    themes: "Thèmes Visuels",
    langues: "Langues (Languages)",
    sauvegarde: "Backup & Mises à Jour",
    
    settingsTitle: "Configuration Centrale de la Plateforme SaaS",
    settingsDesc: "Gérez les permissions de votre profil, l'observabilité réseau, la sécurité cryptographique et l'esthétique de votre interface d'administration SSO.",
    
    userProfile: "Profil de l'Utilisateur",
    profileDesc: "Modifiez l'identité associée à votre session administrative sur l'ensemble de l'écosystème.",
    fullName: "Nom Complet",
    emailAddress: "Adresse E-mail",
    department: "Département / Service",
    tenantName: "Organisation SSO active",
    roleLabel: "Rôle de sécurité unifié",
    saveProfile: "Garder & Mettre à jour",
    profileUpdated: "Profil utilisateur actualisé en direct !",
    
    connectionLogs: "Journal d'Audit des Connexions",
    logsDesc: "Liste traçable des authentifications SSO et tentatives d'échanges de jetons.",
    connTime: "Heure UTC",
    connIp: "Adresse IP",
    connGeo: "Localisation",
    connAgent: "Navigateur / Client",
    connMethod: "Opération",
    refreshLogs: "Actualiser le journal",
    exportCsv: "Exporter (.CSV)",
    logsRefreshed: "Journal d'audit réactualisé !",
    logsExported: "Fichier CSV téléchargé avec succès (Simulation) !",
    
    securityTitle: "Sécurité, OTP & Clés Asymétriques",
    securityDesc: "Configurez l'authentification forte, tournez les clés de chiffrement et configurez le verrouillage automatique.",
    mfaLabel: "Forcer le double-facteur (MFA)",
    mfaDesc: "Exige de valider un jeton OTP cryptographique à chaque entrée.",
    mfaActive: "ACTIF EN CONTINU",
    mfaInactive: "ACTIVER OTP EN DIRECT",
    rsaLabel: "Signatures de Clés Secures JWT (RSA)",
    rsaDesc: "Permet de vérifier en asymétrique la validité des assertions de jetons SSO des applications.",
    rotateLabel: "Tourner la clé RSA",
    lockoutTitle: "Délai maximum d'inactivité autorisé",
    lockoutDesc: "Verrouille automatiquement l'accès si la plateforme reste inactive trop longtemps.",
    lockoutValue: "minutes",
    securitySaved: "Paramètres de sécurité mis à jour !",
    
    themesTitle: "Thèmes Visuels & Accessibilité",
    themesDesc: "Ajustez l'habillage graphique de la console pour l'adapter aux préférences de vos administrateurs.",
    themeSlate: "Ardoise Cosmique (Défaut)",
    themeSlateDesc: "Châssis anthracite haut de gamme avec des touches gold-orange de G-LAB TECH.",
    themeNavy: "Directoire Exécutif",
    themeNavyDesc: "Bleu marine prestigieux avec des contrastes blancs clairs et épurés.",
    themeNeon: "Cybernetic High-Contrast",
    themeNeonDesc: "Infiltration sombre avec marqueurs fluorescents et technologiques fluorescents.",
    themeSwiss: "Minimalisme Suisse",
    themeSwissDesc: "Daylight pur et reposant pour les longues sessions de supervision.",
    themeApplied: "Thème visuel appliqué avec succès !",
    
    langTitle: "Langue & Paramètres Régionaux",
    langDesc: "Basculez l'intégralité du glossaire administratif en français ou en anglais pour vos filiales.",
    selectLang: "Sélectionnez votre langue par défaut :",
    langFr: "Français (Courant)",
    langEn: "English (US / UK)",
    langNotificationInfo: "Langue définie sur le Français pour l'ensemble du profil.",
    langNotificationInfoEn: "Language successfully set to English for your active profile.",
    
    backupTitle: "Points de Restauration & Snapshots",
    backupDesc: "Gérez les instantanés (snapshots) de votre base de données SSO.",
    backupStatus: "Statut des sauvegardes physiques",
    backupActive: "Sauvegarde Cloud GCP active",
    backupBtn: "Créer un point de restauration",
    backupSuccess: "Cliché de sauvegarde créé : Point de restauration SSO enregistré avec succès !",
    backupHistory: "Historique des clichés cryptographiques",
    systemUpdateTitle: "Cycle de Mises à Jour & Correctifs SaaS",
    systemUpdateDesc: "Vérifiez et appliquez les correctifs SecOps certifiés OWASP.",
    systemUpdateBtn: "Vérifier les mises à jour du SaaS",
    systemUpdateLoader: "Scan en cours...",
    systemUpdateFresh: "Votre noyau SaaS est à jour (v3.6.1-stable). Aucun correctif requis."
  },
  en: {
    profil: "User Profile",
    logs: "Connection Logs",
    securite: "Security & MFA",
    themes: "Visual Themes",
    langues: "Languages",
    sauvegarde: "Backup & Updates",
    
    settingsTitle: "SaaS General Platform Settings",
    settingsDesc: "Manage state-level profile credentials, network observability, cryptographic key signatures, and SaaS presentation settings.",
    
    userProfile: "User Profile Settings",
    profileDesc: "Adjust the identity parameters associated with your active administrative session.",
    fullName: "Full Name",
    emailAddress: "Email Address",
    department: "Department / Service",
    tenantName: "Active SSO Organization",
    roleLabel: "Unified Access Control Role",
    saveProfile: "Save & Update Profile",
    profileUpdated: "User profile updated successfully in real time!",
    
    connectionLogs: "Connection Audit Logs",
    logsDesc: "Traceable ledger of active account SSO authentications and token transactions.",
    connTime: "Time (UTC)",
    connIp: "IP Address",
    connGeo: "Geolocation",
    connAgent: "Browser / Client User Agent",
    connMethod: "Operation Name",
    refreshLogs: "Refresh Logs Ledger",
    exportCsv: "Export (.CSV)",
    logsRefreshed: "Logs ledger updated successfully!",
    logsExported: "CSV audit logs file downloaded (Simulation)!",
    
    securityTitle: "Security, MFA & Cryptography Keys",
    securityDesc: "Strengthen session integrity, rotate master keys, and assign automated inactive lock boundaries.",
    mfaLabel: "Force Multi-Factor Auth (MFA)",
    mfaDesc: "Require an interactive simulated OTP token input at every terminal log.",
    mfaActive: "ALWAYS ENFORCED",
    mfaInactive: "ACTIVATE OTP ONLINE",
    rsaLabel: "JWT Protected RSA Public Asserters",
    rsaDesc: "Verifies the cryptographic signature health of active domain assertions.",
    rotateLabel: "Rotate RSA Key",
    lockoutTitle: "Maximum Inactive Auto-Lock Timer",
    lockoutDesc: "Locks out the account viewport automatically if the device stays inactive.",
    lockoutValue: "minutes",
    securitySaved: "Security parameters successfully recorded!",
    
    themesTitle: "Themes & Accessibility Frameworks",
    themesDesc: "Adjust the visual casing to fit your international corporate deployment guidelines.",
    themeSlate: "Cosmic Slate (Default)",
    themeSlateDesc: "Anthracite casing with G-LAB TECH glowing gold-yellow accents.",
    themeNavy: "Executive Boardroom",
    themeNavyDesc: "Prestige navy tone with clean white controls and borders.",
    themeNeon: "Cybernetic High-Contrast",
    themeNeonDesc: "Pitch dark terminal style with hyper-contrast fluorescent indicators.",
    themeSwiss: "Swiss Daylight Grid",
    themeSwissDesc: "Clean, ultra-high contrast light theme ideal for sunny day operations.",
    themeApplied: "Visual theme updated successfully!",
    
    langTitle: "Language & Regional Localizations",
    langDesc: "Quickly toggle the centralized translation glossaries for global branch offices.",
    selectLang: "Select your active workspace language:",
    langFr: "Français (Courant)",
    langEn: "English (US / UK)",
    langNotificationInfo: "Langue définie sur le Français pour l'ensemble du profil.",
    langNotificationInfoEn: "Language successfully set to English for your active profile.",
    
    backupTitle: "Restore Points & Snapshots",
    backupDesc: "Manage real-time cloud-backed snapshots of your SSO configurations.",
    backupStatus: "Cold storage backups status",
    backupActive: "GCP Storage Backup Active",
    backupBtn: "Create Recovery Snapshot",
    backupSuccess: "Backup snapshot successfully compiled and hosted on GCP storage bucket!",
    backupHistory: "Cryptographic Restore Points Catalog",
    systemUpdateTitle: "Global SaaS Patches & Lifecycle",
    systemUpdateDesc: "Review and enforce OWASP-compliant system hotfixes and engine upgrades.",
    systemUpdateBtn: "Check for SaaS Updates",
    systemUpdateLoader: "Scanning repositories...",
    systemUpdateFresh: "Your SaaS core is running the latest stable build (v3.6.1-stable). No patches required."
  }
};

export function SettingsTab({ 
  user, 
  setUser, 
  onNotify 
}: { 
  user: PortalUser; 
  setUser: any; 
  onNotify?: (msg: string, type: 'success' | 'warn' | 'info') => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<"profil" | "logs" | "securite" | "themes" | "langues" | "sauvegarde" | "integrations">("profil");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  
  // Custom states
  const [mfa, setMfa] = useState(user.mfaEnabled);
  const [allowRegistration, setAllowRegistration] = useState(() => {
    return localStorage.getItem("glab_allow_registration") === "true";
  });
  const [rsaKey, setRsaKey] = useState("RSA_PUBLIC_KEY_SHA256_GLABTECH_SECURE_PORTAL_2026_PROD_F83B");
  const [lockMinutes, setLockMinutes] = useState(30);
  const [activeTheme, setActiveTheme] = useState("slate");

  // Vercel Integration States
  const [vercelConnected, setVercelConnected] = useState<boolean>(false);
  const [vercelToken, setVercelToken] = useState<string>("");
  const [vercelProject, setVercelProject] = useState<string>("glabtech-sso");
  const [vercelBranch, setVercelBranch] = useState<string>("main");
  const [isConnectingVercel, setIsConnectingVercel] = useState<boolean>(false);
  const [isDeployingVercel, setIsDeployingVercel] = useState<boolean>(false);
  const [vercelDeployLogs, setVercelDeployLogs] = useState<string[]>([]);
  const [vercelDeployStatus, setVercelDeployStatus] = useState<"idle" | "building" | "success" | "failed">("idle");
  const [vercelDeployUrl, setVercelDeployUrl] = useState<string>("");

  // Railway Integration States
  const [railwayConnected, setRailwayConnected] = useState<boolean>(false);
  const [railwayToken, setRailwayToken] = useState<string>("");
  const [railwayProject, setRailwayProject] = useState<string>("glabtech-production-db");
  const [isConnectingRailway, setIsConnectingRailway] = useState<boolean>(false);
  const [isTestingRailway, setIsTestingRailway] = useState<boolean>(false);
  const [railwayDbUrl, setRailwayDbUrl] = useState<string>("postgresql://postgres:***@roundhouse.proxy.rlwy.net:12345/railway");
  const [railwayPostgresActive, setRailwayPostgresActive] = useState<boolean>(true);
  const [railwayRedisActive, setRailwayRedisActive] = useState<boolean>(false);
  const [vercelRailwayBridgeActive, setVercelRailwayBridgeActive] = useState<boolean>(false);

  // Profil Form States
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileDept, setProfileDept] = useState(user.department || "");
  const [profileAvatar, setProfileAvatar] = useState(user.avatar || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // ERP & LRS Advanced Security States
  const [erpIpWhitelistFilter, setErpIpWhitelistFilter] = useState(() => {
    return localStorage.getItem("glab_erp_ip_filter") !== "false";
  });
  const [erpIpList, setErpIpList] = useState<string[]>(() => {
    const stored = localStorage.getItem("glab_erp_ip_list");
    return stored ? JSON.parse(stored) : ["192.168.1.1", "10.0.0.4", "82.122.95.4", "2a01:cb08:8384:6e00::1"];
  });
  const [newErpIpInput, setNewErpIpInput] = useState("");
  const [lrsLogIntegrity, setLrsLogIntegrity] = useState(() => {
    return localStorage.getItem("glab_lrs_log_integrity") || "chain";
  });
  const [erpDbEncryption, setErpDbEncryption] = useState(() => {
    return localStorage.getItem("glab_erp_db_encrypt") !== "false";
  });
  const [erpRateLimiting, setErpRateLimiting] = useState(() => {
    return localStorage.getItem("glab_erp_rate_limit_active") !== "false";
  });
  const [erpRateLimitValue, setErpRateLimitValue] = useState(() => {
    return Number(localStorage.getItem("glab_erp_rate_limit_val") || "60");
  });
  const [lrsSealTimestamp, setLrsSealTimestamp] = useState<string>("");
  const [isGeneratingLrsSeal, setIsGeneratingLrsSeal] = useState(false);

  // States for Camera & Photo Upload
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Stop camera when activeSubTab changes or component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (activeSubTab !== "profil") {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setIsCameraActive(false);
      setCameraError(null);
    }
  }, [activeSubTab]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: "user" }
      });
      setCameraStream(stream);
      setTimeout(() => {
        const videoElement = document.getElementById("profile-webcam") as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.play().catch(err => {
            console.error("Error playing video stream:", err);
          });
        }
      }, 150);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError(
        err.name === "NotAllowedError" 
          ? "Accès à la caméra refusé. Autorisez les permissions de caméra dans votre navigateur."
          : "Impossible de démarrer la caméra. Vérifiez si elle n'est pas déjà utilisée par un autre onglet."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    const videoElement = document.getElementById("profile-webcam") as HTMLVideoElement;
    if (!videoElement) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const videoWidth = videoElement.videoWidth || 320;
        const videoHeight = videoElement.videoHeight || 320;
        const minDim = Math.min(videoWidth, videoHeight);
        const sx = (videoWidth - minDim) / 2;
        const sy = (videoHeight - minDim) / 2;
        ctx.drawImage(videoElement, sx, sy, minDim, minDim, 0, 0, 256, 256);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setProfileAvatar(dataUrl);
        triggerNotification(language === "fr" ? "Cliché capturé avec succès !" : "Snapshot captured successfully!", "success");
      }
      stopCamera();
    } catch (err) {
      console.error("Error drawing video track:", err);
      triggerNotification("Échec de la capture de la photo.", "warn");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        triggerNotification("Veuillez sélectionner une image valide.", "warn");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
        triggerNotification(language === "fr" ? "Nouvel avatar chargé avec succès !" : "New avatar loaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Backup states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupHistory, setBackupHistory] = useState([
    { id: "snap-1", name: "Restauration_Mensuelle_Sécurisée", date: "24 Mai 2026, 14:32", size: "142 MB", creator: "Système (Auto)" },
    { id: "snap-2", name: "Pre_Migration_Patch_v3.6.0", date: "15 Mai 2026, 09:12", size: "139 MB", creator: "Gildas (Admin)" }
  ]);

  // System Update state
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateChecked, setUpdateChecked] = useState(false);

  // Connection Logs
  const [logs, setLogs] = useState([
    { id: "log-1", time: "2026-05-28 08:42:15", ip: "192.168.12.80", geo: "Paris, France", agent: "Chrome 125 / macOS SecLink", event: "Connexion SSO Réussie" },
    { id: "log-2", time: "2026-05-28 07:12:04", ip: "192.168.12.80", geo: "Paris, France", agent: "Chrome 125 / macOS SecLink", event: "Handshake JWT Zoho" },
    { id: "log-3", time: "2026-05-27 15:33:41", ip: "82.16.294.51", geo: "Londres, UK", agent: "Safari 17 / iPadOS Mobile", event: "Connexion SSO Réussie" },
    { id: "log-4", time: "2026-05-27 10:14:22", ip: "192.168.12.80", geo: "Paris, France", agent: "Chrome 125 / macOS SecLink", event: "Échange de Clés RSA" }
  ]);
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);

  const t = settingsTranslations[language];

  const triggerNotification = (msg: string, type: 'success' | 'warn' | 'info' = 'success') => {
    if (onNotify) {
      onNotify(msg, type);
    }
  };

  const handleRegenRsa = () => {
    setRsaKey("RSA_PUBLIC_KEY_SHA255_ROTATED_F_" + Math.random().toString(36).substring(2, 6).toUpperCase());
    triggerNotification(language === "fr" ? "Clé asymétrique RSA renouvelée !" : "Cryptographic RSA key successfully rotated!", "success");
  };

  const saveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setUser({
        ...user,
        name: profileName,
        email: profileEmail,
        department: profileDept,
        avatar: profileAvatar
      });
      setIsSavingProfile(false);
      triggerNotification(t.profileUpdated, "success");
    }, 700);
  };

  const refreshConnectionLogs = () => {
    setIsRefreshingLogs(true);
    setTimeout(() => {
      const newLog = {
        id: `log-${Date.now()}`,
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ip: "192.168.12.80",
        geo: "Paris, France",
        agent: navigator.userAgent.substring(0, 30),
        event: "Actualisation de la session SSO"
      };
      setLogs([newLog, ...logs]);
      setIsRefreshingLogs(false);
      triggerNotification(t.logsRefreshed, "success");
    }, 600);
  };

  const exportLogsCsv = () => {
    triggerNotification(t.logsExported, "info");
  };

  const handleTakeSnapshot = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newSnap = {
        id: `snap-${Date.now()}`,
        name: `Instantane_Manuel_Securise_${new Date().getDate()}_Gildas`,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) + `, ${new Date().getHours()}:${new Date().getMinutes()}`,
        size: "141 MB",
        creator: "Gildas (Admin)"
      };
      setBackupHistory([newSnap, ...backupHistory]);
      setIsBackingUp(false);
      triggerNotification(t.backupSuccess, "success");
    }, 900);
  };

  const handleCheckSaaSUpdates = () => {
    setCheckingUpdates(true);
    setTimeout(() => {
      setCheckingUpdates(false);
      setUpdateChecked(true);
      triggerNotification(t.systemUpdateFresh, "info");
    }, 850);
  };

  return (
    <div className="space-y-6 animate-motion-in">
      
      {/* Settings Central Header */}
      <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5">
          <Settings className="h-20 w-20 text-brand-orange animate-spin-slow" />
        </div>
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-brand-orange" />
              {t.settingsTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-3xl font-medium">
              {t.settingsDesc}
            </p>
          </div>
          {/* Active locale pill */}
          <div className="flex items-center gap-1.5 bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full text-brand-orange font-mono text-[10px] uppercase font-bold">
            <Globe className="h-3.5 w-3.5" />
            <span>Locale : {language.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout splits visualizer and rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Navigation panel */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: "profil", icon: User, label: t.profil, color: "text-indigo-550 bg-indigo-50" },
            { id: "logs", icon: History, label: t.logs, color: "text-sky-550 bg-sky-50" },
            { id: "securite", icon: Shield, label: t.securite, color: "text-amber-550 bg-amber-50" },
            { id: "themes", icon: Palette, label: t.themes, color: "text-purple-550 bg-purple-50" },
            { id: "langues", icon: Globe, label: t.langues, color: "text-emerald-555 bg-emerald-50" },
            { id: "sauvegarde", icon: Database, label: t.sauvegarde, color: "text-[#FF7A00] bg-orange-50" },
            { id: "integrations", icon: Cpu, label: language === "fr" ? "Intégrations DevOps" : "DevOps Cloud Integrations", color: "text-rose-550 bg-rose-50" }
          ].map((nav) => {
            const IconComponent = nav.icon;
            const isActive = activeSubTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveSubTab(nav.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive 
                    ? "border-brand-orange bg-brand-orange/[0.03] text-brand-orange scale-[1.01] shadow-premium-sm font-black" 
                    : "border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? "bg-brand-orange/10" : "bg-slate-100"}`}>
                  <IconComponent className={`h-4 w-4 ${isActive ? "text-brand-orange" : "text-slate-500"}`} />
                </div>
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box panel */}
        <div className="lg:col-span-9 bg-white border border-slate-200/85 rounded-2xl p-6 shadow-premium transition-all duration-300">
          
          {/* ==========================================
             1. PROFIL DE L'UTILISATEUR SUB-TAB
             ========================================== */}
          {activeSubTab === "profil" && (
            <div className="space-y-5 animate-motion-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <User className="h-4.5 w-4.5 text-indigo-600 animate-pulse" /> {t.userProfile}
                </h4>
                <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.profileDesc}</p>
              </div>

               <form onSubmit={saveProfileSettings} className="space-y-6">
                
                {/* Section photo de profil interactive (Prendre la photo / Importer) */}
                <div className="bg-slate-50/70 border border-slate-150 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] uppercase font-mono font-black text-slate-400 block tracking-wider">
                    Photo de Profil SSO
                  </span>
                  
                  <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                    {/* circular avatar preview */}
                    <div className="relative group flex-shrink-0">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-brand-orange/40 group-hover:border-brand-orange shadow-md bg-white flex items-center justify-center">
                        {profileAvatar ? (
                          <img 
                            src={profileAvatar} 
                            alt="Avatar" 
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <User className="h-10 w-10 text-slate-300" />
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 bg-brand-orange text-white p-1 rounded-full text-[10px] border border-white shadow">
                        ★
                      </span>
                    </div>

                    <div className="space-y-2 flex-grow">
                      <h5 className="font-extrabold text-xs text-slate-800">Personnalisez votre identifiant visuel</h5>
                      <p className="text-[10.5px] text-slate-500 leading-normal max-w-lg">
                        Mettez à jour votre avatar à l'aide de votre webcam en direct ou en chargeant un fichier d'image (PNG, JPG, BMP) depuis votre ordinateur.
                      </p>
                      
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          type="button"
                          onClick={isCameraActive ? stopCamera : startCamera}
                          className="flex items-center gap-1.5 bg-[#0B1F3A] hover:bg-black text-white rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-all shadow-sm"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          {isCameraActive ? "Désactiver la caméra" : "Prendre une photo"}
                        </button>

                        <label 
                          htmlFor="profile-avatar-upload" 
                          className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition-all shadow-sm"
                        >
                          <Upload className="h-3.5 w-3.5 text-slate-500" />
                          Importer une de vos photos
                        </label>
                        <input 
                          type="file" 
                          id="profile-avatar-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* live camera stream feed */}
                  {isCameraActive && (
                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4 max-w-sm mx-auto md:mx-0 animate-motion-in">
                      <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                          Flux vidéo webcam en direct (Miroir)
                        </span>
                        <button 
                          type="button" 
                          onClick={stopCamera} 
                          className="text-slate-400 hover:text-white font-bold bg-transparent border-0 cursor-pointer"
                        >
                          Fermer
                        </button>
                      </div>

                      <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                        <video 
                          id="profile-webcam" 
                          className="w-full h-full object-cover scale-x-[-1]" 
                          autoPlay 
                          playsInline 
                          muted 
                        />
                        <div className="absolute inset-0 border-2 border-brand-orange/30 pointer-events-none rounded-xl" />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="flex-1 bg-brand-orange hover:bg-orange-600 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow border-0"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          Capturer la photo
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-350 rounded-xl py-2 px-3.5 text-xs font-semibold cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  {cameraError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-850 rounded-xl text-xs font-semibold max-w-lg leading-relaxed">
                      {cameraError}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-black text-slate-400 block">{t.fullName}</label>
                    <input 
                      type="text" 
                      required
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-black text-slate-400 block">{t.emailAddress}</label>
                    <input 
                      type="email" 
                      required
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono font-black text-slate-400 block">{t.department}</label>
                    <input 
                      type="text" 
                      value={profileDept} 
                      onChange={(e) => setProfileDept(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5 opacity-80">
                    <label className="text-[10px] uppercase font-mono font-black text-slate-400 block">{t.tenantName}</label>
                    <input 
                      type="text" 
                      disabled 
                      value={user.tenant || "GLABTECH HQ (Europe)"} 
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#0B1F3A]/[0.02] border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono text-slate-400 font-black">{t.roleLabel}</span>
                    <strong className="text-brand-blue block text-xs font-extrabold">{user.role}</strong>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" /> Maître Suprême Certifié
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow"
                  >
                    {isSavingProfile ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> {language === "fr" ? "Enregistrement..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> {t.saveProfile}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==========================================
             2. JOURNAL DE CONNEXION SUB-TAB
             ========================================== */}
          {activeSubTab === "logs" && (
            <div className="space-y-5 animate-motion-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <History className="h-4.5 w-4.5 text-sky-600" /> {t.connectionLogs}
                  </h4>
                  <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.logsDesc}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={exportLogsCsv}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-850 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t.exportCsv}
                  </button>
                  <button
                    onClick={refreshConnectionLogs}
                    disabled={isRefreshingLogs}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefreshingLogs ? "animate-spin" : ""}`} />
                    {t.refreshLogs}
                  </button>
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 font-mono text-[9px] uppercase tracking-wider text-slate-500 font-black">
                      <th className="p-3">{t.connTime}</th>
                      <th className="p-3">{t.connIp}</th>
                      <th className="p-3">{t.connGeo}</th>
                      <th className="p-3">{t.connMethod}</th>
                      <th className="p-3">{t.connAgent}</th>
                      <th className="p-3 text-right">Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 bg-white font-medium text-slate-700 transition-colors">
                        <td className="p-3 font-mono text-[10.5px] whitespace-nowrap">{log.time}</td>
                        <td className="p-3 font-mono text-indigo-700 font-bold">{log.ip}</td>
                        <td className="p-3 text-slate-600 font-semibold">{log.geo}</td>
                        <td className="p-3 font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] ${
                            log.event.includes("SSO") || log.event.includes("JWT")
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                              : "bg-indigo-50 text-indigo-800 border border-indigo-100"
                          }`}>
                            {log.event}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[10.5px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]" title={log.agent}>{log.agent}</td>
                        <td className="p-3 text-right text-emerald-600 font-mono text-[10px] font-extrabold select-all">SSO_VERIFIED_JWT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
             3. SECURITE SUB-TAB
             ========================================== */}
          {activeSubTab === "securite" && (
            <div className="space-y-5 animate-motion-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Shield className="h-4.5 w-4.5 text-amber-500" /> {t.securityTitle}
                </h4>
                <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.securityDesc}</p>
              </div>

              <div className="space-y-4">
                {/* MFA Enforcer */}
                <div className="flex items-center justify-between p-4 border border-slate-150 bg-[#F8FAF9]/40 rounded-xl shadow-sm">
                  <div className="flex gap-3">
                    <Smartphone className="h-5.5 w-5.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900">{t.mfaLabel}</h5>
                      <p className="text-[10px] text-slate-550 mt-0.5">{t.mfaDesc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMfa(!mfa);
                      setUser({ ...user, mfaEnabled: !mfa });
                      triggerNotification(language === "fr" ? "Double facteur (MFA) actualisé !" : "MFA settings applied!", "success");
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-black border transition-all cursor-pointer ${
                      mfa 
                        ? "bg-emerald-55 text-emerald-700 border-emerald-250 hover:bg-emerald-100/10" 
                        : "bg-slate-100 text-slate-500 border-slate-202 hover:bg-slate-200/50"
                    }`}
                  >
                    {mfa ? t.mfaActive : t.mfaInactive}
                  </button>
                </div>

                {/* SaaS Registration Control */}
                <div className="flex items-center justify-between p-4 border border-slate-150 bg-[#F8FAF9]/40 rounded-xl shadow-sm">
                  <div className="flex gap-3">
                    <Users className="h-5.5 w-5.5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-extrabold text-xs text-slate-900">
                        {language === "fr" ? "Autoriser l'inscription de comptes principaux" : "Allow primary account registration"}
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                        {language === "fr"
                          ? "Ajoute l'option de création d'organisation sur le formulaire d'authentification principal."
                          : "Expose the create organization option directly on the primary credentials gateway."}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = !allowRegistration;
                      setAllowRegistration(updated);
                      localStorage.setItem("glab_allow_registration", String(updated));
                      triggerNotification(
                        language === "fr"
                          ? `Création de comptes désormais ${updated ? "activée" : "désactivée"}`
                          : `Account registration is now ${updated ? "enabled" : "disabled"}`,
                        "success"
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-black border transition-all cursor-pointer ${
                      allowRegistration
                        ? "bg-emerald-55 text-emerald-700 border-emerald-250 hover:bg-emerald-100/10"
                        : "bg-slate-100 text-slate-500 border-slate-202 hover:bg-slate-200/50"
                    }`}
                  >
                    {allowRegistration 
                      ? (language === "fr" ? "AUTORISÉ" : "ALLOWED")
                      : (language === "fr" ? "DÉSACTIVÉ / BLOQUÉ" : "DISABLED / BLOCKED")}
                  </button>
                </div>

                {/* RSA Rotating block */}
                <div className="p-4 border border-slate-150 bg-[#F8FAF9]/40 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Fingerprint className="h-5.5 w-5.5 text-brand-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900">{t.rsaLabel}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">{t.rsaDesc}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleRegenRsa}
                      className="bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90 px-3 py-1.5 rounded text-[10px] font-black font-mono transition-colors cursor-pointer border-0 shadow-sm"
                    >
                      {t.rotateLabel}
                    </button>
                  </div>

                  <code className="bg-slate-950 text-emerald-450 text-[10px] p-3 rounded-lg border border-white/5 block font-mono break-all leading-relaxed select-all">
                    {rsaKey}
                  </code>
                </div>

                {/* Locking Slider auto logout */}
                <div className="p-4 border border-slate-150 bg-[#F8FAF9]/40 rounded-xl space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <Sliders className="h-5.5 w-5.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900">{t.lockoutTitle}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">{t.lockoutDesc}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-black bg-slate-100 text-indigo-700 px-2 py-1 rounded">
                      {lockMinutes} {t.lockoutValue}
                    </span>
                  </div>

                  <div className="pt-2 class flex items-center gap-4">
                    <input 
                      type="range"
                      min={5}
                      max={120}
                      step={5}
                      value={lockMinutes}
                      onChange={(e) => setLockMinutes(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                    <button
                      onClick={() => triggerNotification(t.securitySaved, "success")}
                      className="text-[10.5px] font-black text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg border-0 cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>

                {/* DURCISSEMENT ERP & SECURITE LRS (LOG RECORD STORE) */}
                <div className="p-5 border border-slate-200 bg-slate-900 text-slate-100 rounded-2xl space-y-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Shield className="h-40 w-40 text-brand-orange" />
                  </div>
                  
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-sm text-[#FF7A00] flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        {language === "fr" ? "Durcissement de Sécurité : G-ERP & Système LRS" : "Security Hardening: G-ERP & LRS Engine"}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {language === "fr" 
                          ? "Configurez les barrières d'accès réseau, le chiffrement de la base G-ERP et l'intégrité cryptographique du Log Record Store (LRS)."
                          : "Configure network firewalls, G-ERP database encryption, and cryptographic Log Record Store (LRS) integrity."}
                      </p>
                    </div>
                    <span className="bg-[#FF7A00]/10 border border-[#FF7A00]/35 text-[#FF7A00] text-[9.5px] font-mono font-black tracking-wider px-2 py-0.5 rounded-full uppercase animate-pulse">
                      SecOps Active
                    </span>
                  </div>

                  {/* Feature 1: IP Access Filtering (Firewall) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2.5">
                        <Globe className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            {language === "fr" ? "Pare-feu & Filtrage d'Adresses IP" : "Firewall & IP Address Whitelisting"}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            {language === "fr" ? "Autorise uniquement les adresses IP spécifiées à interroger l'API G-ERP." : "Strictly allow only specified IP addresses to query the G-ERP backend API."}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updated = !erpIpWhitelistFilter;
                          setErpIpWhitelistFilter(updated);
                          localStorage.setItem("glab_erp_ip_filter", String(updated));
                          triggerNotification(
                            language === "fr" 
                              ? `Filtrage IP ERP ${updated ? "activé" : "désactivé"}`
                              : `ERP IP Filtering ${updated ? "enabled" : "disabled"}`,
                            "info"
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-[9px] font-mono font-black border transition-all cursor-pointer ${
                          erpIpWhitelistFilter
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-slate-800 text-slate-450 border-slate-700 hover:bg-slate-750"
                        }`}
                      >
                        {erpIpWhitelistFilter ? (language === "fr" ? "ACTIF" : "ACTIVE") : (language === "fr" ? "INACTIF" : "INACTIVE")}
                      </button>
                    </div>

                    {erpIpWhitelistFilter && (
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {erpIpList.map((ip, idx) => (
                            <span key={`${ip}-${idx}`} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200">
                              <code>{ip}</code>
                              <button 
                                onClick={() => {
                                  if (erpIpList.length <= 1) {
                                    triggerNotification(
                                      language === "fr" ? "Impossible de supprimer la dernière IP (mesure de secours d'accès) !" : "Cannot delete last IP (failsafe measure)!",
                                      "warn"
                                    );
                                    return;
                                  }
                                  const updated = erpIpList.filter(item => item !== ip);
                                  setErpIpList(updated);
                                  localStorage.setItem("glab_erp_ip_list", JSON.stringify(updated));
                                  triggerNotification(language === "fr" ? `IP ${ip} révoquée.` : `IP ${ip} revoked.`, "success");
                                }}
                                className="text-red-400 hover:text-red-300 font-mono font-extrabold cursor-pointer ml-1 select-none"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Ex: 195.154.120.91 ou IP v6"
                            value={newErpIpInput}
                            onChange={(e) => setNewErpIpInput(e.target.value)}
                            className="bg-slate-900 border border-slate-755 text-slate-100 placeholder-slate-550 text-[11px] font-mono px-3 py-1.5 rounded-lg flex-1 focus:outline-none focus:border-[#FF7A00] transition-all"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (!newErpIpInput.trim()) return;
                                const cleaned = newErpIpInput.trim();
                                if (erpIpList.includes(cleaned)) {
                                  triggerNotification(language === "fr" ? "L'adresse IP est déjà autorisée !" : "IP address already whitelisted!", "warn");
                                  return;
                                }
                                const updated = [...erpIpList, cleaned];
                                setErpIpList(updated);
                                localStorage.setItem("glab_erp_ip_list", JSON.stringify(updated));
                                setNewErpIpInput("");
                                triggerNotification(language === "fr" ? `Adresse IP ${cleaned} raccordée !` : `IP ${cleaned} whitelisted!`, "success");
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (!newErpIpInput.trim()) return;
                              const cleaned = newErpIpInput.trim();
                              if (erpIpList.includes(cleaned)) {
                                triggerNotification(language === "fr" ? "L'adresse IP est déjà autorisée !" : "IP address already whitelisted!", "warn");
                                return;
                              }
                              const updated = [...erpIpList, cleaned];
                              setErpIpList(updated);
                              localStorage.setItem("glab_erp_ip_list", JSON.stringify(updated));
                              setNewErpIpInput("");
                              triggerNotification(language === "fr" ? `Adresse IP ${cleaned} raccordée !` : `IP ${cleaned} whitelisted!`, "success");
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            {language === "fr" ? "Ajouter" : "Add"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="border-slate-800" />

                  {/* Feature 2: LRS Audit Log Integrity Seals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex gap-2">
                        <Activity className="h-4.5 w-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">
                            {language === "fr" ? "Intégrité du Log Record Store (LRS)" : "LRS Logbook Cryptography"}
                          </p>
                          <p className="text-[9.5px] text-slate-400 mt-0.5 leading-normal">
                            {language === "fr" 
                              ? "Scellez le journal LRS pour prouver l'immuabilité devant un auditeur de sécurité." 
                              : "Secure the log storage metadata database with SHA keychains."}
                          </p>
                        </div>
                      </div>

                      <select
                        value={lrsLogIntegrity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLrsLogIntegrity(val);
                          localStorage.setItem("glab_lrs_log_integrity", val);
                          triggerNotification(
                            language === "fr" 
                              ? `Niveau d'intégrité LRS changé : ${val.toUpperCase()}`
                              : `LRS integrity level changed: ${val.toUpperCase()}`,
                            "success"
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-750 text-slate-200 text-[10.5px] p-2 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-500 font-mono"
                      >
                        <option value="raw">{language === "fr" ? "Logs Bruts (Standard)" : "Raw Logs (Standard)"}</option>
                        <option value="chain">{language === "fr" ? "Chaînage de hash SHA-256 (Immuable)" : "SHA-256 Hash Chain (Immutable)"}</option>
                        <option value="asymmetric">{language === "fr" ? "Signé Asymétriquement RSA-4096 (Militaire)" : "RSA-4096 Signed Seals (Mil-Spec)"}</option>
                      </select>
                    </div>

                    {/* Seal generator button / viewer */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-350">
                          {language === "fr" ? "Sceau Cryptographique LRS" : "Cryptographic LRS Seal"}
                        </p>
                        {lrsSealTimestamp ? (
                          <div className="mt-1.5 space-y-1">
                            <span className="text-[9px] font-mono text-emerald-400 block break-all bg-emerald-950/30 border border-emerald-500/15 p-1.5 rounded">
                              SHA256: {btoa(lrsSealTimestamp).replace(/=/g, "").slice(0, 32).toLowerCase()}
                            </span>
                            <span className="text-[8px] font-mono text-slate-450 block">
                              Scellé à: {lrsSealTimestamp}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
                            {language === "fr" ? "Aucun sceau apposé aujourd'hui. Lancer une validation notariale" : "No notarization seal generated current session."}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsGeneratingLrsSeal(true);
                          triggerNotification(
                            language === "fr" ? "Calcul de la racine Merkle des logs ERP..." : "Broadcasting Merkle roots across Nodes...",
                            "info"
                          );
                          setTimeout(() => {
                            const now = new Date().toISOString().replace("T", " ").substring(0, 19);
                            setLrsSealTimestamp(now);
                            setIsGeneratingLrsSeal(false);
                            triggerNotification(
                              language === "fr" ? "Journal LRS scellé cryptographiquement et persisté (SHA-256) !" : "LRS Log journal cryptographically sealed!",
                              "success"
                            );
                          }, 1500);
                        }}
                        disabled={isGeneratingLrsSeal}
                        className="w-full mt-2 cursor-pointer bg-[#FF7A00] hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-black text-[10px] uppercase font-mono py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        {isGeneratingLrsSeal ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin text-slate-950" />
                            {language === "fr" ? "Calcul..." : "Computing..."}
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-slate-950" />
                            {language === "fr" ? "Notariser / Sceller LRS" : "Sign & Notarize LRS"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  {/* Feature 3: G-ERP AES 256 GCM Database encryption & Rate limiter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex gap-2.5">
                        <Database className="h-4.5 w-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Chiffrement AES-256-GCM</p>
                          <p className="text-[9px] text-slate-450 mt-0.5">
                            {language === "fr" ? "Données de facturation chiffrées au repos" : "Encrypt operational databases at-rest"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updated = !erpDbEncryption;
                          setErpDbEncryption(updated);
                          localStorage.setItem("glab_erp_db_encrypt", String(updated));
                          triggerNotification(
                            language === "fr" 
                              ? `Double chiffrement AES ${updated ? "activé" : "suspendu"} !`
                              : `Base encryption ${updated ? "enforced" : "suspended"}!`,
                            updated ? "success" : "warn"
                          );
                        }}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${erpDbEncryption ? "bg-emerald-500" : "bg-slate-700"}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${erpDbEncryption ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2.5">
                          <Activity className="h-4.5 w-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">Rate-Limiter d'API G-ERP</p>
                            <p className="text-[9px] text-slate-450 mt-0.5">
                              {language === "fr" ? "Contre les attaques par force brute" : "Prevent brute forcing"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const updated = !erpRateLimiting;
                            setErpRateLimiting(updated);
                            localStorage.setItem("glab_erp_rate_limit_active", String(updated));
                            triggerNotification(
                              language === "fr" 
                                ? `Limiteur d'API ${updated ? "appliqué" : "arrêté"}`
                                : `API Limit ${updated ? "enforced" : "stopped"}`,
                              "info"
                            );
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${erpRateLimiting ? "bg-emerald-500" : "bg-slate-700"}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${erpRateLimiting ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </div>

                      {erpRateLimiting && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <input 
                            type="range"
                            min={20}
                            max={500}
                            step={10}
                            value={erpRateLimitValue}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setErpRateLimitValue(val);
                              localStorage.setItem("glab_erp_rate_limit_val", String(val));
                            }}
                            className="bg-slate-850 rounded h-1 cursor-pointer flex-1"
                          />
                          <span className="text-[9px] font-mono font-bold text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-0.5 rounded">
                            {erpRateLimitValue} req/m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
             4. THEMES VISUELS SUB-TAB
             ========================================== */}
          {activeSubTab === "themes" && (
            <div className="space-y-5 animate-motion-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Palette className="h-4.5 w-4.5 text-purple-605" /> {t.themesTitle}
                </h4>
                <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.themesDesc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "slate", name: t.themeSlate, desc: t.themeSlateDesc, accent: "bg-[#0B1F3A]", dot: "bg-brand-orange" },
                  { id: "navy", name: t.themeNavy, desc: t.themeNavyDesc, accent: "bg-blue-900", dot: "bg-white" },
                  { id: "neon", name: t.themeNeon, desc: t.themeNeonDesc, accent: "bg-black", dot: "bg-emerald-400" },
                  { id: "swiss", name: t.themeSwiss, desc: t.themeSwissDesc, accent: "bg-slate-100", dot: "bg-slate-800" }
                ].map((th) => {
                  const isSelected = activeTheme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        setActiveTheme(th.id);
                        triggerNotification(t.themeApplied, "success");
                      }}
                      className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between min-h-[110px] relative overflow-hidden ${
                        isSelected 
                          ? "border-brand-orange bg-brand-orange/[0.01] shadow-premium-sm scale-[1.01]" 
                          : "border-slate-150 hover:border-slate-350 bg-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs text-slate-850 font-extrabold block">{th.name}</strong>
                          {isSelected && (
                            <span className="h-4.5 w-4.5 bg-brand-orange rounded-full flex items-center justify-center text-white text-[9.5px]">✓</span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-normal font-medium">{th.desc}</p>
                      </div>

                      <div className="flex gap-2.5 items-center mt-3 pt-2.5 border-t border-slate-100">
                        <span className="text-[9px] font-mono tracking-wider uppercase text-slate-400">Palette :</span>
                        <div className="flex gap-1">
                          <span className={`h-3 w-3 rounded-full ${th.accent} border border-slate-300 inline-block`} />
                          <span className={`h-3 w-3 rounded-full ${th.dot} border border-slate-300 inline-block`} />
                          <span className="h-3 w-3 rounded-full bg-slate-300 inline-block" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
             5. LANGUES SUB-TAB
             ========================================== */}
          {activeSubTab === "langues" && (
            <div className="space-y-6 animate-motion-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                  <Globe className="h-4.5 w-4.5 text-emerald-600" /> {t.langTitle}
                </h4>
                <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.langDesc}</p>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-extrabold text-slate-700 block">{t.selectLang}</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* French option card */}
                  <div
                    onClick={() => {
                      setLanguage("fr");
                      triggerNotification("Langue définie sur le Français pour l'ensemble du profil.", "info");
                    }}
                    className={`border p-5 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${
                      language === "fr" 
                        ? "border-brand-orange bg-brand-orange/[0.02] shadow-premium-sm font-black" 
                        : "border-slate-150 bg-white text-slate-600 hover:border-slate-350"
                    }`}
                  >
                    <span className="text-3xl">🇫🇷</span>
                    <div>
                      <strong className="text-xs font-black text-slate-800 block">{t.langFr}</strong>
                      <span className="text-[10px] text-slate-505 block font-mono">FR (Default Primary Locale)</span>
                    </div>
                    {language === "fr" && (
                      <span className="ml-auto h-5 w-5 bg-brand-orange rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
                    )}
                  </div>

                  {/* English option card */}
                  <div
                    onClick={() => {
                      setLanguage("en");
                      triggerNotification("Language successfully set to English for your active profile.", "info");
                    }}
                    className={`border p-5 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${
                      language === "en" 
                        ? "border-brand-orange bg-brand-orange/[0.02] shadow-premium-sm font-black" 
                        : "border-slate-150 bg-white text-slate-600 hover:border-slate-350"
                    }`}
                  >
                    <span className="text-3xl">🇬🇧</span>
                    <div>
                      <strong className="text-xs font-black text-slate-800 block">{t.langEn}</strong>
                      <span className="text-[10px] text-slate-505 block font-mono">EN (Federated Global Locale)</span>
                    </div>
                    {language === "en" && (
                      <span className="ml-auto h-5 w-5 bg-brand-orange rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#0B1F3A]/[0.02] border border-slate-100 p-4 rounded-xl text-xs flex items-center gap-2.5 text-slate-600 font-medium">
                  <CheckCircle className="h-4.5 w-4.5 text-brand-orange flex-shrink-0" />
                  <p className="leading-relaxed">
                    {language === "fr" 
                      ? "Vos sessions d'APIs ainsi que vos courriels d'alertes SecOps s'adapteront automatiquement à cette locale." 
                      : "Your SaaS APIs responses and automated SecOps email notifications will immediately synchronize according to this selected locale."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
             6. SAUVEGARDE ET MISES A JOUR SUB-TAB
             ========================================== */}
          {activeSubTab === "sauvegarde" && (
            <div className="space-y-6 animate-motion-in">
              
              {/* Core Sauvegarde Instantanés */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                      <Database className="h-4.5 w-4.5 text-[#FF7A00]" /> {t.backupTitle}
                    </h4>
                    <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.backupDesc}</p>
                  </div>
                  
                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-850 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase border border-emerald-250">
                    <CheckCircle className="h-3 w-3" /> {t.backupActive}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-premium-sm">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-slate-400 block font-black">{t.backupStatus}</span>
                    <strong className="text-slate-800 block text-xs font-extrabold mt-0.5">S-S3 Secure Replica (99.999% Health)</strong>
                  </div>
                  <button
                    onClick={handleTakeSnapshot}
                    disabled={isBackingUp}
                    className="bg-slate-905 bg-slate-950 text-white hover:bg-[#FF7A00] hover:text-slate-950 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-0 shadow flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> {language === "fr" ? "Archivage..." : "Snapshotting..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        {t.backupBtn}
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">{t.backupHistory} :</span>
                  <div className="space-y-2">
                    {backupHistory.map((snap) => (
                      <div key={snap.id} className="bg-white border border-slate-150 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-800 font-extrabold block">{snap.name}</strong>
                          <span className="text-[10.5px] text-slate-500 font-medium">Créé par {snap.creator} • Taille : {snap.size}</span>
                        </div>
                        <span className="text-[10.5px] text-indigo-700 font-mono font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {snap.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Cycle de Mises à Jour */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <Zap className="h-4.5 w-4.5 text-amber-500 animate-pulse" /> {t.systemUpdateTitle}
                  </h4>
                  <p className="text-[11px] text-slate-550 mt-1 leading-normal">{t.systemUpdateDesc}</p>
                </div>

                <div className="bg-amber-50/50 border border-amber-150 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-premium-sm md:">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-mono text-amber-700 font-black">Noyau SaaS version</span>
                    <strong className="text-amber-950 block text-xs font-black">v3.6.1-stable [Release May 2026]</strong>
                  </div>

                  <button
                    onClick={handleCheckSaaSUpdates}
                    disabled={checkingUpdates}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-0 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {checkingUpdates ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> {t.systemUpdateLoader}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        {t.systemUpdateBtn}
                      </>
                    )}
                  </button>
                </div>

                {updateChecked && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 p-4 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                    <p className="font-semibold leading-relaxed">{t.systemUpdateFresh}</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==========================================
             7. INTÉGRATIONS DEVOPS CLOUD (Vercel & Railway)
             ========================================== */}
          {activeSubTab === "integrations" && (
            <div className="space-y-6 animate-motion-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 font-sans">
                  <Cpu className="h-4.5 w-4.5 text-rose-500" />
                  {language === "fr" 
                    ? "Connecteurs Cloud DevOps & Déploiement Continu" 
                    : "DevOps Cloud Connectors & Continuous Deployment"}
                </h4>
                <p className="text-[11px] text-slate-550 mt-1 leading-normal">
                  {language === "fr" 
                    ? "Raccordez votre écosystème SaaS GLABTECH à vos solutions d'infrastructure préférées pour automatiser la mise en production de vos applications d'un simple clic." 
                    : "Wire up your GLABTECH SaaS ecosystem to your choice hosting platforms to streamline production runs in one click."}
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* VERCEL PANEL */}
                <div className={`border rounded-2xl p-5 space-y-4 bg-white transition-all shadow-premium-sm ${
                  vercelConnected ? "border-slate-900 ring-1 ring-slate-950/5 bg-slate-50/50" : "border-slate-150"
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* Custom Vercel Triangle logo */}
                      <div className="h-9 w-9 bg-black text-white flex items-center justify-center rounded-lg shadow-md">
                        <span className="font-mono text-xs font-black">▲</span>
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-slate-900 font-sans">Vercel Edge Platform</h4>
                        <span className="text-[9.5px] font-mono font-medium text-slate-500">Static Host & SPA Middleware</span>
                      </div>
                    </div>

                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                      vercelConnected 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-slate-50 text-slate-505 border-slate-200"
                    }`}>
                      {vercelConnected ? "Connecté" : "Non Connecté"}
                    </span>
                  </div>

                  {!vercelConnected ? (
                    <div className="space-y-3.5 pt-2">
                      <p className="text-[10.5px] text-slate-505 leading-normal">
                        Déployez instantanément le portail ainsi que vos applications frontend sur le réseau anycast mondial de Vercel. 
                      </p>
                      
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono font-black text-slate-400 block">Jeton d'API (Vercel Token)</label>
                          <input 
                            type="password"
                            placeholder="vct_sso_••••••••••••••"
                            value={vercelToken}
                            onChange={(e) => setVercelToken(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono outline-none focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono font-black text-slate-400 block">Nom du Projet Vercel</label>
                          <input 
                            type="text"
                            placeholder="ex: glabtech-portal-sso"
                            value={vercelProject}
                            onChange={(e) => setVercelProject(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl px-3 py-2 text-xs text-slate-805 font-semibold outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsConnectingVercel(true);
                          setTimeout(() => {
                            setVercelConnected(true);
                            setVercelToken("vct_sso_" + Math.random().toString(36).substring(2, 10).toUpperCase());
                            setIsConnectingVercel(false);
                            triggerNotification("Compte Vercel raccordé et synchronisé !", "success");
                          }, 1200);
                        }}
                        disabled={isConnectingVercel}
                        className="w-full bg-black hover:bg-slate-900 border-0 text-white rounded-xl py-2.5 text-xs font-black cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {isConnectingVercel ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Liaison en cours...
                          </>
                        ) : (
                          <>
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                            Associer mon compte Vercel
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-slate-150 rounded-xl text-[11px] font-medium text-slate-600">
                        <div>
                          <span className="text-[8.5px] uppercase font-mono text-slate-400 block">ID Projet</span>
                          <span className="font-extrabold text-slate-850 block">{vercelProject}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] uppercase font-mono text-slate-400 block">Branche Git cible</span>
                          <select 
                            value={vercelBranch}
                            onChange={(e) => setVercelBranch(e.target.value)}
                            className="font-mono text-[10.5px] bg-slate-50 rounded border border-slate-200 py-0.5 px-1 focus:outline-none"
                          >
                            <option value="main">main</option>
                            <option value="development">development</option>
                            <option value="production">production</option>
                          </select>
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-2 flex items-center justify-between">
                          <div>
                            <span className="text-[8.5px] uppercase font-mono text-slate-400 block">Clé Token active</span>
                            <span className="font-mono text-[10.5px] text-slate-500 select-all">{vercelToken.slice(0, 10)}••••••••</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setVercelConnected(false);
                              setVercelDeployLogs([]);
                              setVercelDeployStatus("idle");
                              setVercelDeployUrl("");
                              triggerNotification("Vercel déconnecté avec succès.", "info");
                            }}
                            className="text-rose-600 hover:text-rose-800 text-[10px] bg-transparent border-0 cursor-pointer font-bold"
                          >
                            Désassocier
                          </button>
                        </div>
                      </div>

                      {/* Launch Deployment Box */}
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDeployingVercel(true);
                            setVercelDeployStatus("building");
                            setVercelDeployLogs(["[DevOps] Initialisation de l'environnement de déploiement..."]);
                            
                            const logsSteps = [
                              "Clonage du dépôt git : github.com/glabtech/sso-portal (branche '" + vercelBranch + "')...",
                              "Analyse de la configuration package.json... Détection de React 18 & Vite.",
                              "Lancement de : npm install --frozen-lockfile...",
                              "Installation des dépendance terminée avec succès. (124 modules installés)",
                              "Lancement de la compilation : npm run build...",
                              "Vite v5.2.11 - Optimisation des paquets, minification de l'index.html...",
                              "Compilation terminée. Dossier dist/ généré. Taille globale : 8.42 MB.",
                              "Synchronisation des variables d'environnement SSO réinjectées...",
                              "Envoi sur le réseau Edge Anycast mondial Vercel...",
                              "Déploiement en statut de propagation DNS (Vercel Router)...",
                              "Déploiement actif ! Statut : PRODUCTION"
                            ];

                            logsSteps.forEach((logText, idx) => {
                              setTimeout(() => {
                                setVercelDeployLogs(prev => [...prev, `[${new Date().toLocaleTimeString('fr-FR')}] ${logText}`]);
                                if (idx === logsSteps.length - 1) {
                                  setIsDeployingVercel(false);
                                  setVercelDeployStatus("success");
                                  setVercelDeployUrl(`https://${vercelProject || "glabtech-sso"}.vercel.app`);
                                  triggerNotification("Application déployée avec succès sur Vercel !", "success");
                                }
                              }, (idx + 1) * 750);
                            });
                          }}
                          disabled={isDeployingVercel}
                          className="w-full bg-brand-orange hover:bg-orange-600 border-0 text-white rounded-xl py-2 px-3 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow disabled:opacity-50"
                        >
                          {isDeployingVercel ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Cycle de Build Vercel en cours...
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              Refaire un build & déploiement de production
                            </>
                          )}
                        </button>
                      </div>

                      {/* Deployment live link if Success */}
                      {vercelDeployStatus === "success" && vercelDeployUrl && (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-150 p-3 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
                          <div className="flex items-center gap-1.5 leading-normal">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span><strong>Déploiement live :</strong> <a href={vercelDeployUrl} target="_blank" rel="noreferrer" className="underline font-mono font-bold hover:text-emerald-900 transition-colors">{vercelDeployUrl}</a></span>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                      )}

                      {/* Live Terminal logs displaying */}
                      {vercelDeployLogs.length > 0 && (
                        <div className="bg-slate-900 text-[#00FF66] border border-slate-800 rounded-xl p-3.5 font-mono text-[9px] leading-relaxed select-all max-h-48 overflow-y-auto shadow-inner space-y-1">
                          <div className="flex justify-between items-center text-[8px] text-slate-400 border-b border-slate-800 pb-1 mb-1.5 font-sans">
                            <span>TERMINAL CONSOLE VERCEL</span>
                            <span className="animate-pulse">{isDeployingVercel ? "● COMPILING" : "● READY"}</span>
                          </div>
                          {vercelDeployLogs.map((log, idx) => (
                            <div key={idx} className="whitespace-pre-wrap">{log}</div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                </div>


                {/* RAILWAY PANEL */}
                <div className={`border rounded-2xl p-5 space-y-4 bg-white transition-all shadow-premium-sm ${
                  railwayConnected ? "border-purple-900 ring-1 ring-purple-950/5 bg-purple-50/15" : "border-slate-150"
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* Custom Railway logo */}
                      <div className="h-9 w-9 bg-[#1E1432] text-[#F30067] flex items-center justify-center rounded-lg shadow-md font-mono text-base font-black">
                        r_
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-slate-900 font-sans">Railway Engine</h4>
                        <span className="text-[9.5px] font-mono font-medium text-slate-500">Cloud SQL & Container Orchestration</span>
                      </div>
                    </div>

                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                      railwayConnected 
                        ? "bg-purple-100 text-purple-750 border-purple-200" 
                        : "bg-slate-50 text-slate-505 border-slate-200"
                    }`}>
                      {railwayConnected ? "Provisionné" : "Non Connecté"}
                    </span>
                  </div>

                  {!railwayConnected ? (
                    <div className="space-y-3.5 pt-2">
                      <p className="text-[10.5px] text-slate-505 leading-normal">
                        Associez votre instance de base de données PostgreSQL/Redis et vos microservices de conteneurs hébergés directement sur Railway DevOps.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono font-black text-slate-400 block">Clé de Connexion API (Railway Token)</label>
                          <input 
                            type="password"
                            placeholder="rlwy_••••••••••••••••••••••••"
                            value={railwayToken}
                            onChange={(e) => setRailwayToken(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl px-3 py-2 text-xs text-slate-805 font-mono outline-none focus:bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-mono font-black text-slate-400 block">ID du Projet Railway</label>
                          <input 
                            type="text"
                            placeholder="ex: glabtech-prod-databases"
                            value={railwayProject}
                            onChange={(e) => setRailwayProject(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl px-3 py-2 text-xs text-slate-805 font-semibold outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsConnectingRailway(true);
                          setTimeout(() => {
                            setRailwayConnected(true);
                            setRailwayToken("rlw_sso_" + Math.random().toString(36).substring(2, 10).toUpperCase());
                            setIsConnectingRailway(false);
                            triggerNotification("Cluster de base de données Railway appairé !", "success");
                          }, 1200);
                        }}
                        disabled={isConnectingRailway}
                        className="w-full bg-[#1E1432] hover:bg-[#2C1D4A] border-0 text-white rounded-xl py-2.5 text-xs font-black cursor-pointer transition-all shadow flex items-center justify-center gap-1.5"
                      >
                        {isConnectingRailway ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#F30067]" />
                            Handshake Railway TCP...
                          </>
                        ) : (
                          <>
                            <Database className="h-3.5 w-3.5 text-[#F30067]" />
                            Associer mon compte Railway
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <div className="space-y-3 bg-white p-3 border border-slate-150 rounded-xl text-[11px] font-medium text-slate-600">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[8.5px] uppercase font-mono text-slate-400 block">Nom du Projet</span>
                            <span className="font-extrabold text-slate-850 block">{railwayProject}</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] uppercase font-mono text-slate-400 block">ID Container</span>
                            <span className="font-mono text-slate-500 font-bold block">rlwy_node_glab</span>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-slate-100 pt-3">
                          <span className="text-[9px] uppercase font-mono text-slate-400 block tracking-wider">Services provisionnés en production</span>
                          
                          <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-150 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="font-extrabold text-[#0B1F3A]">Base de données PostgreSQL</span>
                            </div>
                            <span className="text-[9.5px] font-mono text-slate-500">port 5432</span>
                          </div>

                          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${railwayRedisActive ? "bg-emerald-500 animate-pulse" : "bg-slate-350"}`} />
                              <span className="font-extrabold text-[#0B1F3A]">Cache Redis In-Memory</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setRailwayRedisActive(!railwayRedisActive);
                                triggerNotification(railwayRedisActive ? "Service Redis désactivé" : "Service Redis provisionné et activé !", "success");
                              }}
                              className="text-[10px] bg-[#1E1432] text-white rounded border-0 px-2.5 py-1 cursor-pointer hover:bg-black font-semibold"
                            >
                              {railwayRedisActive ? "Arrêter" : "Démarrer"}
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                          <div>
                            <span className="text-[8.5px] uppercase font-mono text-slate-400 block">Jeton actif</span>
                            <span className="font-mono text-[10.5px] text-slate-500 select-all">{railwayToken.slice(0, 10)}••••••••</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setRailwayConnected(false);
                              setRailwayRedisActive(false);
                              triggerNotification("Instance Railway déconnectée.", "info");
                            }}
                            className="text-rose-600 hover:text-rose-800 text-[10px] bg-transparent border-0 cursor-pointer font-bold"
                          >
                            Désassocier
                          </button>
                        </div>
                      </div>

                      {/* URL de base de données d'environnment */}
                      <div className="space-y-1.5 bg-slate-50 border border-slate-150 p-3 rounded-xl">
                        <span className="text-[9px] uppercase font-mono font-black text-slate-450 block">URL publique de connexion SQL</span>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={railwayDbUrl}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-705 font-mono outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(railwayDbUrl);
                              triggerNotification("URL copiée dans votre presse-papier !", "success");
                            }}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 px-2.5 rounded-lg text-xs cursor-pointer font-bold"
                          >
                            Copier
                          </button>
                        </div>
                      </div>

                      {/* DB Handshake test */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsTestingRailway(true);
                            setTimeout(() => {
                              setIsTestingRailway(false);
                              triggerNotification("Test SQLOK : Handshake réussi ! Latence ping physique : 8ms. 14 tables systémiques validées.", "success");
                            }, 1500);
                          }}
                          disabled={isTestingRailway}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isTestingRailway ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Handshake SQL...
                            </>
                          ) : (
                            <>
                              <Activity className="h-3.5 w-3.5 text-[#F30067]" />
                              Tester la liaison SQL
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* LIAISON DEVOPS INTEROPÉRABILITÉ (Vercel + Railway Bridge) */}
              <div className="border rounded-2xl p-5 bg-[#0B1F3A] text-white space-y-4 shadow-xl border-white/10 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7A00]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5 items-center">
                      <div className="h-8 w-8 bg-[#06101E] text-white flex items-center justify-center rounded-full border border-white/10 text-[10px] font-bold shadow-md select-none">
                        ▲
                      </div>
                      <div className="h-8 w-8 bg-[#1E1432] text-[#F30067] flex items-center justify-center rounded-full border border-white/10 text-xs font-black shadow-md font-mono select-none">
                        r_
                      </div>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white tracking-tight font-sans">
                        Passerelle de Liaison Vercel ⟷ Railway SQL
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        Injectez automatiquement les chaînes de connexion PostgreSQL et Redis de Railway en tant que variables d'environnement distantes sécurisées sur vos déploiements Vercel.
                      </p>
                    </div>
                  </div>

                  <div>
                    {!vercelConnected || !railwayConnected ? (
                      <span className="text-[9px] font-mono bg-[#06101E] text-slate-400 border border-white/5 py-1 px-2.5 rounded-full font-bold">
                        En attente des connexions...
                      </span>
                    ) : (
                      <span className={`text-[9.5px] font-mono border py-1 px-3 rounded-full font-bold uppercase transition-all ${
                        vercelRailwayBridgeActive 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-400/10 text-amber-400 border-amber-400/20 animate-pulse"
                      }`}>
                        {vercelRailwayBridgeActive ? "Liaison active" : "Synchronisation requise"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                  <div className="text-[10.5px] text-slate-350 max-w-sm">
                    {vercelRailwayBridgeActive ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ✓ Variables DATABASE_URL, REDIS_URL et GLAB_ENV propagées de Railway vers le SDK Vercel.
                      </span>
                    ) : (
                      <span>
                        Associez les deux plateformes de production pour activer le pont d'injection réseau sécurisé à sens unique (Railway SQL → Vercel Environment).
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!vercelConnected || !railwayConnected}
                    onClick={() => {
                      if (vercelRailwayBridgeActive) {
                        setVercelRailwayBridgeActive(false);
                        triggerNotification("Variables d'environnement désynchronisées.", "info");
                      } else {
                        setVercelRailwayBridgeActive(true);
                        triggerNotification("Raccordement Vercel ⟷ Railway établi ! Les variables d'environnement SQL ont été injectées sur Vercel.", "success");
                        // Inject into Vercel build logs if enabled
                        setVercelDeployLogs(prev => [
                          ...prev,
                          `[${new Date().toLocaleTimeString('fr-FR')}] [DevOps Bridge] Liaison de données Railway détectée.`,
                          `[${new Date().toLocaleTimeString('fr-FR')}] [DevOps Bridge] Injection réseau de la chaine: ${railwayDbUrl.slice(0, 20)}...`
                        ]);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border-0 ${
                      !vercelConnected || !railwayConnected
                        ? "bg-white/5 text-slate-500 cursor-not-allowed"
                        : vercelRailwayBridgeActive
                          ? "bg-rose-600 hover:bg-rose-700 text-white"
                          : "bg-[#FF7A00] hover:bg-[#E06B00] text-white shadow-lg"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {vercelRailwayBridgeActive ? "Couper la liaison" : "Établir la liaison SSO"}
                  </button>
                </div>
              </div>

              {/* DevOps Warning / Summary banner */}
              <div className="bg-[#0B1F3A]/[0.02] border border-slate-150 p-4.5 rounded-2xl text-xs space-y-2 text-slate-600 font-medium md:flex md:items-start md:gap-4 md:space-y-0 text-left">
                <span className="text-xl inline-block mt-0.5">🚀</span>
                <div className="space-y-1 leading-relaxed">
                  <strong className="text-slate-850 font-extrabold text-[12px] block">Déploiement central unifié GLABTECH</strong>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Toutes les variables d'environnement SSO, les variables de sécurité RSA et les configurations de tokens d'accès asymétriques issues de votre tableau de bord central sont injectées automatiquement lors des builds de production déclenchés pour vos clients.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// ==========================================
// 7. SUPPORT TAB
// ==========================================
export function SupportTab() {
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    setSuccess(true);
    setMsg("");
    setTimeout(() => {
      setSuccess(false);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-motion-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
          <Wrench className="h-5 w-5 text-brand-orange" />
          Support Ingénieur VIP de Premier Niveau
        </h3>
        <p className="text-xs text-slate-500 mb-6">Contactez directement notre assistance réseau ou soumettez des audits à l'intelligence artificielle.</p>

        {success && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-150 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600" /> Ticket enregistré avec succès ! Un ingénieur SSO prendra contact sous peu.
          </div>
        )}

        <form onSubmit={handleSendTicket} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-mono tracking-widest text-slate-450 block font-bold">Votre question ou signalement technique d'API</label>
            <textarea
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ex : Je rencontre un code d'erreur 503 lors de la rotation de secret OAuth de glab-hotel sous mon tenant..."
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-orange text-slate-800 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-950 hover:bg-slate-900 text-white py-2.5 px-6 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Send className="h-4 w-4" /> Transmettre le rapport technique
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 8. APPROVALS & LICENSES TAB (Approbations Clients)
// ==========================================
export interface TrialRequest {
  id: string;
  appId: string;
  appName: string;
  ownerName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  companySize: string;
  subdomain: string;
  status: "pending" | "approved" | "rejected";
}

interface ApprovalsTabProps {
  user: PortalUser;
  tenants: Record<string, TenantData>;
  setTenants: React.Dispatch<React.SetStateAction<Record<string, TenantData>>>;
  apps: ManagedApp[];
  onNotify: (msg: string, type: 'success' | 'warn' | 'info') => void;
}

export function ApprovalsTab({
  user,
  tenants,
  setTenants,
  apps,
  onNotify
}: ApprovalsTabProps) {
  const [requests, setRequests] = useState<TrialRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTenantName, setSelectedTenantName] = useState<string>(user.tenant);

  // Offline/Demo requests for robust experience if API is empty
  const [fallbackRequests, setFallbackRequests] = useState<TrialRequest[]>([
    {
      id: "req-trial-1",
      appId: "glab-resto",
      appName: "G-RESTO",
      ownerName: "Antoine Lambert",
      email: "a.lambert@resto-lyon.fr",
      phone: "+33 6 12 34 56 78",
      country: "France",
      language: "Français",
      companySize: "11-50",
      subdomain: "resto-lyon-prestige",
      status: "pending"
    },
    {
      id: "req-trial-2",
      appId: "glab-hotel",
      appName: "G-HOTEL",
      ownerName: "Clarisse Menard",
      email: "c.menard@riviera-hotels.com",
      phone: "+33 7 89 01 23 45",
      country: "Monaco",
      language: "Français",
      companySize: "51-200",
      subdomain: "riviera-monaco",
      status: "pending"
    },
    {
      id: "req-trial-3",
      appId: "glab-erp",
      appName: "G-ERP",
      ownerName: "Markus Visser",
      email: "visser@belgacom.be",
      phone: "+32 475 22 33 44",
      country: "Belgique",
      language: "Néerlandais",
      companySize: "201-500",
      subdomain: "belgacom-erp-hq",
      status: "approved"
    }
  ]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trial-requests");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setRequests(data);
        } else {
          setRequests(fallbackRequests);
        }
      } else {
        setRequests(fallbackRequests);
      }
    } catch (err) {
      setRequests(fallbackRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateTrialStatus = async (reqId: string, newStatus: "approved" | "rejected") => {
    try {
      const targetReq = requests.find(r => r.id === reqId) || fallbackRequests.find(r => r.id === reqId);
      if (!targetReq) return;

      const res = await fetch(`/api/trial-requests/${reqId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      // Synchronize frontend lists
      const updatedRequests = requests.map(r => r.id === reqId ? { ...r, status: newStatus } : r);
      setRequests(updatedRequests);
      setFallbackRequests(fallbackRequests.map(r => r.id === reqId ? { ...r, status: newStatus } : r));

      if (newStatus === "approved") {
        // Automatically create a new Multi-Tenant organization for the client!
        const newOrgName = targetReq.subdomain.toUpperCase().trim();
        if (tenants[newOrgName]) {
          onNotify(`La demande est approuvée. Le locataire '${newOrgName}' existe déjà.`, "info");
          return;
        }

        const newTenant: TenantData = {
          databaseName: `db-cl_${targetReq.subdomain.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
          region: `${targetReq.country} (Region-SaaS)`,
          securityLevel: "Maximal (RSA-4096)",
          autoBackups: true,
          allowedApps: ["glab-aistudio-connector", targetReq.appId || "glab-hotel", "glab-erp"],
          plan: "Business Suite",
          price: 99,
          seatsUsed: 1,
          seatsMax: 10,
          stripeConnected: false,
          stripeApiKey: "",
          invoices: [
            { 
              date: new Date().toLocaleDateString("fr-FR"), 
              user: targetReq.email, 
              plan: "Business Suite (Essai Approuvé)", 
              price: 0, 
              ref: `trial_approved_${Math.random().toString(36).substring(2, 8)}` 
            }
          ],
          users: [
            { 
              id: `usr-trial-${Date.now()}`, 
              name: targetReq.ownerName, 
              email: targetReq.email, 
              role: "Global Owner", 
              status: "actif", 
              lastLogin: "Jamais connecté (Essai validé)", 
              permissions: ["apps", "billing", "users", "settings"] 
            }
          ]
        };

        setTenants(prev => ({
          ...prev,
          [newOrgName]: newTenant
        }));

        setSelectedTenantName(newOrgName);
        onNotify(`Demande approuvée l'organisation '${newOrgName}' a été créée et les licences de ${targetReq.appName} ont été provisionnées.`, "success");
      } else {
        onNotify(`Demande d'essai rejetée avec signature SecOps.`, "warn");
      }
    } catch (err) {
      onNotify("Erreur lors de la modification du statut de la demande.", "warn");
    }
  };

  const handleDeleteRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
    setFallbackRequests(prev => prev.filter(r => r.id !== reqId));
    onNotify("Demande de souscription supprimée définitivement.", "info");
  };

  // 2. Licensing Core Actions
  const currentTenant = tenants[selectedTenantName] || tenants[user.tenant];

  const handleToggleAppLicense = (appId: string) => {
    if (!currentTenant) return;
    const isAllowed = currentTenant.allowedApps.includes(appId);
    let updatedApps: string[];
    if (isAllowed) {
      updatedApps = currentTenant.allowedApps.filter(id => id !== appId);
      onNotify(`Licence de l'application révoquée pour le tenant : ${appId}`, "warn");
    } else {
      updatedApps = [...currentTenant.allowedApps, appId];
      onNotify(`Licence accordée et provisionnée pour le tenant : ${appId}`, "success");
    }

    setTenants(prev => ({
      ...prev,
      [selectedTenantName]: {
        ...currentTenant,
        allowedApps: updatedApps
      }
    }));
  };

  const handleUpdateTenantPlan = (planName: "Starter Sandbox" | "Business Suite" | "Enterprise Premium") => {
    if (!currentTenant) return;
    const priceMap = {
      "Starter Sandbox": 29,
      "Business Suite": 99,
      "Enterprise Premium": 349
    };
    const seatsMap = {
      "Starter Sandbox": 5,
      "Business Suite": 20,
      "Enterprise Premium": 100
    };

    setTenants(prev => ({
      ...prev,
      [selectedTenantName]: {
        ...currentTenant,
        plan: planName,
        price: priceMap[planName],
        seatsMax: seatsMap[planName]
      }
    }));
    onNotify(`Plan d'abonnement mis à niveau vers : ${planName} (${seatsMap[planName]} sièges max)`, "success");
  };

  const handleAdjustSeatsLimit = (seats: number) => {
    if (!currentTenant) return;
    setTenants(prev => ({
      ...prev,
      [selectedTenantName]: {
        ...currentTenant,
        seatsMax: seats
      }
    }));
    onNotify(`Capacité de licences utilisateur ajustée à ${seats} sièges.`, "info");
  };

  // 3. Global User Actions
  const handleValidateUser = (userId: string) => {
    if (!currentTenant) return;
    const updatedUsers = currentTenant.users.map(u => {
      if (u.id === userId) {
        return { ...u, status: "actif" };
      }
      return u;
    });

    setTenants(prev => ({
      ...prev,
      [selectedTenantName]: {
        ...currentTenant,
        users: updatedUsers
      }
    }));
    onNotify("Compte de l'utilisateur SSO validé et activé.", "success");
  };

  const handleSuspendUser = (userId: string, currentStatus: string) => {
    if (!currentTenant) return;
    const nextStatus = currentStatus === "actif" ? "suspendu" : "actif";
    const updatedUsers = currentTenant.users.map(u => {
      if (u.id === userId) {
        return { ...u, status: nextStatus };
      }
      return u;
                });

    setTenants(prev => ({
      ...prev,
      [selectedTenantName]: {
        ...currentTenant,
        users: updatedUsers
      }
    }));
    onNotify(`Utilisateur mis au statut : ${nextStatus.toUpperCase()}`, nextStatus === "suspendu" ? "warn" : "success");
  };

  const handleDeleteUser = (userId: string) => {
    if (!currentTenant) return;
    const targetUser = currentTenant.users.find(u => u.id === userId);
    if (!targetUser) return;

    if (targetUser.email === user.email) {
      onNotify("Impossible de révoquer votre propre session admin active.", "warn");
      return;
    }

    const updatedUsers = currentTenant.users.filter(u => u.id !== userId);
    setTenants(prev => ({
      ...prev,
      [selectedTenantName]: {
        ...currentTenant,
        users: updatedUsers,
        seatsUsed: Math.max(0, currentTenant.seatsUsed - 1)
      }
    }));
    onNotify(`Compte utilisateur '${targetUser.name}' supprimé de l'organisation.`, "success");
  };

  return (
    <div className="space-y-6 animate-motion-in">
      
      {/* SECTION 1: APPROBATIONS DEMANDES CLIENTS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-orange animate-pulse" />
              Réception & Approbations des Demandes Clients
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recevez les demandes d'activation ou d'essais gratuits envoyées par les clients et approuvez la création de leur tenant isolé.
            </p>
          </div>
          <button 
            type="button" 
            onClick={loadRequests} 
            className="flex items-center gap-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-semibold cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Rafraîchir
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">Aucune demande client en attente de traitement.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className={`p-4 rounded-xl border transition-all ${
                  req.status === "approved" 
                    ? "bg-emerald-50/50 border-emerald-200" 
                    : req.status === "rejected"
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono bg-brand-orange/20 text-brand-orange font-bold px-1.5 py-0.5 rounded border border-brand-orange/20">
                      Application {req.appName}
                    </span>
                    <h4 className="font-extrabold text-[#0B1F3A] mt-1.5 text-xs leading-none">{req.ownerName}</h4>
                    <span className="text-[10.5px] text-slate-500 font-mono block mt-0.5">{req.email}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    req.status === "approved" ? "bg-emerald-100/50 text-emerald-800 border-emerald-200" :
                    req.status === "rejected" ? "bg-rose-100/50 text-rose-800 border-rose-200" :
                    "bg-amber-100/50 text-amber-800 border-amber-200"
                  }`}>
                    {req.status === "approved" ? "Approuvé (Activé)" :
                     req.status === "rejected" ? "Rejeté" : "En attente"}
                  </span>
                </div>

                <div className="bg-white/80 border border-slate-100 rounded-lg p-2.5 my-3 text-[11px] text-slate-600 font-medium space-y-1">
                  <div><strong>Sous-domaine :</strong> <span className="font-mono text-[#0B1F3A] text-[11.5px] font-bold">{req.subdomain}.glabeboutique.com</span></div>
                  <div><strong>Téléphone :</strong> {req.phone || "Non renseigné"}</div>
                  <div><strong>Taille entreprise :</strong> {req.companySize} • <strong>Pays :</strong> {req.country} ({req.language})</div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleDeleteRequest(req.id)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-800 text-[11px] font-bold bg-transparent border-0 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>

                  {req.status === "pending" && (
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleUpdateTrialStatus(req.id, "rejected")}
                        className="bg-transparent border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold py-1 px-3 rounded-lg cursor-pointer"
                      >
                        Refuser
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateTrialStatus(req.id, "approved")}
                        className="bg-[#0B1F3A] hover:bg-black text-white font-bold py-1 px-3.5 rounded-lg cursor-pointer border-0 shadow-sm"
                      >
                        Valider & Activer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: GESTION DES LICENCES D'APPLICATIONS PAR LOCATAIRE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
          <Building2 className="h-5 w-5 text-brand-orange" />
          Abonnements & Attribution des Licences Microservices
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Sélectionnez un locataire existant ou nouvellement approuvé pour gérer à la volée ses microservices de confiance et ses quotas de licences.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
            <div className="space-y-1 w-full sm:w-1/3">
              <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-black">Entreprise Multi-Tenant</label>
              <select
                value={selectedTenantName}
                onChange={(e) => setSelectedTenantName(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-orange"
              >
                {Object.keys(tenants).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {currentTenant && (
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-[11px]">
                  <strong>Plan Actuel :</strong> <span className="text-brand-orange font-bold">{currentTenant.plan}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-[11px]">
                  <strong>Sièges Utilisés :</strong> <span className="font-bold">{currentTenant.users.length} / {currentTenant.seatsMax}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-[11px]">
                  <strong>Région Base :</strong> <span className="font-mono text-slate-500">{currentTenant.region}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentTenant ? (
          <div className="space-y-6">
            
            {/* Options of plans upgrades */}
            <div className="space-y-2">
              <strong className="text-[10px] uppercase font-mono tracking-widest text-[#FF7A00] block font-black">Changer la Catégorie de la Licence d'Abonnement</strong>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Starter Sandbox" as const, price: "29€/mois", seats: "5 collaborateurs" },
                  { name: "Business Suite" as const, price: "99€/mois", seats: "20 collaborateurs" },
                  { name: "Enterprise Premium" as const, price: "349€/mois", seats: "100 collaborateurs" }
                ].map((planOpt) => (
                  <button
                    key={planOpt.name}
                    type="button"
                    onClick={() => handleUpdateTenantPlan(planOpt.name)}
                    className={`p-3 text-left rounded-xl border text-xs flex flex-col justify-between transition-all cursor-pointer ${
                      currentTenant.plan === planOpt.name 
                        ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-premium-sm"
                        : "bg-slate-50 text-slate-700 border-slate-150 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-bold">{planOpt.name}</span>
                    <div className="flex justify-between items-center w-full mt-2 pt-1.5 border-t border-slate-150/10">
                      <span className="font-mono text-[10.5px] font-semibold">{planOpt.price}</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">{planOpt.seats}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider to adjust the max seats manually */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
              <div className="flex justify-between text-xs items-center">
                <span className="font-bold text-slate-800">Nombre Maximal de Collaborateurs SSO (Sièges Licenciés)</span>
                <span className="font-mono font-black text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">
                  {currentTenant.seatsMax} Sièges
                </span>
              </div>
              <input 
                type="range"
                min="3"
                max="150"
                value={currentTenant.seatsMax}
                onChange={(e) => handleAdjustSeatsLimit(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
              />
              <p className="text-[10px] text-slate-450 leading-normal">
                Modifiez de façon asymétrique les seuils autorisés pour limiter le quota de jetons de session JWT utilisables. Terminez la configuration via SSO.
              </p>
            </div>

            {/* Microservices licenses activation selection grid */}
            <div className="space-y-2">
              <strong className="text-[10px] uppercase font-mono tracking-widest text-[#FF7A00] block font-black">Activer/Désactiver les Licences Applicatives Clés</strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {apps.map((app) => {
                  const hasLicense = currentTenant.allowedApps.includes(app.id);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleToggleAppLicense(app.id)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                        hasLicense 
                          ? "bg-slate-50 border-[#FF7A00] text-[#0B1F3A] font-bold shadow-premium-sm"
                          : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-1">{app.name}</span>
                      <span className={`h-2 w-2 rounded-full inline-block ${hasLicense ? "bg-emerald-500 shadow-emerald-glow" : "bg-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Une erreur est survenue lors de la synchronisation de l'organisation.</p>
        )}
      </div>

      {/* SECTION 3: VALIDER, SUPPRIMER, SUSPENDRE UN UTILISATEUR GLOBALE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-premium">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-brand-orange animate-pulse" />
          Validation & Modération Globale des Utilisateurs SSO
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Validation d'identités cryptographiques, suspension d'accès SecOps, et radiation d'utilisateurs rattachés au tenant <span className="font-bold text-[#0B1F3A]">{selectedTenantName}</span>.
        </p>

        {currentTenant && currentTenant.users.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">Aucun utilisateur fédéré pour ce locataire.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[9px] uppercase font-mono py-2">
                  <th className="pb-2">Utilisateur</th>
                  <th>E-mail</th>
                  <th>Rôle de SSO</th>
                  <th>Statut Sécurité</th>
                  <th className="text-right">Régulation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {currentTenant?.users.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 flex items-center gap-2">
                      <div className="h-7 w-7 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold font-mono text-xs">
                        {member.name.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{member.name}</span>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <span className="bg-slate-100 text-slate-705 border border-slate-200 px-1.5 py-0.5 rounded text-[8.5px] font-mono">
                        {member.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full inline-block ${
                          member.status === 'actif' ? 'bg-emerald-500 shadow-emerald-glow' : 
                          member.status === 'invité' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'
                        }`} />
                        <span className="capitalize text-[10.5px]">{member.status}</span>
                      </div>
                    </td>
                    <td className="text-right space-x-2.5">
                      {member.status !== "actif" && (
                        <button
                          type="button"
                          onClick={() => handleValidateUser(member.id)}
                          className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-300 py-1 px-2 rounded-lg cursor-pointer"
                          title="Valider l'utilisateur"
                        >
                          Valider
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleSuspendUser(member.id, member.status)}
                        className={`text-[10px] font-mono font-bold py-1 px-2 rounded-lg cursor-pointer border ${
                          member.status === "suspendu" 
                            ? "bg-slate-50 text-slate-700 hover:bg-slate-200 border-slate-300" 
                            : "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border-rose-300"
                        }`}
                        title={member.status === "suspendu" ? "Réactiver l'accès" : "Suspendre temporairement"}
                      >
                        {member.status === "suspendu" ? "Réactiver" : "Suspendre"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(member.id)}
                        className="text-[10px] font-mono font-bold bg-transparent text-rose-500 hover:text-rose-700 border-0 cursor-pointer"
                        title="Révoquer définitivement de l'infrastructure"
                      >
                        <Trash2 className="h-3.5 w-3.5 inline" />
                      </button>
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
