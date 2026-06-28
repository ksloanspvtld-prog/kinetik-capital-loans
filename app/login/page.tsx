"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem("admin", "true");
      router.push("/admin");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded-xl mb-4"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-black p-3 rounded-xl"
        >
          Login
        </button>
      </form>
    </div>
  );
}