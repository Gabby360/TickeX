"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Ticket, Users, Zap, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
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
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Ticket className="w-5 h-5 rotate-12" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Ticke<span className="text-orange-500">X</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
            About TickeX
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Bridging online sales & real-world gate entry
          </h1>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            TickeX was created to revolutionize event access across Africa. We eliminate scalping, ticket duplication, and gate queues through real-time single-use QR validation and instant local payment integrations.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sub-Second Scanning</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Validate entry tickets at gate entrances in under 1 second using standard smartphone cameras—no specialized hardware required.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Anti-Fraud Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Each pass is linked to a single-use encrypted token that prevents ticket duplication, fake passes, and scalping.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Payouts</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Event organizers receive instant ticket sale settlements directly into Mobile Money and local bank accounts via Paystack.
            </p>
          </div>
        </div>

        {/* Founders / Leadership Team */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-2">Leadership Team</h2>
          <p className="text-slate-400 text-center text-sm mb-12 max-w-md mx-auto">
            Driven by passion for technology, live music, and event infrastructure
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-orange-500 shadow-xl shadow-orange-500/20 mb-4">
                <img src="/gabriel.jpg" alt="Agblevor Gabriel" className="w-full h-full object-cover scale-[1.7] object-top" />
              </div>
              <h4 className="font-bold text-lg text-white">Agblevor Gabriel</h4>
              <span className="text-xs text-orange-400 font-semibold mb-2">Founder & Core Engineering</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-orange-500 shadow-xl shadow-orange-500/20 mb-4">
                <img src="/isaac.jpg" alt="Isaac Darko Asante" className="w-full h-full object-cover scale-[1.48]" />
              </div>
              <h4 className="font-bold text-lg text-white">Isaac Darko Asante</h4>
              <span className="text-xs text-orange-400 font-semibold mb-2">Co-Founder & Tech Leadership</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-orange-500 shadow-xl shadow-orange-500/20 mb-4">
                <img src="/dennis.jpg" alt="Dennis Asiedu" className="w-full h-full object-cover scale-[1.3] object-[38%_center]" />
              </div>
              <h4 className="font-bold text-lg text-white">Dennis Asiedu</h4>
              <span className="text-xs text-orange-400 font-semibold mb-2">Co-Founder & Ecosystem Builder</span>
            </div>
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
