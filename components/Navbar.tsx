"use client";

import { useState } from "react";

const Menu = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl"></div>

            <h1 className="text-2xl font-bold text-slate-900">
              Kinetik Capital
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">

            <a href="#">Home</a>

            <a href="#">Loans</a>

            <a href="#">Lenders</a>

            <a href="#">EMI Calculator</a>

            <a href="/dsa-registration">
  DSA Registration
</a>

            <a href="#">Contact</a>

          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex gap-3">

            <button className="border border-slate-900 px-4 py-2 rounded-xl">
              Check Eligibility
            </button>

            <button className="bg-green-500 text-white px-5 py-2 rounded-xl">
              Apply Now
            </button>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t">

          <div className="flex flex-col p-4 gap-4">

            <a href="#">Home</a>

            <a href="#">Loans</a>

            <a href="#">Lenders</a>

            <a href="#">EMI Calculator</a>

            <a href="/dsa-registration">
  DSA Registration
</a>

            <a href="#">Contact</a>

            <button className="border border-slate-900 py-2 rounded-xl">
              Check Eligibility
            </button>

            <button className="bg-green-500 text-white py-2 rounded-xl">
              Apply Now
            </button>

          </div>

        </div>
      )}
    </nav>
  );
}