"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  loading: boolean;
  error: string | null;
  user?: { userId: number; email: string };
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, error: null });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");  // atau halaman login-mu
      return;
    }

    fetch("https://ccgnimex.my.id/v2/android/ginvite/validate_token.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(async res => {
      const json = await res.json();
      if (!res.ok || json.status !== "success") {
        throw new Error(json.message || "Invalid token");
      }
      setState({ loading: false, error: null, user: json.data });
    })
    .catch(err => {
      console.error("Auth validation failed:", err);
      localStorage.removeItem("token");
      setState({ loading: false, error: err.message });
      router.replace("/login");
    });
  }, [router]);

  return state;
}
