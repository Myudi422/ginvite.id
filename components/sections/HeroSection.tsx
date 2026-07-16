"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const invitationTypes = [
  { label: "Pernikahan", color: "text-rose-500", emoji: "💒" },
  { label: "Khitanan", color: "text-blue-500", emoji: "✂️" },
  { label: "Ulang Tahun", color: "text-amber-500", emoji: "🎂" },
  { label: "Aqiqah", color: "text-emerald-500", emoji: "🌿" },
  { label: "Syukuran", color: "text-violet-500", emoji: "🙏" },
  { label: "Launching", color: "text-pink-500", emoji: "🚀" },
];

const trustBadges = [
  "✅ Gratis Uji Coba",
  "🎨 100+ Tema Premium",
  "📲 Kirim via WhatsApp",
  "⚡ 5 Menit Jadi",
];

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

// Floating invitation card mockup
function InvitationMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main invitation card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100 rounded-3xl p-8 shadow-2xl shadow-pink-200 border border-pink-200 overflow-hidden"
      >
        {/* Ornament top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 rounded-t-3xl" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-200/50 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-fuchsia-200/50 rounded-full blur-xl" />

        <div className="relative text-center space-y-3">
          <p className="text-xs font-semibold text-rose-400 tracking-[0.3em] uppercase">Undangan Pernikahan</p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto" />
          <h3 className="font-serif text-2xl text-slate-700 leading-tight">
            Ahmad & Siti Rahayu
          </h3>
          <p className="text-xs text-slate-500 font-medium">Sabtu, 14 Februari 2026</p>
          <p className="text-xs text-slate-400">Grand Ballroom Bogor Palace</p>

          {/* Decorative divider */}
          <div className="flex items-center gap-2 justify-center py-1">
            <div className="w-6 h-px bg-rose-200" />
            <span className="text-rose-300 text-sm">✦</span>
            <div className="w-6 h-px bg-rose-200" />
          </div>

          {/* RSVP button */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold py-2 px-5 rounded-full inline-block shadow-md shadow-rose-200">
            Konfirmasi Kehadiran (RSVP)
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -left-4 bg-white border border-green-200 rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2"
      >
        <span className="text-lg">✅</span>
        <div>
          <div className="text-[10px] font-bold text-slate-700">Tamu Konfirmasi</div>
          <div className="text-[10px] text-green-500 font-semibold">+128 hadir</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -right-4 bg-white border border-pink-200 rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2"
      >
        <span className="text-lg">📲</span>
        <div>
          <div className="text-[10px] font-bold text-slate-700">Dikirim via WA</div>
          <div className="text-[10px] text-pink-500 font-semibold">ke 200+ tamu</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 -right-8 bg-white border border-amber-200 rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2"
      >
        <span className="text-lg">⭐</span>
        <div>
          <div className="text-[10px] font-bold text-slate-700">Rating 5.0</div>
          <div className="text-[10px] text-amber-500 font-semibold">100+ ulasan</div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const [currentType, setCurrentType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentType((prev) => (prev + 1) % invitationTypes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = (name: string) => {
    trackCTAClick(name, "hero_section");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", { content_name: name, content_category: "hero_section" });
    }
  };

  return (
    <section className="relative min-h-[100svh] flex items-center py-16 px-6 overflow-hidden bg-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/60 to-fuchsia-50/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(251,207,232,0.5),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(253,242,248,0.7),transparent_55%)]" />

      {/* Decorative floating blobs */}
      <div className="absolute top-24 right-8 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-24 left-8 w-48 h-48 bg-rose-100 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-fuchsia-100 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT: Copy ── */}
          <div className="space-y-7 md:space-y-8">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg shadow-pink-200">
                <Sparkles className="w-3.5 h-3.5" />
                #1 Platform Undangan Digital Indonesia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 leading-[1.15]">
                Buat Undangan Digital
                <br />
                <span className="text-slate-500 text-3xl md:text-4xl lg:text-5xl font-medium">untuk</span>
                {" "}
                {/* Animated type */}
                <div className="inline-flex items-center gap-2 mt-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35 }}
                      className={`inline-block ${invitationTypes[currentType].color} font-bold`}
                    >
                      {invitationTypes[currentType].emoji} {invitationTypes[currentType].label}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 font-light mt-1">— Elegan. Personal. Mudah.</p>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-slate-500 max-w-lg leading-relaxed"
            >
              Coba gratis tanpa kartu kredit. Pilih dari <strong className="text-slate-700">100+ tema premium</strong>,
              isi detail acara, dan kirim ke tamu lewat WhatsApp. Selesai dalam{" "}
              <strong className="text-slate-700">5 menit!</strong>
            </motion.p>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-block bg-white border border-pink-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => {
                  handleCTA("hero_cta_buat_gratis");
                  gtagConversion("/admin", "hero_buat_gratis");
                }}
                className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-full px-8 py-4 text-base shadow-xl shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                💌 Coba Gratis Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  handleCTA("hero_cta_lihat_tema");
                  window.location.href = "/katalog";
                }}
                className="flex items-center justify-center gap-2 border-2 border-pink-300 text-pink-600 hover:border-pink-500 hover:bg-pink-50 rounded-full px-8 py-4 text-base font-bold transition-all duration-200"
              >
                <Play className="w-4 h-4 fill-current" />
                Lihat 100+ Tema
              </button>
            </motion.div>

            {/* Social proof micro */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xs text-slate-400 flex items-center gap-2"
            >
              <span className="flex -space-x-1">
                {["🧑", "👩", "👨", "👩‍🦱"].map((e, i) => (
                  <span key={i} className="inline-block w-6 h-6 text-base leading-6 bg-pink-100 rounded-full text-center">
                    {e}
                  </span>
                ))}
              </span>
              Bergabung dengan <strong className="text-slate-600">10.000+</strong> pengguna yang sudah buat undangan
            </motion.p>
          </div>

          {/* ── RIGHT: Mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center py-12"
          >
            <InvitationMockup />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-pink-300"
        >
          <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-6 bg-gradient-to-b from-pink-300 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}