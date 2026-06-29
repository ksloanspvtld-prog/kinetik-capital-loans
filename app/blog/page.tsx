import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";

const COMPANY_NAME = "Kinetik Capital";

const blogPosts = [
  {
    slug: "how-to-get-personal-loan",
    title: "How to Get a Personal Loan in 2026?",
    excerpt: "Learn the step-by-step process to get a personal loan with the best interest rates.",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Personal Loan",
    image: "💳",
  },
  {
    slug: "home-loan-interest-rates",
    title: "Home Loan Interest Rates 2026 - Complete Guide",
    excerpt: "Compare home loan interest rates from top banks and NBFCs in India.",
    date: "January 12, 2026",
    readTime: "7 min read",
    category: "Home Loan",
    image: "🏠",
  },
  {
    slug: "business-loan-eligibility",
    title: "Business Loan Eligibility - Everything You Need to Know",
    excerpt: "Check your business loan eligibility and documents required for approval.",
    date: "January 10, 2026",
    readTime: "6 min read",
    category: "Business Loan",
    image: "🏢",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white text-center mb-4">
            Our <span className="text-indigo-600">Blog</span>
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and guides on loans and finance.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 p-6 border border-slate-100 dark:border-slate-700 h-full">
                  <div className="text-5xl mb-4">{post.image}</div>
                  <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 hover:text-indigo-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    {post.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}