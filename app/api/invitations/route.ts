// app/api/invitations/route.ts
import { NextResponse } from 'next/server';

const EXTERNAL_API = 'https://ccgnimex.my.id/v2/android/ginvite/index.php';
const TIMEOUT_MS = 10000; // 10 detik

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timeout setelah ${timeoutMs / 1000} detik`);
    }
    throw err;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || isNaN(+userId)) {
    return NextResponse.json(
      { status: 'error', message: 'Parameter userId tidak valid' },
      { status: 400 }
    );
  }

  try {
    // Panggil API PHP eksternal dengan timeout
    const res = await fetchWithTimeout(
      `${EXTERNAL_API}?action=get_invitations&user_id=${encodeURIComponent(userId)}`,
      TIMEOUT_MS
    );

    if (!res.ok) {
      const text = await res.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { status: 'error', message: text },
        { status: res.status }
      );
    }

    const text = await res.text();
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { status: 'error', message: 'Server mengembalikan respons kosong' },
        { status: 502 }
      );
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Respons server tidak valid (bukan JSON)' },
        { status: 502 }
      );
    }

    return NextResponse.json(json);
  } catch (err: any) {
    console.error('[API /invitations] Error:', err.message);
    return NextResponse.json(
      { status: 'error', message: err.message || 'Terjadi kesalahan koneksi ke server' },
      { status: 503 }
    );
  }
}
