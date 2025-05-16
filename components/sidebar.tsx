// app/components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HomeIcon, LayoutTemplateIcon, MenuIcon, LogOut } from "lucide-react"
import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image";
import LogoSVG from '@/assets/logo.svg';

const routes = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/themes", label: "List Theme", icon: LayoutTemplateIcon },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter();

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
          {routes.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-all
                ${pathname === href
                  ? 'bg-pink-500/10 text-pink-600 border border-pink-200/50 shadow-sm'
                  : 'text-pink-500 hover:bg-pink-100/30 hover:text-pink-600'}`
              }
            >
              <div className="p-1.5 rounded-sm bg-pink-50/80">
                <Icon className="h-5 w-5" />
              </div>
              <span>{label}</span>
            </Link>
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