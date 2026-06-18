"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ArrowRight, Loader2, Flame, Sparkles, MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Theme {
  id: number;
  localId: number;
  name: string;
  category: string;
  image: string;
  description: string;
  usage_count: number;
}

export default function ThemesSection() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch("https://dev.legalpilar.id/v2/android/ginvite/index.php?action=theme");
        const data = await res.json();
        if (data.status === "success" && Array.isArray(data.data)) {
          // 1. Sort by API ID ascending first to determine localId
          const sortedById = [...data.data].sort((a: any, b: any) => a.id - b.id);

          // 2. Map and assign sequential localId
          const mappedThemes = sortedById.map((item: any, index: number) => ({
            id: item.id,
            localId: index + 1,
            name: item.name,
            category: item.kategory_theme_nama || "Umum",
            image: item.image_theme,
            description: "Desain eksklusif untuk momen spesial Anda.",
            usage_count: Number(item.usage_count) || 0,
          }));

          // 3. Sort by usage_count descending and take top 8
          mappedThemes.sort((a, b) => b.usage_count - a.usage_count);
          setThemes(mappedThemes.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const getPreviewUrl = (localId: number) => `/undang/147/demo-theme${localId}`;

  const getWhatsAppUrl = (themeName: string) => {
    const phone = "6289654728249";
    const message = `Halo admin, saya tertarik dengan tema undangan *${themeName}* ini dari katalog halaman depan. Saya ingin bertanya / memesan undangan digital.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Categories list derived from loaded themes
  const categories = ["Semua", ...Array.from(new Set(themes.map((t) => t.category)))];

  // Filtered themes
  const filteredThemes = activeCategory === "Semua" 
    ? themes.slice(0, 4) // Show top 4 in home list
    : themes.filter((t) => t.category === activeCategory).slice(0, 4);

  return (
    <section className="px-4 py-24 bg-gradient-to-b from-pink-50/30 via-white to-pink-50/20 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-pink-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-pink-200/50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            Pilihan Desain Terpopuler
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6 tracking-tight leading-tight"
          >
            Katalog Desain Favoritmu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Temukan koleksi template undangan digital premium yang estetik, responsif, dan kekinian. Siap dipakai untuk merayakan momen berhargamu.
          </motion.p>
        </div>

        {/* Category Pill Switcher */}
        {!loading && themes.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-pink-600 text-white shadow-md shadow-pink-200 scale-105"
                    : "bg-white text-slate-600 hover:bg-pink-50/50 border border-slate-100 hover:border-pink-200"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* Dynamic Card Display */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {filteredThemes.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col h-full"
                >
                  <Card className="overflow-hidden border border-pink-50/50 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col bg-white">
                    {/* Image Area */}
                    <div className="relative aspect-[3/4.2] overflow-hidden bg-slate-50 group-hover:shadow-inner">
                      <img
                        src={theme.image}
                        alt={theme.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Sparkle badge for popular count */}
                      {theme.usage_count > 150 && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-500 text-[9px] font-black text-slate-900 px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10 uppercase tracking-wider border border-amber-300">
                          <Flame className="w-3 h-3 fill-slate-900 text-slate-900 animate-pulse" />
                          Terpopuler
                        </div>
                      )}

                      {/* Smooth Glassmorphism Overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-10 backdrop-blur-[2px]">
                        <Link href={getPreviewUrl(theme.localId)} target="_blank" className="w-full px-2">
                          <Button className="w-full bg-white hover:bg-pink-50 text-slate-800 transition-all font-bold rounded-2xl py-5 shadow-lg flex items-center justify-center gap-2">
                            <Eye className="h-4.5 w-4.5 text-pink-600" />
                            Live Preview
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Content Details */}
                    <CardContent className="p-5 flex flex-col flex-grow justify-between">
                      <div className="mb-4">
                        <span className="text-[10px] font-extrabold tracking-wider text-pink-500 uppercase mb-1.5 block">
                          {theme.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-pink-600 transition-colors">
                          {theme.name}
                        </h3>
                        {theme.usage_count > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-1">
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                            <span>{theme.usage_count}+ kali digunakan</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-2 border-t border-slate-50">
                        <Link href={getPreviewUrl(theme.localId)} target="_blank" className="block">
                          <Button variant="outline" size="sm" className="w-full border-pink-100 text-pink-600 hover:bg-pink-50/50 hover:text-pink-700 font-bold rounded-xl py-4 text-xs">
                            Lihat Detail
                          </Button>
                        </Link>
                        <Link href={getWhatsAppUrl(theme.name)} target="_blank" className="block">
                          <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl py-4 text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-100 hover:shadow-md">
                            <MessageCircle className="h-4 w-4 fill-white" />
                            Pesan via WhatsApp
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View All Collection */}
        <div className="text-center mt-16 md:mt-20">
          <Link href="/katalog">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 md:px-12 py-6 rounded-full text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group flex items-center justify-center gap-2 mx-auto">
              Lihat Semua Koleksi Tema
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}