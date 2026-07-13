"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { 
  Ticket, 
  Plus, 
  Calendar, 
  MapPin, 
  LogOut, 
  User as UserIcon, 
  TrendingUp, 
  Users, 
  DollarSign, 
  QrCode, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Compass,
  ArrowUpRight,
  Loader2
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ORGANIZER" | "ADMIN";
}

// Mock statistics for Organizer Dashboard
const ORGANIZER_STATS = [
  { label: "Total Tickets Sold", value: "324", icon: Users, color: "text-blue-500 bg-blue-50" },
  { label: "Net Revenue", value: "GH₵48,600", icon: DollarSign, color: "text-green-500 bg-green-50" },
  { label: "Check-in Rate", value: "87.4%", icon: QrCode, color: "text-purple-500 bg-purple-50" },
];

// Mock tickets for Attendee Dashboard
const ATTENDEE_TICKETS = [
  {
    id: "T1",
    title: "Accra Synthwave Festival",
    date: "July 28, 2026",
    location: "Accra International Conference Centre",
    seat: "General Admission",
    qrCode: "TICKEX-NEON-SYNTH-84938",
  },
  {
    id: "T2",
    title: "Global Tech Summit 2026",
    date: "August 12, 2026",
    location: "Labadi Beach Hotel, Accra",
    seat: "VIP Access Pass",
    qrCode: "TICKEX-TECH-SUMMIT-29384",
  }
];

// Mock created events for Organizer Dashboard
const ORGANIZER_EVENTS = [
  {
    id: "E1",
    title: "Accra Synthwave Festival",
    date: "July 28, 2026",
    status: "Active",
    ticketsSold: "184 / 300",
    revenue: "GH₵27,600",
  },
  {
    id: "E2",
    title: "Vip Comedy Night",
    date: "September 18, 2026",
    status: "Draft",
    ticketsSold: "0 / 100",
    revenue: "GH₵0",
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Music",
    date: "",
    location: "",
    price: 0,
    image: "",
  });

  const fetchMyEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events`);
      if (response.ok) {
        const data = await response.json();
        const storedUser = localStorage.getItem("tickex_user");
        const storedUserObj = storedUser ? JSON.parse(storedUser) : null;
        if (storedUserObj) {
          const filtered = data.filter((e: any) => e.organizerId === storedUserObj.id);
          setMyEvents(filtered);
        }
      }
    } catch (err) {
      console.error("Error loading events:", err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    const token = localStorage.getItem("tickex_token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/tickets/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyTickets(data);
      }
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);
    const token = localStorage.getItem("tickex_token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      // Success
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        category: "Music",
        date: "",
        location: "",
        price: 0,
        image: "",
      });
      fetchMyEvents();
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("tickex_token");
    const storedUser = localStorage.getItem("tickex_user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    // Verify token with backend
    const verifyToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        // Clear invalid auth data and redirect
        localStorage.removeItem("tickex_token");
        localStorage.removeItem("tickex_user");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  useEffect(() => {
    if (user) {
      if (user.role === "ORGANIZER") {
        fetchMyEvents();
      } else {
        fetchMyTickets();
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("tickex_token");
    localStorage.removeItem("tickex_user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  if (!user) return null;

  const isOrganizer = user.role === "ORGANIZER";

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* DASHBOARD HEADER */}
      <header className="bg-[#030014]/90 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Ticket className="w-6 h-6 rotate-12" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Ticke<span className="text-orange-500">X</span>
              </span>
            </div>

            {/* Profile Info & Log Out */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold border border-orange-200">
                  {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user.name || "User"}</p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                    {user.role}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Banner */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 mb-10 overflow-hidden shadow-xl shadow-slate-900/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <span className="text-orange-400 font-bold uppercase text-xs tracking-wider mb-2 inline-block">
              {isOrganizer ? "Organizer Workspace" : "Attendee Hub"}
            </span>
            <h1 className="text-3xl font-extrabold mb-3">
              Hello, {user.name || "Friend"}!
            </h1>
            <p className="text-slate-300 font-light max-w-xl">
              {isOrganizer 
                ? "Create new events, track ticket sales, and view real-time check-in stats below."
                : "Browse your tickets, display QR codes at the entry, and discover new live experiences."
              }
            </p>
          </div>
        </div>

        {isOrganizer ? (
          /* ORGANIZER DASHBOARD */
          <div className="space-y-10">
            {(() => {
              const displayEvents = myEvents.length > 0 ? myEvents.map(e => ({
                id: e.id,
                title: e.title,
                date: new Date(e.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                status: new Date(e.date) < new Date() ? "Ended" : "Active",
                ticketsSold: "0 / 100",
                revenue: e.price === 0 ? "Free" : `GH₵0`,
              })) : ORGANIZER_EVENTS;

              return (
                <>
                  {/* Stats Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ORGANIZER_STATS.map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
                          <div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">{stat.label}</span>
                            <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Event Management Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                      <h2 className="text-xl font-bold">My Events</h2>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 text-sm"
                      >
                        <Plus className="w-4 h-4" /> Create Event
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                            <th className="py-4 px-8">Event Name</th>
                            <th className="py-4 px-6">Event Date</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Tickets Sold</th>
                            <th className="py-4 px-6">Revenue</th>
                            <th className="py-4 px-8 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {displayEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-slate-50/50">
                              <td className="py-5 px-8 font-bold text-slate-800">{event.title}</td>
                              <td className="py-5 px-6 text-slate-500">{event.date}</td>
                              <td className="py-5 px-6">
                                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                                  event.status === "Active" 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                  {event.status}
                                </span>
                              </td>
                              <td className="py-5 px-6 font-semibold text-slate-700">{event.ticketsSold}</td>
                              <td className="py-5 px-6 font-bold text-slate-900">{event.revenue}</td>
                              <td className="py-5 px-8 text-right flex items-center justify-end gap-3">
                                <button 
                                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-colors"
                                  onClick={() => router.push(`/dashboard/manage/${event.id}`)}
                                >
                                  Manage
                                </button>
                                <button 
                                  className="px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl font-bold text-xs transition-colors flex items-center gap-1"
                                  onClick={() => router.push(`/dashboard/scan?eventId=${event.id}`)}
                                >
                                  Scanner
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          /* ATTENDEE DASHBOARD */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">My Ticket Passes</h2>
              <button 
                onClick={() => router.push("/#events")}
                className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-1 group"
              >
                Find more events <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {myTickets.length === 0 && !loadingTickets ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Ticket className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No tickets yet</h3>
                <p className="text-slate-500 mb-6">You haven't purchased any tickets yet. Explore events and get your first ticket!</p>
                <button 
                  onClick={() => router.push("/#events")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors"
                >
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTickets.map((ticket) => {
                  const eventDate = new Date(ticket.event.date);
                  const formattedDate = eventDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                  
                  return (
                    <div 
                      key={ticket.id}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-orange-200 transition-colors relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 border border-orange-100 text-orange-700 uppercase tracking-wide">
                              {ticket.status}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 mt-2">{ticket.event.title}</h3>
                          </div>
                          
                          {/* Ticket Icon */}
                          <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-orange-500">
                            <Ticket className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <Calendar className="w-4 h-4 text-orange-400" />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span className="line-clamp-1">{ticket.event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">ID: {ticket.id.substring(0,8).toUpperCase()}</span>
                        <button 
                          onClick={() => setShowQrModal(ticket.qrCode)}
                          className="bg-slate-900 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                        >
                          <QrCode className="w-4 h-4" /> View Ticket QR
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </main>

      {/* QR MODAL PREVIEW */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-1">Your Entry Ticket</h3>
            <p className="text-slate-400 text-xs mb-6">Present this QR code at the entry check-in counter</p>

            {/* QR Mock Image Container */}
            <div className="w-48 h-48 bg-white mx-auto rounded-2xl flex flex-col items-center justify-center border-2 border-slate-200 border-dashed p-4 mb-4">
              <QRCodeSVG value={showQrModal} size={160} />
            </div>

            <p className="text-xs font-mono font-bold text-slate-600 mb-6 bg-slate-50 py-2 rounded-xl border border-slate-100">
              {showQrModal}
            </p>

            <button 
              onClick={() => setShowQrModal(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-extrabold mb-1 text-slate-900">Create New Event</h3>
            <p className="text-slate-400 text-xs mb-6">Create a new public listing to start selling ticket passes</p>

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-5 text-left">
              {/* Event Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accra Synthwave Festival"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your event, atmosphere, speakers, performers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  >
                    <option value="Music">Music</option>
                    <option value="Tech">Tech</option>
                    <option value="Sports">Sports</option>
                    <option value="Food">Food</option>
                    <option value="Comedy">Comedy</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ticket Price (GH₵)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Set 0 for Free tickets</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Venue Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Labadi Beach Hotel, Accra"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cover Image URL</label>
                  <button
                    type="button"
                    onClick={() => {
                      const presets: Record<string, string> = {
                        Music: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
                        Tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
                        Sports: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
                        Food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
                        Comedy: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=800",
                      };
                      setFormData({
                        ...formData,
                        image: presets[formData.category] || presets.Music,
                      });
                    }}
                    className="text-[10px] font-bold text-orange-600 hover:text-orange-700"
                  >
                    Autofill category preset
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {creating ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 text-slate-400 py-8 text-center text-xs mt-auto">
        <p>&copy; 2026 TickeX Platforms. All rights reserved.</p>
      </footer>

    </div>
  );
}
