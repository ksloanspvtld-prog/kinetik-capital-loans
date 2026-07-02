"use client";

import Link from "next/link";

const COMPANY_NAME = "Kinetik Capital";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-2">{COMPANY_NAME}</h3>
            <p className="text-sm text-indigo-400 font-medium tracking-wider uppercase">
              Loans Made Easy
            </p>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Compare and apply for Personal, Home, Business and Car Loans from India&apos;s top banks and NBFCs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#loanForm" className="hover:text-white transition duration-200">
                  Loans
                </Link>
              </li>
              <li>
                <Link href="/#emi-calculator" className="hover:text-white transition duration-200">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/become-partner" className="hover:text-white transition duration-200">
                  DSA Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-200">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition duration-200">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">📞</span>
                <span>+91 9765435411</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">✉️</span>
                <span>info@kinetikcapital.com</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400">📍</span>
                <span>Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Media Links */}
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-200 text-sm"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-200 text-sm"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition duration-200 text-sm"
              >
                LinkedIn
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-right">
              &copy; {currentYear} {COMPANY_NAME}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}