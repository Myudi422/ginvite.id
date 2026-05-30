"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  UserPlus,
  FolderPlus,
  Sliders,
  Send,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const tutorialImage = "/tutor1.jpg";

const steps = [
  {
    step: 1,
    title: "Buat Akun Papunda",
    subtitle: "Daftar & login instan hanya dengan sekali klik menggunakan akun Google Anda.",
    linkText: "Daftar & Login Sekarang",
    linkUrl: "/login",
    image: "/tutor1.jpg",
    icon: <UserPlus className="w-5 h-5 text-pink-600" />,
    color: "bg-pink-100/80 border-pink-200 text-pink-700",
  },
  {
    step: 2,
    title: "Klik Buat Undangan",
    subtitle: "Pilih kategori acara (Pernikahan, Khitanan, Ulang Tahun, atau Acara Lain), isi judul, lalu simpan.",
    image: "/tutor2.jpg",
    icon: <FolderPlus className="w-5 h-5 text-rose-600" />,
    color: "bg-rose-100/80 border-rose-200 text-rose-700",
  },
  {
    step: 3,
    title: "Kustom Desain & Isi Data",
    subtitle: "Pilih tema terfavorit, isi formulir data acara, aktifkan fitur rsvp/hadiah, dan kustom warna/font sesuka hati.",
    image: "/tutor3.jpg",
    icon: <Sliders className="w-5 h-5 text-purple-600" />,
    color: "bg-purple-100/80 border-purple-200 text-purple-700",
  },
  {
    step: 4,
    title: "Terbitkan & Sebarkan!",
    subtitle: "Undangan siap dibagikan! Buat link khusus yang personal untuk tamu VIP agar terasa lebih dihargai.",
    image: "/tutor4.jpg",
    icon: <Send className="w-5 h-5 text-violet-600" />,
    color: "bg-violet-100/80 border-violet-200 text-violet-700",
  },
];

export default function InstructionsSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-pink-50/10 to-white overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 right-1/4 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200/50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-spin-slow" />
            Panduan Mudah
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-5 tracking-tight leading-tight"
          >
            Cara Menggunakan Papunda
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Buat undangan digital profesional yang mewah dan elegan hanya dalam waktu{" "}
            <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">5 menit</span>
          </motion.p>
        </div>

        {/* Desktop Interactive Layout & Mobile Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Vertical Interactive Steps (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveStep(index)}
                className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                  activeStep === index
                    ? "bg-white border-pink-200 shadow-lg shadow-pink-100/50 scale-[1.02]"
                    : "bg-white/40 border-slate-100 hover:border-slate-200 hover:bg-white/80"
                }`}
              >
                {/* Visual Step Connection Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-[70px] left-[38px] w-0.5 h-[50px] bg-slate-100 hidden lg:block" />
                )}

                {/* Step Number / Icon Badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 ${
                  activeStep === index ? item.color : "bg-slate-50 border-slate-200 text-slate-500"
                }`}>
                  {item.icon}
                </div>

                {/* Step Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Step {item.step}</span>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-pink-600 transition-colors flex items-center gap-1.5">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.subtitle}
                  </p>
                  
                  {/* Action Link for Step 1 */}
                  {item.linkText && (
                    <Link
                      href={item.linkUrl}
                      className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline pt-1.5"
                    >
                      {item.linkText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Dynamic Preview Screen & Video (lg:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            {/* Screen / Image Showcase with smooth animation */}
            <div className="bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden aspect-video relative group flex-1 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    fill
                    className="object-cover object-top opacity-90"
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Status Header Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Preview Screen
                </div>
                <div className="bg-pink-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                  Step {steps[activeStep].step}
                </div>
              </div>

              {/* Gradient Bottom Cover */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent pointer-events-none" />
            </div>

            {/* Floating Video Preview Panel */}
            <div className="bg-white rounded-2xl border border-pink-50 p-4 shadow-md flex flex-col sm:flex-row items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="relative w-full sm:w-28 aspect-video rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <Image
                  src={tutorialImage}
                  alt="Tutorial cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Lihat Video Panduan Lengkap</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Tonton tutorial langkah demi langkah cara membuat undangan digital elegan Papunda dari awal hingga siap disebarkan.
                </p>
              </div>
              <Link href="https://wa.me/6289654728249" target="_blank" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold gap-1 px-4 py-4">
                  <PlayCircle className="w-4 h-4" />
                  Tonton Video
                </Button>
              </Link>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
