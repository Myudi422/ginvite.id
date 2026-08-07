"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Star,
  Quote,
  Sparkles,
  Heart,
} from "lucide-react";

const testimonials = [
  {
    name: "Merry & Anne",
    role: "Pasangan Pernikahan",
    review: "Paling suka sama fitur Builder-nya! Benar-benar gampang buat kustom sesuka hati tanpa coding. Fitur RSVP-nya juga ngebantu banget pas hari H untuk estimasi tamu undangan.",
    rating: 5,
    tag: "Pernikahan (Builder)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/resepsi-1-scaled-e1687971665857-150x150.jpg",
  },
  {
    name: "Bunda Elsa & Ahmad",
    role: "Orang Tua (Khitanan)",
    review: "Sangat praktis buat undangan khitanan anak kami. Desainnya super gemas tapi tetap elegan, fiturnya lengkap ada navigasi peta lokasi dan kolom ucapan selamat dari keluarga besar.",
    rating: 5,
    tag: "Khitanan (Legacy)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/3_11zon-150x150.webp",
  },
  {
    name: "Putri & Lyus",
    role: "Pasangan Pernikahan",
    review: "Fitur Wedding Planner bawaannya sangat membantu melacak budget persiapan pernikahan kami. Udah dapet undangan digital premium, dapet planner gratis pula!",
    rating: 5,
    tag: "Pernikahan (Builder)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/Tanpa-judul-300-×-300-piksel-1-1-150x150.png",
  },
  {
    name: "Kak Rian & Alisa",
    role: "Penyelenggara (Ulang Tahun)",
    review: "Bikin undangan ulang tahun sweet seventeen jadi gampang banget. Musik latarnya bisa dipasang lagu favorit kami, galerinya juga jernih & responsif diakses dari HP.",
    rating: 5,
    tag: "Ulang Tahun (Builder)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/6_11zon-1-150x150.webp",
  },
  {
    name: "Intan & Sandi",
    role: "Pasangan Pernikahan",
    review: "Adminnya responsif banget pas diajak konsultasi. Kustomisasi galeri foto dan musik latarnya gampang dipasang. Undangan termewah dengan harga yang sangat terjangkau.",
    rating: 5,
    tag: "Pernikahan (Legacy)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/intan-150x150.png",
  },
  {
    name: "Bunda Alfina",
    role: "Orang Tua (Aqiqah & Syukuran)",
    review: "Hemat budget banyak banget dibanding cetak undangan fisik. Undangan online dari Papunda ini kelihatan sangat eksklusif, animasinya smooth di semua HP keluarga.",
    rating: 5,
    tag: "Syukuran (Legacy)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/4_11zon-150x150.webp",
  },
  {
    name: "Wita & Arya",
    role: "Pasangan Pernikahan",
    review: "Fitur QR Code check-in tamu pas di lokasi resepsi super canggih! Penerima tamu tinggal scan, ga perlu lagi antri isi buku tamu fisik. Event jadi kelihatan profesional.",
    rating: 5,
    tag: "Pernikahan (Builder)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/wita-arya-8-150x150-1.jpg",
  },
  {
    name: "Pak Ari & Novi",
    role: "Penyelenggara (Grand Opening)",
    review: "Coba gratis 5 menit langsung jadi, tampilannya profesional. Fitur kirim nama tamu VIP secara personal bikin para tamu undangan terhormat merasa sangat dihargai.",
    rating: 5,
    tag: "Event Umum (Legacy)",
    image: "https://hi.browedding.id/wp-content/uploads/2024/10/5_11zon-150x150.webp",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [autoplayActive, setAutoplayActive] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!autoplayActive) return;

    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplayActive, itemsPerPage]);

  const maxIndex = testimonials.length - itemsPerPage;

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div className="w-full p-6 sm:p-10 md:p-12 bg-[#0b0f19] text-white rounded-[2.25rem] overflow-hidden relative border border-slate-800">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-rose-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          Cerita Bahagia
        </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3 tracking-tight leading-tight"
            >
              Dipercaya untuk Ribuan Momen Spesial
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-500 leading-relaxed"
            >
              Cerita jujur dari pasangan dan keluarga yang merayakan momen bahagia bersama Papunda.
            </motion.p>
          </div>

          {/* Stats Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10 bg-rose-50/40 rounded-2xl p-5 sm:p-6 border border-rose-100/80"
          >
            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 border-r border-rose-100/80 last:border-0 md:border-r">
              <div className="w-10 h-10 bg-rose-100/80 rounded-xl flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">200.000+</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Tamu Terjangkau</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 border-r-0 md:border-r border-rose-100/80">
              <div className="w-10 h-10 bg-pink-100/80 rounded-xl flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">1.500+</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Undangan Aktif</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4 border-r border-rose-100/80 last:border-0">
              <div className="w-10 h-10 bg-amber-100/80 rounded-xl flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">4.9 / 5.0</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Rating Kepuasan</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4">
              <div className="w-10 h-10 bg-violet-100/80 rounded-xl flex items-center justify-center mb-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">99.9%</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Uptime Server</p>
            </div>
          </motion.div>

          {/* Testimonials Slider Area */}
          <div 
            className="relative px-2 md:px-4"
            onMouseEnter={() => setAutoplayActive(false)}
            onMouseLeave={() => setAutoplayActive(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slider Window */}
            <div className="overflow-hidden py-2">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / testimonials.length}%)`,
                  width: `${(100 / itemsPerPage) * testimonials.length}%`,
                }}
              >
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / testimonials.length}%` }}
                  >
                    {/* Testimonial Card */}
                    <div className="h-full bg-white rounded-2xl p-6 border border-rose-100 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                      <div className="absolute top-5 right-5 text-rose-100/60 opacity-60">
                        <Quote className="w-9 h-9 rotate-180 text-rose-200" />
                      </div>

                      <div>
                        {/* Rating stars & tag */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-600 border-rose-200/60">
                            {t.tag}
                          </span>
                        </div>

                        {/* Review body */}
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 italic relative z-10">
                          "{t.review}"
                        </p>
                      </div>

                      {/* Author footer */}
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-rose-200 shrink-0">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 bg-white rounded-full border border-rose-200 shadow-md flex items-center justify-center text-slate-700 hover:text-rose-600 transition-all z-20 cursor-pointer hidden md:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 bg-white rounded-full border border-rose-200 shadow-md flex items-center justify-center text-slate-700 hover:text-rose-600 transition-all z-20 cursor-pointer hidden md:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: testimonials.length - itemsPerPage + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? "w-6 bg-rose-500" 
                    : "w-2 bg-rose-200 hover:bg-rose-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

    </div>
  );
}