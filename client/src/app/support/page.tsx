"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, HelpCircle, Mail, MessageSquare, ShieldCheck, Ticket } from "lucide-react";

export default function SupportPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: "How do I access my ticket after purchasing?",
      a: "Once your payment completes via Paystack or Free checkout, a confirmation modal appears instantly with a Download button. You can also view all your tickets anytime by logging in and clicking 'My Tickets' in the navigation bar."
    },
    {
      q: "Can I download my ticket pass onto my phone?",
      a: "Yes! Clicking 'Download' generates a high-definition 800x1200 digital ticket pass PNG image containing the event details, venue, date, attendee name, and scannable QR code. On mobile phones, it opens native image saving directly into your Camera Roll or Photos app."
    },
    {
      q: "What if an event gets canceled or postponed?",
      a: "Organizers process refunds directly through their connected Paystack accounts. You will receive email notifications if an event schedule changes."
    },
    {
      q: "How do I become an event organizer on TickeX?",
      a: "Click 'Host An Event' on the home page. If you are on an Attendee account, complete the 1-minute organizer application form. Our admin team will verify your details and upgrade your account."
    }
  ];

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
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block">
            Support & FAQs
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            How can we help?
          </h1>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Find quick answers to common questions below or contact customer support directly.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4 mb-16">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 text-left font-bold text-base sm:text-lg text-white flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-orange-400 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-orange-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 pt-2 text-slate-300 text-sm leading-relaxed border-t border-white/5 font-light">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Callout */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-white mb-2">Still need help?</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Our support team is available 7 days a week to assist attendees and event organizers.
          </p>
          <button
            onClick={() => router.push("/contact")}
            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 inline-flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Contact Support Team
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        &copy; 2026 TickeX Platforms. All rights reserved.
      </footer>
    </div>
  );
}
