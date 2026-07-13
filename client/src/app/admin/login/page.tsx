"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, KeyRound, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        // Check user role strictly
        const role = data.user?.role;
        if (role !== "ADMIN" && role !== "ORGANIZER") {
          setError("Access Denied: This secure portal is restricted to Platform Administrators and Event Organizers only.");
          setLoading(false);
          return;
        }

        // Save credentials
        localStorage.setItem("tickex_token", data.accessToken);
        localStorage.setItem("tickex_user", JSON.stringify(data.user));

        // Route based on role
        if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials provided.");
        setLoading(false);
      }
    } catch (err) {
      setError("Unable to connect to authentication server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-orange-500 selection:text-white text-white font-sans">
      {/* Subtle Security Grid & Glows matching Homepage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Login Box */}
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-xl shadow-orange-500/25 mb-4 ring-1 ring-white/10">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Platform Command</h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Restricted Access Portal &bull; Ticke<span className="text-orange-500">X</span> Security
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in duration-200">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                System Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@tickex.com or organizer@tickex.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#030014]/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Security Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#030014]/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center justify-center gap-2 mt-2 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Permissions...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Authenticate & Enter
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>🔒 TLS 1.3 Encrypted Session</span>
            <button
              onClick={() => router.push("/")}
              className="hover:text-orange-400 transition-colors font-semibold"
            >
              &larr; Return to Public Portal
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
