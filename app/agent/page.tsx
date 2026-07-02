"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Lead = {
  _id: string;
  fullName: string;
  mobile: string;
  loanType: string;
  monthlyIncome: string;
  status: "New" | "Contacted" | "Processing" | "Approved" | "Rejected";
  city?: string;
  state?: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  assignedAgent?: string;
};

export default function AgentDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        if (parsed.role !== "agent" && parsed.role !== "admin") {
          router.push("/dashboard");
          return;
        }
      } catch (e) {}
    }

    const fetchLeads = async () => {
      try {
        const res = await fetch(`/api/agent/leads?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setLeads(data.leads);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [filter, router]);

  const updateStatus = async (id: string, status: Lead["status"]) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/agent/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === id ? { ...lead, status } : lead
          )
        );
        alert(`✅ Lead ${status} successfully!`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update status");
    }
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "Approved": return "bg-emerald-100 text-emerald-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Rejected": return "bg-rose-100 text-rose-700";
      case "Contacted": return "bg-orange-100 text-orange-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

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

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const processingLeads = leads.filter((l) => l.status === "Processing").length;
  const approvedLeads = leads.filter((l) => l.status === "Approved").length;

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Welcome Section */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.fullName?.charAt(0) || "A"}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome, Agent <span className="text-emerald-600">{user?.fullName}</span> 👋
                </h1>
                <p className="text-slate-500 mt-1">
                  Manage your assigned leads and track their progress.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-indigo-500">
              <p className="text-3xl font-bold text-indigo-600">{totalLeads}</p>
              <p className="text-sm text-slate-500">Total Assigned</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-yellow-500">
              <p className="text-3xl font-bold text-yellow-600">{newLeads}</p>
              <p className="text-sm text-slate-500">New Leads</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-blue-500">
              <p className="text-3xl font-bold text-blue-600">{processingLeads}</p>
              <p className="text-sm text-slate-500">Processing</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-emerald-500">
              <p className="text-3xl font-bold text-emerald-600">{approvedLeads}</p>
              <p className="text-sm text-slate-500">Approved</p>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap gap-3">
            {["all", "New", "Contacted", "Processing", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === status
                    ? status === "all"
                      ? "bg-indigo-600 text-white"
                      : status === "New"
                      ? "bg-yellow-600 text-white"
                      : status === "Contacted"
                      ? "bg-orange-600 text-white"
                      : status === "Processing"
                      ? "bg-blue-600 text-white"
                      : status === "Approved"
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Mobile</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Loan Type</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Income</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">
                        No leads assigned to you yet.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm text-slate-800 font-medium">{lead.fullName}</td>
                        <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{lead.mobile}</td>
                        <td className="p-4 text-sm text-slate-600 hidden md:table-cell">{lead.loanType}</td>
                        <td className="p-4 text-sm text-slate-600 hidden lg:table-cell">₹{lead.monthlyIncome || "N/A"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status || "New"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {lead.status !== "Contacted" && (
                              <button
                                onClick={() => updateStatus(lead._id, "Contacted")}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Contact
                              </button>
                            )}
                            {lead.status !== "Processing" && lead.status !== "Approved" && (
                              <button
                                onClick={() => updateStatus(lead._id, "Processing")}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Process
                              </button>
                            )}
                            {lead.status !== "Approved" && lead.status !== "Rejected" && (
                              <>
                                <button
                                  onClick={() => updateStatus(lead._id, "Approved")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateStatus(lead._id, "Rejected")}
                                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}