import React from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tighter neon-text">SAFESURF AI</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#scanner" className="text-muted-foreground hover:text-primary transition-colors">Scanner</a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          <button className="cyber-button text-sm">Launch App</button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 flex flex-col gap-4 animate-in slide-in-from-top">
          <a href="#features" className="text-muted-foreground" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#scanner" className="text-muted-foreground" onClick={() => setIsOpen(false)}>Scanner</a>
          <a href="#about" className="text-muted-foreground" onClick={() => setIsOpen(false)}>About</a>
          <button className="cyber-button w-full">Launch App</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
