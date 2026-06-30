"use client";

import { useState, useRef, useEffect } from "react";

const COMPANY_NAME = "Kinetik Capital";

// ✅ Predefined Q&A
const qaPairs = [
  {
    keywords: ["hello", "hi", "hey", "namaste"],
    response: `Hello! Welcome to ${COMPANY_NAME}. How can I assist you with your loan needs today?`,
  },
  {
    keywords: ["personal loan", "personal"],
    response:
      "A Personal Loan is an unsecured loan for any personal expense. Interest rates start from 10.99% p.a. and amounts up to ₹40 Lakhs.",
  },
  {
    keywords: ["home loan", "home"],
    response:
      "A Home Loan helps you buy or build your dream home. Interest rates start from 8.50% p.a., loan amounts up to ₹5 Crore, and tenure up to 30 years.",
  },
  {
    keywords: ["business loan", "business"],
    response:
      "Business Loans are for working capital, expansion, or new ventures. Get up to ₹10 Crore with flexible repayment options.",
  },
  {
    keywords: ["car loan", "car", "vehicle"],
    response:
      "Car Loans help you finance your new or used car. Enjoy 100% financing, quick processing, and flexible tenure up to 7 years.",
  },
  {
    keywords: ["education loan", "study"],
    response:
      "Education Loans fund your higher studies in India or abroad. Up to ₹2 Crore with interest rates starting from 8.33% p.a.",
  },
  {
    keywords: ["gold loan", "gold"],
    response:
      "Gold Loans are secured loans against your gold jewellery. Get quick funds at attractive interest rates.",
  },
  {
    keywords: ["loan against property", "property"],
    response:
      "Loan Against Property (LAP) allows you to unlock the value of your property. Get up to ₹10 Crore with long tenure options.",
  },
  {
    keywords: ["cibil", "credit score", "score"],
    response:
      "Your CIBIL Score is a 3-digit number that reflects your creditworthiness. A score above 750 is considered good for loan approval.",
  },
  {
    keywords: ["emi", "emi calculator"],
    response:
      "You can use our EMI Calculator to estimate your monthly instalments. Visit the 'Tools & Calculators' section.",
  },
  {
    keywords: ["eligibility", "qualify"],
    response:
      "Your loan eligibility depends on income, credit score, age, and existing debts. Use our Eligibility Calculator for a quick estimate.",
  },
  {
    keywords: ["interest rate", "rate", "p.a."],
    response:
      "Interest rates vary by loan type and lender. We offer competitive rates starting from 8.50% p.a. for home loans and 10.99% p.a. for personal loans.",
  },
  {
    keywords: ["documents", "paperwork"],
    response:
      "Typical documents required: ID proof, address proof, income proof (salary slips/ITR), bank statements, and property documents (for home loans).",
  },
  {
    keywords: ["how to apply", "apply", "application"],
    response:
      "You can apply online by filling the 'Get Loan Offers' form on our website. Our team will contact you within 24 hours.",
  },
  {
    keywords: ["time", "processing time"],
    response:
      "Processing time varies by loan type. Personal loans can be disbursed in 24 hours, while home loans may take 2-5 working days.",
  },
  {
    keywords: ["partner", "dsa", "become partner"],
    response:
      "Join our partner network! We offer a high-gain, risk-free business model. Contact us for more details.",
  },
  {
    keywords: ["contact", "support", "help"],
    response:
      "You can reach us at +91 9765435411 or email info@kinetikcapital.com. We're here to help!",
  },
  {
    keywords: ["bye", "thank you", "thanks", "tata"],
    response:
      "Thank you for connecting with us! Have a great day. If you need more help, just ask. 😊",
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([
    {
      text: `Hello! I'm ${COMPANY_NAME}'s virtual assistant. Ask me anything about loans, eligibility, interest rates, or our services.`,
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findAnswer = (question: string): string => {
    const lower = question.toLowerCase();
    for (const pair of qaPairs) {
      if (pair.keywords.some((kw) => lower.includes(kw))) {
        return pair.response;
      }
    }
    return `I'm not sure about that. Please contact our support team at +91 9765435411 or email info@kinetikcapital.com for detailed assistance.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botReply = findAnswer(userMsg);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-lg transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open Chat"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z" />
        </svg>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        } origin-bottom-right`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">💬</span>
            <span className="text-white font-semibold">Kinetik Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-2 rounded-xl focus:outline-none focus:border-indigo-500 transition text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition font-medium text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}