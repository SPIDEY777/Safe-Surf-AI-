import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Globe, ArrowRight, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
      
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Safety Intelligence Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight text-slate-900">
            Safer browsing <br />
            <span className="text-blue-600">for everyone.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
            SafeSurf AI protects you from phishing, scams, and deceptive websites using advanced security intelligence that's easy to understand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="#scanner" className="cyber-button px-10 py-5 flex items-center gap-3 h-16 shadow-premium">
              Start Scanning
              <ArrowRight className="w-5 h-5" />
            </a>
            <button className="px-10 py-5 rounded-xl border border-slate-200 bg-white shadow-soft hover:bg-slate-50 transition-all font-bold text-slate-600 h-16">
              Security Guide
            </button>
          </div>
        </motion.div>

        {/* Floating Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 relative max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border-slate-100 bg-white">
             <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                      <ShieldAlert className="w-6 h-6" />
                   </div>
                   <span className="font-bold text-slate-900 text-lg">Alert: Potential Threat Detected</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                    className="h-full bg-rose-600"
                   />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  We identified suspicious patterns in "verify-bank-access.com" that match known phishing tactics.
                </p>
             </div>
             <div className="flex shrink-0">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[140px]">
                   <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Risk Level</div>
                   <div className="text-3xl font-black text-rose-600 italic">CRITICAL</div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
