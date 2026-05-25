import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, ShieldAlert, Loader2, Globe, Lock, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { scanUrl } from '../../services/api';
import AnalysisDashboard from './AnalysisDashboard';

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    // Strict URL validation on the client side
    const trimmedUrl = url.trim();
    if (/\s/.test(trimmedUrl)) {
      setError('Input is not a valid website.');
      return;
    }

    let checkUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(checkUrl)) {
      checkUrl = `https://${checkUrl}`;
    }

    try {
      const parsed = new URL(checkUrl);
      const domainRegex = /^[a-z0-9-]{1,63}(\.[a-z0-9-]{1,63})*\.[a-z]{2,63}$/;
      if (!domainRegex.test(parsed.hostname.toLowerCase())) {
        setError('Input is not a valid website.');
        return;
      }
      if (parsed.hostname.toLowerCase() === 'localhost' || parsed.hostname.toLowerCase() === 'localhost.localdomain') {
        setError('Input is not a valid website.');
        return;
      }
    } catch (err) {
      setError('Input is not a valid website.');
      return;
    }

    setError('');
    setStatus('loading');
    setResult(null); // Clear previous results
    
    try {
      const data = await scanUrl(trimmedUrl);
      if (!data) throw new Error('No analysis data received');
      setResult(data);
      
      // Save scan to localStorage history in real-time
      try {
        const existing = JSON.parse(localStorage.getItem('safesurf_scans') || '[]');
        const text = (data.explanation || '').toLowerCase();
        const brand = text.includes('google') ? 'Google' : 
                      text.includes('microsoft') ? 'Microsoft' : 
                      text.includes('paypal') ? 'PayPal' : 
                      text.includes('chase') ? 'Chase Bank' : 
                      text.includes('amazon') ? 'Amazon' : 
                      text.includes('netflix') ? 'Netflix' : 'Unknown';
        
        const newScan = {
          id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
          url: data.url || trimmedUrl,
          risk: data.risk || (data.score > 60 ? 'Dangerous' : data.score > 30 ? 'Suspicious' : 'Safe'),
          score: data.score || 0,
          category: data.indicators && data.indicators.length > 0 ? data.indicators[0] : (data.score > 60 ? 'Phishing' : 'Web Audit'),
          brand: brand,
          reason: data.explanation || 'Dynamic real-time heuristic scan.',
          recommendation: data.recommendation || 'Maintain standard security vigilance.',
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('safesurf_scans', JSON.stringify([newScan, ...existing].slice(0, 100)));
      } catch (err) {
        console.warn('[SCANNER] Failed to save scan history to localStorage', err);
      }

      setStatus('success');
    } catch (err) {
      console.error('[SCANNER ERROR]', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
      setError(serverMsg || err.message || 'Analysis failed. Check your connection.');
      setStatus('error');
      setResult(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">URL Inspector</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time AI threat analysis and infrastructure mapping</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> API SECURE
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> NEURAL CLOUD
            </span>
        </div>
      </div>

      {/* Main Scanner Card */}
      <div className="glass-card p-1 sm:p-2 bg-slate-200/50">
        <div className="bg-white p-6 sm:p-8 rounded-[1.25rem] border border-slate-100 shadow-sm">
            <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-50 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste suspicious link here (e.g. security-login.com)" 
                        className={cn(
                            "w-full bg-slate-50 border border-slate-200 p-4 pl-14 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900",
                            error && "border-rose-300 bg-rose-50/30 focus:ring-rose-500/10 focus:border-rose-500"
                        )}
                        disabled={status === 'loading'}
                    />
                </div>
                <button 
                    type="submit"
                    disabled={status === 'loading' || !url}
                    className="cyber-button px-10 flex items-center justify-center gap-2 min-w-[180px] h-[58px]"
                >
                    {status === 'loading' ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> ANALYZING...</>
                    ) : (
                        <>START ANALYSIS</>
                    )}
                </button>
            </form>

            {error && (
                <div className="flex items-center gap-2 mt-4 px-1 text-rose-600">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
                </div>
            )}
        </div>
      </div>

      {/* Results Analysis Dashboard */}
      <AnimatePresence>
        {status === 'success' && result && (
            <AnalysisDashboard data={result} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ResultCard = ({ icon, label, value, sub, color }) => (
    <div className="glass-card p-6 bg-muted/20 border-border/50">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-background/50 border border-border">
                {icon}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
        </div>
        <div className={cn("text-3xl font-bold", color)}>{value}</div>
        <div className="text-xs font-mono text-muted-foreground mt-1">// {sub}</div>
    </div>
);

export default Scanner;
