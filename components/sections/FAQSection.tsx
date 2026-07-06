"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Layanan apa saja yang Papunda bisa handle?",
    a: "Papunda melayani berbagai jenis event: Event Organizer umum, Wedding & Ceremony (WCC), Content Creator (family gathering, pentas seni), MC Ulang Tahun, Ice Breaking Games, Undangan Digital, dan Jasa Edit Foto. Hubungi kami untuk konsultasi sesuai kebutuhanmu!",
    cat: "Umum",
  },
  {
    q: "Berapa jauh hari sebelum acara harus booking?",
    a: "Idealnya minimal 2-4 minggu sebelum acara untuk event skala kecil-menengah, dan 1-3 bulan untuk wedding atau event besar. Semakin cepat kamu booking, semakin leluasa persiapannya. Namun kami juga menerima request mendadak sesuai ketersediaan tim.",
    cat: "Pemesanan",
  },
  {
    q: "Bagaimana sistem pembayaran dan DP-nya?",
    a: "Sistem pembayaran kami: DP minimal 50% di awal sebagai pengamanan tanggal acara, dan sisa 50% dibayarkan H-7 sebelum acara atau sesuai kesepakatan bersama. Pembayaran bisa via transfer bank (BCA, Mandiri, BRI) atau QRIS.",
    cat: "Pembayaran",
  },
  {
    q: "Apakah bisa request konsep acara custom?",
    a: "Tentu! Kami sangat terbuka dengan konsep custom. Ceritakan visi dan tema acara yang kamu inginkan, tim kreatif Papunda akan mewujudkannya. Kamu bisa share referensi foto atau mood board untuk membantu kami memahami konsepmu.",
    cat: "Umum",
  },
  {
    q: "Apakah ada survei lokasi sebelum acara?",
    a: "Ya, untuk event skala menengah hingga besar, tim kami akan melakukan survei lokasi untuk memastikan persiapan dekorasi, sound system, dan logistik berjalan optimal. Survei biasanya dilakukan H-7 hingga H-3 sebelum acara.",
    cat: "Umum",
  },
  {
    q: "Area mana saja yang dilayani Papunda?",
    a: "Papunda berbasis di Bogor dan melayani area Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi). Untuk event di luar area tersebut, kami tetap bisa membantu dengan biaya transportasi dan akomodasi yang akan dibicarakan saat konsultasi.",
    cat: "Umum",
  },
  {
    q: "Bagaimana jika acara terpaksa dibatalkan atau diundur?",
    a: "Kami memahami hal-hal tak terduga bisa terjadi. Untuk pembatalan lebih dari 14 hari sebelum acara, DP dapat dikembalikan 50%. Untuk pembatalan kurang dari 14 hari, DP tidak dapat dikembalikan namun bisa digunakan sebagai saldo untuk acara lain. Pengunduan tanggal bisa dibicarakan tanpa penalti sesuai ketersediaan.",
    cat: "Pembayaran",
  },
  {
    q: "Apakah layanan undangan digital tetap ada?",
    a: "Ya! Undangan digital tetap menjadi salah satu layanan unggulan Papunda. Kamu bisa buat undangan pernikahan, khitanan, dan ulang tahun online secara gratis (uji coba), atau pakai paket berbayar mulai dari Rp 50.000 jika ingin dibuatkan oleh admin. Cek menu Undangan Digital untuk info harga lengkap.",
    cat: "Layanan",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 px-4 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-pink-50/70 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200">
            ❓ FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 leading-tight">
            Pertanyaan{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              yang Sering Ditanya
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed">
            Tidak menemukan jawaban yang kamu cari? Langsung tanya kami via WhatsApp!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
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
                onClick={() => toggle(idx)}
                className={`w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 group ${
                  openIdx === idx
                    ? "border-pink-300 bg-pink-50 shadow-md shadow-pink-100"
                    : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/30"
                }`}
              >
                {/* Category badge */}
                <span className={`flex-shrink-0 mt-0.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  faq.cat === "Pembayaran" ? "bg-amber-100 text-amber-700" :
                  faq.cat === "Pemesanan" ? "bg-blue-100 text-blue-700" :
                  faq.cat === "Layanan" ? "bg-pink-100 text-pink-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {faq.cat}
                </span>

                <span className={`flex-1 font-semibold text-sm md:text-base leading-snug transition-colors ${
                  openIdx === idx ? "text-pink-700" : "text-slate-800"
                }`}>
                  {faq.q}
                </span>

                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 mt-0.5 transition-transform duration-300 ${
                    openIdx === idx ? "rotate-180 text-pink-500" : "text-slate-400"
                  }`}
                />
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
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200"
        >
          <p className="font-bold text-slate-700 mb-2">Masih ada pertanyaan lain?</p>
          <p className="text-sm text-slate-500 mb-5">Tim kami siap menjawab semua pertanyaanmu kapanpun.</p>
          <a
            href="https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20ada%20pertanyaan%20tentang%20layanan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Tanya via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
