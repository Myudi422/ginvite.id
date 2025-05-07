// app/components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutTemplateIcon, MessageCircleIcon, MailIcon, BookOpenIcon, MenuIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/themes", label: "List Theme", icon: LayoutTemplateIcon },
]
const tools = [
  { href: "/tools/blast-wa", label: "Blast WA", icon: MessageCircleIcon },
  { href: "/tools/blast-email", label: "Blast Email", icon: MailIcon },
  { href: "/tools/buku-hadir", label: "Buku Hadir", icon: BookOpenIcon },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="space-y-4 py-4 px-3 h-full bg-gradient-to-b from-pink-50/30 to-white/20 backdrop-blur-md border-r border-pink-100/30">
      <Link 
        href="/admin" 
        onClick={onLinkClick} 
        className="flex items-center gap-2 px-2 mb-4 group"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"></div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
          ginvite.id
        </h1>
      </Link>

      <div className="space-y-1">
        {routes.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
              ${pathname === href 
                ? 'bg-pink-500/10 text-pink-600 border border-pink-200/50 shadow-sm' 
                : 'text-pink-500 hover:bg-pink-100/30 hover:text-pink-600'}`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <p className="px-4 text-xs font-semibold text-pink-500/80 mb-2">Tools</p>
        <div className="space-y-1">
          {tools.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${pathname === href 
                  ? 'bg-pink-500/10 text-pink-600 border border-pink-200/50 shadow-sm' 
                  : 'text-pink-500 hover:bg-pink-100/30 hover:text-pink-600'}`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
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