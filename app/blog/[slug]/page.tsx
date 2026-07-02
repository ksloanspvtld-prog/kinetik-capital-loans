import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import type { Metadata } from "next";

// ✅ Blog posts data (Replace with your actual data source)
const blogPosts = [
  {
    slug: "how-to-get-personal-loan",
    title: "How to Get a Personal Loan in 2024",
    date: "July 1, 2024",
    author: "Kinetik Capital",
    category: "Personal Loan",
    content: `
      <p>Getting a personal loan is easier than ever. Here are the steps you need to follow...</p>
      <h2>1. Check Your Eligibility</h2>
      <p>Before applying, make sure you meet the eligibility criteria...</p>
      <h2>2. Compare Interest Rates</h2>
      <p>Compare rates from different banks and NBFCs...</p>
    `,
  },
  {
    slug: "home-loan-tips",
    title: "10 Tips for Getting a Home Loan",
    date: "June 25, 2024",
    author: "Kinetik Capital",
    category: "Home Loan",
    content: `
      <p>Buying a home is a big decision. Here are some tips to help you get the best home loan...</p>
      <h2>1. Improve Your Credit Score</h2>
      <p>A good credit score can help you get better interest rates...</p>
    `,
  },
  {
    slug: "business-loan-guide",
    title: "Complete Guide to Business Loans",
    date: "June 20, 2024",
    author: "Kinetik Capital",
    category: "Business Loan",
    content: `
      <p>Business loans can help you grow your business. Here's everything you need to know...</p>
    `,
  },
];

// ✅ Generate static params (for static site generation)
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// ✅ Page component with correct Promise type for params
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
              <span>📅 {post.date}</span>
              <span>✍️ {post.author}</span>
            </div>
            <div
              className="prose prose-indigo max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="mt-10 pt-8 border-t border-slate-200">
              <a
                href="/blog"
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
              >
                ← Back to Blog
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

// ✅ generateMetadata with correct Promise type
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  return {
    title: post?.title || "Blog Post",
    description: post?.content?.replace(/<[^>]*>/g, "").slice(0, 160) || "",
  };
}