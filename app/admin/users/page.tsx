"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// ✅ Define User type
type User = {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: "customer" | "agent" | "admin";
  isVerified: boolean;
  createdAt: string;
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);  // ← type added
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

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
            <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Mobile</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Verified</th>
                    <th className="p-4 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">No users found</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-sm text-slate-700 font-medium">{user.fullName}</td>
                        <td className="p-4 text-sm text-slate-700">{user.email}</td>
                        <td className="p-4 text-sm text-slate-700">{user.mobile}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin" ? "bg-purple-100 text-purple-700" :
                            user.role === "agent" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {user.role || "customer"}
                          </span>
                        </td>
                        <td className="p-4 text-sm">
                          {user.isVerified ? (
                            <span className="text-emerald-600">✅ Verified</span>
                          ) : (
                            <span className="text-rose-600">❌ Not Verified</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
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