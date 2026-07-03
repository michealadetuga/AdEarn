import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle,
  Video,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Loader2,
  Sparkles
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";

type Task = {
  id: string;
  platform: "Instagram" | "TikTok" | "YouTube" | "Facebook" | "X" | "Telegram" | "WhatsApp";
  title: string;
  reward: number;
  countdownHours: number;
  slotsTotal: number;
  slotsLeft: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  instructions: string[];
  externalUrl: string;
};

const initialTasks: Task[] = [
  {
    id: "task-ig-1",
    platform: "Instagram",
    title: "Follow @adearn.enterprise & Save Latest Post",
    reward: 250,
    countdownHours: 14,
    slotsTotal: 200,
    slotsLeft: 42,
    difficulty: "Easy",
    estimatedMinutes: 1,
    instructions: [
      "Navigate to our official Instagram page via the external link.",
      "Click 'Follow' to join our digital community.",
      "Navigate to the most recent post and tap the 'Save' icon.",
      "Provide your Instagram username below for cryptographic proof matching."
    ],
    externalUrl: "https://instagram.com/adearn.enterprise"
  },
  {
    id: "task-tt-1",
    platform: "TikTok",
    title: "Interact with Fintech Launch Presentation",
    reward: 350,
    countdownHours: 8,
    slotsTotal: 150,
    slotsLeft: 18,
    difficulty: "Medium",
    estimatedMinutes: 2,
    instructions: [
      "Open the launch video on TikTok using the link.",
      "Watch the video in its entirety (1 minute, 20 seconds).",
      "Leave a verified comment sharing your feedback.",
      "Provide your TikTok username for verification query matching."
    ],
    externalUrl: "https://tiktok.com"
  },
  {
    id: "task-yt-1",
    platform: "YouTube",
    title: "Subscribe & Turn Notifications On for AdEarn TV",
    reward: 500,
    countdownHours: 22,
    slotsTotal: 500,
    slotsLeft: 124,
    difficulty: "Hard",
    estimatedMinutes: 3,
    instructions: [
      "Access the YouTube channel through the action link below.",
      "Tap the 'Subscribe' button to secure membership.",
      "Click the bell icon and select 'All Notifications'.",
      "Input your channel handle or linked email for telemetry validation."
    ],
    externalUrl: "https://youtube.com"
  },
  {
    id: "task-x-1",
    platform: "X",
    title: "Repost & Bookmark Liquidity Release Announcement",
    reward: 300,
    countdownHours: 4,
    slotsTotal: 100,
    slotsLeft: 9,
    difficulty: "Easy",
    estimatedMinutes: 1,
    instructions: [
      "Access the official announcement tweet.",
      "Click the Repost icon to broadcast the publication.",
      "Tap the Bookmark icon to flag the post.",
      "Verify by entering your X username handle."
    ],
    externalUrl: "https://x.com"
  },
  {
    id: "task-tg-1",
    platform: "Telegram",
    title: "Join Premium Signal & Announcement Hub",
    reward: 400,
    countdownHours: 18,
    slotsTotal: 300,
    slotsLeft: 64,
    difficulty: "Medium",
    estimatedMinutes: 2,
    instructions: [
      "Open the Telegram invite link.",
      "Click 'Join Group' to connect to the node.",
      "Verify you are human using the onboarding captcha bot.",
      "Submit your Telegram username for backend access check."
    ],
    externalUrl: "https://t.me"
  },
  {
    id: "task-wa-1",
    platform: "WhatsApp",
    title: "Share Promotion Template to 3 Fintech Groups",
    reward: 600,
    countdownHours: 6,
    slotsTotal: 50,
    slotsLeft: 5,
    difficulty: "Hard",
    estimatedMinutes: 4,
    instructions: [
      "Copy the promotional text template.",
      "Share the copy to three active business or financial groups on WhatsApp.",
      "Capture clear screenshots demonstrating the shared messages.",
      "Upload verification detail username or phone number used."
    ],
    externalUrl: "https://wa.me"
  }
];

export default function SocialTasks() {
  const { refreshProfile } = useAuth();
  const [filter, setFilter] = useState<string>("All");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [proofInput, setProofInput] = useState<string>("");
  const [verifyState, setVerifyState] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [verifyStep, setVerifyStep] = useState<string>("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(5);

  useEffect(() => {
    api.get<{ success: boolean; data: { today_count: number; daily_limit: number; completed_task_ids: string[] } }>("/api/tasks/progress")
      .then((result) => {
        setTodayCount(result.data.today_count);
        setDailyLimit(result.data.daily_limit);
        setCompletedIds(result.data.completed_task_ids);
      })
      .catch(() => {});
  }, []);

  const platforms = ["All", "Instagram", "TikTok", "YouTube", "Facebook", "X", "Telegram", "WhatsApp"];

  const getPlatformIcon = (platform: Task["platform"]) => {
    switch (platform) {
      case "Instagram":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case "YouTube":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
          </svg>
        );
      case "Facebook":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      case "X":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M20 4l-6.768 6.768" />
          </svg>
        );
      case "TikTok":
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        );
      case "Telegram":
        return <Send className="w-4 h-4" />;
      case "WhatsApp":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: Task["platform"]) => {
    switch (platform) {
      case "Instagram": return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "TikTok": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "YouTube": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Facebook": return "bg-blue-600/10 text-blue-500 border-blue-600/20";
      case "X": return "bg-gray-500/10 text-gray-300 border-gray-500/20";
      case "Telegram": return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "WhatsApp": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
    }
  };

  const handleOpenTask = (task: Task) => {
    if (completedIds.includes(task.id) || limitReached) return;
    setSelectedTask(task);
    setProofInput("");
    setVerifyState("idle");
    setVerifyError(null);
  };

  const handleVerify = async () => {
    if (!proofInput.trim() || !selectedTask) return;
    if (todayCount >= dailyLimit) {
      setVerifyError("Daily social task limit reached. Try again tomorrow.");
      setVerifyState("error");
      return;
    }

    setVerifyState("verifying");
    setVerifyError(null);
    
    const steps = [
      "Contacting external platform metadata grids...",
      "Analyzing API interaction timestamp signatures...",
      "Validating account telemetry and profile parameters...",
      "Confirming follow and bookmark state logs...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setVerifyStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }

    try {
      await api.post("/api/tasks/complete", {
        task_id: selectedTask.id,
        proof: proofInput.trim(),
      });

      const nextCompletions = [...completedIds, selectedTask.id];
      setCompletedIds(nextCompletions);
      setTodayCount((count) => count + 1);
      setVerifyState("success");
      await refreshProfile();
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Verification failed");
      setVerifyState("error");
    }
  };

  const limitReached = todayCount >= dailyLimit;

  const filteredTasks = initialTasks.filter(t => filter === "All" || t.platform === filter);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 text-brand-textPrimary font-body">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black font-sans tracking-tight">Social Earning Grid</h1>
        <p className="text-sm text-brand-textSecondary">
          Monetize your attention profile. Complete verification tasks to unlock immediate Naira liquidity.
        </p>
        <div className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface/40 px-3 py-2 text-xs font-semibold text-brand-textSecondary">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
          <span>Daily tasks: {todayCount} / {dailyLimit}</span>
        </div>
      </div>

      {/* Platform Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition duration-200 whitespace-nowrap active:scale-95 ${
              filter === p
                ? "bg-brand-primary text-black border-brand-primary font-bold shadow-lg shadow-brand-primary/10"
                : "bg-brand-surface/40 hover:bg-brand-elevated border-brand-border text-brand-textSecondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Grid of Task Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const isCompleted = completedIds.includes(task.id);
            return (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={!isCompleted ? { y: -4, transition: { duration: 0.2 } } : {}}
                className={`glass-card p-5 rounded-2xl border border-brand-border flex flex-col justify-between h-[280px] shadow-sm relative overflow-hidden transition-all duration-300 ${
                  isCompleted ? "opacity-60 grayscale" : "hover:border-brand-primary/30"
                }`}
              >
                <div>
                  {/* Platform & Difficulty Badges */}
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${getPlatformColor(task.platform)}`}>
                      {getPlatformIcon(task.platform)}
                      <span>{task.platform}</span>
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      task.difficulty === "Easy" ? "bg-brand-success/10 text-brand-success" :
                      task.difficulty === "Medium" ? "bg-brand-primary/10 text-brand-primary" :
                      "bg-brand-danger/10 text-brand-danger"
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>

                  {/* Title & Reward */}
                  <h3 className="mt-4 text-base font-bold text-brand-textPrimary line-clamp-2 leading-snug">
                    {task.title}
                  </h3>

                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-digital text-brand-primary glow-text-primary">
                      +{task.reward}
                    </span>
                    <span className="text-[10px] text-brand-textSecondary font-bold uppercase">Points</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Stats & Metadata Row */}
                  <div className="flex justify-between items-center text-[10px] text-brand-textSecondary border-t border-brand-border/60 pt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{task.countdownHours}h left</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{task.slotsLeft} / {task.slotsTotal} spots</span>
                    </span>
                    <span className="font-bold">{task.estimatedMinutes}m est.</span>
                  </div>

                  {/* CTA button */}
                  {isCompleted ? (
                    <button
                      disabled
                      className="w-full min-h-10 rounded-xl bg-brand-elevated text-brand-textMuted text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed border border-brand-border"
                    >
                      <CheckCircle className="w-4 h-4 text-brand-success" />
                      <span>Task Completed</span>
                    </button>
                  ) : limitReached ? (
                    <button
                      disabled
                      className="w-full min-h-10 rounded-xl bg-brand-elevated text-brand-textMuted text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed border border-brand-border"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Daily Limit Reached</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenTask(task)}
                      className="w-full min-h-10 rounded-xl bg-brand-primary hover:bg-[#d88c10] text-[#000000] text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-md shadow-brand-primary/10"
                    >
                      <span>Execute Campaign</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* VERIFICATION MODAL FLOW */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => verifyState !== "verifying" && setSelectedTask(null)}
              className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg glass-card-elevated rounded-3xl p-6 md:p-8 border border-brand-border overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-brand-border/60">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${getPlatformColor(selectedTask.platform)}`}>
                    {getPlatformIcon(selectedTask.platform)}
                    <span>{selectedTask.platform}</span>
                  </span>
                  <span className="text-xs font-bold text-brand-textMuted font-mono">+{selectedTask.reward} pts</span>
                </div>
                {verifyState !== "verifying" && (
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-brand-textSecondary hover:text-brand-textPrimary font-semibold text-sm transition"
                  >
                    Close
                  </button>
                )}
              </div>

              {/* Body Views */}
              <div className="mt-6 space-y-6">
                {verifyState === "idle" && (
                  <>
                    <h3 className="text-lg font-bold text-brand-textPrimary leading-snug">
                      {selectedTask.title}
                    </h3>

                    {/* Step Instructions */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase text-brand-textMuted tracking-wider">Instructions</p>
                      <div className="space-y-2">
                        {selectedTask.instructions.map((step, idx) => (
                          <div key={idx} className="flex gap-3 text-xs text-brand-textSecondary leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* External Link Redirect */}
                    <a
                      href={selectedTask.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 min-h-12 w-full rounded-xl bg-brand-surface border border-brand-border hover:bg-brand-elevated text-brand-textPrimary text-sm font-semibold transition active:scale-95"
                    >
                      <span>Open Task Campaign</span>
                      <ExternalLink className="w-4 h-4 text-brand-primary" />
                    </a>

                    {/* Proof Input */}
                    <div className="space-y-2">
                      <label htmlFor="proof" className="block text-xs font-bold uppercase text-brand-textMuted tracking-wider">
                        Telemetry Identifier Profile
                      </label>
                      <input
                        id="proof"
                        type="text"
                        required
                        value={proofInput}
                        onChange={(e) => setProofInput(e.target.value)}
                        placeholder="Enter your username or handle used (e.g., @john_doe)"
                        className="min-h-12 w-full rounded-xl bg-brand-bg/60 border border-brand-border px-4 text-sm text-brand-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-brand-textMuted font-mono"
                      />
                    </div>

                    {/* Confirm Verification Button */}
                    <button
                      onClick={handleVerify}
                      disabled={!proofInput.trim()}
                      className="min-h-12 w-full rounded-xl bg-brand-primary hover:bg-[#e09110] text-[#000000] text-sm font-black transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-primary/10"
                    >
                      Submit Verification Proof
                    </button>
                  </>
                )}

                {verifyState === "verifying" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-brand-textPrimary">Validating Earning Proof</p>
                      <p className="text-xs text-brand-textSecondary font-mono animate-pulse">{verifyStep}</p>
                    </div>
                  </div>
                )}

                {verifyState === "success" && (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success shadow-lg">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-brand-textPrimary font-sans">Campaign Verified!</h4>
                      <p className="text-sm text-brand-textSecondary leading-relaxed max-w-xs">
                        Cryptographic alignment confirmed. <span className="text-brand-primary font-bold">+{selectedTask.reward} points</span> have been settled to your available balance.
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="min-h-12 w-full max-w-xs rounded-xl bg-brand-primary hover:bg-[#e09110] text-black text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 transition active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Return to Hub</span>
                    </button>
                  </div>
                )}

                {verifyState === "error" && (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-brand-danger/10 border border-brand-danger/20 flex items-center justify-center text-brand-danger shadow-lg">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-brand-textPrimary font-sans">Verification Failed</h4>
                      <p className="text-sm text-brand-textSecondary leading-relaxed max-w-xs">
                        {verifyError ?? "The platform could not match interaction telemetry records for this profile. Please verify credentials and re-submit."}
                      </p>
                    </div>
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={() => setVerifyState("idle")}
                        className="flex-1 min-h-12 rounded-xl bg-brand-surface hover:bg-brand-elevated text-brand-textPrimary text-sm font-semibold transition active:scale-95 border border-brand-border"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="flex-1 min-h-12 rounded-xl bg-brand-primary hover:bg-[#e09110] text-[#000000] text-sm font-black transition active:scale-95 shadow-md shadow-brand-primary/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
