// lib/seo.ts – Dynamic SEO Helper

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
}

export function generateSEOMetadata({
  title,
  description,
  image = "/og-image.png",
  url = "https://kinetik-capital-loans.vercel.app",
  keywords = "",
  type = "website",
  publishedTime,
  author = "Kinetik Capital",
}: SEOProps) {
  const fullTitle = `${title} | Kinetik Capital`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Kinetik Capital",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_IN",
      type,
      ...(publishedTime && { publishedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}