// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
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

  // 3. Jika user akses /panel atau QR-code path, cek permissions
  if (pathname.startsWith("/panel") || pathname.includes("/qr-code")) {
    const payload = getJwtPayload(token);
    const typeUser = payload?.data?.type_user ?? payload?.type_user;
    
    // Untuk /panel, hanya type_user 0 yang boleh
    if (pathname.startsWith("/panel") && typeUser !== 0) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    // Untuk QR-code path, cek QR status
    if (pathname.includes("/qr-code")) {
      // Extract invitationId dan title dari URL
      const parts = pathname.split('/');
      const qrIndex = parts.indexOf('qr-code');
      if (qrIndex >= 2) {
        const invitationId = parts[qrIndex - 2];
        const title = parts[qrIndex - 1];
        
        try {
          // Check QR status from API
          const response = await fetch(
            `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_manage&user_id=${invitationId}&title=${encodeURIComponent(title)}`
          );
          const data = await response.json();
          
          // Redirect ke halaman manage jika QR false
          if (!data?.data?.QR) {
            const url = req.nextUrl.clone();
            url.pathname = pathname.split("/qr-code")[0]; // Kembali ke halaman manage
            return NextResponse.redirect(url);
          }
        } catch (error) {
          // Jika ada error, block access untuk safety
          const url = req.nextUrl.clone();
          url.pathname = pathname.split("/qr-code")[0];
          return NextResponse.redirect(url);
        }
      }
    }
  }

  // 4. Lainnya: lanjutkan request seperti biasa
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*", "/panel/:path*", "/admin/manage/:path*/qr-code"],
};
