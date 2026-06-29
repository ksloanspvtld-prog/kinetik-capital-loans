"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  // ✅ State directly from localStorage (no effect needed for initial value)
  const [isDark, setIsDark] = useState(() => {
    // This runs only once on mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  // ✅ Effect only for applying/removing the class and syncing storage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <span className="text-2xl">☀️</span>
      ) : (
        <span className="text-2xl">🌙</span>
      )}
    </button>
  );
}