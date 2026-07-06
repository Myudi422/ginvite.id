"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const categories = ["Semua", "Wedding", "Event Organizer", "Pentas Seni", "Gathering", "MC & Games", "Content Creator"];

const portfolio = [
  {
    cat: "Wedding",
    label: "Pernikahan Outdoor Garden",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
    size: "lg",
  },
  {
    cat: "Event Organizer",
    label: "Corporate Event & Gathering",
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Gathering",
    label: "Family Gathering Seru",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Pentas Seni",
    label: "Pentas Seni & Hiburan",
    src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=700&q=80",
    size: "lg",
  },
  {
    cat: "Wedding",
    label: "Intimate Wedding Indoor",
    src: "https://images.unsplash.com/photo-1606800794460-2f2f5cb4f44e?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "MC & Games",
    label: "MC Ulang Tahun & Games",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Gathering",
    label: "Team Building Kantor",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80",
    size: "lg",
  },
  {
    cat: "Pentas Seni",
    label: "Konser & Live Music",
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Wedding",
    label: "Garden Party Wedding",
    src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Content Creator",
    label: "Family Photo Session",
    src: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=700&q=80",
    size: "lg",
  },
  {
    cat: "Event Organizer",
    label: "Wisuda & Graduation Event",
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "MC & Games",
    label: "Ice Breaking Games Seru",
    src: "https://images.unsplash.com/photo-1560439513-74b037a25d84?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Content Creator",
    label: "Reels & Video Kreatif",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
    size: "lg",
  },
  {
    cat: "Wedding",
    label: "Akad Nikah Adat",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Event Organizer",
    label: "Seminar & Talkshow",
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=700&q=80",
    size: "md",
  },
  {
    cat: "Pentas Seni",
    label: "Parade & Festival Budaya",
    src: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=700&q=80",
    size: "lg",
  },
];

const sizeClass: Record<string, string> = {
  lg: "h-72",
  md: "h-52",
};

export default function PortofolioClient() {
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? portfolio : portfolio.filter((p) => p.cat === active);

  return (
    <main className="min-h-screen bg-white">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <img src="/logo.svg" alt="Papunda" width={110} height={36} />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-500 hover:text-pink-600 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative py-14 md:py-20 px-4 text-center bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-pink-200">
            🎨 Portofolio Papunda
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Momen Berkesan{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              yang Kami Wujudkan
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6">
            Dari pernikahan intimate hingga event besar — setiap momen adalah karya terbaik kami.
          </p>
          <a
            href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi%20acara"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Konsultasi Event Kamu
          </a>
        </div>
      </div>

      {/* Sticky category filter */}
      <div className="sticky top-[57px] z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100 py-3 px-4">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 whitespace-nowrap ${
                  active === cat
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-md shadow-pink-100"
                    : "bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-pink-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item, idx) => (
              <motion.div
                key={`${item.cat}-${item.label}`}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${sizeClass[item.size] || "h-52"}`}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow leading-tight">
                  {item.label}
                </span>
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-white bg-pink-500/90 px-2 py-0.5 rounded-full">
                  {item.cat}
                </span>
                {/* Hover CTA */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20tertarik%20konsultasi%20acara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-xs font-bold bg-pink-500/90 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 hover:bg-pink-600 transition-colors"
                  >
                    💬 Konsultasi
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Menampilkan <strong className="text-pink-500">{filtered.length}</strong> item
          {active !== "Semua" && ` dalam "${active}"`}
        </p>

        {/* Bottom CTA */}
        <div className="text-center mt-12 py-10 px-6 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
          <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Tertarik untuk Acara Kamu?</h2>
          <p className="text-slate-500 text-sm mb-6">Konsultasi gratis, ceritakan kebutuhanmu sekarang!</p>
          <a
            href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20lihat%20portofolio%20dan%20mau%20konsultasi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Konsultasi Gratis Sekarang
          </a>
        </div>
      </div>
    </main>
  );
}
