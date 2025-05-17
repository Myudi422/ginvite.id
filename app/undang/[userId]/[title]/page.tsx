// app/undangan/[userId]/[title]/page.tsx
import type { Metadata } from "next";
import WeddingLoading from "@/components/WeddingLoading";
import React from "react";

export const metadata: Metadata = {
  title: "Undangan Digital",
  description: "Halaman undangan digital",
};

interface Props {
  params: Promise<{
    userId: string;
    title: string;
  }>;
}

export default async function InvitationPage({ params }: Props) {
  const { userId, title } = await params;
  const apiUrl = [
    "https://ccgnimex.my.id/v2/android/ginvite/index.php",
    `?action=result`,
    `&user=${encodeURIComponent(userId)}`,
    `&title=${encodeURIComponent(title)}`,
  ].join("");

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Gagal load data undangan (status ${res.status})`);
  }
  const data = await res.json();

  const Loading = () => (
    <div className="flex items-center justify-center h-screen">
      <WeddingLoading />
    </div>
  );

  // Ambil kategori tema dari content yang dikembalikan oleh API
  const categoryId = data.content.themeCategory; // gunakan themeCategory

  // Dinamis import komponen tema berdasarkan kategori (folder theme)
  let ThemePage: React.ComponentType<{ data: any }>;
  try {
    const mod = await import(
      /* webpackInclude: /page\.tsx$/ */
      /* webpackChunkName: "theme-[request]" */
      `@/components/theme/${categoryId}/page`
    );
    ThemePage = mod.default;
  } catch (err) {
    console.warn("Tema komponen tidak ditemukan untuk kategori:", categoryId, err);
    ThemePage = () => (
      <div className="p-8 text-center">
        <h2>Tema kategori #{categoryId} belum tersedia.</h2>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <ThemePage data={data} />
    </React.Suspense>
  );
}
