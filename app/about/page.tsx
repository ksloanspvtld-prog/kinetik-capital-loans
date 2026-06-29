"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";

// ✅ Company Name - येथे बदला
const COMPANY_NAME = "Kinetik Capital";
const COMPANY_FOUNDER = "Kundan Sadaphule";
const COMPANY_ESTABLISHED = "2024";
const COMPANY_HEADQUARTERS = "Maharashtra, India";

export default function AboutPage() {
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
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                About {COMPANY_NAME}
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
                India's Leading Loan Distribution Company. We Facilitate Wide Range of Financial Products That Suits Your Customer's Needs!
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-8 py-3 rounded-xl transition shadow-lg hover:shadow-yellow-400/30"
                >
                  Get in Touch
                </button>
                <Link
                  href="/"
                  className="border-2 border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition backdrop-blur-sm"
                >
                  Apply for Loan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATISTICS ===== */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">25+</p>
              <p className="text-sm text-slate-500 mt-1">Years of Experience</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">275+</p>
              <p className="text-sm text-slate-500 mt-1">Partner Banks & NBFCs</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">4,000+</p>
              <p className="text-sm text-slate-500 mt-1">Branches Across India</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition hover:-translate-y-1">
              <p className="text-3xl font-bold text-indigo-600">₹1,00,000 Cr+</p>
              <p className="text-sm text-slate-500 mt-1">Successful Disbursal</p>
            </div>
          </div>
        </section>

        {/* ===== ABOUT US ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Who We Are
              </h2>
              <div className="w-20 h-1 bg-indigo-600 rounded-full mt-4"></div>
              <p className="mt-6 text-slate-600 leading-relaxed">
                {COMPANY_NAME} is India's most trusted and leading financial distribution company guided by our motto <strong>"Saath Chalenge, Aage Badhenge."</strong> ISO/IEC 27001:2022 certified, we are committed to delivering delight to all our stakeholders - be it customers, partners, employees, or associates.[reference:0]
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                With a beginning in {COMPANY_ESTABLISHED}, we have been at the forefront of the financial services industry. Today, we operate in 4,000+ cities across India through a wide branch network, with 275+ partner banks and NBFCs.[reference:1][reference:2]
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">350K+</p>
                  <p className="text-xs text-slate-500">Distributor Partners</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">4,000+</p>
                  <p className="text-xs text-slate-500">Cities Covered</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-3xl h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-4">🏦</div>
                <p className="text-slate-500 font-medium">{COMPANY_NAME}</p>
                <p className="text-sm text-slate-400">Since {COMPANY_ESTABLISHED}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MISSION & VISION ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-slate-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-slate-800">Our Mission</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                To democratize access to financial products and services across India by building a robust network of trusted partners, leveraging technology, and providing transparent, customer-centric solutions that empower individuals and businesses to achieve their financial goals.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-slate-100">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-slate-800">Our Vision</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">
                To be India's most preferred loan distribution platform, creating a sustainable ecosystem where partners thrive, customers succeed, and financial inclusion becomes a reality for every Indian. We envision a future where accessing the right financial product is seamless, transparent, and empowering for all.[reference:3]
              </p>
            </div>
          </div>
        </section>

        {/* ===== CORE VALUES ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Core Values
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at {COMPANY_NAME}.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🤝", title: "Integrity", desc: "We operate with honesty, transparency, and ethical practices in all our dealings." },
              { icon: "💡", title: "Innovation", desc: "We embrace technology and innovative solutions to serve our partners and customers better." },
              { icon: "❤️", title: "Customer First", desc: "Our customers and partners are at the heart of everything we do. Their success is our success." },
              { icon: "⭐", title: "Excellence", desc: "We strive for excellence in service, quality, and delivery across all our operations." },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-800">{value.title}</h3>
                <p className="mt-3 text-sm text-slate-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LEADERSHIP TEAM ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Leadership Team
            </h2>
            <p className="mt-4 text-gray-600">
              Meet the visionaries behind {COMPANY_NAME}.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: COMPANY_FOUNDER,
                role: "Founder & CEO",
                desc: "With a vision to revolutionize loan distribution in India, {founder} founded {company} with a mission to make financial products accessible to every Indian.",
                initial: COMPANY_FOUNDER.charAt(0),
              },
              {
                name: "Priya Patel",
                role: "Chief Operating Officer",
                desc: "A seasoned professional with over 15 years of experience in banking and financial services, leading our operations and partner network.",
                initial: "P",
              },
              {
                name: "Amit Sharma",
                role: "Chief Technology Officer",
                desc: "Driving digital innovation at {company}, Amit leads the development of cutting-edge technology solutions for our partners and customers.",
                initial: "A",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100 text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30">
                  {member.initial}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">{member.name}</h3>
                <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
                <p className="mt-3 text-sm text-slate-500">
                  {member.desc
                    .replace(/{founder}/g, COMPANY_FOUNDER)
                    .replace(/{company}/g, COMPANY_NAME)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== MILESTONES ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Journey
            </h2>
            <p className="mt-4 text-gray-600">
              Milestones that define our growth story.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-indigo-200 h-full hidden md:block"></div>
            <div className="space-y-8">
              {[
                { year: COMPANY_ESTABLISHED, title: "The Beginning", desc: `${COMPANY_NAME} was founded with a vision to simplify loan distribution in India.` },
                { year: "2024", title: "First Milestone", desc: "Successfully facilitated over ₹1,000 Cr in loans and partnered with 50+ banks." },
                { year: "2025", title: "Expansion", desc: "Expanded operations to 4,000+ cities and partnered with 275+ banks and NBFCs.[reference:4]" },
                { year: "2026", title: "Digital Transformation", desc: "Launched our digital platform to empower partners with cutting-edge technology tools." },
              ].map((milestone, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-6 md:gap-10`}
                >
                  <div className="flex-1 text-center md:text-right">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition">
                      <p className="text-2xl font-bold text-indigo-600">{milestone.year}</p>
                      <h4 className="text-lg font-bold text-slate-800">{milestone.title}</h4>
                      <p className="text-sm text-slate-500 mt-2">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/30 z-10">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE US ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-slate-50 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose {COMPANY_NAME}?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              What makes us India's most trusted financial distribution partner.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏦", title: "275+ Lenders", desc: "Access to India's top banks and NBFCs including HDFC, ICICI, SBI, and more.[reference:5]" },
              { icon: "📱", title: "Digital Platform", desc: "Powerful digital tools like our partner app for lead management and tracking.[reference:6]" },
              { icon: "🤝", title: "Strong Support", desc: "Dedicated backend support and timely payouts for our partners.[reference:7]" },
              { icon: "🇮🇳", title: "Pan India Presence", desc: "Operating in 4,000+ cities across India through a wide branch network.[reference:8]" },
              { icon: "💰", title: "High Earnings", desc: "Risk-free, high-gain business model with multiple revenue streams.[reference:9]" },
              { icon: "⭐", title: "Trusted Brand", desc: "ISO/IEC 27001:2022 certified and India's most trusted financial distributor.[reference:10]" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-slate-100"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CALL TO ACTION ===== */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Grow with {COMPANY_NAME}?
            </h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Join India's most trusted loan distribution network. Become a partner and start your journey today!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition"
              >
                Apply for Loan
              </Link>
              <button
                onClick={() => {
                  document.getElementById("loanForm")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="border-2 border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition backdrop-blur-sm"
              >
                Become a Partner
              </button>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white mt-20">
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
                  <li><Link href="/" className="hover:text-white transition">Loans</Link></li>
                  <li><Link href="/" className="hover:text-white transition">EMI Calculator</Link></li>
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
                  <li>📍 {COMPANY_HEADQUARTERS}</li>
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