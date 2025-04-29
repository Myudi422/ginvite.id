// app/api/auth/google.ts 
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id_token } = await req.json();

  // forward ke backend utama
  const backend = await fetch(
    "https://ccgnimex.my.id/v2/android/ginvite/google.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // NOTE: untuk menerima Set-Cookie dari backend, Next.js app router
      // perlu opsi credentials: 'include', tapi di server fetch tidak mengirim cookie.
      // Jika backend meng-Set-Cookie, kita tangkap header-nya:
      body: JSON.stringify({ id_token }),
    }
  );

  const data = await backend.json();

  // Forward Set-Cookie kalau ada
  const sc = backend.headers.get("set-cookie");
  const res = NextResponse.json(data, { status: backend.status });
  if (sc) res.headers.set("set-cookie", sc);

  return res;
}