// app/components/layout.tsx
import React from "react";
import { SidebarMobile, SidebarDesktop } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers"; // Tetap gunakan import ini

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  let typeUser: number | undefined = undefined;
  try {
    const token = cookies().get("token")?.value;
    if (token) {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
        typeUser = payload?.data?.type_user ?? payload?.type_user;
      }
    }
  } catch {
    typeUser = undefined;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile trigger */}
      <SidebarMobile typeUser={typeUser} />

      {/* Desktop Sidebar */}
      <SidebarDesktop typeUser={typeUser} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <div className="sticky top-0 z-30">
          <Header />
        </div>
        <main className="flex-1 p-2 sm:mt-1">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}