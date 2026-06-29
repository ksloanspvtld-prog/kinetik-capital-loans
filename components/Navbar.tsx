"use client";

import Link from "next/link";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

const COMPANY_NAME = "Kinetik Capital";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoanMenuOpen, setIsLoanMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Kinetik</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Capital</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
              Home
            </Link>

            {/* Mega Menu - Loans Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsLoanMenuOpen(!isLoanMenuOpen)}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium flex items-center gap-1"
              >
                Loans
                <span className="text-xs">▼</span>
              </button>
              {isLoanMenuOpen && (
                <div className="absolute top-8 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 min-w-[200px] border border-slate-100 dark:border-slate-700">
                  <Link href="/loans/personal-loan" className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition">
                    Personal Loan
                  </Link>
                  <Link href="/loans/home-loan" className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition">
                    Home Loan
                  </Link>
                  <Link href="/loans/business-loan" className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition">
                    Business Loan
                  </Link>
                  <Link href="/loans/car-loan" className="block px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition">
                    Car Loan
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
              About
            </Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
              Blog
            </Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">
              Contact
            </Link>

            <DarkModeToggle />

            <Link
              href="/#loanForm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition font-medium"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-2xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <Link href="/" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/loans/personal-loan" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Personal Loan
          </Link>
          <Link href="/loans/home-loan" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Home Loan
          </Link>
          <Link href="/loans/business-loan" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Business Loan
          </Link>
          <Link href="/loans/car-loan" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Car Loan
          </Link>
          <Link href="/about" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/blog" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Blog
          </Link>
          <Link href="/contact" className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium" onClick={() => setIsOpen(false)}>
            Contact
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