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
  Globe,
  Server,
  Activity
} from 'lucide-react';
import { cn } from '../../utils/cn';

const AnalysisDashboard = ({ data }) => {
  if (!data) return null;

  const getThreatColor = (risk) => {
    if (risk === 'Safe' || risk === 'Low') return 'text-emerald-600';
    if (risk === 'Suspicious' || risk === 'Medium') return 'text-amber-600';
    return 'text-rose-600';
  };

  const getThreatBg = (risk) => {
    if (risk === 'Safe' || risk === 'Low') return 'bg-emerald-50 border-emerald-100 shadow-sm';
    if (risk === 'Suspicious' || risk === 'Medium') return 'bg-amber-50 border-amber-100 shadow-sm';
    return 'bg-rose-50 border-rose-100 shadow-sm';
  };

  const getThreatStroke = (risk) => {
    if (risk === 'Safe' || risk === 'Low') return 'stroke-emerald-500';
    if (risk === 'Suspicious' || risk === 'Medium') return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 space-y-10"
    >
      {/* Top Header: Score & Quick Status */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className={cn("md:col-span-4 glass-card p-10 flex flex-col items-center justify-center text-center", getThreatBg(data?.risk))}>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64" cy="64" r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-black/5"
                    />
                    <motion.circle
                        cx="64" cy="64" r="56"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={351.8}
                        initial={{ strokeDashoffset: 351.8 }}
                        animate={{ strokeDashoffset: 351.8 - (351.8 * (Number(data?.score) || 0)) / 100 }}
                        className={getThreatStroke(data?.risk)}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold tracking-tighter">{Number(data?.score) || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">SCORE</span>
                </div>
            </div>
            <div className="mt-6">
                <h2 className={cn("text-2xl font-black uppercase tracking-tight", getThreatColor(data?.risk))}>
                    {(data?.risk || 'UNKNOWN')}
                </h2>
                <p className="text-sm text-slate-600 font-medium mt-1">Safety Rating</p>
            </div>
        </div>

        <div className="md:col-span-8 glass-card p-10 flex flex-col justify-between border-slate-200">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-none">Security Analysis</h3>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                    {data?.explanation || "Our security engine has completed a multi-layer analysis of this URL. No significant threats were detected during the automated validation process."}
                </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-500">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> 
                    <span>SSL: {data?.ssl ? 'Valid' : 'Invalid'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-500">
                    <Globe className="w-5 h-5 text-blue-500" /> 
                    <span>Reputation: {data?.reputation || 'Unknown'}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Infrastructure Intelligence Section */}
      {data?.infrastructure && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mx-1">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-400" /> Host Information
                </h4>
                <div className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">LIVE FEED</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <InfrastructureCard label="Hosting IP" value={data.infrastructure.ip} icon={<Globe className="w-4 h-4" />} />
                <InfrastructureCard label="Provider" value={data.infrastructure.org} icon={<Server className="w-4 h-4" />} />
                <InfrastructureCard label="Location" value={data.infrastructure.country} icon={<Globe className="w-4 h-4" />} />
                <InfrastructureCard label="Exposure" value={`${data.infrastructure.ports.length} Open Ports`} icon={<Activity className="w-4 h-4" />} />
            </div>

            {/* Ports Visualizer */}
            {data.infrastructure.ports.length > 0 && (
                <div className="glass-card p-6 bg-slate-50/50 border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-4 tracking-widest">Exposed Network Services</div>
                    <div className="flex flex-wrap gap-3">
                        {data.infrastructure.ports.map(port => (
                            <div key={port} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-3 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                                PORT {port}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
      )}

      {/* Middle: Indicators & SSL */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
           <h4 className="text-xs font-bold uppercase text-slate-500 tracking-[0.2em] px-1 border-b border-slate-200 pb-4">Risk Indicators</h4>
           <div className="space-y-4">
              {(data?.indicators || []).length > 0 ? data.indicators.map((ind, i) => (
                  <div key={i} className="glass-card p-5 flex items-center justify-between border-slate-200 hover:border-slate-300">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-slate-700">{ind}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
              )) : (
                  <div className="glass-card p-6 border-dashed text-center text-slate-400 text-sm font-medium">
                      No security risks identified during inspection.
                  </div>
              )}
           </div>
        </div>

        <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-[0.2em] px-1 border-b border-slate-200 pb-4">Next Steps</h4>
            <div className={cn(
                "glass-card p-8 border-l-[6px] transition-all",
                data?.risk === 'Safe' ? "border-emerald-500" : 
                data?.risk === 'Suspicious' ? "border-amber-500" : 
                "border-rose-500"
            )}>
                <div className={cn(
                    "flex items-center gap-4 mb-6",
                    getThreatColor(data?.risk)
                )}>
                    {data?.risk === 'Safe' ? <ShieldCheck className="w-8 h-8" /> : 
                     data?.risk === 'Suspicious' ? <Info className="w-8 h-8" /> : 
                     <ShieldAlert className="w-8 h-8" />}
                    
                    <span className="text-2xl font-black tracking-tight leading-none">
                        {data?.risk === 'Safe' ? "Safe To Browse" : 
                         data?.risk === 'Suspicious' ? "Proceed With Caution" : 
                         "High Risk Detected"}
                    </span>
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    {data?.risk === 'Safe' ? "Based on our analysis, this website follows standard security protocols. No malicious behavior was identified." : 
                     data?.risk === 'Suspicious' ? "This URL displays characteristics often associated with phishing. We recommend verifying the source before continuing." : 
                     "This domain is flagged for potential security risks. Interaction is highly discouraged as it may lead to data loss."}
                </p>

                <div className="flex flex-col gap-3">
                    <button className={cn(
                        "w-full py-4 px-6 font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.98]",
                        data?.risk === 'Safe' ? "bg-emerald-600 text-white hover:bg-emerald-700" : 
                        data?.risk === 'Suspicious' ? "bg-amber-600 text-white hover:bg-amber-700" : 
                        "bg-rose-600 text-white hover:bg-rose-700"
                    )}>
                        {data?.risk === 'Safe' ? "Secure - Visit Site" : 
                         data?.risk === 'Suspicious' ? "Verify Authenticity" : 
                         "Close Connection"}
                    </button>
                    
                    <button className="py-3 text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest bg-slate-100/50 rounded-lg mt-1">
                        View Detailed Report <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const InfrastructureCard = ({ icon, label, value }) => (
    <div className="glass-card p-5 border-slate-200 bg-white hover:shadow-premium transition-all">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                {icon}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</div>
        </div>
        <div className="text-base font-bold text-slate-900 truncate">{value || 'Not Disclosed'}</div>
    </div>
);

export default AnalysisDashboard;
