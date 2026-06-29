"use client";

import { useState, FormEvent } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import LoanCalculator from "../../../components/LoanCalculator";
import AddressInput from "../../../components/AddressInput";

const COMPANY_NAME = "Kinetik Capital";
const LOAN_TYPE = "Car Loan";

export default function CarLoanPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    loanType: LOAN_TYPE,
    monthlyIncome: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddressChange = (data: { city: string; state: string; pincode: string }) => {
    setFormData((prev) => ({
      ...prev,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    }));
  };

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

      setSubmitted(true);
      setFormData({
        fullName: "",
        mobile: "",
        city: "",
        state: "",
        loanType: LOAN_TYPE,
        monthlyIncome: "",
        pincode: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Info & Form */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Car <span className="text-indigo-600">Loan</span>
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                Finance your dream car with easy car loans. Quick processing and high approval rates.
              </p>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>Up to 100% financing on cars</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>Quick processing within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>High approval rate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>Flexible repayment tenure up to 7 years</span>
                </li>
              </ul>

              {/* ✅ Form with AddressInput */}
              <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Apply for {LOAN_TYPE}
                </h3>
                {submitted && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl p-3 mb-4 text-emerald-700 dark:text-emerald-400 text-sm">
                    ✅ Application submitted successfully! We&apos;ll contact you soon.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
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
                    className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                    required
                  />

                  {/* ✅ Address Input with State, City, Pincode */}
                  <AddressInput
                    value={{
                      city: formData.city,
                      state: formData.state,
                      pincode: formData.pincode,
                    }}
                    onChange={handleAddressChange}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Monthly Income"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Apply Now"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Calculator */}
            <div>
              <LoanCalculator type="emi" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}