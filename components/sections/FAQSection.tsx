"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Apakah benar-benar bisa coba gratis?",
    a: "Ya! Kamu bisa langsung buat undangan digital tanpa perlu bayar lebih dulu. Lihat tampilan undanganmu, cek semua fitur, dan baru bayar kalau sudah puas dengan hasilnya.",
    cat: "Gratis",
  },
  {
    q: "Jenis acara apa saja yang bisa dibuat undangannya?",
    a: "Papunda mendukung semua jenis acara: pernikahan, khitanan, ulang tahun, aqiqah, tasmiyah, syukuran, launching event, dan masih banyak lagi. Semua tersedia dalam ratusan pilihan tema.",
    cat: "Layanan",
  },
  {
    q: "Apakah desain undangan bisa diubah-ubah?",
    a: "Bisa! Kamu bebas mengedit nama, tanggal, lokasi, foto, musik, dan semua konten undangan kapan saja selama masa aktif. Revisi tidak dibatasi.",
    cat: "Edit",
  },
  {
    q: "Bagaimana cara mengirim undangan ke tamu?",
    a: "Cukup masukkan daftar nama tamu, lalu kirim link undangan yang sudah dipersonalisasi lewat WhatsApp. Setiap tamu mendapat undangan dengan nama mereka sendiri — terasa lebih sopan dan personal.",
    cat: "Kirim",
  },
  {
    q: "Apakah ada fitur RSVP untuk konfirmasi kehadiran?",
    a: "Ada! Tamu bisa langsung konfirmasi hadir/tidak hadir dari halaman undangan. Semua data kehadiran terkumpul otomatis dan bisa kamu pantau di dashboard.",
    cat: "RSVP",
  },
  {
    q: "Berapa harga untuk paket berbayar?",
    a: "Harga paket undangan Papunda sangat terjangkau mulai dari Rp 50.000. Cek detail harga dan fitur tiap paket di halaman undangan digital kami, atau hubungi admin untuk info lengkap.",
    cat: "Harga",
  },
  {
    q: "Apakah undangan bisa menggunakan domain sendiri?",
    a: "Bisa! Kamu bisa menggunakan domain custom untuk tampil lebih eksklusif. Misalnya: nama pasangan.papunda.com atau domain pribadi. Hubungi admin untuk pengaturan ini.",
    cat: "Domain",
  },
  {
    q: "Bagaimana cara menghubungi Papunda jika perlu bantuan?",
    a: "Tim Papunda siap membantu lewat WhatsApp setiap hari. Cukup klik tombol 'Hubungi Admin' dan ceritakan kebutuhan kamu — kami akan bantu dari awal sampai undangan siap terkirim!",
    cat: "Bantuan",
  },
];

const catColors: Record<string, string> = {
  Gratis: "bg-emerald-100 text-emerald-700",
  Layanan: "bg-pink-100 text-pink-700",
  Edit: "bg-violet-100 text-violet-700",
  Kirim: "bg-blue-100 text-blue-700",
  RSVP: "bg-orange-100 text-orange-700",
  Harga: "bg-amber-100 text-amber-700",
  Domain: "bg-fuchsia-100 text-fuchsia-700",
  Bantuan: "bg-teal-100 text-teal-700",
};

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 px-4 bg-gradient-to-b from-white to-rose-50/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            ❓ FAQ Undangan Digital
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Pertanyaan{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              yang Sering Ditanya
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Tidak menemukan jawaban yang kamu cari? Langsung tanya admin kami via WhatsApp!
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 group ${
                  openIdx === idx
                    ? "border-pink-300 bg-pink-50 shadow-md shadow-pink-100"
                    : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/30"
                }`}
              >
                <span className={`flex-shrink-0 mt-0.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${catColors[faq.cat] || "bg-slate-100 text-slate-600"}`}>
                  {faq.cat}
                </span>
                <span className={`flex-1 font-semibold text-sm md:text-base leading-snug transition-colors ${openIdx === idx ? "text-pink-700" : "text-slate-800"}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`flex-shrink-0 w-5 h-5 mt-0.5 transition-transform duration-300 ${openIdx === idx ? "rotate-180 text-pink-500" : "text-slate-400"}`} />
              </button>

              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pt-3 pb-5 text-sm text-slate-600 leading-relaxed border-2 border-t-0 border-pink-200 rounded-b-2xl bg-pink-50/50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 p-8 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-100 border-2 border-pink-200"
        >
          <p className="font-bold text-slate-700 mb-2">Masih ada pertanyaan tentang undangan digital?</p>
          <p className="text-sm text-slate-500 mb-5">Admin kami siap membantu kamu dari pilih tema sampai undangan terkirim ke tamu.</p>
          <a
            href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20tanya%20tentang%20undangan%20digital"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Tanya Admin via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
