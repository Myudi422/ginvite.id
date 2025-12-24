"use client"

import { useState, useEffect } from "react";
import { Home, Search, Calendar, Download, MoreHorizontal, Heart, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetflixNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  showGallery?: boolean;
  showRsvp?: boolean;
  showGift?: boolean;
}

export default function NetflixNavigation({
  activeSection,
  setActiveSection,
  showGallery = true,
  showRsvp = true,
  showGift = true,
}: NetflixNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { 
      id: "home", 
      icon: Home, 
      label: "Home", 
      show: true 
    },
    { 
      id: "event", 
      icon: Calendar, 
      label: "Coming Soon", 
      show: true 
    },
    { 
      id: "gallery", 
      icon: Search, 
      label: "Gallery", 
      show: showGallery 
    },
    { 
      id: "gift", 
      icon: Gift, 
      label: "Gift", 
      show: showGift 
    },
    { 
      id: "rsvp", 
      icon: Heart, 
      label: "More", 
      show: showRsvp 
    },
  ].filter(item => item.show);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);

    // Scroll to section if it exists
    const element = document.getElementById(sectionId);
    if (element) {
      // Add offset for fixed header
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md z-50 border-t border-gray-800">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-all duration-200 min-w-[60px]",
                    "hover:bg-gray-800/50",
                    isActive && "bg-gray-800/30"
                  )}
                >
                  <div className="relative">
                    <item.icon
                      size={22}
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-white" : "text-gray-400"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-gray-400"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content from being hidden behind nav */}
      <div className="h-16" />
    </>
  );
}

// Netflix-style navigation hook for managing active section
export function useNetflixNavigation() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "event", "gallery", "gift", "rsvp"];
      const scrollPosition = window.scrollY + 200; // Offset for better UX

      for (const sectionId of sections.reverse()) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeSection, setActiveSection };
}