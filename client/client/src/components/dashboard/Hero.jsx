import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Globe, ArrowRight, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden cyber-grid-bg">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">AI Powered Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Surf the Web with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Absolute Confidence</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            SafeSurf AI detects phishing, fake websites, and malicious threats in real-time. 
            Powered by advanced cybersecurity intelligence and explainable AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#scanner" className="cyber-button flex items-center gap-2">
              Scan Website now
              <ArrowRight className="w-4 h-4" />
            </a>
            <button className="px-6 py-3 rounded-lg border border-border bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all font-semibold">
              View Threat Database
            </button>
          </div>
        </motion.div>

        {/* Floating Components Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-20 relative max-w-4xl mx-auto"
        >
          <div className="glass-card p-4 md:p-8 flex flex-col md:flex-row items-center gap-8 border-primary/30 shadow-[0_0_50px_rgba(0,242,254,0.1)]">
             <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldAlert className="w-6 h-6 text-red-500" />
                   <span className="font-mono text-red-500">Security Alert: Malicious URL Detected</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ delay: 1, duration: 2 }}
                    className="h-full bg-red-500"
                   />
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  [TRACER] Identifying phish pattern in domain: verify-bank-auth.xyz
                </p>
             </div>
             <div className="flex shrink-0 gap-4">
                <div className="p-4 rounded-lg bg-background border border-border">
                   <Globe className="w-8 h-8 text-primary opacity-50" />
                   <div className="mt-2 text-[10px] font-mono uppercase text-muted-foreground">Domain Reputation</div>
                   <div className="text-xl font-bold text-red-400">Low</div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
