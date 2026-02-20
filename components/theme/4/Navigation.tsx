"use client"

import { useState, useEffect } from "react";
import { Home, Search, Calendar, MapPin, Heart, Gift, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  showGallery?: boolean;
  showRsvp?: boolean;
  showGift?: boolean;
}

export default function Navigation({
  activeSection,
  setActiveSection,
  showGallery = true,
  showRsvp = true,
  showGift = true,
}: NavigationProps) {
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
      label: "Event",
      show: true
    },
    {
      id: "gallery",
      icon: BookOpen,
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
      label: "RSVP",
      show: showRsvp
    },
  ].filter(item => item.show);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
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
      <div className="fixed bottom-6 left-4 right-4 z-40">
        <div className="max-w-md mx-auto bg-black/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[56px]",
                    isActive ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      "transition-transform duration-300",
                      isActive ? "scale-110" : "scale-100"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content from being hidden behind nav */}
      <div className="h-24" />
    </>
  );
}

// Navigation hook
export function useNavigation() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "event", "gallery", "gift", "rsvp"];
      const scrollPosition = window.scrollY + 300;

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