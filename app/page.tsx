"use client";

import { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ThemesSection from "@/components/sections/ThemesSection";
import InstructionsSection from "@/components/sections/InstructionsSection";
import PricingSection from "@/components/sections/PricingSection";
import FooterSection from "@/components/sections/FooterSection";
import SectionCTA from "@/components/sections/SectionCTA";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from 'next/image';
import { Menu, X, Phone, BadgeCheck, LogIn } from "lucide-react";
import Link from "next/link";
import TestimonialsSection from "@/components/sections/testimoni";

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: "Kontak", href: "https://wa.me/6289654728249" },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm md:text-base text-pink-700 hover:text-blue-500 transition-colors duration-300">
      {children}
    </Link>
  );
}

function DropdownMenu({ items }: { items: NavItem[] }) {
  return (
    <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 min-w-[150px] group-hover:block hidden">
      {items.map((item) => (
        <Link key={item.name} href={item.href} className="block px-4 py-2 text-sm md:text-base text-slate-700 hover:bg-slate-100 transition-colors duration-300">
          {item.name}
        </Link>
      ))}
    </div>
  );
}

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tambahkan fungsi tracking Google Ads conversion
  function gtag_report_conversion(url: string, label: string) {
    if (typeof window === 'undefined' || !(window as any).gtag) {
      window.location.href = url;
      return;
    }
    const callback = function () {
      if (typeof url !== 'undefined') {
        window.location.href = url;
      }
    };
    (window as any).gtag('event', 'conversion', {
      'send_to': 'AW-674897184/BcVHCNOC-KkaEKC66MEC',
      'event_label': label,
      'value': 1.0,
      'currency': 'IDR',
      'transaction_id': '',
      'event_callback': callback,
    });
    return false;
  }

  return (
    <motion.header
      className="sticky top-0 z-20 shadow-sm"
      style={{
        background: 'rgba(255, 246, 247, 0.8)', // Warna pink dengan sedikit transparansi
        backdropFilter: 'blur(10px)', // Efek blur
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
        <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} />

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4">
          <a
            href={navigation[0].href}
            className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-pink-50"
            onClick={e => {
              e.preventDefault();
              gtag_report_conversion(navigation[0].href, 'cta_header_wa');
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Minta dibuatkan
          </a>
          <a
            href="/admin"
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center"
            onClick={e => {
              e.preventDefault();
              gtag_report_conversion('/admin', 'cta_header_admin');
            }}
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            Coba Gratis Sekarang!
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <a
            href={navigation[0].href}
            className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all p-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-pink-50"
            aria-label="Hubungi Admin"
            onClick={e => {
              e.preventDefault();
              gtag_report_conversion(navigation[0].href, 'cta_header_wa');
            }}
          >
            <Phone className="w-5 h-5" />
          </a>
          <a
            href="/admin"
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all p-2 font-semibold whitespace-nowrap inline-flex items-center"
            aria-label="Coba Gratis"
            onClick={e => {
              e.preventDefault();
              gtag_report_conversion('/admin', 'cta_header_admin');
            }}
          >
            <LogIn className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection/>
      <InstructionsSection />
      <PricingSection />
      <SectionCTA />
      <FooterSection />
      <Toaster />
    </main>
  );
}