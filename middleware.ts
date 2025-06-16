// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Helper: decode JWT payload (tanpa verifikasi signature)
  function getJwtPayload(token: string | undefined): any {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      return payload;
    } catch {
      return null;
    }
  }

  // 1. Jika user punya token dan mencoba buka /login (atau home), kirim ke /admin
  if ((pathname === "/login") && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // 2. Jika user belum punya token dan mencoba buka /admin, kirim ke /login
  if (pathname.startsWith("/admin") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3. Jika user akses /panel, cek type_user (hanya 0 yang boleh)
  if (pathname.startsWith("/panel")) {
    const payload = getJwtPayload(token);
    // type_user bisa di payload.data.type_user atau payload.type_user tergantung backend
    const typeUser = payload?.data?.type_user ?? payload?.type_user;
    if (typeUser !== 0) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  // 4. Lainnya: lanjutkan request seperti biasa
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};
