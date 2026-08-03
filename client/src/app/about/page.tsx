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
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full text-sm font-medium transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Ticket className="w-7 h-7 text-orange-500 rotate-12" />
          <span className="text-xl font-bold tracking-tight text-white">
            Ticke<span className="text-orange-500">X</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-4 inline-block">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <Zap className="w-8 h-8 text-orange-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Sub-Second Scanning</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Validate entry tickets at gate entrances in under 1 second using standard smartphone cameras—no specialized hardware required.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Anti-Fraud Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Each pass is linked to a single-use encrypted token that prevents ticket duplication, fake passes, and scalping.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <Users className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">Instant Payouts</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Event organizers receive instant ticket sale settlements directly into Mobile Money and local bank accounts via Paystack.
            </p>
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
