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
  notes?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

export default function ManagePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [updating, setUpdating] = useState(false);
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

  const updatePartner = async (id: string, status: Partner["status"], notes?: string) => {
    const token = localStorage.getItem("token");
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setPartners((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, status, notes: notes || p.notes } : p
          )
        );
        setModalOpen(false);
        setSelectedPartner(null);
        setComment("");
        alert(`✅ Partner ${status} successfully!`);
      } else {
        alert("❌ Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setComment(partner.notes || "");
    setModalOpen(true);
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
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">No partners found</td>
                    </tr>
                  ) : (
                    partners.map((partner) => (
                      <tr
                        key={partner._id}
                        className="hover:bg-slate-50 transition cursor-pointer"
                        onClick={() => openModal(partner)}
                      >
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
                          <button
                            onClick={(e) => { e.stopPropagation(); openModal(partner); }}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                          >
                            👁️ View
                          </button>
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

      {/* Modal */}
      {modalOpen && selectedPartner && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            if (!updating) {
              setModalOpen(false);
              setSelectedPartner(null);
              setComment("");
            }
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Partner Details</h2>
              <button
                onClick={() => {
                  if (!updating) {
                    setModalOpen(false);
                    setSelectedPartner(null);
                    setComment("");
                  }
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl"
                disabled={updating}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-400 font-medium">Full Name</p>
                <p className="font-semibold text-slate-800">{selectedPartner.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Email</p>
                <p className="text-slate-600">{selectedPartner.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Mobile</p>
                <p className="text-slate-600">{selectedPartner.mobile}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">City</p>
                <p className="text-slate-600">{selectedPartner.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Partner Type</p>
                <p className="text-slate-600 capitalize">{selectedPartner.partnerType || "individual"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Current Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedPartner.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                  selectedPartner.status === "Rejected" ? "bg-rose-100 text-rose-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {selectedPartner.status || "Pending"}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium">Experience</p>
                <p className="text-slate-600">{selectedPartner.experience || "Not provided"}</p>
              </div>
            </div>

            {/* Comment / Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admin Comment / Reason (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Add a comment or reason for approval/rejection..."
                className="w-full border-2 border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                disabled={updating}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {selectedPartner.status !== "Approved" && (
                <button
                  onClick={() => updatePartner(selectedPartner._id, "Approved", comment)}
                  disabled={updating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
                >
                  ✅ Approve
                </button>
              )}
              {selectedPartner.status !== "Rejected" && (
                <button
                  onClick={() => {
                    if (!comment.trim()) {
                      if (!confirm("No comment provided. Are you sure you want to reject?")) return;
                    }
                    updatePartner(selectedPartner._id, "Rejected", comment);
                  }}
                  disabled={updating}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
                >
                  ❌ Reject
                </button>
              )}
              {selectedPartner.status !== "Pending" && (
                <button
                  onClick={() => updatePartner(selectedPartner._id, "Pending", comment)}
                  disabled={updating}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
                >
                  🔄 Reset to Pending
                </button>
              )}
              <button
                onClick={() => {
                  if (!updating) {
                    setModalOpen(false);
                    setSelectedPartner(null);
                    setComment("");
                  }
                }}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-medium transition"
                disabled={updating}
              >
                Close
              </button>
            </div>

            {updating && (
              <p className="text-center text-sm text-indigo-600 mt-4">⏳ Updating...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}