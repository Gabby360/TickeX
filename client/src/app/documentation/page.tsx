"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Code, Key, QrCode, ShieldCheck, Ticket } from "lucide-react";

export default function DocumentationPage() {
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
            Developer & Platform Docs
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Documentation
          </h1>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Technical guides, API reference, and integration patterns for building on the TickeX ticketing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Quick Start Guide */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Event Creation API</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 font-light">
              Organizers can issue live events using standard JSON payloads over HTTP POST requests to <code className="text-orange-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">/api/events</code>.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{`POST /api/events
Authorization: Bearer <TOKEN>
{
  "title": "Accra Tech Fest",
  "price": 150,
  "category": "Tech"
}`}</pre>
            </div>
          </div>

          {/* QR Validation Docs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gate Verification API</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 font-light">
              Scan entry passes at gate entrances using mobile cameras. Send scanned QR payload strings to <code className="text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">/api/tickets/validate</code>.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
              <pre>{`POST /api/tickets/validate
{
  "qrCode": "TICKEX_1722709200_98124"
}

// Responds with 200 OK & VALID status`}</pre>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h2 className="text-2xl font-bold">Authentication & Security</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
            All administrative and organizer endpoints are protected with standard JSON Web Token (JWT) authorization headers. Include <code className="text-orange-400 bg-slate-950 px-2 py-0.5 rounded">Authorization: Bearer &lt;accessToken&gt;</code> in all protected API calls.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        &copy; 2026 TickeX Platforms. All rights reserved.
      </footer>
    </div>
  );
}
