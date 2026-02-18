"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ArrowRight, Phone, Loader2 } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";
import { FaSms } from "react-icons/fa";

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

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch("https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme");
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
            usage_count: item.usage_count || 0
          }));

          // 3. Sort by usage_count descending and take top 4
          mappedThemes.sort((a, b) => b.usage_count - a.usage_count);
          setThemes(mappedThemes.slice(0, 4));
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
    const message = `Halo admin, saya tertarik dengan tema undangan *${themeName}* ini dari halaman depan. Saya ingin memesan undangan digital.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="px-4 py-16 md:py-24 bg-pink-50/50">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-pink-600 font-semibold tracking-wider uppercase text-sm mb-3 block">Katalog Tema</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
            Pilih Desain Favoritmu
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Temukan ratusan template undangan digital yang elegan, modern, dan kekinian. Siap pakai untuk momen spesialmu.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <Image
                      src={theme.image}
                      alt={theme.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <Link href={getPreviewUrl(theme.localId)} target="_blank" className="w-full">
                        <Button className="w-full bg-white text-slate-900 hover:bg-pink-50 transition-colors font-medium">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="mb-3">
                      <span className="text-[10px] font-bold tracking-wider text-pink-500 uppercase mb-1 block">{theme.category}</span>
                      <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-pink-600 transition-colors">{theme.name}</h3>
                    </div>

                    <div className="mt-auto space-y-2">
                      <Link href={getPreviewUrl(theme.localId)} target="_blank" className="block">
                        <Button variant="outline" size="sm" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700">
                          Lihat Detail
                        </Button>
                      </Link>
                      <Link href={getWhatsAppUrl(theme.name)} target="_blank" className="block">
                        <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white border-green-200">
                          <FaSms className="h-3 w-3" />
                          Order via Wa
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 md:mt-16">
          <Link href="/katalog">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 md:px-12 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all group">
              Lihat Semua Koleksi
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}