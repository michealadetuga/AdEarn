import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  account_number?: string | null;
  bank_name?: string | null;
  bank_code?: string | null;
  account_name?: string | null;
  balance_points: number;
  total_earned: number;
  total_withdrawn: number;
  referral_code?: string | null;
  referred_by?: string | null;
  is_verified: boolean;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<{ success: boolean; sessionCreated: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  token: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
    setProfile((data as UserProfile | null) ?? null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) await fetchProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) await fetchProfile(nextSession.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const token = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signUp = async (email: string, password: string, fullName: string, referralCode?: string) => {
    if (password.length < 8 || !/\d/.test(password)) {
      return { success: false, sessionCreated: false, error: "Password must be at least 8 characters and include a number." };
    }

    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) return { success: false, sessionCreated: false, error: error.message };

    if (data.session?.access_token) {
      try {
        await api.post("/api/auth/register", { full_name: fullName, referral_code: referralCode }, { token: data.session.access_token });
        await fetchProfile(data.user?.id ?? "");
      } catch (registerError) {
        return { success: false, sessionCreated: true, error: registerError instanceof Error ? registerError.message : "Registration failed" };
      }
    }

    return { success: true, sessionCreated: Boolean(data.session) };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    setUser(null);
    setSession(null);
    setProfile(null);
    return { success: true };
  };

  const signOut = async () => {
    await logout();
  };

  return <AuthContext.Provider value={{ user, session, profile, loading, login, signUp, logout, signOut, refreshProfile, token }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
