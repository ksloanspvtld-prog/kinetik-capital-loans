import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import LoanCalculator from "../../../components/LoanCalculator";

const COMPANY_NAME = "Kinetik Capital";

export default function PersonalLoanPage() {
  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Personal <span className="text-indigo-600">Loan</span>
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                Get instant personal loans up to ₹40 Lakhs at attractive interest rates starting from 10.99% p.a.
              </p>
              <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>Loan amounts up to ₹40 Lakhs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>Interest rates from 10.99% p.a.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>Disbursal within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-0.5">✓</span>
                  <span>No collateral required</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  document.getElementById("loanForm")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl transition font-medium"
              >
                Apply Now
              </button>
            </div>
            <div>
              <LoanCalculator type="emi" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}