// app/undangan/[userId]/[title]/page.tsx
import type { Metadata } from "next";
import WeddingLoading from "@/components/WeddingLoading";
import React from "react";

interface Props {
  params: Promise<{
    userId: string;
    title: string;
  }>;
}

// Ambil data undangan terlebih dahulu untuk metadata dinamis
async function getInvitationData(params: Props["params"]) {
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
  return res.json();
}

// Metadata dinamis
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId, title } = await params;
  let data: any = null;
  try {
    data = await getInvitationData(Promise.resolve({ userId, title }));
  } catch {
    // fallback jika gagal fetch
  }

  // Ambil nama pengantin dari content.children (ambil 2 teratas)
  let displayName = "";
  if (data?.content?.children && Array.isArray(data.content.children) && data.content.children.length > 0) {
    const names = data.content.children.slice(0, 2).map((c: any) => c.name).filter(Boolean);
    displayName = names.join(" & ");
  }
  if (!displayName) {
    displayName = data?.user?.first_name || decodeURIComponent(title).replace(/-/g, " ");
  }

  // Ambil foto utama: user.pictures_url > gallery > fallback
  let image = data?.user?.pictures_url;
  if (!image && data?.content?.gallery?.items?.length) {
    image = data.content.gallery.items[0];
  }
  if (!image) {
    image = "/default-thumbnail.jpg";
  }

  const desc = data?.content?.invitation?.replace(/<[^>]+>/g, "")?.slice(0, 160)
    || `Undangan pernikahan digital untuk ${displayName}`;
  const url = `https://papunda.com/undang/${userId}/${title}`;

  return {
    title: `Undangan Digital | ${displayName}`,
    description: desc,
    openGraph: {
      title: `Undangan Digital | ${displayName}`,
      description: desc,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `Undangan Digital ${displayName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Undangan Digital | ${displayName}`,
      description: desc,
      images: [image],
    },
    metadataBase: new URL("https://papunda.com"),
  };
}

export default async function InvitationPage({ params }: Props) {
  const { userId, title } = await params;
  const apiUrl = [
    "https://ccgnimex.my.id/v2/android/ginvite/index.php",
    `?action=result`,
    `&user=${encodeURIComponent(userId)}`,
    `&title=${encodeURIComponent(title)}`,
  ].join("");

  console.log('API URL:', apiUrl);
  console.log('Parameters:', { userId, title });

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    console.error('API Response Status:', res.status);
    console.error('API Response Headers:', Object.fromEntries(res.headers.entries()));
    
    // Try to get response text for more details
    try {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
    } catch (e) {
      console.error('Could not read error response:', e);
    }
    
    throw new Error(`Gagal load data undangan (status ${res.status}). URL: ${apiUrl}`);
  }
  let data;
  try {
    data = await res.json();
    console.log('API Response Data:', data);
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error('Gagal parsing response data dari server');
  }

  // Check if data is valid
  if (!data || !data.content) {
    console.error('Invalid data structure:', data);
    throw new Error('Data undangan tidak valid atau tidak ditemukan');
  }

  const Loading = () => (
    <div className="flex items-center justify-center h-screen">
      <WeddingLoading />
    </div>
  );

  // Ambil kategori tema dari content yang dikembalikan oleh API
  const categoryId = data.content.themeCategory;

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
