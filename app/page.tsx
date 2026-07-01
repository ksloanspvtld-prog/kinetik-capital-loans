"use client";

import { useState, FormEvent, useRef, useEffect, Dispatch, SetStateAction } from "react";
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

// ===== ALL LOAN CATEGORIES WITH IMAGES =====
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
  {
    id: "property",
    title: "Loan Against Property",
    icon: "🏘️",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop",
    description: "Unlock your property's value. Get large loans at competitive rates.",
    features: ["✔ Loan up to ₹10 Crore", "✔ Long tenure", "✔ Competitive interest", "✔ Quick processing"],
    link: "/#loanForm",
  },
  {
    id: "creditcard",
    title: "Credit Cards",
    icon: "💳",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    description: "Rewarding credit cards with premium benefits and offers.",
    features: ["✔ Reward points", "✔ Travel benefits", "✔ Fuel surcharge waiver", "✔ Complimentary lounge access"],
    link: "/#loanForm",
  },
  {
    id: "usedcar",
    title: "Used Car Loan",
    icon: "🚘",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop",
    description: "Finance your pre-owned car with ease. Quick approval and flexible tenure.",
    features: ["✔ Up to 90% financing", "✔ Interest from 12% p.a.", "✔ Quick disbursal", "✔ Flexible tenure"],
    link: "/#loanForm",
  },
  {
    id: "twowheeler",
    title: "Two Wheeler Loan",
    icon: "🏍️",
    image: "https://images.unsplash.com/photo-1596971078795-38b18e9d5baa?w=600&h=400&fit=crop",
    description: "Own your dream bike with easy two-wheeler loans at best rates.",
    features: ["✔ Up to 100% financing", "✔ Interest from 10% p.a.", "✔ Quick processing", "✔ Flexible EMIs"],
    link: "/#loanForm",
  },
  {
    id: "commercial",
    title: "Commercial Vehicle Loan",
    icon: "🚛",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    description: "Buy commercial vehicles for your business with easy financing options.",
    features: ["✔ Loan up to ₹5 Crore", "✔ Interest from 11% p.a.", "✔ Tenure up to 7 years", "✔ Quick approval"],
    link: "/#loanForm",
  },
];

export default function Home() {
  // ---- State ----
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

  // Modal state for loan popup
  const [selectedLoan, setSelectedLoan] = useState<typeof loanCategories[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    monthlyIncome: "",
  });
  const [modalLoading, setModalLoading] = useState(false);

  // ---- EMI Calculation ----
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  // ---- Address change handler ----
  const handleAddressChange = (data: { city: string; state: string; pincode: string }) => {
    setFormData((prev) => ({
      ...prev,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    }));
  };

  // ---- Loan Form Submit ----
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

  // ---- Partner Form Submit ----
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

  // ---- Modal Form Submit ----
  const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLoan) return;
    if (modalFormData.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setModalLoading(true);
    try {
      const payload = {
        ...modalFormData,
        loanType: selectedLoan.title,
      };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Something went wrong");
        return;
      }
      alert(`✅ Application for ${selectedLoan.title} submitted successfully!`);
      setModalOpen(false);
      setSelectedLoan(null);
      setModalFormData({
        fullName: "",
        mobile: "",
        city: "",
        state: "",
        monthlyIncome: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  // ---- Lead Form JSX ----
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
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
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
            if (value.length <= 10) {
              setFormData({ ...formData, mobile: value });
            }
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
          onChange={(e) =>
            setFormData({ ...formData, loanType: e.target.value })
          }
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
          onChange={(e) =>
            setFormData({ ...formData, monthlyIncome: e.target.value })
          }
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

  // ---- Modal component (inline - एकच definition) ----
  const LoanModal = () => {
    if (!selectedLoan) return null;
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => {
          setModalOpen(false);
          setSelectedLoan(null);
        }}
      >
        <div
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {selectedLoan.icon} {selectedLoan.title}
              </h2>
              <p className="text-sm text-slate-500">{selectedLoan.description}</p>
            </div>
            <button
              onClick={() => {
                setModalOpen(false);
                setSelectedLoan(null);
              }}
              className="text-slate-400 hover:text-slate-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <img
              src={selectedLoan.image}
              alt={selectedLoan.title}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          <ul className="space-y-2 mb-6">
            {selectedLoan.features.map((f, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-indigo-500 text-lg mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Apply for {selectedLoan.title}
            </h3>
            <form onSubmit={handleModalSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={modalFormData.fullName}
                onChange={(e) =>
                  setModalFormData({ ...modalFormData, fullName: e.target.value })
                }
                className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                required
              />
              <input
                type="tel"
                maxLength={10}
                placeholder="Mobile Number"
                value={modalFormData.mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10)
                    setModalFormData({ ...modalFormData, mobile: val });
                }}
                className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={modalFormData.city}
                  onChange={(e) =>
                    setModalFormData({ ...modalFormData, city: e.target.value })
                  }
                  className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={modalFormData.state}
                  onChange={(e) =>
                    setModalFormData({ ...modalFormData, state: e.target.value })
                  }
                  className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <input
                type="number"
                placeholder="Monthly Income"
                value={modalFormData.monthlyIncome}
                onChange={(e) =>
                  setModalFormData({ ...modalFormData, monthlyIncome: e.target.value })
                }
                className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={modalLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition font-medium disabled:opacity-50"
              >
                {modalLoading ? "Submitting..." : "Apply Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // ---- Main Render ----
  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Compare Loan Offers from <br />
                  <span className="text-yellow-300">Top Banks & NBFCs</span>
                </h1>
                <p className="mt-6 text-lg text-white/80 max-w-lg">
                  Get the best Personal, Home, Business and Car Loan offers
                  from trusted banks and financial institutions.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      document.getElementById("loanForm")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-yellow-400/30"
                  >
                    Apply Now
                  </button>
                  <button className="border-2 border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition backdrop-blur-sm">
                    Check Eligibility
                  </button>
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    ✓ Secure Process
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    ✓ Trusted Lenders
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    ✓ Fast Approval
                  </span>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="w-80 h-80 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <span className="text-6xl">🏦</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATISTICS ===== */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-indigo-600">₹5000Cr+</h3>
              <p className="text-sm text-slate-500 mt-1">Loans Facilitated</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-indigo-600">50+</h3>
              <p className="text-sm text-slate-500 mt-1">Lending Partners</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-indigo-600">2L+</h3>
              <p className="text-sm text-slate-500 mt-1">Happy Customers</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <h3 className="text-3xl font-bold text-indigo-600">98%</h3>
              <p className="text-sm text-slate-500 mt-1">Approval Assistance</p>
            </div>
          </div>
        </section>

        {/* ===== LOAN CATEGORIES – SLIDER WITH POPUP ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Explore All Loan Categories
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Choose from a wide range of financial products tailored to your needs.
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('loanSlider');
                if (container) {
                  container.scrollBy({ left: -350, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hidden md:block"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slider Track */}
            <div
              id="loanSlider"
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 hide-scrollbar"
              style={{ scrollbarWidth: 'none' }}
            >
              {loanCategories.map((loan) => (
                <div
                  key={loan.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)] snap-start group cursor-pointer"
                  onClick={() => {
                    setSelectedLoan(loan);
                    setModalOpen(true);
                  }}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 h-full flex flex-col">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={loan.image}
                        alt={loan.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{loan.icon}</span>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition">
                          {loan.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 flex-1 line-clamp-2">{loan.description}</p>
                      <button
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition font-medium text-sm w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLoan(loan);
                          setModalOpen(true);
                        }}
                      >
                        View Details & Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('loanSlider');
                if (container) {
                  container.scrollBy({ left: 350, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hidden md:block"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Scroll Hint */}
          <div className="flex justify-center gap-2 mt-6">
            <span className="text-sm text-indigo-500 font-medium bg-indigo-50 px-6 py-2 rounded-full shadow-sm border border-indigo-100 animate-pulse">
              ← Scroll → Explore More Loan Options
            </span>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400">
              {loanCategories.length} loan products available
            </span>
          </div>
        </section>

        {/* ===== EMI CALCULATOR ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-10">
              📊 EMI Calculator
            </h2>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 mb-8 text-center shadow-lg shadow-indigo-500/30">
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Your Monthly EMI</p>
              <p className="text-5xl md:text-6xl font-bold text-white mt-2 animate-pulse">
                ₹{Math.round(emi).toLocaleString()}
              </p>
              <p className="text-white/60 text-xs mt-2">Based on your loan details</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="font-semibold text-slate-700 flex justify-between">
                    <span>🏦 Loan Amount</span>
                    <span className="text-indigo-600">₹{loanAmount.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹1L</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 flex justify-between">
                    <span>📈 Interest Rate</span>
                    <span className="text-indigo-600">{interestRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 flex justify-between">
                    <span>📅 Tenure</span>
                    <span className="text-indigo-600">{tenure} Years</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-6 md:p-8 flex flex-col justify-center border border-slate-200">
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Monthly EMI</p>
                      <p className="text-xl font-bold text-indigo-600">
                        ₹{Math.round(emi).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Interest</p>
                      <p className="text-xl font-bold text-rose-600">
                        ₹{Math.round(totalInterest).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 col-span-2">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Payment</p>
                      <p className="text-xl font-bold text-emerald-600">
                        ₹{Math.round(totalPayment).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose {COMPANY_NAME}?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We help you compare, choose and apply for the best loan offers from trusted banks and NBFCs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "🏦",
                title: "Compare Multiple Lenders",
                desc: "Compare loan offers from top banks and NBFCs in one place.",
              },
              {
                icon: "⚡",
                title: "Fast Approvals",
                desc: "Quick processing and faster approvals from lending partners.",
              },
              {
                icon: "📉",
                title: "Lowest Interest Rates",
                desc: "Access competitive interest rates and save more money.",
              },
              {
                icon: "🔒",
                title: "Secure Application",
                desc: "Your personal information is protected with secure encryption.",
              },
              {
                icon: "👨‍💼",
                title: "Expert Assistance",
                desc: "Dedicated loan experts guide you throughout the process.",
              },
              {
                icon: "💻",
                title: "100% Online Process",
                desc: "Apply, upload documents and track status completely online.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-slate-100"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LEAD GENERATION FORM ===== */}
        <section id="loanForm" className="max-w-7xl mx-auto px-6 py-20">
          {loanForm}
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-gray-600">
              Trusted by thousands of customers across India.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                city: "Mumbai",
                review:
                  "Got my personal loan approved within 24 hours. Excellent support team.",
              },
              {
                name: "Priya Patel",
                city: "Ahmedabad",
                review:
                  "Very easy process and great loan comparison options.",
              },
              {
                name: "Amit Verma",
                city: "Delhi",
                review:
                  "Lowest interest rate among all lenders I checked.",
              },
              {
                name: "Sneha Joshi",
                city: "Pune",
                review:
                  "Professional guidance from start to finish.",
              },
              {
                name: "Vikram Singh",
                city: "Jaipur",
                review:
                  "Quick documentation and smooth approval process.",
              },
              {
                name: "Neha Gupta",
                city: "Bangalore",
                review:
                  "Highly recommended for business loan applications.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition duration-300"
              >
                <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 mb-6">
                  &quot;{testimonial.review}&quot;
                </p>
                <h4 className="font-bold text-slate-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.city}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            🆕 NEW SECTION: Easy. Convenient. Quick. (UrbanMoney Style)
            ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Easy. Convenient. <span className="text-indigo-600">Quick.</span>
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              The simple &amp; quick steps to your loan.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition border border-slate-100 relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                01
              </div>
              <div className="mt-4 text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-slate-800">Share Your Need</h3>
              <p className="text-sm text-slate-500 mt-2">Tell us your requirement in just 2 minutes</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition border border-slate-100 relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                02
              </div>
              <div className="mt-4 text-4xl mb-3">🤖</div>
              <h3 className="text-lg font-bold text-slate-800">Smart Comparison</h3>
              <p className="text-sm text-slate-500 mt-2">AI matches you with 90+ criteria for 90% success</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition border border-slate-100 relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                03
              </div>
              <div className="mt-4 text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-slate-800">Digital Apply</h3>
              <p className="text-sm text-slate-500 mt-2">Complete your application 100% online</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition border border-slate-100 relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                04
              </div>
              <div className="mt-4 text-4xl mb-3">💸</div>
              <h3 className="text-lg font-bold text-slate-800">Quick Disbursal</h3>
              <p className="text-sm text-slate-500 mt-2">Get sanction in minutes, not weeks</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="#loanForm"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-indigo-500/30"
            >
              Get Started →
            </a>
          </div>
        </section>
        {/* ===== END: Easy. Convenient. Quick. ===== */}

        {/* ============================================================
            ❌ REMOVED: "Join the Network / Become a Partner" Section
            ============================================================ */}

        {/* ===== OUR LENDING PARTNERS (MARQUEE) ===== */}
        <section className="py-20 overflow-hidden bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Lending Partners
            </h2>
            <p className="mt-4 text-gray-600">
              Trusted by India's leading banks and NBFCs.
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[
                "HDFC Bank",
                "ICICI Bank",
                "Axis Bank",
                "SBI",
                "Kotak Mahindra",
                "Bajaj Finserv",
                "Tata Capital",
                "IDFC First",
                "PNB",
                "Bank of Baroda",
                "HDFC Bank",
                "ICICI Bank",
                "Axis Bank",
                "SBI",
                "Kotak Mahindra",
                "Bajaj Finserv",
                "Tata Capital",
                "IDFC First",
                "PNB",
                "Bank of Baroda",
              ].map((bank, index) => {
                const logo = bankLogos[bank] || { initial: bank.charAt(0), color: "from-slate-500 to-slate-700" };
                return (
                  <div
                    key={index}
                    className="min-w-48 md:min-w-55 bg-white rounded-2xl shadow-md px-6 md:px-8 py-4 md:py-6 text-center border border-slate-100 flex flex-col items-center"
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${logo.color} flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-md`}>
                      {logo.initial}
                    </div>
                    <p className="font-semibold text-slate-900 mt-2 text-sm md:text-base">{bank}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-4">{COMPANY_NAME}</h3>
                <p className="text-gray-400">
                  Compare and apply for Personal, Home, Business and Car Loans from India's top banks and NBFCs.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Home</a></li>
                  <li><a href="#" className="hover:text-white transition">Loans</a></li>
                  <li><a href="#" className="hover:text-white transition">EMI Calculator</a></li>
                  <li><a href="#" className="hover:text-white transition">DSA Registration</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms &amp; Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>📞 +91 9765435411</li>
                  <li>✉️ info@kinetikcapital.com</li>
                  <li>📍 Maharashtra, India</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-400">
              <div className="flex justify-center gap-6 mb-4">
                <a href="#" className="hover:text-white transition">Facebook</a>
                <a href="#" className="hover:text-white transition">Instagram</a>
                <a href="#" className="hover:text-white transition">LinkedIn</a>
                <a href="#" className="hover:text-white transition">YouTube</a>
              </div>
              <p>
                © {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Modal */}
      <LoanModal />

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}