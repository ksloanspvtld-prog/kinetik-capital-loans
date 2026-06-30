"use client";

import Link from "next/link";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

const COMPANY_NAME = "Kinetik Capital";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Dropdown items
  const productItems = [
    { name: "Personal Loan", href: "/loans/personal-loan" },
    { name: "Home Loan", href: "/loans/home-loan" },
    { name: "Business Loan", href: "/loans/business-loan" },
    { name: "Car Loan", href: "/loans/car-loan" },
    { name: "Education Loan", href: "/#loanForm" },
    { name: "Gold Loan", href: "/#loanForm" },
    { name: "Loan Against Property", href: "/#loanForm" },
  ];

  const toolsItems = [
    { name: "EMI Calculator", href: "/#emi-calculator" },
    { name: "Eligibility Calculator", href: "/#eligibility-calculator" },
    { name: "Prepayment Calculator", href: "/#prepayment-calculator" },
    { name: "FD Calculator", href: "/#fd-calculator" },
  ];

  const cibilItems = [
    { name: "Free CIBIL Check", href: "/#cibil-check" },
    { name: "CIBIL Report", href: "/#cibil-report" },
    { name: "Improve CIBIL Score", href: "/#improve-cibil" },
  ];

  const creditCardItems = [
    { name: "Best Credit Cards", href: "/#credit-cards" },
    { name: "Apply for Credit Card", href: "/#credit-card-apply" },
    { name: "Credit Card Comparison", href: "/#credit-card-compare" },
  ];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            >
              <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
              <text
                x="20"
                y="27"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="22"
                fontWeight="900"
                fill="white"
                letterSpacing="1"
                className="drop-shadow-sm"
              >
                K
              </text>
              <rect x="11" y="32" width="18" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="60%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {COMPANY_NAME}
              </h1>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wider uppercase">
                Loans Made Easy
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5">
            {/* Home */}
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm">
              Home
            </Link>

            {/* Products & Offers */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("products")}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm flex items-center gap-1"
              >
                Products & Offers
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === "products" && (
                <div className="absolute top-8 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-3 min-w-[200px] border border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-1">
                  {productItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition text-slate-700 dark:text-slate-300 text-sm"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools & Calculators */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("tools")}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm flex items-center gap-1"
              >
                Tools & Calculators
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === "tools" && (
                <div className="absolute top-8 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-3 min-w-[200px] border border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-1">
                  {toolsItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition text-slate-700 dark:text-slate-300 text-sm"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* CIBIL Score */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("cibil")}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm flex items-center gap-1"
              >
                CIBIL Score
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === "cibil" && (
                <div className="absolute top-8 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-3 min-w-[200px] border border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-1">
                  {cibilItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition text-slate-700 dark:text-slate-300 text-sm"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Credit Cards */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("creditcards")}
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm flex items-center gap-1"
              >
                Credit Cards
                <span className="text-xs">▼</span>
              </button>
              {openDropdown === "creditcards" && (
                <div className="absolute top-8 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-3 min-w-[200px] border border-slate-100 dark:border-slate-700 grid grid-cols-1 gap-1">
                  {creditCardItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition text-slate-700 dark:text-slate-300 text-sm"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Become a Partner */}
            <Link
              href="/#become-partner"
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition font-medium text-sm"
            >
              Become a Partner
            </Link>

            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm">
              About
            </Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm">
              Blog
            </Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-sm">
              Contact
            </Link>

            <DarkModeToggle />

            <Link
              href="/#loanForm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition font-medium text-sm"
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
          <Link
            href="/"
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {/* Products & Offers */}
          <div className="space-y-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Products & Offers
            </p>
            {productItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Tools & Calculators */}
          <div className="space-y-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Tools & Calculators
            </p>
            {toolsItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CIBIL Score */}
          <div className="space-y-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              CIBIL Score
            </p>
            {cibilItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Credit Cards */}
          <div className="space-y-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Credit Cards
            </p>
            {creditCardItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <Link
            href="/#become-partner"
            className="block py-2 text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Become a Partner
          </Link>

          <Link
            href="/about"
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/blog"
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition font-medium"
            onClick={() => setIsOpen(false)}
          >
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