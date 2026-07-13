"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Ticket, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Menu, 
  X,
  CreditCard,
  Users,
  Compass
} from "lucide-react";


interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({ target, duration = 1500, suffix = "", prefix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = target;
    const range = end - start;
    const increment = range / (duration / 16); // ~60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  const formattedValue = count.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

// Mock event data with gorgeous Unsplash images
const EVENTS = [
  {
    id: "1",
    title: "Accra Synthwave Festival",
    category: "Music",
    date: "July 28, 2026",
    location: "Accra International Conference Centre",
    price: "GH₵150",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    id: "2",
    title: "Global Tech Summit 2026",
    category: "Tech",
    date: "August 12, 2026",
    location: "Labadi Beach Hotel, Accra",
    price: "Free",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    id: "3",
    title: "Championship Football Final",
    category: "Sports",
    date: "August 20, 2026",
    location: "Baba Yara Sports Stadium, Kumasi",
    price: "GH₵50",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    featured: true,
  },
  {
    id: "4",
    title: "Highlife & Bites",
    category: "Food",
    date: "September 05, 2026",
    location: "Efua Sutherland Drama Studio, Accra",
    price: "GH₵80",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    id: "5",
    title: "Comedy Night Live",
    category: "Comedy",
    date: "September 18, 2026",
    location: "National Theatre, Accra",
    price: "GH₵100",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800",
    featured: false,
  },
  {
    id: "6",
    title: "Acoustic Evening Sessions",
    category: "Music",
    date: "October 02, 2026",
    location: "Alliance Française, Accra",
    price: "GH₵120",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    featured: false,
  }
];

const CATEGORIES = ["All", "Music", "Tech", "Sports", "Food", "Comedy"];

// Hook: fires once when element enters the viewport
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime()) && (dateStr.includes("-") || dateStr.includes("T"))) {
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }
  } catch (e) {}
  return dateStr;
};

const formatPrice = (price: any) => {
  if (typeof price === "number") {
    return price === 0 ? "Free" : `GH₵${price.toLocaleString()}`;
  }
  return price;
};

// Single animated event card
const EventCard = ({ event, index }: { event: any; index: number }) => {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      {/* Event Cover Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {event.category}
        </span>
        {/* Date overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 bg-black/50 text-white text-xs font-medium px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(event.date)}
        </div>
      </div>

      {/* Event Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1 mb-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-6">
          <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        {/* Pricing and CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs block uppercase font-bold tracking-wider">Tickets start at</span>
            <span className="text-xl font-extrabold text-slate-950">{formatPrice(event.price)}</span>
          </div>
          <a
            href={`/events/${event.id}`}
            className="px-5 py-2.5 bg-slate-900 hover:bg-orange-500 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-sm flex items-center gap-1.5"
          >
            Buy Ticket <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Animated section header
const EventsHeader = ({ count }: { count: number }) => {
  const { ref, inView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-start md:items-end justify-between mb-12 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div>
        <div className="flex items-center gap-2 text-orange-600 font-bold tracking-wider uppercase text-sm mb-2">
          <TrendingUp className="w-4 h-4" /> Dynamic Listings
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
          Upcoming Events
        </h2>
      </div>
      <span className="text-slate-500 font-medium text-sm md:text-base mt-2 md:mt-0">
        Showing {count} events
      </span>
    </div>
  );
};

// Grid of animated event cards
const EventCardsGrid = ({ events }: { events: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {events.map((event, i) => (
      <EventCard key={event.id} event={event} index={i} />
    ))}
  </div>
);

const SequentialTypewriter = () => {
  const line1 = "Smart Tickets.";
  const line2 = "Smooth Entry.";
  const typeSpeed = 70;
  const eraseSpeed = 40;
  const pauseAfterType = 1400;
  const pauseAfterErase = 400;

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [phase, setPhase] = useState<"type1" | "type2" | "pause" | "erase2" | "erase1" | "pauseEnd">("type1");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "type1") {
      if (text1.length < line1.length) {
        timeout = setTimeout(() => setText1(line1.slice(0, text1.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase("type2"), pauseAfterType / 3);
      }
    } else if (phase === "type2") {
      if (text2.length < line2.length) {
        timeout = setTimeout(() => setText2(line2.slice(0, text2.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pause"), pauseAfterType);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("erase2"), 0);
    } else if (phase === "erase2") {
      if (text2.length > 0) {
        timeout = setTimeout(() => setText2(text2.slice(0, -1)), eraseSpeed);
      } else {
        timeout = setTimeout(() => setPhase("erase1"), pauseAfterErase);
      }
    } else if (phase === "erase1") {
      if (text1.length > 0) {
        timeout = setTimeout(() => setText1(text1.slice(0, -1)), eraseSpeed);
      } else {
        timeout = setTimeout(() => setPhase("type1"), pauseAfterErase);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, text1, text2]);

  return (
    <>
      <span>{text1}</span>
      <br />
      <span className="text-orange-500">{text2}<span className="animate-pulse">|</span></span>
    </>
  );
};


export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [dbEvents, setDbEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDbEvents(data);
          }
        }
      } catch (err) {
        console.error("Error fetching live events:", err);
      }
    };
    fetchEvents();
  }, []);

  const displayEvents = dbEvents.length > 0 ? dbEvents : EVENTS;

  const filteredEvents = displayEvents.filter(event => {
    const matchesCategory = selectedCategory === "All" || event.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = event.location.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesCategory && matchesSearch && matchesLocation;
  });

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 font-sans min-h-screen">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030014] border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Ticket className="w-6 h-6 rotate-12" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Ticke<span className="text-orange-500">X</span>
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#events" className="text-slate-300 hover:text-white transition-colors font-medium">Browse Events</a>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Why TickeX</a>
              <a href="#organizers" className="text-slate-300 hover:text-white transition-colors font-medium">For Organizers</a>
            </div>

            {/* Auth CTAs */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="/login" 
                className="text-white hover:text-orange-400 font-medium px-4 py-2 transition-colors duration-200"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 hover:-translate-y-0.5"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2 rounded-lg transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#030014] border-b border-white/10 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-5 duration-200">
            <a 
              href="#events" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 font-medium transition-all"
            >
              Browse Events
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 font-medium transition-all"
            >
              Why TickeX
            </a>
            <a 
              href="#organizers" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 font-medium transition-all"
            >
              For Organizers
            </a>
            <div className="border-t border-white/10 my-4 pt-4 flex flex-col gap-3 px-3">
              <a 
                href="/login" 
                className="text-center text-white hover:text-orange-400 font-medium py-2.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="text-center bg-orange-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-orange-500/20"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION (Immersive Dark Theme) */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-[#030014] bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center text-white overflow-hidden">
        {/* Immersive background overlay with glassmorphism blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/94 via-[#030014]/88 to-[#030014] z-0" />

        {/* Abstract Glowing Gradients */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">


              {/* Title with looping typewriter animation */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight min-h-[120px] sm:min-h-[150px] md:min-h-[180px]">
                <SequentialTypewriter />
              </h1>

              {/* Subheading */}
              <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light max-w-xl">
                Host your next concert, conference, or workshop with TickeX. Sell tickets directly online, accept instant payments via Paystack, and validate entries securely in under a second using our built-in QR ticket scanner.
              </p>

              {/* Core CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8">
                <a 
                  href="#events" 
                  className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Explore Events
                </a>
                <a 
                  href="/register?role=organizer" 
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-full shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Host An Event
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img className="w-9 h-9 rounded-full border-2 border-[#030014] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="user" />
                  <img className="w-9 h-9 rounded-full border-2 border-[#030014] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="user" />
                  <img className="w-9 h-9 rounded-full border-2 border-[#030014] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="user" />
                  <img className="w-9 h-9 rounded-full border-2 border-[#030014] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="user" />
                </div>
                <div className="text-xs sm:text-sm text-slate-400">
                  Trusted by <span className="text-white font-bold">10,000+ attendees</span> and top organizers.
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Digital Ticket Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden transform -rotate-3 hover:rotate-0 hover:scale-[1.03] transition-all duration-300">
                {/* Event Cover Photo Stub */}
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600" 
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge overlay */}
                  <span className="absolute top-3 left-3 bg-orange-500 text-[10px] font-bold px-2 py-1 rounded-md text-white">
                    LIVE EVENT PASS
                  </span>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <h3 className="text-lg font-bold line-clamp-1 text-white">Accra Synthwave Festival</h3>
                    <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> Accra International Conference Centre
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-0" />
                </div>

                {/* Ticket Details Info */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-b border-white/10 border-dashed pb-4 mb-4">
                  <div>
                    <span className="text-[10px] tracking-wider text-slate-400 block mb-0.5 font-bold uppercase">TICKET HOLDER</span>
                    <span className="text-sm sm:text-base font-extrabold text-white">Kwame Asante</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-slate-400 block mb-0.5 font-bold uppercase">SEAT CATEGORY</span>
                    <span className="text-sm sm:text-base font-extrabold text-orange-400">VIP ACCESS PASS</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-slate-400 block mb-0.5 font-bold uppercase">DATE & TIME</span>
                    <span className="text-sm sm:text-base font-extrabold text-white">28 July 2026, 7:00 PM</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-slate-400 block mb-0.5 font-bold uppercase">GATE PRICE</span>
                    <span className="text-sm sm:text-base font-extrabold text-orange-400">GH₵150</span>
                  </div>
                </div>

                {/* Classical stub ticket notches */}
                <div className="absolute top-[280px] -left-3 w-6 h-6 rounded-full bg-[#030014]" />
                <div className="absolute top-[280px] -right-3 w-6 h-6 rounded-full bg-[#030014]" />

                {/* QR Code and Barcode Stub */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="relative w-36 h-36 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg border border-orange-200/25 overflow-hidden">
                    {/* Glowing Barcode Laser Line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_#f97316] animate-scan z-10" />
                    
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <span className="text-[10px] tracking-[0.25em] font-mono text-slate-400 mt-4 block">
                    * ADMIT ONE - SCAN ENTRY *
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Search Widget */}
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl md:rounded-full border border-slate-200 shadow-2xl shadow-black/10">
            <div className="flex flex-col md:flex-row items-center gap-2">
              
              {/* Event Name Search */}
              <div className="w-full flex items-center gap-3 px-4 py-3 md:py-1">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search events, concerts, parties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* Separator Line */}
              <div className="hidden md:block w-px h-8 bg-slate-200" />

              {/* Location Search */}
              <div className="w-full flex items-center gap-3 px-4 py-3 md:py-1">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Location (e.g., Accra, Kumasi)..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* CTA button inside widget */}
              <button 
                onClick={() => {
                  const el = document.getElementById("events");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full md:w-auto shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl md:rounded-full shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-200"
              >
                Search
              </button>
            </div>
          </div>

          {/* Category Pill Tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-white text-slate-900 border-white shadow-lg"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-slate-950 border-b border-white/5 py-16 relative overflow-hidden">
        {/* Subtle backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[150px] bg-orange-500/5 rounded-full blur-[60px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:divide-x md:divide-white/10">
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
                <AnimatedCounter target={5000} suffix="+" />
              </span>
              <span className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Events Listed
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center md:pl-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-orange-500 mb-2 tracking-tight">
                <AnimatedCounter target={2.0} decimals={1} suffix="M+" />
              </span>
              <span className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Tickets Sold
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center md:pl-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-orange-500 mb-2 tracking-tight">
                <AnimatedCounter target={98} suffix="%" />
              </span>
              <span className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Happy Attendees
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION (Clean Light Theme) */}
      <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <EventsHeader count={filteredEvents.length} />

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <Compass className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Events Found</h3>
            <p className="text-slate-500">We couldn't find any events matching your search criteria. Try a different query!</p>
          </div>
        ) : (
          <EventCardsGrid events={filteredEvents} />
        )}
      </section>

      {/* WHY TICKEX SECTION (Key Pillars) */}
      <section 
        id="features" 
        className="py-24 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/concert_entry_scan.png')" }}
      >
        {/* Dark overlay to maintain high text contrast */}
        <div className="absolute inset-0 bg-slate-950/88 z-[1]" />
        
        {/* Glows */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-950/20 rounded-full blur-[100px] pointer-events-none z-[2]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[3]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 font-bold tracking-wider uppercase text-sm mb-3 inline-block">
              Premium Infrastructure
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Designed For Seamless Entry
            </h2>
            <p className="text-slate-300 text-lg font-light">
              TickeX builds the link between online ticketing and physical validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300 group hover:bg-slate-850">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 group-hover:bg-orange-55 group-hover:text-white transition-all duration-300">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart QR Code Tickets</h3>
              <p className="text-slate-300 leading-relaxed font-light">
                Each ticket includes a unique, encrypted QR code. Validate entry at the door with any smartphone camera in under 1 second.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300 group hover:bg-slate-850">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 group-hover:bg-orange-55 group-hover:text-white transition-all duration-300">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Paystack Payments</h3>
              <p className="text-slate-300 leading-relaxed font-light">
                Enjoy frictionless checkout. Support cards, bank transfers, and USSD. Organizers receive instant, transparent payouts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300 group hover:bg-slate-850">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 group-hover:bg-orange-55 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Anti-Fraud Validation</h3>
              <p className="text-slate-300 leading-relaxed font-light">
                Eliminate scalping and ticket duplication. Real-time scanning sync makes sure ticket tokens can only be used once.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="organizers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-3 inline-block">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 mb-4">
            Loved by <span className="text-orange-500">Event Creators</span> & Attendees
          </h2>
          <p className="text-slate-500 text-lg font-light">
            Read how TickeX makes hosting and attending events a completely frictionless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Testimonial 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-orange-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-600 font-light italic leading-relaxed mb-6">
                "TickeX completely transformed our concert checkins. Fraud-proof QR codes meant we scanned 5,000 attendees in record time. Payouts were instant and hassle-free."
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                alt="DJ Spinall"
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">DJ Spinall</h4>
                <p className="text-slate-400 text-xs font-semibold">Music Producer & Concert Host</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-orange-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-600 font-light italic leading-relaxed mb-6">
                "Hosting our annual tech summit was a breeze. We set up multiple ticket categories (General, VIP, Early Bird) and got deep data insights from day one."
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                alt="Amina Bello"
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Amina Bello</h4>
                <p className="text-slate-400 text-xs font-semibold">Tech Summit Convener</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:border-orange-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-600 font-light italic leading-relaxed mb-6">
                "The platform is incredibly clean. Attendees loved the checkout speed, and scanning tickets with just our phones saved us thousands on hardware rental."
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" 
                alt="Tunde Cole"
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Tunde Cole</h4>
                <p className="text-slate-400 text-xs font-semibold">Sports Promoter & Venue Owner</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
              <Ticket className="w-4 h-4 rotate-12" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Ticke<span className="text-orange-500">X</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <a href="#events" className="hover:text-white transition-colors">Browse Events</a>
            <a href="#features" className="hover:text-white transition-colors">Key Features</a>
            <a href="#organizers" className="hover:text-white transition-colors">For Organizers</a>
          </div>

          {/* Copyright */}
          <span className="text-sm font-light">
            &copy; 2026 TickeX Platforms. All rights reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}
