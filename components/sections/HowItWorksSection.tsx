"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "🎨",
    title: "Pilih Tema Favoritmu",
    desc: "Jelajahi 100+ template premium untuk pernikahan, khitanan, ulang tahun & lainnya. Semua siap pakai dan bisa dikustomisasi.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    number: "02",
    icon: "✏️",
    title: "Isi Detail Acara",
    desc: "Masukkan nama, tanggal, lokasi, dan upload foto. Tambahkan musik latar, galeri, peta Google Maps, dan hitung mundur hari H.",
    color: "from-pink-400 to-fuchsia-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    number: "03",
    icon: "📲",
    title: "Sebar ke Semua Tamu",
    desc: "Kirim undangan personal ke seluruh tamu lewat WhatsApp dengan nama mereka masing-masing. Satu klik, ribuan undangan terkirim!",
    color: "from-fuchsia-400 to-violet-500",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="relative py-20 md:py-28 px-4 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-50 rounded-full blur-3xl pointer-events-none opacity-70" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            ⚡ Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Hanya{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              3 Langkah Mudah
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Dari pilih tema hingga undangan terkirim — semua bisa selesai dalam hitungan menit, bukan jam.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-200 via-pink-300 to-fuchsia-200 mx-24" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-lg shadow-xl mb-6 z-10`}>
                  <span className="text-3xl">{step.icon}</span>
                  <span className={`absolute -top-1 -right-1 w-6 h-6 ${step.bg} border-2 ${step.border} rounded-full text-[10px] font-black flex items-center justify-center text-slate-700`}>
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className={`w-full bg-white border-2 ${step.border} rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-pink-50 transition-all duration-300 hover:-translate-y-1`}>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <p className="text-sm text-slate-400 mb-4">Gratis uji coba, tidak perlu kartu kredit, tidak perlu install apapun</p>
          <a
            href="/admin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-9 py-4 rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 text-base"
          >
            🚀 Mulai Buat Undangan — Gratis!
          </a>
        </motion.div>
      </div>
    </section>
  );
}
