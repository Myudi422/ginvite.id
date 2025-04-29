// app/api/auth/validate/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Ambil cookie + header Authorization dari client
  const cookie = req.headers.get("cookie") || "";
  const authHeader = req.headers.get("authorization") || "";

  // Forward ke backend PHP
  const backend = await fetch(
    "https://ccgnimex.my.id/v2/android/ginvite/validate_token.php",
    {
      method: "GET",
      headers: {
        // teruskan cookie dan Authorization
        cookie,
        authorization: authHeader,
      },
    }
  );

  // Ambil JSON response
  const data = await backend.json();

  // Tangkap Set-Cookie kalau ada
  const sc = backend.headers.get("set-cookie");
  const res = NextResponse.json(data, { status: backend.status });
  if (sc) res.headers.set("set-cookie", sc);

  return res;
}
