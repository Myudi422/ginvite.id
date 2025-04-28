"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Film, Home, Menu, Moon, Settings, Sun, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Simplified version without useTheme to avoid potential issues
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState("light")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    // Apply theme class to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/anime",
      label: "Anime",
      icon: Film,
      active: pathname === "/anime",
    },
    {
      href: "/users",
      label: "Users",
      icon: Users,
      active: pathname === "/users",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 flex-col bg-background border-r md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="h-6 w-6 rounded-full bg-purple-600"></div>
            <span className="text-lg">Flue Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">Main Menu</h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/80 ${
                    route.active
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                      : "text-muted-foreground"
                  }`}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t p-4">
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={toggleTheme}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-6 w-6 rounded-full bg-purple-600"></div>
              <span className="text-lg">Flue Admin</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="px-4 py-2">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">Main Menu</h2>
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/80 ${
                      route.active
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                        : "text-muted-foreground"
                    }`}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <div className="border-t p-4">
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={toggleTheme}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  )
}