import React from "react";
import { 
  Building, 
  Layers, 
  Briefcase, 
  Database, 
  DollarSign, 
  Users, 
  HelpCircle,
  Activity,
  Cpu,
  Shield,
  Clock,
  Settings,
  ShieldAlert,
  KeyRound,
  LayoutDashboard,
  Compass,
  ShoppingCart,
  GraduationCap,
  Zap,
  Lock,
  BookOpen,
  Fingerprint
} from "lucide-react";

interface KeepKeyIconProps {
  name: string;
  className?: string;
  id?: string;
}

export function KeepKeyIcon({ name, className = "h-5 w-5", id }: KeepKeyIconProps) {
  switch (name) {
    case "Building":
      return <Building className={className} id={id} />;
    case "Layers":
      return <Layers className={className} id={id} />;
    case "Briefcase":
      return <Briefcase className={className} id={id} />;
    case "Database":
      return <Database className={className} id={id} />;
    case "DollarSign":
      return <DollarSign className={className} id={id} />;
    case "Users":
      return <Users className={className} id={id} />;
    case "Activity":
      return <Activity className={className} id={id} />;
    case "Cpu":
      return <Cpu className={className} id={id} />;
    case "Shield":
      return <Shield className={className} id={id} />;
    case "Clock":
      return <Clock className={className} id={id} />;
    case "Settings":
      return <Settings className={className} id={id} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} id={id} />;
    case "KeyRound":
      return <KeyRound className={className} id={id} />;
    case "LayoutDashboard":
      return <LayoutDashboard className={className} id={id} />;
    case "Compass":
      return <Compass className={className} id={id} />;
    case "ShoppingCart":
      return <ShoppingCart className={className} id={id} />;
    case "GraduationCap":
      return <GraduationCap className={className} id={id} />;
    case "Zap":
      return <Zap className={className} id={id} />;
    case "Lock":
      return <Lock className={className} id={id} />;
    case "BookOpen":
      return <BookOpen className={className} id={id} />;
    case "Fingerprint":
      return <Fingerprint className={className} id={id} />;
    default:
      return <Layers className={className} id={id} />;
  }
}
