"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Play, QrCode, Ticket, Users } from "lucide-react";

export default function TutorialsPage() {
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
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
            Step-by-Step Guides
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Tutorials & User Guides
          </h1>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Everything you need to know about buying tickets, downloading pass images, and validating gate entries.
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Guide 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start">
            <Ticket className="w-8 h-8 text-orange-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3">1. How to Purchase & Download Ticket Passes</h3>
              <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside font-light leading-relaxed">
                <li>Browse available events on the home page and click <strong>"Book Ticket"</strong>.</li>
                <li>Complete your checkout via Paystack (Mobile Money or Credit Card).</li>
                <li>Once payment succeeds, your high-definition digital ticket pass is generated instantly.</li>
                <li>Click <strong>"Download Pass"</strong> to save the complete pass directly to your phone's photo library.</li>
              </ol>
            </div>
          </div>

          {/* Guide 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start">
            <Users className="w-8 h-8 text-indigo-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3">2. How to Host & Publish a Live Event</h3>
              <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside font-light leading-relaxed">
                <li>Sign in to your TickeX account and click <strong>"Host An Event"</strong>.</li>
                <li>If your account is not yet an Organizer, submit your organization details for fast 24h approval.</li>
                <li>Fill in the event title, category, date, venue location, price (or Free), and cover photo URL.</li>
                <li>Publish your listing to go live instantly for attendees worldwide.</li>
              </ol>
            </div>
          </div>

          {/* Guide 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start">
            <QrCode className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3">3. How Gate Scanning Works at Venue Entry</h3>
              <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside font-light leading-relaxed">
                <li>Gate security staff open the built-in TickeX mobile camera scanner on any smartphone.</li>
                <li>Point the camera at the attendee's digital pass QR code.</li>
                <li>The system validates the pass in under 1 second, marking it as used to eliminate ticket duplication.</li>
              </ol>
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
