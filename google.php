// app/api/auth/validate/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Ambil cookie + header Authorization dari client
  const cookie = req.headers.get("cookie") || "";
  const authHeader = req.headers.get("authorization") || "";

  // Forward ke backend PHP
  const backend = await fetch(
    "https://ccgnimex.my.id/v2/android/ginvite/validate_token.php",
    {
      method: "GET",
      headers: {
        // teruskan cookie dan Authorization
        cookie,
        authorization: authHeader,
      },
    }
  );

  // Ambil JSON response
  const data = await backend.json();

  // Tangkap Set-Cookie kalau ada
  const sc = backend.headers.get("set-cookie");

  // Jika backend tidak mengirim type_user, bisa tambahkan transformasi di sini
  // (opsional, jika backend sudah benar, bagian ini bisa dihapus)
  // if (data.status === "success" && !data.data?.type_user) {
  //   // ...tambahkan logic jika perlu...
  // }

  const res = NextResponse.json(data, { status: backend.status });
  if (sc) res.headers.set("set-cookie", sc);

  return res;
}

// app/components/layout.tsx
"use client";
import React from "react";
import { SidebarMobile, SidebarDesktop } from "@/components/sidebar";
import { Header } from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile trigger */}
      <SidebarMobile />

      {/* Desktop Sidebar */}
      <SidebarDesktop />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64"> {/* Tambahkan margin kiri */}
        {/* Header dengan z-index lebih rendah */}
        <div className="sticky top-0 z-30">
          <Header />
        </div>

        <main className="flex-1 p-2 sm:mt-1">
         

          {children}
        </main>
      </div>
    </div>
  );
}

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Helper: decode JWT payload (tanpa verifikasi signature)
  function getJwtPayload(token: string | undefined): any {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      return payload;
    } catch {
      return null;
    }
  }

  // 1. Jika user punya token dan mencoba buka /login (atau home), kirim ke /admin
  if ((pathname === "/login") && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // 2. Jika user belum punya token dan mencoba buka /admin, kirim ke /login
  if (pathname.startsWith("/admin") && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3. Jika user akses /panel, cek type_user (hanya 0 yang boleh)
  if (pathname.startsWith("/panel")) {
    const payload = getJwtPayload(token);
    // type_user bisa di payload.data.type_user atau payload.type_user tergantung backend
    const typeUser = payload?.data?.type_user ?? payload?.type_user;
    if (typeUser !== 0) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  // 4. Lainnya: lanjutkan request seperti biasa
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/admin/:path*"],
};

// app/components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HomeIcon, LayoutTemplateIcon, MenuIcon, LogOut, FolderOpenDot, MusicIcon, ChartArea, Palette, LayoutDashboardIcon, MessageSquareWarning, Clapperboard   } from "lucide-react" // Import MusicIcon
import { useState, useEffect } from "react"; // Import useState
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image";
import LogoSVG from '@/assets/logo.svg';
import { ChevronDown, ChevronUp } from "lucide-react"; // Import chevron icons

interface Route {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NestedRoute extends Route {
  items?: Route[];
}

const routes: NestedRoute[] = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  {
    href: "/manage",
    label: "Browse",
    icon: LayoutDashboardIcon,
    items: [
      { href: "/tutorial", label: "Tutorial", icon: Clapperboard  },
      { href: "/wa", label: "Report", icon: MessageSquareWarning  },
       //
    ],
  },
  {
    href: "/panel",
    label: "Admin",
    icon: FolderOpenDot,
    items: [
       { href: "/panel", label: "Statistik", icon: ChartArea },
      { href: "/panel/music", label: "Music", icon: MusicIcon },
      { href: "/panel/theme", label: "Theme", icon: Palette  },
    ],
  },
];

function getTypeUserFromToken(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    // type_user bisa di payload.data.type_user atau payload.type_user
    return payload?.data?.type_user ?? payload?.type_user ?? null;
  } catch {
    return null;
  }
}

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [typeUser, setTypeUser] = useState<number | null>(null);

  useEffect(() => {
    setTypeUser(getTypeUserFromToken());
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <div className="h-full py-6 px-4 bg-gradient-to-b from-pink-50/30 to-white/20 backdrop-blur-md border-r border-pink-100/30 flex flex-col justify-between">
      <div>
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center mb-8" // Hapus justify-center sementara
        >
          <Image
            src="/logo.svg"
            alt="Logo Papunda"
            height={150}
            width={150}
            className="ml-auto mr-auto"
            priority // Tambahkan prop priority
          />
        </Link>

        <div className="space-y-2">
          {routes
            .filter(route => {
              // Sembunyikan menu "Admin" jika typeUser bukan 0
              if (route.href === "/panel" && typeUser !== 0) return false;
              return true;
            })
            .map(({ href, label, icon: Icon, items }) => (
              <div key={label}>
                <Link
                  href={items ? '#' : href}
                  onClick={() => {
                    if (items) {
                      toggleSubMenu(label);
                    } else if (onLinkClick) {
                      onLinkClick();
                    }
                  }}
                  className={`flex items-center justify-between gap-3 rounded-md px-3 py-3 text-base font-medium transition-all
                    ${pathname.startsWith(href) && !items
                      ? 'bg-pink-500/10 text-pink-600 border border-pink-200/50 shadow-sm'
                      : 'text-pink-500 hover:bg-pink-100/30 hover:text-pink-600'}`
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm bg-pink-50/80">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span>{label}</span>
                  </div>
                  {items && (
                    <div className="transition-transform duration-200">
                      {openSubMenu === label ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  )}
                </Link>
                {items && openSubMenu === label && (
                  <div className="ml-6 mt-1 space-y-1">
                    {items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={onLinkClick}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all
                          ${pathname === subItem.href
                            ? 'bg-pink-500/10 text-pink-600 border border-pink-200/50 shadow-sm'
                            : 'text-pink-500 hover:bg-pink-100/30 hover:text-pink-600'}`
                        }
                      >
                        <div className="p-1 rounded-sm bg-pink-50/80">
                          <subItem.icon className="h-4 w-4" />
                        </div>
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="px-3 py-2 mt-6 border-t border-pink-100/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-medium text-pink-500 hover:text-pink-600 hover:bg-pink-100/30 rounded-md py-2.5 px-3 w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export function SidebarMobile() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed left-4 top-4 z-40 bg-white/50 backdrop-blur-md
          border border-pink-200/50 shadow-sm hover:bg-pink-100/30 text-pink-600"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-64 overflow-y-auto bg-gradient-to-b from-pink-50/30 to-white/20 backdrop-blur-lg"
      >
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function SidebarDesktop() {
  return (
    <div className="hidden md:block fixed left-0 top-0 h-full w-64 z-50">
      <SidebarContent />
    </div>
  )
}

// app/api/auth/google.ts 
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id_token } = await req.json();

  // forward ke backend utama
  const backend = await fetch(
    "https://ccgnimex.my.id/v2/android/ginvite/google.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // NOTE: untuk menerima Set-Cookie dari backend, Next.js app router
      // perlu opsi credentials: 'include', tapi di server fetch tidak mengirim cookie.
      // Jika backend meng-Set-Cookie, kita tangkap header-nya:
      body: JSON.stringify({ id_token }),
    }
  );

  const data = await backend.json();

  // Forward Set-Cookie kalau ada
  const sc = backend.headers.get("set-cookie");
  const res = NextResponse.json(data, { status: backend.status });
  if (sc) res.headers.set("set-cookie", sc);

  return res;
}