"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Mail, QrCode, ShieldCheck, Ticket, Zap } from "lucide-react";

export default function IntegrationsPage() {
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
            Ecosystem & Tools
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Integrations
          </h1>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            TickeX integrates with industry-standard financial and verification systems to deliver instant checkouts and zero-queue gate entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Integration 1 */}
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Paystack Payment Gateway</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light mb-4">
              Accept Mobile Money (MTN, Telecel, AT) and Debit/Credit Cards seamlessly with real-time settlement into organizer bank accounts.
            </p>
            <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Active Payment Partner
            </span>
          </div>

          {/* Integration 2 */}
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Web-Based Mobile Scanner</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light mb-4">
              Uses HTML5 WebKit Camera APIs to scan QR codes instantly directly inside any mobile browser without installing third-party apps.
            </p>
            <span className="inline-block text-xs font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Built-in Gate Technology
            </span>
          </div>

          {/* Integration 3 */}
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Retina Ticket Pass Generator</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light mb-4">
              Renders 800×1200 pixel digital ticket passes directly on HTML5 canvas with native Web Share API support for iOS Photos and Android Files.
            </p>
            <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              High-Res Image Export
            </span>
          </div>

          {/* Integration 4 */}
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Nodemailer Dispatch Service</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light mb-4">
              Sends automated HTML confirmation emails with direct ticket pass links upon successful payment verification.
            </p>
            <span className="inline-block text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Automated Dispatch
            </span>
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
