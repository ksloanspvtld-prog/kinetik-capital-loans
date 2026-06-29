"use client";

import Link from "next/link";
import { useState } from "react";

const COMPANY_NAME = "Kinetik Capital";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">Kinetik</span>
            <span className="text-xl font-bold text-slate-800">Capital</span>
          </Link>

          {/* ✅ Desktop Menu - About Us add केला */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-indigo-600 transition font-medium">
              Home
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-indigo-600 transition font-medium">
              About Us
            </Link>
            <Link
              href="/#loanForm"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-slate-600 hover:text-indigo-600 transition"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu - About Us add केला */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-3">
          <Link
            href="/"
            className="block py-2 text-slate-600 hover:text-indigo-600 transition font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-slate-600 hover:text-indigo-600 transition font-medium"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/#loanForm"
            className="block py-2 text-indigo-600 font-medium hover:text-indigo-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Apply Now
          </Link>
        </div>
      )}
    </nav>
  );
}