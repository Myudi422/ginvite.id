"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "👥",
    title: "Nama Tamu Otomatis",
    desc: "Setiap tamu menerima undangan personal dengan namanya sendiri. Kirim ke ribuan tamu tanpa ketik manual satu per satu.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-100 hover:border-rose-300",
  },
  {
    icon: "✅",
    title: "RSVP Online",
    desc: "Tamu konfirmasi kehadiran langsung dari undangan. Data kehadiran terkumpul otomatis di dashboard kamu.",
    color: "from-pink-400 to-fuchsia-500",
    bg: "bg-pink-50",
    border: "border-pink-100 hover:border-pink-300",
  },
  {
    icon: "🎨",
    title: "100+ Tema Premium",
    desc: "Pilih dari ratusan desain elegan untuk pernikahan, khitanan, ulang tahun, dan acara lainnya. Bisa dikustomisasi penuh.",
    color: "from-fuchsia-400 to-violet-500",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-100 hover:border-fuchsia-300",
  },
  {
    icon: "📲",
    title: "Kirim via WhatsApp",
    desc: "Sebar undangan ke semua tamu langsung dari WhatsApp. Satu klik, ribuan undangan terkirim dalam hitungan detik.",
    color: "from-emerald-400 to-green-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-300",
  },
  {
    icon: "🎵",
    title: "Musik Latar Bebas",
    desc: "Hidupkan suasana undangan dengan ratusan pilihan musik. Bisa upload lagu favorit sendiri dari SoundCloud.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100 hover:border-amber-300",
  },
  {
    icon: "🗺️",
    title: "Peta Lokasi & Countdown",
    desc: "Sertakan Google Maps otomatis agar tamu mudah menemukan venue. Lengkap dengan hitung mundur hari pernikahan.",
    color: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-100 hover:border-sky-300",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function InvitationFeaturesSection() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-50 rounded-full blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-80 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            ✨ Fitur Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Semua yang Kamu Butuhkan{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Ada di Sini
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Fitur lengkap untuk membuat undangan yang tidak hanya cantik, tapi juga fungsional dan mudah dikelola.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group bg-white border-2 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 ${f.border}`}
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              <div className="mt-4">
                <div className={`h-0.5 bg-gradient-to-r ${f.color} rounded-full w-8 group-hover:w-full transition-all duration-500`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/admin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-9 py-4 rounded-full shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 text-base"
          >
            💌 Coba Gratis — Tanpa Kartu Kredit
          </a>
        </motion.div>
      </div>
    </section>
  );
}
