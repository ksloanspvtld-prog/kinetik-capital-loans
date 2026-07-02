import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kinetik Capital – Compare & Apply for Loans Online",
  description:
    "Compare Personal, Home, Business, Car Loans from top banks & NBFCs. Apply online, get instant approval, and track your loan status.",
  keywords:
    "personal loan, home loan, business loan, car loan, loan comparison, EMI calculator",
  authors: [{ name: "Kinetik Capital" }],
  openGraph: {
    title: "Kinetik Capital – Compare & Apply for Loans Online",
    description:
      "Compare Personal, Home, Business, Car Loans from top banks & NBFCs. Apply online, get instant approval.",
    url: "https://kinetik-capital-loans.vercel.app",
    siteName: "Kinetik Capital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinetik Capital – Compare & Apply for Loans Online",
    description:
      "Compare Personal, Home, Business, Car Loans from top banks & NBFCs.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* ✅ Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* ✅ Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) {
                      console.log('✅ Service Worker registered!');
                    })
                    .catch(function(err) {
                      console.log('❌ Service Worker registration failed:', err);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}