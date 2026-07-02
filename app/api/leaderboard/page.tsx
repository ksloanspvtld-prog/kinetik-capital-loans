"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Agent = {
  id: string;
  name: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  rate: number;
};

export default function LeaderboardPage() {
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
        const res = await fetch("/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setAgents(data.leaderboard);
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
            <h1 className="text-3xl font-bold text-slate-900">🏆 Agent Leaderboard</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Agent</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Approved</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Rejected</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Pending</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">No agents found</td>
                    </tr>
                  ) : (
                    agents.map((agent, index) => (
                      <tr key={agent.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm font-bold">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-800">{agent.name}</td>
                        <td className="p-4 text-sm text-slate-600">{agent.total}</td>
                        <td className="p-4 text-sm text-emerald-600 font-medium">{agent.approved}</td>
                        <td className="p-4 text-sm text-rose-600">{agent.rejected}</td>
                        <td className="p-4 text-sm text-yellow-600">{agent.pending}</td>
                        <td className="p-4">
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
        </div>
      </main>
    </>
  );
}