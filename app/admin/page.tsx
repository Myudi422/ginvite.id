// app/admin/page.tsx
import { Sidebar } from "@/components/sidebar"
import InvitationDashboard from "@/components/InvitationDashboard"

export const metadata = {
  title: "Dashboard Undangan",
  description: "Sample dashboard undangan digital",
}

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <InvitationDashboard />
      </main>
    </div>
  )
}
