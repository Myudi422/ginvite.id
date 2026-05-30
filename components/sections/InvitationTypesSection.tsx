"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Wand2,
  LayoutTemplate,
  Palette,
  CheckCircle2,
  ArrowRight,
  MousePointerClick,
  Layers,
  Image as ImageIcon,
  Music,
  MapPin,
  Heart,
  Gift,
  Users,
} from "lucide-react";

// ─── Legacy Invitation Mock ────────────────────────────────────────────────────
function LegacyMock() {
  return (
    <div className="relative w-full max-w-[230px] mx-auto">
      {/* Phone frame */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl border-4 border-slate-200 overflow-hidden">
        {/* Status bar */}
        <div className="h-6 bg-slate-800 flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* Invitation preview */}
        <div className="bg-gradient-to-b from-rose-50 to-pink-100 relative overflow-hidden">
          {/* Cover */}
          <div className="relative h-[200px] bg-gradient-to-br from-rose-900 via-pink-800 to-rose-700 flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-2 w-16 h-16 border border-white/40 rounded-full" />
              <div className="absolute top-6 left-6 w-8 h-8 border border-white/30 rounded-full" />
              <div className="absolute bottom-4 right-4 w-20 h-20 border border-white/30 rounded-full" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/20 rounded-full" />
            </div>
            <div className="relative z-10 text-center px-4">
              <p className="text-[8px] tracking-[3px] uppercase text-rose-300 mb-1">Undangan Pernikahan</p>
              <p className="text-lg font-serif font-bold leading-tight">Ahmad</p>
              <p className="text-[8px] text-rose-300 my-0.5">&</p>
              <p className="text-lg font-serif font-bold leading-tight">Rina</p>
              <div className="w-12 h-[1px] bg-rose-400 mx-auto mt-2 mb-1" />
              <p className="text-[7px] text-rose-300">Sabtu, 14 Juni 2026</p>
            </div>
            {/* Flower accent */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
              <span className="text-2xl opacity-40">🌸</span>
              <span className="text-2xl opacity-40">🌸</span>
            </div>
          </div>

          {/* Content section */}
          <div className="px-3 py-3 space-y-2">
            <div className="text-center">
              <p className="text-[7px] font-bold text-rose-700 uppercase tracking-widest">Lokasi Akad Nikah</p>
              <p className="text-[8px] text-slate-600 mt-0.5">Masjid Al-Ikhlas, Jakarta Selatan</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-2 text-center border border-pink-100">
              <p className="text-[6px] text-rose-500 uppercase font-bold tracking-wider">Countdown</p>
              <div className="flex justify-center gap-1.5 mt-1">
                {["12", "06", "30"].map((n, i) => (
                  <div key={i} className="bg-rose-600 text-white rounded px-1 py-0.5">
                    <p className="text-[9px] font-black">{n}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* RSVP mini */}
            <div className="flex gap-1">
              <div className="flex-1 bg-rose-600 text-white text-center py-1.5 rounded-md">
                <p className="text-[7px] font-bold">Hadir</p>
              </div>
              <div className="flex-1 bg-white border border-rose-200 text-rose-600 text-center py-1.5 rounded-md">
                <p className="text-[7px] font-bold">Tidak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-4 bg-slate-100 flex items-center justify-center">
          <div className="w-10 h-0.5 bg-slate-300 rounded-full" />
        </div>
      </div>

      {/* Label badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg">
        Legacy ✨
      </div>
    </div>
  );
}

// ─── Builder Invitation Mock ───────────────────────────────────────────────────
function BuilderMock() {
  const sections = [
    { icon: <Layers className="w-2.5 h-2.5" />, label: "Opening", color: "bg-violet-100 text-violet-700" },
    { icon: <Heart className="w-2.5 h-2.5" />, label: "Couple", color: "bg-pink-100 text-pink-700" },
    { icon: <MapPin className="w-2.5 h-2.5" />, label: "Lokasi", color: "bg-blue-100 text-blue-700" },
    { icon: <ImageIcon className="w-2.5 h-2.5" />, label: "Gallery", color: "bg-emerald-100 text-emerald-700" },
    { icon: <Gift className="w-2.5 h-2.5" />, label: "Hadiah", color: "bg-amber-100 text-amber-700" },
    { icon: <Music className="w-2.5 h-2.5" />, label: "Musik", color: "bg-purple-100 text-purple-700" },
    { icon: <Users className="w-2.5 h-2.5" />, label: "RSVP", color: "bg-rose-100 text-rose-700" },
  ];

  return (
    <div className="relative w-full max-w-[230px] mx-auto">
      {/* Builder interface mock */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="w-2 h-2 bg-green-400 rounded-full" />
          </div>
          <p className="text-white text-[8px] font-bold ml-auto">Papunda Builder</p>
        </div>

        <div className="flex h-[300px]">
          {/* Left sidebar - sections panel */}
          <div className="w-[70px] bg-slate-50 border-r border-slate-100 p-1.5 space-y-1 overflow-hidden">
            <p className="text-[6px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Sections</p>
            {sections.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-md ${s.color} cursor-pointer`}
              >
                {s.icon}
                <span className="text-[7px] font-medium">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Right: canvas / preview */}
          <div className="flex-1 bg-gradient-to-b from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden flex flex-col items-center justify-start pt-4 px-2">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute border border-white rounded-full"
                  style={{ width: `${60 + i * 25}px`, height: `${60 + i * 25}px`, top: `${10 + i * 10}px`, left: `${5 + i * 5}px` }}
                />
              ))}
            </div>

            {/* Animated preview content */}
            <div className="relative z-10 text-center text-white">
              <p className="text-[7px] tracking-[2px] text-purple-300 uppercase">The Wedding of</p>
              <p className="text-[13px] font-serif font-bold mt-0.5">Budi & Sari</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-6 h-[1px] bg-purple-400" />
                <span className="text-[8px] text-purple-300">💜</span>
                <div className="w-6 h-[1px] bg-purple-400" />
              </div>
              <p className="text-[6px] text-purple-300 mt-1">20 Agustus 2026</p>
            </div>

            {/* Drag indicator */}
            <motion.div
              className="absolute bottom-4 right-2 bg-white/20 backdrop-blur-sm rounded-lg p-1.5 border border-white/30"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <MousePointerClick className="w-3 h-3 text-white" />
            </motion.div>

            {/* Color palette indicator */}
            <div className="absolute bottom-2 left-1.5 flex gap-0.5">
              {["#7c3aed", "#a855f7", "#ec4899", "#f43f5e"].map((c) => (
                <div key={c} className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-slate-50 border-t border-slate-100 px-3 py-1.5 flex items-center justify-between">
          <span className="text-[7px] text-slate-500">7 sections aktif</span>
          <div className="bg-violet-600 text-white text-[7px] font-bold px-2 py-0.5 rounded-md">Simpan</div>
        </div>
      </div>

      {/* Label badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-violet-500 to-purple-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg">
        Builder 🛠️
      </div>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────
const legacyFeatures = [
  "Template siap pakai",
  "Isi data → langsung jadi",
  "Cocok untuk semua acara",
  "Proses 5 menit saja",
];

const builderFeatures = [
  "Drag & drop section bebas",
  "Custom warna, font & layout",
  "Section: Gallery, RSVP, Gift, Map",
  "Preview real-time di builder",
];

export default function InvitationTypesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-violet-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full mb-5 border border-purple-100">
            <Wand2 className="w-3.5 h-3.5" />
            Pilih Cara Membuat Undangan
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-5 leading-tight">
            Dua Cara Bikin Undangan{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500">
              Digital di Papunda
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pilih metode yang paling nyaman buat kamu — mulai dari template siap pakai atau buat dari nol dengan builder interaktif.
          </p>
        </motion.div>

        {/* Two Cards Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">

          {/* ── Legacy Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-pink-100 hover:border-pink-200 flex flex-col"
          >
            {/* Background gradient blob */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-pink-50 to-transparent rounded-3xl opacity-60 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <LayoutTemplate className="w-5 h-5 text-pink-600" />
                  </div>
                  <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">Rekomendasi</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Undangan Legacy</h3>
                <p className="text-sm text-slate-500 mt-1">Template siap pakai, isi data langsung jadi</p>
              </div>
            </div>

            {/* Mock Preview */}
            <div className="my-4 flex justify-center">
              <LegacyMock />
            </div>

            {/* Features */}
            <ul className="space-y-2.5 my-6 flex-1">
              {legacyFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link href="/admin" className="block">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-md hover:shadow-pink-200 hover:shadow-lg transition-all group/btn"
              >
                Buat dengan Template
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-center text-xs text-slate-400 mt-2">✅ Gratis, langsung bisa dicoba</p>
          </motion.div>

          {/* ── Builder Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="group relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-violet-700 flex flex-col"
          >
            {/* Glow effect */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-violet-300" />
                  </div>
                  <span className="text-xs font-bold text-violet-300 bg-violet-800/60 px-3 py-1 rounded-full border border-violet-600/40">
                    <Sparkles className="inline w-3 h-3 mr-1" />
                    Baru & Premium
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">Undangan Builder</h3>
                <p className="text-sm text-violet-300 mt-1">Drag & drop, bebas kustomisasi</p>
              </div>
            </div>

            {/* Mock Preview */}
            <div className="my-4 flex justify-center">
              <BuilderMock />
            </div>

            {/* Features */}
            <ul className="space-y-2.5 my-6 flex-1">
              {builderFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-violet-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link href="/admin" className="block">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white rounded-xl font-semibold shadow-md hover:shadow-violet-400/30 hover:shadow-lg transition-all group/btn"
              >
                Coba Builder Sekarang
                <Wand2 className="ml-2 w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              </Button>
            </Link>
            <p className="text-center text-xs text-violet-400 mt-2">✨ Gratis uji coba, bayar saat puas</p>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-slate-500 text-sm">
            Tidak yakin pilih yang mana?{" "}
            <Link href="https://wa.me/6289654728249" target="_blank" className="text-pink-600 font-semibold hover:underline">
              Tanya admin kami via WhatsApp →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
