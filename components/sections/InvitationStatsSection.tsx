import { motion } from "framer-motion";
import { Mail, Users, Palette, Clock, Sparkles, CheckCircle2, Music, Image as ImageIcon, MapPin, Calendar, Heart, Scissors, Gift, Send } from "lucide-react";

const stats = [
  { value: "10.000+", label: "Undangan Dibuat", icon: Mail, color: "from-rose-400 to-pink-500" },
  { value: "500rb+", label: "Tamu Dijangkau", icon: Users, color: "from-pink-400 to-fuchsia-500" },
  { value: "100+", label: "Tema Premium", icon: Palette, color: "from-fuchsia-400 to-violet-500" },
  { value: "5 Menit", label: "Waktu Buat", icon: Clock, color: "from-amber-400 to-orange-500" },
];

const tags = [
  { label: "Pernikahan", icon: Heart },
  { label: "Khitanan", icon: Scissors },
  { label: "Ulang Tahun", icon: Gift },
  { label: "Aqiqah", icon: Sparkles },
  { label: "Syukuran", icon: CheckCircle2 },
  { label: "WA Ready", icon: Send },
  { label: "RSVP Online", icon: CheckCircle2 },
  { label: "Musik Latar", icon: Music },
  { label: "Galeri Foto", icon: ImageIcon },
  { label: "Maps Lokasi", icon: MapPin },
  { label: "Countdown", icon: Calendar },
];

export default function InvitationStatsSection() {
  return (
    <div className="w-full p-6 sm:p-10 md:p-12 bg-[#0f172a] text-white rounded-[2.25rem] overflow-hidden relative border border-slate-800">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-12"
      >
        <span className="inline-flex items-center gap-1.5 bg-slate-800 text-rose-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          Dipercaya Ribuan Pengguna
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
          Ribuan Undangan Telah{" "}
          <span className="text-rose-400">
            Terkirim Sempurna
          </span>
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base font-light">
          Dipercaya untuk momen paling berharga dalam hidup ribuan pasangan & keluarga.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group text-center bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 hover:border-slate-700 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mx-auto mb-3 shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Tag cloud */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {tags.map((tag, i) => {
          const TagIcon = tag.icon;
          return (
            <motion.span
              key={tag.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-full hover:border-rose-500/50 hover:text-rose-400 transition-all duration-200 cursor-default"
            >
              <TagIcon className="w-3.5 h-3.5 text-rose-500" />
              {tag.label}
            </motion.span>
          );
        })}
      </motion.div>

    </div>
  );
}
