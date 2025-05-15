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