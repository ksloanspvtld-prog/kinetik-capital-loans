import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <WhatsAppButton />
      <main className="pt-24 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
            {/* Category */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                {post.category}
              </span>
              {post.tags?.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
              <span>📅 {post.date}</span>
              <span>✍️ {post.author || "Kinetik Capital"}</span>
              <span>⏱️ {post.readTime || "5 min read"}</span>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-64 md:h-80 object-cover" />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-indigo max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back to Blog */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <a
                href="/blog"
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
              >
                ← Back to Blog
              </a>
            </div>
          </article>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `${post.title} | Kinetik Capital Blog`,
    description: post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160),
    keywords: post.tags?.join(", ") || "",
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160),
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Kinetik Capital"],
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}