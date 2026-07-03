import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "../components/Logo";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please input credential fields.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Authentication failed. Check your credential parameters.");
      setLoading(false);
    } else {
      navigate("/dashboard");
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
            Access Workspace Node
          </h2>
          <p className="text-xs text-brand-textSecondary">
            Or{" "}
            <Link
              to="/signup"
              className="font-bold text-brand-primary hover:underline transition"
            >
              provision a new workspace for free
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

        {/* Login Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                Security Identity Email
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">
                  Vault Password Key
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full min-h-12 rounded-xl bg-brand-bg/50 border border-brand-border pl-11 pr-11 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted font-mono transition"
                  placeholder="••••••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-textMuted hover:text-brand-textPrimary transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                "Authorize Connection"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
