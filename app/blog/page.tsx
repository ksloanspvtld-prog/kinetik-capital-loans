import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";

const blogPosts = [
  {
    slug: "how-to-get-personal-loan",
    title: "How to Get a Personal Loan in 2024",
    date: "July 1, 2024",
    author: "Kinetik Capital",
    category: "Personal Loan",
    excerpt: "Getting a personal loan is easier than ever. Here are the steps you need to follow...",
  },
  {
    slug: "home-loan-tips",
    title: "10 Tips for Getting a Home Loan",
    date: "June 25, 2024",
    author: "Kinetik Capital",
    category: "Home Loan",
    excerpt: "Buying a home is a big decision. Here are some tips to help you get the best home loan...",
  },
  {
    slug: "business-loan-guide",
    title: "Complete Guide to Business Loans",
    date: "June 20, 2024",
    author: "Kinetik Capital",
    category: "Business Loan",
    excerpt: "Business loans can help you grow your business. Here's everything you need to know...",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">📝 Blog</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 hover:shadow-2xl transition hover:-translate-y-1"
              >
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-3">
                  {post.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h2>
                <p className="text-slate-500 text-sm mb-3">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>📅 {post.date}</span>
                  <span className="text-indigo-600 font-medium">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}