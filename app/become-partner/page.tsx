"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

const COMPANY_NAME = "Kinetik Capital";
const COMPANY_ESTABLISHED = "2024";

// Bank Logos for Marquee
const bankLogos = [
  { initial: "H", color: "from-blue-500 to-blue-700", name: "HDFC Bank" },
  { initial: "I", color: "from-purple-500 to-purple-700", name: "ICICI Bank" },
  { initial: "A", color: "from-red-500 to-red-700", name: "Axis Bank" },
  { initial: "S", color: "from-emerald-500 to-emerald-700", name: "SBI" },
  { initial: "K", color: "from-orange-500 to-orange-700", name: "Kotak Mahindra" },
  { initial: "B", color: "from-yellow-500 to-yellow-700", name: "Bajaj Finserv" },
  { initial: "T", color: "from-cyan-500 to-cyan-700", name: "Tata Capital" },
  { initial: "I", color: "from-indigo-500 to-indigo-700", name: "IDFC First" },
  { initial: "P", color: "from-rose-500 to-rose-700", name: "PNB" },
  { initial: "B", color: "from-amber-500 to-amber-700", name: "Bank of Baroda" },
];

export default function BecomePartnerPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    experience: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      setLoading(false);
      return;
    }

    if (!formData.agree) {
      alert("Please agree to the Terms & Conditions");
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

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        city: "",
        experience: "",
        agree: false,
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
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-4">
                🤝 Join the Network
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Partner with India's Most Trusted <br />
                <span className="text-yellow-300">Loan Distribution Platform</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
                Start your journey as a successful loan distribution partner. Zero investment, unlimited earning potential, and access to 275+ banks & NBFCs.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    document.getElementById("partnerForm")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-yellow-400/30"
                >
                  Register Now
                </button>
                <button
                  onClick={() => {
                    document.getElementById("benefits")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="border-2 border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition backdrop-blur-sm"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATISTICS ===== */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">25+</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Years of Experience</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">275+</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Partner Banks & NBFCs</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">4,000+</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Branches Across India</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">₹1L+ Cr</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Successful Disbursal</p>
            </div>
          </div>
        </section>

        {/* ===== WHO CAN JOIN ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Who Can Become a <span className="text-indigo-600">Partner?</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              This opportunity is open to anyone with a passion for finance and success.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "🏦", title: "Loan Agents" },
              { icon: "👨‍💼", title: "Ex-Bankers" },
              { icon: "📊", title: "Financial Analysts" },
              { icon: "🛡️", title: "Insurance Agents" },
              { icon: "💰", title: "Mutual Fund Agents" },
              { icon: "🧾", title: "Chartered Accountants" },
              { icon: "🏗️", title: "Builders & Developers" },
              { icon: "💼", title: "Business Owners" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
              >
                <div className="text-3xl md:text-4xl mb-2">{item.icon}</div>
                <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BENEFITS ===== */}
        <section id="benefits" className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Why Partner With <span className="text-indigo-600">Us?</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join India's most trusted loan distribution network and unlock a world of opportunities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💰",
                title: "Zero Investment",
                desc: "Start your journey with no upfront cost. Risk-free business model.",
              },
              {
                icon: "⚡",
                title: "Instant Payouts",
                desc: "Get your commissions credited quickly and reliably.",
              },
              {
                icon: "🏦",
                title: "275+ Lenders",
                desc: "Access to India's top banks and NBFCs including HDFC, SBI, ICICI, and more.",
              },
              {
                icon: "🇮🇳",
                title: "Pan India Presence",
                desc: "Operate in 4,000+ cities across India with a wide branch network.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 dark:border-slate-700"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== HOW TO REGISTER ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              How to <span className="text-indigo-600">Register?</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in just a few simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Visit Website",
                desc: "Go to the 'Become a Partner' section on our website.",
              },
              {
                step: "02",
                title: "Fill Registration Form",
                desc: "Enter your name, contact details, and submit the form.",
              },
              {
                step: "03",
                title: "Digital Verification",
                desc: "Complete Aadhaar-based digital verification.",
              },
              {
                step: "04",
                title: "Sign Agreement",
                desc: "Digitally sign the partner agreement and get started.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 dark:border-slate-700 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PARTNER TESTIMONIALS ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              What Our <span className="text-indigo-600">Partners Say</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from real partners who have grown with us.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                role: "Loan Agent, Mumbai",
                quote: "I started my journey with Kinetik Capital and within 6 months, I was earning ₹50,000+ per month. The support and training are excellent.",
              },
              {
                name: "Priya Patel",
                role: "Ex-Banker, Ahmedabad",
                quote: "The best decision I made was to partner with Kinetik Capital. The platform is easy to use and the payouts are always on time.",
              },
              {
                name: "Amit Verma",
                role: "Business Owner, Delhi",
                quote: "Zero investment and unlimited earning potential. I highly recommend Kinetik Capital to anyone looking for a side income.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border border-slate-100 dark:border-slate-700"
              >
                <div className="text-yellow-400 text-xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-4">
                  &quot;{testimonial.quote}&quot;
                </p>
                <h4 className="font-bold text-slate-800 dark:text-white">{testimonial.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== REGISTRATION FORM ===== */}
        <section id="partnerForm" className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 max-w-3xl mx-auto border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Become a <span className="text-indigo-600">Partner</span>
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Fill in your details and start your journey today.
              </p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 mb-6 text-emerald-700 dark:text-emerald-400 text-center">
                ✅ Registration Successful! We'll contact you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setFormData({ ...formData, mobile: val });
                  }}
                  className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                >
                  <option value="">Select City</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <textarea
                  placeholder="Your Experience / Message (Optional)"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="w-5 h-5 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  required
                />
                <label htmlFor="agree" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  I agree to the Terms &amp; Conditions and Privacy Policy of {COMPANY_NAME}.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application →"}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
              By submitting, you agree to our Privacy Policy &amp; Terms of Service.
            </p>
          </div>
        </section>

        {/* ===== PARTNER BANKS MARQUEE ===== */}
        <section className="py-20 overflow-hidden bg-white dark:bg-slate-900">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Our Lending Partners
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Trusted by India&apos;s leading banks and NBFCs.
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[...bankLogos, ...bankLogos].map((bank, index) => (
                <div
                  key={index}
                  className="min-w-48 md:min-w-55 bg-white dark:bg-slate-800 rounded-2xl shadow-md px-6 md:px-8 py-4 md:py-6 text-center border border-slate-100 dark:border-slate-700 flex flex-col items-center"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${bank.color} flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-md`}>
                    {bank.initial}
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white mt-2 text-sm md:text-base">{bank.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Frequently Asked <span className="text-indigo-600">Questions</span>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Who can become a partner with Kinetik Capital?",
                a: "Anyone from loan agents, ex-bankers, financial analysts, insurance agents, mutual fund agents, chartered accountants, builders, or professionals from any other field can become a partner.",
              },
              {
                q: "How to become a DSA Partner with Kinetik Capital?",
                a: "Step 1: Visit our website and click on the 'Become a Partner' option. Step 2: Complete the registration form. Step 3: A member of our support team will contact you. Step 4: An agreement will be signed and you will officially become a partner.",
              },
              {
                q: "What products does Kinetik Capital offer?",
                a: "We offer a wide range of financial products including Personal Loans, Home Loans, Business Loans, Education Loans, Car Loans, Gold Loans, Credit Cards, and Insurance.",
              },
              {
                q: "Is there any investment required to become a partner?",
                a: "No, there is zero investment required to become a partner with Kinetik Capital. You can start your journey with no upfront cost.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{faq.a}</p>
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
                  <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link href="/become-partner" className="hover:text-white transition">Become a Partner</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
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
              <p>© {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      <Chatbot />
    </>
  );
}