"use client";

import { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";

// ✅ Company Name - येथे बदला
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

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    loanType: "",
    monthlyIncome: "",
  });

  const [loading, setLoading] = useState(false);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [sortOrder, setSortOrder] = useState("low");

  // ✅ EMI Calculation
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  // ✅ Handle Form Submit
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
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
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

        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value })
          }
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
        />

        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value })
          }
          className="border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
        />

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

        {/* ===== STATISTICS SECTION ===== */}
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

        {/* ===== LOAN CATEGORIES SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Explore Loan Categories
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Find the right loan for your financial needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💳",
                title: "Personal Loan",
                desc: "Instant approval with attractive rates.",
                features: ["✔ Starting from 10.5% p.a.", "✔ Instant Approval"],
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: "🏠",
                title: "Home Loan",
                desc: "Low interest and long tenure options.",
                features: ["✔ Low Interest Rates", "✔ Up to 30 Years Tenure"],
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: "🏢",
                title: "Business Loan",
                desc: "Fast funding for business growth.",
                features: ["✔ Fast Funding", "✔ Flexible Repayment"],
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: "🚗",
                title: "Car Loan",
                desc: "Finance your dream car easily.",
                features: ["✔ Quick Processing", "✔ High Approval Rate"],
                color: "from-rose-500 to-rose-600",
              },
            ].map((category, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800">
                  {category.title}
                </h3>
                <p className="mt-2 text-slate-500 text-sm">{category.desc}</p>
                <ul className="mt-4 text-sm space-y-2 text-slate-600">
                  {category.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, loanType: category.title }));
                    document.getElementById("loanForm")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className={`mt-6 w-full bg-gradient-to-r ${category.color} text-white py-2.5 rounded-xl hover:shadow-lg transition font-medium`}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TOP LENDERS SECTION WITH LOGOS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Top Lending Partners
            </h2>
            <p className="mt-4 text-gray-600">
              Compare loan offers from India&apos;s leading banks and NBFCs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "HDFC Bank",
              "ICICI Bank",
              "Axis Bank",
              "SBI",
              "Kotak Mahindra",
              "Bajaj Finserv",
              "Tata Capital",
              "IDFC First Bank",
            ].map((bank) => {
              const logo = bankLogos[bank] || { initial: bank.charAt(0), color: "from-slate-500 to-slate-700" };
              return (
                <div
                  key={bank}
                  className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition hover:-translate-y-1 border border-slate-100"
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${logo.color} flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                    {logo.initial}
                  </div>
                  <p className="font-semibold text-slate-800 mt-3">{bank}</p>
                  <div className="mt-2 text-yellow-400 text-sm">★★★★★</div>
                  <p className="mt-1 text-xs text-slate-400">10.50% p.a.</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== SEARCH & FILTER SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Find Your Best Loan Offer
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="Search lender or loan type"
                className="border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <select className="border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                <option>Loan Type</option>
                <option>Personal Loan</option>
                <option>Home Loan</option>
                <option>Business Loan</option>
                <option>Car Loan</option>
              </select>
              <select className="border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                <option>Interest Rate</option>
                <option>Below 10%</option>
                <option>10% - 12%</option>
                <option>12% - 15%</option>
              </select>
              <select className="border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                <option>Loan Amount</option>
                <option>₹1L - ₹5L</option>
                <option>₹5L - ₹20L</option>
                <option>₹20L+</option>
              </select>
              <select className="border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                <option>Tenure</option>
                <option>1-3 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6 py-3 hover:shadow-lg hover:shadow-indigo-500/30 transition">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ===== EMI CALCULATOR ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-10">
              📊 EMI Calculator
            </h2>

            {/* Monthly EMI - Prominent Display */}
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

        {/* ===== LOAN COMPARISON TABLE ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Compare Loan Offers
            </h2>
            <p className="mt-3 text-gray-600">
              Compare interest rates, fees, approval time and loan amounts from top lenders.
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <select
              className="border-2 border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="low">Interest Rate: Low to High</option>
              <option value="high">Interest Rate: High to Low</option>
            </select>
          </div>

          <div className="overflow-x-auto bg-white rounded-3xl shadow-xl border border-gray-100">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-left text-sm">Bank</th>
                  <th className="p-4 text-left text-sm">Interest Rate</th>
                  <th className="p-4 text-left text-sm">Processing Fee</th>
                  <th className="p-4 text-left text-sm">Max Loan Amount</th>
                  <th className="p-4 text-left text-sm">Tenure</th>
                  <th className="p-4 text-left text-sm">Approval Time</th>
                  <th className="p-4 text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    bank: "HDFC Bank",
                    rate: "10.50%",
                    fee: "2%",
                    amount: "₹50L",
                    tenure: "7 Years",
                    approval: "24 Hours",
                  },
                  {
                    bank: "ICICI Bank",
                    rate: "10.75%",
                    fee: "1.5%",
                    amount: "₹40L",
                    tenure: "7 Years",
                    approval: "48 Hours",
                  },
                  {
                    bank: "Axis Bank",
                    rate: "10.99%",
                    fee: "2%",
                    amount: "₹35L",
                    tenure: "5 Years",
                    approval: "24 Hours",
                  },
                  {
                    bank: "SBI",
                    rate: "9.90%",
                    fee: "1%",
                    amount: "₹30L",
                    tenure: "6 Years",
                    approval: "72 Hours",
                  },
                  {
                    bank: "Kotak Mahindra",
                    rate: "10.25%",
                    fee: "2%",
                    amount: "₹45L",
                    tenure: "7 Years",
                    approval: "48 Hours",
                  },
                ].map((loan, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-semibold text-slate-800">
                      {loan.bank}
                    </td>
                    <td className="p-4">{loan.rate}</td>
                    <td className="p-4">{loan.fee}</td>
                    <td className="p-4">{loan.amount}</td>
                    <td className="p-4">{loan.tenure}</td>
                    <td className="p-4">{loan.approval}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          document.getElementById("loanForm")?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition text-sm"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* ===== OUR LENDING PARTNERS WITH LOGOS (MARQUEE) ===== */}
        <section className="py-20 overflow-hidden bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Lending Partners
            </h2>
            <p className="mt-4 text-gray-600">
              Trusted by India&apos;s leading banks and NBFCs.
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
                  Compare and apply for Personal, Home, Business and Car Loans from India&apos;s top banks and NBFCs.
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
    </>
  );
}