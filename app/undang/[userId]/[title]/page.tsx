// app/undangan/[userId]/[title]/page.tsx
import type { Metadata } from "next";
import WeddingLoading from "@/components/WeddingLoading";
import React from "react";

interface Params {
  userId: string;
  title: string;
}
interface Props {
  params: Promise<Params>;
}

// --- Helper: ambil maksimal 2 nama yang valid dari content.children
function getNamesFromChildren(children: any): string[] {
  if (!Array.isArray(children)) return [];
  return children
    .map((c: any) => {
      if (!c) return "";
      // beberapa API mungkin menyimpan nama di properti berbeda — pakai 'name' jika ada
      const raw = (typeof c.name === "string" ? c.name : (c?.nama ?? ""));
      if (typeof raw !== "string") return "";
      return raw.trim();
    })
    .filter(Boolean) // hapus "", null, undefined, atau string hanya spasi
    .slice(0, 2);
}

// --- Helper: bangun displayName aman (tanpa ' & ' kalau cuma 1 nama)
function buildDisplayName(data: any, rawTitle: string): string {
  const childNames = getNamesFromChildren(data?.content?.children);
  if (childNames.length > 0) {
    return childNames.join(" & ");
  }

  // fallback: gunakan user.first_name jika tersedia dan bukan empty
  const fallback = data?.user?.first_name;
  if (typeof fallback === "string" && fallback.trim()) {
    return fallback.trim();
  }

  // terakhir: decode title (ganti '-' jadi spasi)
  try {
    return decodeURIComponent(rawTitle).replace(/-/g, " ");
  } catch {
    return rawTitle.replace(/-/g, " ");
  }
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
    // fallback jika gagal fetch -> data tetap null
  }

  const displayName = buildDisplayName(data, title);

  // Ambil foto utama: user.pictures_url > gallery > fallback
  let image = data?.user?.pictures_url;
  if (!image && data?.content?.gallery?.items?.length) {
    image = data.content.gallery.items[0];
  }
  if (!image) {
    image = "/default-thumbnail.jpg";
  }

  const desc =
    (data?.content?.invitation?.replace(/<[^>]+>/g, "")?.slice(0, 160)) ||
    `Undangan pernikahan digital untuk ${displayName}`;
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

  console.log("API URL:", apiUrl);
  console.log("Parameters:", { userId, title });

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) {
    console.error("API Response Status:", res.status);
    try {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
    } catch (e) {
      console.error("Could not read error response:", e);
    }
    throw new Error(`Gagal load data undangan (status ${res.status}). URL: ${apiUrl}`);
  }
  let data;
  try {
    data = await res.json();
    console.log("API Response Data:", data);
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("Gagal parsing response data dari server");
  }

  if (!data || !data.content) {
    console.error("Invalid data structure:", data);
    throw new Error("Data undangan tidak valid atau tidak ditemukan");
  }

  // Ambil displayName dengan helper yang sama supaya konsisten dengan metadata
  const displayName = buildDisplayName(data, title);

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

  // Jika komponen ThemePage butuh displayName sebagai prop, kirim via data (opsional)
  // e.g., ThemePage dapat memakai data.displayName atau data._displayName
  data._displayName = displayName;

  return (
    <React.Suspense fallback={<Loading />}>
      <ThemePage data={data} />
    </React.Suspense>
  );
}
