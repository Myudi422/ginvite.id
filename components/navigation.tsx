"use client"

import { Home, Calendar, ImageIcon, MapPin, Heart } from "lucide-react" // Import ikon baru
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
  accentColor: string // Accent color passed as prop
}

export default function Navigation({ activeSection, setActiveSection, accentColor }: NavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "event", icon: Calendar, label: "Acara" },
    { id: "gallery", icon: ImageIcon, label: "Galeri" },
    { id: "maps", icon: MapPin, label: "Peta" }, // Item untuk Maps
    { id: "rsvp", icon: Heart, label: "Kehadiran" }, // Item untuk Kehadiran
  ]

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId)

    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm z-30 rounded-tl-xl rounded-tr-xl"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Transparent background with black color
        borderTop: `2px solid white`, // Adding accent color stroke at the top
      }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
              activeSection === item.id
                ? `text-white` // Active section uses accent color (text-white)
                : "text-gray-400", // Inactive section text color is gray
            )}
          >
            <item.icon
              size={20}
              className={cn(
                activeSection === item.id ? "text-white" : "text-gray-400" // Color change based on active section
              )}
            />
            <span className={cn(
              activeSection === item.id ? "text-white" : "text-gray-400" // Color change based on active section
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}