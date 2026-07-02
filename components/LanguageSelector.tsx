"use client";

import { useState, useEffect } from "react";
import { Language } from "@/lib/i18n";

export default function LanguageSelector() {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLang(saved);
  }, []);

  const handleChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-full p-1 text-sm">
      <button
        onClick={() => handleChange("en")}
        className={`px-3 py-1 rounded-full transition ${
          lang === "en" ? "bg-white dark:bg-slate-800 shadow" : "hover:bg-white/50"
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => handleChange("hi")}
        className={`px-3 py-1 rounded-full transition ${
          lang === "hi" ? "bg-white dark:bg-slate-800 shadow" : "hover:bg-white/50"
        }`}
      >
        🇮🇳 HI
      </button>
      <button
        onClick={() => handleChange("mr")}
        className={`px-3 py-1 rounded-full transition ${
          lang === "mr" ? "bg-white dark:bg-slate-800 shadow" : "hover:bg-white/50"
        }`}
      >
        🇮🇳 MR
      </button>
    </div>
  );
}