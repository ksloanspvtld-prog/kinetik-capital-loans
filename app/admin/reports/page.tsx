"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Lead = {
  _id: string;
  fullName: string;
  mobile: string;
  loanType: string;
  monthlyIncome: string;
  status: "New" | "Contacted" | "Processing" | "Approved" | "Rejected";
  createdAt: string;
  assignedAgent?: string;
  followUpDate?: string;
};

type Agent = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
};

export default function ReportsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const leadsRes = await fetch("/api/admin/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const leadsData = await leadsRes.json();
        if (leadsData.success) setLeads(leadsData.leads || []);

        const agentsRes = await fetch("/api/admin/users?role=agent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const agentsData = await agentsRes.json();
        if (agentsData.success) setAgents(agentsData.users || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // ============================================================
  // 📊 CALCULATIONS
  // ============================================================

  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((l) => l.status === "New").length;
    const contacted = leads.filter((l) => l.status === "Contacted").length;
    const processing = leads.filter((l) => l.status === "Processing").length;
    const approved = leads.filter((l) => l.status === "Approved").length;
    const rejected = leads.filter((l) => l.status === "Rejected").length;
    const conversionRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return { total, newLeads, contacted, processing, approved, rejected, conversionRate };
  }, [leads]);

  // ============================================================
  // 📈 AGENT PERFORMANCE
  // ============================================================

  const agentPerformance = useMemo(() => {
    return agents.map((agent) => {
      const agentLeads = leads.filter((l) => l.assignedAgent === agent._id);
      const total = agentLeads.length;
      const approved = agentLeads.filter((l) => l.status === "Approved").length;
      const rejected = agentLeads.filter((l) => l.status === "Rejected").length;
      const pending = agentLeads.filter((l) => l.status === "New" || l.status === "Contacted" || l.status === "Processing").length;
      const rate = total > 0 ? Math.round((approved / total) * 100) : 0;

      return { ...agent, total, approved, rejected, pending, rate };
    }).sort((a, b) => b.rate - a.rate);
  }, [leads, agents]);

  // ============================================================
  // 📅 MONTHLY TRENDS
  // ============================================================

  const monthlyTrends = useMemo(() => {
    const months: Record<string, { month: string; leads: number; approved: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    leads.forEach((lead) => {
      if (lead.createdAt) {
        const date = new Date(lead.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthName = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

        if (!months[key]) {
          months[key] = { month: monthName, leads: 0, approved: 0 };
        }
        months[key].leads += 1;
        if (lead.status === "Approved") {
          months[key].approved += 1;
        }
      }
    });

    const keys = Object.keys(months).sort();
    const last6 = keys.slice(-6);
    return last6.map((key) => months[key]);
  }, [leads]);

  // ============================================================
  // 🔔 FOLLOW-UP REMINDERS
  // ============================================================

  const todayFollowUps = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return leads
      .filter((l) => l.followUpDate && l.followUpDate.split("T")[0] === today)
      .map((l) => ({
        _id: l._id,
        fullName: l.fullName,
        mobile: l.mobile,
        followUpDate: l.followUpDate || "",
        loanType: l.loanType,
      }));
  }, [leads]);

  const overdueFollowUps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return leads
      .filter((l) => l.followUpDate && new Date(l.followUpDate).getTime() < today.getTime())
      .map((l) => ({
        _id: l._id,
        fullName: l.fullName,
        mobile: l.mobile,
        followUpDate: l.followUpDate || "",
        loanType: l.loanType,
      }));
  }, [leads]);

  // ============================================================
  // 📥 EXPORT EXCEL
  // ============================================================

  const exportReport = () => {
    const data = leads.map((l) => ({
      "Full Name": l.fullName,
      Mobile: l.mobile,
      "Loan Type": l.loanType,
      "Monthly Income": l.monthlyIncome,
      Status: l.status,
      "Created Date": new Date(l.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(file, `Leads_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // ============================================================
  // COLOR CONSTANTS
  // ============================================================

  const STATUS_COLORS = {
    New: "#f59e0b",
    Contacted: "#f97316",
    Processing: "#3b82f6",
    Approved: "#22c55e",
    Rejected: "#ef4444",
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">📊 Reports & Analytics</h1>
              <p className="text-slate-500 mt-1">Track your business performance and insights</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportReport}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 text-sm"
              >
                📥 Export Excel
              </button>
              <Link
                href="/admin"
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl transition text-sm font-medium"
              >
                ← Back
              </Link>
            </div>
          </div>

          {/* 📊 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border-l-4 border-indigo-500">
              <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
              <p className="text-xs text-slate-500 font-medium">Total Leads</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border-l-4 border-yellow-500">
              <p className="text-2xl font-bold text-yellow-600">{stats.newLeads}</p>
              <p className="text-xs text-slate-500 font-medium">New</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border-l-4 border-orange-500">
              <p className="text-2xl font-bold text-orange-600">{stats.contacted}</p>
              <p className="text-xs text-slate-500 font-medium">Contacted</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border-l-4 border-blue-500">
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              <p className="text-xs text-slate-500 font-medium">Processing</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border-l-4 border-emerald-500">
              <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
              <p className="text-xs text-slate-500 font-medium">Approved</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border-l-4 border-rose-500">
              <p className="text-2xl font-bold text-rose-600">{stats.rejected}</p>
              <p className="text-xs text-slate-500 font-medium">Rejected</p>
            </div>
          </div>

          {/* Conversion Rate Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <p className="text-white/80 text-sm font-medium">Conversion Rate</p>
                <p className="text-4xl font-bold">{stats.conversionRate}%</p>
                <p className="text-white/60 text-sm mt-1">
                  {stats.approved} approved out of {stats.total} total leads
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-white/60">New → Contacted</p>
                  <p className="font-bold">
                    {stats.total > 0 ? Math.round((stats.contacted / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Contacted → Processing</p>
                  <p className="font-bold">
                    {stats.contacted > 0 ? Math.round((stats.processing / stats.contacted) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-white/60">Processing → Approved</p>
                  <p className="font-bold">
                    {stats.processing > 0 ? Math.round((stats.approved / stats.processing) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 📈 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stackId="1" stroke="#6366f1" fill="#6366f1" />
                  <Area type="monotone" dataKey="approved" stackId="1" stroke="#22c55e" fill="#22c55e" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2 text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-500 rounded"></span> Leads</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Approved</span>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "New", value: stats.newLeads },
                      { name: "Contacted", value: stats.contacted },
                      { name: "Processing", value: stats.processing },
                      { name: "Approved", value: stats.approved },
                      { name: "Rejected", value: stats.rejected },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {Object.values(STATUS_COLORS).map((color, i) => (
                      <Cell key={`cell-${i}`} fill={Object.values(STATUS_COLORS)[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 👤 Agent Performance Table */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">👤 Agent Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Agent</th>
                    <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Total</th>
                    <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Approved</th>
                    <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Rejected</th>
                    <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Pending</th>
                    <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agentPerformance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">No agents data</td>
                    </tr>
                  ) : (
                    agentPerformance.map((agent) => (
                      <tr key={agent._id} className="hover:bg-slate-50 transition">
                        <td className="p-3 text-sm font-medium text-slate-800">{agent.fullName}</td>
                        <td className="p-3 text-sm text-slate-600">{agent.total}</td>
                        <td className="p-3 text-sm text-emerald-600 font-medium">{agent.approved}</td>
                        <td className="p-3 text-sm text-rose-600">{agent.rejected}</td>
                        <td className="p-3 text-sm text-slate-600">{agent.pending}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            agent.rate >= 70 ? "bg-emerald-100 text-emerald-700" :
                            agent.rate >= 40 ? "bg-yellow-100 text-yellow-700" :
                            "bg-rose-100 text-rose-700"
                          }`}>
                            {agent.rate}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🔔 Follow-up Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Follow-ups */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                📞 Today's Follow-ups <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">{todayFollowUps.length}</span>
              </h3>
              {todayFollowUps.length === 0 ? (
                <p className="text-slate-400 text-sm">No follow-ups today ✅</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {todayFollowUps.map((lead) => (
                    <li key={lead._id} className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{lead.fullName}</p>
                        <p className="text-xs text-slate-500">{lead.loanType} | 📱 {lead.mobile}</p>
                      </div>
                      <a
                        href={`https://wa.me/91${lead.mobile}`}
                        target="_blank"
                        className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                      >
                        WhatsApp
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Overdue Follow-ups */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                🚨 Overdue Follow-ups <span className="bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded-full">{overdueFollowUps.length}</span>
              </h3>
              {overdueFollowUps.length === 0 ? (
                <p className="text-slate-400 text-sm">No overdue follow-ups ✅</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {overdueFollowUps.map((lead) => (
                    <li key={lead._id} className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{lead.fullName}</p>
                        <p className="text-xs text-rose-600">📅 {new Date(lead.followUpDate).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{lead.loanType}</p>
                      </div>
                      <a
                        href={`https://wa.me/91${lead.mobile}`}
                        target="_blank"
                        className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                      >
                        WhatsApp
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-dashed border-indigo-300">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">💳 Payment Integration</h3>
              <p className="text-sm text-slate-500">Coming Soon</p>
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-dashed border-indigo-300">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">📝 Blog / Articles</h3>
              <p className="text-sm text-slate-500">Coming Soon</p>
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-dashed border-indigo-300">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">🌐 Multi-language</h3>
              <p className="text-sm text-slate-500">Coming Soon</p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}