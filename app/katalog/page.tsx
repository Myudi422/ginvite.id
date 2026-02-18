"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Phone, Eye, Search, ArrowRight, LogIn } from "lucide-react";
import FooterSection from "@/components/sections/FooterSection";
import { motion } from "framer-motion";
import { FaSms } from "react-icons/fa";

// Theme Data Interface

// Theme Data Interface
interface Theme {
    id: number;
    localId: number; // Added for sequential mapping
    name: string;
    category: string;
    image: string;
    description: string;
    usage_count: number;
}

export default function CatalogPage() {
    const [guestName, setGuestName] = useState("");
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch themes from API
    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const res = await fetch("https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme");
                const data = await res.json();
                if (data.status === "success" && Array.isArray(data.data)) {
                    // 1. Sort by API ID ascending first
                    const sortedById = [...data.data].sort((a: any, b: any) => a.id - b.id);

                    // 2. Map and assign sequential localId (1, 2, 3...)
                    const mappedThemes = sortedById.map((item: any, index: number) => ({
                        id: item.id,
                        localId: index + 1, // Sequential ID based on sorted order
                        name: item.name,
                        category: item.kategory_theme_nama || "Umum",
                        image: item.image_theme,
                        description: "Desain eksklusif untuk momen spesial Anda.",
                        usage_count: item.usage_count || 0
                    }));

                    // 3. Sort by usage_count descending for display
                    mappedThemes.sort((a, b) => b.usage_count - a.usage_count);

                    setThemes(mappedThemes);
                }
            } catch (error) {
                console.error("Failed to fetch themes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, []);

    // Function to generate preview URL using localId
    const getPreviewUrl = (localId: number) => {
        const baseUrl = `/undang/147/demo-theme${localId}`;
        if (guestName.trim()) {
            return `${baseUrl}?to=${encodeURIComponent(guestName.trim())}`;
        }
        return baseUrl;
    };

    // Function to generate WhatsApp URL
    const getWhatsAppUrl = (themeName: string) => {
        const phone = "6289654728249";
        const message = `Halo admin, saya tertarik dengan tema undangan *${themeName}* ini. Saya ingin memesan undangan digital.`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 font-sans text-slate-800">

            {/* Header (Simplified Version - Matched with Home) */}
            <motion.header
                className="sticky top-0 z-50 shadow-sm"
                style={{
                    background: 'rgba(255, 246, 247, 0.8)', // Warna pink dengan sedikit transparansi
                    backdropFilter: 'blur(10px)', // Efek blur
                }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} className="h-10 w-auto" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="https://wa.me/6289654728249"
                            target="_blank"
                            className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-pink-50 text-sm"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            <span>Hubungi Admin</span>
                        </Link>
                        <Link
                            href="/admin"
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center text-sm"
                        >
                            <BadgeCheck className="w-4 h-4 mr-2" />
                            <span>Buat Undangan</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button - Matched Home */}
                    <div className="md:hidden flex items-center space-x-2">
                        <Link
                            href="https://wa.me/6289654728249"
                            className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all p-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-pink-50"
                            aria-label="Hubungi Admin"
                        >
                            <Phone className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/admin"
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all p-2 font-semibold whitespace-nowrap inline-flex items-center"
                            aria-label="Coba Gratis"
                        >
                            <LogIn className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </motion.header>

            <main className="container mx-auto px-4 py-6 md:py-12">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500 mb-4 md:mb-6"
                    >
                        Pilih Tema Undanganmu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-base md:text-lg text-slate-600 leading-relaxed px-4"
                    >
                        Temukan desain yang sempurna untuk acara spesialmu. <br className="hidden md:block" />
                        Coba preview langsung dengan nama tamu undangan.
                    </motion.p>
                </div>

                {/* Guest Name Input */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-md mx-auto mb-10 md:mb-16 relative z-10"
                >
                    <div className="bg-white p-2 rounded-2xl shadow-xl shadow-pink-100/50 border border-pink-100 flex items-center gap-2">
                        <div className="pl-4 text-slate-400">
                            <Search size={20} />
                        </div>
                        <Input
                            type="text"
                            placeholder="Ketik Nama Tamu (Contoh: Budi)"
                            className="border-0 shadow-none focus-visible:ring-0 text-base md:text-lg py-4 md:py-6 bg-transparent"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                    </div>
                    <p className="text-center text-xs md:text-sm text-slate-500 mt-3 px-4">
                        *Ketik nama tamu untuk melihat simulasi di dalam undangan
                    </p>
                </motion.div>

                {/* Themes Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mb-12 md:mb-20">
                    {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl h-96 animate-pulse shadow-sm"></div>
                        ))
                    ) : (
                        themes.map((theme, index) => (
                            <motion.div
                                key={theme.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index + 0.3 }}
                            >
                                <Card className="overflow-hidden border-0 shadow-sm md:shadow-lg hover:shadow-xl transition-all duration-300 group rounded-xl md:rounded-2xl bg-white h-full flex flex-col">
                                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                                        <Image
                                            src={theme.image}
                                            alt={theme.name}
                                            fill
                                            priority={index < 4}
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 hidden md:flex">
                                            <Link href={getPreviewUrl(theme.localId)} target="_blank">
                                                <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 rounded-full px-8 font-semibold shadow-lg">
                                                    <Eye className="mr-2 h-5 w-5" />
                                                    Live Preview
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <CardContent className="p-3 md:p-6 flex-grow flex flex-col justify-between">
                                        <div className="mb-2">
                                            <span className="text-[10px] md:text-xs font-bold tracking-wider text-pink-500 uppercase mb-1 block truncate">{theme.category}</span>
                                            <h3 className="text-sm md:text-xl font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">{theme.name}</h3>
                                        </div>
                                        <p className="text-slate-500 text-xs md:text-sm mb-3 md:mb-6 line-clamp-2 hidden md:block">{theme.description}</p>

                                        <Link href={getPreviewUrl(theme.localId)} target="_blank" className="block mt-auto">
                                            <Button className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 rounded-lg md:rounded-xl text-xs md:text-sm h-8 md:h-10 px-2" size="sm">
                                                Lihat
                                                <ArrowRight className="hidden md:ml-2 md:inline h-3 w-3 md:h-4 md:w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={getWhatsAppUrl(theme.name)} target="_blank" className="block mt-2">
                                            <Button
                                                className="w-full bg-green-500 hover:bg-green-600 text-white border-green-200 transition-all duration-300 rounded-lg md:rounded-xl text-xs md:text-sm h-8 md:h-10 px-2"
                                                size="sm"
                                            >
                                                <FaSms className="h-3 w-3 md:h-4 md:w-4" />
                                                Order via Wa
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* CTA Section - Fixed Mobile Layout */}
                <div className="text-center bg-white rounded-xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-pink-100 mx-auto w-full max-w-4xl">
                    <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-4">Suka dengan tema di atas?</h2>
                    <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8 max-w-2xl mx-auto">
                        Buat undangan digitalmu sendiri sekarang juga. Gratis uji coba, bayar jika sudah puas dengan hasilnya.
                    </p>
                    <Link href="/admin">
                        <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-6 md:px-10 py-4 md:py-6 rounded-full text-base md:text-lg shadow-lg shadow-pink-200 w-full md:w-auto">
                            <BadgeCheck className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                            Buat Undangan Sekarang
                        </Button>
                    </Link>
                </div>

            </main>

            <FooterSection />
        </div>
    );
}
