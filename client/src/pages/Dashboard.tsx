import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Play,
  TrendingUp,
  Wallet,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
  Moon,
  Sun,
  Loader2,
  Plus,
  Minus,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "../lib/api";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "../components/Logo";
import SocialTasks from "./SocialTasks";

type ApiResponse<T> = { success: boolean; data: T };
type PlatformSettings = {
  daily_ad_limit: number;
  daily_ip_ad_limit: number;
  ad_cooldown_seconds: number;
  daily_social_task_limit: number;
};
type Ad = { id: string; ad_network: string; ad_unit_id: string; ad_type: string; points_reward: number; duration_seconds: number; is_active: boolean };
type Withdrawal = { id: string; amount_naira: number; points_spent: number; bank_name: string; account_number: string; account_name: string; status: string; created_at: string; rejection_reason?: string };
type View = { id: string; created_at: string; completed_at?: string; points_earned: number; completed: boolean; watch_duration?: number; ads?: { ad_network: string; duration_seconds: number } | { ad_network: string; duration_seconds: number }[] };

const banks = [
  ["Access Bank", "044"], ["GTBank", "058"], ["First Bank", "011"], ["Zenith Bank", "057"], ["UBA", "033"], ["Fidelity Bank", "070"],
  ["Sterling Bank", "232"], ["Polaris Bank", "076"], ["Kuda Bank", "50211"], ["Opay", "100004"], ["Palmpay", "100033"], ["Moniepoint", "50515"],
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Reusable animated counter component
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const duration = 1.2; // seconds
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = Math.floor(ease * (end - start) + start);

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

// Skeleton loaders
function Skeleton({ className }: { className: string }) {
  return (
    <div className={cx("relative overflow-hidden rounded-2xl bg-brand-elevated/40 border border-brand-border/40", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-brand-elevated/80 to-transparent" />
    </div>
  );
}

function Toast({ message, type = "info", onClose }: { message: string | null; type?: "info" | "success" | "error"; onClose?: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          className="fixed top-6 right-6 z-[100] max-w-sm glass-card-elevated rounded-2xl p-4 shadow-2xl flex items-center gap-3 border border-brand-border"
        >
          {type === "success" && <CheckCircle2 className="w-5 h-5 text-brand-success flex-shrink-0" />}
          {type === "error" && <AlertCircle className="w-5 h-5 text-brand-danger flex-shrink-0" />}
          {type === "info" && <Sparkles className="w-5 h-5 text-brand-primary flex-shrink-0" />}
          <span className="text-sm font-semibold text-brand-textPrimary">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Global premium layout shell
function Shell({ children, adminMode }: { children: React.ReactNode; adminMode?: boolean }) {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const nav: [string, string, LucideIcon][] = adminMode
    ? [
        ["/admin", "Overview", LayoutDashboard],
        ["/admin/users", "Users", Users],
        ["/admin/withdrawals", "Withdrawals", Wallet],
        ["/admin/ads", "Ads", Play],
        ["/admin/fraud", "Fraud Flags", Shield],
        ["/admin/settings", "Task Limits", SlidersHorizontal]
      ]
    : [
        ["/dashboard", "Dashboard", LayoutDashboard],
        ["/dashboard/tasks", "Social Tasks", Sparkles],
        ["/dashboard/watch", "Watch Ads", Play],
        ["/dashboard/earnings", "Earnings", TrendingUp],
        ["/dashboard/withdraw", "Withdraw", Wallet],
        ["/dashboard/referrals", "Referrals", Users],
        ["/dashboard/settings", "Settings", SettingsIcon]
      ];

  const currentTabPath = location.pathname;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-textPrimary font-body pb-32">
      {/* Background blobs for luxury depth */}
      <div className="ambient-blob w-[400px] h-[400px] bg-brand-primary/10 top-[10%] left-[5%]" />
      <div className="ambient-blob w-[500px] h-[500px] bg-brand-secondary/5 bottom-[20%] right-[10%]" />

      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            {adminMode && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-danger/20 text-brand-danger border border-brand-danger/30">
                Admin Console
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-brand-border hover:bg-brand-elevated text-brand-textSecondary hover:text-brand-primary transition active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-2 border border-brand-border/60 bg-brand-surface/40 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-success" />
              <span>{profile?.full_name ?? "Verified Earner"}</span>
            </div>

            <button
              onClick={async () => {
                await logout();
                navigate("/login");
              }}
              className="p-2 rounded-xl border border-brand-border hover:bg-brand-elevated text-brand-textSecondary hover:text-brand-danger transition active:scale-95"
              title="Logout Workspace"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* IOS FLOATING GLASS NAVIGATION DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-2.5 rounded-2xl glass-card border border-brand-border shadow-2xl max-w-[95vw] overflow-x-auto scrollbar-none">
        {nav.map(([href, label, IconComponent]) => {
          const isActive = currentTabPath === href || (href !== "/dashboard" && currentTabPath.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              className={cx(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 active:scale-95 whitespace-nowrap",
                isActive
                  ? "text-black"
                  : "text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-elevated/55"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-dock-tab"
                  className="absolute inset-0 bg-brand-primary rounded-xl -z-10 shadow-lg shadow-brand-primary/20 glow-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Bento Dashboard Home Page
function DashboardHome() {
  const { profile, user } = useAuth();
  const [views, setViews] = useState<View[] | null>(null);
  const [today, setToday] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(20);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("ad_views")
      .select("id,created_at,completed_at,points_earned,completed,watch_duration,ads(ad_network,duration_seconds)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setViews((data as View[]) ?? []));
      
    api.get<ApiResponse<{ today_count: number; daily_limit: number }>>("/api/ads/progress", {})
      .then((result) => {
        setToday(result.data.today_count);
        setDailyLimit(result.data.daily_limit);
      })
      .catch(() => setToday(0));
  }, [user]);

  const cards = [
    { label: "Total Earned", val: profile?.total_earned ?? 0, hint: "All-time verified pts" },
    { label: "Total Cashed Out", val: `\u20A6${(profile?.total_withdrawn ?? 0).toLocaleString()}`, hint: "Settled payments" },
    { label: "Campaign Capacity", val: `${today} / ${dailyLimit}`, hint: "Daily threshold limit" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-textMuted">Operational Workspace</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1 font-sans">
            Welcome back, <span className="text-gradient-accent">{profile?.full_name?.split(" ")[0] ?? "Partner"}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {profile?.is_admin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-brand-danger/15 hover:bg-brand-danger/25 text-brand-danger font-black px-5 py-2.5 rounded-xl transition duration-150 active:scale-95 border border-brand-danger/30 hover:border-brand-danger/50"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
          <Link 
            to="/dashboard/tasks" 
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-black font-black px-5 py-2.5 rounded-xl transition duration-150 active:scale-95 shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Earning Hub</span>
          </Link>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        
        {/* Large Bento Feature Tile - Balance */}
        <div className="md:col-span-2 glass-card rounded-3xl p-8 border border-brand-border flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-primary/10 to-transparent opacity-40 rounded-bl-full pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-textSecondary">Available Balance Reserves</span>
              <span className="text-[10px] text-brand-success font-bold px-2 py-0.5 rounded bg-brand-success/15 border border-brand-success/20">
                Verifiably Settled
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black font-digital text-brand-primary glow-text-primary tracking-tight">
                &#8358;<AnimatedNumber value={Math.floor((profile?.balance_points ?? 0) / 10)} />
              </div>
              <p className="text-sm font-semibold text-brand-textSecondary">
                Equivalent to <span className="font-mono text-brand-textPrimary">{(profile?.balance_points ?? 0).toLocaleString()}</span> points
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/dashboard/withdraw"
              className="flex-1 min-h-12 bg-white hover:bg-gray-100 text-black font-black rounded-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg"
            >
              <span>Instant Liquidity Settlement</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-xs text-brand-textSecondary font-semibold">
              <Shield className="w-4 h-4 text-brand-success" />
              <span>Secure escrow guarantee</span>
            </div>
          </div>
        </div>

        {/* Bento Card - Daily Limits / Mini Sparkline */}
        <div className="glass-card rounded-3xl p-6 border border-brand-border flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-brand-textSecondary uppercase">
              <span>Daily Allocation</span>
              <Activity className="w-4 h-4 text-brand-primary" />
            </div>
            <p className="mt-4 text-3xl font-black font-digital text-brand-textPrimary">{today} / {dailyLimit}</p>
            <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
              You have processed {today} campaigns. Max limit resets in 24 hours.
            </p>
          </div>

          {/* Simple Vector Sparkline Chart for dashboard elegance */}
          <div className="h-16 w-full mt-6 bg-brand-bg/40 border border-brand-border/40 rounded-xl overflow-hidden flex items-end">
            <svg className="w-full h-12 text-brand-primary" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d="M0,25 Q15,10 30,22 T60,5 T90,15 T100,8 L100,30 L0,30 Z"
                fill="url(#sparkline-grad)"
                stroke="var(--brand-primary)"
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bento grid rows - Secondary indicators */}
        {cards.map((card, i) => (
          <div key={i} className="glass-card rounded-3xl p-6 border border-brand-border flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">{card.label}</span>
            <div className="mt-4">
              <p className="text-2xl font-black font-digital text-brand-textPrimary">
                {typeof card.val === "number" ? <AnimatedNumber value={card.val} /> : card.val}
              </p>
              <p className="text-xs text-brand-textSecondary mt-1">{card.hint}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY BENTO CARD */}
      <section className="glass-card rounded-3xl p-6 border border-brand-border space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold font-sans">Recent Ledger Operations</h2>
            <p className="text-xs text-brand-textSecondary mt-0.5">Real-time status updates of your verified tasks</p>
          </div>
          <Link to="/dashboard/earnings" className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1">
            <span>Detailed Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {views === null ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : views.length === 0 ? (
          <div className="text-center py-8 text-brand-textMuted text-sm">
            No activity logged. Execute social tasks or ad views to update index.
          </div>
        ) : (
          <div className="divide-y divide-brand-border/40">
            {views.map((view) => (
              <div key={view.id} className="flex items-center justify-between py-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary text-xs font-bold">
                    AD
                  </div>
                  <div>
                    <p className="font-semibold text-brand-textPrimary">
                      {Array.isArray(view.ads) ? view.ads[0]?.ad_network : view.ads?.ad_network ?? "Micro Placement"}
                    </p>
                    <p className="text-[10px] text-brand-textMuted font-mono">
                      {new Date(view.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-digital font-bold text-brand-primary">+{view.points_earned} pts</span>
                  <span className={cx(
                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border",
                    view.completed 
                      ? "bg-brand-success/10 text-brand-success border-brand-success/20" 
                      : "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                  )}>
                    {view.completed ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Watch Video Ads Component
function WatchAds() {
  const { token, refreshProfile } = useAuth();
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [progress, setProgress] = useState({ today_count: 0, daily_limit: 20, cooldown_seconds_remaining: 0 });
  const [active, setActive] = useState<(Ad & { view_id: string }) | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "info" | "success" | "error" } | null>(null);

  const load = async () => {
    const access = await token();
    const [adResult, progressResult] = await Promise.all([
      api.get<ApiResponse<{ ads: Ad[] }>>("/api/ads", { token: access }),
      api.get<ApiResponse<typeof progress>>("/api/ads/progress", { token: access }),
    ]);
    setAds(adResult.data.ads);
    setProgress(progressResult.data);
  };

  useEffect(() => {
    load().catch((error) => setToast({ message: error.message, type: "error" }));
  }, []);

  useEffect(() => {
    if (!active) return;
    setRemaining(active.duration_seconds);
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  const start = async (ad: Ad) => {
    const access = await token();
    const result = await api.post<ApiResponse<{ view_id: string } & Ad>>("/api/ads/view/start", { ad_id: ad.id }, { token: access });
    setActive({ ...ad, ...result.data });
  };

  const claim = async () => {
    if (!active) return;
    const access = await token();
    const result = await api.post<ApiResponse<{ message: string }>>("/api/ads/view/complete", { view_id: active.view_id }, { token: access });
    setToast({ message: result.data.message, type: "success" });
    setActive(null);
    await refreshProfile();
    await load();
  };

  const limitReached = progress.today_count >= progress.daily_limit;

  return (
    <div className="space-y-8">
      <Toast message={toast?.message ?? null} type={toast?.type} onClose={() => setToast(null)} />
      
      <div>
        <h1 className="text-3xl font-black tracking-tight font-sans">Attention Streaming Placement</h1>
        <p className="text-sm text-brand-textSecondary mt-1">Stream active video campaigns to earn Naira settlements instantly.</p>
        
        {/* Progress bar details */}
        <div className="mt-6 p-5 rounded-2xl border border-brand-border bg-brand-surface/40 space-y-3">
          <div className="flex justify-between text-xs font-bold text-brand-textSecondary">
            <span>Daily Capacity Target</span>
            <span>{progress.today_count} / {progress.daily_limit} video sessions</span>
          </div>
          <div className="h-2.5 w-full bg-brand-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (progress.today_count / progress.daily_limit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {progress.cooldown_seconds_remaining > 0 && (
        <div className="rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-4 text-xs font-semibold text-brand-primary flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>System cooling interface active. Delay required: {progress.cooldown_seconds_remaining} seconds remaining.</span>
        </div>
      )}

      {ads === null ? (
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-3xl border border-brand-border bg-brand-surface/20 p-12 text-center text-brand-textSecondary text-sm font-semibold">
          No ad channels active right now. Please refresh later.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {ads.map((ad) => (
            <div key={ad.id} className="glass-card p-6 rounded-3xl border border-brand-border flex flex-col justify-between h-52 hover:border-brand-primary/30 transition-all duration-300">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted bg-brand-elevated border border-brand-border/60 px-2 py-0.5 rounded-lg">
                  {ad.ad_network}
                </span>
                <p className="mt-4 text-3xl font-black font-digital text-brand-primary glow-text-primary">+{ad.points_reward}</p>
                <p className="text-xs text-brand-textSecondary mt-1">{ad.duration_seconds}s target duration ({ad.ad_type})</p>
              </div>
              <button
                disabled={limitReached || progress.cooldown_seconds_remaining > 0}
                onClick={() => start(ad).catch((error) => setToast({ message: error.message, type: "error" }))}
                className="w-full min-h-11 rounded-xl bg-brand-primary hover:bg-[#d88c10] text-[#000000] text-xs font-black transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 shadow-md shadow-brand-primary/10 mt-4 cursor-pointer"
              >
                Launch Streaming
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active ad view modal frame */}
      {active && (
        <div className="fixed inset-0 z-50 bg-[#000000]/90 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[85vh] glass-card-elevated rounded-3xl p-6 border border-brand-border flex flex-col gap-4 overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
              <div>
                <span className="text-xs text-brand-textSecondary uppercase tracking-wider font-bold">Ad Session active</span>
                <p className="text-xs text-brand-primary font-mono mt-0.5">
                  Verification active. Keep page open: {Math.max(0, remaining)}s
                </p>
              </div>
              <button 
                onClick={() => setActive(null)} 
                className="text-xs font-bold text-brand-textSecondary hover:text-brand-textPrimary px-4 py-2 border border-brand-border hover:bg-brand-elevated rounded-xl transition active:scale-95"
              >
                Terminate Stream
              </button>
            </div>

            <iframe 
              title="Ad container" 
              src={`/ad-container.html?network=${active.ad_network}&unit_id=${active.ad_unit_id}`} 
              className="flex-1 w-full rounded-2xl border border-brand-border bg-white" 
            />

            <button
              disabled={remaining > active.duration_seconds * 0.15}
              onClick={() => claim().catch((error) => setToast({ message: error.message, type: "error" }))}
              className="min-h-12 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-black font-black transition disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 w-full flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Verify Settlement & Claim</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Withdraw Funds Page
function Withdraw() {
  const { profile, token, refreshProfile } = useAuth();
  const [form, setForm] = useState({ bank_name: banks[0][0], bank_code: banks[0][1], account_number: "", account_name: "", amount_naira: "1000" });
  const [history, setHistory] = useState<Withdrawal[] | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "info" | "success" | "error" } | null>(null);
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const pointsNeeded = Number(form.amount_naira || 0) * 10;

  const loadHistory = async () => {
    const access = await token();
    const result = await api.get<ApiResponse<{ withdrawals: Withdrawal[] }>>("/api/withdrawals/history", { token: access });
    setHistory(result.data.withdrawals);
  };

  useEffect(() => {
    loadHistory().catch(() => setHistory([]));
  }, []);

  const verify = async () => {
    if (form.account_number.length !== 10) return;
    setVerifyingAccount(true);
    setToast(null);
    try {
      const access = await token();
      const result = await api.get<ApiResponse<{ account_name: string }>>(`/api/withdrawals/verify-account?account_number=${form.account_number}&bank_code=${form.bank_code}`, { token: access });
      setForm((current) => ({ ...current, account_name: result.data.account_name }));
      setToast({ message: "Bank Account Verified!", type: "success" });
    } catch (error: any) {
      setToast({ message: error.message || "Failed to verify account details.", type: "error" });
    } finally {
      setVerifyingAccount(false);
    }
  };

  const submit = async () => {
    if (!form.account_name || Number(form.amount_naira) < 1000) return;
    setSubmittingRequest(true);
    setToast(null);
    try {
      const access = await token();
      const result = await api.post<ApiResponse<{ message: string }>>("/api/withdrawals/request", { ...form, amount_naira: Number(form.amount_naira) }, { token: access });
      setToast({ message: result.data.message, type: "success" });
      await refreshProfile();
      await loadHistory();
    } catch (error: any) {
      setToast({ message: error.message || "Payout request failed.", type: "error" });
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="space-y-8">
      <Toast message={toast?.message ?? null} type={toast?.type} onClose={() => setToast(null)} />
      
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight font-sans">Settlement Center</h1>
        <p className="text-sm text-brand-textSecondary">Convert your earned attention points into direct Naira bank transfers.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1.5fr] items-start">
        
        {/* Settlement Form */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-brand-border space-y-6">
          <h2 className="text-lg font-bold text-brand-textPrimary flex items-center gap-2 border-b border-brand-border/40 pb-4">
            <Wallet className="w-5 h-5 text-brand-primary" />
            <span>Withdraw Reserves</span>
          </h2>

          <div className="space-y-4">
            {/* Bank Name Select */}
            <div className="relative">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted mb-1.5">
                Financial Node / Bank
              </label>
              <div className="relative">
                <select
                  value={form.bank_code}
                  onChange={(e) => {
                    const bank = banks.find((item) => item[1] === e.target.value) ?? banks[0];
                    setForm({ ...form, bank_name: bank[0], bank_code: bank[1], account_name: "" });
                  }}
                  className="w-full min-h-12 rounded-xl border border-brand-border bg-brand-bg px-4 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none cursor-pointer"
                >
                  {banks.map(([name, code]) => (
                    <option key={code} value={code} className="bg-brand-surface">
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-brand-textSecondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Account Number Input */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted mb-1.5">
                10-Digit Account Number
              </label>
              <input
                type="text"
                required
                value={form.account_number}
                onChange={(e) => setForm({ ...form, account_number: e.target.value.replace(/\D/g, "").slice(0, 10), account_name: "" })}
                placeholder="0123456789"
                className="w-full min-h-12 rounded-xl border border-brand-border bg-brand-bg px-4 text-sm text-brand-textPrimary font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted"
              />
            </div>

            {/* Verify Details Button */}
            <button
              onClick={verify}
              disabled={form.account_number.length !== 10 || verifyingAccount}
              className="w-full min-h-11 rounded-xl bg-brand-surface hover:bg-brand-elevated border border-brand-border hover:border-brand-primary/40 text-brand-textPrimary text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {verifyingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                  <span>Verifying Node Registry...</span>
                </>
              ) : (
                <span>Verify Bank Account</span>
              )}
            </button>

            {/* Verified Account Name Indicator */}
            {form.account_name && (
              <div className="rounded-xl border border-brand-success/30 bg-brand-success/10 p-3 text-xs font-bold text-brand-success flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{form.account_name}</span>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted mb-1.5">
                Withdrawal Amount (&#8358;)
              </label>
              <input
                type="text"
                required
                value={form.amount_naira}
                onChange={(e) => setForm({ ...form, amount_naira: e.target.value.replace(/\D/g, "") })}
                className="w-full min-h-12 rounded-xl border border-brand-border bg-brand-bg px-4 text-sm text-brand-textPrimary font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Calculation summary */}
            <div className="p-4 bg-brand-bg/50 border border-brand-border rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-brand-textSecondary">
                <span>Points Required:</span>
                <span className="font-mono text-brand-textPrimary font-bold">{pointsNeeded.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between text-brand-textSecondary">
                <span>Remnants after transfer:</span>
                <span className="font-mono text-brand-textPrimary font-bold">
                  {Math.max(0, (profile?.balance_points ?? 0) - pointsNeeded).toLocaleString()} pts
                </span>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={!form.account_name || Number(form.amount_naira) < 1000 || submittingRequest}
              className="w-full min-h-12 rounded-xl bg-brand-primary hover:bg-[#e09110] text-black text-sm font-black transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-primary/15 cursor-pointer mt-4"
            >
              {submittingRequest ? "Settling liquidity..." : "Confirm Settlement Outflow"}
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-brand-textPrimary">Settlement Logs</h3>
          <HistoryTable rows={history} />
        </div>
      </div>
    </div>
  );
}

function HistoryTable({ rows }: { rows: Withdrawal[] | null }) {
  if (rows === null) return <Skeleton className="h-80 w-full" />;
  return (
    <div className="overflow-hidden rounded-3xl border border-brand-border bg-brand-surface/40 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-elevated/50 text-[10px] uppercase tracking-wider text-brand-textSecondary border-b border-brand-border/60">
            <tr>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold">Amount</th>
              <th className="p-4 font-bold">Bank / Account</th>
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 text-xs">
            {rows.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-brand-textMuted" colSpan={4}>
                  No withdrawal records indexed.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-brand-elevated/20 transition">
                  <td className="p-4 font-mono text-brand-textSecondary">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold font-mono text-brand-textPrimary">
                    &#8358;{row.amount_naira.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-brand-textPrimary">{row.bank_name}</p>
                    <p className="text-[10px] text-brand-textMuted font-mono">{row.account_number}</p>
                  </td>
                  <td className="p-4">
                    <span className={cx(
                      "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                      row.status === "paid" && "bg-brand-success/10 text-brand-success border-brand-success/20",
                      row.status === "rejected" && "bg-brand-danger/10 text-brand-danger border-brand-danger/20",
                      row.status === "pending" && "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Referrals Component
function Referrals() {
  const { profile, user } = useAuth();
  const [rows, setRows] = useState<any[] | null>(null);
  const link = `https://adearn.com.ng/signup?ref=${profile?.referral_code ?? ""}`;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("referrals")
        .select("*,users!referrals_referred_id_fkey(full_name,created_at)")
        .or(`referrer_id.eq.${user.id},referred_id.eq.${user.id}`)
        .then(({ data }) => setRows(data ?? []));
    }
  }, [user]);

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight font-sans">Node Affiliate Hub</h1>
        <p className="text-sm text-brand-textSecondary">Invite new operators to provision workspaces and receive points bonuses.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Onboarding Reward", val: "500 pts", desc: "For each registered partner" },
          { label: "Engagement Bonus", val: "200 pts", desc: "Upon their first verified ad stream" },
          { label: "Active Network Members", val: rows?.length ?? 0, desc: "Total successfully referred" }
        ].map((box, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-brand-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMuted">{box.label}</span>
            <p className="mt-4 text-3xl font-black font-digital text-brand-textPrimary">{box.val}</p>
            <p className="text-xs text-brand-textSecondary mt-1">{box.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 border border-brand-border space-y-6">
        <h3 className="text-lg font-bold text-brand-textPrimary flex items-center gap-2">
          <Copy className="w-5 h-5 text-brand-primary" />
          <span>Affiliate Link Generator</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={link}
            className="min-h-12 flex-1 rounded-xl bg-brand-bg border border-brand-border px-4 text-xs text-brand-textSecondary font-mono focus:outline-none"
          />
          <button
            onClick={copy}
            className="min-h-12 px-6 rounded-xl bg-brand-primary hover:bg-[#e09110] text-[#000000] text-xs font-bold transition active:scale-95 shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 cursor-pointer"
          >
            <span>{copied ? "Copied Link" : "Copy Link"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(link)}`}
            className="px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface/40 hover:bg-brand-elevated text-xs font-semibold transition active:scale-95"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(link)}`}
            className="px-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface/40 hover:bg-brand-elevated text-xs font-semibold transition active:scale-95"
          >
            Share on X
          </a>
        </div>
      </div>

      <section className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
        <h3 className="text-base font-bold text-brand-textPrimary">Your Referral Network</h3>
        
        {rows === null ? (
          <Skeleton className="h-44 w-full" />
        ) : rows.length === 0 ? (
          <p className="text-xs text-brand-textMuted py-4 text-center">No affiliate nodes registered under your link.</p>
        ) : (
          <div className="divide-y divide-brand-border/40">
            {rows.map((row) => (
              <div key={row.id} className="flex justify-between items-center py-3 text-xs">
                <div>
                  <p className="font-semibold text-brand-textPrimary">Node Member</p>
                  <p className="text-[10px] text-brand-textMuted font-mono">{new Date(row.created_at).toLocaleDateString()}</p>
                </div>
                <span className="font-mono text-brand-success font-bold flex items-center gap-1">
                  +{row.total_bonus_points} pts settled
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Earnings Component (Comprehensive Ledger)
function Earnings() {
  const { user } = useAuth();
  const [views, setViews] = useState<View[] | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[] | null>(null);
  const [tab, setTab] = useState("ads");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("ad_views")
      .select("*,ads(ad_network,duration_seconds)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setViews((data as View[]) ?? []));
      
    supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setWithdrawals((data as Withdrawal[]) ?? []));
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight font-sans">Earning Ledger</h1>
          <p className="text-sm text-brand-textSecondary mt-1">Review historical settlements and flow operations.</p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-xl bg-brand-surface border border-brand-border p-1">
          <button
            onClick={() => setTab("ads")}
            className={cx(
              "rounded-lg px-4 py-1.5 text-xs font-bold transition",
              tab === "ads" ? "bg-brand-primary text-black" : "text-brand-textSecondary hover:text-brand-textPrimary"
            )}
          >
            Streaming Logs
          </button>
          <button
            onClick={() => setTab("withdrawals")}
            className={cx(
              "rounded-lg px-4 py-1.5 text-xs font-bold transition",
              tab === "withdrawals" ? "bg-brand-primary text-black" : "text-brand-textSecondary hover:text-brand-textPrimary"
            )}
          >
            Settlement Logs
          </button>
        </div>
      </div>

      {tab === "ads" ? (
        views === null ? (
          <Skeleton className="h-80 w-full" />
        ) : views.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-brand-textMuted text-xs font-semibold">
            No stream logs indexed.
          </div>
        ) : (
          <div className="glass-card rounded-3xl border border-brand-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-elevated/50 text-[10px] uppercase tracking-wider text-brand-textSecondary border-b border-brand-border/60">
                  <tr>
                    <th className="p-4 font-bold">Timestamp</th>
                    <th className="p-4 font-bold">Campaign Details</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Points Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 text-xs">
                  {views.map((view) => (
                    <tr key={view.id} className="hover:bg-brand-elevated/20 transition">
                      <td className="p-4 font-mono text-brand-textSecondary">
                        {new Date(view.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-brand-textPrimary">
                        {Array.isArray(view.ads) ? view.ads[0]?.ad_network : view.ads?.ad_network ?? "Ad Placement"}
                      </td>
                      <td className="p-4">
                        <span className={cx(
                          "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                          view.completed 
                            ? "bg-brand-success/10 text-brand-success border-brand-success/20" 
                            : "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                        )}>
                          {view.completed ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right font-digital font-black text-brand-primary">
                        +{view.points_earned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <HistoryTable rows={withdrawals} />
      )}
    </div>
  );
}

// Workspace Settings
function Settings() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setToast(null);
    try {
      const { error } = await supabase.from("users").update({ full_name: fullName, phone }).eq("id", profile.id);
      if (error) throw error;
      await refreshProfile();
      setToast({ message: "Settings saved successfully", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update profile logs.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toast message={toast?.message ?? null} type={toast?.type} onClose={() => setToast(null)} />
      
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight font-sans">Workspace Settings</h1>
        <p className="text-sm text-brand-textSecondary">Configure identity metadata parameters and credentials.</p>
      </div>

      {/* Profile Form */}
      <section className="glass-card rounded-3xl p-6 md:p-8 border border-brand-border space-y-6">
        <h2 className="text-lg font-bold text-brand-textPrimary border-b border-brand-border/40 pb-4">
          Identity Profile Logs
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full min-h-12 rounded-xl border border-brand-border bg-brand-bg px-4 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-textMuted mb-1.5">
              Mobile Contact Identifier
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="w-full min-h-12 rounded-xl border border-brand-border bg-brand-bg px-4 text-sm text-brand-textPrimary font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="text-xs text-brand-textSecondary pt-2">
            Workspace Account Email: <span className="font-mono text-brand-textPrimary font-semibold">{profile?.email}</span>
          </div>

          <button
            onClick={save}
            disabled={saving || !fullName.trim()}
            className="min-h-11 px-6 rounded-xl bg-brand-primary hover:bg-[#e09110] text-[#000000] text-xs font-bold transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-primary/10 cursor-pointer mt-4"
          >
            {saving ? "Saving settings..." : "Commit Settings Changes"}
          </button>
        </div>
      </section>

      {/* Security credentials info block */}
      <section className="glass-card rounded-3xl p-6 border border-brand-border space-y-3">
        <h3 className="text-base font-bold text-brand-textPrimary">Access & Security</h3>
        <p className="text-xs text-brand-textSecondary leading-relaxed">
          Security parameters and credential hashes are managed via our Supabase vault identity engine. You can reset credentials directly from the primary access gateway interface.
        </p>
      </section>

      {/* Danger Zone */}
      <section className="glass-card rounded-3xl p-6 border border-brand-danger/30 space-y-4">
        <h3 className="text-base font-bold text-brand-danger">Workspace Operations Danger Zone</h3>
        <p className="text-xs text-brand-textSecondary leading-relaxed">
          De-provisioning of operational workspaces requires manual audit reviews to preserve regulatory fraud compliance and payout log histories.
        </p>
      </section>
    </div>
  );
}

// Admin Task Limits Panel
function AdminSettings() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    token()
      .then((access) => api.get<ApiResponse<{ settings: PlatformSettings }>>("/api/admin/settings", { token: access }))
      .then((result) => setSettings(result.data.settings))
      .catch((err) => setError(err.message));
  }, []);

  const fields: { key: keyof PlatformSettings; label: string; hint: string; step?: number }[] = [
    { key: "daily_ad_limit", label: "Daily Ad Limit", hint: "Max ads each user can watch per day", step: 1 },
    { key: "daily_ip_ad_limit", label: "Daily IP Ad Limit", hint: "Max ad completions per IP address per day", step: 1 },
    { key: "ad_cooldown_seconds", label: "Ad Cooldown (seconds)", hint: "Wait time between ad sessions", step: 5 },
    { key: "daily_social_task_limit", label: "Daily Social Task Limit", hint: "Max social tasks each user can complete per day", step: 1 },
  ];

  const adjust = (key: keyof PlatformSettings, delta: number) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: Math.max(0, settings[key] + delta) });
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const access = await token();
      const result = await api.patch<ApiResponse<{ settings: PlatformSettings; message: string }>>(
        "/api/admin/settings",
        settings,
        { token: access }
      );
      setSettings(result.data.settings);
      setMessage(result.data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return error ? (
      <div className="glass-card rounded-3xl p-6 border border-brand-danger/30 text-brand-danger text-sm">{error}</div>
    ) : (
      <Skeleton className="h-80 w-full" />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight font-sans">Task Limits</h1>
        <p className="text-sm text-brand-textSecondary mt-2">
          Increase or decrease earning limits across the platform. Changes apply immediately for all users.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-brand-success/30 bg-brand-success/10 px-4 py-3 text-sm text-brand-success font-semibold">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-brand-danger/30 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger font-semibold">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="glass-card rounded-3xl p-6 border border-brand-border space-y-4">
            <div>
              <h3 className="text-base font-bold text-brand-textPrimary">{field.label}</h3>
              <p className="text-xs text-brand-textSecondary mt-1">{field.hint}</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => adjust(field.key, -(field.step ?? 1))}
                className="h-11 w-11 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-elevated text-brand-textPrimary transition active:scale-95 flex items-center justify-center"
                aria-label={`Decrease ${field.label}`}
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                value={settings[field.key]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!Number.isFinite(value)) return;
                  setSettings({ ...settings, [field.key]: value });
                  setMessage(null);
                  setError(null);
                }}
                className="w-24 text-center text-2xl font-black font-mono rounded-xl border border-brand-border bg-brand-bg px-3 py-2 text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />

              <button
                type="button"
                onClick={() => adjust(field.key, field.step ?? 1)}
                className="h-11 w-11 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-elevated text-brand-textPrimary transition active:scale-95 flex items-center justify-center"
                aria-label={`Increase ${field.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="min-h-12 px-8 rounded-xl bg-brand-primary hover:bg-[#e09110] text-black font-black transition active:scale-95 disabled:opacity-40"
      >
        {saving ? "Saving limits..." : "Save Task Limits"}
      </button>
    </div>
  );
}

// Admin Component Panel
function Admin() {
  const { profile, token } = useAuth();
  const [data, setData] = useState<any>(null);
  const location = useLocation();

  const isSettingsPage = location.pathname.endsWith("/settings");

  useEffect(() => {
    if (isSettingsPage) return;
    token()
      .then((access) => 
        api.get<ApiResponse<any>>(
          location.pathname === "/admin" 
            ? "/api/admin/overview" 
            : location.pathname.endsWith("/fraud") 
              ? "/api/admin/fraud-flags" 
              : `/api/admin/${location.pathname.split("/").pop()}`, 
          { token: access }
        )
      )
      .then((result) => setData(result.data))
      .catch((error) => setData({ error: error.message }));
  }, [location.pathname, isSettingsPage]);

  if (!profile?.is_admin) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto glass-card rounded-3xl p-8 border border-brand-danger/30">
          <AlertCircle className="w-12 h-12 text-brand-danger mx-auto" />
          <h2 className="text-xl font-bold mt-4">Security Level Violation</h2>
          <p className="text-xs text-brand-textSecondary mt-2">
            Administrator authorization tokens are required to access this endpoint path.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isSettingsPage ? (
        <AdminSettings />
      ) : (
        <>
          <h1 className="text-3xl font-black tracking-tight font-sans">Admin Console</h1>
          
          {data === null ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="glass-card rounded-3xl p-6 border border-brand-border">
              <pre className="overflow-auto text-xs text-brand-textPrimary font-mono p-4 bg-brand-bg/50 rounded-2xl border border-brand-border/60 max-h-[60vh] scrollbar-thin">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Router dispatcher for page routes
export default function Dashboard({ adminMode = false }: { adminMode?: boolean }) {
  const location = useLocation();
  
  const page = useMemo(() => {
    return location.pathname.split("/")[2] ?? "";
  }, [location.pathname]);

  if (adminMode) {
    return (
      <Shell adminMode>
        <Admin />
      </Shell>
    );
  }

  const content = 
    page === "tasks" ? <SocialTasks /> :
    page === "watch" ? <WatchAds /> : 
    page === "withdraw" ? <Withdraw /> : 
    page === "referrals" ? <Referrals /> : 
    page === "earnings" ? <Earnings /> : 
    page === "settings" ? <Settings /> : 
    <DashboardHome />;

  return <Shell>{content}</Shell>;
}
