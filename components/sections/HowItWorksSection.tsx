import { motion } from "framer-motion";
import { Zap, CheckCircle2, ArrowRight, Palette, Edit3, Send, Sparkles, Clock } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <div className="w-full h-full p-6 sm:p-10 md:p-12 bg-white text-slate-900 rounded-[2.25rem] overflow-hidden relative border border-rose-100 flex flex-col justify-center">
      
      {/* Background watermark 03 */}
      <div className="absolute top-2 left-6 sm:left-10 text-[130px] sm:text-[180px] font-black text-rose-500/5 select-none pointer-events-none leading-none">
        03
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* ── LEFT COLUMN: Text Copy ── */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-rose-500" />
              FEATURE 03
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.18] tracking-tight"
          >
            3 Langkah Praktis
            <br />
            Undangan Siap Sebar
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed font-light"
          >
            Proses pembuatan yang super cepat dan intuitif. Dari mendaftar, memilih tema, hingga undangan tersebar penuh ke WhatsApp tamu—semuanya selesai dalam hitungan menit.
          </motion.p>

          {/* Quick Bullet Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2.5 pt-1"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              01. Pilih Template Sesuai Selera
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              02. Isi Detail Acara & Foto
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              03. Sebar Otomatis via WA
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tanpa Perlu Coding / Desain
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <a
              href="/admin"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md shadow-rose-200 transition-all"
            >
              Mulai Buat Undangan Gratis
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Step Visual Showcase Frame ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative rounded-3xl bg-slate-50/90 border border-slate-200/90 p-5 sm:p-6 shadow-xl shadow-rose-100/50 overflow-hidden space-y-3.5">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

            {/* Step Row 1 */}
            <div className="flex items-center gap-3 bg-white border border-rose-100/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                01
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Palette className="w-3.5 h-3.5 text-rose-500" />
                  <h4 className="font-bold text-xs text-slate-800">Pilih Tema & Kustomisasi</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-light">Pilih dari 100+ pilihan tema pernikahan, khitanan, atau acara lainnya.</p>
              </div>
            </div>

            {/* Step Row 2 */}
            <div className="flex items-center gap-3 bg-white border border-rose-100/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                02
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Edit3 className="w-3.5 h-3.5 text-pink-500" />
                  <h4 className="font-bold text-xs text-slate-800">Isi Data & Upload Foto</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-light">Masukkan nama mempelai/penyelenggara, lokasi Google Maps, dan daftar tamu.</p>
              </div>
            </div>

            {/* Step Row 3 */}
            <div className="flex items-center gap-3 bg-white border border-rose-100/80 p-3.5 rounded-2xl shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                03
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Send className="w-3.5 h-3.5 text-emerald-500" />
                  <h4 className="font-bold text-xs text-slate-800">Sebar Undangan 1-Klik</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-light">Kirim link undangan personal ke seluruh kontak WhatsApp dalam hitungan detik.</p>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white animate-pulse" />
                <span className="text-xs font-bold">Total Waktu: Hanya ~5 Menit</span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">Sangat Cepat</span>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
