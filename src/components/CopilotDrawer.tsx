import React, { useRef, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  Send, 
  RotateCcw, 
  Bot, 
  User, 
  Database,
  Cpu,
  ShieldAlert,
  Info
} from "lucide-react";
import { ChatMessage } from "../types";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  newMsg: string;
  setNewMsg: (val: string) => void;
  onSend: (presetText?: string) => void;
  isSending: boolean;
  onClear: () => void;
}

export default function CopilotDrawer({
  isOpen,
  onClose,
  messages,
  newMsg,
  setNewMsg,
  onSend,
  isSending,
  onClear
}: CopilotDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#0B1F3A] text-slate-100 shadow-2xl border-l border-white/10 flex flex-col justify-between animate-motion-in">
      
      {/* Header of Drawer */}
      <div className="p-5 border-b border-white/10 bg-[#0B1F3A] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-brand-orange animate-pulse" />
          <div>
            <h3 className="font-extrabold text-sm tracking-tight text-white">Copilote Intel GLABTECH</h3>
            <p className="text-[10px] font-mono text-brand-orange font-black">AI Orchestrator Connected Core</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onClear}
            className="p-1.5 px-3 border border-white/10 hover:bg-white/5 rounded-xl font-mono text-[9.5px] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Réinitialiser l'historique"
          >
            Reset
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Fermer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Info indicator regarding context */}
      <div className="bg-[#FF7A00]/5 px-5 py-2.5 border-b border-[#FF7A00]/10 text-[10px] text-brand-orange font-mono flex items-center gap-2 font-black">
        <Info className="h-4 w-4 text-brand-orange flex-shrink-0 animate-pulse" />
        <span>L'IA analyse vos 6 applications connectées à glabeboutique.com.</span>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 dark-scroll-container">
        {messages.map((m) => {
          const isBot = m.role === "model";
          return (
            <div 
              key={m.id} 
              className={`flex gap-3 max-w-[90%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                isBot ? "bg-white/10 text-brand-orange" : "bg-brand-orange text-white"
              }`}>
                {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-[11.5px] leading-relaxed relative ${
                isBot 
                  ? "bg-white/5 text-slate-100 border border-white/5 shadow-premium" 
                  : "bg-white text-brand-blue font-bold shadow-premium"
              }`}>
                <span className="whitespace-pre-line font-sans font-medium">{m.text}</span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-pulse">
            <div className="h-8 w-8 rounded-xl bg-white/10 text-brand-orange flex items-center justify-center">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400 font-mono">
              Le copilote rédige une réponse ...
            </div>
          </div>
        )}
      </div>

      {/* Quick suggest Prompts */}
      <div className="px-5 py-3.5 bg-black/15 border-t border-white/10 flex flex-col gap-2">
        <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-widest block mb-1">Suggestions rapides</span>
        {[
          { label: "⚙️ Analyser la latence ERP (14ms)", text: "Fais-moi un rapport détaillé sur le monitoring et les résolutions recommandées pour l'ERP erp.glabeboutique.com ." },
          { label: "🔑 Sécurité SSO JWT", text: "Explique l'échange de jetons et la sécurité d'audits SSO entre hotel.glabeboutique.com et resto.glabeboutique.com." },
          { label: "⚡ Idées d'automatisation G-Link", text: "Propose-moi de nouvelles configurations d'automatisation d'identité multi-tenant pertinentes pour nos applications." }
        ].map((item, idx) => (
          <button
            key={idx}
            disabled={isSending}
            onClick={() => onSend(item.text)}
            className="text-[10px] font-mono text-left bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-white/5 transition-colors disabled:opacity-50 cursor-pointer block w-full"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Form Submission */}
      <div className="p-4 border-t border-white/10 bg-[#0B1F3A] flex items-center gap-2">
        <input
          type="text"
          placeholder="Posez une question sur Oauth, JWT, Stripe..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          disabled={isSending}
          className="flex-1 bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-colors disabled:opacity-50 font-medium placeholder-slate-400"
        />
        
        <button
          onClick={() => onSend()}
          disabled={isSending || !newMsg.trim()}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white p-3 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-premium"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
}
