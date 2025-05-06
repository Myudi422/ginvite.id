"use client";

import { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ThemesSection from "@/components/sections/ThemesSection";
import InstructionsSection from "@/components/sections/InstructionsSection";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: "Beranda", href: "#" },
  {
    name: "Kategori",
    href: "#",
    children: [
      { name: "Pernikahan", href: "#" },
      { name: "Ulang Tahun", href: "#" },
      { name: "Khitanan", href: "#" },
      { name: "Acara Lain", href: "#" },
    ],
  },
  { name: "Testimoni", href: "#" },
  { name: "Kontak", href: "#" },
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
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between"> {/* Padding vertikal lebih kecil di mobile */}
        {/* Logo (Sample) */}
        <Link href="#" className="font-bold text-xl text-pink-500">
          [Papunda]
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-700 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6"> {/* Spacing antar item disesuaikan */}
          {navigation.map((item) => (
            item.children ? (
              <div key={item.name} className="relative group"> {/* Tambahkan "relative group" di sini */}
                <NavLink href={item.href}>{item.name}</NavLink>
                <DropdownMenu items={item.children} />
              </div>
            ) : (
              <NavLink key={item.name} href={item.href}>{item.name}</NavLink>
            )
          ))}
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap"> {/* Padding dan whitespace tombol disesuaikan */}
            COBA Gratis
          </Button>
        </nav>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-md rounded-b-md py-2 flex flex-col items-center space-y-3"
          >
            {navigation.map((item) => (
              <div key={item.name} className="w-full text-center">
                <NavLink href={item.href}>{item.name}</NavLink>
                {item.children && (
                  <div className="flex flex-col items-center mt-2 space-y-2">
                    {item.children.map((child) => (
                      <NavLink key={child.name} href={child.href}>{child.name}</NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button className="w-auto bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap">
              COBA Gratis
            </Button>
          </motion.div>
        )}
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
      <ThemesSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <InstructionsSection />
      <Toaster />
    </main>
  );
}