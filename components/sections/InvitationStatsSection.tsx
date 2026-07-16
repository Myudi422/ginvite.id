"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10.000+", label: "Undangan Dibuat", icon: "💌", color: "from-rose-400 to-pink-500" },
  { value: "500rb+", label: "Tamu Dijangkau", icon: "👥", color: "from-pink-400 to-fuchsia-500" },
  { value: "100+", label: "Tema Premium", icon: "🎨", color: "from-fuchsia-400 to-violet-500" },
  { value: "5 Menit", label: "Waktu Buat", icon: "⚡", color: "from-amber-400 to-orange-500" },
];

const tags = [
  "💒 Pernikahan", "✂️ Khitanan", "🎂 Ulang Tahun", "🌿 Aqiqah",
  "🙏 Syukuran", "🚀 Launching", "📲 WA Ready", "✅ RSVP Online",
  "🎵 Musik Latar", "🖼️ Galeri Foto", "🗺️ Maps Lokasi", "📅 Countdown",
];

export default function InvitationStatsSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-white via-rose-50/30 to-pink-50/50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            🌟 Dipercaya Ribuan Pengguna
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-3">
            Sudah Ribuan{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Undangan Dikirim
            </span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-base">
            Bergabung bersama pengguna yang telah mempercayakan undangan spesial mereka ke Papunda
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group text-center bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-lg hover:shadow-pink-100 p-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mx-auto mb-3 shadow-md`}>
                {s.icon}
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-800 mb-1">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tag cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap justify-center gap-2.5"
        >
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-pink-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:border-pink-400 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
