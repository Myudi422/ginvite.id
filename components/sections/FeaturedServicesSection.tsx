"use client";

import { motion } from "framer-motion";

const featured = [
  {
    emoji: "🎉",
    title: "Event Organizer",
    subtitle: "Semua Jenis Acara",
    desc: "Papunda hadir sebagai EO profesional untuk corporate event, gathering keluarga, reuni, wisuda, peresmian, hingga acara komunitas. Tim kami handle dari konsep, dekorasi, vendor, hingga dokumentasi.",
    highlights: ["Konsep Custom", "Koordinasi Vendor", "Dekorasi & Setting", "Rundown Profesional", "Dokumentasi"],
    accentFrom: "from-pink-500",
    accentTo: "to-rose-500",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    tag: "Terlengkap",
  },
  {
    emoji: "💒",
    title: "Wedding & Ceremony",
    subtitle: "WCC Paket Lengkap",
    desc: "Momen sekali seumur hidup harus sempurna. Papunda WCC menyediakan paket pernikahan lengkap — dari akad hingga resepsi, tradisional hingga modern, intimate hingga grand ballroom.",
    highlights: ["Wedding Organizer", "Dekorasi Pelaminan", "Katering", "Dokumentasi Premium", "Undangan Digital"],
    accentFrom: "from-rose-500",
    accentTo: "to-pink-600",
    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    tag: "Spesial",
  },
  {
    emoji: "🎤",
    title: "MC & Entertainment",
    subtitle: "Host + Ice Breaking Games",
    desc: "MC profesional untuk ulang tahun, arisan, gathering, seminar, dan acara apapun. Lengkap dengan Ice Breaking Games interaktif yang bikin peserta antusias dan terlibat aktif.",
    highlights: ["MC Profesional", "Ice Breaking Games", "Kuis & Doorprize", "Team Building", "Script Terstruktur"],
    accentFrom: "from-fuchsia-500",
    accentTo: "to-pink-500",
    bg: "bg-gradient-to-br from-fuchsia-50 to-pink-50",
    tag: "Seru",
  },
  {
    emoji: "📸",
    title: "Content Creator",
    subtitle: "Family Gathering & Pentas Seni",
    desc: "Abadikan momen berharga dengan sentuhan kreatif. Papunda Content Creator menyediakan jasa dokumentasi foto & video untuk family gathering, pentas seni, dan produksi konten sosial media.",
    highlights: ["Foto & Video Kreatif", "Reels & Konten", "Editing Profesional", "Live Streaming", "Pentas Seni"],
    accentFrom: "from-pink-400",
    accentTo: "to-fuchsia-500",
    bg: "bg-gradient-to-br from-pink-50 to-fuchsia-50",
    tag: "Kreatif",
  },
];

export default function FeaturedServicesSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-pink-50/40 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,207,232,0.3),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-rose-200">
            ⭐ Layanan Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Empat Pilar{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Layanan Papunda
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Layanan utama kami yang telah dipercaya ratusan klien di berbagai kota.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
          {featured.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative group rounded-3xl border border-pink-100 p-7 shadow-sm hover:shadow-xl transition-all duration-300 ${item.bg}`}
            >
              <span className={`absolute top-5 right-5 text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r ${item.accentFrom} ${item.accentTo}`}>
                {item.tag}
              </span>

              <div className="flex items-start gap-4 mb-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.accentFrom} ${item.accentTo} flex items-center justify-center text-3xl shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                  {item.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight">{item.title}</h3>
                  <p className={`text-sm font-semibold bg-gradient-to-r ${item.accentFrom} ${item.accentTo} bg-clip-text text-transparent`}>
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5">{item.desc}</p>

              <ul className="flex flex-wrap gap-2">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white/80 border border-pink-100 rounded-full px-2.5 py-1">
                    <span className="text-pink-400">✓</span> {h}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20tertarik%20layanan%20event"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r ${item.accentFrom} ${item.accentTo} bg-clip-text text-transparent hover:opacity-70 transition-opacity`}
              >
                Konsultasi Sekarang
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
