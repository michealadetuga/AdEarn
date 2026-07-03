import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Play,
  CheckCircle2,
  Lock,
  ChevronDown,
  Sun,
  Moon,
  Coins,
  Globe,
  Database,
  Activity,
  Heart
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "../components/Logo";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Statistics counters simulation
  const [stats, setStats] = useState({ users: 9540, paid: 4895000, ads: 482 });
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 2),
        paid: prev.paid + Math.floor(Math.random() * 150),
        ads: prev.ads + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Chinwe Okoye",
      role: "Digital Entrepreneur",
      note: "Monetizing my spare moments with AdEarn has yielded immediate bank liquidity. Payouts are exceptionally fast and transparent.",
      avatar: "CO",
    },
    {
      name: "Tunde Balogun",
      role: "Systems Specialist",
      note: "The platform's verification security is bank-grade. I've converted consistent attention into passive income flows without any overhead.",
      avatar: "TB",
    },
    {
      name: "Aisha Suleiman",
      role: "Content Coordinator",
      note: "As a student, earning real Naira directly to my bank account for simple tasks has been a major financial upgrade. Highly recommended.",
      avatar: "AS",
    },
  ];

  const faqs = [
    {
      q: "What is the mechanical process behind AdEarn?",
      a: "AdEarn functions as an attention-liquidity bridge. Advertisers purchase micro-targeted placement inventory, and your verified interaction triggers instant payment. Your attention is quantified and settled programmatically in Naira.",
    },
    {
      q: "How are withdrawals verified and processed?",
      a: "All withdrawals are validated using Paystack's bank infrastructure. The system performs real-time account name checking to matching details, processing payouts via bank-grade secure transfers within minutes of requesting.",
    },
    {
      q: "Is the security architecture fraud-resistant?",
      a: "Absolutely. AdEarn integrates a zero-trust fraud detection engine checking device fingerprinting, IP duplicate tracking, and completion timing limits to ensure authentic traffic. Accounts violating protocol are locked to protect advertisers.",
    },
    {
      q: "What are the requirements to start earning?",
      a: "You simply need to provision a secure workspace using your email, perform simple social tasks or watch active ad streams, and provide a valid Nigerian bank account for direct liquidity settlements.",
    },
  ];

  const trustBadges = [
    { icon: Shield, title: "SSL Encryption", desc: "TLS 1.3 tunnels protecting your transactions." },
    { icon: Activity, title: "Fraud Detection", desc: "Real-time AI telemetry tracking anomalous traffic." },
    { icon: Lock, title: "Secure APIs", desc: "Cryptographically authenticated session access." },
    { icon: Coins, title: "Paystack Partnered", desc: "Settled via Africa's most trusted payments gateway." },
    { icon: CheckCircle2, title: "Identity Verification", desc: "Automated account matching to curb impersonation." },
    { icon: Database, title: "Bank-Grade Encryption", desc: "AES-256 data protection at rest and transit." },
    { icon: Globe, title: "Data Privacy Compliant", desc: "Strict adherence to NDPR standards for personal logs." },
    { icon: Zap, title: "Instant Withdrawals", desc: "On-demand payouts routed via real-time banking grids." }
  ];

  // Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-textPrimary font-body overflow-hidden noise-bg transition-colors duration-300">
      
      {/* Background blobs */}
      <div className="ambient-blob w-[500px] h-[500px] bg-brand-primary top-[-100px] right-[-100px]" />
      <div className="ambient-blob w-[600px] h-[600px] bg-brand-secondary bottom-[10%] left-[-200px] opacity-[0.08]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-textSecondary">
              <a href="#how" className="hover:text-brand-primary transition">Workflow</a>
              <a href="#stats" className="hover:text-brand-primary transition">Performance</a>
              <a href="#security" className="hover:text-brand-primary transition">Security</a>
              <a href="#testimonials" className="hover:text-brand-primary transition">Verification</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-brand-border hover:bg-brand-elevated text-brand-textSecondary hover:text-brand-primary transition active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-xl text-brand-textSecondary hover:text-brand-primary transition hover:bg-brand-elevated active:scale-95"
            >
              Access Dashboard
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-[#000000] text-sm font-bold px-5 py-2.5 rounded-xl transition duration-200 active:scale-95 shadow-lg shadow-brand-primary/20 glow-primary"
            >
              <span>Provision Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 space-y-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Enterprise Attention Protocol</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-brand-textPrimary tracking-tight leading-[1.1] font-sans">
              Monetize Your <span className="text-gradient-accent glow-text-primary">Attention.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-brand-textSecondary max-w-xl leading-relaxed">
              A premium digital infrastructure engineered to convert verified engagement into instant liquidity. Provision your workspace in under sixty seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-3 bg-brand-primary hover:bg-[#e09110] text-[#000000] font-black px-8 py-4 rounded-xl transition duration-200 active:scale-95 shadow-lg shadow-brand-primary/25 glow-primary text-base"
              >
                <span>Register Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#how" 
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-brand-border bg-brand-surface/40 hover:bg-brand-elevated transition active:scale-95 text-brand-textSecondary hover:text-brand-textPrimary font-semibold"
              >
                <Play className="w-4 h-4 text-brand-primary fill-brand-primary" />
                <span>Explore Protocol</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-brand-textMuted border-t border-brand-border/60">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-success" />
                <span>NDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-brand-primary" />
                <span>256-bit Encrypted</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Widget Preview */}
          <motion.div 
            className="w-full lg:w-[480px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-card rounded-[2.5rem] p-8 border border-brand-border relative glow-primary shadow-2xl">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-success animate-ping" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-brand-textMuted font-bold">Liquid Reserves</span>
                    <h3 className="text-3xl font-bold font-mono tracking-tight text-brand-textPrimary mt-1">
                      &#8358;35,250.00
                    </h3>
                  </div>
                  <span className="text-xs text-brand-success font-bold bg-brand-success/10 px-2 py-1 rounded-md flex items-center gap-1 border border-brand-success/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +14.2%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-border/50">
                  <div className="flex justify-between items-center text-xs text-brand-textSecondary font-semibold">
                    <span>Task Stream Active</span>
                    <span className="text-brand-primary">4m ago</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">TikTok Video Interaction</p>
                      <p className="text-xs text-brand-textMuted font-mono">ID: TASK-0382</p>
                    </div>
                    <span className="text-sm font-black text-brand-primary">+200 pts</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-brand-textMuted">
                    <span>System Telemetry</span>
                    <span>99.9% Health</span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full w-[94%]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* WORKFLOW BENTO GRID */}
        <section id="how" className="py-20 border-t border-brand-border">
          <motion.div 
            className="text-center max-w-2xl mx-auto space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Structured Earning Workflow</h2>
            <p className="text-brand-textSecondary text-sm md:text-base">
              Explore how we translate attention into secure, verifiable asset exchanges.
            </p>
          </motion.div>

          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                num: "01",
                title: "Provision Account",
                desc: "Establish your cloud workspace using automated security credentials in seconds.",
                bg: "from-brand-primary/10 to-transparent"
              },
              {
                num: "02",
                title: "Execute Tasks",
                desc: "Choose targeted task campaigns tailored across leading social systems.",
                bg: "from-brand-secondary/10 to-transparent"
              },
              {
                num: "03",
                title: "Direct Payouts",
                desc: "Initiate zero-latency transfers directly to verified Nigerian bank databases.",
                bg: "from-brand-success/10 to-transparent"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group glass-card rounded-[2rem] p-8 border border-brand-border hover:border-brand-primary/40 relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl opacity-[0.03] group-hover:opacity-[0.08] transition duration-300 rounded-bl-full" />
                <span className="font-digital text-5xl font-black text-brand-primary/20 group-hover:text-brand-primary/40 transition duration-300">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold text-brand-textPrimary mt-4">{step.title}</h3>
                <p className="text-brand-textSecondary text-sm leading-relaxed mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* STATISTICS SECTION */}
        <section id="stats" className="py-20 border-t border-brand-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Verified Platform Performance</h2>
              <p className="text-brand-textSecondary leading-relaxed">
                AdEarn provides transparent platform metrics. Every transactional log is programmatically validated to preserve advertiser ROI and user integrity.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-xl border border-brand-border bg-brand-surface/40">
                  <span className="text-xs text-brand-textMuted font-bold">Availability SLA</span>
                  <p className="text-xl font-black font-mono mt-1 text-brand-success">99.98%</p>
                </div>
                <div className="flex-1 p-4 rounded-xl border border-brand-border bg-brand-surface/40">
                  <span className="text-xs text-brand-textMuted font-bold">Settlement Delay</span>
                  <p className="text-xl font-black font-mono mt-1 text-brand-primary">~2.4 mins</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Active Nodes", val: stats.users.toLocaleString(), hint: "+18 today", icon: Users },
                { label: "Total Settlements", val: `\u20A6${(stats.paid / 100).toLocaleString(undefined, {maximumFractionDigits: 0})}`, hint: "Audit complete", icon: Coins },
                { label: "Active Inventory", val: stats.ads.toLocaleString(), hint: "Refreshed live", icon: TrendingUp }
              ].map((metric, i) => {
                const IconComp = metric.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 rounded-2xl border border-brand-border flex flex-col justify-between h-44 shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-mono tracking-tight text-brand-textPrimary mt-4">{metric.val}</p>
                      <p className="text-xs text-brand-textSecondary font-semibold">{metric.label}</p>
                      <p className="text-[10px] text-brand-textMuted font-mono">{metric.hint}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECURITY & TRUST SECTION */}
        <section id="security" className="py-20 border-t border-brand-border">
          <motion.div 
            className="text-center max-w-2xl mx-auto space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Fintech-Grade Security Infrastructure</h2>
            <p className="text-brand-textSecondary text-sm md:text-base">
              Bank-grade engineering protecting your data, your device, and your capital reserves.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-brand-border bg-brand-surface/40 hover:bg-brand-surface transition duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-brand-textPrimary mt-4">{badge.title}</h3>
                  <p className="text-brand-textMuted text-xs mt-2 leading-relaxed">{badge.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TESTIMONIALS CAROUSEL */}
        <section id="testimonials" className="py-20 border-t border-brand-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-center">Verified Earner Feedback</h2>
            
            <div className="mt-12 relative overflow-hidden glass-card rounded-[2.5rem] p-8 md:p-12 border border-brand-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-lg md:text-xl text-brand-textPrimary font-medium italic leading-relaxed">
                    "{testimonials[currentTestimonial].note}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary text-black font-black flex items-center justify-center text-sm shadow-md shadow-brand-primary/20">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <p className="font-bold text-brand-textPrimary">{testimonials[currentTestimonial].name}</p>
                      <p className="text-xs text-brand-textSecondary">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-end items-center gap-2 mt-8 md:mt-0 md:absolute md:bottom-8 md:right-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentTestimonial === idx ? "bg-brand-primary w-6" : "bg-brand-textMuted/40"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ACCORDION FAQ */}
        <section className="py-20 border-t border-brand-border">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-center">Frequently Answered Queries</h2>
            
            <div className="mt-12 space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="rounded-2xl border border-brand-border bg-brand-surface/40 overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-brand-textPrimary hover:bg-brand-elevated transition duration-150"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-brand-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="border-t border-brand-border"
                        >
                          <p className="px-6 py-5 text-sm text-brand-textSecondary leading-relaxed bg-brand-bg/20">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-brand-border bg-brand-surface py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-xs text-brand-textSecondary leading-relaxed">
              Premium attention inventory monetization infrastructure for emerging financial systems. Built with security and compliance at the core.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-wider text-brand-textPrimary font-extrabold mb-4">Earning Node</h4>
            <ul className="space-y-2 text-xs text-brand-textSecondary">
              <li><Link to="/signup" className="hover:text-brand-primary transition">Workspace Provision</Link></li>
              <li><a href="#how" className="hover:text-brand-primary transition">System Workflow</a></li>
              <li><a href="#stats" className="hover:text-brand-primary transition">Audited Stats</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-wider text-brand-textPrimary font-extrabold mb-4">Enterprise Trust</h4>
            <ul className="space-y-2 text-xs text-brand-textSecondary">
              <li><a href="#security" className="hover:text-brand-primary transition">Infra Overview</a></li>
              <li><Link to="/verify-email" className="hover:text-brand-primary transition">Email Verification</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-wider text-brand-textPrimary font-extrabold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-xs text-brand-textSecondary">
              <li><a href="#" className="hover:text-brand-primary transition">Terms of Protocol</a></li>
              <li><a href="#" className="hover:text-brand-primary transition">Privacy Regulations</a></li>
              <li><a href="mailto:support@adearn.com.ng" className="hover:text-brand-primary transition">support@adearn.com.ng</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-textMuted">
          <p>&copy; {new Date().getFullYear()} AdEarn Inc. All records digitally certified.</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-brand-danger fill-brand-danger" />
            <span>in Nigeria for global attention networks.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
