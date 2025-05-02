"use client"

import { Home, Calendar, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "event", icon: Calendar, label: "Acara" },
    { id: "gallery", icon: ImageIcon, label: "Galeri" },
  ]

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId)

    if (sectionId === "home") {
      // Scroll back to the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl z-30">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
              activeSection === item.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-blue-400",
            )}
          >
            <item.icon size={20} className="mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
