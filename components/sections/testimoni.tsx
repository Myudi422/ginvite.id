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
    <section className="py-24 bg-gradient-to-b from-pink-50/40 via-white to-pink-50/20 overflow-hidden relative">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            Cerita Bahagia
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6 tracking-tight leading-tight"
          >
            Dipercaya untuk Ribuan Momen Spesial
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Dengarkan langsung cerita bahagia dari mereka yang telah merayakan momen tak terlupakan dengan undangan digital elegan Papunda.
          </motion.p>
        </div>

        {/* Stats Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20 bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-pink-100/50 shadow-sm"
        >
          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-100 last:border-0 md:border-r-0 lg:border-r">
            <div className="w-12 h-12 bg-pink-100/80 rounded-2xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">200.000+</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">User Aktif</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-4 lg:border-r lg:border-slate-100">
            <div className="w-12 h-12 bg-rose-100/80 rounded-2xl flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">1.500+</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Undangan Dibuat</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-4 border-r border-slate-100 last:border-0 md:border-r-0 lg:border-r">
            <div className="w-12 h-12 bg-amber-100/80 rounded-2xl flex items-center justify-center mb-3">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">4.9 / 5.0</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Rating Kepuasan</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 bg-violet-100/80 rounded-2xl flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">99.9%</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Uptime Server</p>
          </div>
        </motion.div>

        {/* Testimonials Slider Area */}
        <div 
          className="relative px-2 md:px-6"
          onMouseEnter={() => setAutoplayActive(false)}
          onMouseLeave={() => setAutoplayActive(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slider Window */}
          <div className="overflow-hidden py-4 -my-4">
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
                  className="flex-shrink-0 px-3 md:px-4"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  {/* Testimonial Card */}
                  <div className="h-full bg-white rounded-3xl p-8 border border-pink-50 hover:border-pink-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                    {/* Quotation mark decoration */}
                    <div className="absolute top-6 right-8 text-pink-100 opacity-50 group-hover:scale-110 transition-transform duration-300">
                      <Quote className="w-12 h-12 rotate-180" />
                    </div>

                    <div>
                      {/* Rating stars & tag */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-1">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          t.tag.includes("Builder") 
                            ? "bg-purple-50 text-purple-700 border-purple-100" 
                            : "bg-pink-50 text-pink-700 border-pink-100"
                        }`}>
                          {t.tag}
                        </span>
                      </div>

                      {/* Review body */}
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 italic relative z-10">
                        "{t.review}"
                      </p>
                    </div>

                    {/* Author footer */}
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200 shadow-sm shrink-0">
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{t.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold">{t.role}</p>
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-6 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-lg flex items-center justify-center text-slate-600 hover:text-pink-600 active:scale-95 transition-all z-20 cursor-pointer hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 lg:translate-x-6 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-lg flex items-center justify-center text-slate-600 hover:text-pink-600 active:scale-95 transition-all z-20 cursor-pointer hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {Array.from({ length: testimonials.length - itemsPerPage + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx 
                  ? "w-8 bg-pink-500" 
                  : "w-2.5 bg-pink-200/60 hover:bg-pink-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}