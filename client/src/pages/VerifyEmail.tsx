import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "../components/Logo";

export default function VerifyEmail() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const email = location.state?.email || "your registered security email address";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4 py-12 relative overflow-hidden transition-colors duration-300 noise-bg font-body">
      
      {/* Background Blobs */}
      <div className="ambient-blob w-[400px] h-[400px] bg-brand-primary/10 -top-40 -left-40" />
      <div className="ambient-blob w-[500px] h-[500px] bg-brand-secondary/5 -bottom-40 -right-40" />

      {/* Floating Theme Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-brand-border bg-brand-surface/40 hover:bg-brand-elevated text-brand-textSecondary hover:text-brand-primary transition active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full glass-card rounded-[2.5rem] p-8 md:p-10 border border-brand-border shadow-2xl relative z-10 text-center space-y-6"
      >
        {/* Brand Header */}
        <div className="space-y-3">
          <Logo size="lg" className="mx-auto" />
        </div>

        {/* Info Box */}
        <div className="space-y-4">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="text-xl md:text-2xl font-black text-brand-textPrimary tracking-tight">
            Verify Your Email
          </h2>
          
          <p className="text-xs text-brand-textSecondary leading-relaxed">
            We have transmitted a cryptographically signed verification payload link to <span className="font-bold text-brand-textPrimary">{email}</span>.
          </p>

          <p className="text-[11px] text-brand-textMuted leading-relaxed max-w-sm mx-auto">
            Please access the dispatch link within your email inbox to activate your workspace nodes. Once verified, you may terminate this tab session and access credentials via the login portal below.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            to="/login"
            className="w-full min-h-12 bg-brand-primary hover:bg-[#e09110] text-[#000000] font-black rounded-xl text-sm transition active:scale-95 shadow-lg shadow-brand-primary/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Access Authorization</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
