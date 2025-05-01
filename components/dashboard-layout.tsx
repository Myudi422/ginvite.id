"use client"

import { ReactNode } from "react"
import {  } from "./sidebar"

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b px-6 py-4 sticky top-0 bg-background z-40">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </header>

        <main className="flex-1 px-6 py-4 overflow-auto">
          {children}
        </main>

        <footer className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Flue Admin. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
