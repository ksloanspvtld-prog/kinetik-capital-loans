"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";
import Chatbot from "../../components/Chatbot";

const COMPANY_NAME = "Kinetik Capital";

export default function BecomePartnerPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    experience: "",
    partnerType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("✅ Partner Registration Successful! We'll contact you soon.");
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        city: "",
        experience: "",
        partnerType: "",
      });
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
      <main className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-20 md:py-28">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Become a <span className="text-yellow-300">Partner</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              Join India's most trusted loan distribution platform and unlock a world of opportunities.
              Start your journey towards financial independence today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✓ Earn High Commissions
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✓ 50+ Lending Partners
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ✓ Dedicated Support
              </span>
            </div>
          </div>
        </section>

        {/* ===== WHY PARTNER WITH US ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Partner With <span className="text-indigo-600">{COMPANY_NAME}</span>?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Unlock a world of opportunities with India's most trusted loan distribution platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🏦",
                title: "50+ Lending Partners",
                desc: "Access to India's top banks and NBFCs including HDFC, ICICI, SBI, and more.",
              },
              {
                icon: "💰",
                title: "High Earnings",
                desc: "Risk-free, high-gain business model with multiple revenue streams.",
              },
              {
                icon: "🤝",
                title: "Strong Support",
                desc: "Dedicated backend support, training, and timely payouts.",
              },
              {
                icon: "📱",
                title: "Digital Platform",
                desc: "Powerful partner dashboard for lead management and tracking.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-slate-100 text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== WHO CAN BECOME A PARTNER ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-white rounded-3xl shadow-sm">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Who Can Become a <span className="text-indigo-600">Partner</span>?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {COMPANY_NAME} welcomes individuals and organizations from diverse backgrounds.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "Loan Agent",
              "Ex-Banker",
              "Chartered Accountant (C.A.)",
              "Mutual Fund Agent",
              "Builder or Developer",
              "Insurance Agent",
              "Real Estate Agent",
              "Freelancer",
            ].map((role, index) => (
              <div
                key={index}
                className="bg-indigo-50 rounded-2xl p-4 text-center hover:bg-indigo-100 transition border border-indigo-100"
              >
                <span className="text-sm font-medium text-slate-700">{role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              How It <span className="text-indigo-600">Works</span>
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Get started in 4 simple steps and start earning.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Register",
                desc: "Fill out the registration form with your details.",
              },
              {
                step: "2",
                title: "Verify KYC",
                desc: "Submit your PAN, Aadhaar, or GST certificate.",
              },
              {
                step: "3",
                title: "Sign Agreement",
                desc: "Digitally sign the DSA partner agreement.",
              },
              {
                step: "4",
                title: "Start Earning",
                desc: "Refer loans and earn commissions instantly.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition duration-300 border border-slate-100 text-center relative"
              >
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== REGISTRATION FORM ===== */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-100 p-8 md:p-12">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold tracking-wider uppercase mb-3">
                Start Your Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Register as a <span className="text-indigo-600">Partner</span>
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Fill in your details and our team will get in touch with you within 48 working hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Mobile Number *</label>
                <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition">
                  <div className="flex items-center gap-1 px-3 bg-slate-50 border-r border-slate-200">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-sm font-medium text-slate-700">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10 digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setFormData({ ...formData, mobile: val });
                    }}
                    className="flex-1 p-3 outline-none bg-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="">Select your city</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="pune">Pune</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="chennai">Chennai</option>
                  <option value="ahmedabad">Ahmedabad</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">I want to become a</label>
                <select
                  value={formData.partnerType}
                  onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="">Select partner type</option>
                  <option value="individual">Individual DSA</option>
                  <option value="firm">Firm / Company</option>
                  <option value="corporate">Corporate Partner</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-1">Your Experience / Message</label>
                <textarea
                  placeholder="Tell us about your experience in the financial or loan industry (optional)"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={4}
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agree"
                    required
                    className="w-4 h-4 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-xs text-slate-500 leading-relaxed">
                    I agree to the Terms and Conditions of {COMPANY_NAME} Private Limited and confirm that the information provided is accurate.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40 disabled:opacity-50 text-lg"
              >
                {loading ? "Submitting..." : "Submit Application →"}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-6">
              By submitting, you agree to our Terms &amp; Privacy Policy. We'll contact you within 48 working hours.
            </p>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white mt-10">
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
                  <li><a href="/" className="hover:text-white transition">Home</a></li>
                  <li><a href="/become-partner" className="hover:text-white transition">Become a Partner</a></li>
                  <li><a href="/#loanForm" className="hover:text-white transition">Apply for Loan</a></li>
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
              <p>© {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </main>
      <Chatbot />
    </>
  );
}