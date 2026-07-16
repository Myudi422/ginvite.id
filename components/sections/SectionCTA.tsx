"use client";

import { motion } from "framer-motion";

function gtagConversion(url: string, label: string) {
  const navigate = () => {
    if (!url) return;
    if (/^https?:\/\//.test(url)) {
      try { window.open(url, "_blank"); } catch { window.location.href = url; }
    } else {
      window.location.href = url;
    }
  };
  if (typeof window === "undefined") return;
  const isReady = !!(window as any).gtag;
  if (!isReady) { navigate(); return; }
  let done = false;
  const cb = () => { if (done) return; done = true; navigate(); };
  try {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-674897184/BcVHCNOC-KkaEKC66MEC",
      event_label: label,
      value: 1.0,
      currency: "IDR",
      event_callback: cb,
    });
  } catch { cb(); }
  setTimeout(() => { if (!done) { done = true; navigate(); } }, 1000);
}

export default function SectionCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-12 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-white text-sm font-semibold border border-white/20 hidden md:block"
      >
        💌 5 menit jadi!
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        className="absolute top-20 right-12 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-white text-sm font-semibold border border-white/20 hidden md:block"
      >
        ✅ Gratis uji coba
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-20 left-16 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-white text-sm font-semibold border border-white/20 hidden md:block"
      >
        📲 Kirim via WhatsApp
      </motion.div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/20">
            🌟 Mulai Sekarang
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-5 leading-tight">
            Ciptakan Undangan Digital
            <br />
            <span className="bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              yang Tak Terlupakan
            </span>
          </h2>

          <p className="text-base md:text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
            Bergabung dengan ribuan pengguna yang sudah membuat undangan elegan bersama Papunda.
            Coba gratis — bayar hanya kalau kamu puas!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => gtagConversion("/admin", "cta_section_buat_gratis")}
              className="group inline-flex items-center justify-center gap-2.5 bg-white text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold rounded-full px-8 py-4 text-base shadow-2xl shadow-pink-950/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              💌 Buat Undangan — Gratis!
            </button>
            <button
              onClick={() => gtagConversion("/katalog", "cta_section_lihat_tema")}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/70 rounded-full px-8 py-4 text-base font-bold hover:-translate-y-0.5 transition-all duration-200"
            >
              🎨 Jelajahi 100+ Tema
            </button>
          </div>

          {/* Trust micro */}
          <p className="text-white/50 text-xs mt-8 flex items-center justify-center gap-4">
            <span>✓ Tidak perlu kartu kredit</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>✓ Tidak perlu install app</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>✓ Mulai dalam 5 menit</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
