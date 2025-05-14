// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { auth, provider, signInWithPopup } from "@/public/firebase.config";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });
      const json = await res.json();

      if (res.ok && json.token) {
        window.location.href = "/admin";
      } else {
        throw new Error(json.message || "Login gagal");
      }
    } catch (e: any) {
      console.error("Google login error:", e);
      setError(e.message || "Login Google gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-100 rounded-xl shadow-lg p-4 md:p-6 space-y-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-gray-100 rounded-lg disabled:opacity-50 transition"
      >
        <img
          src="/icons/google.svg"       // ganti dengan ikon Google milikmu
          alt="Google logo"
          className="w-5 h-5 md:w-6 md:h-6"
        />
        <span className="font-medium text-gray-700">
          {loading ? "Memproses…" : "Masuk dengan Google"}
        </span>
      </button>
    </div>
  );
}
