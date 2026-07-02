"use client";   // ⬅️ ही एक line add केली आहे (महत्त्वाची)

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-indigo-600">✅ Admin Panel</h1>
        <p className="text-slate-600 mt-2">If you see this, admin works!</p>
        <button
          onClick={() => {
            document.cookie = "token=; path=/; max-age=0";
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}