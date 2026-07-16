"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
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
      { name: "💒 Undangan Pernikahan", href: "/undangan-pernikahan" },
      { name: "✂️ Undangan Khitanan", href: "/undangan-khitanan" },
      { name: "🎂 Undangan Ulang Tahun", href: "/undangan-ulang-tahun" },
      { name: "🖼️ Katalog Semua Tema", href: "/katalog" },
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

function Header() {
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
      className="sticky top-0 z-50 shadow-sm"
      style={{
        background: "rgba(255, 246, 247, 0.92)",
        backdropFilter: "blur(14px)",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
                  className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50 transition-all"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.name}
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 min-w-[230px] z-50"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : link.href.startsWith("#") ? (
              <button
                key={link.name}
                onClick={() => handleScroll(link.href)}
                className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50 transition-all"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50 transition-all"
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
            className="flex items-center gap-2 border-2 border-green-400 text-green-600 hover:bg-green-50 rounded-full px-4 py-2 text-sm font-bold transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Tanya Admin
          </a>
          <button
            onClick={() => gtagConversion("/admin", "header_cta_buat_gratis")}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-5 py-2 text-sm font-bold shadow-md shadow-pink-200 transition-all"
          >
            💌 Buat Undangan
          </button>
        </div>

        {/* Mobile CTA & Burger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full py-2 px-4 text-xs font-bold shadow-md"
            onClick={() => gtagConversion("/admin", "header_mobile_buat_gratis")}
          >
            💌 Buat Gratis
          </button>
          <button
            className="border-2 border-pink-200 text-slate-600 rounded-full p-2 hover:bg-pink-50 transition-all"
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
            className="md:hidden overflow-hidden border-t border-pink-100 bg-white/95 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.name}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 pt-3 pb-1">
                      {link.name}
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="block px-3 py-2.5 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-all"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : link.href.startsWith("#") ? (
                  <button
                    key={link.name}
                    onClick={() => handleScroll(link.href)}
                    className="w-full text-left block px-3 py-2.5 text-sm text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all"
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
                  className="w-full flex items-center justify-center gap-2 border-2 border-green-400 text-green-600 rounded-full py-2.5 font-bold text-sm"
                >
                  💬 Tanya Admin via WA
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
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* 1. Hero — full screen, undangan digital */}
      <HeroSection />

      {/* 2. Stats + Tag cloud */}
      <InvitationStatsSection />

      {/* 3. Fitur unggulan */}
      <section id="fitur-undangan">
        <InvitationFeaturesSection />
      </section>

      {/* 4. Showcase tema */}
      <ThemeShowcaseSection />

      {/* 5. Cara kerja — 3 langkah */}
      <HowItWorksSection />

      {/* 6. Testimoni */}
      <TestimonialsSection />

      {/* 7. FAQ undangan digital */}
      <FAQSection />

      {/* 8. CTA final */}
      <SectionCTA />

      {/* 9. Footer dark */}
      <FooterSection />

      <Toaster />
    </main>
  );
}
