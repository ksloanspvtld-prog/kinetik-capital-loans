"use client";

import { useState } from "react";

export default function DSARegistrationPage() {
  const [mobile, setMobile] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6">

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900">
            Become a DSA Partner
          </h1>

          <p className="mt-4 text-gray-600">
            Join Kinetik Capital and earn attractive commissions by referring loan customers.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <form className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Full Name"
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, ""))
              }
              maxLength={10}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              placeholder="City"
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              placeholder="State"
              className="border rounded-xl px-4 py-3"
            />

            <select className="border rounded-xl px-4 py-3">
              <option>Select Experience</option>
              <option>Fresher</option>
              <option>0-1 Years</option>
              <option>1-3 Years</option>
              <option>3+ Years</option>
            </select>

            <input
              type="text"
              placeholder="Current Occupation"
              className="border rounded-xl px-4 py-3"
            />

            <div>
              <label className="block mb-2 font-medium">
                Upload PAN Card
              </label>

              <input
                type="file"
                className="border rounded-xl px-4 py-3 w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Upload Aadhaar Card
              </label>

              <input
                type="file"
                className="border rounded-xl px-4 py-3 w-full"
              />
            </div>

        
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition"
              >
                Register as DSA Partner
              </button>
            </div>

          </form>

        </div>

      </div>

    </main>
  );
}