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

    // Basic URL validation
    try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
        setError('Please enter a valid URL');
        return;
    }

    setError('');
    setStatus('loading');
    setResult(null); // Clear previous results
    
    try {
      const data = await scanUrl(url);
      if (!data) throw new Error('No analysis data received');
      setResult(data);
      setStatus('success');
    } catch (err) {
      console.error('[SCANNER ERROR]', err);
      setError(err?.response?.data?.error || err.message || 'Analysis failed. Check your connection.');
      setStatus('error');
      setResult(null);
    }
  };

  return (
    <section id="scanner" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold neon-text">AI Scanner Terminal</h2>
              <p className="text-muted-foreground text-sm font-mono mt-1">v1.0.4 // TRACER ENGINE ACTIVE</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono uppercase text-muted-foreground">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> API Online</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Neural Net Ready</span>
            </div>
          </div>

          {/* Main Scanner Card */}
          <div className="glass-card p-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50"></div>
            
            <div className="relative bg-background/40 backdrop-blur-xl p-8 rounded-lg overflow-hidden">
                {/* Horizontal Scan Line Animation */}
                {status === 'loading' && (
                    <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-primary/50 shadow-[0_0_20px_rgba(0,242,254,0.8)] z-20 pointer-events-none"
                    />
                )}

                <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 relative z-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter suspicious URL (e.g., example-login.top)" 
                            className={cn(
                                "w-full bg-muted/50 border border-border p-4 pl-12 rounded-lg focus:outline-none focus:border-primary transition-all font-mono text-sm",
                                error && "border-red-500/50 focus:border-red-500"
                            )}
                            disabled={status === 'loading'}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={status === 'loading' || !url}
                        className="cyber-button px-8 flex items-center justify-center gap-2 min-w-[160px]"
                    >
                        {status === 'loading' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> ANALYZING...</>
                        ) : 'START SCAN'}
                    </button>
                </form>

                {error && <p className="text-red-400 text-xs font-mono mt-4 ml-1">{error}</p>}
            </div>
          </div>

          {/* Results Analysis Dashboard */}
          <AnimatePresence>
            {status === 'success' && result && (
                <AnalysisDashboard data={result} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
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
