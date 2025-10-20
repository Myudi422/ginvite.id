// app/undangan/[userId]/[title]/page.tsx
import type { Metadata } from "next";
import WeddingLoading from "@/components/WeddingLoading";
import React from "react";
import Head from "next/head";

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

// --- Helper: bangun displayName aman (berbeda untuk khitanan vs nikah)
function buildDisplayName(data: any, rawTitle: string): string {
  const childNames = getNamesFromChildren(data?.content?.children);
  if (childNames.length > 0) {
    // Untuk khitanan, hanya ambil nama anak pertama (tidak ada " & ")
    const isKhitanan = data?.category_type?.name === "khitanan";
    if (isKhitanan) {
      return childNames[0]; // Hanya nama anak yang dikhitan
    }
    // Untuk nikah, gabungkan dengan " & "
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

  // Ambil foto utama: prioritas gallery > profile anak > user.pictures_url > fallback
  let image = null;
  
  // 1. Prioritas utama: Gallery images (ukuran pasti lebih besar)
  if (data?.content?.gallery?.items?.length) {
    const galleryImage = data.content.gallery.items[0];
    if (galleryImage && galleryImage.startsWith('https://')) {
      // Pastikan URL HTTPS untuk WhatsApp compatibility
      image = galleryImage;
    }
  }
  
  // 2. Untuk khitanan, coba foto profile anak yang dikhitan
  if (!image && data?.category_type?.name === "khitanan" && data?.content?.children?.length > 0) {
    const childProfile = data.content.children[0]?.profile;
    if (childProfile && childProfile.startsWith('https://')) {
      image = childProfile;
    }
  }
  
  // 3. Fallback: User profile picture (dengan resize jika dari Google)
  if (!image && data?.user?.pictures_url) {
    let userImage = data.user.pictures_url;
    // Jika dari Google Photos, ganti parameter size ke yang lebih besar
    if (userImage.includes('googleusercontent.com') && userImage.includes('=s96-c')) {
      userImage = userImage.replace('=s96-c', '=s1200-c');
    }
    image = userImage;
  }
  
  // 4. Default fallback jika tidak ada gambar yang valid
  if (!image || !image.startsWith('http')) {
    image = "https://via.placeholder.com/1200x630/4a281e/ffffff?text=Undangan+Digital";
  }

  // Buat deskripsi yang sesuai dengan jenis acara
  const eventType = data?.category_type?.name === "khitanan" ? "khitanan" : "pernikahan";
  const desc =
    (data?.content?.invitation?.replace(/<[^>]+>/g, "")?.slice(0, 160)) ||
    `Undangan ${eventType} digital untuk ${displayName}`;
  const url = `https://papunda.com/undang/${userId}/${title}`;

  return {
    title: `Undangan Digital | ${displayName}`,
    description: desc,
    openGraph: {
      title: `Undangan Digital | ${displayName}`,
      description: desc,
      url,
      siteName: "Papunda - Undangan Digital",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `Undangan Digital ${displayName}`,
          type: "image/jpeg",
        },
      ],
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: `Undangan Digital | ${displayName}`,
      description: desc,
      images: [image],
      creator: "@papunda_id",
    },
    // Tambahan meta tags khusus untuk WhatsApp
    viewport: "width=device-width, initial-scale=1",
    metadataBase: new URL("https://papunda.com"),
    other: {
      // Additional meta for better compatibility
      "article:author": "Papunda",
    },
  };
}

//

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

  // Ambil gambar dengan logika yang sama seperti metadata
  let pageImage = null;
  if (data?.content?.gallery?.items?.length) {
    const galleryImage = data.content.gallery.items[0];
    if (galleryImage && galleryImage.startsWith('https://')) {
      pageImage = galleryImage;
    }
  }
  if (!pageImage && data?.category_type?.name === "khitanan" && data?.content?.children?.length > 0) {
    const childProfile = data.content.children[0]?.profile;
    if (childProfile && childProfile.startsWith('https://')) {
      pageImage = childProfile;
    }
  }
  if (!pageImage && data?.user?.pictures_url) {
    let userImage = data.user.pictures_url;
    if (userImage.includes('googleusercontent.com') && userImage.includes('=s96-c')) {
      userImage = userImage.replace('=s96-c', '=s1200-c');
    }
    pageImage = userImage;
  }
  if (!pageImage) {
    pageImage = "https://via.placeholder.com/1200x630/4a281e/ffffff?text=Undangan+Digital";
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

  // Jika komponen ThemePage butuh displayName sebagai prop, kirim via data (opsional)
  // e.g., ThemePage dapat memakai data.displayName atau data._displayName
  data._displayName = displayName;

  return (
    <>
      <Head>
        <meta property="og:image" content={pageImage} />
        <meta property="og:image:secure_url" content={pageImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <React.Suspense fallback={<Loading />}>
        <ThemePage data={data} />
      </React.Suspense>
    </>
  );
}
