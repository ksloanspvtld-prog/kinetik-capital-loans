"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (!email && !mobile) {
      setError("Email or mobile number is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Cookie
      document.cookie = `token=${data.token}; path=/; max-age=604800`;

      // ✅ Redirect
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">Log in</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">to access your Account</p>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 mb-4">
              <p className="text-rose-600 dark:text-rose-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
              <span className="flex-shrink mx-4 text-sm text-slate-500 dark:text-slate-400">OR</span>
              <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Mobile Number</label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}