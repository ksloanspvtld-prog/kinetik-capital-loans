"use client";

import { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";

import WhatsAppButton from "../components/WhatsAppButton";

export default function Home() {

const [formData, setFormData] = useState({
  fullName: "",
  mobile: "",
  city: "",
  state: "",
  loanType: "",
  monthlyIncome: "",
});

const [loading, setLoading] = useState(false);

const handleSubmit = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    alert("Lead Submitted Successfully");

    setFormData({
      fullName: "",
      mobile: "",
      city: "",
      state: "",
      loanType: "",
      monthlyIncome: "",
    });
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);

  const [sortOrder, setSortOrder] = useState("low");
  const [mobile, setMobile] = useState("");

  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;

  const emi =
    (loanAmount *
      monthlyRate *
      Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                Compare Loan Offers from Top Banks & NBFCs
              </h1>

              <p className="mt-6 text-lg text-gray-600">
                Get the best Personal, Home, Business and Car Loan offers
                from trusted banks and financial institutions.
              </p>

              <div className="mt-8 flex gap-4">
                <button className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition">
                  Apply Now
                </button>

                <button className="border border-slate-900 px-6 py-3 rounded-xl hover:bg-slate-50 transition">
                  Check Eligibility
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap gap-3">
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                  ✓ Secure Process
                </div>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                  ✓ Trusted Lenders
                </div>

                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                  ✓ Fast Approval
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="bg-slate-100 rounded-3xl h-87.5 flex items-center justify-center">
              Finance Illustration
            </div>
          </div>
        </section>

        {/* Statistics Section */}
       
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-green-500">
                ₹5000Cr+
              </h3>
              <p className="text-gray-600">Loans Facilitated</p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-green-500">50+</h3>
              <p className="text-gray-600">Lending Partners</p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-green-500">2L+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-green-500">98%</h3>
              <p className="text-gray-600">Approval Assistance</p>
            </div>
          </div>
        </section>
{/* Loan Categories Section */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-slate-900">
      Explore Loan Categories
    </h2>

    <p className="mt-4 text-gray-600">
      Find the right loan for your financial needs.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">
      <div className="text-5xl mb-4">💳</div>
      <h3 className="text-2xl font-bold">Personal Loan</h3>
      <p className="mt-4 text-gray-600">
        Compare loan offers from India&apos;s leading banks and NBFCs.
      </p>
      <ul className="mt-4 text-sm space-y-2">
        <li>✔ Starting from 10.5% p.a.</li>
        <li>✔ Instant Approval</li>
      </ul>
      <button className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl">
        Apply Now
      </button>
    </div>

    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">
      <div className="text-5xl mb-4">🏠</div>
      <h3 className="text-2xl font-bold">Home Loan</h3>
      <p className="mt-3 text-gray-600">
        Low interest and long tenure options.
      </p>
      <ul className="mt-4 text-sm space-y-2">
        <li>✔ Low Interest Rates</li>
        <li>✔ Up to 30 Years Tenure</li>
      </ul>
      <button className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl">
        Apply Now
      </button>
    </div>

    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">
      <div className="text-5xl mb-4">🏢</div>
      <h3 className="text-2xl font-bold">Business Loan</h3>
      <p className="mt-3 text-gray-600">
        Fast funding for business growth.
      </p>
      <ul className="mt-4 text-sm space-y-2">
        <li>✔ Fast Funding</li>
        <li>✔ Flexible Repayment</li>
      </ul>
      <button className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl">
        Apply Now
      </button>
    </div>

    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">
      <div className="text-5xl mb-4">🚗</div>
      <h3 className="text-2xl font-bold">Car Loan</h3>
      <p className="mt-3 text-gray-600">
        Finance your dream car easily.
      </p>
      <ul className="mt-4 text-sm space-y-2">
        <li>✔ Quick Processing</li>
        <li>✔ High Approval Rate</li>
      </ul>
      <button className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl">
        Apply Now
      </button>
    </div>

  </div>
</section>

{/* Top Lenders Section */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-slate-900">
      Top Lending Partners
    </h2>

    <p className="mt-4 text-gray-600">
      Compare loan offers from India&apos;s leading banks and NBFCs.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

    {[
      "HDFC Bank",
      "ICICI Bank",
      "Axis Bank",
      "SBI",
      "Kotak Mahindra",
      "Bajaj Finserv",
      "Tata Capital",
      "IDFC First Bank",
    ].map((bank) => (
      <div
        key={bank}
        className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
      >
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-xl font-bold">
          🏦
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-900">
          {bank}
        </h3>

        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <p>Interest Rate: 10.50% p.a.</p>
          <p>Processing Fee: Up to 2%</p>
          <p>Loan Amount: ₹50L</p>
          <p>Tenure: Up to 7 Years</p>
        </div>

        <div className="mt-3 text-yellow-500">
          ★★★★★
        </div>

        <button className="mt-5 w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition">
          Apply Now
        </button>
      </div>
    ))}

  </div>
</section>

{/* Search & Filter Section */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
      Find Your Best Loan Offer
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">

      <input
        type="text"
        placeholder="Search lender or loan type"
        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
      />

      <select className="border rounded-xl px-4 py-3">
        <option>Loan Type</option>
        <option>Personal Loan</option>
        <option>Home Loan</option>
        <option>Business Loan</option>
        <option>Car Loan</option>
      </select>

      <select className="border rounded-xl px-4 py-3">
        <option>Interest Rate</option>
        <option>Below 10%</option>
        <option>10% - 12%</option>
        <option>12% - 15%</option>
      </select>

      <select className="border rounded-xl px-4 py-3">
        <option>Loan Amount</option>
        <option>₹1L - ₹5L</option>
        <option>₹5L - ₹20L</option>
        <option>₹20L+</option>
      </select>

      <select className="border rounded-xl px-4 py-3">
        <option>Tenure</option>
        <option>1-3 Years</option>
        <option>3-5 Years</option>
        <option>5+ Years</option>
      </select>

      <button className="bg-green-500 text-white rounded-xl px-6 py-3 hover:bg-green-600 transition">
        Search
      </button>

    </div>
  </div>
</section>

{/* EMI Calculator */}
<section className="max-w-7xl mx-auto px-6 py-20">

  <div className="bg-white rounded-3xl shadow-xl p-8">

    <h2 className="text-4xl font-bold text-center text-slate-900 mb-10">
      EMI Calculator
    </h2>

    <div className="grid md:grid-cols-2 gap-10">

      <div>

        <label className="font-semibold">
          Loan Amount: ₹{loanAmount.toLocaleString()}
        </label>

        <input
          type="range"
          min="100000"
          max="5000000"
          step="50000"
          value={loanAmount}
          onChange={(e) =>
            setLoanAmount(Number(e.target.value))
          }
          className="w-full mt-3"
        />

        <div className="mt-8">

          <label className="font-semibold">
            Interest Rate: {interestRate}%
          </label>

          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={interestRate}
            onChange={(e) =>
              setInterestRate(Number(e.target.value))
            }
            className="w-full mt-3"
          />

        </div>

        <div className="mt-8">

          <label className="font-semibold">
            Tenure: {tenure} Years
          </label>

          <input
            type="range"
            min="1"
            max="30"
            value={tenure}
            onChange={(e) =>
              setTenure(Number(e.target.value))
            }
            className="w-full mt-3"
          />

        </div>

      </div>

      <div className="bg-slate-50 rounded-3xl p-8">

        <div className="mb-8">
          <p className="text-gray-400">
            Compare and apply for Personal, Home, Business and Car Loans from India&apos;s top banks and NBFCs.
          </p>

          <h3 className="text-4xl font-bold text-green-600">
            ₹{Math.round(emi).toLocaleString()}
          </h3>
        </div>

        <div className="mb-8">
          <p className="text-gray-400">
            Compare and apply for Personal, Home, Business and Car Loans from India&apos;s top banks and NBFCs.
          </p>

          <h3 className="text-2xl font-bold">
            ₹{Math.round(totalInterest).toLocaleString()}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">
            Total Payment
          </p>

          <h3 className="text-2xl font-bold">
            ₹{Math.round(totalPayment).toLocaleString()}
          </h3>
        </div>

      </div>

    </div>

  </div>

</section>

{/* Loan Comparison Table */}
<section className="max-w-7xl mx-auto px-6 py-20">

  <div className="text-center mb-10">
    <h2 className="text-4xl font-bold text-slate-900">
      Compare Loan Offers
    </h2>

    <p className="mt-3 text-gray-600">
      Compare interest rates, fees, approval time and loan amounts from top lenders.
    </p>
  </div>

  <div className="flex justify-end mb-4">
    <select
      className="border rounded-xl px-4 py-2"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="low">Interest Rate: Low to High</option>
      <option value="high">Interest Rate: High to Low</option>
    </select>
  </div>

  <div className="overflow-x-auto bg-white rounded-3xl shadow-xl border border-gray-100">

    <table className="w-full min-w-225">

      <thead className="bg-slate-900 text-white">

        <tr>
          <th className="p-4 text-left">Bank</th>
          <th className="p-4 text-left">Interest Rate</th>
          <th className="p-4 text-left">Processing Fee</th>
          <th className="p-4 text-left">Max Loan Amount</th>
          <th className="p-4 text-left">Tenure</th>
          <th className="p-4 text-left">Approval Time</th>
          <th className="p-4 text-center">Action</th>
        </tr>

      </thead>

      <tbody>

        {[
          {
            bank: "HDFC Bank",
            rate: "10.50%",
            fee: "2%",
            amount: "₹50L",
            tenure: "7 Years",
            approval: "24 Hours",
          },
          {
            bank: "ICICI Bank",
            rate: "10.75%",
            fee: "1.5%",
            amount: "₹40L",
            tenure: "7 Years",
            approval: "48 Hours",
          },
          {
            bank: "Axis Bank",
            rate: "10.99%",
            fee: "2%",
            amount: "₹35L",
            tenure: "5 Years",
            approval: "24 Hours",
          },
          {
            bank: "SBI",
            rate: "9.90%",
            fee: "1%",
            amount: "₹30L",
            tenure: "6 Years",
            approval: "72 Hours",
          },
          {
            bank: "Kotak Mahindra",
            rate: "10.25%",
            fee: "2%",
            amount: "₹45L",
            tenure: "7 Years",
            approval: "48 Hours",
          },
        ].map((loan, index) => (
          <tr
            key={index}
            className="border-b hover:bg-slate-50 transition"
          >
            <td className="p-4 font-semibold">
              {loan.bank}
            </td>

            <td className="p-4">
              {loan.rate}
            </td>

            <td className="p-4">
              {loan.fee}
            </td>

            <td className="p-4">
              {loan.amount}
            </td>

            <td className="p-4">
              {loan.tenure}
            </td>

            <td className="p-4">
              {loan.approval}
            </td>

            <td className="p-4 text-center">
              <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition">
                Apply
              </button>
            </td>
          </tr>
        ))}

      </tbody>

    </table>

  </div>

</section>

{/* Why Choose Us Section */}
<section className="max-w-7xl mx-auto px-6 py-20">

  <div className="text-center mb-14">
    <h2 className="text-4xl font-bold text-slate-900">
      Why Choose Kinetik Capital?
    </h2>


    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
      We help you compare, choose and apply for the best loan offers from trusted banks and NBFCs.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* Card 1 */}
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl mb-4">🏦</div>
      <h3 className="text-2xl font-bold text-slate-900">
        Compare Multiple Lenders
      </h3>
      <p className="mt-3 text-gray-600">
        Compare loan offers from top banks and NBFCs in one place.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl mb-4">⚡</div>
      <h3 className="text-2xl font-bold text-slate-900">
        Fast Approvals
      </h3>
      <p className="mt-3 text-gray-600">
        Quick processing and faster approvals from lending partners.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl mb-4">📉</div>
      <h3 className="text-2xl font-bold text-slate-900">
        Lowest Interest Rates
      </h3>
      <p className="mt-3 text-gray-600">
        Access competitive interest rates and save more money.
      </p>
    </div>

    {/* Card 4 */}
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl mb-4">🔒</div>
      <h3 className="text-2xl font-bold text-slate-900">
        Secure Application
      </h3>
      <p className="mt-3 text-gray-600">
        Your personal information is protected with secure encryption.
      </p>
    </div>

    {/* Card 5 */}
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl mb-4">👨‍💼</div>
      <h3 className="text-2xl font-bold text-slate-900">
        Expert Assistance
      </h3>
      <p className="mt-3 text-gray-600">
        Dedicated loan experts guide you throughout the process.
      </p>
    </div>

    {/* Card 6 */}
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <div className="text-5xl mb-4">💻</div>
      <h3 className="text-2xl font-bold text-slate-900">
        100% Online Process
      </h3>
      <p className="mt-3 text-gray-600">
        Apply, upload documents and track status completely online.
      </p>
    </div>

  </div>
</section>

{/* Lead Generation Form */}
<form
  onSubmit={handleSubmit}
  className="bg-white rounded-3xl shadow-xl p-8 max-w-3xl mx-auto"
>
  <div className="grid md:grid-cols-2 gap-5">

    <input
      type="text"
      placeholder="Full Name"
      value={formData.fullName}
      onChange={(e) =>
        setFormData({
          ...formData,
          fullName: e.target.value,
        })
      }
      className="border p-3 rounded-xl"
      required
    />

    <input
      type="text"
      placeholder="Mobile Number"
      value={formData.mobile}
      onChange={(e) =>
        setFormData({
          ...formData,
          mobile: e.target.value,
        })
      }
      className="border p-3 rounded-xl"
      required
    />

    <input
      type="text"
      placeholder="City"
      value={formData.city}
      onChange={(e) =>
        setFormData({
          ...formData,
          city: e.target.value,
        })
      }
      className="border p-3 rounded-xl"
    />

    <input
      type="text"
      placeholder="State"
      value={formData.state}
      onChange={(e) =>
        setFormData({
          ...formData,
          state: e.target.value,
        })
      }
      className="border p-3 rounded-xl"
    />

    <select
      value={formData.loanType}
      onChange={(e) =>
        setFormData({
          ...formData,
          loanType: e.target.value,
        })
      }
      className="border p-3 rounded-xl"
    >
      <option value="">Select Loan Type</option>
      <option>Personal Loan</option>
      <option>Home Loan</option>
      <option>Business Loan</option>
      <option>Car Loan</option>
    </select>

    <input
      type="text"
      placeholder="Monthly Income"
      value={formData.monthlyIncome}
      onChange={(e) =>
        setFormData({
          ...formData,
          monthlyIncome: e.target.value,
        })
      }
      className="border p-3 rounded-xl"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full mt-6 bg-green-500 text-white py-4 rounded-xl hover:bg-green-600"
  >
    {loading ? "Submitting..." : "Get Loan Offers"}
  </button>
</form>
{/* Customer Testimonials */}
<section className="max-w-7xl mx-auto px-6 py-20">

  <div className="text-center mb-14">
    <h2 className="text-4xl font-bold text-slate-900">
      What Our Customers Say
    </h2>

    <p className="mt-4 text-gray-600">
      Trusted by thousands of customers across India.
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

    {[
      {
        name: "Rahul Sharma",
        city: "Mumbai",
        review:
          "Got my personal loan approved within 24 hours. Excellent support team.",
      },
      {
        name: "Priya Patel",
        city: "Ahmedabad",
        review:
          "Very easy process and great loan comparison options.",
      },
      {
        name: "Amit Verma",
        city: "Delhi",
        review:
          "Lowest interest rate among all lenders I checked.",
      },
      {
        name: "Sneha Joshi",
        city: "Pune",
        review:
          "Professional guidance from start to finish.",
      },
      {
        name: "Vikram Singh",
        city: "Jaipur",
        review:
          "Quick documentation and smooth approval process.",
      },
      {
        name: "Neha Gupta",
        city: "Bangalore",
        review:
          "Highly recommended for business loan applications.",
      },
    ].map((testimonial, index) => (
      <div
        key={index}
        className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
      >
        <div className="text-yellow-500 text-xl mb-3">
          ⭐⭐⭐⭐⭐
        </div>

        <p className="text-gray-600 mb-6">
          &quot;{testimonial.review}&quot;
        </p>

        <h4 className="font-bold text-slate-900">
          {testimonial.name}
        </h4>

        <p className="text-sm text-gray-500">
          {testimonial.city}
        </p>
      </div>
    ))}

  </div>

</section>
{/* Partner Banks Section */}
<section className="py-20 bg-slate-50 overflow-hidden">

  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold text-slate-900">
      Our Lending Partners
    </h2>

    <p className="mt-4 text-gray-600">
      Trusted by India&apos;s leading banks and NBFCs.
    </p>
  </div>

  <div className="relative">

    <div className="flex gap-8 animate-marquee whitespace-nowrap">

      {[
        "HDFC Bank",
        "ICICI Bank",
        "Axis Bank",
        "SBI",
        "Kotak Mahindra",
        "Bajaj Finserv",
        "Tata Capital",
        "IDFC First",
        "PNB",
        "Bank of Baroda",

        "HDFC Bank",
        "ICICI Bank",
        "Axis Bank",
        "SBI",
        "Kotak Mahindra",
        "Bajaj Finserv",
        "Tata Capital",
        "IDFC First",
        "PNB",
        "Bank of Baroda",
      ].map((bank, index) => (
        <div
          key={index}
          className="min-w-55 bg-white rounded-2xl shadow-md px-8 py-6 text-center font-semibold text-slate-900"
        >
          🏦 {bank}
        </div>
      ))}

    </div>

  </div>
</section>

{/* Footer */}
<footer className="bg-slate-900 text-white mt-20">

  <div className="max-w-7xl mx-auto px-6 py-16">

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

      {/* Company Info */}
      <div>
        <h3 className="text-2xl font-bold mb-4">
          Kinetik Capital
        </h3>

        <p className="text-gray-400">
          Compare and apply for Personal, Home, Business and Car Loans from India&apos;s top banks and NBFCs.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4">
          Quick Links
        </h4>

        <ul className="space-y-2 text-gray-400">
          <li><a href="#">Home</a></li>
          <li><a href="#">Loans</a></li>
          <li><a href="#">EMI Calculator</a></li>
          <li><a href="#">DSA Registration</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="text-lg font-semibold mb-4">
          Legal
        </h4>

        <ul className="space-y-2 text-gray-400">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Disclaimer</a></li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-lg font-semibold mb-4">
          Contact Us
        </h4>

        <ul className="space-y-2 text-gray-400">
          <li>📞 +91 9765435411</li>
          <li>✉️ info@kinetikcapital.com</li>
          <li>📍 Maharashtra, India</li>
        </ul>
      </div>

    </div>

    {/* Divider */}
    <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-400">

      <div className="flex justify-center gap-6 mb-4">

        <a href="#" className="hover:text-white">
          Facebook
        </a>

        <a href="#" className="hover:text-white">
          Instagram
        </a>

        <a href="#" className="hover:text-white">
          LinkedIn
        </a>

        <a href="#" className="hover:text-white">
          YouTube
        </a>

      </div>

      <p>
        © {new Date().getFullYear()} Kinetik Capital Loans. All Rights Reserved.
      </p>

    </div>

  </div>

</footer>
      </main>
    </>
  );
}

