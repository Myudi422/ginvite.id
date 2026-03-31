"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Wand2, Sparkles } from "lucide-react";

const benefits = [
  { emoji: "📸", label: "1 Foto Saja", desc: "Cukup kirim satu foto terbaik", color: "bg-pink-50 border-pink-100", dot: "bg-pink-400" },
  { emoji: "🎨", label: "5 Variasi", desc: "Dapat 5 foto angle berbeda", color: "bg-rose-50 border-rose-100", dot: "bg-rose-400" },
  { emoji: "⚡", label: "1-2 Hari", desc: "Proses cepat & profesional", color: "bg-amber-50 border-amber-100", dot: "bg-amber-400" },
  { emoji: "💰", label: "Rp 80.000", desc: "Hemat dibanding studio foto", color: "bg-emerald-50 border-emerald-100", dot: "bg-emerald-400" },
];

export default function PhotoEditingSpoiler() {
  return (
    <section className="py-20 px-4 bg-pink-50/40 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                ✨ Promo Terbatas — Rp 80rb!
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 leading-tight">
              Foto Biasa Jadi{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
                Foto Studio Mewah
              </span>{" "}
              Hanya dari 1 Foto
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Tidak perlu ke studio mahal atau cari lokasi jauh. Kirim <strong>1 foto casual</strong> kamu, kami sulap jadi <strong>5 foto full album</strong> berkualitas tinggi untuk Prewedding, Khitanan, Ulang Tahun, dan lainnya.
            </p>
            <ul className="space-y-3">
              {[
                "Edit background, baju, & pencahayaan otomatis",
                "Cocok untuk undangan digital, poster, & kenang-kenangan",
                "Garansi revisi jika hasil tidak memuaskan",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/photo-editing">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 shadow-md hover:shadow-lg font-semibold group"
                >
                  Lihat Promo Lengkap
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://wa.me/6289654728249?text=Halo%20Admin,%20saya%20tertarik%20dengan%20Promo%20Edit%20Foto%20Rp%2080rb">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full px-6 font-semibold"
                >
                  💬 Tanya via WhatsApp
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            {/* Main before/after card */}
            <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-4 text-white shadow-2xl shadow-rose-200">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-white/10 rounded-full" />

              {/* Header */}
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">✨</div>
                <div>
                  <p className="text-xs text-rose-200 uppercase tracking-widest font-semibold">Jasa Edit Foto</p>
                  <p className="text-sm font-bold">Transformasi Ajaib dalam 1-2 Hari</p>
                </div>
              </div>

              {/* Before / After photos */}
              <div className="relative flex gap-2">
                {/* Before */}
                <div className="flex-1 relative rounded-2xl overflow-hidden h-[180px] md:h-[220px]">
                  <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Before</div>
                  <img
                    src="/before-after/before.jpg"
                    alt="Before editing"
                    className="w-full h-full object-cover object-top opacity-90"
                  />
                </div>

                {/* Wand separator */}
                <div className="flex items-center justify-center w-0 relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="absolute bg-white rounded-full p-1.5 shadow-lg border-2 border-rose-200"
                  >
                    <Wand2 className="w-4 h-4 text-rose-500" />
                  </motion.div>
                </div>

                {/* After */}
                <div className="flex-1 relative rounded-2xl overflow-hidden h-[180px] md:h-[220px] border-2 border-white/50">
                  <div className="absolute bottom-2 right-2 z-10 bg-white text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> After
                  </div>
                  <img
                    src="/before-after/2.jpg"
                    alt="After editing"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Price tag */}
              <div className="relative mt-3 flex items-center justify-between bg-white/15 rounded-2xl px-4 py-2.5 backdrop-blur-sm">
                <div>
                  <p className="text-xs text-rose-200">Harga Promo</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-sm line-through">Rp 150rb</span>
                    <span className="text-white font-black text-xl">Rp 80rb</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rose-200">Dapat</p>
                  <p className="font-bold text-white text-sm">5 Foto HD</p>
                </div>
              </div>
            </div>

            {/* Benefit cards floating below */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border shadow-sm hover:shadow-md transition-all ${b.color}`}
                >
                  <div className={`w-6 h-6 ${b.dot} rounded-full flex items-center justify-center text-[11px] flex-shrink-0`}>
                    {b.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 leading-tight">{b.label}</p>
                    <p className="text-[10px] text-gray-500 leading-tight truncate">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
