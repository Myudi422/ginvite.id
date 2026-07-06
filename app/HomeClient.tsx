"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn, ChevronDown } from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturedServicesSection from "@/components/sections/FeaturedServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import WhyPapundaSection from "@/components/sections/WhyPapundaSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TestimonialsSection from "@/components/sections/testimoni";

import FAQSection from "@/components/sections/FAQSection";
import FooterSection from "@/components/sections/FooterSection";
import SectionCTA from "@/components/sections/SectionCTA";
import { Toaster } from "@/components/ui/toaster";

const navLinks = [
  { name: "Layanan", href: "#layanan" },
  { name: "Portofolio", href: "#portofolio" },
  { name: "Cara Pesan", href: "#alur-pemesanan" },
  { name: "FAQ", href: "#faq" },
  {
    name: "Undangan Digital",
    href: "#undangan",
    children: [
      { name: "💌 Buat Undangan Sendiri", href: "/admin" },
      { name: "💒 Undangan Pernikahan", href: "/undangan-pernikahan" },
      { name: "✂️ Undangan Khitanan", href: "/undangan-khitanan" },
      { name: "🎂 Undangan Ulang Tahun", href: "/undangan-ulang-tahun" },
      { name: "🖼️ Katalog Tema", href: "/katalog" },
    ],
  },
];

function gtag_report_conversion(url: string, label: string) {
  const navigate = () => {
    if (!url) return;
    if (/^https?:\/\//.test(url)) {
      try { window.open(url, "_blank"); } catch { window.location.href = url; }
    } else {
      window.location.href = url;
    }
  };
  if (typeof window === "undefined") return;
  const isGtagReady = !!(window as any).gtag;
  if (!isGtagReady) { navigate(); return; }
  let navigated = false;
  const callback = () => { if (navigated) return; navigated = true; navigate(); };
  try {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-674897184/BcVHCNOC-KkaEKC66MEC",
      event_label: label,
      value: 1.0,
      currency: "IDR",
      transaction_id: "",
      event_callback: callback,
    });
  } catch { callback(); }
  setTimeout(() => { if (!navigated) { navigated = true; navigate(); } }, 1000);
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
        background: "rgba(255, 246, 247, 0.88)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="Papunda Logo" width={120} height={40} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.name} className="relative group">
                <button
                  className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-pink-600 px-3 py-2 rounded-full hover:bg-pink-50 transition-all"
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
                      className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 min-w-[220px] z-50"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors font-medium"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                key={link.name}
                onClick={() => handleScroll(link.href)}
                className="text-sm font-semibold text-slate-600 hover:text-pink-600 px-3 py-2 rounded-full hover:bg-pink-50 transition-all"
              >
                {link.name}
              </button>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => gtag_report_conversion("https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi", "cta_header_wa")}
            className="flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full px-4 py-2 text-sm font-bold transition-all"
          >
            <Phone className="w-4 h-4" />
            Konsultasi Gratis
          </button>
          <button
            onClick={() => gtag_report_conversion("/admin", "cta_header_undangan")}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-4 py-2 text-sm font-bold shadow-md shadow-pink-200 transition-all"
          >
            💌 Buat Undangan
          </button>
        </div>

        {/* Mobile CTA & Burger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="border-2 border-green-500 text-green-600 rounded-full p-2 hover:bg-green-50 transition-all"
            onClick={() => gtag_report_conversion("https://wa.me/6289654728249", "cta_header_wa_mobile")}
            aria-label="WhatsApp"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full p-2 shadow-md transition-all"
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
                        className="block px-3 py-2.5 text-sm text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-medium transition-all"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleScroll(link.href)}
                    className="w-full text-left block px-3 py-2.5 text-sm text-slate-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl font-semibold transition-all"
                  >
                    {link.name}
                  </button>
                )
              )}
              <div className="pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => gtag_report_conversion("/admin", "cta_mobile_undangan")}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full py-3 font-bold text-sm shadow-md"
                >
                  💌 Buat Undangan Digital Gratis
                </button>
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
      <HeroSection />
      <ServicesSection />
      <FeaturedServicesSection />
      <WhyPapundaSection />
      <HowItWorksSection />
      <PortfolioSection />
      <TestimonialsSection />

      <FAQSection />
      <SectionCTA />
      <FooterSection />
      <Toaster />
    </main>
  );
}
