// app/components/layout.tsx
"use client"
import React from "react";
import { SidebarMobile, SidebarDesktop } from "@/components/sidebar";
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
      <aside className="hidden md:block w-64 border-r bg-background sticky top-0 h-screen overflow-y-auto">
        <SidebarDesktop />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-6xl mx-auto sm:mt-1">
        {/* Back Button */}
        {pathname !== "/admin" && (
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
