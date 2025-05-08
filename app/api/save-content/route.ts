// app/api/save-content/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    const res = await fetch(
      'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const json = await res.json();
    if (!res.ok || json.status !== 'success') {
      return NextResponse.json({ error: json.message || 'Auto-save gagal' }, { status: 500 });
    }
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
