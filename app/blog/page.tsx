import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import { getAllBlogPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900">📝 Blog</h1>
            <p className="text-slate-500 mt-2">
              Expert insights, loan tips &amp; financial advice
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition hover:-translate-y-1 border border-slate-100 group"
              >
                <div className="h-48 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center text-6xl">
                  {post.icon || "📄"}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    {post.tags?.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center mt-4 text-sm text-slate-400">
                    <span>📅 {post.date}</span>
                    <span className="text-indigo-600 font-medium group-hover:translate-x-1 transition inline-flex items-center gap-1">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No posts */}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-slate-500">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}