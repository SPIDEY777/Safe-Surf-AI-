import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  Lock, 
  Unlock,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';
import { cn } from '../../utils/cn';

const AnalysisDashboard = ({ data }) => {
  if (!data) return null;

  const getThreatColor = (risk) => {
    if (risk === 'Safe' || risk === 'Low') return 'text-green-400';
    if (risk === 'Suspicious' || risk === 'Medium') return 'text-yellow-400';
    return 'text-red-500';
  };

  const getThreatBg = (risk) => {
    if (risk === 'Safe' || risk === 'Low') return 'bg-green-500/10 border-green-500/20';
    if (risk === 'Suspicious' || risk === 'Medium') return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-12 space-y-8"
    >
      {/* Top Header: Score & Quick Status */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={cn("glass-card p-8 flex flex-col items-center justify-center text-center", getThreatBg(data?.risk))}>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64" cy="64" r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/30"
                    />
                    <motion.circle
                        cx="64" cy="64" r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={364.4}
                        initial={{ strokeDashoffset: 364.4 }}
                        animate={{ strokeDashoffset: 364.4 - (364.4 * (Number(data?.score) || 0)) / 100 }}
                        className={getThreatColor(data?.risk)}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{Number(data?.score) || 0}%</span>
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Threat Score</span>
                </div>
            </div>
            <div className={cn("mt-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", getThreatBg(data?.risk))}>
                {(data?.risk || 'UNKNOWN').toUpperCase()} SITE
            </div>
        </div>

        <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">AI Threat Explanation</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                   "{data?.explanation || "Our AI models have identified multiple patterns consistent with phishing attempts, including unusual domain structure and suspicious redirection behavior."}"
                </p>
            </div>
            <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" /> SSL: {data?.ssl ? 'ENCRYPTED' : 'UNSECURED'}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Globe className="w-4 h-4" /> REPUTATION: {data?.reputation || 'Unknown'}
                </div>
            </div>
        </div>
      </div>

      {/* Middle: Indicators & SSL */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <h4 className="text-sm font-mono uppercase text-muted-foreground tracking-widest px-1">Risk Indicators</h4>
           <div className="space-y-3">
              {(data?.indicators || ['Suspicious TLD', 'Recent Domain Registration', 'Invisible Redirects']).map((ind, i) => (
                  <div key={i} className="glass-card p-4 flex items-center justify-between border-l-2 border-l-primary">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <span className="text-sm">{ind}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
              ))}
           </div>
        </div>

        <div className="space-y-4">
            <h4 className="text-sm font-mono uppercase text-muted-foreground tracking-widest px-1">Security Recommendation</h4>
            <div className={cn(
                "glass-card p-6 border-l-4",
                data?.risk === 'Safe' ? "bg-green-500/5 border-green-500/40" : 
                data?.risk === 'Suspicious' ? "bg-yellow-500/5 border-yellow-500/40" : 
                "bg-red-500/5 border-red-500/40"
            )}>
                <div className={cn(
                    "flex items-center gap-3 mb-4",
                    data?.risk === 'Safe' ? "text-green-400" : 
                    data?.risk === 'Suspicious' ? "text-yellow-400" : 
                    "text-red-500"
                )}>
                    {data?.risk === 'Safe' ? <ShieldCheck className="w-6 h-6" /> : 
                     data?.risk === 'Suspicious' ? <Info className="w-6 h-6" /> : 
                     <ShieldAlert className="w-6 h-6" />}
                    
                    <span className="font-bold">
                        {data?.risk === 'Safe' ? "Safe To Browse" : 
                         data?.risk === 'Suspicious' ? "Proceed With Caution" : 
                         "Urgent Action Required"}
                    </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                    {data?.risk === 'Safe' ? "This website appears secure. Continue browsing normally while maintaining standard cybersecurity practices." : 
                     data?.risk === 'Suspicious' ? "This website shows suspicious characteristics. Verify authenticity before entering sensitive information." : 
                     "This website appears highly dangerous and may be attempting phishing or credential theft."}
                </p>

                <div className="flex flex-col gap-2">
                    <button className={cn(
                        "relative px-6 py-2.5 font-semibold transition-all duration-300 rounded-lg text-xs uppercase tracking-wider",
                        data?.risk === 'Safe' ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:brightness-110" : 
                        data?.risk === 'Suspicious' ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:brightness-110" : 
                        "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:bg-red-700"
                    )}>
                        {data?.risk === 'Safe' ? "Continue Browsing" : 
                         data?.risk === 'Suspicious' ? "Verify Website" : 
                         "Block Domain"}
                    </button>
                    
                    <button className="text-[10px] text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-1 mt-2">
                        {data?.risk === 'Safe' ? "View Security Documentation" : "Report to Google Safe Browsing"} <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;
