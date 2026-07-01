"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// ✅ Define Lead type
type Lead = {
  _id: string;
  fullName: string;
  mobile: string;
  loanType: string;
  monthlyIncome?: string;
  status: "pending" | "processing" | "approved" | "rejected";
  createdAt: string;
};

export default function ManageLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);  // ← type added
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchLeads = async () => {
      try {
        const res = await fetch(`/api/admin/leads?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setLeads(data.leads);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [filter, router]);

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
        // ✅ Use functional update to avoid stale closure
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
            {["all", "pending", "processing", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === status
                    ? status === "all"
                      ? "bg-indigo-600 text-white"
                      : status === "pending"
                      ? "bg-yellow-600 text-white"
                      : status === "processing"
                      ? "bg-blue-600 text-white"
                      : status === "approved"
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Mobile</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Loan Type</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Income</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                            lead.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                            lead.status === "rejected" ? "bg-rose-100 text-rose-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {lead.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {lead.status !== "approved" && (
                              <button
                                onClick={() => updateStatus(lead._id, "approved")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Approve
                              </button>
                            )}
                            {lead.status !== "processing" && (
                              <button
                                onClick={() => updateStatus(lead._id, "processing")}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Process
                              </button>
                            )}
                            {lead.status !== "rejected" && (
                              <button
                                onClick={() => updateStatus(lead._id, "rejected")}
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