import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Key, 
  RefreshCw, 
  Chrome, 
  Building, 
  CheckCircle, 
  ArrowRight, 
  ChevronLeft, 
  Fingerprint, 
  Clock, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { PortalUser, UserRole } from "../types";

interface AuthPageProps {
  onAuthSuccess: (user: PortalUser) => void;
  onBackToLanding: () => void;
  initialMode?: "login" | "register";
}

export default function AuthPage({ onAuthSuccess, onBackToLanding, initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "verify">(initialMode);
  
  // Form Inputs
  const [email, setEmail] = useState("anges.gildas@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Anges Gildas");
  const [tenant, setTenant] = useState("GLABTECH HQ (Europe)");
  const [role, setRole] = useState<UserRole>("Global Owner");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // UI Simulators
  const [isLoading, setIsLoading] = useState(false);
  const [isOauthLoading, setIsOauthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(59);

  // Security Simulation Details (Visible JWT)
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [simulatedJwt, setSimulatedJwt] = useState("");
  const [simulatedRefreshToken, setSimulatedRefreshToken] = useState("");

  useEffect(() => {
    let timer: any;
    if (mode === "verify" && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mode, countdown]);

  // Generate real structure-like JWT
  const generateSimulatedTokens = (userEmail: string, userRole: string, org: string) => {
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT", kid: "glab-rsa-key-v1" }));
    const payload = btoa(JSON.stringify({
      sub: "usr-" + Math.random().toString(36).substring(2, 9),
      name: name || "Glabtech Executive",
      email: userEmail,
      role: userRole,
      tenant: org,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: "https://auth.glabtech.com",
      aud: "glab-federated-sso"
    }));
    const signature = "RSA_SIG_SsoUnifieGlabL2026_" + Math.random().toString(36).substring(2, 12).toUpperCase();
    
    setSimulatedJwt(`${header}.${payload}.${signature}`);
    setSimulatedRefreshToken("rt_Glab_" + Math.random().toString(36).substring(2, 28).toUpperCase());
  };

  useEffect(() => {
    generateSimulatedTokens(email, role, tenant);
  }, [email, name, role, tenant]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Veuillez remplir tous les champs d'identification.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Generate successful token and login user
      const isSuperAdmin = email === "anges.gildas@gmail.com" || email === "glabtech1@gmail.com";
      const loggedUser: PortalUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: email === "anges.gildas@gmail.com" ? "Anges Gildas" : (email === "glabtech1@gmail.com" ? "Glabtech Admin" : email.split("@")[0].toUpperCase()),
        email: email,
        role: isSuperAdmin ? "Global Owner" : role,
        avatar: isSuperAdmin 
          ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
        tenant: tenant || "GLABTECH HQ (Europe)",
        department: isSuperAdmin ? "Directoire Général" : (role === "Finance Admin" ? "Comptabilité" : "Administration"),
        mfaEnabled: true,
        lastLogin: new Date().toISOString()
      };
      
      onAuthSuccess(loggedUser);
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !tenant) {
      setErrorMsg("Veuillez renseigner toutes les informations requises.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Votre compte G-LAB TECH a été pré-créé ! Veuillez vérifier votre adresse courriel.");
      setCountdown(59);
      setMode("verify");
    }, 1500);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length < 4) {
      setErrorMsg("Code de vérification invalide ou incomplet.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const loggedUser: PortalUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: name,
        email: email,
        role: role,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
        tenant: tenant,
        department: "Operations",
        mfaEnabled: true,
        lastLogin: new Date().toISOString()
      };
      onAuthSuccess(loggedUser);
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Veuillez entrer votre adresse courriel.");
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Un courriel de réinitialisation sécurisé (valide 15 mins via JWT) a été transmis à ${email}.`);
      setTimeout(() => {
        setSuccessMsg(null);
        setMode("login");
      }, 4000);
    }, 1100);
  };

  const handleGoogleOauthSimulator = () => {
    setErrorMsg(null);
    setIsOauthLoading(true);
    
    setTimeout(() => {
      setIsOauthLoading(false);
      // Direct successful login simulated with standard accounts
      const loggedUser: PortalUser = {
        id: "google-usr-99",
        name: "Google Federated User",
        email: "fed.user@gmail.com",
        role: "CTO Developer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
        tenant: "Standard Federated Org",
        department: "R&D Software",
        mfaEnabled: true,
        lastLogin: new Date().toISOString()
      };
      onAuthSuccess(loggedUser);
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#06101E] text-slate-100 flex flex-col justify-between font-sans selection:bg-[#FF7A00] selection:text-white relative overflow-hidden py-8">
      
      {/* Absolute Decorative Blurred Ambient Lights */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </button>

        <div className="flex items-center gap-2 select-none">
          <div className="h-8 w-8 bg-gradient-to-tr from-[#FF7A00] to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-[#FF7A00]/25">
            <span className="font-sans text-white font-black text-base tracking-tighter">G</span>
          </div>
          <span className="font-sans font-extrabold text-[#F5F7FA] text-base tracking-tight hidden sm:inline">G-LAB TECH SSO</span>
        </div>
      </header>

      {/* Main Core Form Block */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 my-6">
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Top Line decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-[#FF7A00] to-amber-500" />

          {/* Alert Alerts */}
          {errorMsg && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-motion-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs flex items-start gap-2.5 animate-motion-in">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1 : LOGIN VIEW */}
          {mode === "login" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/20 font-bold uppercase inline-block">
                  FÉDÉRATION SECURE SSO
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-sans">Connexion à G-LAB</h2>
                <p className="text-xs text-slate-400">Identifiez-vous pour accéder aux 6 applications de gestion.</p>
              </div>

              {/* OAuth Google Button */}
              <button 
                type="button"
                onClick={handleGoogleOauthSimulator}
                disabled={isOauthLoading || isLoading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isOauthLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <Chrome className="h-4 w-4 text-[#FF7A00]" />
                )}
                <span>Continuer avec Google Workspace</span>
              </button>

              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono justify-center">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span>OU PAR ADRESSE COURRIEL</span>
                <div className="h-px bg-slate-800 flex-1"></div>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5 animate-motion-in">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Adresse Courriel</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@entreprise.com"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Mot de passe</label>
                    <button 
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[10px] text-[#FF7A00] hover:underline"
                    >
                      Oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Container */}
                <button
                  type="submit"
                  disabled={isLoading || isOauthLoading}
                  className="w-full bg-[#FF7A00] hover:bg-[#E56E00] text-white py-3.5 rounded-xl text-xs font-black shadow-lg shadow-[#FF7A00]/25 transition-all hover:-translate-y-0.5 pointer-events-auto cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Se connecter en mode sécurisé</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom switch mode */}
              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">Nouveau sur G-LAB TECH ? </span>
                <button
                  onClick={() => setMode("register")}
                  className="text-xs text-[#FF7A00] font-bold hover:underline"
                >
                  Créer un compte principal
                </button>
              </div>
            </div>
          )}

          {/* MODE 2 : REGISTER VIEW */}
          {mode === "register" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/20 font-bold uppercase inline-block">
                  INSCRIPTION MULTI-TENANT
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-sans">Créer votre Organisation</h2>
                <p className="text-xs text-slate-400">Rejoignez l'écosystème G-LAB de classe internationale.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Nom & Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Adresse courriel</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="j.dupont@groupe.com"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                    />
                  </div>
                </div>

                {/* Company Organization */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Nom de l'Organisation (Tenant)</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={tenant}
                      onChange={(e) => setTenant(e.target.value)}
                      placeholder="MON-GROUPE HOLDING SAS"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                    />
                  </div>
                </div>

                {/* Role Switcher Selector for Role-Management */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Rôle Métier (Délégation SSO)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-[#0E1B2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#FF7A00] transition-all"
                  >
                    <option value="Global Owner">Global Owner (Tout accès + SecOps)</option>
                    <option value="CTO Developer">CTO Developer (Gestion des APIs et logs)</option>
                    <option value="Finance Admin">Finance Admin (Facturation, Tarifs, Stripe)</option>
                    <option value="HR Manager">HR Manager (Personnel & ERP uniquement)</option>
                    <option value="Guest Client">Guest Client (Lecture seule)</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-[#FF7A00]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Valider l'inscription & Créer</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

              </form>

              <div className="text-center pt-2 border-t border-slate-800/60">
                <span className="text-xs text-slate-400">Vous possédez déjà un compte central ? </span>
                <button
                  onClick={() => setMode("login")}
                  className="text-xs text-[#FF7A00] font-bold hover:underline"
                >
                  Connexion SSO
                </button>
              </div>
            </div>
          )}

          {/* MODE 3 : FORGOT PASSWORD */}
          {mode === "forgot" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-slate-400 bg-white/5 border border-white/10 font-bold uppercase inline-block">
                  RÉCUPÉRATION DE CLÉS JWT
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-sans">Mot de passe oublié</h2>
                <p className="text-xs text-slate-400">Saisissez votre couriel pour générer un jeton de renouvellement.</p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-[#FF7A00] font-black block">Votre adresse courriel</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@entreprise.com"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF7A00] hover:bg-[#E56E00] text-white py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Expédier le courriel de secours JWT</span>
                  )}
                </button>
              </form>

              <button
                onClick={() => setMode("login")}
                className="w-full text-center text-xs text-slate-450 hover:text-white mt-2 font-semibold flex items-center justify-center gap-1 hover:underline"
              >
                <ChevronLeft className="h-4 w-4" /> Retour à la connexion
              </button>
            </div>
          )}

          {/* MODE 4 : VERIFY EMAIL */}
          {mode === "verify" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold uppercase inline-block">
                  Double Facteur & OTP
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-sans">Vérifier votre adresse</h2>
                <p className="text-xs text-slate-400">Saisissez le code PIN à 6 chiffres envoyé sur votre boîte courriel.</p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold block text-center">Code de validation (Simulé : entrez 2026)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="2026"
                    className="w-full tracking-[1.5em] text-center bg-white/5 border border-white/10 rounded-xl py-3 text-lg font-black text-white focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Valider & Générer ma Session Intégrée</span>
                  )}
                </button>
              </form>

              <div className="flex flex-col items-center gap-2 text-xs text-slate-400 text-center">
                <span>Vous n'avez pas reçu le courriel ?</span>
                {countdown > 0 ? (
                  <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="h-3 w-3" /> Renvoyer le code dans {countdown}s
                  </span>
                ) : (
                  <button 
                    onClick={() => { setCountdown(59); }}
                    className="text-[#FF7A00] font-bold hover:underline"
                  >
                    Renvoyer le code PIN
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Interactive Drawer toggle displaying generated JWT Token details */}
        <div className="w-full max-w-md mt-4">
          <button 
            onClick={() => setShowTokenDetails(!showTokenDetails)}
            className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-slate-450 hover:text-white bg-white/5 px-4 py-3 rounded-xl border border-white/5 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-1.5">
              <Fingerprint className="h-3.5 w-3.5 text-[#FF7A00]" />
              <span>[SIMULATEUR INTEGRATION APIS / DÉTAILS JWT]</span>
            </div>
            <span className="text-slate-550 font-black">{showTokenDetails ? "MASQUER" : "AFFICHER (RECOMMANDÉ)"}</span>
          </button>

          {showTokenDetails && (
            <div className="mt-2 bg-slate-900/80 border border-white/5 rounded-xl p-4 font-mono text-[10px] space-y-3 text-slate-350 animate-motion-in">
              <div>
                <span className="text-[#FF7A00] font-bold uppercase tracking-wider block mb-1">JSON WEB TOKEN SSO SIGNÉ (RS256) :</span>
                <div className="bg-black/45 p-2 rounded border border-white/5 text-[9px] break-all leading-relaxed text-slate-400">
                  {simulatedJwt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <span className="text-indigo-400 font-bold block">REFRESH TOKEN :</span>
                  <code className="text-[9px] font-mono bg-black/45 px-1.5 py-0.5 rounded break-all block mt-1 border border-white/5 text-slate-400">
                    {simulatedRefreshToken}
                  </code>
                </div>

                <div>
                  <span className="text-emerald-400 font-bold block">SÉCURITÉ DE SESSION :</span>
                  <div className="text-[9px] text-slate-400 space-y-0.5 mt-1 leading-normal">
                    <p>● Statut: <span className="text-emerald-500 font-bold">Sécurisée</span></p>
                    <p>● Type: <span className="font-bold">OAuth Google / JWT ID</span></p>
                    <p>● Rôle attribué: <span className="text-amber-500 font-bold">{role}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Footer Info bar */}
      <footer className="w-full max-w-7xl mx-auto px-6 text-center text-[10px] text-slate-500 font-mono relative z-10">
        &copy; 2026 G-LAB TECH. Architecture décentralisée sous conformité GDPR & ISO 27001 active.
      </footer>

    </div>
  );
}
