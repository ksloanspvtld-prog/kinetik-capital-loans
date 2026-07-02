"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

type CohortData = { month: string; total: number; converted: number; rate: number }[];
type FunnelData = { stage: string; count: number; rate: number }[];

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function AnalyticsPage() {
  const [cohorts, setCohorts] = useState<CohortData>([]);
  const [funnel, setFunnel] = useState<FunnelData>([]);
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

        const cohortRes = await fetch("/api/analytics/cohort", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cohortData = await cohortRes.json();
        if (cohortData.success) setCohorts(cohortData.cohorts);

        const funnelRes = await fetch("/api/analytics/funnel", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const funnelData = await funnelRes.json();
        if (funnelData.success) setFunnel(funnelData.funnel);
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
            <h1 className="text-3xl font-bold text-slate-900">📊 Advanced Analytics</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Cohort Analysis */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Cohort Analysis</h2>
            <p className="text-sm text-slate-500 mb-4">Conversion rate by month of lead creation</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cohorts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="total" fill="#6366f1" name="Total Leads" />
                <Bar yAxisId="left" dataKey="converted" fill="#22c55e" name="Approved" />
                <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#ef4444" name="Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel Analysis */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">🔄 Conversion Funnel</h2>
            <p className="text-sm text-slate-500 mb-4">Lead journey from creation to approval</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={funnel}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                  label={({ stage, count }) => `${stage}: ${count}`}
                >
                  {funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {funnel.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">{stage.stage}:</span>
                  <span className="text-sm font-bold text-slate-800">{stage.count}</span>
                  <span className="text-xs text-slate-400">({stage.rate}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}