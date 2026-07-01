"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";

const COMPANY_NAME = "Kinetik Capital";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [agree, setAgree] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!agree) {
      alert("Please agree to the Terms and Conditions");
      return;
    }
    setLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      alert("OTP sent to " + mobile);
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      alert("✅ Login Successful! Redirecting to dashboard...");
      // Redirect to customer dashboard
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
          
          {/* ===== LEFT SIDE - Benefits ===== */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 md:p-10 md:w-1/2 text-white flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white/90">Take control of the service</h2>
              <p className="text-white/70 text-sm mt-1">Experience during your home loan journey</p>
            </div>

            <ul className="space-y-4 text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl mt-0.5">✓</span>
                <span className="text-sm">Provide more information about your loan requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl mt-0.5">✓</span>
                <span className="text-sm">Rate your Experience with us and give feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl mt-0.5">✓</span>
                <span className="text-sm">View assigned agent&apos;s profile &amp; request for change if required</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>🔒 Secure</span>
                <span>⚡ Fast</span>
                <span>📱 Easy</span>
              </div>
            </div>
          </div>

          {/* ===== RIGHT SIDE - Login Form ===== */}
          <div className="p-6 md:p-10 md:w-1/2">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Log in
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              to access your Account
            </p>

            {!otpSent ? (
              // ===== Step 1: Mobile Number =====
              <form onSubmit={handleSendOTP}>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Mobile Number
                </label>
                <div className="flex border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <div className="flex items-center gap-1 px-3 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter Your 10 Digit Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setMobile(val);
                    }}
                    className="flex-1 p-3 outline-none bg-transparent dark:text-white text-sm"
                    required
                  />
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    I agree to the Terms and Conditions of {COMPANY_NAME} Private Limited &amp; agree to receive promotional messages from WhatsApp/RCS/SMS.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Proceed to Login →"
                  )}
                </button>
              </form>
            ) : (
              // ===== Step 2: OTP Verification =====
              <form onSubmit={handleVerifyOTP}>
                <div className="mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Enter OTP sent to <span className="font-semibold text-indigo-600">+91 {mobile}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Change Number?
                  </button>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 6) setOtp(val);
                  }}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-center text-2xl tracking-widest font-mono"
                  required
                />

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      alert("OTP resent to " + mobile);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Resend OTP
                  </button>
                  <span className="text-sm text-slate-400 mx-2">|</span>
                  <span className="text-sm text-slate-400">30s</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login →"
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-slate-400 mt-6">
              By logging in, you agree to our Privacy Policy &amp; Terms of Service.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}