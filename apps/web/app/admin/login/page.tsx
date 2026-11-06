"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Disc3, Lock, Mail, ArrowRight, AlertCircle, KeyRound, ShieldCheck } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import OneRoofLogo from "@/components/ui/OneRoofLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const { isDark } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setEmail("admin@oneroofentertainment.com");
    setPassword("admin123");
  };

  return (
    <div className="w-full max-w-md rounded-3xl p-8 sm:p-10 border shadow-2xl relative z-10 transition-colors bg-[var(--card)] border-[var(--subtle-border)]">
      <div className="flex flex-col items-center text-center mb-8">
        <OneRoofLogo size="lg" variant="stacked" className="mb-4" />
        <div className="flex items-center space-x-1.5 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#e11d48]" />
          <p className="text-[11px] text-[#e11d48] font-bold tracking-widest uppercase">
            Secured Access Portal
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-[#e11d48] text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#e11d48]" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Administrator Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@oneroofentertainment.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:border-[#e11d48] bg-[var(--background)] border-[var(--subtle-border)] text-[var(--foreground)]"
            />
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Password
            </label>
            <span className="text-[11px] text-zinc-500">Default: admin123</span>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:border-[#e11d48] bg-[var(--background)] border-[var(--subtle-border)] text-[var(--foreground)]"
            />
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          id="admin-login-submit-btn"
          className="w-full py-3.5 rounded-xl bg-[#e11d48] hover:bg-[#D81A26] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#e11d48]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
        >
          <span>{loading ? "Authenticating..." : "Sign In to Administration"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-4 border-t border-[var(--subtle-border)]">
          <button
            type="button"
            onClick={handleAutoFill}
            className="w-full py-2.5 rounded-lg border border-[var(--subtle-border)] text-zinc-400 hover:text-[var(--foreground)] hover:border-[#e11d48]/50 text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#e11d48]" />
            <span>Fill Master Credentials (admin@oneroofentertainment.com)</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
      {/* Background ambient crimson warmth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e11d48]/10 blur-[140px] rounded-full pointer-events-none" />

      <Suspense fallback={<div className="text-zinc-400 text-sm">Loading security gate...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
