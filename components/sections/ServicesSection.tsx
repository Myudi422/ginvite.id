"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    icon: "🎉",
    title: "Event Organizer",
    description: "Pengelolaan acara dari A-Z. Konsep, dekorasi, rundown, koordinasi vendor — semua kami handle.",
    border: "border-pink-200 hover:border-pink-400",
    iconBg: "bg-pink-50",
    tag: "Unggulan",
    href: "#layanan",
  },
  {
    icon: "💒",
    title: "Wedding & Ceremony",
    description: "Paket pernikahan lengkap. WO, dekorasi, katering, dokumentasi, MC, dan undangan digital.",
    border: "border-rose-200 hover:border-rose-400",
    iconBg: "bg-rose-50",
    tag: "Populer",
    href: "#layanan",
  },
  {
    icon: "📸",
    title: "Content Creator",
    description: "Dokumentasi kreatif Family Gathering, corporate event, dan konten sosial media profesional.",
    border: "border-pink-200 hover:border-pink-300",
    iconBg: "bg-pink-50",
    tag: null,
    href: "#layanan",
  },
  {
    icon: "🎭",
    title: "Pentas Seni",
    description: "Panggung hiburan, performance seni, tari, musik, dan entertainment untuk acara budaya.",
    border: "border-fuchsia-200 hover:border-fuchsia-400",
    iconBg: "bg-fuchsia-50",
    tag: null,
    href: "#layanan",
  },
  {
    icon: "🎤",
    title: "MC Ulang Tahun",
    description: "MC profesional dan energik untuk pesta ulang tahun anak maupun dewasa yang berkesan.",
    border: "border-pink-200 hover:border-pink-400",
    iconBg: "bg-pink-50",
    tag: null,
    href: "#layanan",
  },
  {
    icon: "🎮",
    title: "Ice Breaking Games",
    description: "Games interaktif seru untuk team building, gathering, seminar, dan acara perusahaan.",
    border: "border-rose-200 hover:border-rose-300",
    iconBg: "bg-rose-50",
    tag: null,
    href: "#layanan",
  },
  {
    icon: "💌",
    title: "Undangan Digital",
    description: "Buat undangan pernikahan, khitanan & ulang tahun online. Gratis uji coba, 5 menit jadi!",
    border: "border-pink-300 hover:border-pink-500",
    iconBg: "bg-pink-50",
    tag: "Gratis Coba",
    href: "/admin",
  },
  {
    icon: "✨",
    title: "Jasa Edit Foto",
    description: "Retouching dan editing foto acara, prewedding, dan portofolio secara profesional.",
    border: "border-fuchsia-200 hover:border-fuchsia-300",
    iconBg: "bg-fuchsia-50",
    tag: null,
    href: "/photo-editing",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function ServicesSection() {
  return (
    <section id="layanan" className="py-20 md:py-28 px-4 bg-white relative overflow-hidden">
      {/* Subtle pink blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            🌟 Semua Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Papunda Bisa{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Apa Aja?
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Dari undangan digital hingga event organizer skala besar — satu tim kreatif Papunda siap wujudkan semua acara spesialmu.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {services.map((s, idx) => (
            <motion.a
              key={idx}
              href={s.href}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative group flex flex-col gap-4 p-6 rounded-2xl border-2 bg-white cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg ${s.border}`}
            >
              {s.tag && (
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full">
                  {s.tag}
                </span>
              )}
              <div className={`w-13 h-13 w-12 h-12 rounded-2xl ${s.iconBg} border border-pink-100 flex items-center justify-center text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                {s.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1.5 leading-tight">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-pink-300 group-hover:text-pink-500 transition-colors">
                Selengkapnya
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-400 mb-4">Tidak yakin layanan mana yang kamu butuhkan?</p>
          <a
            href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20ingin%20konsultasi%20layanan%20event"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Konsultasi Gratis via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
