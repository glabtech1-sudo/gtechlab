export type UserRole = "Global Owner" | "CTO Developer" | "Finance Admin" | "HR Manager" | "Guest Client";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  tenant: string;
  department: string;
  mfaEnabled: boolean;
  lastLogin: string;
}

export type AppCategory = "HRM" | "Finance" | "CRM" | "Inventory" | "Custom";

export interface ManagedApp {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
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
  lastSync: string;
  // Specific data records to manipulate in sandbox
  recordsCount: number;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  app: string;
  ip: string;
  status: "success" | "warning" | "failure";
  details: string;
}

export interface SystemMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
  apiLatency: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
  // Let the user know if a query mapped to some action or summary
  actionsPerformed?: string[];
}

export interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  triggerApp: string;
  triggerEvent: string;
  targetApp: string;
  targetAction: string;
  active: boolean;
}
