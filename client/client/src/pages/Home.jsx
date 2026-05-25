import Navbar from '../components/layout/Navbar';
import Hero from '../components/dashboard/Hero';
import Scanner from '../components/dashboard/Scanner';
import { ShieldCheck, Zap, Lock, Info } from 'lucide-react';

const homeFeatures = [
    { icon: <Zap className="w-6 h-6 text-primary" />, title: "Real-time Detection", desc: "Instant analysis of suspicious URLs using AI models." },
    { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "SSL Verification", desc: "Deep validation of SSL certificates and encryption layers." },
    { icon: <Info className="w-6 h-6 text-primary" />, title: "Explainable AI", desc: "Know exactly why a site is flagged with human-readable reports." },
    { icon: <Lock className="w-6 h-6 text-primary" />, title: "Safe Browsing", desc: "Protection against phishing, malware, and social engineering." },
];

const Home = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Scanner />

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cybersecurity Reinvented</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our multi-layered defense system ensures complete transparency and safety.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeFeatures.map((f, i) => (
              <div key={i} className="glass-card p-6 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="font-bold tracking-tighter">SAFESURF AI</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">Built for QuantCraft Hackathon @ Galgotias University</p>
            <div className="flex justify-center gap-8 text-muted-foreground text-sm">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
