// app/admin/layout.tsx
import { Sidebar } from "@/components/sidebar";
import type { ReactNode } from "react";

export const metadata = {
  title: "Dashboard Undangan",
  description: "Sample dashboard undangan digital",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
