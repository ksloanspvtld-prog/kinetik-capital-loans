"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import AddressInput from "../components/AddressInput";
import Chatbot from "../components/Chatbot";

const COMPANY_NAME = "Kinetik Capital";

// Bank Logos Data (initial + color)
const bankLogos: Record<string, { initial: string; color: string }> = {
  "HDFC Bank": { initial: "H", color: "from-blue-500 to-blue-700" },
  "ICICI Bank": { initial: "I", color: "from-purple-500 to-purple-700" },
  "Axis Bank": { initial: "A", color: "from-red-500 to-red-700" },
  "SBI": { initial: "S", color: "from-emerald-500 to-emerald-700" },
  "Kotak Mahindra": { initial: "K", color: "from-orange-500 to-orange-700" },
  "Bajaj Finserv": { initial: "B", color: "from-yellow-500 to-yellow-700" },
  "Tata Capital": { initial: "T", color: "from-cyan-500 to-cyan-700" },
  "IDFC First Bank": { initial: "I", color: "from-indigo-500 to-indigo-700" },
  "PNB": { initial: "P", color: "from-rose-500 to-rose-700" },
  "Bank of Baroda": { initial: "B", color: "from-amber-500 to-amber-700" },
};

// ===== LOAN CATEGORIES WITH IMAGES =====
const loanCategories = [
  {
    id: "personal",
    title: "Personal Loan",
    icon: "💳",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
    description: "Instant approval with attractive rates. Get funds for any personal need.",
    features: ["✔ Loan up to ₹40 Lakhs", "✔ Interest from 10.99% p.a.", "✔ Disbursal in 24 hours", "✔ No collateral"],
    link: "/loans/personal-loan",
  },
  {
    id: "home",
    title: "Home Loan",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    description: "Low interest and long tenure options. Make your dream home a reality.",
    features: ["✔ Loan up to ₹5 Crore", "✔ Interest from 8.50% p.a.", "✔ Tenure up to 30 years", "✔ Quick approval"],
    link: "/loans/home-loan",
  },
  {
    id: "business",
    title: "Business Loan",
    icon: "🏢",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop",
    description: "Fast funding for business growth. Flexible repayment options.",
    features: ["✔ Loan up to ₹10 Crore", "✔ Fast disbursal", "✔ Flexible tenure", "✔ No collateral up to ₹50L"],
    link: "/loans/business-loan",
  },
  {
    id: "car",
    title: "Car Loan",
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop",
    description: "Finance your dream car easily. Quick processing and high approval.",
    features: ["✔ 100% financing", "✔ Processing in 24 hours", "✔ High approval rate", "✔ Tenure up to 7 years"],
    link: "/loans/car-loan",
  },
  {
    id: "education",
    title: "Education Loan",
    icon: "🎓",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop",
    description: "Fund your studies abroad or in India. Competitive rates.",
    features: ["✔ Loan up to ₹2 Crore", "✔ Interest from 8.33% p.a.", "✔ Moratorium period", "✔ Tax benefits"],
    link: "/#loanForm",
  },
  {
    id: "gold",
    title: "Gold Loan",
    icon: "🥇",
    image: "https://images.unsplash.com/photo-1610374792793-fd1f3f4f56f4?w=600&h=400&fit=crop",
    description: "Quick gold loans at best rates. Get funds against your gold jewellery.",
    features: ["✔ Loan against gold", "✔ Instant processing", "✔ Low interest", "✔ Flexible repayment"],
    link: "/#loanForm",
  },
];

export default function Home() {
  // ... (existing state and functions)

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
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [sortOrder, setSortOrder] = useState("low");

  const [partnerData, setPartnerData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    experience: "",
  });
  const [partnerLoading, setPartnerLoading] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState("personal");

  // ... (all existing functions: handleSubmit, handlePartnerSubmit, etc.)

  // ===== Handle Loan Form Submit =====
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // ... (existing submit logic)
    // After success, reset form and alert
  };

  // ===== Handle Partner Form Submit =====
  const handlePartnerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPartnerLoading(true);
    // ... (existing partner submit logic)
  };

  // ===== EMI Calculation =====
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  // ===== Address change handler =====
  const handleAddressChange = (data: { city: string; state: string; pincode: string }) => {
    setFormData((prev) => ({
      ...prev,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    }));
  };

  // ===== Lead Form =====
  const loanForm = (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6">
        Get Loan Offers
      </h2>
      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        {/* ... same inputs as before ... */}
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          required
        />
        <input
          type="tel"
          maxLength={10}
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) setFormData({ ...formData, mobile: value });
          }}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          required
        />
        <div className="md:col-span-2">
          <AddressInput
            value={{
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            }}
            onChange={handleAddressChange}
            required
          />
        </div>
        <select
          value={formData.loanType}
          onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
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
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition font-medium disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Get Loan Offers"}
      </button>
    </form>
  );

  // ===== Handle Partner Form Submit =====
  const handlePartnerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPartnerLoading(true);
    if (partnerData.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      setPartnerLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Something went wrong");
        return;
      }
      alert("✅ Partner Registration Successful! We'll contact you soon.");
      setPartnerData({
        fullName: "",
        email: "",
        mobile: "",
        city: "",
        experience: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit. Please try again.");
    } finally {
      setPartnerLoading(false);
    }
  };

  // ===== Handle Loan Form Submit =====
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Something went wrong");
        return;
      }
      alert("✅ Lead Submitted Successfully!");
      setFormData({
        fullName: "",
        mobile: "",
        city: "",
        state: "",
        loanType: "",
        monthlyIncome: "",
        pincode: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Partner Form Submit =====
  // (already defined above)

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20">
        {/* ===== HERO SECTION (unchanged) ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          {/* ... hero content ... */}
        </section>

        {/* ===== STATISTICS SECTION (unchanged) ===== */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
          {/* ... stats ... */}
        </section>

        {/* ===== NEW LOAN CATEGORIES WITH TABS & SLIDER ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Explore Loan Categories
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Find the right loan for your financial needs.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {loanCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                  activeTab === cat.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.title}
              </button>
            ))}
          </div>

          {/* Tab Content - Card with Image & Details */}
          {loanCategories.map((cat) => (
            <div
              key={cat.id}
              className={`transition-all duration-300 ${
                activeTab === cat.id ? "block animate-fadeIn" : "hidden"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Image */}
                <div className="h-64 md:h-auto relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-800">{cat.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm">{cat.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {cat.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-500 text-lg mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={cat.link}
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-center transition font-medium w-full md:w-auto"
                  >
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ===== EMI CALCULATOR (unchanged) ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          {/* ... EMI calculator ... */}
        </section>

        {/* ===== WHY CHOOSE US (unchanged) ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          {/* ... why choose us ... */}
        </section>

        {/* ===== LEAD GENERATION FORM (unchanged) ===== */}
        <section id="loanForm" className="max-w-7xl mx-auto px-6 py-20">
          {loanForm}
        </section>

        {/* ===== TESTIMONIALS (unchanged) ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          {/* ... testimonials ... */}
        </section>

        {/* ===== BECOME A PARTNER (unchanged) ===== */}
        <section id="become-partner" className="max-w-7xl mx-auto px-6 py-20">
          {/* ... partner section ... */}
        </section>

        {/* ===== OUR LENDING PARTNERS (unchanged) ===== */}
        <section className="py-20 overflow-hidden bg-white">
          {/* ... marquee ... */}
        </section>

        {/* ===== FOOTER (unchanged) ===== */}
        <footer className="bg-slate-900 text-white mt-20">
          {/* ... footer ... */}
        </footer>
      </main>

      <Chatbot />
    </>
  );
}