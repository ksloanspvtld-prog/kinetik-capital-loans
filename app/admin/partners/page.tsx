"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Partner = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  partnerType: "individual" | "firm" | "corporate";
  experience: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

export default function ManagePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
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
        if (data.success) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [filter, router]);

  const updateStatus = async (id: string, status: Partner["status"]) => {
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
        setPartners((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p))
        );
        alert(`✅ Partner ${status} successfully!`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update status");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900">🤝 Manage Partners</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-wrap gap-3">
            {["all", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === status.toLowerCase()
                    ? status === "all"
                      ? "bg-indigo-600 text-white"
                      : status === "Pending"
                      ? "bg-yellow-600 text-white"
                      : status === "Approved"
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Mobile</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">City</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Type</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">No partners found</td>
                    </tr>
                  ) : (
                    partners.map((partner) => (
                      <tr key={partner._id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm text-slate-800 font-medium">{partner.fullName}</td>
                        <td className="p-4 text-sm text-slate-600">{partner.email}</td>
                        <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{partner.mobile}</td>
                        <td className="p-4 text-sm text-slate-600 hidden md:table-cell">{partner.city || "N/A"}</td>
                        <td className="p-4 text-sm text-slate-600 hidden lg:table-cell capitalize">{partner.partnerType || "individual"}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            partner.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                            partner.status === "Rejected" ? "bg-rose-100 text-rose-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {partner.status || "Pending"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {partner.status !== "Approved" && (
                              <button
                                onClick={() => updateStatus(partner._id, "Approved")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                              >
                                Approve
                              </button>
                            )}
                            {partner.status !== "Rejected" && (
                              <button
                                onClick={() => updateStatus(partner._id, "Rejected")}
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