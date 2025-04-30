// app/api/invitations/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || isNaN(+userId)) {
    return NextResponse.json(
      { status: 'error', message: 'Parameter userId tidak valid' },
      { status: 400 }
    );
  }

  // Panggil API PHP eksternal
  const res = await fetch(
    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_invitations&user_id=${userId}`
  );

  if (!res.ok) {
    // forward status & message
    const text = await res.text();
    return NextResponse.json(
      { status: 'error', message: text },
      { status: res.status }
    );
  }

  const json = await res.json();
  return NextResponse.json(json);
}
