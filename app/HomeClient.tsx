"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Heart, Scissors, Gift, LayoutGrid, Send, MessageSquare } from "lucide-react";
import Link from "next/link";

// Sections
import HeroSection from "@/components/sections/HeroSection";
import InvitationStatsSection from "@/components/sections/InvitationStatsSection";
import InvitationFeaturesSection from "@/components/sections/InvitationFeaturesSection";
import ThemeShowcaseSection from "@/components/sections/ThemeShowcaseSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import TestimonialsSection from "@/components/sections/testimoni";
import FAQSection from "@/components/sections/FAQSection";
import SectionCTA from "@/components/sections/SectionCTA";
import FooterSection from "@/components/sections/FooterSection";
import { Toaster } from "@/components/ui/toaster";

const WA_LINK = "https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20buat%20undangan%20digital";

const navLinks = [
  { name: "Fitur", href: "#fitur-undangan" },
  { name: "Tema", href: "/katalog" },
  { name: "Cara Kerja", href: "#cara-kerja" },
  { name: "FAQ", href: "#faq" },
  {
    name: "Jenis Undangan",
    href: "#jenis",
    children: [
      { name: "Undangan Pernikahan", href: "/undangan-pernikahan", icon: Heart },
      { name: "Undangan Khitanan", href: "/undangan-khitanan", icon: Scissors },
      { name: "Undangan Ulang Tahun", href: "/undangan-ulang-tahun", icon: Gift },
      { name: "Katalog Semua Tema", href: "/katalog", icon: LayoutGrid },
    ],
  },
];

function gtagConversion(url: string, label: string) {
  const navigate = () => {
    if (!url) return;
    if (/^https?:\/\//.test(url)) {
      try { window.open(url, "_blank"); } catch { window.location.href = url; }
    } else {
      window.location.href = url;
    }
  };
  if (typeof window === "undefined") return;
  const isReady = !!(window as any).gtag;
  if (!isReady) { navigate(); return; }
  let done = false;
  const cb = () => { if (done) return; done = true; navigate(); };
  try {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-674897184/BcVHCNOC-KkaEKC66MEC",
      event_label: label,
      value: 1.0,
      currency: "IDR",
      event_callback: cb,
    });
  } catch { cb(); }
  setTimeout(() => { if (!done) { done = true; navigate(); } }, 1000);
}

function Header({ isCTAActive }: { isCTAActive?: boolean }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleScroll = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
      setIsMobileOpen(false);
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[100] border-b border-rose-100/60 shadow-2xs pointer-events-auto"
      style={{
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isCTAActive ? -110 : 0, opacity: isCTAActive ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="Papunda – Undangan Digital" width={120} height={40} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.name} className="relative group">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50/80 transition-all"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.name}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-slate-400" />
                </button>
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 min-w-[220px] z-50"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.children.map((child) => {
                        const Icon = child.icon;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium"
                          >
                            <Icon className="w-4 h-4 text-rose-500" />
                            {child.name}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : link.href.startsWith("#") ? (
              <button
                key={link.name}
                onClick={() => handleScroll(link.href)}
                className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50/80 transition-all"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50/80 transition-all"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-full px-4 py-1.5 text-xs font-bold transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            Tanya Admin
          </a>
          <button
            onClick={() => gtagConversion("/admin", "header_cta_buat_gratis")}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-5 py-2 text-xs font-bold shadow-md shadow-rose-200 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Buat Undangan
          </button>
        </div>

        {/* Mobile CTA & Burger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full py-1.5 px-3.5 text-xs font-bold shadow-md"
            onClick={() => gtagConversion("/admin", "header_mobile_buat_gratis")}
          >
            <Send className="w-3 h-3" />
            Buat Gratis
          </button>
          <button
            className="border border-rose-200 text-slate-600 rounded-full p-2 hover:bg-rose-50 transition-all"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-rose-100 bg-white/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.name}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1">
                      {link.name}
                    </p>
                    {link.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-all"
                        >
                          <Icon className="w-3.5 h-3.5 text-rose-500" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                ) : link.href.startsWith("#") ? (
                  <button
                    key={link.name}
                    onClick={() => handleScroll(link.href)}
                    className="w-full text-left block px-3 py-2 text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-3 py-2 text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all"
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-emerald-300 text-emerald-600 rounded-full py-2 font-bold text-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Tanya Admin via WA
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default function HomeClient() {
  const [isCTAActive, setIsCTAActive] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCTAActive(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-[#fffafb] text-slate-900 min-h-screen">
      <Header isCTAActive={isCTAActive} />

      {/* Streamlined Light Mode Card Stacking */}
      <main className="stacked-card-container pt-24 pb-16 space-y-16">
        
        {/* Card 1: Hero */}
        <div className="stacked-card z-10" style={{ top: "5.5rem" }}>
          <HeroSection />
        </div>

        {/* Card 2: Fitur Unggulan (WA Broadcast Mockup - Light Version) */}
        <div className="stacked-card z-20" id="fitur-undangan" style={{ top: "5.5rem" }}>
          <InvitationFeaturesSection />
        </div>

        {/* Card 3: Showcase Tema (Informasi & Katalog CTA) */}
        <div className="stacked-card z-30" style={{ top: "5.5rem" }}>
          <ThemeShowcaseSection />
        </div>

        {/* Card 4: Cara Kerja & 3 Langkah */}
        <div className="stacked-card z-40" id="cara-kerja" style={{ top: "5.5rem" }}>
          <HowItWorksSection />
        </div>

        {/* Card 5: FEATURE 04 - Immersive Fullscreen CTA */}
        <div ref={ctaRef} className="stacked-card z-50" id="faq" style={{ top: "5.5rem" }}>
          <SectionCTA />
        </div>

      </main>

      <FooterSection />
      <Toaster />
    </div>
  );
}
