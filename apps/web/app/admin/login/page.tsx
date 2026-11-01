"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Disc3, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
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

      router.push("/admin/enquiries");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    setEmail("admin@velvetnoir.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFC] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E51E2B]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-md p-8 sm:p-10 border border-black/[0.08] shadow-xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#E51E2B]/30 bg-[#FEF2F2] flex items-center justify-center text-[#E51E2B] mb-4">
            <Disc3 className="w-6 h-6 animate-spin" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#09090B] uppercase tracking-wider">
            Velvet Noir Console
          </h1>
          <p className="text-xs text-[#E51E2B] font-semibold tracking-widest uppercase mt-1">
            Secure Client Administration
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-zinc-700 uppercase">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@velvetnoir.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-black/10 text-[#09090B] placeholder-zinc-400 focus:outline-none focus:border-[#E51E2B] text-sm"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold tracking-wider text-zinc-700 uppercase">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link has been dispatched to the master admin email.")}
                className="text-[11px] text-[#E51E2B] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-black/10 text-[#09090B] placeholder-zinc-400 focus:outline-none focus:border-[#E51E2B] text-sm"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#E51E2B] hover:bg-[#D81A26] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E51E2B]/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Access Control Panel"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={handleAutoFill}
              className="w-full py-2.5 rounded-lg border border-black/10 bg-black/[0.02] text-zinc-600 hover:text-[#09090B] hover:border-[#E51E2B]/40 text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#E51E2B]" />
              <span>Fill Demo Credentials (admin@velvetnoir.com)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
