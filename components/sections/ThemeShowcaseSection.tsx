"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const themes = [
  {
    name: "Floral Elegance",
    category: "💒 Pernikahan",
    color: "from-rose-300 to-pink-400",
    accent: "bg-rose-50",
    tags: ["Elegan", "Romantis"],
    preview: "🌸",
  },
  {
    name: "Sakura Dreams",
    category: "💒 Pernikahan",
    color: "from-pink-300 to-fuchsia-400",
    accent: "bg-pink-50",
    tags: ["Modern", "Minimalis"],
    preview: "🌺",
  },
  {
    name: "Royal Kids",
    category: "🎂 Ulang Tahun",
    color: "from-amber-300 to-orange-400",
    accent: "bg-amber-50",
    tags: ["Ceria", "Colorful"],
    preview: "🎉",
  },
  {
    name: "Islamic Gold",
    category: "✂️ Khitanan",
    color: "from-emerald-300 to-teal-400",
    accent: "bg-emerald-50",
    tags: ["Islami", "Premium"],
    preview: "✨",
  },
  {
    name: "Vintage Romance",
    category: "💒 Pernikahan",
    color: "from-violet-300 to-purple-400",
    accent: "bg-violet-50",
    tags: ["Vintage", "Classy"],
    preview: "💜",
  },
  {
    name: "Garden Party",
    category: "🌿 Aqiqah",
    color: "from-green-300 to-emerald-400",
    accent: "bg-green-50",
    tags: ["Natural", "Segar"],
    preview: "🌿",
  },
];

function ThemeCard({ theme, index }: { theme: typeof themes[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 overflow-hidden transition-all duration-300"
    >
      {/* Preview area */}
      <div className={`h-40 bg-gradient-to-br ${theme.color} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/5" />
        <div className="text-6xl">{theme.preview}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white text-slate-800 font-bold text-xs px-4 py-2 rounded-full shadow-lg">
            👁 Preview Tema
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-slate-800 text-sm">{theme.name}</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">{theme.category}</span>
        <div className="flex gap-1.5 mt-2">
          {theme.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-pink-50 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-full font-semibold">
              {tag}
            </span>
          ))}
        </div>

        {/* Action */}
        <Link
          href="/katalog"
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200"
        >
          Gunakan Tema Ini
        </Link>
      </div>
    </motion.div>
  );
}

export default function ThemeShowcaseSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-pink-50/50 via-white to-rose-50/30 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-pink-100/50 to-rose-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            🎨 Pilihan Tema
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Pilih Tema yang{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Paling Cocok
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Setiap tema dirancang dengan detail dan karakter yang berbeda. Tinggal pilih, sesuaikan, dan bagikan!
          </p>
        </motion.div>

        {/* Theme grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {themes.map((theme, i) => (
            <ThemeCard key={theme.name} theme={theme} index={i} />
          ))}
        </div>

        {/* Explore all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 p-8 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100 border border-pink-200"
        >
          <p className="text-slate-600 font-semibold mb-1">Ini baru sebagian kecil dari koleksi kami</p>
          <p className="text-slate-400 text-sm mb-5">Jelajahi 100+ tema premium untuk semua jenis acara</p>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            🖼️ Jelajahi Semua Tema
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
