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

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // ✅ Refresh Function
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
    <div className="p-4 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen relative">
      {/* ===== HEADER WITH REFRESH BUTTON ===== */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
            {COMPANY_INITIAL}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {COMPANY_NAME}
            </h1>
            <p className="text-sm text-slate-400">Lead Management Dashboard</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className={`px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-white font-medium ${
              isRefreshing
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
            }`}
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admin");
              router.push("/login");
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ===== EXPORT BUTTON ===== */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <button
          onClick={exportToExcel}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2"
        >
          📥 Export Excel
        </button>
        <span className="text-sm text-slate-400 bg-white/70 px-4 py-2 rounded-xl">
          Total: <span className="font-semibold text-slate-700">{leads.length}</span> leads
        </span>
      </div>

      {/* ===== STATS CARDS WITH STATUS COLORS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            Today&apos;s Follow Ups
          </p>
          <h2 className="text-3xl font-bold mt-2">{todayFollowUps.length}</h2>
        </div>

        <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            Total Leads
          </p>
          <h2 className="text-3xl font-bold mt-2">{leads.length}</h2>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            New
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {leads.filter((l) => l.status === "New").length}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            Contacted
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {leads.filter((l) => l.status === "Contacted").length}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            Approved
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {leads.filter((l) => l.status === "Approved").length}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-rose-400 to-rose-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <p className="text-xs opacity-90 font-medium uppercase tracking-wider">
            Rejected
          </p>
          <h2 className="text-3xl font-bold mt-2">
            {leads.filter((l) => l.status === "Rejected").length}
          </h2>
        </div>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ✅ BAR CHART - Monthly Leads */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            📊 Monthly Leads
          </h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
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

        {/* ✅ PIE CHART - Status Distribution */}
        {pieData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              📈 Status Distribution
            </h3>
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
            {/* ✅ Status Color Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-slate-600">New</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-sm text-slate-600">Contacted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500"></div>
                <span className="text-sm text-slate-600">Rejected</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== SEARCH ===== */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Name or Mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* ===== FILTER BUTTONS ===== */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter("All")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
            statusFilter === "All"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("New")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
            statusFilter === "New"
              ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
          }`}
        >
          🟡 New
        </button>
        <button
          onClick={() => setStatusFilter("Contacted")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
            statusFilter === "Contacted"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
          }`}
        >
          🟠 Contacted
        </button>
        <button
          onClick={() => setStatusFilter("Approved")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
            statusFilter === "Approved"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
          }`}
        >
          🟢 Approved
        </button>
        <button
          onClick={() => setStatusFilter("Rejected")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
            statusFilter === "Rejected"
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white hover:shadow-md"
          }`}
        >
          🔴 Rejected
        </button>
      </div>

      {/* ===== STATUS DROPDOWN ===== */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border-2 border-slate-200 p-3 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
        >
          <option value="All">All Status</option>
          <option value="New">🟡 New</option>
          <option value="Contacted">🟠 Contacted</option>
          <option value="Approved">🟢 Approved</option>
          <option value="Rejected">🔴 Rejected</option>
        </select>
      </div>

      {/* ===== OVERDUE FOLLOW UPS ===== */}
      {overdueLeads.length > 0 && (
        <div className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-4 mb-6 shadow-lg">
          <h2 className="text-red-600 text-2xl font-bold mb-4 flex items-center gap-2">
            🚨 Overdue Follow Ups ({overdueLeads.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overdueLeads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h3 className="font-bold text-lg">{lead.fullName}</h3>
                  <p className="text-sm text-slate-500">📱 {lead.mobile}</p>
                  <p className="text-xs text-red-600 font-bold">📅 {lead.followUpDate}</p>
                </div>
                <a
                  href={`https://wa.me/91${lead.mobile}`}
                  target="_blank"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm"
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
        <div className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6 shadow-lg">
          <h2 className="text-amber-600 text-2xl font-bold mb-4 flex items-center gap-2">
            📞 Today&apos;s Follow Ups ({todayFollowUps.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayFollowUps.map((lead) => (
              <div
                key={lead._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h3 className="font-bold text-lg">{lead.fullName}</h3>
                  <p className="text-sm text-slate-500">📱 {lead.mobile}</p>
                  <p className="text-xs text-amber-600 font-bold">📅 {lead.followUpDate}</p>
                </div>
                <a
                  href={`https://wa.me/91${lead.mobile}`}
                  target="_blank"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-900">
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider hidden sm:table-cell">
                Mobile
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider hidden md:table-cell">
                City
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider hidden lg:table-cell">
                Loan Type
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider hidden xl:table-cell">
                Income
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider hidden lg:table-cell">
                Follow Up
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads
              .filter((lead) => {
                const searchText = search.toLowerCase();
                const matchesSearch =
                  lead.fullName?.toLowerCase().includes(searchText) ||
                  lead.mobile?.toString().includes(searchText);
                const matchesStatus =
                  statusFilter === "All" || lead.status === statusFilter;
                return matchesSearch && matchesStatus;
              })
              .map((lead) => {
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

                // ✅ Status Color Classes
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
                      isOverdue
                        ? "bg-rose-50/50"
                        : isToday
                        ? "bg-amber-50/50"
                        : ""
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-slate-800">
                          {lead.fullName}
                        </p>
                        {isOverdue && (
                          <span className="inline-block mt-1 text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                            OVERDUE
                          </span>
                        )}
                        {isToday && (
                          <span className="inline-block mt-1 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                            TODAY
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-sm text-slate-600">
                      {lead.mobile}
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-slate-600">
                      {lead.city}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                        {lead.loanType}
                      </span>
                    </td>
                    <td className="p-4 hidden xl:table-cell text-sm font-medium text-slate-700">
                      ₹ {lead.monthlyIncome}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm">
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
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead._id, e.target.value)
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border-0 cursor-pointer transition-colors ${statusColorClass}`}
                      >
                        <option value="New">🟡 New</option>
                        <option value="Contacted">🟠 Contacted</option>
                        <option value="Approved">🟢 Approved</option>
                        <option value="Rejected">🔴 Rejected</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <a
                          href={`https://wa.me/91${lead.mobile}?text=Hello ${lead.fullName}, regarding your ${lead.loanType} application.`}
                          target="_blank"
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                          title="WhatsApp"
                        >
                          💬
                        </a>
                        <button
                          onClick={() => deleteLead(lead._id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-slate-400 font-medium">No leads found</p>
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400">
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
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
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
                <h2 className="text-2xl font-bold text-slate-800">
                  📋 {selectedLead.fullName}
                </h2>
                <p className="text-sm text-slate-400">
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
              className="w-full border-2 border-slate-200 p-3 rounded-xl mt-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              rows={4}
              placeholder="Add Notes..."
            />

            <div className="mt-4">
              <label className="font-semibold text-slate-700">
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
                className="w-full border-2 border-slate-200 p-3 rounded-xl mt-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">📱 Mobile</p>
                <p className="font-semibold">{selectedLead.mobile}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">📍 Location</p>
                <p className="font-semibold">
                  {selectedLead.city}, {selectedLead.state}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">🏦 Loan</p>
                <p className="font-semibold">{selectedLead.loanType}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">💰 Income</p>
                <p className="font-semibold">₹ {selectedLead.monthlyIncome}</p>
              </div>
            </div>

            {/* Notes History */}
            <div className="mt-5">
              <h3 className="font-bold text-lg mb-3">📝 Notes History</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedLead.notesHistory &&
                selectedLead.notesHistory.length > 0 ? (
                  selectedLead.notesHistory
                    .slice()
                    .reverse()
                    .map((item: any) => (
                      <div
                        key={item._id}
                        className="bg-slate-50 border rounded-xl p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{item.note}</p>
                          <small className="text-gray-500 text-xs">
                            {new Date(item.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <button
                          onClick={() => deleteNote(item._id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500">No Notes Available</p>
                )}
              </div>
            </div>

            {/* Follow Up History */}
            <div className="mt-5">
              <h3 className="font-bold text-lg mb-3">📅 Follow Up History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedLead.followUpHistory &&
                selectedLead.followUpHistory.length > 0 ? (
                  selectedLead.followUpHistory
                    .slice()
                    .reverse()
                    .map((item: any, index: number) => (
                      <div
                        key={item._id || index}
                        className="bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-green-700">
                            {item.date}
                          </p>
                          <small className="text-gray-500 text-xs">
                            {new Date(item.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <button
                          onClick={() => deleteNote(item._id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500">No Follow Ups Available</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={saveNotes}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 font-medium"
              >
                💾 Save Notes
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 bg-slate-200 text-slate-700 px-5 py-3 rounded-xl hover:bg-slate-300 transition font-medium"
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