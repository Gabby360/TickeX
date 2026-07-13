"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  DollarSign, 
  Ticket, 
  Search, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  LogOut, 
  ArrowUpRight,
  UserCog,
  ChevronRight,
  Trash2,
  ExternalLink,
  MapPin,
  Tag
} from "lucide-react";

type UserData = {
  id: string;
  email: string;
  name?: string | null;
  role: "USER" | "ORGANIZER" | "ADMIN";
  createdAt: string;
  _count: {
    events: number;
    tickets: number;
  };
};

type EventData = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: number;
  image: string;
  organizer: {
    name?: string | null;
    email: string;
  };
};

type AdminStats = {
  totalUsers: number;
  totalEvents: number;
  totalTickets: number;
  totalPlatformRevenue: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "events">("users");

  // User tab search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ORGANIZER" | "ADMIN">("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Events tab search
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    const token = localStorage.getItem("tickex_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const [statsRes, usersRes, eventsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/users/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events`),
      ]);

      if (statsRes.ok && usersRes.ok) {
        const statsData = await statsRes.json();
        const usersData = await usersRes.json();
        setStats(statsData);
        setUsers(usersData);
        
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }
      } else if (statsRes.status === 403 || usersRes.status === 403) {
        setError("Forbidden: You do not have Platform Administrator permissions.");
      } else {
        setError("Failed to load system data.");
      }
    } catch (err) {
      setError("Error connecting to administration server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [router]);

  const handleUpdateRole = async (userId: string, newRole: "USER" | "ORGANIZER" | "ADMIN") => {
    const token = localStorage.getItem("tickex_token");
    if (!token || updatingId) return;

    setUpdatingId(userId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert("Failed to update user role");
      }
    } catch (err) {
      alert("Network error updating role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const token = localStorage.getItem("tickex_token");
    if (!token || deletingId) return;

    if (!confirm("Are you sure you want to delete this event? This will instantly cancel and remove all tickets issued for it!")) {
      return;
    }

    setDeletingId(eventId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        if (stats) {
          setStats({
            ...stats,
            totalEvents: stats.totalEvents - 1,
          });
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete event");
      }
    } catch (err) {
      alert("Network error deleting event");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tickex_token");
    localStorage.removeItem("tickex_user");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading Platform Command Center...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6 max-w-md">{error || "You do not have administrative access to view this system."}</p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all"
        >
          Return to Admin Login
        </button>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredEvents = events.filter((e) => {
    return (
      e.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      e.organizer.email.toLowerCase().includes(eventSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 pb-24 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Bar */}
      <header className="bg-[#030014]/90 border-b border-white/10 sticky top-0 z-30 shadow-lg backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-md shadow-orange-500/20 ring-1 ring-white/10">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                  System Admin
                </span>
                <span className="text-xs text-slate-500 font-mono">v1.0.0</span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">Platform Command Center</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
            >
              <span>Public Portal</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-all border border-white/10"
              title="End Admin Session"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 space-y-10">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Gross Platform Volume</span>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">
              GH₵ {stats.totalPlatformRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-400 font-semibold mt-2">100% Platform Verified</p>
          </div>

          <div className="bg-slate-900/90 p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Registered Accounts</span>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">
              {stats.totalUsers}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Active platform members</p>
          </div>

          <div className="bg-slate-900/90 p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-all backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Platform Events</span>
              <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">
              {stats.totalEvents}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Published & Live listings</p>
          </div>

          <div className="bg-slate-900/90 p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-all backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Total Tickets Issued</span>
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">
              {stats.totalTickets}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Paid and checked-in passes</p>
          </div>

        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            👥 User Directory & Roles
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-5 py-2.5 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "events"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-4 h-4" />
            🎪 Event Moderation Grid
          </button>
        </div>

        {activeTab === "users" ? (
          /* USER DIRECTORY TAB */
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            
            <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-orange-500" />
                  User Directory & Role Manager
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  Inspect registered users and promote accounts to Organizer or System Admin
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#030014]/80 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="flex items-center bg-[#030014]/80 p-1 rounded-xl border border-white/15 w-full sm:w-auto">
                  {(["ALL", "USER", "ORGANIZER", "ADMIN"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize ${
                        roleFilter === role ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {role.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#030014]/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Account User</th>
                    <th className="py-4 px-6">Current Role</th>
                    <th className="py-4 px-6 text-center">Events Owned</th>
                    <th className="py-4 px-6 text-center">Tickets Purchased</th>
                    <th className="py-4 px-6 text-right">Role Management Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredUsers.map((u) => {
                    const isUpdating = updatingId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white flex items-center gap-2">
                            {u.name || "Unnamed User"}
                            {u.role === "ADMIN" && (
                              <ShieldCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-slate-400 text-xs mt-0.5">{u.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                            u.role === "ADMIN" 
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              : u.role === "ORGANIZER"
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              : "bg-white/5 text-slate-300 border-white/10"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-slate-300">
                          {u._count.events}
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-slate-300">
                          {u._count.tickets}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            {isUpdating ? (
                              <Loader2 className="w-5 h-5 animate-spin text-orange-500 mx-auto" />
                            ) : (
                              <>
                                {u.role !== "ORGANIZER" && (
                                  <button
                                    onClick={() => handleUpdateRole(u.id, "ORGANIZER")}
                                    className="px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-bold transition-all"
                                  >
                                    Make Organizer
                                  </button>
                                )}
                                {u.role !== "USER" && (
                                  <button
                                    onClick={() => handleUpdateRole(u.id, "USER")}
                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-slate-300 rounded-lg text-xs font-bold transition-all border border-white/10"
                                  >
                                    Make User
                                  </button>
                                )}
                                {u.role !== "ADMIN" && (
                                  <button
                                    onClick={() => handleUpdateRole(u.id, "ADMIN")}
                                    className="px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500 text-orange-300 hover:text-white border border-orange-500/30 rounded-lg text-xs font-bold transition-all"
                                  >
                                    Make Admin
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* EVENT MODERATION TAB */
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            
            <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Event Moderation Grid
                </h2>
                <p className="text-slate-400 text-sm mt-0.5">
                  Monitor live events and delete/moderate any inappropriate or violating listings
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, location, or organizer..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="w-full bg-[#030014]/80 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#030014]/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Event Details</th>
                    <th className="py-4 px-6">Date & Time</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Host / Organizer</th>
                    <th className="py-4 px-6">Ticket Price</th>
                    <th className="py-4 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                        No events found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event) => {
                      const isDeleting = deletingId === event.id;
                      const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={event.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-white leading-tight">{event.title}</div>
                            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wide">
                              {event.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-300 font-medium">{formattedDate}</td>
                          <td className="py-4 px-6 text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-white font-semibold">{event.organizer?.name || "Organizer"}</div>
                            <div className="text-slate-400 text-xs">{event.organizer?.email}</div>
                          </td>
                          <td className="py-4 px-6 font-bold text-white">
                            {event.price === 0 ? "Free" : `GH₵ ${event.price}`}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-3">
                              <a
                                href={`/events/${event.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all border border-white/10"
                                title="View Public Listing"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              {isDeleting ? (
                                <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                              ) : (
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/20"
                                  title="Moderate & Delete Event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
