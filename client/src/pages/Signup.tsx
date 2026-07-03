import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Gift, Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "../components/Logo";

export default function Signup() {
  const { signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") ?? "");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill all required system logs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Vault keys do not match parameter checks.");
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      setError("Vault keys must exceed 8 characters and include numeric inputs.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await signUp(email, password, fullName, referralCode.trim());
    
    if (!result.success) {
      setError(result.error || "Workspace provision failed. Please check network logs.");
      setLoading(false);
    } else {
      if (result.sessionCreated) {
        navigate("/dashboard");
      } else {
        navigate("/verify-email", { state: { email } });
      }
    }
  };

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
        className="max-w-md w-full glass-card rounded-[2.5rem] p-8 md:p-10 border border-brand-border shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Logo size="lg" className="mx-auto" />
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-brand-textPrimary mt-4">
            Provision Workspace
          </h2>
          <p className="text-xs text-brand-textSecondary">
            Or{" "}
            <Link
              to="/login"
              className="font-bold text-brand-primary hover:underline transition"
            >
              authenticate existing connection
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 bg-brand-danger/10 border-l-4 border-brand-danger p-4 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="h-5 w-5 text-brand-danger shrink-0 mt-0.5" />
            <p className="text-xs text-brand-danger font-bold leading-relaxed">{error}</p>
          </motion.div>
        )}

        {/* Signup Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            
            {/* Legal Name */}
            <div className="space-y-1.5">
              <label htmlFor="full-name" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                Legal Entity Name <span className="text-brand-danger">*</span>
              </label>
              <div className="relative">
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full min-h-12 rounded-xl bg-brand-bg/50 border border-brand-border pl-11 pr-4 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted transition"
                  placeholder="John Doe"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                Network Identity Email <span className="text-brand-danger">*</span>
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full min-h-12 rounded-xl bg-brand-bg/50 border border-brand-border pl-11 pr-4 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted font-mono transition"
                  placeholder="name@domain.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                  Create Key <span className="text-brand-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full min-h-12 rounded-xl bg-brand-bg/50 border border-brand-border pl-11 pr-4 text-xs text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted font-mono transition"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                  Verify Key <span className="text-brand-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full min-h-12 rounded-xl bg-brand-bg/50 border border-brand-border pl-11 pr-4 text-xs text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted font-mono transition"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                </div>
              </div>
            </div>

            {/* Toggle show password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-brand-textSecondary hover:text-brand-primary transition flex items-center gap-1 font-bold"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Vault Key</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Vault Key</span>
                  </>
                )}
              </button>
            </div>

            {/* Referral Code */}
            <div className="space-y-1.5">
              <label htmlFor="referral-code" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                Partner Affiliate Code (Optional)
              </label>
              <div className="relative">
                <input
                  id="referral-code"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  disabled={loading}
                  className="w-full min-h-12 rounded-xl bg-brand-bg/50 border border-brand-border pl-11 pr-4 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted font-mono uppercase transition"
                  placeholder="REF12345"
                />
                <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-12 bg-brand-primary hover:bg-[#e09110] text-[#000000] font-black rounded-xl text-sm transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/10 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
              ) : (
                "Provision Secure Workspace"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
