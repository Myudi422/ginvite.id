import { motion } from "framer-motion";
import { Send, CheckCircle2, Bell, Users, Sparkles, ArrowRight } from "lucide-react";

export default function InvitationFeaturesSection() {
  return (
    <div className="w-full h-full p-4 sm:p-6 md:p-8 bg-white text-slate-900 rounded-[1.75rem] overflow-hidden relative border border-rose-100 flex flex-col justify-center">
      
      {/* Background watermark 01 */}
      <div className="absolute top-2 left-6 sm:left-10 text-[130px] sm:text-[180px] font-black text-rose-500/5 select-none pointer-events-none leading-none">
        01
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
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              FEATURE 01
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-[1.18] tracking-tight"
          >
            Kirim Undangan ke
            <br />
            Semua Tamu Sekali Klik
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed font-light"
          >
            Dengan Papunda, kamu bisa menyebarkan undangan digital ke seluruh tamu hanya dalam satu kali kirim.
            Terintegrasi langsung dengan WhatsApp untuk proses yang cepat, rapi, dan otomatis.
          </motion.p>

          {/* Quick bullet highlights */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-2.5 pt-1"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Nama Tamu Auto-Personal
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tanpa Batas Kontak
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100% Anti Spam
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Laporan Status Terkirim
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
              Coba Sebar Undangan Sekarang
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Light UI Mockup Frame ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 relative"
        >
          {/* Main Frame Wrapper */}
          <div className="relative rounded-3xl bg-slate-50/80 border border-slate-200/90 p-5 sm:p-6 shadow-xl shadow-rose-100/50 overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

            {/* Inner Dashboard Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-600 ml-2 tracking-wide">Broadcast Undangan</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                100% Terkirim
              </span>
            </div>

            {/* Guest list item placeholders */}
            <div className="space-y-3 relative z-10">
              
              {/* Row item 1 */}
              <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-2xl p-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="w-28 h-2.5 bg-slate-200 rounded-full" />
                  <div className="w-20 h-2 bg-slate-100 rounded-full" />
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-md">Terkirim</span>
              </div>

              {/* Row item 2 (Active highlighted card matching screenshot) */}
              <div className="relative bg-white border-2 border-dashed border-rose-300 rounded-2xl p-3.5 shadow-md transform translate-x-1">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-800 mb-0.5">Yth. Rian & Rita</h4>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                      Kami turut mengundang Bapak/Ibu dalam acara...
                    </p>
                    <div className="flex gap-1.5 mt-2">
                      <span className="text-[9px] font-bold bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 rounded">Dibaca</span>
                      <span className="text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded">RSVP Hadir</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row item 3 */}
              <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-2xl p-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="w-32 h-2.5 bg-slate-200 rounded-full" />
                  <div className="w-16 h-2 bg-slate-100 rounded-full" />
                </div>
              </div>
            </div>

            {/* Floating Badge: Total Penerima 250+ */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 left-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-3 shadow-lg shadow-rose-200 border border-rose-200 z-20 text-center"
            >
              <p className="text-[10px] font-semibold text-rose-100">Total Penerima</p>
              <p className="text-lg font-extrabold text-white leading-none mt-0.5">250+</p>
            </motion.div>

            {/* Floating Green Broadcast Button */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 right-4 z-20"
            >
              <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-md transition-all">
                <Send className="w-3.5 h-3.5" />
                Broadcast
              </button>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
