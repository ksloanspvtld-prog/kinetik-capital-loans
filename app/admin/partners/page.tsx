"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ManagePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchPartners = async () => {
      try {
        const res = await fetch(`/api/admin/partners?status=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setPartners(data.partners);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [filter, router]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setPartners(partners.map((p: any) => p._id === id ? { ...p, status } : p));
        alert(`✅ Partner ${status} successfully!`);
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
            <h1 className="text-3xl font-bold text-slate-900">Manage Partners</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === "all" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === "pending" ? "bg-yellow-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === "approved" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === "rejected" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Partners Table */}
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Mobile</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">City</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">No partners found</td>
                    </tr>
                  ) : (
                    partners.map((partner: any) => (
                      <tr key={partner._id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm text-slate-700 font-medium">{partner.fullName}</td>
                        <td className="p-4 text-sm text-slate-700">{partner.email}</td>
                        <td className="p-4 text-sm text-slate-700">{partner.mobile}</td>
                        <td className="p-4 text-sm text-slate-700">{partner.city || "N/A"}</td>
                        <td className="p-4 text-sm text-slate-700 capitalize">{partner.partnerType || "individual"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            partner.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                            partner.status === "rejected" ? "bg-rose-100 text-rose-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {partner.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {partner.status !== "approved" && (
                              <button
                                onClick={() => updateStatus(partner._id, "approved")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Approve
                              </button>
                            )}
                            {partner.status !== "rejected" && (
                              <button
                                onClick={() => updateStatus(partner._id, "rejected")}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Reject
                              </button>
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