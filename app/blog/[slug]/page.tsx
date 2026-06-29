import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";

const blogPosts: Record<string, { title: string; date: string; readTime: string; category: string; image: string; content: string }> = {
  "how-to-get-personal-loan": {
    title: "How to Get a Personal Loan in 2026?",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Personal Loan",
    image: "💳",
    content: `
Getting a personal loan in 2026 is easier than ever. Here's everything you need to know:

## Step 1: Check Your Eligibility
Most banks require a minimum monthly income of ₹25,000 and a good credit score.

## Step 2: Compare Interest Rates
Different banks offer different interest rates. Use our compare tool to find the best deal.

## Step 3: Apply Online
Fill out the application form online and submit the required documents.

## Step 4: Get Disbursed
Once approved, the loan amount will be credited to your bank account within 24 hours.
    `,
  },
  "home-loan-interest-rates": {
    title: "Home Loan Interest Rates 2026 - Complete Guide",
    date: "January 12, 2026",
    readTime: "7 min read",
    category: "Home Loan",
    image: "🏠",
    content: `
Home loan interest rates in 2026 are competitive. Here's a complete guide:

## Top Banks with Best Rates
SBI: 8.50% p.a.
HDFC: 8.65% p.a.
ICICI: 8.75% p.a.

## Factors Affecting Interest Rates
- Credit Score
- Loan Amount
- Tenure
- Income Level
    `,
  },
  "business-loan-eligibility": {
    title: "Business Loan Eligibility - Everything You Need to Know",
    date: "January 10, 2026",
    readTime: "6 min read",
    category: "Business Loan",
    image: "🏢",
    content: `
Check your business loan eligibility with this complete guide:

## Eligibility Criteria
- Minimum annual turnover: ₹10 Lakhs
- Business vintage: 2+ years
- Good credit score

## Required Documents
- Business registration proof
- ITR for last 2 years
- Bank statements
- KYC documents
    `,
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-700 transition flex items-center gap-2 mb-6">
            ← Back to Blog
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12">
            <div className="text-6xl mb-4">{post.image}</div>
            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4">
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {post.title}
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace("## ", "")}</h2>;
                }
                if (line.startsWith("- ")) {
                  return <li key={i} className="ml-4">{line.replace("- ", "")}</li>;
                }
                if (line.trim() === "") {
                  return <br key={i} />;
                }
                return <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{line}</p>;
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}