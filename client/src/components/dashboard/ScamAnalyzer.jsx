import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';
import { analyzeScam } from '../../services/api';
import ScamAnalysisDashboard from './ScamAnalysisDashboard';

const ScamAnalyzer = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!message || message.length < 10) {
      setError('Please enter a longer message for accurate analysis (min 10 chars).');
      return;
    }

    setError('');
    setStatus('loading');
    setResult(null);
    
    try {
      const data = await analyzeScam(message);
      if (!data) throw new Error('No analysis data received');
      setResult(data);
      setStatus('success');
    } catch (err) {
      console.error('[SCAM ANALYZER ERROR]', err);
      setError(err?.response?.data?.error || err.message || 'Analysis failed. Check your connection.');
      setStatus('error');
      setResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold neon-text">Scam Intelligence AI</h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">v2.1.0 // LINGUISTIC THREAT ANALYZER ACTIVE</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div> NLP Neural Engine</span>
        </div>
      </div>

      {/* Main Analyzer Card */}
      <div className="glass-card p-1 relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50"></div>
        
        <div className="relative bg-background/40 backdrop-blur-xl p-8 rounded-lg overflow-hidden">
            {/* Scan animation overlay */}
            {status === 'loading' && (
                <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent z-20 pointer-events-none"
                    style={{ skewX: '-20deg' }}
                />
            )}

            <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
                <div className="relative">
                    <div className="absolute -top-3 left-4 px-2 bg-background/80 text-[10px] font-mono text-primary uppercase tracking-widest border border-primary/20 rounded">
                        Neural Input Terminal
                    </div>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Paste suspicious SMS, WhatsApp, or Social Media message here... (e.g. 'Your bank account will be suspended. Verify now at bit.ly/XyZ')" 
                        className={cn(
                            "w-full h-40 bg-muted/30 border border-border/50 p-6 rounded-xl focus:outline-none focus:border-primary/50 transition-all font-mono text-sm resize-none placeholder:text-muted-foreground/50",
                            error && "border-red-500/30 focus:border-red-500/50"
                        )}
                        disabled={status === 'loading'}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                        <MessageSquare className="w-3 h-3" /> {message.length} chars
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                        type="submit"
                        disabled={status === 'loading' || !message}
                        className="cyber-button w-full sm:w-auto px-10 flex items-center justify-center gap-3"
                    >
                        {status === 'loading' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING ANALYTICS...</>
                        ) : (
                            <><ShieldAlert className="w-4 h-4" /> ANALYZE THREAT</>
                        )}
                    </button>
                    <p className="text-[10px] font-mono text-muted-foreground italic flex-1">
                        *AI analyzes message structure, emotional pressure, and psychological manipulation tactics.
                    </p>
                </div>
            </form>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-mono"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </motion.div>
            )}
        </div>
      </div>

      {/* Results Dashboard */}
      <AnimatePresence>
        {status === 'success' && result && (
            <ScamAnalysisDashboard data={result} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScamAnalyzer;
