"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Play, Heart, Scissors, Gift, CheckCircle2, Palette, Send, Clock, Star, Users } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const invitationTypes = [
  { label: "Pernikahan", color: "text-rose-500", icon: Heart },
  { label: "Khitanan", color: "text-blue-500", icon: Scissors },
  { label: "Ulang Tahun", color: "text-amber-500", icon: Gift },
  { label: "Aqiqah & Syukuran", color: "text-emerald-500", icon: Sparkles },
  { label: "Grand Opening", color: "text-violet-500", icon: Send },
];

const trustBadges = [
  { label: "Gratis Uji Coba", icon: CheckCircle2 },
  { label: "100+ Tema Premium", icon: Palette },
  { label: "Kirim via WhatsApp", icon: Send },
  { label: "5 Menit Jadi", icon: Clock },
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
    <div className="relative w-full max-w-[280px] sm:max-w-xs mx-auto">
      {/* Main invitation card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-pink-200/60 border border-pink-200 overflow-hidden"
      >
        {/* Ornament top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 rounded-t-3xl" />
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-rose-200/50 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-fuchsia-200/50 rounded-full blur-xl" />

        <div className="relative text-center space-y-2">
          <p className="text-[10px] font-semibold text-rose-500 tracking-[0.2em] uppercase">Undangan Pernikahan</p>
          <div className="w-10 h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto" />
          <h3 className="font-serif text-xl sm:text-2xl text-slate-800 leading-tight">
            Ahmad & Siti Rahayu
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">Sabtu, 14 Februari 2026</p>
          <p className="text-[11px] text-slate-400">Grand Ballroom Bogor Palace</p>

          {/* Decorative divider */}
          <div className="flex items-center gap-2 justify-center py-0.5">
            <div className="w-5 h-px bg-rose-200" />
            <span className="text-rose-400 text-[10px]">✦</span>
            <div className="w-5 h-px bg-rose-200" />
          </div>

          {/* RSVP button */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold py-1.5 px-4 rounded-full inline-block shadow-md shadow-rose-200">
            Konfirmasi Kehadiran (RSVP)
          </div>
        </div>
      </motion.div>

      {/* Static clean badges (hidden on small mobile to prevent text overlap) */}
      <div className="hidden sm:flex absolute -top-3 -left-3 bg-white border border-emerald-200 rounded-2xl shadow-md px-3 py-1.5 items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <div>
          <div className="text-[10px] font-bold text-slate-700">Tamu Konfirmasi</div>
          <div className="text-[10px] text-emerald-600 font-semibold">+128 hadir</div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -bottom-3 -right-3 bg-white border border-rose-200 rounded-2xl shadow-md px-3 py-1.5 items-center gap-2">
        <Send className="w-3.5 h-3.5 text-rose-500" />
        <div>
          <div className="text-[10px] font-bold text-slate-700">Dikirim via WA</div>
          <div className="text-[10px] text-rose-500 font-semibold">ke 200+ tamu</div>
        </div>
      </div>

      <div className="hidden md:flex absolute top-1/2 -right-6 bg-white border border-amber-200 rounded-2xl shadow-md px-3 py-1.5 items-center gap-2">
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <div>
          <div className="text-[10px] font-bold text-slate-700">Rating 5.0</div>
          <div className="text-[10px] text-amber-600 font-semibold">100+ ulasan</div>
        </div>
      </div>
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

  const ActiveIcon = invitationTypes[currentType].icon;

  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white via-rose-50/30 to-pink-50/20 text-slate-900 rounded-[1.75rem] overflow-hidden relative border border-rose-100 flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center relative z-10">

        {/* ── LEFT: Copy (7 cols) ── */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 text-rose-600 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              #1 Platform Undangan Digital Indonesia
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-1"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.12] tracking-tight">
              Buat Undangan Digital
              <br />
              <span className="text-slate-400 text-xl sm:text-2xl md:text-3xl font-normal">untuk</span>
              {" "}
              {/* Animated type */}
              <span className="inline-flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentType}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className={`inline-flex items-center gap-1.5 ${invitationTypes[currentType].color} font-bold`}
                  >
                    <ActiveIcon className="w-5 h-5 sm:w-6 sm:h-6 inline-block" />
                    {invitationTypes[currentType].label}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-light">— Elegan. Personal. Sangat Mudah.</p>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed font-light"
          >
            Coba gratis tanpa kartu kredit. Pilih dari <strong className="text-slate-800 font-semibold">100+ tema premium</strong>,
            isi detail acara, dan kirim langsung ke tamu via WhatsApp dalam{" "}
            <strong className="text-slate-800 font-semibold">5 menit!</strong>
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-1.5 pt-0.5"
          >
            {trustBadges.map((badge) => {
              const BIcon = badge.icon;
              return (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px] font-semibold px-3 py-1 rounded-full"
                >
                  <BIcon className="w-3.5 h-3.5 text-rose-500" />
                  {badge.label}
                </span>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-2.5 pt-1"
          >
            <button
              onClick={() => {
                handleCTA("hero_cta_buat_gratis");
                gtagConversion("/admin", "hero_buat_gratis");
              }}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-full px-6 py-2.5 text-xs sm:text-sm shadow-md shadow-rose-200 hover:shadow-rose-300 transition-all duration-200"
            >
              <Send className="w-3.5 h-3.5" />
              Buat Undangan Gratis
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                handleCTA("hero_cta_lihat_tema");
                window.location.href = "/katalog";
              }}
              className="flex items-center justify-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50/80 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Lihat 100+ Tema
            </button>
          </motion.div>

          {/* Social proof micro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5"
          >
            <span className="flex items-center gap-1 text-rose-500">
              <Users className="w-3.5 h-3.5" />
            </span>
            Dipercaya oleh <strong className="text-slate-700 font-semibold">10.000+</strong> pasangan & keluarga di Indonesia
          </motion.p>
        </div>

        {/* ── RIGHT: Mockup (5 cols) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex items-center justify-center pt-2 lg:pt-0"
        >
          <InvitationMockup />
        </motion.div>

      </div>
    </div>
  );
}