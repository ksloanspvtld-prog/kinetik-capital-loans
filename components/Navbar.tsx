"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import Chatbot from "../components/Chatbot";

const COMPANY_NAME = "Kinetik Capital";

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    loanType: "",
    monthlyIncome: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // ... form submit logic
    setLoading(false);
  };

  // ✅ Lead Form
  const loanForm = (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6">
        Get Loan Offers
      </h2>
      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
          required
        />
        <input
          type="tel"
          maxLength={10}
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 10) setFormData({ ...formData, mobile: val });
          }}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        />
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        />
        <select
          value={formData.loanType}
          onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="">Select Loan Type</option>
          <option value="Personal Loan">Personal Loan</option>
          <option value="Home Loan">Home Loan</option>
          <option value="Business Loan">Business Loan</option>
          <option value="Car Loan">Car Loan</option>
        </select>
        <input
          type="number"
          placeholder="Monthly Income"
          value={formData.monthlyIncome}
          onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition font-medium disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Get Loan Offers"}
      </button>
    </form>
  );

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20">
        
        {/* ===== HERO SECTION ===== */}
        <section className="bg-gradient-to-br from-slate-50 to-indigo-50/50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Find the Right <br />
                  <span className="text-indigo-600">Financial Product</span>
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                  Get started in minutes with our simple, fast, and convenient application process.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      document.getElementById("loanForm")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-indigo-500/30"
                  >
                    Get Started
                  </button>
                  <Link
                    href="/about"
                    className="border-2 border-slate-300 hover:border-indigo-600 text-slate-700 hover:text-indigo-600 font-medium px-8 py-3 rounded-xl transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-72 h-72 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center">
                  <span className="text-8xl">🏦</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCT CARDS - EXACTLY AS SCREENSHOT ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Business Loan */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 group cursor-pointer"
              onClick={() => {
                document.getElementById("loanForm")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-lg">
                💼
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-indigo-600 transition">
                Business Loan
              </h3>
              <p className="mt-2 text-sm text-slate-500">Instant Funds for Instant Growth</p>
              <span className="inline-block mt-4 text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition">
                Apply Now →
              </span>
            </div>

            {/* Loan Against Property */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 group cursor-pointer"
              onClick={() => {
                document.getElementById("loanForm")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-lg">
                🏠
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-indigo-600 transition">
                Loan Against Property
              </h3>
              <p className="mt-2 text-sm text-slate-500">Lowest Interest Rate</p>
              <span className="inline-block mt-4 text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition">
                Apply Now →
              </span>
            </div>

            {/* Credit Score */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 group cursor-pointer"
              onClick={() => {
                document.getElementById("loanForm")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-indigo-600 transition">
                Credit Score
              </h3>
              <p className="mt-2 text-sm text-slate-500">Check your Credit Score for Free</p>
              <span className="inline-block mt-4 text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition">
                Check Now →
              </span>
            </div>

            {/* Education Loan */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 group cursor-pointer"
              onClick={() => {
                document.getElementById("loanForm")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-2xl text-white shadow-lg">
                🎓
              </div>
              <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-indigo-600 transition">
                Education Loan
              </h3>
              <p className="mt-2 text-sm text-slate-500">Fund your studies abroad</p>
              <span className="inline-block mt-4 text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition">
                Apply Now →
              </span>
            </div>
          </div>
        </section>

        {/* ===== LEAD GENERATION FORM ===== */}
        <section id="loanForm" className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          {loanForm}
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-4">{COMPANY_NAME}</h3>
                <p className="text-gray-400 text-sm">
                  One Fintech for all Banking and Finance Services.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link href="/#loanForm" className="hover:text-white transition">Apply for Loan</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms &amp; Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>📞 +91 9765435411</li>
                  <li>✉️ info@kinetikcapital.com</li>
                  <li>📍 Maharashtra, India</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}