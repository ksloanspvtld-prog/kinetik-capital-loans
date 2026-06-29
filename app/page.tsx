"use client";

import { useState, FormEvent } from "react";
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
        
        {/* ===== HERO SECTION - Ruloans Style ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                We Facilitate Wide Range of <br />
                <span className="text-indigo-400">Financial Products</span>
              </h1>
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                That suits your customer's needs! Get the best Personal, Home, Business and Car Loan offers from trusted banks and financial institutions.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    document.getElementById("loanForm")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-indigo-500/30"
                >
                  Apply Now
                </button>
                <button className="border-2 border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition backdrop-blur-sm">
                  Check Eligibility
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCT GRID - Ruloans Style ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              We Facilitate Wide Range of Financial Products
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              That suits your customer's needs!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏠", title: "Home Loan", desc: "Your Dream Home Awaits - Explore Our Range Of Home Loan Products." },
              { icon: "🏢", title: "Loan against Property", desc: "Unlock your property's value with tailored loan solutions." },
              { icon: "💳", title: "Personal Loan", desc: "Achieve your dreams with our versatile personal loan options." },
              { icon: "📈", title: "Business Loan", desc: "Boost your business growth with our flexible financing options." },
              { icon: "🎓", title: "Education Loan", desc: "Invest in your child's future with our specialized education loans." },
              { icon: "🚗", title: "Car Loan", desc: "Drive your dream car with our quick and flexible car loans." },
              { icon: "🥇", title: "Gold Loan", desc: "Meet your financial needs with gold loans from trusted banks." },
              { icon: "💳", title: "Credit Cards", desc: "Upgrade your lifestyle with feature-packed, rewarding credit cards." },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100"
              >
                <div className="text-4xl mb-3">{product.icon}</div>
                <h3 className="text-xl font-bold text-slate-800">{product.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{product.desc}</p>
                <button
                  onClick={() => {
                    document.getElementById("loanForm")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="mt-4 text-indigo-600 font-medium hover:text-indigo-700 transition text-sm flex items-center gap-1"
                >
                  Check Eligibility →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ===== STATISTICS - Ruloans Style ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">25+</p>
              <p className="text-sm text-slate-500 mt-1">Years of Experience</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">275+</p>
              <p className="text-sm text-slate-500 mt-1">Partner Banks & NBFCs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">4,000+</p>
              <p className="text-sm text-slate-500 mt-1">Branches Across India</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">₹1,00,000 Cr+</p>
              <p className="text-sm text-slate-500 mt-1">Successful Disbursal</p>
            </div>
          </div>
        </section>

        {/* ===== PARTNER APP SECTION - Ruloans Style ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {COMPANY_NAME} App - India's First B2B Loan Distribution Channel Partner App
                </h2>
                <p className="mt-4 text-white/80">
                  Discover {COMPANY_NAME}, India's first B2B fintech app in the loan distribution domain.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Access a PAN India network of lenders and customers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Benefit from being the first in the industry to offer a Free CIBIL Check</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Use convenient features like an EMI calculator to assist customers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Start your journey as a successful loan distribution partner</span>
                  </li>
                </ul>
                <button className="mt-6 bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition">
                  Learn More →
                </button>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <span className="text-7xl">📱</span>
                </div>
              </div>
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

        {/* ===== TESTIMONIALS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              What People Say About Us?
            </h2>
            <p className="mt-4 text-gray-600">
              Trusted by thousands of customers across India.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                role: "Manager - Advertising",
                review:
                  "I really appreciate your kind efforts, which helped me secure the Personal Loan disbursed from HDFC Bank through {COMPANY_NAME}. It was a wonderful experience dealing with you. Your dedication and hardworking approach are highly appreciable.",
              },
              {
                name: "Priya Patel",
                role: "Business Owner",
                review:
                  "Very easy process and great loan comparison options. I got the best deal for my business loan. Highly recommended!",
              },
              {
                name: "Amit Verma",
                role: "IT Professional",
                review:
                  "Lowest interest rate among all lenders I checked. The team was very helpful throughout the process.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition duration-300 border border-slate-100"
              >
                <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 text-sm italic mb-6">
                  &quot;{testimonial.review.replace(/{COMPANY_NAME}/g, COMPANY_NAME)}&quot;
                </p>
                <h4 className="font-bold text-slate-900">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LEAD GENERATION FORM ===== */}
        <section id="loanForm" className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          {loanForm}
        </section>

        {/* ===== FAQS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Who can become a partner with Kinetik Capital?",
                a: "Anyone from loan agents, ex-bankers, financial analysts, Insurance agents, mutual fund agents, chartered accountants, builders, or professionals from any other field can become a partner with Kinetik Capital.",
              },
              {
                q: "How to become a DSA Partner with Kinetik Capital?",
                a: "Step 1: Visit the Kinetik Capital website and click on the 'Become a Partner' option. Step 2: Complete the registration form. Step 3: A member of the support team will contact you. Step 4: A Manager will explain the lead generation process. Step 5: An agreement will be signed and you will officially become a DSA Agent.",
              },
              {
                q: "What products does Kinetik Capital offer?",
                a: "We offer a wide range of financial products including Home Loans, Personal Loans, Business Loans, Education Loans, Car Loans, Gold Loans, Credit Cards, and Insurance.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <h3 className="text-2xl font-bold mb-4">{COMPANY_NAME}</h3>
                <p className="text-gray-400 text-sm">
                  India's Leading Loan Distribution Company. Compare and apply for Personal, Home, Business and Car Loans from India's top banks and NBFCs.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Home</a></li>
                  <li><a href="#" className="hover:text-white transition">Loans</a></li>
                  <li><a href="#" className="hover:text-white transition">EMI Calculator</a></li>
                  <li><a href="#" className="hover:text-white transition">Become a Partner</a></li>
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