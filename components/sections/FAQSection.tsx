"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";

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
    <div className="w-full p-6 sm:p-10 md:p-12 bg-[#0f172a] text-white rounded-[2.25rem] overflow-hidden relative border border-slate-800">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
      >
        <span className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-rose-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
          FAQ Undangan Digital
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 leading-tight">
          Pertanyaan{" "}
          <span className="text-rose-400">
            Sering Diajukan
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          Punya pertanyaan seputar cara pemesanan, kustomisasi, atau pembayaran? Temukan jawabannya di sini.
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-white hover:text-rose-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-3 ${isOpen ? "rotate-180 text-rose-400" : ""}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-slate-800"
                  >
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-400 leading-relaxed font-light bg-slate-950/40">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Contact WA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center mt-10 sm:mt-12 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xl mx-auto"
      >
        <p className="text-white font-bold text-sm sm:text-base mb-1">Punya Pertanyaan Lain?</p>
        <p className="text-slate-400 text-xs sm:text-sm mb-4 font-light">Tim customer care Papunda siap membantu kamu kapan saja.</p>
        <a
          href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20tanya%20tentang%20undangan%20digital"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-emerald-950/40 transition-all text-xs sm:text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          Tanya Admin via WhatsApp
        </a>
      </motion.div>

    </div>
  );
}
