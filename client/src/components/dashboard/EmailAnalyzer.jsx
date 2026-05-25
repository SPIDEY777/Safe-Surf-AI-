import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldAlert, Loader2, User, FileText, Send, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { analyzeEmail } from '../../services/api';
import EmailAnalysisDashboard from './EmailAnalysisDashboard';

const EmailAnalyzer = () => {
  const [formData, setFormData] = useState({
    sender: '',
    subject: '',
    body: ''
  });
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.sender || !formData.subject || !formData.body) {
      setError('All fields (Sender, Subject, Body) are required.');
      return;
    }

    setError('');
    setStatus('loading');
    setResult(null);
    
    try {
      const data = await analyzeEmail(formData);
      setResult(data);
      setStatus('success');
    } catch (err) {
      setError(err?.response?.data?.error || 'Analysis failed. Please check your data.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold neon-text">Email Guardian AI</h2>
          <p className="text-muted-foreground text-sm font-mono mt-1">v3.4.2 // SMTP THREAT LAYER ENGAGED</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> Secure Mail Gateway</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="glass-card p-1 relative overflow-hidden group mb-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-primary/10 opacity-50"></div>
        
        <div className="relative bg-background/60 backdrop-blur-2xl p-8 rounded-lg overflow-hidden">
            {/* Enterprise Scan Line */}
            {status === 'loading' && (
                <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent z-20 pointer-events-none"
                    style={{ skewX: '-15deg' }}
                />
            )}

            <form onSubmit={handleAnalyze} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                        <label className="text-[10px] uppercase font-mono text-muted-foreground mb-1.5 block ml-1">Origin (Sender Email)</label>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="e.g. security@paypal-verify.com"
                                value={formData.sender}
                                onChange={(e) => setFormData({...formData, sender: e.target.value})}
                                className="w-full bg-muted/40 border border-border/50 p-3.5 pl-11 rounded-xl focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-[10px] uppercase font-mono text-muted-foreground mb-1.5 block ml-1">Subject Vector</label>
                        <div className="relative group">
                            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="e.g. [Urgent] Account Suspension Alert"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full bg-muted/40 border border-border/50 p-3.5 pl-11 rounded-xl focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <label className="text-[10px] uppercase font-mono text-muted-foreground mb-1.5 block ml-1">Email Payload (Body Content)</label>
                    <textarea 
                        placeholder="Paste the full email content here..."
                        value={formData.body}
                        onChange={(e) => setFormData({...formData, body: e.target.value})}
                        className="w-full h-48 bg-muted/20 border border-border/50 p-6 rounded-xl focus:outline-none focus:border-primary/50 transition-all font-mono text-sm resize-none"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                    <button 
                        type="submit"
                        disabled={status === 'loading'}
                        className="cyber-button w-full sm:w-auto px-12 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
                    >
                        {status === 'loading' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> RUNNING PHISH-TRAP...</>
                        ) : (
                            <><Mail className="w-4 h-4" /> SCAN PAYLOAD</>
                        )}
                    </button>
                    <div className="flex-1 text-[10px] font-mono text-muted-foreground/60 max-w-sm">
                        Corporate-grade SMTP analysis engine. Screens for MX-record spoofing, linguistic harvesting, and malicious redirects.
                    </div>
                </div>
            </form>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-mono"
                >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </motion.div>
            )}
        </div>
      </div>

      {/* Results Dashboard */}
      <AnimatePresence>
        {status === 'success' && result && (
            <EmailAnalysisDashboard data={result} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailAnalyzer;
