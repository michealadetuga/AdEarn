import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-textPrimary p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-brand-elevated" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-brand-elevated border border-brand-border" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-brand-elevated border border-brand-border" />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();
  if (loading) return <PageSkeleton />;
  if (!session) return <Navigate to="/login" replace />;
  if (profile?.is_banned) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg p-6 text-brand-textPrimary">
        <div className="max-w-md w-full rounded-2xl border border-brand-danger/30 bg-brand-surface p-8 shadow-2xl glass-card">
          <h1 className="text-2xl font-black text-brand-danger">Account locked</h1>
          <p className="mt-3 text-sm text-brand-textSecondary">Your AdEarn account is currently locked. Contact support@adearn.com.ng for help.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { session } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute><Dashboard adminMode /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

