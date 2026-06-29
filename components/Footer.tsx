import Link from "next/link";

const COMPANY_NAME = "Kinetik Capital";

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">{COMPANY_NAME}</h3>
            <p className="text-gray-400 text-sm">
              One Fintech for all Banking and Finance Services. Compare and apply for Personal, Home, Business and Car Loans.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Loans</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/loans/personal-loan" className="hover:text-white transition">Personal Loan</Link></li>
              <li><Link href="/loans/home-loan" className="hover:text-white transition">Home Loan</Link></li>
              <li><Link href="/loans/business-loan" className="hover:text-white transition">Business Loan</Link></li>
              <li><Link href="/loans/car-loan" className="hover:text-white transition">Car Loan</Link></li>
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
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}