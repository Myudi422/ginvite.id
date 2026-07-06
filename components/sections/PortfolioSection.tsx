"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Unsplash sample images — varied event types
const collage = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    label: "Wedding Ceremony",
    cat: "WCC",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    label: "Event Organizer",
    cat: "EO",
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    label: "Family Gathering",
    cat: "Gathering",
  },
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    label: "Pentas Seni",
    cat: "Seni",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    label: "MC Ulang Tahun",
    cat: "MC",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    label: "Team Building",
    cat: "Games",
  },
];

export default function PortfolioSection() {
  return (
    <section id="portofolio" className="py-20 md:py-28 px-4 bg-gradient-to-b from-pink-50/30 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            🎨 Portofolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Momen Berkesan{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Bersama Papunda
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Setiap event adalah cerita. Berikut sekilas momen spesial yang telah kami wujudkan.
          </p>
        </motion.div>

        {/* Spoiler Collage */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-pink-100"
        >
          {/* Photo Grid — 3 cols × 2 rows */}
          <div className="grid grid-cols-3 gap-1">
            {collage.map((item, idx) => (
              <div key={idx} className="relative h-52 md:h-64 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle label */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-2 left-3 text-white text-[11px] font-semibold drop-shadow">
                  {item.label}
                </span>
                <span className="absolute top-2 right-2 text-[9px] font-bold text-white bg-pink-500/80 px-1.5 py-0.5 rounded-full">
                  {item.cat}
                </span>
              </div>
            ))}
          </div>

          {/* Frosted gradient overlay — bottom 45% */}
          <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />

          {/* CTA centred inside the overlay */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-10">
            <p className="text-sm text-slate-500 font-medium">Lihat semua portofolio lengkap kami</p>
            <Link
              href="/portofolio"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-300 hover:shadow-pink-400 transition-all duration-300 hover:-translate-y-0.5"
            >
              🎨 Lihat Portofolio Lengkap
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* TikTok link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-slate-400 text-sm mb-3">
            🎬 Temukan behind the scenes di TikTok kami
          </p>
          <a
            href="https://www.tiktok.com/@papundastudio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-400 font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.86 4.86 0 01-1.01-.08z"/>
            </svg>
            @papundastudio di TikTok
          </a>
        </motion.div>
      </div>
    </section>
  );
}
