"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add your contact form API logic here
    alert("✅ Message Sent Successfully!");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white text-center mb-4">
            Contact <span className="text-indigo-600">Us</span>
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Get in Touch</h3>
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <span>Maharashtra, India</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <span>+91 9765435411</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-2xl">✉️</span>
                    <span>info@kinetikcapital.com</span>
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Working Hours</h3>
                <div className="space-y-2 text-slate-600 dark:text-slate-400">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}