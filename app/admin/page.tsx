"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ===== TYPES =====
interface Lead {
  _id: string;
  fullName: string;
  mobile: string;
  city: string;
  state: string;
  loanType: string;
  monthlyIncome: string;
  status: "New" | "Contacted" | "Approved" | "Rejected";
  notes?: string;
  followUpDate?: string;
  notesHistory?: NoteHistory[];
  followUpHistory?: FollowUpHistory[];
  createdAt?: string;
  updatedAt?: string;
}

interface NoteHistory {
  _id: string;
  note: string;
  createdAt: string;
}

interface FollowUpHistory {
  _id: string;
  date: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: "new_lead" | "follow_up" | "overdue" | "status_change";
  message: string;
  time: string;
  read: boolean;
  leadId?: string;
}

const COLORS = ["#f59e0b", "#f97316", "#22c55e", "#ef4444"];

// ===== COMPONENT =====
export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ===== AUTH CHECK =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  // ===== DATA =====
  const filteredLeads = useMemo(() => {
    const searchText = search.toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName?.toLowerCase().includes(searchText) ||
        lead.mobile?.toString().includes(searchText);
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      let matchesDate = true;
      if (dateFrom && lead.createdAt) {
        const leadDate = new Date(lead.createdAt).toISOString().split("T")[0];
        if (leadDate < dateFrom) matchesDate = false;
      }
      if (dateTo && lead.createdAt) {
        const leadDate = new Date(lead.createdAt).toISOString().split("T")[0];
        if (leadDate > dateTo) matchesDate = false;
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [leads, search, statusFilter, dateFrom, dateTo]);

  const todayFollowUps = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return leads.filter(
      (lead) => lead.followUpDate && lead.followUpDate.split("T")[0] === today
    );
  }, [leads]);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const overdueLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.followUpDate &&
        new Date(lead.followUpDate).getTime() < todayStart.getTime()
    );
  }, [leads, todayStart]);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    leads.forEach((lead) => {
      if (lead.createdAt) {
        const month = new Date(lead.createdAt).toLocaleString("default", {
          month: "short",
        });
        months[month] = (months[month] || 0) + 1;
      }
    });
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [leads]);

  const pieData = useMemo(() => {
    const counts = {
      New: leads.filter((l) => l.status === "New").length,
      Contacted: leads.filter((l) => l.status === "Contacted").length,
      Approved: leads.filter((l) => l.status === "Approved").length,
      Rejected: leads.filter((l) => l.status === "Rejected").length,
    };
    return [
      { name: "New", value: counts.New, color: "#f59e0b" },
      { name: "Contacted", value: counts.Contacted, color: "#f97316" },
      { name: "Approved", value: counts.Approved, color: "#22c55e" },
      { name: "Rejected", value: counts.Rejected, color: "#ef4444" },
    ].filter((d) => d.value > 0);
  }, [leads]);

  // ===== API =====
  const fetchLeads = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        generateNotifications(data.leads || []);
      }
      if (showRefresh) {
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-in text-sm font-medium";
        toast.textContent = "✅ Data Refreshed Successfully!";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    } catch (error) {
      console.error("Fetch leads error:", error);
      if (!showRefresh) alert("Failed to fetch leads");
    } finally {
      setIsLoading(false);
      if (showRefresh) setIsRefreshing(false);
    }
  }, []);

  const generateNotifications = useCallback((leadsData: Lead[]) => {
    const newNotifs: Notification[] = [];
    const today = new Date().toISOString().split("T")[0];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const todayFollows = leadsData.filter(
      (l) => l.followUpDate && l.followUpDate.split("T")[0] === today
    );
    if (todayFollows.length > 0) {
      newNotifs.push({
        id: `followup_${Date.now()}`,
        type: "follow_up",
        message: `📅 ${todayFollows.length} follow-up${todayFollows.length > 1 ? "s" : ""} due today`,
        time: "Today",
        read: false,
      });
    }

    const overdue = leadsData.filter(
      (l) => l.followUpDate && new Date(l.followUpDate).getTime() < todayStart.getTime()
    );
    if (overdue.length > 0) {
      newNotifs.push({
        id: `overdue_${Date.now()}`,
        type: "overdue",
        message: `🚨 ${overdue.length} lead${overdue.length > 1 ? "s" : ""} overdue for follow-up`,
        time: "Today",
        read: false,
      });
    }

    const newLeads = leadsData.filter(
      (l) => l.createdAt && new Date(l.createdAt) > yesterday
    );
    if (newLeads.length > 0) {
      newNotifs.push({
        id: `new_${Date.now()}`,
        type: "new_lead",
        message: `🆕 ${newLeads.length} new lead${newLeads.length > 1 ? "s" : ""} added`,
        time: "Today",
        read: false,
      });
    }

    setNotifications(newNotifs);
  }, []);

  // ===== EFFECTS =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchLeads();
    }
  }, [fetchLeads]);

  // ===== HANDLERS =====
  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        if (selectedLead?._id === id) setSelectedLead(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/leads/${selectedLead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notes: selectedLead.notes,
          followUpDate: selectedLead.followUpDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLeads();
        const refreshRes = await fetch("/api/admin/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refreshData = await refreshRes.json();
        const updatedLead = refreshData.leads.find(
          (l: Lead) => l._id === selectedLead._id
        );
        setSelectedLead(updatedLead || null);
        alert("✅ Saved Successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(file, `Leads_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
  };

  // ===== BULK ACTIONS =====
  const toggleSelect = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l._id));
    }
  };

  const bulkApprove = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Approve ${selectedLeads.length} leads?`)) return;
    for (const id of selectedLeads) {
      await updateStatus(id, "Approved");
    }
    setSelectedLeads([]);
    alert(`✅ ${selectedLeads.length} leads approved!`);
  };

  const bulkReject = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Reject ${selectedLeads.length} leads?`)) return;
    for (const id of selectedLeads) {
      await updateStatus(id, "Rejected");
    }
    setSelectedLeads([]);
    alert(`✅ ${selectedLeads.length} leads rejected!`);
  };

  const bulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Delete ${selectedLeads.length} leads?`)) return;
    for (const id of selectedLeads) {
      const token = localStorage.getItem("token");
      await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await fetchLeads();
    setSelectedLeads([]);
    alert(`✅ ${selectedLeads.length} leads deleted!`);
  };

  const bulkExport = () => {
    if (selectedLeads.length === 0) return;
    const selectedData = leads.filter((l) => selectedLeads.includes(l._id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(file, `Selected_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const refreshData = async () => {
    await fetchLeads(true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setShowNotifications(false);
  };

  // ===== RENDER =====
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white/50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-2xl text-slate-600"
          >
            ☰
          </button>
          <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
            K
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-slate-800">Kinetik Capital</h1>
            <p className="text-xs md:text-sm text-slate-400">Lead Management Dashboard</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white/50 hover:bg-white rounded-xl transition text-slate-600 hover:text-indigo-600 relative"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-96 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">🔔 Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-64">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      <p className="text-3xl mb-2">🔕</p>
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition ${
                          !n.read ? "bg-indigo-50/50" : ""
                        }`}
                      >
                        <p className="text-sm text-slate-700">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-3 md:px-5 py-2 md:py-3 rounded-xl transition flex items-center gap-1 text-white font-medium text-sm ${
              isRefreshing
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
            }`}
          >
            {isRefreshing ? "⏳" : "🔄"} <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => {
              document.cookie = "token=; path=/; max-age=0";
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              router.push("/login");
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl text-sm"
          >
            🚪 <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Export & Total */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <button
          onClick={exportToExcel}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:shadow-lg transition flex items-center gap-2 text-sm"
        >
          📥 <span className="hidden sm:inline">Export Excel</span>
        </button>
        <span className="text-sm text-slate-400 bg-white/70 px-4 py-2 rounded-xl">
          Total: <span className="font-semibold text-slate-700">{leads.length}</span> leads
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg">
          <p className="text-xs opacity-90 font-medium">Today&apos;s Follow Ups</p>
          <h2 className="text-3xl font-bold mt-2">{todayFollowUps.length}</h2>
        </div>
        <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white p-4 rounded-2xl shadow-lg">
          <p className="text-xs opacity-90 font-medium">Total Leads</p>
          <h2 className="text-3xl font-bold mt-2">{leads.length}</h2>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-4 rounded-2xl shadow-lg">
          <p className="text-xs opacity-90 font-medium">New</p>
          <h2 className="text-3xl font-bold mt-2">{leads.filter(l => l.status === "New").length}</h2>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg">
          <p className="text-xs opacity-90 font-medium">Contacted</p>
          <h2 className="text-3xl font-bold mt-2">{leads.filter(l => l.status === "Contacted").length}</h2>
        </div>
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white p-4 rounded-2xl shadow-lg">
          <p className="text-xs opacity-90 font-medium">Approved</p>
          <h2 className="text-3xl font-bold mt-2">{leads.filter(l => l.status === "Approved").length}</h2>
        </div>
        <div className="bg-gradient-to-br from-rose-400 to-rose-500 text-white p-4 rounded-2xl shadow-lg">
          <p className="text-xs opacity-90 font-medium">Rejected</p>
          <h2 className="text-3xl font-bold mt-2">{leads.filter(l => l.status === "Rejected").length}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Monthly Leads</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-sm text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overdue & Today Alerts */}
      {overdueLeads.length > 0 && (
        <div className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-4 mb-6 shadow-lg">
          <h2 className="text-red-600 text-2xl font-bold mb-4 flex items-center gap-2">
            🚨 Overdue Follow Ups ({overdueLeads.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overdueLeads.map((lead) => (
              <div key={lead._id} className="bg-white/80 rounded-xl p-4 shadow flex justify-between items-center hover:shadow-lg transition">
                <div>
                  <p className="font-bold">{lead.fullName}</p>
                  <p className="text-sm text-slate-500">📱 {lead.mobile}</p>
                  <p className="text-xs text-red-600 font-bold">📅 {lead.followUpDate}</p>
                </div>
                <a href={`https://wa.me/91${lead.mobile}`} target="_blank" className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition">
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayFollowUps.length > 0 && (
        <div className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6 shadow-lg">
          <h2 className="text-amber-600 text-2xl font-bold mb-4 flex items-center gap-2">
            📞 Today&apos;s Follow Ups ({todayFollowUps.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayFollowUps.map((lead) => (
              <div key={lead._id} className="bg-white/80 rounded-xl p-4 shadow flex justify-between items-center hover:shadow-lg transition">
                <div>
                  <p className="font-bold">{lead.fullName}</p>
                  <p className="text-sm text-slate-500">📱 {lead.mobile}</p>
                  <p className="text-xs text-amber-600 font-bold">📅 {lead.followUpDate}</p>
                </div>
                <a href={`https://wa.me/91${lead.mobile}`} target="_blank" className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition">
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Name or Mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 backdrop-blur-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-wrap gap-2">
          {["All", "New", "Contacted", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl transition text-sm font-medium ${
                statusFilter === s
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white/80 text-slate-600 hover:bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-500 font-medium">📅 From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border-2 border-slate-200 p-2 rounded-xl bg-white/80 text-sm w-32 focus:ring-2 focus:ring-indigo-500"
          />
          <label className="text-sm text-slate-500 font-medium">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border-2 border-slate-200 p-2 rounded-xl bg-white/80 text-sm w-32 focus:ring-2 focus:ring-indigo-500"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={clearDateFilter}
              className="px-2 py-2 bg-rose-500 text-white rounded-xl text-sm hover:bg-rose-600 transition"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-indigo-700 font-medium">
            ✅ {selectedLeads.length} selected
          </span>
          <div className="flex flex-wrap gap-2">
            <button onClick={bulkApprove} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition">
              ✅ Approve
            </button>
            <button onClick={bulkReject} className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition">
              ❌ Reject
            </button>
            <button onClick={bulkExport} className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition">
              📥 Export
            </button>
            <button onClick={bulkDelete} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition">
              🗑️ Delete
            </button>
            <button onClick={() => setSelectedLeads([])} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition">
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
              <th className="p-2 md:p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Mobile</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">City</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Loan Type</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell">Income</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Follow Up</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="p-2 md:p-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-slate-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p>No leads found</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const followUpDate = lead.followUpDate ? new Date(lead.followUpDate) : null;
                const isOverdue = followUpDate ? followUpDate.getTime() < todayStart.getTime() : false;
                const isToday = followUpDate ? followUpDate >= todayStart && followUpDate < new Date(todayStart.getTime() + 86400000) : false;

                const statusColor =
                  lead.status === "New" ? "bg-yellow-100 text-yellow-700" :
                  lead.status === "Contacted" ? "bg-orange-100 text-orange-700" :
                  lead.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                  "bg-rose-100 text-rose-700";

                return (
                  <tr key={lead._id} className={`hover:bg-slate-50 transition ${isOverdue ? "bg-rose-50/50" : isToday ? "bg-amber-50/50" : ""} ${selectedLeads.includes(lead._id) ? "bg-indigo-50/50" : ""}`}>
                    <td className="p-2 md:p-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => toggleSelect(lead._id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="p-2 md:p-4">
                      <div>
                        <p className="font-medium text-slate-800">{lead.fullName}</p>
                        {isOverdue && <span className="inline-block mt-1 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">OVERDUE</span>}
                        {isToday && <span className="inline-block mt-1 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">TODAY</span>}
                      </div>
                    </td>
                    <td className="p-2 md:p-4 hidden sm:table-cell text-sm text-slate-600">{lead.mobile}</td>
                    <td className="p-2 md:p-4 hidden md:table-cell text-sm text-slate-600">{lead.city}</td>
                    <td className="p-2 md:p-4 hidden lg:table-cell">
                      <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">{lead.loanType}</span>
                    </td>
                    <td className="p-2 md:p-4 hidden xl:table-cell text-sm font-medium">₹ {lead.monthlyIncome}</td>
                    <td className="p-2 md:p-4 hidden lg:table-cell text-sm">
                      <span className={isOverdue ? "text-rose-600 font-bold" : isToday ? "text-amber-600 font-bold" : "text-slate-500"}>
                        {lead.followUpDate || "-"}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium border-0 cursor-pointer ${statusColor}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedLead(lead)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition" title="View">👁️</button>
                        <a href={`https://wa.me/91${lead.mobile}`} target="_blank" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition" title="WhatsApp">💬</a>
                        <button onClick={() => deleteLead(lead._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedLead.fullName}</h2>
                <p className="text-sm text-slate-400">ID: {selectedLead._id.slice(-8)}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600 text-2xl hover:bg-slate-100 rounded-xl p-2 transition">✕</button>
            </div>

            <textarea
              value={selectedLead.notes || ""}
              onChange={(e) => setSelectedLead({ ...selectedLead, notes: e.target.value })}
              className="w-full border-2 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Add Notes..."
            />

            <div className="mt-4">
              <label className="font-semibold text-slate-700">Follow Up Date</label>
              <input
                type="date"
                value={selectedLead.followUpDate || ""}
                onChange={(e) => setSelectedLead({ ...selectedLead, followUpDate: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-400">📱 Mobile</p><p className="font-medium">{selectedLead.mobile}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-400">📍 Location</p><p className="font-medium">{selectedLead.city}, {selectedLead.state}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-400">🏦 Loan</p><p className="font-medium">{selectedLead.loanType}</p></div>
              <div className="bg-slate-50 p-3 rounded-xl"><p className="text-xs text-slate-400">💰 Income</p><p className="font-medium">₹{selectedLead.monthlyIncome}</p></div>
            </div>

            {/* Notes History */}
            <div className="mt-5">
              <h3 className="font-bold text-lg mb-3">📝 Notes History</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedLead.notesHistory && selectedLead.notesHistory.length > 0 ? (
                  selectedLead.notesHistory.slice().reverse().map((item) => (
                    <div key={item._id} className="bg-slate-50 border rounded-xl p-3 flex justify-between items-center">
                      <div><p className="font-medium">{item.note}</p><small className="text-slate-400 text-xs">{new Date(item.createdAt).toLocaleString()}</small></div>
                      <button className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm transition">🗑 Delete</button>
                    </div>
                  ))
                ) : <p className="text-sm text-slate-400">No notes</p>}
              </div>
            </div>

            {/* Follow Up History */}
            <div className="mt-5">
              <h3 className="font-bold text-lg mb-3">📅 Follow Up History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedLead.followUpHistory && selectedLead.followUpHistory.length > 0 ? (
                  selectedLead.followUpHistory.slice().reverse().map((item) => (
                    <div key={item._id} className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                      <div><p className="font-semibold text-green-700">📅 {item.date}</p><small className="text-slate-400 text-xs">{new Date(item.createdAt).toLocaleString()}</small></div>
                      <button className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm transition">🗑 Delete</button>
                    </div>
                  ))
                ) : <p className="text-sm text-slate-400">No follow-ups</p>}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={saveNotes} className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-lg transition font-medium">💾 Save Notes</button>
              <button onClick={() => setSelectedLead(null)} className="flex-1 bg-slate-200 text-slate-700 px-5 py-3 rounded-xl hover:bg-slate-300 transition font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}