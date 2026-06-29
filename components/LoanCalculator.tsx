"use client";

import { useState } from "react";

interface LoanCalculatorProps {
  type?: "emi" | "eligibility";
}

export default function LoanCalculator({ type = "emi" }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [monthlyIncome, setMonthlyIncome] = useState(50000);

  // EMI Calculation
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  // Eligibility Calculation (35% of monthly income)
  const maxEligibleEMI = monthlyIncome * 0.35;
  const maxEligibleLoan = (maxEligibleEMI * (Math.pow(1 + monthlyRate, months) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, months));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 md:p-8">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {type === "emi" ? "EMI Calculator" : "Eligibility Calculator"}
      </h3>

      <div className="space-y-4">
        {type === "emi" ? (
          <>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Loan Amount</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{loanAmount.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Interest Rate</span>
                <span className="text-indigo-600 dark:text-indigo-400">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Tenure</span>
                <span className="text-indigo-600 dark:text-indigo-400">{tenure} Years</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Monthly Income</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{monthlyIncome.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Interest Rate</span>
                <span className="text-indigo-600 dark:text-indigo-400">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Tenure</span>
                <span className="text-indigo-600 dark:text-indigo-400">{tenure} Years</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </>
        )}
      </div>

      {/* Results */}
      <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl">
        {type === "emi" ? (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monthly EMI</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ₹{Math.round(emi).toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Interest</p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                  ₹{Math.round(totalInterest).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Payment</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{Math.round(totalPayment).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400">Maximum Loan You Can Get</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ₹{Math.round(maxEligibleLoan).toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Based on 35% of your monthly income
            </p>
          </>
        )}
      </div>
    </div>
  );
}