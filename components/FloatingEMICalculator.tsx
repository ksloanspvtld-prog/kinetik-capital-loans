"use client";

import { useState } from "react";
import { X, Calculator, IndianRupee } from "lucide-react";

export default function FloatingEMICalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(5);

  // EMI Calculation
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Open EMI Calculator"
      >
        <Calculator className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  EMI Calculator
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Calculate your monthly instalments
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Result Box */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 mb-6 text-center shadow-lg shadow-indigo-500/30">
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Your Monthly EMI
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white mt-1">
                {formatCurrency(emi)}
              </p>
              <div className="flex justify-center gap-6 mt-3 text-xs text-white/70">
                <span>Total: {formatCurrency(totalPayment)}</span>
                <span>Interest: {formatCurrency(totalInterest)}</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
              {/* Loan Amount */}
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Loan Amount</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full mt-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>₹50K</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Interest Rate</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full mt-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>5%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span>Loan Tenure</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {tenure} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full mt-1 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                document.getElementById("loanForm")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/40 text-sm"
            >
              Apply for Loan →
            </button>
          </div>
        </div>
      )}
    </>
  );
}