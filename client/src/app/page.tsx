"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  Compass,
  Loader2
} from "lucide-react";


interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({ 
  target, 
  duration = 2000, 
  suffix = "", 
  prefix = "",
  decimals = 0
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setCount(target);
      return;
    }

    const currentElement = elementRef.current;
    if (!currentElement || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const currentCount = progress * target;
            setCount(currentCount);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          
          observer.unobserve(currentElement);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [target, duration, hasAnimated]);

  const formattedCount = count.toFixed(decimals);

  return (
    <span ref={elementRef}>
      {prefix}{formattedCount}{suffix}
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
  return { ref, inView: true };
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
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [currentLine, setCurrentLine] = useState(1);
  const text1 = "Smart Tickets.";
  const text2 = "Smooth Entry.";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (currentLine === 1) {
      if (line1.length < text1.length) {
        timer = setTimeout(() => {
          setLine1(text1.substring(0, line1.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => {
          setCurrentLine(2);
        }, 400);
      }
    } else if (currentLine === 2) {
      if (line2.length < text2.length) {
        timer = setTimeout(() => {
          setLine2(text2.substring(0, line2.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => {
          setLine1("");
          setLine2("");
          setCurrentLine(1);
        }, 5000);
      }
    }

    return () => clearTimeout(timer);
  }, [line1, line2, currentLine]);

  return (
    <>
      <span>{line1}</span>
      {currentLine === 1 && (
        <span className="inline-block w-[4px] h-[0.9em] bg-white ml-1.5 align-middle animate-pulse" />
      )}
      <br />
      <span className="text-orange-500">{line2}</span>
      {currentLine === 2 && (
        <span className="inline-block w-[4px] h-[0.9em] bg-orange-500 ml-1.5 align-middle animate-pulse" />
      )}
    </>
  );
};


const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800", label: "Music Concerts" },
  { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", label: "Tech Conferences" },
  { url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800", label: "Sports Matches" },
  { url: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=800", label: "Theater Shows" },
  { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800", label: "Food Festivals" },
  { url: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800", label: "Comedy Nights" }
];

const SUCCESS_STORIES = [
  {
    name: "Sarah Mensah",
    role: "Music Festival Director",
    quote: "TickeX transformed our ticketing operations completely. Payouts were processed immediately after the event, and validation queue times were cut by 70%. We saw a 35% increase in online sales!",
    metric: "+35% Sales Boost",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Kofi Boateng",
    role: "Tech Summit Coordinator",
    quote: "Our attendees loved how fast the checkout was. Paystack integration works flawlessly, allowing users to secure passes in under 10 seconds. Highly recommend TickeX for any corporate event.",
    metric: "10s Checkout Speed",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    name: "Ama Serwaa",
    role: "Food Bazaar Organizer",
    quote: "We used to have problems with duplicated tickets at the entrance. The encrypted, single-use QR codes solved fraud overnight. Scanning was smooth using just our phones.",
    metric: "0% Ticket Fraud",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [eventType, setEventType] = useState("Music");
  const [orgDesc, setOrgDesc] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("tickex_token");
      const storedUser = localStorage.getItem("tickex_user");
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
        }
      }
    }
  }, []);

  const handleHostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user && (user.role === "ORGANIZER" || user.role === "ADMIN")) {
      router.push("/dashboard");
    } else {
      setApplicantName("");
      setApplicantEmail("");
      setOrgName("");
      setEventType("Music");
      setOrgDesc("");
      setFormSubmitted(false);
      setSubmittingForm(false);
      setShowUpgradeModal(true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setFeaturesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-[#030014] bg-[url('/hero_bg.png')] bg-cover bg-center text-white overflow-hidden">
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
                <button 
                  onClick={handleHostClick}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-full shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Host An Event
                </button>
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
              <div className="relative w-full max-w-[400px] bg-gradient-to-b from-[#0b021a] to-[#1c0835] border border-[#2a1353] rounded-3xl p-5 shadow-2xl overflow-hidden transform -rotate-3 hover:rotate-0 hover:scale-[1.03] transition-all duration-300">
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

      {/* EVENT VENUES HORIZONTAL MARQUEE SECTION */}
      <section className="bg-[#f8fafc] pt-32 pb-8 overflow-hidden border-b border-slate-100 relative">
        {/* Animated Moving Wave Separator at the top of Marquee (reversing curve out from dark Stats section above) */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden z-20 pointer-events-none leading-[0]">
          <svg className="relative block w-full h-[80px] lg:h-[120px]" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wave 1: Brand Orange (Slow, peeking outline) */}
            <path d="M0,95 C150,115 350,75 500,95 C650,115 850,75 1000,95 C1150,115 1300,95 1400,95 L1400,0 L0,0 Z" fill="#f97316" opacity="0.3">
              <animate attributeName="d" dur="16s" repeatCount="indefinite" values="
                M0,95 C150,115 350,75 500,95 C650,115 850,75 1000,95 C1150,115 1300,95 1400,95 L1400,0 L0,0 Z;
                M0,95 C150,75 350,115 500,95 C650,75 850,115 1000,95 C1150,75 1300,95 1400,95 L1400,0 L0,0 Z;
                M0,95 C150,115 350,75 500,95 C650,115 850,75 1000,95 C1150,115 1300,95 1400,95 L1400,0 L0,0 Z
              "/>
            </path>
            {/* Wave 2: Bright Yellow/Gold (Medium speed, bright layer) */}
            <path d="M0,85 C300,105 600,65 900,85 C1050,95 1200,75 1400,85 L1400,0 L0,0 Z" fill="#eab308" opacity="0.2">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
                M0,85 C300,105 600,65 900,85 C1050,95 1200,75 1400,85 L1400,0 L0,0 Z;
                M0,85 C300,65 600,105 900,85 C1050,75 1200,95 1400,85 L1400,0 L0,0 Z;
                M0,85 C300,105 600,65 900,85 C1050,95 1200,75 1400,85 L1400,0 L0,0 Z
              "/>
            </path>
            {/* Wave 3: Solid base filled with dark Stats color (#020617) */}
            <path d="M0,70 C200,90 400,50 600,70 C800,90 1000,50 1200,70 L1200,0 L0,0 Z" fill="#020617">
              <animate attributeName="d" dur="7s" repeatCount="indefinite" values="
                M0,70 C200,90 400,50 600,70 C800,90 1000,50 1200,70 L1200,0 L0,0 Z;
                M0,70 C200,50 400,90 600,70 C800,50 1000,90 1200,70 L1200,0 L0,0 Z;
                M0,70 C200,90 400,50 600,70 C800,90 1000,50 1200,70 L1200,0 L0,0 Z
              "/>
            </path>
          </svg>
        </div>

        {/* Modern Dot Grid Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none z-0" />
        
        {/* Ambient Gradient Glows to remove cold white feeling */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-orange-200/20 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-orange-200/15 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Staggered Floating Ticket Silhouettes (Jezzr style) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.045] select-none">
          {/* Left Side */}
          <svg className="absolute -top-10 -left-12 w-96 h-96 text-[#020617] transform -rotate-12" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
          <svg className="absolute bottom-4 left-44 w-72 h-72 text-[#020617] transform rotate-45" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
          
          {/* Right Side */}
          <svg className="absolute -top-6 right-8 w-80 h-80 text-[#020617] transform rotate-12" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
          <svg className="absolute -bottom-10 right-48 w-80 h-80 text-[#020617] transform -rotate-45" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-950">
            Join <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">thousands of event-goers</span> who trust TickeX
          </h2>
          <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto">
            Discover the next unforgettable experience in your city or host your own event.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a 
              href="#events" 
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Find Your Event &rarr;
            </a>
            <button 
              onClick={handleHostClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/80 backdrop-blur-md border border-slate-200 hover:border-orange-200 hover:text-orange-600 text-slate-800 font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Create an Event +
            </button>
          </div>
        </div>

        {/* Marquee Row */}
        <div className="w-full overflow-hidden relative py-6">
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-6">
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, idx) => (
              <div 
                key={idx}
                className="w-[280px] sm:w-[320px] h-[180px] sm:h-[220px] rounded-3xl overflow-hidden shrink-0 relative group shadow-lg shadow-slate-200/40 cursor-pointer"
              >
                <img 
                  src={img.url} 
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-0" />
                <span className="absolute bottom-5 left-6 text-white font-bold text-base sm:text-lg tracking-tight z-10">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION (Clean Light Theme) */}
      <section id="events" className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

      {/* KEY PILLARS FEATURE SECTION */}
      <section id="features" ref={featuresRef} className="bg-slate-50 py-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-950/20 rounded-full blur-[100px] pointer-events-none z-[2]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[3]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-orange-400 font-bold tracking-wider uppercase text-sm mb-3 inline-block">
              Premium Infrastructure
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-950">
              Designed For Seamless Entry
            </h2>
            <p className="text-slate-600 text-lg font-light">
              TickeX builds the link between online ticketing and physical validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Feature 1 */}
            <div className={`relative overflow-hidden group rounded-[2rem] p-8 h-[20rem] flex flex-col justify-start border border-slate-200/80 border-l-[5px] border-l-orange-500 group-hover:border-l-[12px] group-hover:border-l-orange-600 hover:shadow-lg bg-white transform transition-all duration-500 ease-out ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              {/* Background Image Watermark */}
              <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600" 
                alt="Smart QR Tickets" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:scale-105 group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none"
              />
              {/* Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 z-0" />
              
              {/* Ambient glow details */}
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

              {/* Giant Acronym Letter Watermark */}
              <span className="text-8xl font-black text-orange-500/5 absolute top-4 right-6 select-none z-10 uppercase tracking-tighter">Q</span>

              <div className="relative z-10 flex flex-col items-start w-full">
                {/* Circular Icon Container */}
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-6 shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                
                <span className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-extrabold block mb-1">Infrastructure</span>
                <h3 className="text-2xl font-bold tracking-tight text-[#020617] mb-3">Smart QR Tickets</h3>
                <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-[95%]">
                  Each ticket includes a unique, encrypted QR code. Validate entry at the door with any smartphone camera in under 1 second.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`relative overflow-hidden group rounded-[2rem] p-8 h-[25rem] flex flex-col justify-start border border-slate-200/80 border-l-[5px] border-l-orange-500 group-hover:border-l-[12px] group-hover:border-l-orange-600 hover:shadow-lg bg-white transform transition-all duration-500 delay-200 ease-out ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              {/* Background Image Watermark */}
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600" 
                alt="Paystack Payments" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:scale-105 group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none"
              />
              {/* Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 z-0" />
              
              {/* Ambient glow details */}
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

              {/* Giant Acronym Letter Watermark */}
              <span className="text-8xl font-black text-orange-500/5 absolute top-4 right-6 select-none z-10 uppercase tracking-tighter">P</span>

              <div className="relative z-10 flex flex-col items-start w-full">
                {/* Circular Icon Container */}
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-6 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                
                <span className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-extrabold block mb-1">Checkout</span>
                <h3 className="text-2xl font-bold tracking-tight text-[#020617] mb-3">Paystack Payments</h3>
                <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-[95%]">
                  Enjoy frictionless checkout. Support cards, bank transfers, and USSD. Organizers receive instant, transparent payouts.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`relative overflow-hidden group rounded-[2rem] p-8 h-[30rem] flex flex-col justify-start border border-slate-200/80 border-l-[5px] border-l-orange-500 group-hover:border-l-[12px] group-hover:border-l-orange-600 hover:shadow-lg bg-white transform transition-all duration-500 delay-400 ease-out ${featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              {/* Background Image Watermark */}
              <img 
                src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600" 
                alt="Anti-Fraud Validation" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:scale-105 group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none"
              />
              {/* Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 z-0" />
              
              {/* Ambient glow details */}
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

              {/* Giant Acronym Letter Watermark */}
              <span className="text-8xl font-black text-orange-500/5 absolute top-4 right-6 select-none z-10 uppercase tracking-tighter">S</span>

              <div className="relative z-10 flex flex-col items-start w-full">
                {/* Circular Icon Container */}
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-6 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                
                <span className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-extrabold block mb-1">Security</span>
                <h3 className="text-2xl font-bold tracking-tight text-[#020617] mb-3">Anti-Fraud Validation</h3>
                <p className="text-sm font-normal text-slate-500 leading-relaxed max-w-[95%]">
                  Eliminate scalping and ticket duplication. Real-time scanning sync makes sure ticket tokens can only be used once.
                </p>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* REDESIGNED TESTIMONIALS SECTION (Pinterest Style) */}
      <section id="organizers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-12 mb-12">
        {/* Top staggered portrait grid */}
        <div className="relative w-full overflow-visible mb-16 pt-8 pb-12">
          {/* Subtle background details */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
          
          {/* Staggered Floating Ticket Silhouettes (Jezzr style) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.045] select-none">
            {/* Top-Left */}
            <svg className="absolute -top-12 -left-10 w-[26rem] h-[26rem] text-[#020617] transform -rotate-12" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
            {/* Top-Right */}
            <svg className="absolute top-24 right-16 w-80 h-80 text-[#020617] transform rotate-45" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
            {/* Center-Left */}
            <svg className="absolute top-1/2 left-24 w-80 h-80 text-[#020617] transform rotate-12" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
            {/* Center-Right */}
            <svg className="absolute top-1/2 right-32 w-[28rem] h-[28rem] text-[#020617] transform -rotate-45" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
            {/* Bottom-Left */}
            <svg className="absolute bottom-12 left-1/4 w-72 h-72 text-[#020617] transform rotate-90" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
            {/* Bottom-Right */}
            <svg className="absolute bottom-6 right-12 w-[24rem] h-[24rem] text-[#020617] transform -rotate-12" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 max-w-5xl mx-auto justify-center">
            {/* Col 1 */}
            <div className="flex flex-col gap-4 transform translate-y-2">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-4 transform translate-y-10">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-4 transform translate-y-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-4 transform translate-y-6">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 5 */}
            <div className="hidden sm:flex flex-col gap-4 transform translate-y-12">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 6 */}
            <div className="hidden sm:flex flex-col gap-4 transform translate-y-2">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 7 */}
            <div className="hidden lg:flex flex-col gap-4 transform translate-y-8">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Col 8 */}
            <div className="hidden lg:flex flex-col gap-4 transform translate-y-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <img src="https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=300" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 inline-block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 mb-6 leading-tight">
            Trusted by <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">leaders</span> from various industries
          </h2>
          <p className="text-slate-500 text-lg font-light leading-relaxed mb-8">
            Learn why organizers and attendees trust our solutions to complete their seamless customer journeys.
          </p>

          <button 
            onClick={() => setShowStoriesModal(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#020617] hover:bg-[#0f172a] text-white font-semibold rounded-full shadow-lg shadow-slate-900/20 transition-all duration-205 hover:-translate-y-0.5 cursor-pointer"
          >
            Read Success Stories <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f8fafc] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-[#020617] rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl shadow-black/20 relative overflow-hidden text-white">
          
          {/* Giant watermark background text */}
          <div className="absolute -bottom-8 left-8 text-[7rem] sm:text-[10rem] font-black text-slate-900/40 select-none pointer-events-none tracking-tighter leading-none z-0">
            TICKEX
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* Left Column: Branding and Socials */}
            <div className="lg:col-span-5 flex flex-col items-start gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Ticket className="w-6 h-6 rotate-12" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Ticke<span className="text-orange-500">X</span>
                </span>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                TickeX platforms build the seamless bridge between online ticket sales and real-world physical validation, ensuring quick and secure entry at scale.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4 text-slate-400">
                <a href="#" aria-label="Twitter/X" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>
              </div>
            </div>

            {/* Right Column: Links */}
            <div className="lg:col-span-7 grid grid-cols-3 gap-8">
              {/* Product links */}
              <div>
                <h4 className="font-bold text-white text-sm mb-4">Product</h4>
                <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Resources links */}
              <div>
                <h4 className="font-bold text-white text-sm mb-4">Resources</h4>
                <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>

              {/* Company links */}
              <div>
                <h4 className="font-bold text-white text-sm mb-4">Company</h4>
                <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <span className="text-slate-500 text-sm font-light">
              &copy; 2026 TickeX Platforms. All rights reserved.
            </span>
            <div className="flex items-center gap-6 text-slate-400 text-sm font-light">
              <a href="#" className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">Privacy policy</a>
              <a href="#" className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">Terms of service</a>
              <a href="#" className="hover:text-white transition-colors hover:underline decoration-1 underline-offset-4">Cookie settings</a>
            </div>
          </div>

        </div>
      </footer>

      {/* SUCCESS STORIES CAROUSEL MODAL */}
      {showStoriesModal && (
        <div className="fixed inset-0 z-50 bg-[#030014]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#020617] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-white">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-orange-400 font-bold uppercase text-[10px] tracking-wider mb-1 block">Success Stories</span>
                <h3 className="text-2xl font-bold text-white">What our organizers say</h3>
              </div>
              <button 
                onClick={() => setShowStoriesModal(false)}
                className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Story Carousel */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Side: Avatar and Metric */}
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/25 mb-4">
                    <img 
                      src={SUCCESS_STORIES[activeStoryIdx].image} 
                      alt={SUCCESS_STORIES[activeStoryIdx].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-white leading-tight">{SUCCESS_STORIES[activeStoryIdx].name}</h4>
                  <p className="text-[11px] text-slate-400 mb-4">{SUCCESS_STORIES[activeStoryIdx].role}</p>
                  
                  {/* Highlight Metric */}
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                    {SUCCESS_STORIES[activeStoryIdx].metric}
                  </span>
                </div>

                {/* Right Side: Testimony Quote */}
                <div className="md:col-span-8 flex flex-col justify-center relative">
                  <span className="text-6xl font-serif text-orange-500/10 leading-none h-4 absolute -top-8 -left-2 select-none">“</span>
                  <p className="text-slate-300 italic text-lg leading-relaxed mb-6 font-light">
                    {SUCCESS_STORIES[activeStoryIdx].quote}
                  </p>
                  <span className="text-6xl font-serif text-orange-500/10 leading-none h-4 absolute -bottom-4 right-0 select-none">”</span>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {SUCCESS_STORIES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoryIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeStoryIdx === idx ? 'w-8 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-slate-950/40 flex justify-between items-center">
              <button 
                onClick={() => setActiveStoryIdx((prev) => (prev - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold text-sm transition-all"
              >
                Previous
              </button>
              <button 
                onClick={() => setActiveStoryIdx((prev) => (prev + 1) % SUCCESS_STORIES.length)}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Next Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UPGRADE ROLE MODAL (ORGANIZER APPLICATION) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto">
            {formSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 mx-auto animate-bounce">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Application Submitted!</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-md mx-auto text-center">
                  Thank you for applying to host events on TickeX! Our administration team has received your application. We will review your organization details and upgrade your account to Organizer status within 24 hours. You'll receive a confirmation email once active.
                </p>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmittingForm(true);
                // Simulate submitting to administration API
                setTimeout(() => {
                  setSubmittingForm(false);
                  setFormSubmitted(true);
                }, 1500);
              }} className="space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <Users className="w-6 h-6 text-orange-500 shrink-0" />
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Become an Organizer</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Submit details to start organizing events</p>
                  </div>
                </div>

                {/* Editable Applicant Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Organization Details */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Organization, Company or Individual Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neon Horizon Events"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  />
                </div>

                {/* Event Type Select */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Event Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  >
                    <option value="Music">Music & Concerts</option>
                    <option value="Tech">Tech Conferences</option>
                    <option value="Sports">Sports Events</option>
                    <option value="Food">Food Festivals</option>
                    <option value="Comedy">Comedy Shows</option>
                    <option value="Other">Other / Workshops</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tell us about your events</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what events you plan to list on TickeX..."
                    value={orgDesc}
                    onChange={(e) => setOrgDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    disabled={submittingForm}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl text-sm transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingForm}
                    className="w-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {submittingForm ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
