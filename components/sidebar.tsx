"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutTemplateIcon, ToolIcon, MessageCircleIcon, MailIcon, BookOpenIcon, MenuIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: HomeIcon,
      active: pathname === "/admin",
    },
    {
      href: "/themes",
      label: "List Theme",
      icon: LayoutTemplateIcon,
      active: pathname === "/themes",
    },
  ]

  const tools = [
    {
      href: "/tools/blast-wa",
      label: "Blast WA",
      icon: MessageCircleIcon,
      active: pathname === "/tools/blast-wa",
    },
    {
      href: "/tools/blast-email",
      label: "Blast Email",
      icon: MailIcon,
      active: pathname === "/tools/blast-email",
    },
    {
      href: "/tools/buku-hadir",
      label: "Buku Hadir",
      icon: BookOpenIcon,
      active: pathname === "/tools/buku-hadir",
    },
  ]

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <Link href="/admin" className="flex items-center gap-2 px-2 mb-4">
          <div className="h-6 w-6 rounded-full bg-purple-600"></div>
          <h1 className="text-xl font-bold">ginvite.id</h1>
        </Link>

        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/80 ${
                route.active ? "bg-purple-100 text-purple-700" : "text-muted-foreground"
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">Tools</p>
          <div className="space-y-1">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/80 ${
                  tool.active ? "bg-purple-100 text-purple-700" : "text-muted-foreground"
                }`}
              >
                <tool.icon className="h-4 w-4" />
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <MenuIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 overflow-y-auto">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 border-r bg-background overflow-y-auto">
        <SidebarContent />
      </div>
    </>
  )
}
