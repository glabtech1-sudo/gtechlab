import { getPrismaClient } from "../lib/db";

// ========================================================
// TYPE DEFINITIONS REPLICATING THE PRISMA DATABASE RULES
// ========================================================
export interface DbOrganization {
  id: string;
  name: string;
  databaseName: string;
  region: string;
  securityLevel: string;
  autoBackups: boolean;
  createdAt: string;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  status: string;
  mfaEnabled: boolean;
  lastLogin: string;
  organizationId: string;
  permissions: string[]; // Maps granularly to Permissions
  createdAt: string;
}

export interface DbSubscription {
  id: string;
  plan: string;
  price: number;
  seatsMax: number;
  seatsUsed: number;
  status: string;
  startDate: string;
  endDate: string | null;
  organizationId: string;
}

export interface DbApplication {
  id: string;
  name: string;
  description: string;
  category: "HRM" | "Finance" | "CRM" | "Inventory" | "Custom";
  url: string;
  status: "online" | "performance_issue" | "warning" | "offline";
  version: string;
  icon: string;
  ping: number;
  activeUsers: number;
  apiRequestsToday: number;
  ssoConnected: boolean;
  ssoClientId: string;
  ssoClientSecret: string;
  recordsCount: number;
  createdAt: string;
}

export interface DbNotification {
  id: string;
  type: "security" | "warn" | "info";
  text: string;
  isRead: boolean;
  createdAt: string;
  organizationId: string | null;
  userId: string | null;
}

export interface DbInvoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  plan: string;
  reference: string;
  organizationId: string;
  userId: string | null;
}

export interface DbActivityLog {
  id: string;
  timestamp: string;
  event: string;
  ip: string;
  status: "success" | "warning" | "failed";
  details: string;
  userId: string | null;
  organizationId: string;
  applicationId: string | null;
}

export interface DbApiKey {
  id: string;
  hash: string;
  prefix: string;
  label: string;
  scopes: string; // e.g., "read,write"
  active: boolean;
  expiresAt: string | null;
  organizationId: string;
  userId: string | null;
  createdAt: string;
}

export interface DbSettings {
  id: string;
  mfaEnforced: boolean;
  jwtExpiration: number; // in seconds
  ssoDomainRestriction: string | null;
  allowGuestAccess: boolean;
  organizationId: string;
}

export interface DbTrialRequest {
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
  createdAt: string;
}

// ========================================================
// STATEFUL TRANSACTIONAL IN-MEMORY FALLBACK DATABASE
// ========================================================
class MemoryDatabase {
  trialRequests: DbTrialRequest[] = [
    {
      id: "trial-demo-1",
      appId: "glab-hotel",
      appName: "G-LAB Hôtel & Hébergement",
      ownerName: "Pierre Dubois",
      email: "pierre.dubois@test.com",
      phone: "+33 6 12 34 56 78",
      country: "France",
      language: "Français",
      companySize: "10-50",
      subdomain: "dubois-hotel",
      status: "pending",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  organizations: DbOrganization[] = [
    {
      id: "org-glabtech-hq",
      name: "GLABTECH HQ (Europe)",
      databaseName: "db-cl_prod_par",
      region: "Paris (AWS-eu-west-3)",
      securityLevel: "Maximal (RSA-4096)",
      autoBackups: true,
      createdAt: "2024-01-15T08:00:00Z"
    },
    {
      id: "org-glabtech-na",
      name: "GLABTECH North America",
      databaseName: "db-cl_prod_nyc",
      region: "New-York (GCP-us-east1)",
      securityLevel: "Standard (HMAC-256)",
      autoBackups: false,
      createdAt: "2024-03-20T10:00:00Z"
    },
    {
      id: "org-glabtech-global",
      name: "GLABTECH Global Corp",
      databaseName: "db-cl_global_sing",
      region: "Singapour (AWS-ap-southeast-1)",
      securityLevel: "Premium (RSA-2048)",
      autoBackups: true,
      createdAt: "2024-06-11T12:00:00Z"
    },
    {
      id: "org-sandbox-lab",
      name: "Sandbox Testing Lab",
      databaseName: "db-cl_sandbox_lnd",
      region: "London (GCP-europe-west2)",
      securityLevel: "Standard (HMAC-256)",
      autoBackups: false,
      createdAt: "2025-01-01T00:00:00Z"
    }
  ];

  users: DbUser[] = [
    {
      id: "usr-glabtech-gildas",
      email: "anges.gildas@gmail.com",
      name: "Anges Gildas",
      passwordHash: "pbkdf2:dummyhash:admin123",
      role: "Global Owner",
      status: "actif",
      mfaEnabled: true,
      lastLogin: "Y a 1 min",
      organizationId: "org-glabtech-hq",
      permissions: ["apps", "billing", "users", "settings"],
      createdAt: "2024-01-15T08:25:00Z"
    },
    {
      id: "usr-glabtech-1",
      email: "glabtech1@gmail.com",
      name: "Glabtech Admin",
      passwordHash: "pbkdf2:dummyhash:admin123",
      role: "Global Owner",
      status: "actif",
      mfaEnabled: true,
      lastLogin: "Y a 2 mins",
      organizationId: "org-glabtech-hq",
      permissions: ["apps", "billing", "users", "settings"],
      createdAt: "2024-01-15T08:30:00Z"
    },
    {
      id: "usr-glabtech-2",
      name: "Marc Lefèvre",
      email: "m.lefevre@glab.com",
      passwordHash: "pbkdf2:dummyhash:marc123",
      role: "CTO Developer",
      status: "actif",
      mfaEnabled: false,
      lastLogin: "Y a 20 mins",
      organizationId: "org-glabtech-hq",
      permissions: ["apps", "settings"],
      createdAt: "2024-02-10T09:12:00Z"
    },
    {
      id: "usr-glabtech-3",
      name: "Sophie Dupont",
      email: "s.dupont@glab.com",
      passwordHash: "pbkdf2:dummyhash:sophie123",
      role: "Finance Admin",
      status: "actif",
      mfaEnabled: false,
      lastLogin: "Y a 3 heures",
      organizationId: "org-glabtech-hq",
      permissions: ["billing"],
      createdAt: "2024-02-12T11:45:00Z"
    },
    {
      id: "usr-glabtech-4",
      name: "Cécile Girard",
      email: "c.girard@glab.com",
      passwordHash: "pbkdf2:dummyhash:cecile123",
      role: "HR Manager",
      status: "invité",
      mfaEnabled: false,
      lastLogin: "-",
      organizationId: "org-glabtech-hq",
      permissions: ["apps"],
      createdAt: "2024-05-01T15:00:00Z"
    },
    {
      id: "usr-glabtech-us-1",
      name: "John Doe",
      email: "john.doe@glabtech-us.com",
      passwordHash: "pbkdf2:dummyhash:john123",
      role: "Global Owner",
      status: "actif",
      mfaEnabled: false,
      lastLogin: "Y a 1 jour",
      organizationId: "org-glabtech-na",
      permissions: ["apps", "billing", "users", "settings"],
      createdAt: "2024-03-20T10:15:00Z"
    },
    {
      id: "usr-glabtech-global-1",
      name: "CEO Singapore",
      email: "ceo.sing@glab-global.com",
      passwordHash: "pbkdf2:dummyhash:ceo123",
      role: "Global Owner",
      status: "actif",
      mfaEnabled: true,
      lastLogin: "Y a 4 heures",
      organizationId: "org-glabtech-global",
      permissions: ["apps", "billing", "users", "settings"],
      createdAt: "2024-06-11T12:10:00Z"
    },
    {
      id: "usr-sandbox-1",
      name: "Sandbox Tester",
      email: "sandbox.owner@glabeboutique.com",
      passwordHash: "pbkdf2:dummyhash:test123",
      role: "Global Owner",
      status: "actif",
      mfaEnabled: false,
      lastLogin: "A l'instant",
      organizationId: "org-sandbox-lab",
      permissions: ["apps", "billing", "users", "settings"],
      createdAt: "2025-01-01T00:05:00Z"
    }
  ];

  subscriptions: DbSubscription[] = [
    {
      id: "sub-glabtech-hq",
      plan: "Enterprise Premium",
      price: 349.00,
      seatsMax: 100,
      seatsUsed: 14,
      status: "active",
      startDate: "2024-01-15T08:00:00Z",
      endDate: null,
      organizationId: "org-glabtech-hq"
    },
    {
      id: "sub-glabtech-na",
      plan: "Business Suite",
      price: 99.00,
      seatsMax: 20,
      seatsUsed: 3,
      status: "active",
      startDate: "2024-03-20T10:00:00Z",
      endDate: null,
      organizationId: "org-glabtech-na"
    },
    {
      id: "sub-glabtech-global",
      plan: "Enterprise Premium",
      price: 349.00,
      seatsMax: 100,
      seatsUsed: 2,
      status: "active",
      startDate: "2024-06-11T12:00:00Z",
      endDate: null,
      organizationId: "org-glabtech-global"
    },
    {
      id: "sub-sandbox-lab",
      plan: "Starter Sandbox",
      price: 0.00,
      seatsMax: 10,
      seatsUsed: 2,
      status: "active",
      startDate: "2025-01-01T00:00:00Z",
      endDate: null,
      organizationId: "org-sandbox-lab"
    }
  ];

  applications: DbApplication[] = [
    {
      id: "glab-aistudio-connector",
      name: "G-AISTUDIO CONNECTOR",
      description: "Connecteur bidirectionnel et pont d'intégration raccordé en temps réel à l'Applet Google AI Studio (ID: d244b68b-4792-460f-a75e-3a02fdaacd42). Idéal pour automatiser des workflows intelligents d'IA.",
      category: "Custom",
      url: "https://ai.studio",
      status: "online",
      version: "v1.0.0",
      icon: "Sparkles",
      ping: 8,
      activeUsers: 1,
      apiRequestsToday: 1540,
      ssoConnected: true,
      ssoClientId: "client_id_aistudio_d244b68b",
      ssoClientSecret: "sec_aistudio_e478aa92e21b0dc5",
      recordsCount: 16,
      createdAt: new Date().toISOString()
    },
    {
      id: "glab-hotel",
      name: "G-HOTEL",
      description: "hotel.glabeboutique.com - Solution complète de gestion hôtelière : réservations de chambres, conciergerie, plannings de nuitées et facturation automatisée.",
      category: "Custom",
      url: "https://hotel.glabeboutique.com",
      status: "online",
      version: "v4.5.1",
      icon: "Building",
      ping: 15,
      activeUsers: 48,
      apiRequestsToday: 12400,
      ssoConnected: true,
      ssoClientId: "client_id_hotel_7bf2c5",
      ssoClientSecret: "sec_hotel_cf52a0d8c11fb355",
      recordsCount: 340,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-resto",
      name: "G-RESTO",
      description: "resto.glabeboutique.com - Terminaux point de vente (POS) tactiles, gestion optimale des tables, commandes en cuisine en temps réel et contrôle des stocks d'ingrédients.",
      category: "Custom",
      url: "https://resto.glabeboutique.com",
      status: "online",
      version: "v3.2.0",
      icon: "Layers",
      ping: 22,
      activeUsers: 34,
      apiRequestsToday: 18900,
      ssoConnected: true,
      ssoClientId: "client_id_resto_11e8a9",
      ssoClientSecret: "sec_resto_f82bc94a11dbf212",
      recordsCount: 840,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-erp",
      name: "G-ERP",
      description: "erp.glabeboutique.com - Noyau de planification des ressources de l'entreprise : comptabilité analytique, ressources humaines (HRM), approvisonnements et workflows de validation.",
      category: "HRM",
      url: "https://erp.glabeboutique.com",
      status: "performance_issue",
      version: "v6.0.4",
      icon: "Database",
      ping: 114,
      activeUsers: 128,
      apiRequestsToday: 41000,
      ssoConnected: true,
      ssoClientId: "client_id_erp_cc82a3",
      ssoClientSecret: "sec_erp_df82bc94a112abfe",
      recordsCount: 5410,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-crm",
      name: "G-CRM",
      description: "crm.glabeboutique.com - Gestion de la relation client unifiée : pipelines commerciaux de leads, campagnes emailing intelligentes et tickets de support client.",
      category: "CRM",
      url: "https://crm.glabeboutique.com",
      status: "online",
      version: "v5.1.2",
      icon: "Briefcase",
      ping: 19,
      activeUsers: 104,
      apiRequestsToday: 34200,
      ssoConnected: true,
      ssoClientId: "client_id_crm_992bf1",
      ssoClientSecret: "sec_crm_001fe478aa92e21b",
      recordsCount: 1950,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-market",
      name: "G-MARKET",
      description: "market.glabeboutique.com - Place de marché B2B globale : transactions commerciales inter-entreprises, contrats automatisés et courtage de commissions en direct.",
      category: "Finance",
      url: "https://market.glabeboutique.com",
      status: "online",
      version: "v2.8.9",
      icon: "DollarSign",
      ping: 14,
      activeUsers: 82,
      apiRequestsToday: 24700,
      ssoConnected: true,
      ssoClientId: "client_id_market_21aef4",
      ssoClientSecret: "sec_market_77e92bf114aab732",
      recordsCount: 1280,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-travel",
      name: "G-TRAVEL",
      description: "travel.glabeboutique.com - Logistique de transport et agences de voyages : plannings des trajets de flottes, billetterie électronique intégrée et réservations de vols.",
      category: "Custom",
      url: "https://travel.glabeboutique.com",
      status: "online",
      version: "v1.4.0",
      icon: "Compass",
      ping: 25,
      activeUsers: 62,
      apiRequestsToday: 15300,
      ssoConnected: true,
      ssoClientId: "client_id_travel_ec18b3",
      ssoClientSecret: "sec_travel_882ca91f0a12e34d",
      recordsCount: 615,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-hopital",
      name: "G-HOPITAL",
      description: "hopital.glabeboutique.com - Gestion hospitalière et de soins de santé : suivi des dossiers cliniques, planification des gardes des urgentistes et lits disponibles.",
      category: "Custom",
      url: "https://hopital.glabeboutique.com",
      status: "online",
      version: "v1.2.9",
      icon: "Activity",
      ping: 31,
      activeUsers: 56,
      apiRequestsToday: 8200,
      ssoConnected: true,
      ssoClientId: "client_id_hopital_aa21f9",
      ssoClientSecret: "sec_hopital_33a7e91d8ffb221a",
      recordsCount: 412,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-ecommerce",
      name: "G-E-COMMERCE",
      description: "ecommerce.glabeboutique.com - Boutique en ligne grand public multicanale : panier d'achat persistant, passerelle bancaire Stripe et synchronisation de facturation.",
      category: "Finance",
      url: "https://ecommerce.glabeboutique.com",
      status: "online",
      version: "v2.1.0",
      icon: "ShoppingCart",
      ping: 18,
      activeUsers: 145,
      apiRequestsToday: 48900,
      ssoConnected: true,
      ssoClientId: "client_id_ecommerce_ef21bc",
      ssoClientSecret: "sec_ecommerce_442ae9dbf18ca412",
      recordsCount: 2240,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-school",
      name: "G-SCHOOL",
      description: "school.glabeboutique.com - Plateforme scolaire et académique : fiches d'élèves, bulletins scolaires, notes de contrôle continu et portail professeurs-parents.",
      category: "Custom",
      url: "https://school.glabeboutique.com",
      status: "online",
      version: "v3.0.5",
      icon: "GraduationCap",
      ping: 20,
      activeUsers: 190,
      apiRequestsToday: 31200,
      ssoConnected: true,
      ssoClientId: "client_id_school_77f4ab",
      ssoClientSecret: "sec_school_b91da8efb102ca14",
      recordsCount: 1840,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-gazolplus",
      name: "G-GAZOL PLUS",
      description: "gazolplus.glabeboutique.com - Système de supervision de stations-service pétrolières : ventes à la pompe réelles, tracking de cuve et cartes de fidélisation.",
      category: "Custom",
      url: "https://gazolplus.glabeboutique.com",
      status: "online",
      version: "v1.0.8",
      icon: "Zap",
      ping: 28,
      activeUsers: 45,
      apiRequestsToday: 9100,
      ssoConnected: true,
      ssoClientId: "client_id_gazolplus_88a2bf",
      ssoClientSecret: "sec_gazolplus_dd82cfe1149e9fac",
      recordsCount: 390,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-trustfinance",
      name: "G-TRUST FINANCE",
      description: "trustfinance.glabeboutique.com - Solution fintech d'investissement, garde de fonds fiduciaires, audits de conformité de transactions et gestion de trésorerie multi-devises.",
      category: "Finance",
      url: "https://trustfinance.glabeboutique.com",
      status: "online",
      version: "v2.0.1",
      icon: "Lock",
      ping: 11,
      activeUsers: 34,
      apiRequestsToday: 18200,
      ssoConnected: true,
      ssoClientId: "client_id_trustfinance_3df58b",
      ssoClientSecret: "sec_trustfinance_098ca7efb123fac9",
      recordsCount: 712,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-comptabilite",
      name: "G-COMPTABILITE",
      description: "comptabilite.glabeboutique.com - Grand livre comptable automatisé, bilans financiers certifiés, déclarations fiscales dématérialisées et calcul d'amortissements.",
      category: "Finance",
      url: "https://comptabilite.glabeboutique.com",
      status: "online",
      version: "v4.1.0",
      icon: "BookOpen",
      ping: 16,
      activeUsers: 88,
      apiRequestsToday: 29500,
      ssoConnected: true,
      ssoClientId: "client_id_comptabilite_f42ab9",
      ssoClientSecret: "sec_comptabilite_cc18da9e9fab23df",
      recordsCount: 4120,
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "glab-rhsysteme",
      name: "G-RH SYSTEME",
      description: "rhsysteme.glabeboutique.com - Suite de pilotage des ressources humaines : fiches de paie dématérialisées, suivi d'absences et évaluation annuelle des collaborateurs.",
      category: "HRM",
      url: "https://rhsysteme.glabeboutique.com",
      status: "online",
      version: "v2.5.3",
      icon: "Fingerprint",
      ping: 19,
      activeUsers: 112,
      apiRequestsToday: 32000,
      ssoConnected: true,
      ssoClientId: "client_id_rhsysteme_a89fac",
      ssoClientSecret: "sec_rhsysteme_ee7cf8a29bd890ac",
      recordsCount: 1530,
      createdAt: "2024-01-01T00:00:00Z"
    }
  ];

  // Map Licensed Applications to Tenants
  licensedApps: Record<string, string[]> = {
    "org-glabtech-hq": [
      "glab-aistudio-connector", "glab-hotel", "glab-resto", "glab-erp", "glab-crm", "glab-market",
      "glab-travel", "glab-hopital", "glab-ecommerce", "glab-school",
      "glab-gazolplus", "glab-trustfinance", "glab-comptabilite", "glab-rhsysteme"
    ],
    "org-glabtech-na": [
      "glab-aistudio-connector", "glab-erp", "glab-crm", "glab-market", "glab-trustfinance",
      "glab-comptabilite", "glab-rhsysteme"
    ],
    "org-glabtech-global": [
      "glab-aistudio-connector", "glab-hotel", "glab-resto", "glab-erp", "glab-crm", "glab-market",
      "glab-travel", "glab-hopital", "glab-ecommerce", "glab-school",
      "glab-gazolplus", "glab-trustfinance", "glab-comptabilite", "glab-rhsysteme"
    ],
    "org-sandbox-lab": [
      "glab-aistudio-connector", "glab-hotel", "glab-resto", "glab-gazolplus"
    ]
  };

  notifications: DbNotification[] = [
    {
      id: "notif-1",
      type: "info",
      text: "Nouvel abonnement Enterprise Premium activé pour le tenant principal.",
      isRead: false,
      createdAt: "2026-05-27T10:00:00Z",
      organizationId: "org-glabtech-hq",
      userId: "usr-glabtech-1"
    },
    {
      id: "notif-2",
      type: "warn",
      text: "Veuillez activer la connexion MFA globale pour conformité ISO27001.",
      isRead: false,
      createdAt: "2026-05-27T11:00:00Z",
      organizationId: "org-glabtech-hq",
      userId: null
    }
  ];

  invoices: DbInvoice[] = [
    {
      id: "inv-1",
      date: "27 Mai 2026",
      amount: 349.00,
      currency: "EUR",
      plan: "Enterprise Premium",
      reference: "stripe_sso_88b1f7e02ad6",
      organizationId: "org-glabtech-hq",
      userId: "usr-glabtech-1"
    },
    {
      id: "inv-2",
      date: "27 Avril 2026",
      amount: 349.00,
      currency: "EUR",
      plan: "Enterprise Premium",
      reference: "stripe_sso_77f1e6b3c92a",
      organizationId: "org-glabtech-hq",
      userId: "usr-glabtech-1"
    },
    {
      id: "inv-3",
      date: "20 Mai 2026",
      amount: 99.00,
      currency: "USD",
      plan: "Business Suite",
      reference: "stripe_sso_11e2f8c9d2bf",
      organizationId: "org-glabtech-na",
      userId: "usr-glabtech-us-1"
    }
  ];

  activityLogs: DbActivityLog[] = [
    {
      id: "log-1",
      timestamp: new Date().toISOString(),
      event: "Token JWT Généré via SSO GLABTECH",
      ip: "109.12.98.24",
      status: "success",
      details: "Signature asymétrique validée pour l'organisation GLABTECH HQ.",
      userId: "usr-glabtech-1",
      organizationId: "org-glabtech-hq",
      applicationId: "glab-erp"
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      event: "Tentative d'accès hors-limite bloquée",
      ip: "193.250.4.15",
      status: "warning",
      details: "Tentative d'appel à l'API sans Bearer JWT valide. Requête parée par GLABTECH API Gateway.",
      userId: null,
      organizationId: "org-glabtech-hq",
      applicationId: "glab-hotel"
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      event: "Webhook de paiement Stripe acquitté",
      ip: "54.187.200.12",
      status: "success",
      details: "Cycle de facturation de l'abonnement SaaS mensuel validé par carte bancaire.",
      userId: null,
      organizationId: "org-glabtech-hq",
      applicationId: "glab-market"
    }
  ];

  apiKeys: DbApiKey[] = [
    {
      id: "key-1",
      hash: "df348e9c...8f",
      prefix: "gl_pk_live_",
      label: "Clé API Production CRM Latam",
      scopes: "read,write",
      active: true,
      expiresAt: null,
      organizationId: "org-glabtech-hq",
      userId: "usr-glabtech-1",
      createdAt: "2026-01-10T14:22:00Z"
    }
  ];

  settings: DbSettings[] = [
    {
      id: "set-hq",
      mfaEnforced: true,
      jwtExpiration: 3600,
      ssoDomainRestriction: "glabeboutique.com,glab.com",
      allowGuestAccess: false,
      organizationId: "org-glabtech-hq"
    },
    {
      id: "set-na",
      mfaEnforced: false,
      jwtExpiration: 7200,
      ssoDomainRestriction: null,
      allowGuestAccess: true,
      organizationId: "org-glabtech-na"
    },
    {
      id: "set-global",
      mfaEnforced: true,
      jwtExpiration: 3600,
      ssoDomainRestriction: "glab-global.com",
      allowGuestAccess: false,
      organizationId: "org-glabtech-global"
    },
    {
      id: "set-sandbox",
      mfaEnforced: false,
      jwtExpiration: 86400,
      ssoDomainRestriction: null,
      allowGuestAccess: true,
      organizationId: "org-sandbox-lab"
    }
  ];
}

const memoryDb = new MemoryDatabase();

// ========================================================
// THE UNIFIED DB SERVICE EXPOSING REAL AND MEMORY CHANNELS
// ========================================================
export class DbService {
  private static isRealDbConnected = false;

  static async checkConnection(): Promise<boolean> {
    try {
      const client = getPrismaClient();
      await client.$connect();
      this.isRealDbConnected = true;
      return true;
    } catch (e) {
      this.isRealDbConnected = false;
      return false;
    }
  }

  // --- ORGANIZATIONS ---
  static async getOrganizations(): Promise<DbOrganization[]> {
    if (this.isRealDbConnected) {
      const orgs = await getPrismaClient().organization.findMany();
      return orgs.map(o => ({
        id: o.id,
        name: o.name,
        databaseName: o.databaseName,
        region: o.region,
        securityLevel: o.securityLevel,
        autoBackups: o.autoBackups,
        createdAt: o.createdAt.toISOString()
      }));
    }
    return memoryDb.organizations;
  }

  static async getOrganizationById(id: string): Promise<DbOrganization | null> {
    if (this.isRealDbConnected) {
      const o = await getPrismaClient().organization.findUnique({ where: { id } });
      if (!o) return null;
      return {
        id: o.id,
        name: o.name,
        databaseName: o.databaseName,
        region: o.region,
        securityLevel: o.securityLevel,
        autoBackups: o.autoBackups,
        createdAt: o.createdAt.toISOString()
      };
    }
    return memoryDb.organizations.find(o => o.id === id || o.name === id) || null;
  }

  static async createOrganization(data: Omit<DbOrganization, "id" | "createdAt">): Promise<DbOrganization> {
    const newId = `org-${Math.random().toString(36).substring(2, 9)}`;
    const newOrg: DbOrganization = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };

    if (this.isRealDbConnected) {
      const o = await getPrismaClient().organization.create({
        data: {
          id: newId,
          name: data.name,
          databaseName: data.databaseName,
          region: data.region,
          securityLevel: data.securityLevel,
          autoBackups: data.autoBackups
        }
      });
      // also create default settings and subscription for this new org in Prisma
      await getPrismaClient().setting.create({
        data: {
          mfaEnforced: false,
          jwtExpiration: 3600,
          organizationId: o.id
        }
      });
      await getPrismaClient().subscription.create({
        data: {
          plan: "Starter Sandbox",
          price: 0,
          seatsMax: 10,
          seatsUsed: 1,
          organizationId: o.id
        }
      });
    }

    memoryDb.organizations.push(newOrg);
    // Initialize standard memory constraints for new org
    memoryDb.licensedApps[newId] = ["glab-hotel", "glab-resto"];
    memoryDb.settings.push({
      id: `set-${newId}`,
      mfaEnforced: false,
      jwtExpiration: 3600,
      ssoDomainRestriction: null,
      allowGuestAccess: true,
      organizationId: newId
    });
    memoryDb.subscriptions.push({
      id: `sub-${newId}`,
      plan: "Starter Sandbox",
      price: 0,
      seatsMax: 10,
      seatsUsed: 1,
      status: "active",
      startDate: new Date().toISOString(),
      endDate: null,
      organizationId: newId
    });

    return newOrg;
  }

  static async updateOrganization(id: string, data: Partial<DbOrganization>): Promise<DbOrganization | null> {
    const org = await this.getOrganizationById(id);
    if (!org) return null;

    if (this.isRealDbConnected) {
      await getPrismaClient().organization.update({
        where: { id: org.id },
        data: {
          name: data.name,
          databaseName: data.databaseName,
          region: data.region,
          securityLevel: data.securityLevel,
          autoBackups: data.autoBackups
        }
      });
    }

    const idx = memoryDb.organizations.findIndex(o => o.id === org.id);
    if (idx !== -1) {
      memoryDb.organizations[idx] = { ...memoryDb.organizations[idx], ...data };
    }
    return { ...org, ...data };
  }

  // --- USERS ---
  static async getUsers(orgId?: string): Promise<DbUser[]> {
    if (this.isRealDbConnected) {
      const users = await getPrismaClient().user.findMany({
        where: orgId ? { organizationId: orgId } : undefined,
        include: { permissions: { include: { permission: true } } }
      });
      return users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        passwordHash: u.passwordHash || "",
        role: u.role,
        status: u.status,
        mfaEnabled: u.mfaEnabled,
        lastLogin: u.lastLogin || "-",
        organizationId: u.organizationId,
        permissions: u.permissions.map(up => up.permission.scope),
        createdAt: u.createdAt.toISOString()
      }));
    }

    if (orgId) {
      return memoryDb.users.filter(u => u.organizationId === orgId);
    }
    return memoryDb.users;
  }

  static async getUserByEmail(email: string): Promise<DbUser | null> {
    if (this.isRealDbConnected) {
      const u = await getPrismaClient().user.findUnique({
        where: { email },
        include: { permissions: { include: { permission: true } } }
      });
      if (!u) return null;
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        passwordHash: u.passwordHash || "",
        role: u.role,
        status: u.status,
        mfaEnabled: u.mfaEnabled,
        lastLogin: u.lastLogin || "-",
        organizationId: u.organizationId,
        permissions: u.permissions.map(up => up.permission.scope),
        createdAt: u.createdAt.toISOString()
      };
    }
    return memoryDb.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async getUserById(id: string): Promise<DbUser | null> {
    if (this.isRealDbConnected) {
      const u = await getPrismaClient().user.findUnique({
        where: { id },
        include: { permissions: { include: { permission: true } } }
      });
      if (!u) return null;
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        passwordHash: u.passwordHash || "",
        role: u.role,
        status: u.status,
        mfaEnabled: u.mfaEnabled,
        lastLogin: u.lastLogin || "-",
        organizationId: u.organizationId,
        permissions: u.permissions.map(up => up.permission.scope),
        createdAt: u.createdAt.toISOString()
      };
    }
    return memoryDb.users.find(u => u.id === id) || null;
  }

  static async createUser(data: Omit<DbUser, "id" | "createdAt">): Promise<DbUser> {
    const newId = `usr-${Math.random().toString(36).substring(2, 9)}`;
    const newUser: DbUser = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };

    if (this.isRealDbConnected) {
      // Find or create scopes in DB
      const client = getPrismaClient();
      const dbUser = await client.user.create({
        data: {
          id: newId,
          email: data.email,
          name: data.name,
          passwordHash: data.passwordHash,
          role: data.role,
          status: data.status,
          mfaEnabled: data.mfaEnabled,
          lastLogin: data.lastLogin,
          organizationId: data.organizationId
        }
      });
      
      for (const scope of data.permissions) {
        let p = await client.permission.findUnique({ where: { scope } });
        if (!p) {
          p = await client.permission.create({ data: { scope, description: `Scope de permission ${scope}` } });
        }
        await client.userPermission.create({
          data: {
            userId: dbUser.id,
            permissionId: p.id
          }
        });
      }
    }

    memoryDb.users.push(newUser);
    
    // Increment seat in memory
    const subIdx = memoryDb.subscriptions.findIndex(s => s.organizationId === data.organizationId);
    if (subIdx !== -1) {
      memoryDb.subscriptions[subIdx].seatsUsed = Math.min(
        memoryDb.subscriptions[subIdx].seatsMax,
        memoryDb.subscriptions[subIdx].seatsUsed + 1
      );
    }

    return newUser;
  }

  static async updateUser(id: string, data: Partial<DbUser>): Promise<DbUser | null> {
    const user = await this.getUserById(id);
    if (!user) return null;

    if (this.isRealDbConnected) {
      const client = getPrismaClient();
      await client.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status,
          mfaEnabled: data.mfaEnabled,
          lastLogin: data.lastLogin
        }
      });
      if (data.permissions) {
        // Drop existing and rebuild permissions
        await client.userPermission.deleteMany({ where: { userId: user.id } });
        for (const scope of data.permissions) {
          let p = await client.permission.findUnique({ where: { scope } });
          if (!p) {
            p = await client.permission.create({ data: { scope } });
          }
          await client.userPermission.create({
            data: {
              userId: user.id,
              permissionId: p.id
            }
          });
        }
      }
    }

    const idx = memoryDb.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      memoryDb.users[idx] = { ...memoryDb.users[idx], ...data };
    }
    return { ...user, ...data };
  }

  static async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    if (!user) return false;

    if (this.isRealDbConnected) {
      await getPrismaClient().user.delete({ where: { id: user.id } });
    }

    memoryDb.users = memoryDb.users.filter(u => u.id !== user.id);
    
    // Decrement seat in memory
    const subIdx = memoryDb.subscriptions.findIndex(s => s.organizationId === user.organizationId);
    if (subIdx !== -1) {
      memoryDb.subscriptions[subIdx].seatsUsed = Math.max(
        1,
        memoryDb.subscriptions[subIdx].seatsUsed - 1
      );
    }
    
    return true;
  }

  // --- SUBSCRIPTIONS ---
  static async getSubscription(orgId: string): Promise<DbSubscription | null> {
    if (this.isRealDbConnected) {
      const s = await getPrismaClient().subscription.findFirst({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" }
      });
      if (!s) return null;
      return {
        id: s.id,
        plan: s.plan,
        price: Number(s.price),
        seatsMax: s.seatsMax,
        seatsUsed: s.seatsUsed,
        status: s.status,
        startDate: s.startDate.toISOString(),
        endDate: s.endDate ? s.endDate.toISOString() : null,
        organizationId: s.organizationId
      };
    }
    return memoryDb.subscriptions.find(s => s.organizationId === orgId) || null;
  }

  static async updateSubscription(orgId: string, plan: string): Promise<DbSubscription | null> {
    let price = 0;
    let seatsMax = 10;
    if (plan === "Enterprise Premium") {
      price = 349.00;
      seatsMax = 100;
    } else if (plan === "Business Suite") {
      price = 99.00;
      seatsMax = 20;
    }

    if (this.isRealDbConnected) {
      const client = getPrismaClient();
      const existing = await client.subscription.findFirst({ where: { organizationId: orgId } });
      if (existing) {
        const s = await client.subscription.update({
          where: { id: existing.id },
          data: {
            plan,
            price,
            seatsMax
          }
        });
        return {
          id: s.id,
          plan: s.plan,
          price: Number(s.price),
          seatsMax: s.seatsMax,
          seatsUsed: s.seatsUsed,
          status: s.status,
          startDate: s.startDate.toISOString(),
          endDate: s.endDate ? s.endDate.toISOString() : null,
          organizationId: s.organizationId
        };
      }
    }

    const idx = memoryDb.subscriptions.findIndex(s => s.organizationId === orgId);
    if (idx !== -1) {
      memoryDb.subscriptions[idx].plan = plan;
      memoryDb.subscriptions[idx].price = price;
      memoryDb.subscriptions[idx].seatsMax = seatsMax;
      return memoryDb.subscriptions[idx];
    }
    return null;
  }

  // --- APPLICATIONS ---
  static async getApplications(): Promise<DbApplication[]> {
    if (this.isRealDbConnected) {
      const apps = await getPrismaClient().application.findMany();
      return apps.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        category: a.category as any,
        url: a.url,
        status: a.status as any,
        version: a.version,
        icon: a.icon,
        ping: a.ping,
        activeUsers: a.activeUsers,
        apiRequestsToday: a.apiRequestsToday,
        ssoConnected: a.ssoConnected,
        ssoClientId: a.ssoClientId,
        ssoClientSecret: a.ssoClientSecret,
        recordsCount: a.recordsCount,
        createdAt: a.createdAt.toISOString()
      }));
    }
    return memoryDb.applications;
  }

  static async createApplication(app: DbApplication): Promise<DbApplication> {
    if (this.isRealDbConnected) {
      await getPrismaClient().application.create({
        data: {
          id: app.id,
          name: app.name,
          description: app.description,
          category: app.category,
          url: app.url,
          status: app.status,
          version: app.version,
          icon: app.icon,
          ping: app.ping,
          activeUsers: app.activeUsers,
          apiRequestsToday: app.apiRequestsToday,
          ssoConnected: app.ssoConnected,
          ssoClientId: app.ssoClientId,
          ssoClientSecret: app.ssoClientSecret,
          recordsCount: app.recordsCount
        }
      });
    }

    const idx = memoryDb.applications.findIndex(a => a.id === app.id);
    if (idx !== -1) {
      memoryDb.applications[idx] = app;
    } else {
      memoryDb.applications.push(app);
    }
    return app;
  }

  static async updateApplication(id: string, data: Partial<DbApplication>): Promise<DbApplication | null> {
    if (this.isRealDbConnected) {
      const client = getPrismaClient();
      const existing = await client.application.findUnique({ where: { id } });
      if (existing) {
        const updated = await client.application.update({
          where: { id },
          data: data as any
        });
        return {
          id: updated.id,
          name: updated.name,
          description: updated.description,
          category: updated.category as any,
          url: updated.url,
          status: updated.status as any,
          version: updated.version,
          icon: updated.icon,
          ping: updated.ping,
          activeUsers: updated.activeUsers,
          apiRequestsToday: updated.apiRequestsToday,
          ssoConnected: updated.ssoConnected,
          ssoClientId: updated.ssoClientId,
          ssoClientSecret: updated.ssoClientSecret,
          recordsCount: updated.recordsCount,
          createdAt: updated.createdAt.toISOString()
        };
      }
    }
    const idx = memoryDb.applications.findIndex(a => a.id === id);
    if (idx !== -1) {
      memoryDb.applications[idx] = { ...memoryDb.applications[idx], ...data };
      return memoryDb.applications[idx];
    }
    return null;
  }

  static async getLicensedAppIds(orgId: string): Promise<string[]> {
    if (this.isRealDbConnected) {
      const licenses = await getPrismaClient().licensedApplication.findMany({
        where: { organizationId: orgId }
      });
      return licenses.map(l => l.applicationId);
    }
    return memoryDb.licensedApps[orgId] || [];
  }

  static async setLicensedApps(orgId: string, appIds: string[]): Promise<string[]> {
    if (this.isRealDbConnected) {
      const client = getPrismaClient();
      await client.licensedApplication.deleteMany({ where: { organizationId: orgId } });
      for (const appId of appIds) {
        await client.licensedApplication.create({
          data: {
            organizationId: orgId,
            applicationId: appId
          }
        });
      }
    }
    memoryDb.licensedApps[orgId] = appIds;
    return appIds;
  }

  // --- NOTIFICATIONS ---
  static async getNotifications(orgId?: string, userId?: string): Promise<DbNotification[]> {
    if (this.isRealDbConnected) {
      const client = getPrismaClient();
      const list = await client.notification.findMany({
        where: {
          OR: [
            orgId ? { organizationId: orgId } : {},
            userId ? { userId: userId } : {}
          ]
        },
        orderBy: { createdAt: "desc" }
      });
      return list.map(n => ({
        id: n.id,
        type: n.type as any,
        text: n.text,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        organizationId: n.organizationId,
        userId: n.userId
      }));
    }

    return memoryDb.notifications.filter(n => {
      let match = false;
      if (orgId && n.organizationId === orgId) match = true;
      if (userId && n.userId === userId) match = true;
      return match;
    });
  }

  static async createNotification(data: Omit<DbNotification, "id" | "createdAt">): Promise<DbNotification> {
    const newId = `notif-${Math.random().toString(36).substring(2, 9)}`;
    const newNotif: DbNotification = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };

    if (this.isRealDbConnected) {
      await getPrismaClient().notification.create({
        data: {
          id: newId,
          type: data.type,
          text: data.text,
          isRead: data.isRead,
          organizationId: data.organizationId,
          userId: data.userId
        }
      });
    }

    memoryDb.notifications.unshift(newNotif);
    return newNotif;
  }

  static async markNotificationAsRead(id: string): Promise<boolean> {
    if (this.isRealDbConnected) {
      await getPrismaClient().notification.update({
        where: { id },
        data: { isRead: true }
      });
    }
    const idx = memoryDb.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      memoryDb.notifications[idx].isRead = true;
      return true;
    }
    return false;
  }

  // --- INVOICES ---
  static async getInvoices(orgId: string): Promise<DbInvoice[]> {
    if (this.isRealDbConnected) {
      const list = await getPrismaClient().invoice.findMany({
        where: { organizationId: orgId },
        orderBy: { date: "desc" }
      });
      return list.map(i => ({
        id: i.id,
        date: i.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        amount: Number(i.amount),
        currency: i.currency,
        plan: i.plan,
        reference: i.reference,
        organizationId: i.organizationId,
        userId: i.userId
      }));
    }
    return memoryDb.invoices.filter(i => i.organizationId === orgId);
  }

  static async createInvoice(data: Omit<DbInvoice, "id">): Promise<DbInvoice> {
    const newId = `inv-${Math.random().toString(36).substring(2, 9)}`;
    const newInv: DbInvoice = {
      ...data,
      id: newId
    };

    if (this.isRealDbConnected) {
      await getPrismaClient().invoice.create({
        data: {
          id: newId,
          amount: data.amount,
          currency: data.currency,
          plan: data.plan,
          reference: data.reference,
          organizationId: data.organizationId,
          userId: data.userId
        }
      });
    }

    memoryDb.invoices.unshift(newInv);
    return newInv;
  }

  // --- ACTIVITY LOGS ---
  static async getActivityLogs(orgId: string): Promise<DbActivityLog[]> {
    if (this.isRealDbConnected) {
      const list = await getPrismaClient().activityLog.findMany({
        where: { organizationId: orgId },
        orderBy: { timestamp: "desc" },
        take: 100
      });
      return list.map(a => ({
        id: a.id,
        timestamp: a.timestamp.toISOString(),
        event: a.event,
        ip: a.ip || "127.0.0.1",
        status: a.status as any,
        details: a.details || "",
        userId: a.userId,
        organizationId: a.organizationId,
        applicationId: a.applicationId
      }));
    }
    return memoryDb.activityLogs.filter(l => l.organizationId === orgId);
  }

  static async createActivityLog(data: Omit<DbActivityLog, "id" | "timestamp">): Promise<DbActivityLog> {
    const newId = `log-${Math.random().toString(36).substring(2, 9)}`;
    const newLog: DbActivityLog = {
      ...data,
      id: newId,
      timestamp: new Date().toISOString()
    };

    if (this.isRealDbConnected) {
      await getPrismaClient().activityLog.create({
        data: {
          id: newId,
          event: data.event,
          ip: data.ip,
          status: data.status,
          details: data.details,
          userId: data.userId,
          organizationId: data.organizationId,
          applicationId: data.applicationId
        }
      });
    }

    memoryDb.activityLogs.unshift(newLog);
    return newLog;
  }

  // --- API KEYS ---
  static async getApiKeys(orgId: string): Promise<DbApiKey[]> {
    if (this.isRealDbConnected) {
      const list = await getPrismaClient().apiKey.findMany({
        where: { organizationId: orgId }
      });
      return list.map(k => ({
        id: k.id,
        hash: k.hash,
        prefix: k.prefix,
        label: k.label,
        scopes: k.scopes,
        active: k.active,
        expiresAt: k.expiresAt ? k.expiresAt.toISOString() : null,
        organizationId: k.organizationId,
        userId: k.userId,
        createdAt: k.createdAt.toISOString()
      }));
    }
    return memoryDb.apiKeys.filter(k => k.organizationId === orgId);
  }

  static async createApiKey(data: Omit<DbApiKey, "id" | "createdAt">): Promise<DbApiKey> {
    const newId = `key-${Math.random().toString(36).substring(2, 9)}`;
    const newKey: DbApiKey = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };

    if (this.isRealDbConnected) {
      await getPrismaClient().apiKey.create({
        data: {
          id: newId,
          hash: data.hash,
          prefix: data.prefix,
          label: data.label,
          scopes: data.scopes,
          active: data.active,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          organizationId: data.organizationId,
          userId: data.userId
        }
      });
    }

    memoryDb.apiKeys.push(newKey);
    return newKey;
  }

  static async revokeApiKey(id: string): Promise<boolean> {
    if (this.isRealDbConnected) {
      await getPrismaClient().apiKey.update({
        where: { id },
        data: { active: false }
      });
    }
    const idx = memoryDb.apiKeys.findIndex(k => k.id === id);
    if (idx !== -1) {
      memoryDb.apiKeys[idx].active = false;
      return true;
    }
    return false;
  }

  // --- SETTINGS ---
  static async getSettings(orgId: string): Promise<DbSettings | null> {
    if (this.isRealDbConnected) {
      const s = await getPrismaClient().setting.findUnique({
        where: { organizationId: orgId }
      });
      if (!s) return null;
      return {
        id: s.id,
        mfaEnforced: s.mfaEnforced,
        jwtExpiration: s.jwtExpiration,
        ssoDomainRestriction: s.ssoDomainRestriction,
        allowGuestAccess: s.allowGuestAccess,
        organizationId: s.organizationId
      };
    }
    return memoryDb.settings.find(s => s.organizationId === orgId) || null;
  }

  static async updateSettings(orgId: string, data: Partial<DbSettings>): Promise<DbSettings | null> {
    if (this.isRealDbConnected) {
      const client = getPrismaClient();
      const existing = await client.setting.findUnique({ where: { organizationId: orgId } });
      if (existing) {
        const s = await client.setting.update({
          where: { organizationId: orgId },
          data: {
            mfaEnforced: data.mfaEnforced,
            jwtExpiration: data.jwtExpiration,
            ssoDomainRestriction: data.ssoDomainRestriction,
            allowGuestAccess: data.allowGuestAccess
          }
        });
        return {
          id: s.id,
          mfaEnforced: s.mfaEnforced,
          jwtExpiration: s.jwtExpiration,
          ssoDomainRestriction: s.ssoDomainRestriction,
          allowGuestAccess: s.allowGuestAccess,
          organizationId: s.organizationId
        };
      }
    }

    const idx = memoryDb.settings.findIndex(s => s.organizationId === orgId);
    if (idx !== -1) {
      memoryDb.settings[idx] = { ...memoryDb.settings[idx], ...data };
      return memoryDb.settings[idx];
    }
    return null;
  }

  // --- TRIAL/DEMAND APPROVALS ---
  static async getTrialRequests(): Promise<DbTrialRequest[]> {
    return memoryDb.trialRequests;
  }

  static async createTrialRequest(data: Omit<DbTrialRequest, "id" | "status" | "createdAt">): Promise<DbTrialRequest> {
    const newRequest: DbTrialRequest = {
      id: `trial-${Math.random().toString(36).substring(2, 9)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...data
    };
    memoryDb.trialRequests.push(newRequest);
    return newRequest;
  }

  static async updateTrialRequestStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<DbTrialRequest | null> {
    const req = memoryDb.trialRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      return req;
    }
    return null;
  }
}
