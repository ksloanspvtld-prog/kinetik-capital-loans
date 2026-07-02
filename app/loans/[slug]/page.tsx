import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import type { Metadata } from "next";

// ✅ Loan data (copy from your home page loanCategories or define here)
const loanCategories = [
  {
    slug: "personal-loan",
    title: "Personal Loan",
    icon: "💳",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop",
    description: "Instant approval with attractive rates. Get funds for any personal need.",
    features: [
      "✔ Loan up to ₹40 Lakhs",
      "✔ Interest from 10.99% p.a.",
      "✔ Disbursal in 24 hours",
      "✔ No collateral",
    ],
    eligibility: [
      "Age: 21-60 years",
      "Minimum income: ₹25,000/month",
      "CIBIL score: 700+",
      "Employment: Salaried or Self-employed",
    ],
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Bank Statements (6 months)",
      "Income Proof (Salary Slips/ITR)",
    ],
    interestRates: [
      { bank: "HDFC Bank", rate: "10.99%", processingFee: "2%", tenure: "5 Years" },
      { bank: "ICICI Bank", rate: "11.25%", processingFee: "1.5%", tenure: "7 Years" },
      { bank: "SBI", rate: "10.75%", processingFee: "1%", tenure: "6 Years" },
    ],
  },
  {
    slug: "home-loan",
    title: "Home Loan",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
    description: "Low interest and long tenure options. Make your dream home a reality.",
    features: [
      "✔ Loan up to ₹5 Crore",
      "✔ Interest from 8.50% p.a.",
      "✔ Tenure up to 30 years",
      "✔ Quick approval",
    ],
    eligibility: [
      "Age: 18-65 years",
      "Minimum income: ₹30,000/month",
      "CIBIL score: 650+",
      "Employment: Salaried or Self-employed",
    ],
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Bank Statements (6 months)",
      "Income Proof",
      "Property Documents",
    ],
    interestRates: [
      { bank: "SBI", rate: "8.50%", processingFee: "0.5%", tenure: "30 Years" },
      { bank: "HDFC Bank", rate: "8.75%", processingFee: "1%", tenure: "30 Years" },
      { bank: "ICICI Bank", rate: "8.85%", processingFee: "1%", tenure: "25 Years" },
    ],
  },
  {
    slug: "business-loan",
    title: "Business Loan",
    icon: "🏢",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=500&fit=crop",
    description: "Fast funding for business growth. Flexible repayment options.",
    features: [
      "✔ Loan up to ₹10 Crore",
      "✔ Fast disbursal",
      "✔ Flexible tenure",
      "✔ No collateral up to ₹50L",
    ],
    eligibility: [
      "Age: 21-65 years",
      "Business vintage: 3+ years",
      "Annual turnover: ₹10L+",
    ],
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "GST Certificate",
      "Bank Statements (12 months)",
      "Income Tax Returns",
    ],
    interestRates: [
      { bank: "HDFC Bank", rate: "12.50%", processingFee: "2%", tenure: "5 Years" },
      { bank: "ICICI Bank", rate: "12.75%", processingFee: "1.5%", tenure: "7 Years" },
      { bank: "SBI", rate: "12.25%", processingFee: "1%", tenure: "6 Years" },
    ],
  },
  {
    slug: "car-loan",
    title: "Car Loan",
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=500&fit=crop",
    description: "Finance your dream car easily. Quick processing and high approval.",
    features: [
      "✔ 100% financing",
      "✔ Processing in 24 hours",
      "✔ High approval rate",
      "✔ Tenure up to 7 years",
    ],
    eligibility: [
      "Age: 21-60 years",
      "Minimum income: ₹20,000/month",
      "CIBIL score: 650+",
    ],
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Bank Statements (6 months)",
      "Income Proof",
      "Car quotation",
    ],
    interestRates: [
      { bank: "HDFC Bank", rate: "9.50%", processingFee: "2%", tenure: "7 Years" },
      { bank: "ICICI Bank", rate: "9.75%", processingFee: "1.5%", tenure: "7 Years" },
      { bank: "SBI", rate: "9.25%", processingFee: "1%", tenure: "7 Years" },
    ],
  },
];

// ✅ Generate static params for all loans
export async function generateStaticParams() {
  return loanCategories.map((loan) => ({
    slug: loan.slug,
  }));
}

// ✅ Page component with async params
export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const loan = loanCategories.find((l) => l.slug === slug);

  if (!loan) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-100">
            <div className="relative h-64 md:h-80">
              <img
                src={loan.image}
                alt={loan.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
                    <span className="text-6xl">{loan.icon}</span>
                    {loan.title}
                  </h1>
                  <p className="text-white/80 text-lg mt-2 max-w-2xl">{loan.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">✨ Key Features</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {loan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg hover:bg-slate-50 transition">
                      <span className="text-indigo-500 text-lg">✓</span>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">✅ Eligibility Criteria</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {loan.eligibility.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg hover:bg-slate-50 transition">
                      <span className="text-emerald-500 text-lg">•</span>
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">📄 Documents Required</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {loan.documents.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg hover:bg-slate-50 transition">
                      <span className="text-indigo-500 text-lg">📌</span>
                      <span className="text-slate-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Now Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-6 text-white text-center">
                <h3 className="text-2xl font-bold">Ready to Apply?</h3>
                <p className="text-white/80 text-sm mt-2">Get started in minutes</p>
                <Link
                  href="/#loanForm"
                  className="block mt-4 bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:shadow-lg transition"
                >
                  Apply Now →
                </Link>
              </div>

              {/* Interest Rates */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">📊 Interest Rate Comparison</h3>
                <div className="space-y-3">
                  {loan.interestRates.map((rate, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-slate-800">{rate.bank}</p>
                        <p className="text-xs text-slate-400">Fee: {rate.processingFee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 font-bold">{rate.rate}</p>
                        <p className="text-xs text-slate-400">{rate.tenure}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-3">🔗 Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/#loanForm" className="text-indigo-600 hover:text-indigo-700 transition">
                      Apply for {loan.title}
                    </Link>
                  </li>
                  <li>
                    <Link href="/#emi-calculator" className="text-indigo-600 hover:text-indigo-700 transition">
                      EMI Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-700 transition">
                      ← Back to Home
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

// ✅ Generate metadata with async params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loan = loanCategories.find((l) => l.slug === slug);

  return {
    title: loan ? `${loan.title} - Kinetik Capital` : "Loan Details",
    description: loan?.description || "Apply for loans online",
    keywords: [loan?.title || "loan", "interest rates", "apply online"],
  };
}