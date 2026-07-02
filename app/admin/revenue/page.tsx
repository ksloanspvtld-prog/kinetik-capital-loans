"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

type RevenueStats = {
  totalRevenue: number;
  totalCommission: number;
  totalPaid: number;
  totalPending: number;
  monthlyData: { month: string; revenue: number; commission: number }[];
};

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b"];

export default function RevenuePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
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
        const res = await fetch("/api/admin/revenue", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
      <main className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">💰 Revenue Dashboard</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-indigo-500">
              <p className="text-3xl font-bold text-indigo-600">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
              <p className="text-sm text-slate-500">Total Revenue</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-emerald-500">
              <p className="text-3xl font-bold text-emerald-600">₹{stats?.totalPaid?.toLocaleString() || 0}</p>
              <p className="text-sm text-slate-500">Paid</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-yellow-500">
              <p className="text-3xl font-bold text-yellow-600">₹{stats?.totalPending?.toLocaleString() || 0}</p>
              <p className="text-sm text-slate-500">Pending</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 text-center border-l-4 border-purple-500">
              <p className="text-3xl font-bold text-purple-600">₹{stats?.totalCommission?.toLocaleString() || 0}</p>
              <p className="text-sm text-slate-500">Commission</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Paid", value: stats?.totalPaid || 0 },
                      { name: "Pending", value: stats?.totalPending || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                  >
                    {[0, 1].map((i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Commission vs Revenue */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 Revenue vs Commission</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="commission" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2 text-sm">
              <span className="flex items-center gap-2"><span className="w-3 h-3 bg-indigo-500 rounded"></span> Revenue</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Commission</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}