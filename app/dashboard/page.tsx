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
  createdAt: string;
  kycStatus?: string;
  paymentStatus?: string;
};

type ReferralStats = {
  totalReferrals: number;
  approved: number;
  pending: number;
  totalCommission: number;
  referralCode?: string;
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<{ fullName: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralLink, setReferralLink] = useState("");
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
      } catch (e) {}
    }

    const fetchData = async () => {
      try {
        // Fetch leads
        const leadsRes = await fetch("/api/leads/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const leadsData = await leadsRes.json();
        if (leadsData.success) {
          setLeads(leadsData.leads || []);
        }

        // Fetch referral stats (if user has referral code)
        const refRes = await fetch("/api/referral/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const refData = await refRes.json();
        if (refData.success) {
          setReferralStats(refData.stats);
          if (refData.stats.referralCode) {
            setReferralLink(`${window.location.origin}?ref=${refData.stats.referralCode}`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-yellow-100 text-yellow-700";
      case "Contacted": return "bg-orange-100 text-orange-700";
      case "Processing": return "bg-blue-100 text-blue-700";
      case "Approved": return "bg-emerald-100 text-emerald-700";
      case "Rejected": return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "bg-emerald-100 text-emerald-700";
      case "Submitted": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("📋 Referral link copied to clipboard!");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  const totalLeads = leads.length;
  const approvedLeads = leads.filter(l => l.status === "Approved").length;
  const pendingLeads = leads.filter(l => l.status === "New" || l.status === "Contacted" || l.status === "Processing").length;
  const rejectedLeads = leads.filter(l => l.status === "Rejected").length;

  // Check if any lead has KYC data
  const hasKyc = leads.some(l => l.kycStatus && l.kycStatus !== "Pending");
  const kycStatus = leads.find(l => l.kycStatus)?.kycStatus || "Pending";

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Welcome Section */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome back, <span className="text-indigo-600">{user?.fullName}</span> 👋
                </h1>
                <p className="text-slate-500 mt-1">
                  Track your loan applications, referrals, and more.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-indigo-500">
              <p className="text-3xl font-bold text-indigo-600">{totalLeads}</p>
              <p className="text-sm text-slate-500">Total Applications</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-emerald-500">
              <p className="text-3xl font-bold text-emerald-600">{approvedLeads}</p>
              <p className="text-sm text-slate-500">Approved</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-yellow-500">
              <p className="text-3xl font-bold text-yellow-600">{pendingLeads}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-rose-500">
              <p className="text-3xl font-bold text-rose-600">{rejectedLeads}</p>
              <p className="text-sm text-slate-500">Rejected</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/#loanForm"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-md p-6 hover:shadow-lg transition hover:-translate-y-1"
            >
              <h3 className="font-bold text-lg">📝 Apply for Loan</h3>
              <p className="text-white/80 text-sm mt-1">Start a new loan application</p>
            </Link>
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">⭐ Rate Experience</h3>
              <p className="text-sm text-slate-500 mt-1">Share your feedback</p>
              <button className="mt-4 text-indigo-600 font-medium text-sm hover:text-indigo-700">Rate Now →</button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">👤 Profile</h3>
              <p className="text-sm text-slate-500 mt-1">View and edit your profile</p>
              <button className="mt-4 text-indigo-600 font-medium text-sm hover:text-indigo-700">View Profile →</button>
            </div>
          </div>

          {/* Referral & KYC Row */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Referral Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                🔗 Refer & Earn
              </h3>
              {referralStats?.referralCode ? (
                <>
                  <p className="text-sm text-slate-500 mb-3">
                    Share your referral link and earn commission on every approved lead!
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 border-2 border-slate-200 rounded-xl p-2.5 bg-slate-50 text-sm text-slate-600"
                    />
                    <button
                      onClick={copyLink}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">{referralStats.totalReferrals}</p>
                      <p className="text-xs text-slate-500">Total Referrals</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{referralStats.approved}</p>
                      <p className="text-xs text-slate-500">Approved</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">₹{referralStats.totalCommission}</p>
                      <p className="text-xs text-slate-500">Commission</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500">You don't have a referral code yet.</p>
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const res = await fetch("/api/referral/generate", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert("✅ Referral code generated! Refresh the page.");
                        window.location.reload();
                      } else {
                        alert("❌ Failed to generate code. Try again.");
                      }
                    }}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Generate Referral Code
                  </button>
                </div>
              )}
            </div>

            {/* KYC Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                ✅ KYC Status
              </h3>
              {hasKyc ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getKycStatusColor(kycStatus)}`}>
                      {kycStatus}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {kycStatus === "Verified" && "Your KYC is complete. You can proceed with loan applications."}
                    {kycStatus === "Submitted" && "Your KYC documents are under review. We'll notify you soon."}
                    {kycStatus === "Rejected" && "Your KYC was rejected. Please upload valid documents."}
                    {kycStatus === "Pending" && "Please submit your KYC documents to continue."}
                  </p>
                  {kycStatus !== "Verified" && (
                    <Link
                      href="/dashboard/kyc"
                      className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      {kycStatus === "Pending" ? "Upload KYC" : "Update KYC"}
                    </Link>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500">No KYC submitted yet.</p>
                  <Link
                    href="/dashboard/kyc"
                    className="mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Upload KYC
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">📋 Your Applications</h2>
              <Link
                href="/#loanForm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                + Apply New
              </Link>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-slate-500">No applications yet.</p>
                <Link href="/#loanForm" className="text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block">
                  Apply for a loan now →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-slate-50 rounded-xl">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Loan Type</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">KYC</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Payment</th>
                      <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50 transition">
                        <td className="p-3 text-sm text-slate-700 font-medium">{lead.loanType}</td>
                        <td className="p-3 text-sm text-slate-700">₹{lead.monthlyIncome || "N/A"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status || "New"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKycStatusColor(lead.kycStatus || "Pending")}`}>
                            {lead.kycStatus || "Pending"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                            lead.paymentStatus === "Failed" ? "bg-rose-100 text-rose-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {lead.paymentStatus || "Pending"}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}