'use client';

import React, { useState, useEffect } from "react";
import { Home, Calendar, BookOpen, Gift, Heart, MapPin, Users, Clock, MessageSquare, Music, Star, Camera, Coffee, Info, Shirt, type LucideIcon } from "lucide-react";
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
  isVertical?: boolean;
  position?: 'fixed' | 'absolute';
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  hero: Home, event_details: Calendar, gallery: BookOpen, gift: Gift, rsvp: Heart,
  maps: MapPin, couple: Users, countdown: Clock, our_story: BookOpen, quote: MessageSquare,
  dresscode: Shirt,
  Home, Calendar, BookOpen, Gift, Heart, MapPin, Users, Clock, MessageSquare, Music, Star, Camera, Coffee, Info, Shirt
};

function normalizeHex(hex: string): string {
  if (!hex) return '';
  let clean = hex.trim();
  if (!clean.startsWith('#')) {
    clean = '#' + clean;
  }
  // Expand short hex e.g. #fff to #ffffff
  if (clean.length === 4) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (clean.length === 5) {
    const r = clean[1];
    const g = clean[2];
    const b = clean[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (clean.length > 7) {
    return clean.slice(0, 7);
  }
  return clean;
}

function isHexDark(hex: string): boolean {
  if (!hex) return true;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  if (clean.length !== 6) return true;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 150;
}

export default function BuilderNavigation({ 
  items, 
  bgType = 'solid', 
  bgColor = '#000000', 
  bgColor2 = '#333333', 
  bgOpacity, 
  activeColor, 
  inactiveColor, 
  accentColor,
  isVertical = false,
  position = 'fixed'
}: BuilderNavigationProps) {
  const [activeId, setActiveId] = useState<string>(items && items.length > 0 ? items[0].id : "");

  if (!items || items.length === 0) {
    return null;
  }

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
      const container = element.closest('.overflow-y-auto');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const elemRect = element.getBoundingClientRect();
        const relativeTop = elemRect.top - containerRect.top + container.scrollTop;
        container.scrollTo({
          top: Math.max(0, relativeTop),
          behavior: 'smooth'
        });
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navActive = activeColor || accentColor || '#fbbf24';
  const navInactive = inactiveColor || '#71717a';

  const opacityHex = Math.round(((bgOpacity ?? 80) / 100) * 255).toString(16).padStart(2, '0');
  
  const cleanBgColor = normalizeHex(bgColor) || '#000000';
  const cleanBgColor2 = normalizeHex(bgColor2) || '#333333';

  const isBgDark = isHexDark(cleanBgColor);
  const defaultInactive = isBgDark ? '#ffffffd0' : '#71717a';
  const defaultActiveBg = isBgDark ? '#ffffff' : (activeColor || accentColor || '#000000');
  const defaultActiveColor = isBgDark ? (cleanBgColor || '#000000') : (isHexDark(defaultActiveBg) ? '#ffffff' : '#000000');

  let navStyle: React.CSSProperties = {};
  if (bgType === 'gradient') {
    navStyle = {
      backgroundImage: `linear-gradient(to bottom, ${cleanBgColor}${opacityHex}, ${cleanBgColor2}${opacityHex})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };
  } else {
    navStyle = {
      backgroundColor: `${cleanBgColor}${opacityHex}`,
    };
  }

  // ── Render Vertical Menu for Desktop Split View ──
  if (isVertical) {
    return (
      <div className="absolute top-1/2 left-[60%] -translate-y-1/2 -translate-x-1/2 z-[999] pointer-events-none">
        <div 
          className="backdrop-blur-xl rounded-full shadow-2xl overflow-hidden pointer-events-auto w-14 py-4 px-1 border border-white/10 flex flex-col items-center justify-center"
          style={navStyle}
        >
          <div className="flex flex-col justify-center items-center gap-3">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const Icon = (item.icon && TYPE_ICONS[item.icon]) || TYPE_ICONS[item.type || ''] || Home;
              const inactiveColorStyle = inactiveColor || defaultInactive;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0"
                  )}
                  style={isActive ? { 
                    backgroundColor: defaultActiveBg,
                    color: defaultActiveColor
                  } : { 
                    color: inactiveColorStyle 
                  }}
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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Render Horizontal Menu for Mobile View ──
  let horizontalNavStyle: React.CSSProperties = {};
  if (bgType === 'gradient') {
    horizontalNavStyle = {
      backgroundImage: `linear-gradient(to right, ${cleanBgColor}${opacityHex}, ${cleanBgColor2}${opacityHex})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };
  } else {
    horizontalNavStyle = {
      backgroundColor: `${cleanBgColor}${opacityHex}`,
    };
  }

  return (
    <>
      <div 
        className={cn(
          position === 'absolute' ? 'absolute' : 'fixed',
          "bottom-6 left-1/2 -translate-x-1/2 w-full px-4 z-[999] pointer-events-none"
        )} 
        style={{ maxWidth: '700px' }}
      >
        <div className="w-fit max-w-full mx-auto backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto" style={horizontalNavStyle}>
          <div className="flex justify-center items-center h-16 px-4 overflow-x-auto no-scrollbar gap-3 md:gap-4">
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
