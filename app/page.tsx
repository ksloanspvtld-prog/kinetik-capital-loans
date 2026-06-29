"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";

// ✅ Company Name - येथे बदला
const COMPANY_NAME = "Kinetik Capital";

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
      <main className="pt-16">
        
        {/* ===== HERO SECTION - UrbanMoney Style ===== */}
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

        {/* ===== PRODUCT CARDS - UrbanMoney Style ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💼",
                title: "Business Loan",
                desc: "Instant Funds for Instant Growth",
                color: "from-blue-500 to-blue-600",
                link: "/#loanForm",
              },
              {
                icon: "🏠",
                title: "Loan Against Property",
                desc: "Lowest Interest Rate Unlock Offers",
                color: "from-emerald-500 to-emerald-600",
                link: "/#loanForm",
              },
              {
                icon: "📊",
                title: "Credit Score",
                desc: "Check your Credit Score for Free",
                color: "from-purple-500 to-purple-600",
                link: "/#loanForm",
              },
              {
                icon: "🎓",
                title: "Education Loan",
                desc: "Fund your studies abroad",
                color: "from-rose-500 to-rose-600",
                link: "/#loanForm",
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 group cursor-pointer"
                onClick={() => {
                  document.getElementById("loanForm")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                  {product.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-indigo-600 transition">
                  {product.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{product.desc}</p>
                <span className="inline-block mt-4 text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition">
                  Learn More →
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CREDIT CARDS SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Smart Credit Cards <span className="text-indigo-600">Designed For You</span>
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Explore top credit card options suited to your spending and goals. {COMPANY_NAME} assists you in comparing, choosing, and applying online to boost your credit and enjoy rewards.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌍",
                title: "Global Acceptance",
                desc: "Use your card anywhere in the world.",
              },
              {
                icon: "🛎️",
                title: "24/7 Concierge Service",
                desc: "Personal travel assistance anytime.",
              },
              {
                icon: "✈️",
                title: "Accelerated Rewards",
                desc: "Double points on flight & hotel bookings.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition hover:-translate-y-1 border border-slate-100 text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LOAN CATEGORIES ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "💳",
                title: "Personal Loan",
                features: [
                  "Loan amounts up to ₹40 Lakhs",
                  "Interest rates from 10.99% p.a.",
                  "Disbursal within 24 hours",
                ],
                color: "from-indigo-500 to-indigo-600",
              },
              {
                icon: "🏠",
                title: "Home Loan",
                features: [
                  "Up to ₹5 Crore Loan Amount",
                  "Interest rates from 8.50% p.a.",
                  "Quick Approval in 48 Hours",
                ],
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: "🎓",
                title: "Education Loan",
                features: [
                  "Loan up to ₹2cr for India & Abroad",
                  "Interest rates from 8.33% p.a.",
                  "Moratorium period available",
                ],
                color: "from-purple-500 to-purple-600",
              },
            ].map((loan, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${loan.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                  {loan.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mt-4">{loan.title}</h3>
                <ul className="mt-4 space-y-2">
                  {loan.features.map((feature, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    document.getElementById("loanForm")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition font-medium"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Easy. Convenient. <span className="text-indigo-600">Quick.</span>
            </h2>
            <p className="mt-4 text-slate-600">The simple & quick steps to your loan.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Eligibility",
                desc: "Tell us your requirement in 2 minutes",
              },
              {
                step: "02",
                title: "Compare",
                desc: "AI matches best banks with 90+ criteria",
              },
              {
                step: "03",
                title: "Apply",
                desc: "Digital application complete digitally",
              },
              {
                step: "04",
                title: "Disbursement",
                desc: "Get quick sanction in minutes not weeks",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-slate-100 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
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
          </div>
        </section>

        {/* ===== EMI CALCULATOR ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Financial <span className="text-indigo-600">Calculators</span>
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Our calculators assist you in planning your finances, estimating payments, and making informed money decisions, from EMIs to FDs.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
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

        {/* ===== FAQ SECTION ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              We&apos;re Here to Answer <span className="text-indigo-600">All Your Questions</span>
            </h2>
            <p className="mt-4 text-slate-600">
              From refinancing to reducing your interest, we have the answers right here.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: `What is ${COMPANY_NAME}?`,
                a: `${COMPANY_NAME} is a fintech loan aggregator that assists millions in achieving their dream of owning a home. Since 2024, ${COMPANY_NAME} has changed how lending works by offering personalised loan options from various banks and NBFCs. It guides clients through every loan process step—from selecting the right loan to handling paperwork, legal support, insurance, and disbursing the loan.`,
              },
              {
                q: `How does ${COMPANY_NAME} work?`,
                a: `${COMPANY_NAME} simplifies borrowing by connecting individuals with various financial products. We offer personal loans, home loans, business loans, and loans against property. Through our digital platform, users can compare loan options from over 95 lenders, ensuring they find the best fit for their financial needs.`,
              },
              {
                q: `Is ${COMPANY_NAME} safe?`,
                a: `${COMPANY_NAME} is a reputable fintech company in India, partnering with over 95 trusted banks and financial institutions to deliver reliable services. With advanced technology, we safeguard user data and transactions, following strict security protocols to ensure privacy.`,
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-slate-800">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BANKING PARTNERS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our <span className="text-indigo-600">100+ Banking Partners</span>
            </h2>
            <p className="mt-4 text-slate-600">
              Explore our network of top financial institutions and gain valuable insights to support your confident loan and financing choices.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              "HDFC Bank",
              "ICICI Bank",
              "Axis Bank",
              "SBI",
              "Kotak Mahindra",
              "Bajaj Finserv",
              "Tata Capital",
              "IDFC First Bank",
              "PNB",
              "Bank of Baroda",
            ].map((bank, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md px-6 py-4 border border-slate-100 hover:shadow-lg transition hover:-translate-y-1"
              >
                <span className="font-semibold text-slate-700 text-sm">{bank}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LEAD GENERATION FORM ===== */}
        <section id="loanForm" className="max-w-7xl mx-auto px-6 py-16 bg-slate-50 rounded-3xl">
          {loanForm}
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-4">{COMPANY_NAME}</h3>
                <p className="text-gray-400 text-sm">
                  One Fintech for all Banking and Finance Services. Compare and apply for Personal, Home, Business and Car Loans.
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
    </>
  );
}