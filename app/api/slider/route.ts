// app/api/slider/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(
    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_slider`
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { status: 'error', message: text },
      { status: res.status }
    );
  }

  const json = await res.json();
  return NextResponse.json(json);
}
