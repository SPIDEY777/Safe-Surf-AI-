import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Fingerprint, 
  Ghost, 
  Timer, 
  Link2, 
  ShieldX,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';

const EmailAnalysisDashboard = ({ data }) => {
  if (!data) return null;

  const score = Number(data.score) || 0;
  const risk = data.risk || 'Safe';

  const indicators = [
    { 
        label: 'Impersonation Vector', 
        val: data.impersonation, 
        icon: <Ghost className="w-5 h-5" />, 
        color: 'text-purple-400' 
    },
    { 
        label: 'Urgency Tactics', 
        val: data.urgency, 
        icon: <Timer className="w-5 h-5" />, 
        color: 'text-orange-400' 
    },
    { 
        label: 'Harvesting Language', 
        val: data.harvesting, 
        icon: <Fingerprint className="w-5 h-5" />, 
        color: 'text-cyan-400' 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Risk Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className={cn(
            "md:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center",
            risk === 'Dangerous' ? 'bg-red-500/10 border-red-500/20' : 
            risk === 'Suspicious' ? 'bg-yellow-500/10 border-yellow-500/20' : 
            'bg-green-500/10 border-green-500/20'
        )}>
            <div className="relative w-28 h-28 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="56" cy="56" r="50"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    <motion.circle
                        cx="56" cy="56" r="50"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={314}
                        initial={{ strokeDashoffset: 314 }}
                        animate={{ strokeDashoffset: 314 - (314 * score) / 100 }}
                        transition={{ duration: 1.5 }}
                        className={cn(
                            risk === 'Dangerous' ? 'text-red-500' : 
                            risk === 'Suspicious' ? 'text-yellow-400' : 
                            'text-green-400'
                        )}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono">{score}%</span>
                </div>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-1 bg-background/50 rounded border border-border/50">
                Threat Probability
            </div>
        </div>

        <div className="md:col-span-3 glass-card p-8 flex flex-col justify-between border-l-2 border-l-indigo-500">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-xl font-bold font-mono tracking-tight uppercase">AI Diagnostic Report</h3>
                </div>
                <div className="bg-muted/20 p-6 rounded-xl border border-border/40 relative">
                    <div className="absolute top-2 right-4 text-[8px] font-mono text-indigo-500/50 uppercase">Analysis Output</div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 py-1">
                        "{data.explanation}"
                    </p>
                </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
                {data.indicators?.map((ind, i) => (
                    <span key={i} className="text-[9px] font-mono px-2.5 py-1 bg-background/80 border border-border rounded-full flex items-center gap-1.5 text-muted-foreground uppercase tracking-tighter">
                        <ShieldAlert className="w-3 h-3 text-indigo-400" /> {ind}
                    </span>
                ))}
            </div>
        </div>
      </div>

      {/* Tactic Matrix */}
      <div className="grid md:grid-cols-3 gap-6">
        {indicators.map((item, i) => (
            <div key={i} className={cn(
                "glass-card p-6 flex items-center gap-6 transition-all",
                item.val ? "bg-indigo-500/5 border-indigo-500/30" : "opacity-40 grayscale"
            )}>
                <div className={cn("p-3 rounded-xl bg-background/80 border border-border shadow-inner", item.color)}>
                    {item.icon}
                </div>
                <div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{item.label}</div>
                    <div className={cn("text-lg font-bold font-mono", item.val ? "text-indigo-400" : "text-muted-foreground")}>
                        {item.val ? 'POSITIVE' : 'CLEARED'}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Mitigation Strategies */}
      <div className="glass-card overflow-hidden border-indigo-500/20">
         <div className="bg-indigo-500/10 p-5 flex items-center justify-between border-b border-indigo-500/20">
            <h4 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                <ShieldCheck className="w-4 h-4" /> Incident Response Protocol
            </h4>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-500/20"></div>
            </div>
         </div>
         <div className="p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.recommendations?.map((rec, i) => (
                <div key={i} className="relative group">
                    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors"></div>
                    <div className="text-[10px] font-bold font-mono text-indigo-400 mb-2">STRATEGY {i+1}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {rec}
                    </p>
                </div>
            ))}
         </div>
         
         <div className="p-6 bg-muted/20 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-2">
                <ShieldX className="w-4 h-4" /> Professional Alert: This sender domain shows markers of industrial-scale phishing campaigns.
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-[10px] font-mono text-indigo-400 hover:bg-indigo-600/30 transition-all uppercase">
                Export Threat Data <ExternalLink className="w-3 h-3" />
            </button>
         </div>
      </div>
    </motion.div>
  );
};

export default EmailAnalysisDashboard;
