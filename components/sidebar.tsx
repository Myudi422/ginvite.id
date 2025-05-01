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
    <div className="space-y-4 py-4 px-3">
      <Link href="/admin" onClick={onLinkClick} className="flex items-center gap-2 px-2 mb-4">
        <div className="h-6 w-6 rounded-full bg-purple-600"></div>
        <h1 className="text-xl font-bold">ginvite.id</h1>
      </Link>

      <div className="space-y-1">
        {routes.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/80 ${pathname === href ? 'bg-purple-100 text-purple-700' : 'text-muted-foreground'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">Tools</p>
        <div className="space-y-1">
          {tools.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/80 ${pathname === href ? 'bg-purple-100 text-purple-700' : 'text-muted-foreground'}`}
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
        <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 overflow-y-auto">
        <SidebarContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function SidebarDesktop() {
  return <SidebarContent />
}