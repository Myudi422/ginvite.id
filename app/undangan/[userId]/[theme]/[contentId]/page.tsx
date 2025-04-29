// app/undangan/[userId]/[theme]/[contentId]/page.tsx
import InvitationView from "@/components/InvitationView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Undangan Digital",
  description: "Halaman undangan digital",
};

// Next.js App Router: dynamic route params are a Promise
interface Props {
  params: Promise<{
    userId: string;
    theme: string;
    contentId: string;
  }>;
}

export default async function InvitationPage({ params }: Props) {
  // Await the dynamic params before using them
  const { userId, theme, contentId } = await params;

  const apiUrl =
    `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
    `?action=result` +
    `&user=${encodeURIComponent(userId)}` +
    `&theme=${encodeURIComponent(theme)}` +
    `&content_user=${encodeURIComponent(contentId)}`;

  console.log("Fetching invitation JSON from:", apiUrl);

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    console.error("Failed to fetch data, status:", res.status);
    throw new Error(`Gagal load data undangan (status ${res.status})`);
  }

  const data = await res.json();
  return <InvitationView data={data} />;
}