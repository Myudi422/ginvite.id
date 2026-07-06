"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    icon: "🏆",
    title: "Tim Berpengalaman",
    desc: "Telah menangani ratusan acara dari berbagai skala — dari intimate gathering hingga event besar.",
  },
  {
    icon: "🎯",
    title: "One-Stop Solution",
    desc: "Satu tim, semua layanan. Tidak perlu cari-cari vendor satu per satu. Papunda koordinasi semuanya.",
  },
  {
    icon: "💬",
    title: "Responsif & Komunikatif",
    desc: "Fast respon via WhatsApp. Update perkembangan persiapan acara secara rutin dan transparan.",
  },
  {
    icon: "💰",
    title: "Harga Transparan",
    desc: "Tidak ada biaya tersembunyi. Proposal detail, harga jelas, dan bisa disesuaikan dengan budget.",
  },
  {
    icon: "🎨",
    title: "Konsep Custom",
    desc: "Kami dengarkan visimu dan wujudkan konsep acara yang unik, personal, dan berkesan.",
  },
  {
    icon: "📍",
    title: "Berbagai Kota",
    desc: "Berbasis di Bogor, melayani Jabodetabek dan siap handle event di kota lainnya.",
  },
];

const stats = [
  { number: "200+", label: "Acara Sukses", icon: "🎉" },
  { number: "98%", label: "Klien Puas", icon: "⭐" },
  { number: "5+", label: "Tahun Pengalaman", icon: "🏆" },
  { number: "15+", label: "Jenis Layanan", icon: "✨" },
];

export default function WhyPapundaSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,207,232,0.4),transparent_65%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200 shadow-sm">
            💎 Keunggulan Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Mengapa Pilih{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Papunda?
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Lebih dari sekadar jasa event. Kami adalah partner kreatif yang peduli setiap detail momen spesialmu.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center py-6 px-4 rounded-2xl bg-white border border-pink-100 shadow-sm"
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-black text-pink-600 mb-1">{stat.number}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Reason Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all duration-300 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 border border-pink-200 flex items-center justify-center text-2xl flex-shrink-0">
                {reason.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1.5">{reason.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-14 py-8 px-6 rounded-3xl bg-white border border-pink-100 shadow-sm max-w-2xl mx-auto"
        >
          <blockquote className="text-xl md:text-2xl font-serif italic text-slate-600 leading-relaxed">
            "Setiap acara adalah sebuah karya. Biarkan kami yang mewujudkannya."
          </blockquote>
          <p className="text-sm text-pink-500 font-semibold mt-3">— Tim Papunda 💗</p>
        </motion.div>
      </div>
    </section>
  );
}
