"use client";

import { motion } from "framer-motion";
import { Heart, BookUser, Users, Sparkles, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      bg: "bg-pink-50",
      title: "Undangan Elegan",
      description: "Desain premium yang bisa dikostumisasi warna, font, dan layout sesuai selera.",
    },
    {
      icon: <BookUser className="h-8 w-8 text-blue-500" />,
      bg: "bg-blue-50",
      title: "Digital Guestbook",
      description: "Buku tamu digital dengan fitur RSVP konfirmasi kehadiran dan ucapan online.",
    },
    {
      icon: <Users className="h-8 w-8 text-amber-500" />,
      bg: "bg-amber-50",
      title: "Rundown & Tamu VIP",
      description: "Kelola jadwal acara dan kirim link undangan personal per nama tamu.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-violet-500" />,
      bg: "bg-violet-50",
      title: "Custom Design",
      description: "Pilih dari ratusan template, edit sendiri atau minta dibuatkan admin.",
    },
    {
      icon: <CalendarCheck className="h-8 w-8 text-rose-500" />,
      bg: "bg-rose-50",
      title: "Wedding Planner",
      description: "Kelola budget, vendor, seserahan & administrasi pernikahan — sudah gratis!",
      badge: true,
      href: "/wedding-planner",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-pink-50/40">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Platform #1 Undangan Digital
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4">
            Semua Ada di Papunda
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bukan cuma undangan — dari guestbook, rundown, hingga wedding planner. Satu platform, semua beres.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {f.href ? (
                <Link href={f.href} className="block h-full">
                  <FeatureCard f={f} />
                </Link>
              ) : (
                <FeatureCard f={f} />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-14"
        >
          <p className="text-lg font-medium text-slate-600 italic">
            "Solusi undanganmu jadi lebih modern, efisien dan terukur"
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ f }: { f: any }) {
  return (
    <div className={`relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-slate-100 hover:border-pink-200 transition-all hover:-translate-y-1 h-full group`}>
      {f.badge && (
        <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          ✨ Baru & Gratis
        </div>
      )}
      <div className={`w-14 h-14 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
        {f.icon}
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-pink-600 transition-colors">
        {f.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
      {f.badge && (
        <p className="text-rose-500 text-xs font-semibold mt-3">Pelajari lebih lanjut →</p>
      )}
    </div>
  );
}