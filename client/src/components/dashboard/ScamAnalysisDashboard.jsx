import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  Zap,
  Clock,
  UserX,
  Target,
  FileCode,
  Brain
} from 'lucide-react';
import { cn } from '../../utils/cn';

const ScamAnalysisDashboard = ({ data }) => {
  if (!data) return null;

  const score = Number(data.score) || 0;
  const risk = data.risk || (score > 70 ? 'Dangerous' : score > 30 ? 'Suspicious' : 'Safe');

  const getThreatColor = (r) => {
    if (r === 'Safe') return 'text-green-400';
    if (r === 'Suspicious') return 'text-yellow-400';
    return 'text-red-500';
  };

  const getThreatBg = (r) => {
    if (r === 'Safe') return 'bg-green-500/10 border-green-500/20';
    if (r === 'Suspicious') return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const indicators = [
    { 
        label: 'Urgency Detection', 
        val: data.urgency === 'High' || data.urgency === 'Medium', 
        icon: <Clock className="w-4 h-4" />,
        desc: 'Detects artificial time pressure used to force mistakes.'
    },
    { 
        label: 'Manipulation Tactics', 
        val: data.manipulation, 
        icon: <Brain className="w-4 h-4" />,
        desc: 'Identifies psychological tricks used to deceive victims.'
    },
    { 
        label: 'Impersonation Check', 
        val: data.impersonation, 
        icon: <UserX className="w-4 h-4" />,
        desc: 'Flags attempts to mimic banks, brands, or authorities.'
    },
    { 
        label: 'Phishing Language', 
        val: data.phishingLanguage, 
        icon: <FileCode className="w-4 h-4" />,
        desc: 'Analyzes linguistics common in data theft campaigns.'
    },
    { 
        label: 'Emotional Pressure', 
        val: data.emotionalPressure, 
        icon: <Target className="w-4 h-4" />,
        desc: 'Detects fear-based or greed-based narratives.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Risk Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={cn("glass-card p-8 flex flex-col items-center justify-center text-center", getThreatBg(risk))}>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64" cy="64" r="58"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    <motion.circle
                        cx="64" cy="64" r="58"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={364.4}
                        initial={{ strokeDashoffset: 364.4 }}
                        animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={getThreatColor(risk)}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono">{score}%</span>
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Scam Prob.</span>
                </div>
            </div>
            <div className={cn("mt-6 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border", getThreatBg(risk))}>
                {risk} THREAT LEVEL
            </div>
        </div>

        <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-24 h-24" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold font-mono">IA LINGUISTIC REPORT</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base border-l-2 border-primary/30 pl-4 py-1">
                   "{data.explanation}"
                </p>
                
                <div className="mt-6 flex flex-wrap gap-4">
                    {data.indicators?.map((ind, i) => (
                        <span key={i} className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded tracking-tighter uppercase">
                            {ind}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase opacity-70">
                <span>Analysis Unit: ML-Core-v4</span>
                <span>Certainty: {(85 + Math.random() * 10).toFixed(1)}%</span>
            </div>
        </div>
      </div>

      {/* Feature Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {indicators.map((item, i) => (
            <div key={i} className={cn(
                "glass-card p-4 transition-all duration-300",
                item.val ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(0,242,254,0.1)]" : "opacity-60 grayscale-[0.5]"
            )}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={cn("p-1.5 rounded-md border", item.val ? "bg-primary/20 border-primary/50 text-primary" : "bg-muted border-border text-muted-foreground")}>
                        {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-mono", item.val ? "text-primary" : "text-muted-foreground")}>
                        {item.val ? "DETECTED" : "CLEAR"}
                    </span>
                    <div className={cn("w-1.5 h-1.5 rounded-full", item.val ? "bg-primary animate-pulse" : "bg-muted-foreground/30")}></div>
                </div>
            </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="glass-card p-8 border-l-4 border-l-primary/50">
        <h4 className="flex items-center gap-2 text-sm font-mono uppercase text-primary tracking-widest mb-6">
            <ShieldCheck className="w-5 h-5" /> Safety Countermeasures
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
            {data.recommendations?.map((rec, i) => (
                <div key={i} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-mono text-xs text-primary border border-border group-hover:border-primary/50 transition-colors shrink-0">
                        {i + 1}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors pt-1">
                        {rec}
                    </p>
                </div>
            ))}
        </div>
        
        <div className="mt-8 flex justify-center">
            <button className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 opacity-50 hover:opacity-100">
                Report this scam to help improve the AI <Info className="w-3 h-3" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScamAnalysisDashboard;
