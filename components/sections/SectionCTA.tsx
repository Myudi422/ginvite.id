import { motion } from "framer-motion";
import { Sparkles, Send, Palette, CheckCircle2, Star, ShieldCheck, Heart, ArrowRight } from "lucide-react";

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
    <div className="w-full h-full p-6 sm:p-10 md:p-12 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 text-white rounded-[2.25rem] overflow-hidden relative border border-rose-400/30 shadow-2xl flex flex-col justify-center">
      
      {/* Subtle radial light overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />

      {/* Background watermark 04 */}
      <div className="absolute top-2 left-6 sm:left-10 text-[130px] sm:text-[180px] font-black text-white/5 select-none pointer-events-none leading-none">
        04
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* ── LEFT COLUMN: Text & CTAs ── */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              FEATURE 04 — Mulai Sekarang
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-[1.18] tracking-tight"
          >
            Siap Membuat Undangan
            <br />
            Digital Spesial Anda?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-rose-50 leading-relaxed font-light max-w-xl"
          >
            Bergabung bersama ribuan pasangan & keluarga bahagia di seluruh Indonesia. Coba gratis sekarang tanpa risiko, tanpa perlu kartu kredit!
          </motion.p>

          {/* Quick trust bullets */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2.5 pt-1"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <CheckCircle2 className="w-4 h-4 text-white" />
              Gratis Coba Tanpa Risiko
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <CheckCircle2 className="w-4 h-4 text-white" />
              1-Klik Kirim via WhatsApp
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <CheckCircle2 className="w-4 h-4 text-white" />
              Proses Cepat 5 Menit Jadi
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <CheckCircle2 className="w-4 h-4 text-white" />
              100+ Tema Bebas Pilih
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <button
              onClick={() => gtagConversion("/admin", "cta_section_buat_gratis")}
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-full px-7 py-3.5 text-xs sm:text-sm shadow-xl transition-all duration-200"
            >
              <Send className="w-4 h-4 text-rose-500" />
              Buat Undangan Gratis
              <ArrowRight className="w-4 h-4 text-rose-500" />
            </button>
            <button
              onClick={() => gtagConversion("/katalog", "cta_section_lihat_tema")}
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold transition-all duration-200"
            >
              <Palette className="w-4 h-4" />
              Jelajahi 100+ Tema
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Trust Showcase Visual ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 shadow-2xl overflow-hidden space-y-3.5 text-center sm:text-left">
            
            {/* Stat Card 1 */}
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-bold text-xs shadow-md">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base leading-none">10.000+</h4>
                <p className="text-[11px] text-rose-100 font-light mt-0.5">Pasangan Bahagia Menggunakan Papunda</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs shadow-md">
                <Star className="w-5 h-5 fill-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-white text-base leading-none">Rating 4.9/5</span>
                  <span className="text-[10px] bg-amber-400/30 text-amber-200 px-1.5 py-0.2 rounded font-bold">★ 5.0</span>
                </div>
                <p className="text-[11px] text-rose-100 font-light mt-0.5">Dari 2.500+ Ulasan Pengguna</p>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 bg-white text-rose-700 font-bold text-xs p-3 rounded-2xl shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Garansi Kemudahan & Kepuasan 100%
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
