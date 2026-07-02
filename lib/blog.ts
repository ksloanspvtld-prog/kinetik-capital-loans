// lib/blog.ts

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  icon?: string;
  image?: string;
  readTime?: string;
}

// ✅ Sample blog posts – Replace with your actual data
const blogPosts: BlogPost[] = [
  {
    slug: "how-to-get-personal-loan",
    title: "How to Get a Personal Loan in 2024",
    excerpt: "Complete guide to personal loan eligibility, documents, interest rates, and application process.",
    content: `
      <p>Getting a personal loan in 2024 is easier than ever. Here's everything you need to know...</p>
      <h2>1. Check Your Eligibility</h2>
      <p>Before applying, make sure you meet these criteria...</p>
      <ul>
        <li>Age: 21-60 years</li>
        <li>Income: ₹25,000+ per month</li>
        <li>CIBIL Score: 700+</li>
      </ul>
      <h2>2. Documents Required</h2>
      <ul>
        <li>Aadhaar Card</li>
        <li>PAN Card</li>
        <li>Bank Statements (6 months)</li>
        <li>Income Proof</li>
      </ul>
      <h2>3. Compare Interest Rates</h2>
      <p>Compare rates from HDFC, ICICI, SBI, and other banks...</p>
      <h2>4. Apply Online</h2>
      <p>Apply instantly on Kinetik Capital and get approval in 24 hours...</p>
    `,
    date: "July 1, 2024",
    author: "Kinetik Capital",
    category: "Personal Loan",
    tags: ["Personal Loan", "Finance", "Guide"],
    icon: "💰",
    readTime: "5 min read",
  },
  {
    slug: "home-loan-tips",
    title: "10 Tips for Getting a Home Loan in 2024",
    excerpt: "Expert tips to get your home loan approved quickly with the best interest rates.",
    content: `
      <p>Buying a home is a big decision. Here are 10 tips to help you get the best home loan...</p>
      <h2>1. Improve Your Credit Score</h2>
      <p>A good credit score can help you get better interest rates...</p>
      <h2>2. Save for Down Payment</h2>
      <p>Most banks require 10-20% down payment...</p>
    `,
    date: "June 25, 2024",
    author: "Kinetik Capital",
    category: "Home Loan",
    tags: ["Home Loan", "Real Estate", "Tips"],
    icon: "🏠",
    readTime: "7 min read",
  },
  {
    slug: "business-loan-guide",
    title: "Complete Guide to Business Loans",
    excerpt: "Everything you need to know about business loans – types, eligibility, and application process.",
    content: `
      <p>Business loans can help you grow your business. Here's everything you need to know...</p>
      <h2>Types of Business Loans</h2>
      <ul>
        <li>Secured Business Loans</li>
        <li>Unsecured Business Loans</li>
        <li>MSME Loans</li>
        <li>Working Capital Loans</li>
      </ul>
      <h2>Eligibility Criteria</h2>
      <ul>
        <li>Business vintage: 3+ years</li>
        <li>Annual turnover: ₹10L+</li>
        <li>CIBIL Score: 650+</li>
      </ul>
    `,
    date: "June 20, 2024",
    author: "Kinetik Capital",
    category: "Business Loan",
    tags: ["Business Loan", "Finance", "MSME"],
    icon: "🏢",
    readTime: "6 min read",
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}