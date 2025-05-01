// app/components/template.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  LayoutTemplateIcon,
  MessageCircleIcon,
  MailIcon,
  BookOpenIcon,
  Menu,
  X,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}

function NavItem({ href, icon: Icon, label }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href} passHref>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        <Icon className="mr-3 h-5 w-5" />
        <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
      </Button>
    </Link>
  )
}

export function TemplateLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const mainNav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/themes", label: "List Theme", icon: LayoutTemplateIcon },
  ]
  const toolsNav = [
    { href: "/tools/blast-wa", label: "Blast WA", icon: MessageCircleIcon },
    { href: "/tools/blast-email", label: "Blast Email", icon: MailIcon },
    { href: "/tools/buku-hadir", label: "Buku Hadir", icon: BookOpenIcon },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-purple-600" />
          <span className="text-lg font-semibold text-gray-900">ginvite.id</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
          <X className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Main</p>
          <div className="space-y-1">
            {mainNav.map(item => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Tools</p>
          <div className="space-y-1">
            {toolsNav.map(item => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </div>
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64">{sidebarContent}</div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-20 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between px-4 bg-white border-b lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu button placeholder */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}