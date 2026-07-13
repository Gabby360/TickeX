"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Search, 
  QrCode, 
  Calendar, 
  MapPin, 
  Loader2,
  TrendingUp,
  Filter
} from "lucide-react";

type Attendee = {
  id: string;
  status: string;
  createdAt: string;
  scannedAt?: string | null;
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
};

type AnalyticsData = {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    category: string;
  };
  totalTicketsSold: number;
  totalScanned: number;
  totalRevenue: number;
  attendees: Attendee[];
};

export default function EventManagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SCANNED" | "PAID">("ALL");

  useEffect(() => {
    if (!id) return;

    const fetchAnalytics = async () => {
      const token = localStorage.getItem("tickex_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/tickets/event/${id}/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
        } else {
          const errData = await res.json();
          setError(errData.message || "Failed to load event analytics");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading event analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Could not load dashboard</h1>
        <p className="text-slate-400 mb-6">{error || "Event not found or access denied"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { event, totalTicketsSold, totalScanned, totalRevenue, attendees } = data;
  const checkInRate = totalTicketsSold > 0 ? Math.round((totalScanned / totalTicketsSold) * 100) : 0;

  // Filter Attendees
  const filteredAttendees = attendees.filter((att) => {
    const matchesSearch = 
      (att.user.name && att.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      att.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === "ALL" || 
      att.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 pb-24 font-sans">
      {/* Top Banner / Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                {event.category}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1 line-clamp-1">{event.title}</h1>
            </div>
          </div>

          <button
            onClick={() => router.push(`/dashboard/scan?eventId=${event.id}`)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <QrCode className="w-5 h-5" />
            Launch Scanner
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 space-y-10">
        
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-sm">Total Revenue</span>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              GH₵ {totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>Gross Earnings from Sales</span>
            </div>
          </div>

          {/* Tickets Sold Card */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-sm">Tickets Sold</span>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">
              {totalTicketsSold}
            </p>
            <p className="text-xs text-slate-400 mt-3 font-medium">
              Price per pass: <span className="text-white font-bold">{event.price === 0 ? "Free" : `GH₵ ${event.price}`}</span>
            </p>
          </div>

          {/* Check-in Rate Card */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 font-medium text-sm">Check-In Rate</span>
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-white tracking-tight">{checkInRate}%</p>
              <span className="text-sm font-bold text-slate-400">({totalScanned} checked in)</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${checkInRate}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Attendee Management Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Controls Bar */}
          <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Attendee Roster</h2>
              <p className="text-slate-400 text-sm mt-0.5">Manage and verify guests registered for your event</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#030014] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center bg-[#030014] p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === "ALL" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({attendees.length})
                </button>
                <button
                  onClick={() => setStatusFilter("SCANNED")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === "SCANNED" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Checked In ({totalScanned})
                </button>
                <button
                  onClick={() => setStatusFilter("PAID")}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === "PAID" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Pending ({totalTicketsSold - totalScanned})
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredAttendees.length === 0 ? (
            <div className="py-16 text-center">
              <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-white font-bold text-lg">No attendees found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search or status filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#030014]/50 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Attendee</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Check-In Time</th>
                    <th className="py-4 px-6">Ticket ID</th>
                    <th className="py-4 px-6 text-right">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredAttendees.map((att) => {
                    const isCheckedIn = att.status === "SCANNED";
                    const scanTimeStr = att.scannedAt 
                      ? new Date(att.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : null;
                    const purchaseDateStr = new Date(att.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">
                            {att.user.name || "Unnamed Guest"}
                          </div>
                          <div className="text-slate-400 text-xs mt-0.5">
                            {att.user.email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {isCheckedIn ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Checked In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock className="w-3.5 h-3.5" />
                              Pending Entry
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-medium">
                          {scanTimeStr ? (
                            <span className="text-emerald-400 font-mono font-bold">{scanTimeStr}</span>
                          ) : (
                            <span className="text-slate-600 italic">Not scanned yet</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          {att.id.slice(0, 8)}...
                        </td>
                        <td className="py-4 px-6 text-right text-slate-400 font-medium">
                          {purchaseDateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
