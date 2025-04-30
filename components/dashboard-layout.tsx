"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Film, Home, Menu, Moon, Settings, Sun, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState("light")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const routes = [
    { href: "/", label: "Dashboard", icon: Home, active: pathname === "/" },
    { href: "/anime", label: "Anime", icon: Film, active: pathname === "/anime" },
    { href: "/users", label: "Users", icon: Users, active: pathname === "/users" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, active: pathname === "/analytics" },
    { href: "/settings", label: "Settings", icon: Settings, active: pathname === "/settings" },
  ]

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background shadow-lg md:flex sticky top-0 h-screen">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <div className="h-7 w-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold">Flue Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all",
                  route.active 
                    ? "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{route.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t p-4 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-10 w-10 hover:bg-accent"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <div className="h-7 w-7 rounded-lg bg-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">Flue Admin</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="py-6 px-4">
            <div className="space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors",
                    route.active
                      ? "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{route.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
        
        {/* Footer */}
        <footer className="border-t py-4 px-6 mt-auto">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Flue Admin. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  )
}