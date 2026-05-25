import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/dashboard/Hero';
import Scanner from '../components/dashboard/Scanner';
import ScamAnalyzer from '../components/dashboard/ScamAnalyzer';
import EmailAnalyzer from '../components/dashboard/EmailAnalyzer';
import { ShieldCheck, Zap, Lock, Info, Globe, MessageSquare, Mail } from 'lucide-react';
import { cn } from '../utils/cn';

const homeFeatures = [
    { icon: <Zap className="w-6 h-6 text-primary" />, title: "Real-time Detection", desc: "Instant analysis of suspicious URLs using AI models." },
    { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "SSL Verification", desc: "Deep validation of SSL certificates and encryption layers." },
    { icon: <Info className="w-6 h-6 text-primary" />, title: "Explainable AI", desc: "Know exactly why a site is flagged with human-readable reports." },
    { icon: <Lock className="w-6 h-6 text-primary" />, title: "Safe Browsing", desc: "Protection against phishing, malware, and social engineering." },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'message' | 'email'

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Dynamic Dashboard Section */}
      <section id="analyzer" className="pt-20 pb-32 relative bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Tab Switcher */}
          <div className="flex justify-center mb-16 px-4">
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('url')}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-[14px] text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === 'url' ? "bg-white text-blue-600 shadow-md border border-slate-200" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Globe className="w-4 h-4" /> Website Audit
              </button>
              <button 
                onClick={() => setActiveTab('message')}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-[14px] text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === 'message' ? "bg-white text-blue-600 shadow-md border border-slate-200" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <MessageSquare className="w-4 h-4" /> Message Check
              </button>
              <button 
                onClick={() => setActiveTab('email')}
                className={cn(
                  "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3.5 rounded-[14px] text-xs font-bold transition-all uppercase tracking-widest",
                  activeTab === 'email' ? "bg-white text-blue-600 shadow-md border border-slate-200" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Mail className="w-4 h-4" /> Email Security
              </button>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'url' ? <Scanner id="scanner" /> : 
                     activeTab === 'message' ? <ScamAnalyzer /> : 
                     <EmailAnalyzer />}
                </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Enterprise-Grade Protection</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">Built on military-grade heuristics and AI-powered intelligence to keep your credentials safe from sophisticated phishing attacks.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeFeatures.map((f, i) => (
              <div key={i} className="glass-card p-8 hover:-translate-y-1 transition-all border-slate-100 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
                <span className="font-black text-xl tracking-tighter text-slate-900">SAFESURF AI</span>
            </div>
            <p className="text-slate-400 text-sm mb-10 font-medium">© 2026 SafeSurf AI Systems. All rights reserved.</p>
            <div className="flex justify-center flex-wrap gap-10 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Usage Terms</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Developer API</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
            </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
