"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ✅ Company Name - येथे बदला
const COMPANY_NAME = "Kinetik Capital";
const COMPANY_INITIAL = "K";

// Pie Chart Colors
const COLORS = ["#f59e0b", "#f97316", "#22c55e", "#ef4444"];

// ✅ Notification Types
interface Notification {
  id: string;
  type: "new_lead" | "follow_up" | "overdue" | "status_change";
  message: string;
  time: string;
  read: boolean;
  leadId?: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // ✅ Bulk Actions States
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // ✅ Date Range Filter States
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // ✅ Notifications States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Monthly Data for Bar Chart
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

  // ✅ Pie Chart Data with Colors
  const pieData = [
    { name: "New", value: leads.filter((l) => l.status === "New").length, color: "#f59e0b" },
    { name: "Contacted", value: leads.filter((l) => l.status === "Contacted").length, color: "#f97316" },
    { name: "Approved", value: leads.filter((l) => l.status === "Approved").length, color: "#22c55e" },
    { name: "Rejected", value: leads.filter((l) => l.status === "Rejected").length, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // ✅ Filtered Leads with Date Range
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

  // ✅ Generate Notifications
  const generateNotifications = useMemo(() => {
    const newNotifs: Notification[] = [];
    const today = new Date().toISOString().split("T")[0];
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Today's Follow-ups
    const todayFollows = leads.filter(
      (l) => l.followUpDate && l.followUpDate.split("T")[0] === today
    );
    if (todayFollows.length > 0) {
      newNotifs.push({
        id: "followup_" + Date.now(),
        type: "follow_up",
        message: `📅 ${todayFollows.length} follow-up${todayFollows.length > 1 ? 's' : ''} due today`,
        time: "Today",
        read: false,
      });
    }

    // Overdue Leads
    const overdue = leads.filter(
      (l) => l.followUpDate && new Date(l.followUpDate).getTime() < todayStart.getTime()
    );
    if (overdue.length > 0) {
      newNotifs.push({
        id: "overdue_" + Date.now(),
        type: "overdue",
        message: `🚨 ${overdue.length} lead${overdue.length > 1 ? 's' : ''} overdue for follow-up`,
        time: "Today",
        read: false,
      });
    }

    // New Leads (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const newLeads = leads.filter(
      (l) => l.createdAt && new Date(l.createdAt) > yesterday
    );
    if (newLeads.length > 0) {
      newNotifs.push({
        id: "new_" + Date.now(),
        type: "new_lead",
        message: `🆕 ${newLeads.length} new lead${newLeads.length > 1 ? 's' : ''} added in last 24 hours`,
        time: "Today",
        read: false,
      });
    }

    // Status Changes - Approved leads
    const approved = leads.filter((l) => l.status === "Approved");
    if (approved.length > 0) {
      const recentApproved = approved.filter(
        (l) => l.updatedAt && new Date(l.updatedAt) > yesterday
      );
      if (recentApproved.length > 0) {
        newNotifs.push({
          id: "status_" + Date.now(),
          type: "status_change",
          message: `✅ ${recentApproved.length} lead${recentApproved.length > 1 ? 's' : ''} approved recently`,
          time: "Today",
          read: false,
        });
      }
    }

    // Rejected leads
    const rejected = leads.filter((l) => l.status === "Rejected");
    if (rejected.length > 0) {
      const recentRejected = rejected.filter(
        (l) => l.updatedAt && new Date(l.updatedAt) > yesterday
      );
      if (recentRejected.length > 0) {
        newNotifs.push({
          id: "status_rejected_" + Date.now(),
          type: "status_change",
          message: `❌ ${recentRejected.length} lead${recentRejected.length > 1 ? 's' : ''} rejected recently`,
          time: "Today",
          read: false,
        });
      }
    }

    return newNotifs;
  }, [leads]);

  // ✅ Update Notifications
  useEffect(() => {
    const existingIds = new Set(notifications.map(n => n.id));
    const newNotifs = generateNotifications.filter(n => !existingIds.has(n.id));
    if (newNotifs.length > 0) {
      setNotifications(prev => [...newNotifs, ...prev]);
    }
  }, [generateNotifications]);

  // ✅ Update Unread Count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // ✅ Mark All as Read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // ✅ Mark Single as Read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // ✅ Clear Date Filters
  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
  };

  // ✅ Select All Toggle
  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter((s) => s !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  // ✅ Bulk Actions
  const bulkApprove = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Approve ${selectedLeads.length} leads?`)) return;
    try {
      for (const id of selectedLeads) {
        await fetch(`/api/leads/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved" }),
        });
      }
      fetchLeads();
      setSelectedLeads([]);
      alert(`✅ ${selectedLeads.length} leads approved!`);
    } catch (error) {
      console.log(error);
    }
  };

  const bulkReject = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Reject ${selectedLeads.length} leads?`)) return;
    try {
      for (const id of selectedLeads) {
        await fetch(`/api/leads/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected" }),
        });
      }
      fetchLeads();
      setSelectedLeads([]);
      alert(`✅ ${selectedLeads.length} leads rejected!`);
    } catch (error) {
      console.log(error);
    }
  };

  const bulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Delete ${selectedLeads.length} leads?`)) return;
    try {
      for (const id of selectedLeads) {
        await fetch(`/api/leads/${id}`, { method: "DELETE" });
      }
      fetchLeads();
      setSelectedLeads([]);
      alert(`✅ ${selectedLeads.length} leads deleted!`);
    } catch (error) {
      console.log(error);
    }
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

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch("/api/leads/note", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: selectedLead._id,
          noteId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const refresh = await fetch("/api/leads/all");
      const result = await refresh.json();

      setLeads(result.leads);

      const updatedLead = result.leads.find(
        (l: any) => l._id === selectedLead._id
      );

      setSelectedLead(updatedLead);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodayFollowUps = () => {
    const today = new Date().toISOString().split("T")[0];
    return leads.filter(
      (lead) =>
        lead.followUpDate &&
        lead.followUpDate.split("T")[0] === today
    );
  };

  const todayFollowUps = getTodayFollowUps();
  const todayStart = new Date();

  todayStart.setHours(0, 0, 0, 0);
  const overdueLeads = leads.filter(
    (lead) =>
      lead.followUpDate &&
      new Date(lead.followUpDate).getTime() < todayStart.getTime()
  );

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads/all");
      const data = await res.json();
      setLeads(data.leads);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchLeads();
    setTimeout(() => {
      setIsRefreshing(false);
      const toast = document.createElement("div");
      toast.className =
        "fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-in text-sm font-medium";
      toast.textContent = "✅ Data Refreshed Successfully!";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }, 500);
  };

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    console.log("STATUS SENT:", status);

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      console.log("BODY:", data);
      console.log(data);

      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;

    try {
      await fetch(`/api/leads/${selectedLead._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: selectedLead.notes,
          followUpDate: selectedLead.followUpDate,
        }),
      });

      await fetchLeads();

      const res = await fetch("/api/leads/all");
      const data = await res.json();

      const updatedLead = data.leads.find(
        (l: any) => l._id === selectedLead._id
      );

      setSelectedLead(updatedLead);

      alert("Saved Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFollowUp = async (historyId: string) => {
    console.log("DELETE CLICKED");
    console.log("Lead ID:", selectedLead._id);
    console.log("History ID:", historyId);

    try {
      await fetch("/api/leads/followup", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: selectedLead._id,
          historyId,
        }),
      });

      console.log("DELETE API CALLED");

      await fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLead = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${COMPANY_NAME}_Leads`
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, `${COMPANY_NAME}_Leads.xlsx`);
  };

  return (
    <div className="p-3 sm:p-4 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen relative">
      
      {/* ===== HEADER WITH NOTIFICATIONS ===== */}
      <div className="flex flex-wrap justify-between items-center mb-6 md:mb-8 gap-3 md:gap-4 bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white/50">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-2xl text-slate-600 hover:text-indigo-600 transition"
          >
            ☰
          </button>
          <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg shadow-indigo-500/30">
            {COMPANY_INITIAL}
          </div>
          <div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {COMPANY_NAME}
            </h1>
            <p className="text-xs md:text-sm text-slate-400">Lead Management Dashboard</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* ✅ NOTIFICATION BELL */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 md:p-2.5 bg-white/50 hover:bg-white rounded-xl transition-all duration-300 text-slate-600 hover:text-indigo-600"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* ✅ NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-[400px] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">🔔 Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      <p className="text-3xl mb-2">🔕</p>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer ${
                          !notif.read ? "bg-indigo-50/50" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <p className="text-sm text-slate-700">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-3 md:px-5 py-2 md:py-3 rounded-xl transition-all duration-300 flex items-center gap-1 md:gap-2 text-white font-medium text-sm md:text-base ${
              isRefreshing
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
            }`}
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="hidden sm:inline">Refreshing...</span>
              </>
            ) : (
              <>🔄 <span className="hidden sm:inline">Refresh</span></>
            )}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admin");
              router.push("/login");
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 text-sm md:text-base"
          >
            🚪 <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="bg-white w-64 h-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-2xl text-slate-400"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  refreshData();
                }}
                className="w-full text-left py-2 px-4 bg-blue-50 text-blue-600 rounded-xl"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  exportToExcel();
                }}
                className="w-full text-left py-2 px-4 bg-emerald-50 text-emerald-600 rounded-xl"
              >
                📥 Export
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  localStorage.removeItem("admin");
                  router.push("/login");
                }}
                className="w-full text-left py-2 px-4 bg-red-50 text-red-600 rounded-xl"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EXPORT BUTTON ===== */}
      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6 gap-3">
        <button
          onClick={exportToExcel}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          📥 <span className="hidden sm:inline">Export Excel</span>
        </button>
        <span className="text-xs md:text-sm text-slate-400 bg-white/70 px-3 md:px-4 py-1 md:py-2 rounded-xl">
          Total: <span className="font-semibold text-slate-700">{leads.length}</span> leads
        </span>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] md:text-xs opacity-90 font-medium uppercase tracking-wider">
            Today&apos;s Follow Ups
          </p>
          <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{todayFollowUps.length}</h2>
        </div>

        <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] md:text-xs opacity-90 font-medium uppercase tracking-wider">
            Total Leads
          </p>
          <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">{leads.length}</h2>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] md:text-xs opacity-90 font-medium uppercase tracking-wider">
            New
          </p>
          <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">
            {leads.filter((l) => l.status === "New").length}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] md:text-xs opacity-90 font-medium uppercase tracking-wider">
            Contacted
          </p>
          <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">
            {leads.filter((l) => l.status === "Contacted").length}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] md:text-xs opacity-90 font-medium uppercase tracking-wider">
            Approved
          </p>
          <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">
            {leads.filter((l) => l.status === "Approved").length}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-rose-400 to-rose-500 text-white p-3 md:p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-[10px] md:text-xs opacity-90 font-medium uppercase tracking-wider">
            Rejected
          </p>
          <h2 className="text-xl md:text-3xl font-bold mt-1 md:mt-2">
            {leads.filter((l) => l.status === "Rejected").length}
          </h2>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-4">
            📊 Monthly Leads
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-400 py-10">No data available</p>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-4">
            📈 Status Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-400 py-10">No data available</p>
          )}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-3 md:mt-4">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500"></div>
              <span className="text-xs md:text-sm text-slate-600">New</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-500"></div>
              <span className="text-xs md:text-sm text-slate-600">Contacted</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-500"></div>
              <span className="text-xs md:text-sm text-slate-600">Approved</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-rose-500"></div>
              <span className="text-xs md:text-sm text-slate-600">Rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="mb-4 md:mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Name or Mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-slate-200 p-2.5 md:p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm md:text-base"
        />
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-lg border border-white/50">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 text-xs md:text-sm font-medium ${
              statusFilter === "All"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("New")}
            className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 text-xs md:text-sm font-medium ${
              statusFilter === "New"
                ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
                : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
            }`}
          >
            🟡 New
          </button>
          <button
            onClick={() => setStatusFilter("Contacted")}
            className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 text-xs md:text-sm font-medium ${
              statusFilter === "Contacted"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
            }`}
          >
            🟠 Contacted
          </button>
          <button
            onClick={() => setStatusFilter("Approved")}
            className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 text-xs md:text-sm font-medium ${
              statusFilter === "Approved"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
            }`}
          >
            🟢 Approved
          </button>
          <button
            onClick={() => setStatusFilter("Rejected")}
            className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 text-xs md:text-sm font-medium ${
              statusFilter === "Rejected"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
            }`}
          >
            🔴 Rejected
          </button>
        </div>

        <span className="text-slate-300 hidden sm:inline">|</span>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs md:text-sm text-slate-500 font-medium">📅 From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 md:px-3 py-1.5 md:py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 bg-white/80 text-xs md:text-sm w-28 md:w-32"
          />
          <label className="text-xs md:text-sm text-slate-500 font-medium">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 md:px-3 py-1.5 md:py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 bg-white/80 text-xs md:text-sm w-28 md:w-32"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={clearDateFilter}
              className="px-2 md:px-3 py-1.5 md:py-2 bg-rose-500 text-white rounded-xl text-xs md:text-sm hover:bg-rose-600 transition"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ===== OVERDUE ===== */}
      {overdueLeads.length > 0 && (
        <div className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 shadow-lg">
          <h2 className="text-lg md:text-2xl text-red-600 font-bold mb-3 md:mb-4 flex items-center gap-2">
            🚨 Overdue Follow Ups ({overdueLeads.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {overdueLeads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow flex flex-wrap justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h3 className="font-bold text-sm md:text-lg">{lead.fullName}</h3>
                  <p className="text-xs md:text-sm text-slate-500">📱 {lead.mobile}</p>
                  <p className="text-xs text-red-600 font-bold">📅 {lead.followUpDate}</p>
                </div>
                <a
                  href={`https://wa.me/91${lead.mobile}`}
                  target="_blank"
                  className="bg-emerald-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-emerald-600 transition text-xs md:text-sm"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TODAY'S FOLLOW UPS ===== */}
      {todayFollowUps.length > 0 && (
        <div className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 shadow-lg">
          <h2 className="text-lg md:text-2xl text-amber-600 font-bold mb-3 md:mb-4 flex items-center gap-2">
            📞 Today&apos;s Follow Ups ({todayFollowUps.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {todayFollowUps.map((lead) => (
              <div
                key={lead._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow flex flex-wrap justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h3 className="font-bold text-sm md:text-lg">{lead.fullName}</h3>
                  <p className="text-xs md:text-sm text-slate-500">📱 {lead.mobile}</p>
                  <p className="text-xs text-amber-600 font-bold">📅 {lead.followUpDate}</p>
                </div>
                <a
                  href={`https://wa.me/91${lead.mobile}`}
                  target="_blank"
                  className="bg-emerald-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-emerald-600 transition text-xs md:text-sm"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-900">
              <th className="p-2 md:p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 checked:bg-indigo-500"
                />
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">
                Name
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider hidden sm:table-cell">
                Mobile
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider hidden md:table-cell">
                City
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider hidden lg:table-cell">
                Loan Type
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider hidden xl:table-cell">
                Income
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider hidden lg:table-cell">
                Follow Up
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">
                Status
              </th>
              <th className="p-2 md:p-4 text-left text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 md:py-16 text-slate-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">No leads found</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const followUpDate = lead.followUpDate
                  ? new Date(lead.followUpDate)
                  : null;
                const isOverdue = followUpDate
                  ? followUpDate.getTime() < todayStart.getTime()
                  : false;
                const isToday = followUpDate
                  ? followUpDate >= todayStart &&
                    followUpDate < new Date(todayStart.getTime() + 86400000)
                  : false;

                const statusColorClass =
                  lead.status === "New"
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : lead.status === "Contacted"
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    : lead.status === "Approved"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-rose-100 text-rose-700 hover:bg-rose-200";

                return (
                  <tr
                    key={lead._id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isOverdue ? "bg-rose-50/50" : isToday ? "bg-amber-50/50" : ""
                    } ${selectedLeads.includes(lead._id) ? "bg-indigo-50/50" : ""}`}
                  >
                    <td className="p-2 md:p-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => toggleSelect(lead._id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-2 md:p-4">
                      <div>
                        <p className="font-medium text-sm md:text-base text-slate-800">
                          {lead.fullName}
                        </p>
                        {isOverdue && (
                          <span className="inline-block mt-0.5 md:mt-1 text-[8px] md:text-[10px] bg-rose-600 text-white px-1.5 md:px-2 py-0.5 rounded-full font-bold">
                            OVERDUE
                          </span>
                        )}
                        {isToday && (
                          <span className="inline-block mt-0.5 md:mt-1 text-[8px] md:text-[10px] bg-amber-500 text-white px-1.5 md:px-2 py-0.5 rounded-full font-bold">
                            TODAY
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 md:p-4 hidden sm:table-cell text-xs md:text-sm text-slate-600">
                      {lead.mobile}
                    </td>
                    <td className="p-2 md:p-4 hidden md:table-cell text-xs md:text-sm text-slate-600">
                      {lead.city}
                    </td>
                    <td className="p-2 md:p-4 hidden lg:table-cell">
                      <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-slate-100 rounded-full text-[10px] md:text-xs font-medium text-slate-600">
                        {lead.loanType}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 hidden xl:table-cell text-xs md:text-sm font-medium text-slate-700">
                      ₹ {lead.monthlyIncome}
                    </td>
                    <td className="p-2 md:p-4 hidden lg:table-cell text-xs md:text-sm">
                      <span
                        className={
                          isOverdue
                            ? "text-rose-600 font-bold"
                            : isToday
                            ? "text-amber-600 font-bold"
                            : "text-slate-500"
                        }
                      >
                        {lead.followUpDate || "-"}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded-xl text-[10px] md:text-xs font-medium border-0 cursor-pointer transition-colors ${statusColorClass}`}
                      >
                        <option value="New">🟡 New</option>
                        <option value="Contacted">🟠 Contacted</option>
                        <option value="Approved">🟢 Approved</option>
                        <option value="Rejected">🔴 Rejected</option>
                      </select>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-1 md:gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 md:p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 text-sm md:text-base"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <a
                          href={`https://wa.me/91${lead.mobile}`}
                          target="_blank"
                          className="p-1.5 md:p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 text-sm md:text-base"
                          title="WhatsApp"
                        >
                          💬
                        </a>
                        <button
                          onClick={() => deleteLead(lead._id)}
                          className="p-1.5 md:p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 text-sm md:text-base"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ===== BULK ACTIONS BAR ===== */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-indigo-200 shadow-2xl p-3 md:p-4 z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4">
              <span className="text-sm md:text-base font-semibold text-indigo-600">
                ✅ {selectedLeads.length} selected
              </span>
              <button
                onClick={() => setSelectedLeads([])}
                className="text-xs md:text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 md:px-3 py-1 rounded-lg transition"
              >
                ✕ Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <button
                onClick={bulkApprove}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500 text-white rounded-lg text-xs md:text-sm hover:bg-emerald-600 transition font-medium"
              >
                ✅ Approve
              </button>
              <button
                onClick={bulkReject}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-rose-500 text-white rounded-lg text-xs md:text-sm hover:bg-rose-600 transition font-medium"
              >
                ❌ Reject
              </button>
              <button
                onClick={bulkExport}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-500 text-white rounded-lg text-xs md:text-sm hover:bg-indigo-600 transition font-medium"
              >
                📥 Export
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white rounded-lg text-xs md:text-sm hover:bg-red-600 transition font-medium"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="mt-6 md:mt-8 text-center pb-16 md:pb-0">
        <p className="text-xs md:text-sm text-slate-400">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </div>

      {/* ===== MODAL ===== */}
      {selectedLead && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px md:30px",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  📋 {selectedLead.fullName}
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
                  ID: {selectedLead._id.slice(-8)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl hover:bg-slate-100 rounded-xl p-2 transition"
              >
                ✕
              </button>
            </div>

            <textarea
              value={selectedLead.notes || ""}
              onChange={(e) =>
                setSelectedLead({
                  ...selectedLead,
                  notes: e.target.value,
                })
              }
              className="w-full border-2 border-slate-200 p-3 rounded-xl mt-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm md:text-base"
              rows={4}
              placeholder="Add Notes..."
            />

            <div className="mt-4">
              <label className="font-semibold text-slate-700 text-sm md:text-base">
                Follow Up Date
              </label>
              <input
                type="date"
                value={selectedLead.followUpDate || ""}
                onChange={(e) =>
                  setSelectedLead({
                    ...selectedLead,
                    followUpDate: e.target.value,
                  })
                }
                className="w-full border-2 border-slate-200 p-3 rounded-xl mt-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm md:text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] md:text-xs text-gray-500">📱 Mobile</p>
                <p className="font-semibold text-sm md:text-base">{selectedLead.mobile}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] md:text-xs text-gray-500">📍 Location</p>
                <p className="font-semibold text-sm md:text-base">
                  {selectedLead.city}, {selectedLead.state}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] md:text-xs text-gray-500">🏦 Loan</p>
                <p className="font-semibold text-sm md:text-base">{selectedLead.loanType}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] md:text-xs text-gray-500">💰 Income</p>
                <p className="font-semibold text-sm md:text-base">₹ {selectedLead.monthlyIncome}</p>
              </div>
            </div>

            {/* Notes History */}
            <div className="mt-5">
              <h3 className="font-bold text-base md:text-lg mb-3">📝 Notes History</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedLead.notesHistory &&
                selectedLead.notesHistory.length > 0 ? (
                  selectedLead.notesHistory
                    .slice()
                    .reverse()
                    .map((item: any) => (
                      <div
                        key={item._id}
                        className="bg-slate-50 border rounded-xl p-3 flex flex-wrap justify-between items-center gap-2"
                      >
                        <div>
                          <p className="font-medium text-sm md:text-base">{item.note}</p>
                          <small className="text-gray-500 text-xs">
                            {new Date(item.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <button
                          onClick={() => deleteNote(item._id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm md:text-base">No Notes Available</p>
                )}
              </div>
            </div>

            {/* Follow Up History */}
            <div className="mt-5">
              <h3 className="font-bold text-base md:text-lg mb-3">📅 Follow Up History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedLead.followUpHistory &&
                selectedLead.followUpHistory.length > 0 ? (
                  selectedLead.followUpHistory
                    .slice()
                    .reverse()
                    .map((item: any, index: number) => (
                      <div
                        key={item._id || index}
                        className="bg-green-50 border border-green-200 rounded-xl p-3 flex flex-wrap justify-between items-center gap-2"
                      >
                        <div>
                          <p className="font-semibold text-green-700 text-sm md:text-base">
                            📅 {item.date}
                          </p>
                          <small className="text-gray-500 text-xs">
                            {new Date(item.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <button
                          onClick={() => deleteNote(item._id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm md:text-base">No Follow Ups Available</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={saveNotes}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 font-medium text-sm md:text-base"
              >
                💾 Save Notes
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 bg-slate-200 text-slate-700 px-5 py-3 rounded-xl hover:bg-slate-300 transition font-medium text-sm md:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}