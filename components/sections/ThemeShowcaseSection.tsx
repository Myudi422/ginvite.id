import { motion } from "framer-motion";
import Link from "next/link";
import { Palette, CheckCircle2, LayoutGrid, ArrowRight, Sparkles, Music, Smartphone, Edit3 } from "lucide-react";

export default function ThemeShowcaseSection() {
  return (
    <div className="w-full h-full p-6 sm:p-10 md:p-12 bg-white text-slate-900 rounded-[2.25rem] overflow-hidden relative border border-rose-100 flex flex-col justify-center">
      
      {/* Background watermark 02 */}
      <div className="absolute top-2 left-6 sm:left-10 text-[130px] sm:text-[180px] font-black text-rose-500/5 select-none pointer-events-none leading-none">
        02
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* ── LEFT COLUMN: Information Copy ── */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Palette className="w-3.5 h-3.5 text-rose-500" />
              FEATURE 02
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.18] tracking-tight"
          >
            100+ Koleksi Tema
            <br />
            Premium Siap Pakai
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed font-light"
          >
            Dirancang khusus oleh desainer profesional untuk menciptakan kesan pertama yang tak tertandingi. 
            Bebas menyesuaikan warna, galeri foto, musik latar, hingga kisah cinta kamu dengan mudah.
          </motion.p>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2.5 pt-1"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100+ Desain Aesthetic
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Musik & Galeri Foto
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100% Responsif di HP
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tanpa Batas Edit & Preview
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md shadow-rose-200 transition-all"
            >
              <LayoutGrid className="w-4 h-4" />
              Jelajahi Katalog Semua Tema
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Feature Graphic Showcase Frame ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative rounded-3xl bg-slate-50/90 border border-slate-200/90 p-5 sm:p-6 shadow-xl shadow-rose-100/50 overflow-hidden space-y-4">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

            {/* Feature Cards Showcase */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              
              <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
                  <Palette className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Custom Warna & Font</h4>
                <p className="text-[11px] text-slate-500 leading-snug font-light">Bebas ubah warna palet sesuai tema pernikahan.</p>
              </div>

              <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-xs">
                  <Music className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Background Music</h4>
                <p className="text-[11px] text-slate-500 leading-snug font-light">Pilihan lagu latar favorit atau lagu buatan sendiri.</p>
              </div>

              <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Tampilan Mobile First</h4>
                <p className="text-[11px] text-slate-500 leading-snug font-light">Nyaman dibuka di layar HP Android & iPhone.</p>
              </div>

              <div className="bg-white border border-rose-100 p-4 rounded-2xl shadow-2xs space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Edit Kapan Saja</h4>
                <p className="text-[11px] text-slate-500 leading-snug font-light">Ubah detail lokasi & tanggal acara secara instan.</p>
              </div>

            </div>

            {/* Bottom Banner */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-xs font-bold">100+ Tema Premium Tersedia</span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">Katalog Complete</span>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
