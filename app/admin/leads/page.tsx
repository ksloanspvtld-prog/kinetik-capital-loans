"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// ✅ Lead Type
type Lead = {
  _id: string;
  fullName: string;
  mobile: string;
  loanType: string;
  monthlyIncome?: string;
  status: "New" | "Contacted" | "Processing" | "Approved" | "Rejected";
  assignedAgent?: string | { _id: string; fullName: string } | null;
  createdAt: string;
};

// ✅ Agent Type
type Agent = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
};

export default function ManageLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  // ✅ Fetch Leads & Agents
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch leads
        const leadsRes = await fetch(`/api/admin/leads?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const leadsData = await leadsRes.json();
        if (leadsData.success) setLeads(leadsData.leads);

        // Fetch agents (users with role "agent")
        const agentsRes = await fetch("/api/admin/users?role=agent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const agentsData = await agentsRes.json();
        if (agentsData.success) setAgents(agentsData.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, router]);

  // ✅ Update Lead Status
  const updateStatus = async (id: string, status: Lead["status"]) => {
    const token = localStorage.getItem("token");
    try {
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

  // ✅ Assign Agent to Lead
  const assignAgent = async (leadId: string, agentId: string) => {
    if (!agentId) {
      alert("Please select an agent");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agentId }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === leadId
              ? { ...lead, assignedAgent: agents.find((a) => a._id === agentId) || null }
              : lead
          )
        );
        alert("✅ Agent assigned successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to assign agent");
    }
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "Approved": return "bg-emerald-100 text-emerald-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Rejected": return "bg-rose-100 text-rose-700";
      case "Contacted": return "bg-orange-100 text-orange-700";
      case "New": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  // ✅ Get agent name from lead
  const getAgentName = (lead: Lead) => {
    if (!lead.assignedAgent) return "Not Assigned";
    if (typeof lead.assignedAgent === "string") return "Assigned";
    return lead.assignedAgent.fullName || "Assigned";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Manage Leads</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
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
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Mobile</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Loan Type</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Income</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Agent</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">No leads found</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm text-slate-700 font-medium">{lead.fullName}</td>
                        <td className="p-4 text-sm text-slate-700">{lead.mobile}</td>
                        <td className="p-4 text-sm text-slate-700">{lead.loanType}</td>
                        <td className="p-4 text-sm text-slate-700">₹{lead.monthlyIncome || "N/A"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status || "New"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={typeof lead.assignedAgent === "string" ? lead.assignedAgent : (lead.assignedAgent?._id || "")}
                              onChange={(e) => assignAgent(lead._id, e.target.value)}
                              className="text-xs border-2 border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">Unassigned</option>
                              {agents.map((agent) => (
                                <option key={agent._id} value={agent._id}>
                                  {agent.fullName}
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] text-slate-400">
                              {getAgentName(lead)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {lead.status !== "Approved" && (
                              <button
                                onClick={() => updateStatus(lead._id, "Approved")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Approve
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
                            {lead.status !== "Contacted" && lead.status !== "Processing" && lead.status !== "Approved" && (
                              <button
                                onClick={() => updateStatus(lead._id, "Contacted")}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Contact
                              </button>
                            )}
                            {lead.status !== "Rejected" && (
                              <button
                                onClick={() => updateStatus(lead._id, "Rejected")}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Reject
                              </button>
                            )}
                            <Link
                              href={`/admin/leads/${lead._id}`}
                              className="bg-slate-600 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                            >
                              View
                            </Link>
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