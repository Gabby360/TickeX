"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Mail, Sparkles, Ticket } from "lucide-react";

export default function CareersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      {/* Decorative Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full text-sm font-medium transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Ticket className="w-7 h-7 text-orange-500 rotate-12" />
          <span className="text-xl font-bold tracking-tight text-white">
            Ticke<span className="text-orange-500">X</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center my-auto">
        <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
          Careers at TickeX
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          Join our team
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-12 font-light leading-relaxed">
          We're building the future of event ticketing and physical entrance validation across Africa and beyond.
        </p>

        {/* No Openings Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto">
          <Briefcase className="w-10 h-10 text-orange-400 mx-auto mb-6" />

          <h3 className="text-2xl font-bold text-white mb-3">No Open Positions At The Moment</h3>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
            We are not actively hiring for any open roles right now. However, we are always excited to connect with talented engineers, designers, and event ecosystem builders!
          </p>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:support@tickex.com"
              className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Mail className="w-4 h-4" />
              <span>Send Speculative Application</span>
            </a>
            <button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-sm border border-white/10 transition-all"
            >
              Explore Events
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        &copy; 2026 TickeX Platforms. All rights reserved.
      </footer>
    </div>
  );
}
