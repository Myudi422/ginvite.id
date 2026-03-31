"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  BadgeCheck,
  LogIn,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Camera,
  Image as ImageIcon,
  Wand2,
  Sparkles,
  Star,
  MapPin,
  Wallet,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FooterSection from "@/components/sections/FooterSection";
import { Toaster } from "@/components/ui/toaster";

// ─── Helpers ────────────────────────────────────────────────────────────────
function gtag_report_conversion(url: string, label?: string) {
  const navigate = () => {
    if (/^https?:\/\//.test(url)) {
      try { window.open(url, "_blank"); } catch { window.location.href = url; }
    } else {
      window.location.href = url;
    }
  };
  if (typeof window === "undefined") return;
  const isGtagReady = !!(window as any).gtag;
  if (!isGtagReady) { navigate(); return; }
  let navigated = false;
  const callback = () => { if (navigated) return; navigated = true; navigate(); };
  try {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-674897184/BcVHCNOC-KkaEKC66MEC",
      event_label: label || "pe_cta",
      value: 1.0, currency: "IDR", transaction_id: "",
      event_callback: callback,
    });
  } catch { callback(); }
  setTimeout(() => { if (!navigated) { navigated = true; navigate(); } }, 1000);
}

const WA_LINK = "https://wa.me/6289654728249?text=Halo%20Admin,%20saya%20tertarik%20dengan%20Promo%20Bikin%20Foto%20Rp%2080rb%20(Dapat%205%20Gambar),%20boleh%20tanya-tanya%20dulu?";

// ─── Header ─────────────────────────────────────────────────────────────────
function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 shadow-sm"
      style={{ background: "rgba(255, 246, 247, 0.85)", backdropFilter: "blur(10px)" }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Papunda Logo" width={100} height={32} className="w-[100px] md:w-[120px]" />
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          <button
            type="button"
            onClick={() => gtag_report_conversion(WA_LINK, "cta_pe_header_wa")}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center text-sm"
          >
            <Phone className="w-4 h-4 mr-2" />
            Pesan Sekarang (Promo 80rb)
          </button>
          <button
            type="button"
            onClick={() => gtag_report_conversion("/", "cta_pe_header_home")}
            className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-pink-50 text-sm"
          >
            Lihat Undangan Digital Tema Lainnya
          </button>
        </nav>
        {/* Mobile Header CTA */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            type="button"
            onClick={() => gtag_report_conversion(WA_LINK, "cta_pe_header_wa_mobile")}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-sm px-3 py-1.5 font-bold text-xs inline-flex items-center"
          >
            <Phone className="w-3 h-3 mr-1" />
            Promo 80rb
          </button>
        </div>
      </div>
    </motion.header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative py-10 md:py-16 px-4 md:px-6 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-100 to-transparent opacity-40 z-0" />
      <div className="absolute top-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-pink-200 rounded-full blur-3xl opacity-20 z-0" />
      <div className="absolute bottom-0 left-0 w-40 md:w-64 h-40 md:h-64 bg-rose-200 rounded-full blur-3xl opacity-20 z-0" />

      <div className="container mx-auto relative z-10 md:mt-8 md:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-5 md:space-y-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 md:space-y-4"
            >
              <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-600 text-xs md:text-sm font-semibold px-3 py-1 md:px-4 md:py-1.5 rounded-full">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                Jasa Edit Background Profesional
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-pink-800 leading-tight">
                Bikin Foto Impianmu,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                  Tanpa Harus Ribet ke Studio!
                </span>
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-pink-700 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Kirimkan <strong>1 foto kamu</strong>, tim kami siap menyulapnya menjadi <strong>5 foto full album</strong> dengan angle dan background istimewa! Menarik untuk Prewedding, Khitanan, Ulang Tahun, dan acara lainnya.
              </p>
              <ul className="space-y-2 text-pink-700 hidden sm:block">
                {[
                  "Bisa request pose & angle sesuka hati",
                  "Tanpa sewa fotografer & lokasi yang mahal",
                  "Hasil halus, menyatu, dan siap pamer",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm md:text-base font-medium">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-rose-500 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start"
            >
              <Button
                size="lg"
                onClick={() => gtag_report_conversion(WA_LINK, "pe_hero_cta_wa")}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-xl hover:shadow-2xl px-6 py-4 md:py-6 h-auto font-bold text-base md:text-lg"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Klaim Promo Rp 80rb Sekarang
              </Button>
            </motion.div>
          </div>

          {/* Right: Before/After Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md md:max-w-none mt-4 md:mt-0"
          >
            {/* Main card - gradient wrapper with photos inside */}
            <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-4 md:p-5 shadow-2xl shadow-rose-200">

              <div className="flex items-stretch gap-3 md:gap-4">
                {/* Before Photo Box */}
                <div className="flex-1 relative rounded-2xl overflow-hidden h-[200px] md:h-[260px] shadow-md">
                  <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    Before
                  </div>
                  <img
                    src="/before-after/before.jpg"
                    alt="Before Edit"
                    className="w-full h-full object-cover object-top opacity-90"
                  />
                </div>

                {/* Center Wand */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="bg-white/20 backdrop-blur-md rounded-full p-2 md:p-3 border border-white/40"
                  >
                    <Wand2 className="w-5 h-5 md:w-7 md:h-7 text-yellow-300" />
                  </motion.div>
                </div>

                {/* After Photo Box */}
                <div className="flex-1 relative rounded-2xl overflow-hidden h-[200px] md:h-[260px] shadow-md border-2 border-white/50">
                  <div className="absolute bottom-2 right-2 z-10 bg-white text-rose-600 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                    <Sparkles className="w-2.5 h-2.5" /> After
                  </div>
                  <img
                    src="/before-after/2.jpg"
                    alt="After Edit"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Bottom label */}
              <div className="text-center mt-3 md:mt-4">
                <span className="text-white/90 text-xs md:text-sm font-semibold inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  Edit Selesai dalam 1-2 Hari!
                </span>
              </div>
            </div>

            {/* Floating sub-card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -bottom-4 md:-bottom-6 -left-3 md:-left-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-rose-100 w-[140px] md:w-[180px]"
            >
              <div className="flex items-center gap-1 md:gap-2 mb-1">
                <span className="text-sm md:text-lg">💸</span>
                <p className="text-[10px] md:text-xs font-bold text-gray-700 leading-tight">Promo Diskon Gila!</p>
              </div>
              <div className="flex items-center gap-1 md:gap-2 mt-1">
                <p className="text-[10px] md:text-sm font-bold text-gray-400 line-through">Rp 150rb</p>
                <p className="text-sm md:text-lg font-black text-rose-600">Rp 80rb</p>
              </div>
              <p className="text-[8px] md:text-[10px] text-pink-500 font-semibold mt-1">Dapat 5 Foto Resolusi HD!</p>
            </motion.div>

            {/* Floating sub-card 2 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -top-3 md:-top-5 -right-2 md:-right-4 bg-white rounded-xl md:rounded-2xl p-2 md:p-3 shadow-xl border border-rose-100"
            >
              <div className="flex items-center gap-1 md:gap-1.5">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs md:text-sm font-bold text-gray-800">100% Puas</span>
              </div>
              <p className="text-[8px] md:text-[10px] text-gray-500 mt-0.5">Edit Rapi & Menyatu</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats / Social Proof ─────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { val: "Bebas Request", label: "Prewed / Khitanan / dll", icon: "✨" },
    { val: "5 Gambar", label: "Pose & Latar Beda", icon: "🖼️" },
    { val: "Rp 80rb", label: "Harga Termurah", icon: "💰" },
    { val: "Proses Cepat", label: "1-2 Hari Jadi", icon: "⚡" },
  ];

  return (
    <section className="py-10 md:py-12 px-4 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-500">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white p-2"
            >
              <div className="text-2xl md:text-3xl mb-1">{s.icon}</div>
              <p className="text-xl md:text-2xl font-black mb-1">{s.val}</p>
              <p className="text-rose-200 text-xs md:text-sm font-medium leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem -> Solution / Features ────────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Wand2 className="h-6 w-6 md:h-8 md:w-8 text-rose-500" />,
    titleBefore: "Masalah: Biaya Foto Studio Mahal",
    titleAfter: "Solusi: Prewed/Khitanan Mewah Minim Budget",
    descBefore: "Sewa fotografer pro dan lokasi bagus bisa menghabiskan biaya yang cukup besar.",
    descAfter: "Cukup 80rb rupiah saja, kamu dapat 5 foto sekelas jepretan studio mahal! Sangat cocok untuk anak khitan, pasfoto buku nikah, atau prewedding.",
    color: "bg-rose-50 border-rose-100",
    iconBg: "bg-rose-100",
  },
  {
    icon: <MapPin className="h-6 w-6 md:h-8 md:w-8 text-violet-500" />,
    titleBefore: "Masalah: Repot Pergi ke Lokasi Estetik",
    titleAfter: "Solusi: Kami Mewujudkan Lokasi Impianmu",
    descBefore: "Harus panas-panasan, berpergian jauh bawa koper cuma buat nyari spot foto yang cantik.",
    descAfter: "Cukup dari rumah! Kirimkan foto selife/casual kamu, dan biarkan kami menempatkanmu (atau sang anak) di depan masjid megah, pegunungan, pantai, dsb.",
    color: "bg-violet-50 border-violet-100",
    iconBg: "bg-violet-100",
  },
  {
    icon: <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />,
    titleBefore: "Masalah: Hanya Punya Sedikit Foto Bagus",
    titleAfter: "Solusi: 1 Foto Kesayangan Jadi Full Album",
    descBefore: "Susah nemu pose yang pas, seringnya dari puluhan jepretan cuma satu yang muka dan senyumnya keliatan bagus.",
    descAfter: "Cukup berikan 1 foto andalanmu! Kami akan merubah lingkungan, gaya, pencahayaan, serta background-nya agar bervariasi menjadi 5 foto yang seakan diambil di spot dan waktu berbeda.",
    color: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-100",
  },
];

function ProblemSolutionSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-pink-500 font-semibold uppercase tracking-wider text-xs md:text-sm mb-2 block">
            Alasan Memilih Jasa Edit Kami
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 md:mb-6 leading-tight">
            Wujudkan Imajinasi Tanpa <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Capek dan Mahal</span>
          </h2>
          <p className="text-sm md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed px-2">
            Cocok untuk Undangan Digital, Poster Hajatan, Ucapan Ulang Tahun, dan Kenang-kenangan keluarga secara instan!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`rounded-2xl md:rounded-3xl border p-6 md:p-8 hover:shadow-xl transition-all hover:-translate-y-2 bg-white relative overflow-hidden`}
            >
              <div className={`absolute -right-10 -top-10 w-24 h-24 md:w-32 md:h-32 rounded-full opacity-20 ${f.iconBg}`}></div>

              <div className={`w-12 h-12 md:w-16 md:h-16 ${f.iconBg} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 relative z-10`}>
                {f.icon}
              </div>

              <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-100 border-dashed">
                <h3 className="font-bold text-gray-400 text-xs md:text-sm mb-1.5 md:mb-2 opacity-80 decoration-red-300 line-through decoration-2">{f.titleBefore}</h3>
                <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed italic">"{f.descBefore}"</p>
              </div>

              <div>
                <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-2 md:mb-3 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  {f.titleAfter}
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
                  {f.descAfter}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── One Photo to Many Angles Showcase ───────────────────────────────────────────────────────
const showcaseData = {
  beforeImage: "/before-after/before.jpg", // 1 Foto Asli
  fallbackTextBefore: "Foto Selfie Biasa",
  afterVariants: [
    {
      title: "Angle Medium Close-up",
      image: "/before-after/2.jpg",
      fallbackText: "Fokus Setengah Badan",
    },
    {
      title: "Angle Full Body",
      image: "/before-after/3.jpg",
      fallbackText: "Seluruh Badan Terlihat",
    },
    {
      title: "Angle dari Samping",
      image: "/before-after/4.jpg",
      fallbackText: "Profil Wajah Tampak Samping",
    },
    {
      title: "Angle Close-up Wajah",
      image: "/before-after/5.jpg",
      fallbackText: "Ekspresi Detail",
    },
    {
      title: "Angle Wide / Menjauh",
      image: "/before-after/6.jpg",
      fallbackText: "Fokus Latar Belakang Luas",
    },
  ]
};

function GallerySection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-pink-50/50 overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-pink-500 font-semibold uppercase tracking-wider text-xs md:text-sm mb-2 block">
            Keajaiban Editing Kami
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4 md:mb-6 leading-tight">
            Cukup 1 Foto <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Jadi 5 Pose Beda!</span>
          </h2>
          <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Lihat bagaimana 1 sumber foto casual di bawah bisa kami sulap seakan diambil dari 5 pose & angle kamera berbeda yang tampak proporsional.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">

            {/* LEFT: Single Before Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/3 flex-shrink-0 relative group"
            >
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border border-pink-100 flex flex-col relative z-20">
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 bg-black/80 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-lg">
                  <ImageIcon className="w-3 h-3 text-pink-300" />
                  1 Foto Aslinya
                </div>

                {/* Image Container */}
                <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200 shadow-inner flex items-center justify-center">
                  {/* Fallback */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-0">
                    <ImageIcon className="w-10 h-10 md:w-12 md:h-12 mb-3 opacity-30" />
                    <span className="text-xs md:text-sm font-medium">{showcaseData.fallbackTextBefore}</span>
                  </div>
                  <img
                    src={showcaseData.beforeImage}
                    alt="Before Source Image"
                    className="absolute inset-0 w-full h-full object-cover z-20 group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).classList.remove('z-20');
                      (e.target as HTMLImageElement).classList.add('-z-10', 'opacity-0');
                    }}
                  />
                </div>
                <div className="mt-5 text-center px-2">
                  <h3 className="font-bold text-gray-800 md:text-lg">Foto Koleksi Pribadi</h3>
                  <p className="text-[11px] md:text-sm text-gray-500 mt-1.5 leading-relaxed">Dari foto casual biasa, pencahayaan seadanya. Kita proses lewat magic editor.</p>
                </div>
              </div>

              {/* Decorative Arrow Pointing Right (Desktop) */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="hidden lg:flex absolute top-1/2 -right-8 -translate-y-1/2 z-30 bg-rose-500 w-16 h-16 rounded-full items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.4)] border-4 border-white"
              >
                <ArrowRight className="w-8 h-8 text-white" />
              </motion.div>

              {/* Decorative Arrow Pointing Down (Mobile) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="flex lg:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 bg-rose-500 w-12 h-12 rounded-full items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)] border-4 border-white"
              >
                <ArrowRight className="w-6 h-6 text-white rotate-90" />
              </motion.div>
            </motion.div>

            {/* RIGHT: Grid of 5 After Images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full lg:w-2/3 bg-white/60 p-5 md:p-8 rounded-[32px] md:rounded-[40px] border border-white shadow-xl backdrop-blur-sm relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 -translate-x-1/2 translate-y-1/2"></div>

              <div className="flex items-start gap-4 mb-6 md:mb-8 pb-5 border-b border-pink-100/50">
                <div className="bg-rose-100 p-2.5 rounded-2xl">
                  <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
                </div>
                <div className="flex-1 mt-0.5">
                  <h3 className="font-bold text-lg md:text-2xl text-slate-800">Menghasilkan 5 Pose & Angel Kamera Berbeda!</h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">Satu foto, lima karya luar biasa dengan variasi gaya dan sudut fotografer.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {showcaseData.afterVariants.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${index === 0 ? "col-span-2 lg:col-span-1 lg:row-span-2 aspect-[16/9] lg:aspect-auto" : "aspect-square"}`}
                  >
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-pink-50">


                      {/* Fallback */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-300 z-0">
                        <Camera className="w-6 h-6 md:w-10 md:h-10 mb-1.5 opacity-50" />
                        <span className="text-[9px] md:text-[11px] text-center px-3 tracking-wide">{item.fallbackText}</span>
                      </div>

                      {/* Real Image */}
                      <img
                        src={item.image}
                        alt={`Hasil - ${item.title}`}
                        className="absolute inset-0 w-full h-full object-cover z-20 group-hover:scale-110 transition-transform duration-700 origin-center"
                        onError={(e) => {
                          (e.target as HTMLImageElement).classList.remove('z-20');
                          (e.target as HTMLImageElement).classList.add('-z-10', 'opacity-0');
                        }}
                      />


                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        <div className="text-center mt-12 md:mt-16 px-4">
          <p className="text-xs md:text-sm text-gray-600 bg-white/50 backdrop-blur-sm inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-100 shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            Ke-5 pose & angle berbeda di atas digenerate murni dari 1 foto (*Before*) yang sama tanpa merubah proporsi aslinya.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Album Showcase: Polaroid Style ────────────────────────────────────────────
const albumPhotos = [
  {
    image: "/before-after/2.jpg",
    angle: "Portrait Close-up",
    rotate: "-rotate-6",
    translateY: "translate-y-4",
    delay: 0,
  },
  {
    image: "/before-after/3.jpg",
    angle: "Full Body",
    rotate: "-rotate-2",
    translateY: "translate-y-1",
    delay: 0.1,
  },
  {
    image: "/before-after/4.jpg",
    angle: "Angle Samping",
    rotate: "rotate-1",
    translateY: "-translate-y-2",
    delay: 0.2,
  },
  {
    image: "/before-after/5.jpg",
    angle: "Wide Shot",
    rotate: "rotate-3",
    translateY: "translate-y-2",
    delay: 0.3,
  },
  {
    image: "/before-after/6.jpg",
    angle: "Close-up",
    rotate: "rotate-6",
    translateY: "translate-y-5",
    delay: 0.4,
  },
];

function AlbumShowcaseSection() {
  return (
    <section className="py-10 md:py-20 px-4 overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-12"
        >
          <span className="text-pink-500 font-semibold uppercase tracking-wider text-xs md:text-sm mb-2 block">
            Sudah Termasuk dalam 1 Paket
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-800 mb-3 md:mb-4 leading-tight">
            1 Foto Menghasilkan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              5 Polaroid Kenangan
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto">
            Cukup kirim <strong>1 foto saja</strong>, dan kamu akan mendapatkan
            kelima variasi polaroid foto ini sekaligus dalam 1 paket.
          </p>
        </motion.div>

        {/* Polaroid Fan */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[400px] bg-rose-200/30 rounded-full blur-3xl" />
          </div>

          {/* Mobile: horizontal scroll with visible scrollbar */}
          <div
            className="flex md:hidden gap-4 overflow-x-auto pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#fda4af #fce7f3" }}
          >
            {albumPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: photo.delay, duration: 0.5 }}
                className="flex-shrink-0 snap-center group"
              >
                <div
                  className="bg-white p-2.5 pb-5 w-[150px] relative"
                  style={{ boxShadow: "0 6px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.07)" }}
                >
                  {/* Number pin */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-rose-500 rounded-full shadow-md flex items-center justify-center text-white text-[9px] font-black z-10">
                    {index + 1}
                  </div>
                  <div className="w-full h-[190px] overflow-hidden bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-pink-200">
                      <Camera className="w-6 h-6 opacity-40" />
                    </div>
                    <img
                      src={photo.image}
                      alt={`Foto ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).classList.add("opacity-0"); }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Extra space at end so last card shows fully */}
            <div className="flex-shrink-0 w-2" />
          </div>
          {/* Scroll hint text */}
          <p className="md:hidden text-center text-[11px] text-slate-400 mt-1 mb-2">← geser untuk lihat semua →</p>

          {/* Desktop: fanned spread */}
          <div className="hidden md:flex items-end justify-center gap-2 min-h-[420px] relative">
            {albumPhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: photo.delay, duration: 0.6, ease: "backOut" }}
                whileHover={{ y: -24, scale: 1.06, zIndex: 20 }}
                className={`group relative flex-shrink-0 cursor-pointer ${photo.rotate} ${photo.translateY}`}
                style={{ zIndex: index + 1 }}
              >
                <div
                  className="bg-white p-3 pb-6 w-[170px] lg:w-[190px] relative transition-all duration-300 group-hover:shadow-2xl"
                  style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.08)" }}
                >
                  {/* Push pin */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-rose-500 rounded-full shadow-lg flex items-center justify-center text-white text-[10px] font-black border-2 border-white z-10">
                    {index + 1}
                  </div>

                  {/* Photo area — no caption */}
                  <div className="w-full h-[220px] lg:h-[240px] overflow-hidden bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-pink-200">
                      <Camera className="w-10 h-10 opacity-40" />
                    </div>
                    <img
                      src={photo.image}
                      alt={`Foto ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).classList.add("opacity-0"); }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info badges below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mt-10 md:mt-16"
        >
          {[
            "✅ Kelima foto dikirim bersamaan",
            "✅ Resolusi HD siap cetak",
            "✅ Gratis revisi ringan",
          ].map((text) => (
            <span
              key={text}
              className="bg-white/80 backdrop-blur-sm border border-pink-100 text-slate-600 text-xs md:text-sm font-medium px-4 py-2 rounded-full shadow-sm"
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


// ─── Tutorial / How-To ────────────────────────────────────────────────────────
const tutorialSteps = [
  {
    step: 1,
    emoji: "📸",
    title: "Siapkan 1 Foto Terbaik",
    subtitle: "Pilih 1 foto wajah terlihat jelas dan tidak blur (Selfie, Half-body). Pakaian bebas karena bisa kami ubah otomatis.",
    color: "border-pink-200 bg-pink-50",
    numColor: "bg-pink-500",
  },
  {
    step: 2,
    emoji: "💬",
    title: "Chat & Request Konsep",
    subtitle: "Order via WhatsApp. Sebutkan keperluannya (Prewed, Khitanan, Buku Nikah, Ulang Tahun) beserta request spesifiknya.",
    color: "border-rose-200 bg-rose-50",
    numColor: "bg-rose-500",
  },
  {
    step: 3,
    emoji: "🪄",
    title: "Proses Magic Editing",
    subtitle: "Duduk manis sementara tim dan teknologi kami mengubah fotomu dalam 1-2 hari kerja menjadi mahakarya.",
    color: "border-violet-200 bg-violet-50",
    numColor: "bg-violet-500",
  },
  {
    step: 4,
    emoji: "🎉",
    title: "Terima 5 Hasil Final!",
    subtitle: "Dapatkan pesananmu (5 foto dalam 1 paket)! Gratis revisi kecil, langsung siap dipakai untuk memperindah Undangan Digital kamu.",
    color: "border-amber-200 bg-amber-50",
    numColor: "bg-amber-500",
  },
];

function TutorialSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-pink-500 font-semibold uppercase tracking-wider text-xs md:text-sm mb-2 block">
            Alur Pemesanan Cepat
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
            Cara Mudah Mendapatkan Hasil Elegan
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-2">
            Nggak sampai 5 menit buat order, langkah selanjutnya biar tim Papunda yang tuntaskan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {tutorialSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl md:rounded-3xl border p-6 md:p-8 ${s.color} hover:shadow-xl transition-all hover:-translate-y-1 md:hover:-translate-y-2 relative`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <span className={`w-8 h-8 md:w-10 md:h-10 ${s.numColor} text-white rounded-full flex items-center justify-center text-base md:text-lg font-bold flex-shrink-0 shadow-lg`}>
                  {s.step}
                </span>
                <span className="text-2xl md:text-3xl">{s.emoji}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2 md:mb-3">{s.title}</h3>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed font-medium">{s.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Button
            size="lg"
            onClick={() => gtag_report_conversion(WA_LINK, "pe_tutorial_cta")}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 py-4 md:px-8 md:py-6 h-auto text-base md:text-lg shadow-xl hover:shadow-2xl transition-all group font-bold w-full sm:w-auto"
          >
            <HeartHandshake className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
            Pesan Sekarang via WhatsApp (Rp 80rb)
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <motion.section
      className="relative py-20 md:py-24 bg-rose-50 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-pink-200 rounded-full opacity-40 blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-rose-200 rounded-full opacity-40 blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
        <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 font-bold mb-4 md:mb-6 text-[10px] md:text-sm animate-pulse whitespace-nowrap">
          ⚠️ PROMO DISKON TERBATAS!
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 md:mb-6 tracking-tight leading-tight">
          Upgrade Tampilan Undangan<br className="hidden md:block" />Menjadi Jauh Lebih Personal!
        </h2>
        <p className="text-lg md:text-2xl text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
          Lebih hemat dari studio foto.<br className="block sm:hidden" /> Harga <strong className="text-rose-600 text-xl md:text-3xl mx-1 md:mx-2 line-through decoration-black/20">Rp 150rb</strong> menjadi <strong className="text-rose-600 text-2xl md:text-4xl block mt-2 md:inline md:mt-0 font-extrabold">Rp 80.000</strong> untuk 5 variasi layout!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 mt-6 md:mt-8">
          <Button
            size="lg"
            onClick={() => gtag_report_conversion(WA_LINK, "pe_bottom_cta_wa")}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-6 py-5 md:px-10 md:py-7 h-auto text-base md:text-xl rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] md:shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] md:hover:shadow-[0_0_60px_rgba(225,29,72,0.6)] transition-all transform hover:-translate-y-1"
          >
            Ambil Promonya Sekarang
            <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-6 md:mt-8 font-medium px-4">Ada garansi revisi jika posisi wajah atau badan terasa kaku/tidak wajar!</p>
      </div>
    </motion.section>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function PhotoEditingPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900">
      <Header />
      <HeroSection />
      <StatsSection />
      <ProblemSolutionSection />
      <GallerySection />
      <AlbumShowcaseSection />
      <TutorialSection />
      <CTASection />
      <FooterSection />
      <Toaster />
    </main>
  );
}
