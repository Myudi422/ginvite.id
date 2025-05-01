// app/undangan/[userId]/[theme]/[title]/page.tsx
import InvitationView from "@/components/InvitationView";
import type { Metadata } from "next";
import '@/styles/template.css';

export const metadata: Metadata = {
  title: "Undangan Digital",
  description: "Halaman undangan digital",
};

interface Props {
  params: Promise<{
    userId: string;
    theme: string;
    title: string;
  }>;
}

export default async function InvitationPage({ params }: Props) {
  const { userId, theme, title } = await params;

  const apiUrl =
    `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
    `?action=result` +
    `&user=${encodeURIComponent(userId)}` +
    `&theme=${encodeURIComponent(theme)}` +
    `&title=${encodeURIComponent(title)}`;

  console.log("Fetching invitation JSON from:", apiUrl);

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    console.error("Failed to fetch data, status:", res.status);
    throw new Error(`Gagal load data undangan (status ${res.status})`);
  }

  const data = await res.json();
  return <InvitationView data={data} />;
}
