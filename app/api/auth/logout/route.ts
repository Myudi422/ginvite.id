// app/api/auth/logout.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Kirim permintaan ke backend untuk menghapus sesi
    const backendLogout = await fetch(
      "https://ccgnimex.my.id/v2/android/ginvite/page/logout.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cookie': req.headers.get('cookie') || '', // Kirim cookie untuk diidentifikasi di backend (jika perlu)
        },
        // Anda mungkin perlu mengirimkan data tambahan ke backend untuk logout
        // body: JSON.stringify({}),
      }
    );

    if (!backendLogout.ok) {
      console.error("Backend logout failed:", backendLogout.status);
      return NextResponse.json({ message: "Logout gagal di backend" }, { status: backendLogout.status });
    }

    // 2. Hapus cookie 'token' di sisi klien
    const res = new NextResponse(
      JSON.stringify({ message: "Logout berhasil" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`, // Hapus cookie 'token'
        },
      }
    );

    return res;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat logout" }, { status: 500 });
  }
}