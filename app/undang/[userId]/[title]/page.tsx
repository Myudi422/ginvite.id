// app/undangan/[userId]/[title]/page.tsx
import type { Metadata } from "next";
import React from "react";

interface Params {
  userId: string;
  title: string;
}
interface Props {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    const isKhitanan = data?.category_type?.name === "khitanan";
    if (isKhitanan) {
      return childNames[0];
    }
    return childNames.join(" & ");
  }

  const fallback = data?.user?.first_name;
  if (typeof fallback === "string" && fallback.trim()) {
    return fallback.trim();
  }

  try {
    return decodeURIComponent(rawTitle).replace(/-/g, " ");
  } catch {
    return rawTitle.replace(/-/g, " ");
  }
}

// --- Fetch dengan timeout untuk mencegah hang
async function fetchWithTimeout(url: string, options: RequestInit & { next?: any } = {}, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timeout setelah ${timeoutMs / 1000} detik. Silakan coba lagi.`);
    }
    throw err;
  }
}

// Ambil data undangan terlebih dahulu untuk metadata dinamis
async function getInvitationData(userId: string, title: string) {
  const apiUrl = [
    "https://ccgnimex.my.id/v2/android/ginvite/index.php",
    `?action=result`,
    `&user=${encodeURIComponent(userId)}`,
    `&title=${encodeURIComponent(title)}`,
  ].join("");

  const res = await fetchWithTimeout(apiUrl, { next: { revalidate: 60 } }, 10000);
  if (!res.ok) {
    throw new Error(`Gagal load data undangan (status ${res.status})`);
  }

  const text = await res.text();
  if (!text || text.trim() === '') {
    throw new Error('Server mengembalikan respons kosong');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Respons server tidak valid (bukan JSON)');
  }
}

// Metadata dinamis
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId, title } = await params;
  let data: any = null;
  try {
    data = await getInvitationData(userId, title);
  } catch {
    // fallback jika gagal fetch -> data tetap null
  }

  const displayName = buildDisplayName(data, title);

  // Ambil foto utama: prioritas gallery > profile pengantin > user.pictures_url > fallback
  let image = null;

  if (data?.content?.gallery?.items?.length) {
    const galleryImage = data.content.gallery.items[0];
    if (galleryImage && galleryImage.startsWith('https://')) {
      image = galleryImage;
    }
  }

  if (!image && data?.category_type?.name === "khitanan" && data?.content?.children?.length > 0) {
    const childProfile = data.content.children[0]?.profile;
    if (childProfile && childProfile.startsWith('https://')) {
      image = childProfile;
    }
  }

  if (!image && data?.category_type?.name !== "khitanan" && data?.content?.children?.length > 0) {
    for (const child of data.content.children) {
      if (child?.profile && child.profile.startsWith('https://')) {
        image = child.profile;
        break;
      }
    }
  }

  if (!image && data?.user?.pictures_url) {
    let userImage = data.user.pictures_url;
    if (userImage.includes('googleusercontent.com') && userImage.includes('=s96-c')) {
      userImage = userImage.replace('=s96-c', '=s1200-c');
    }
    if (userImage.startsWith('https://')) {
      image = userImage;
    }
  }

  if (!image) {
    image = "https://papunda.com/og-default.jpg";
  }

  const eventType = data?.category_type?.name === "khitanan" ? "Khitanan" : "Pernikahan";
  const desc =
    (data?.content?.invitation?.replace(/<[^>]+>/g, "")?.slice(0, 160)) ||
    `Undangan ${eventType} digital untuk ${displayName}`;
  const url = `https://papunda.com/undang/${userId}/${title}`;

  return {
    title: `Undangan ${eventType} Digital | ${displayName}`,
    description: desc,
    openGraph: {
      title: `Undangan ${eventType} Digital | ${displayName}`,
      description: desc,
      url,
      siteName: "Papunda - Undangan Digital (Pernikahan, Khitanan & Ultah)",
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
    viewport: "width=device-width, initial-scale=1",
    metadataBase: new URL("https://papunda.com"),
    other: {
      "article:author": "Papunda",
      "og:image": image,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/jpeg",
      "twitter:image": image,
      "twitter:card": "summary_large_image",
    },
  };
}

//

export default async function InvitationPage({ params, searchParams }: Props) {
  const { userId, title } = await params;
  const apiUrl = [
    "https://ccgnimex.my.id/v2/android/ginvite/index.php",
    `?action=result`,
    `&user=${encodeURIComponent(userId)}`,
    `&title=${encodeURIComponent(title)}`,
  ].join("");

  console.log("API URL:", apiUrl);
  console.log("Parameters:", { userId, title });

  let data: any = null;
  let fetchError: string | null = null;

  try {
    const res = await fetchWithTimeout(apiUrl, { next: { revalidate: 60 } }, 12000);

    if (!res.ok) {
      console.error("API Response Status:", res.status);
      const errorText = await res.text().catch(() => '');
      console.error("API Error Response:", errorText);
      fetchError = `Gagal memuat data undangan (status ${res.status}). Silakan coba lagi.`;
    } else {
      const text = await res.text();
      if (!text || text.trim() === '') {
        fetchError = 'Server mengembalikan respons kosong. Silakan coba lagi.';
      } else {
        try {
          data = JSON.parse(text);
          console.log("API Response Data keys:", Object.keys(data || {}));
        } catch (e) {
          console.error("Failed to parse JSON response:", e);
          fetchError = "Respons server tidak valid. Silakan coba lagi.";
        }
      }
    }
  } catch (err: any) {
    console.error("Fetch error:", err);
    fetchError = err.message || "Terjadi kesalahan koneksi. Silakan coba lagi.";
  }

  // Tampilkan halaman error yang ramah pengguna jika fetch gagal
  if (fetchError || !data || !data.content) {
    const message = fetchError || "Data undangan tidak valid atau tidak ditemukan.";
    console.error("Showing error page:", message);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Undangan Tidak Dapat Dimuat</h1>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <div className="space-y-3">
            <a
              href={`/undang/${userId}/${title}`}
              className="block w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-colors text-sm"
            >
              Coba Lagi
            </a>
            <a
              href="/"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors text-sm"
            >
              Kembali ke Beranda
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Jika masalah berlanjut, silakan hubungi tim dukungan kami.
          </p>
        </div>
      </div>
    );
  }

  // Inject "to" parameter into opening data if available
  const { to } = await searchParams;
  if (data.content.opening && typeof to === 'string' && to.trim()) {
    data.content.opening.to = to.trim();
  }

  const displayName = buildDisplayName(data, title);

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

  if (!pageImage && data?.category_type?.name !== "khitanan" && data?.content?.children?.length > 0) {
    for (const child of data.content.children) {
      if (child?.profile && child.profile.startsWith('https://')) {
        pageImage = child.profile;
        break;
      }
    }
  }

  if (!pageImage && data?.user?.pictures_url) {
    let userImage = data.user.pictures_url;
    if (userImage.includes('googleusercontent.com') && userImage.includes('=s96-c')) {
      userImage = userImage.replace('=s96-c', '=s1200-c');
    }
    if (userImage.startsWith('https://')) {
      pageImage = userImage;
    }
  }

  if (!pageImage) {
    pageImage = "https://papunda.com/og-default.jpg";
  }

  // Ambil kategori tema dari content yang dikembalikan oleh API
  const categoryId = data.content.themeCategory;

  // Validasi categoryId — harus angka dalam range tema yang tersedia
  const VALID_THEME_IDS = ['1', '2', '3', '4', '5', '6', '7'];
  const safeThemeId = VALID_THEME_IDS.includes(String(categoryId)) ? String(categoryId) : '1';

  // Dinamis import komponen tema berdasarkan kategori (folder theme)
  let ThemePage: React.ComponentType<{ data: any }>;
  try {
    const mod = await import(
      /* webpackInclude: /page\.tsx$/ */
      /* webpackChunkName: "theme-[request]" */
      `@/components/theme/${safeThemeId}/page`
    );
    ThemePage = mod.default;
  } catch (err) {
    console.warn("Tema komponen tidak ditemukan untuk kategori:", safeThemeId, err);
    // Fallback ke tema 1
    try {
      const mod = await import(`@/components/theme/1/page`);
      ThemePage = mod.default;
    } catch {
      ThemePage = () => (
        <div className="min-h-screen flex items-center justify-center p-8 text-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Tema tidak tersedia</h2>
            <p className="text-gray-500 text-sm">Tema #{categoryId} belum tersedia. Silakan hubungi admin.</p>
          </div>
        </div>
      );
    }
  }

  data._displayName = displayName;

  return (
    <>
      <ThemePage data={data} />
    </>
  );
}
