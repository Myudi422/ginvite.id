import { NextRequest, NextResponse } from "next/server";

const FONNTE_API_URL = "https://api.fonnte.com/send";
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || "UE2xWLvTjf3mXmTxgUP1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target, message, delay, typing, schedule } = body;

    if (!target || !message) {
      return NextResponse.json(
        { status: false, reason: "target dan message wajib diisi" },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("target", target);
    formData.append("message", message);
    formData.append("countryCode", "62");

    if (delay) formData.append("delay", String(delay));
    if (typing !== undefined) formData.append("typing", String(typing));
    if (schedule) formData.append("schedule", String(schedule));

    const response = await fetch(FONNTE_API_URL, {
      method: "POST",
      headers: {
        Authorization: FONNTE_TOKEN,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fonnte API error:", error);
    return NextResponse.json(
      { status: false, reason: "Server error saat mengirim pesan" },
      { status: 500 }
    );
  }
}
