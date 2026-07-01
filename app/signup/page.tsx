"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!fullName || !email || !mobile || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (mobile.length !== 10) {
      setError("Mobile number must be 10 digits");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, mobile, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created! Please check your email for verification.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Join Kinetik Capital today
          </p>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 mb-4">
              <p className="text-rose-600 dark:text-rose-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 mb-4">
              <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center">{success}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10 digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}