"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Mail, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Save token and user details to localStorage
      localStorage.setItem("tickex_token", data.accessToken);
      localStorage.setItem("tickex_user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      
      {/* Decorative Starry Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/25 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-600/15 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Back Link */}
        <button 
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to home
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 rounded-xl bg-orange-500 items-center justify-center text-white shadow-lg shadow-orange-500/20 mb-4">
            <Ticket className="w-7 h-7 rotate-12" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back to <span className="text-orange-500">TickeX</span>
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your tickets and events
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-semibold text-white hover:text-orange-400 transition-colors"
            >
              Sign up
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
