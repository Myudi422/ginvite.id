"use client"

import { Home, Calendar, ImageIcon, MapPin, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
  accentColor: string
  showGallery?: boolean
  showRsvp?: boolean
}

export default function Navigation({
  activeSection,
  setActiveSection,
  accentColor,
  showGallery = true,
  showRsvp = true,
}: NavigationProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home", show: true },
    { id: "event", icon: Calendar, label: "Acara", show: true },
    { id: "gallery", icon: ImageIcon, label: "Galeri", show: showGallery },
    { id: "rsvp", icon: Heart, label: "Kehadiran", show: showRsvp },
  ].filter(item => item.show);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm z-30 rounded-tl-xl rounded-tr-xl"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderTop: `2px solid ${accentColor}`,
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
                ? "text-[" + accentColor + "]"
                : "text-gray-400",
            )}
          >
            <item.icon
              size={20}
              className={cn(
                activeSection === item.id ? "text-[" + accentColor + "]" : "text-gray-400"
              )}
            />
            <span className={cn(
              activeSection === item.id ? "text-[" + accentColor + "]" : "text-gray-400"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}