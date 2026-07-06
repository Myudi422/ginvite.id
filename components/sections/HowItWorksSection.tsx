"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: "💬",
    title: "Konsultasi Gratis",
    desc: "Hubungi tim Papunda via WhatsApp. Ceritakan acara yang kamu rencanakan — jenis acara, tanggal, lokasi, jumlah tamu, dan budget. 100% gratis, tanpa tekanan.",
    detail: "Respon cepat & informatif",
    highlight: false,
  },
  {
    step: "02",
    icon: "📋",
    title: "Penawaran & Proposal",
    desc: "Tim kami menyusun proposal dan estimasi harga sesuai kebutuhanmu. Kamu bebas request revisi konsep dan memilih paket yang paling cocok.",
    detail: "Proposal detail dalam 1x24 jam",
    highlight: false,
  },
  {
    step: "03",
    icon: "🤝",
    title: "Deal & DP (Down Payment)",
    desc: "Setelah deal harga dan konsep, lakukan pembayaran DP untuk mengamankan tanggal acaramu. DP minimal 50% dari total biaya. Sisa dibayarkan H-7 atau sesuai kesepakatan.",
    detail: "DP min. 50% • Tanggal aman terkunci",
    highlight: true,
  },
  {
    step: "04",
    icon: "🎬",
    title: "Persiapan & Koordinasi",
    desc: "Tim Papunda mulai bekerja — survei lokasi, koordinasi vendor, persiapan dekorasi, rundown, dan briefing tim. Kamu diupdate perkembangan secara berkala via WA grup.",
    detail: "Koordinasi transparan & terstruktur",
    highlight: false,
  },
  {
    step: "05",
    icon: "🌟",
    title: "Hari H — Eksekusi!",
    desc: "Tim profesional Papunda hadir di lokasi tepat waktu. Semua berjalan sesuai rundown, kamu tinggal menikmati momen spesialmu bersama orang-orang tercinta.",
    detail: "Tim on-site dari awal hingga akhir",
    highlight: false,
  },
  {
    step: "06",
    icon: "📦",
    title: "Hasil & Dokumentasi",
    desc: "Setelah acara, kamu menerima seluruh hasil dokumentasi, file foto/video yang telah diedit, dan laporan acara. Pelunasan sisa biaya dilakukan setelah hasil diterima.",
    detail: "Hasil dikirim dalam 3-7 hari kerja",
    highlight: false,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="alur-pemesanan" className="py-20 md:py-28 px-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            📋 Alur Pemesanan
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Cara Pesan Jasa{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Papunda
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Proses yang transparan, simpel, dan terpercaya. Dari konsultasi pertama hingga acara selesai.
          </p>
        </motion.div>

        {/* DP Info Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-5 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl flex-shrink-0 shadow-md">
            💡
          </div>
          <div>
            <h3 className="font-bold text-pink-800 mb-1">Sistem Pembayaran Papunda</h3>
            <p className="text-sm text-pink-700 leading-relaxed">
              <strong>DP minimal 50%</strong> di awal untuk pengamanan tanggal acara •{" "}
              <strong>Sisa 50%</strong> dibayarkan H-7 sebelum acara atau sesuai kesepakatan •{" "}
              Pembayaran via <strong>Transfer Bank / QRIS</strong>
            </p>
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`relative rounded-2xl border-2 p-6 bg-white transition-all duration-300 hover:shadow-lg ${
                step.highlight
                  ? "border-pink-400 ring-2 ring-pink-200 ring-offset-2"
                  : "border-pink-100 hover:border-pink-300"
              }`}
            >
              {/* Step number bubble */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-black text-sm mb-4 shadow-md shadow-pink-200">
                {step.step}
              </div>

              {step.highlight && (
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  Penting!
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{step.icon}</span>
                <h3 className="font-bold text-slate-800 text-base leading-tight">{step.title}</h3>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-4">{step.desc}</p>

              <span className="inline-flex items-center text-[11px] font-semibold border border-pink-200 text-pink-600 bg-pink-50 rounded-full px-3 py-1">
                ✓ {step.detail}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-5 text-sm">Siap mulai? Langkah pertama cukup chat kami!</p>
          <a
            href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi%20acara%20dulu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-base px-10 py-4 rounded-full shadow-xl shadow-pink-200 hover:shadow-pink-300 transition-all duration-300 hover:-translate-y-1"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Mulai Konsultasi Gratis Sekarang
          </a>
        </motion.div>
      </div>
    </section>
  );
}
