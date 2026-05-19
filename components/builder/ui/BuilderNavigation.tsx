'use client';

import { useState, useEffect } from "react";
import { Home, Calendar, BookOpen, Gift, Heart, MapPin, Users, Clock, MessageSquare, Music, Star, Camera, Coffee, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuilderNavigationProps {
  items: { id: string; type?: string; icon?: string; label: string }[];
  bgType?: 'solid' | 'gradient';
  bgColor?: string;
  bgColor2?: string;
  bgOpacity?: number;
  activeColor?: string;
  inactiveColor?: string;
  accentColor?: string;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  hero: Home, event_details: Calendar, gallery: BookOpen, gift: Gift, rsvp: Heart,
  maps: MapPin, couple: Users, countdown: Clock, our_story: BookOpen, quote: MessageSquare,
  Home, Calendar, BookOpen, Gift, Heart, MapPin, Users, Clock, MessageSquare, Music, Star, Camera, Coffee, Info
};

export default function BuilderNavigation({ 
  items, 
  bgType = 'solid', 
  bgColor = '#000000', 
  bgColor2 = '#333333', 
  bgOpacity, 
  activeColor, 
  inactiveColor, 
  accentColor 
}: BuilderNavigationProps) {
  const [activeId, setActiveId] = useState<string>(items.length > 0 ? items[0].id : "");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the one that takes up more space or is higher up.
          // To keep it simple, we just take the first one (top-most in viewport)
          const targetId = visibleEntries[0].target.id.replace('section-', '');
          setActiveId(targetId);
        }
      },
      {
        root: null, // viewport or closest scrollable parent
        rootMargin: "-20% 0px -40% 0px", // Trigger when element is in the middle of the screen
        threshold: 0
      }
    );

    items.forEach(item => {
      const el = document.getElementById(`section-${item.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navActive = activeColor || accentColor || '#fbbf24';
  const navInactive = inactiveColor || '#71717a';

  const opacityHex = Math.round(((bgOpacity ?? 80) / 100) * 255).toString(16).padStart(2, '0');
  
  let navBg = `${bgColor}${opacityHex}`;
  if (bgType === 'gradient') {
    navBg = `linear-gradient(to right, ${bgColor}${opacityHex}, ${bgColor2}${opacityHex})`;
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full px-4 z-[999] pointer-events-none" style={{ maxWidth: '700px' }}>
        <div className="max-w-md mx-auto backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl pointer-events-auto" style={{ background: navBg }}>
          <div className="flex justify-around items-center h-16 px-2 overflow-x-auto no-scrollbar gap-1">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const Icon = (item.icon && TYPE_ICONS[item.icon]) || TYPE_ICONS[item.type || ''] || Home;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[56px] flex-shrink-0"
                  )}
                  style={isActive ? { color: navActive } : { color: navInactive }}
                  title={item.label}
                >
                  <Icon
                    size={20}
                    className={cn(
                      "transition-transform duration-300",
                      isActive ? "scale-110" : "scale-100"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {isActive && (
                    <span 
                      className="absolute -bottom-1 w-1 h-1 rounded-full shadow-lg" 
                      style={{ backgroundColor: navActive, boxShadow: `0 0 8px ${navActive}80` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-24" />
    </>
  );
}
