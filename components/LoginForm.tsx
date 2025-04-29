"use client"

import { useState } from "react"
import { auth, provider, signInWithPopup } from "@/public/firebase.config"

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // 1) Sign in with Google via Firebase
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()

      // 2) Kirim ke backend dan sertakan cookie
      const res = await fetch(
        "https://ccgnimex.my.id/v2/android/ginvite/google.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken })
        }
      )

      const json = await res.json()

      if (res.ok && json.token) {
        // 3) (Opsional) Simpan juga di localStorage agar mudah diakses JS
        localStorage.setItem("token", json.token)

        // 4) Redirect ke dashboard admin
        window.location.href = "/admin"
      } else {
        throw new Error(json.message || "Login gagal")
      }
    } catch (e: any) {
      console.error("Google login error:", e)
      setError(e.message || "Login Google gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center">Masuk dengan Google</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Memproses…" : "Sign in with Google"}
          </button>
        </div>
      </main>
    </div>
  )
}
