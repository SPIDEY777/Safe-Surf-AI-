import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/enterprise-dashboard';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">SAFESURF AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <a href={isDashboard ? "/#features" : "#features"} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Capabilities</a>
          <a href={isDashboard ? "/#analyzer" : "#analyzer"} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Inspection</a>
          <a href={isDashboard ? "/#about" : "#about"} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Documentation</a>
          <Link to="/enterprise-dashboard" className={cn("text-sm font-bold transition-colors uppercase tracking-widest", isDashboard ? "text-blue-600" : "text-slate-500 hover:text-blue-600")}>Enterprise</Link>
          <button className="cyber-button text-xs px-6 py-2.5 !rounded-[10px] shadow-md uppercase tracking-[0.15em] font-black">
            Register Agent
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          <a href={isDashboard ? "/#features" : "#features"} className="text-slate-600 font-bold" onClick={() => setIsOpen(false)}>Features</a>
          <a href={isDashboard ? "/#analyzer" : "#analyzer"} className="text-slate-600 font-bold" onClick={() => setIsOpen(false)}>Scanner</a>
          <a href={isDashboard ? "/#about" : "#about"} className="text-slate-600 font-bold" onClick={() => setIsOpen(false)}>About</a>
          <Link to="/enterprise-dashboard" className={cn("font-bold text-slate-600", isDashboard && "text-blue-600")} onClick={() => setIsOpen(false)}>Enterprise Portal</Link>
          <button className="cyber-button w-full shadow-lg">Start Protection</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
