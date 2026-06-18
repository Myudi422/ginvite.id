"use client";

import { useState, useEffect, useMemo } from "react";

import Link from "next/link";
import { BadgeCheck, Phone, Eye, Search, LogIn, ChevronLeft, ChevronRight, ExternalLink, Sparkles, Palette, Type, LayoutGrid, Wand2, ArrowRight } from "lucide-react";
import FooterSection from "@/components/sections/FooterSection";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const ITEMS_PER_PAGE = 12; // KPK(2,3) = 6, pakai 12 agar pas di mobile (2 col) & desktop (3 col)

interface Theme {
    id: number;
    localId: number;
    name: string;
    category: string;
    image: string;
    usage_count: number;
}

interface CatalogClientProps {
    initialThemes: Theme[];
}

export default function CatalogClient({ initialThemes }: CatalogClientProps) {
    const [guestName, setGuestName] = useState("");
    const [themes, setThemes] = useState<Theme[]>(initialThemes);
    const [loading, setLoading] = useState(initialThemes.length === 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState("Semua");

    useEffect(() => {
        // If initialThemes is already populated, no client fetch is needed.
        if (initialThemes && initialThemes.length > 0) {
            setThemes(initialThemes);
            setLoading(false);
            return;
        }

        const fetchThemes = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://dev.legalpilar.id/v2/android/ginvite/index.php?action=theme");
                if (!res.ok) throw new Error("HTTP error " + res.status);
                const data = await res.json();
                if (data.status === "success" && Array.isArray(data.data)) {
                    // Sort by API ID ascending first to determine localId
                    const sortedById = [...data.data].sort((a: any, b: any) => a.id - b.id);

                    // Map and assign sequential localId
                    const mappedThemes = sortedById.map((item: any, index: number) => ({
                        id: item.id,
                        localId: index + 1,
                        name: item.name,
                        category: item.kategory_theme_nama || "Umum",
                        image: item.image_theme,
                        usage_count: Number(item.usage_count) || 0,
                    }));
                    mappedThemes.sort((a, b) => b.usage_count - a.usage_count);

                    // Auto-inject Theme 6 if missing from API
                    if (!mappedThemes.some((t: any) => t.localId === 6)) {
                        mappedThemes.push({
                            id: 9999,
                            localId: 6,
                            name: "Mildness",
                            category: "Premium",
                            image: "https://www.wevitation.com/themes/mildness/img/cover-1.jpg",
                            usage_count: 5
                        });
                    }

                    setThemes(mappedThemes);
                }
            } catch (error) {
                console.error("Failed to fetch themes in client fallback:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchThemes();
    }, [initialThemes]);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(themes.map(t => t.category)));
        return ["Semua", ...cats];
    }, [themes]);

    const filtered = useMemo(() => {
        return activeCategory === "Semua"
            ? themes
            : themes.filter(t => t.category === activeCategory);
    }, [themes, activeCategory]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const getPreviewUrl = (localId: number) => {
        const base = `/undang/147/demo-theme${localId}`;
        return guestName.trim() ? `${base}?to=${encodeURIComponent(guestName.trim())}` : base;
    };

    const getWhatsAppUrl = (themeName: string) => {
        const message = `Halo admin, saya tertarik dengan tema undangan *${themeName}*. Saya ingin memesan undangan digital.`;
        return `https://wa.me/6289654728249?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="min-h-screen bg-[#fdf7f9] font-sans text-slate-800 overflow-x-hidden">

            {/* ── HEADER ── */}
            <motion.header
                className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm"
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="Papunda Logo" width={110} height={36} className="h-9 w-auto" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            href="https://wa.me/6289654728249"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 border border-pink-300 text-pink-600 rounded-xl text-sm font-medium px-3 py-1.5 hover:bg-pink-50 transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Hubungi Admin</span>
                        </Link>
                        <Link
                            href="https://wa.me/6289654728249"
                            target="_blank"
                            className="sm:hidden p-2 border border-pink-300 text-pink-500 rounded-xl hover:bg-pink-50 transition-colors"
                            aria-label="Hubungi Admin"
                        >
                            <Phone className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold px-3 py-1.5 transition-colors shadow-sm"
                        >
                            <BadgeCheck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Buat Undangan</span>
                            <span className="sm:hidden"><LogIn className="w-4 h-4" /></span>
                        </Link>
                    </div>
                </div>
            </motion.header>

            <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 md:py-12 w-full">

                {/* ── HERO ── */}
                <div className="text-center mb-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-1.5"
                    >
                        Pilih Tema Undanganmu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="text-xs sm:text-sm md:text-base text-gray-400 px-2"
                    >
                        Coba preview langsung dengan nama tamu undangan.
                    </motion.p>
                </div>

                {/* ── GUEST NAME INPUT ── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="max-w-sm mx-auto mb-6 w-full"
                >
                    <div className="flex items-center gap-2 bg-white border border-pink-100 rounded-xl px-3 py-2 shadow-sm">
                        <Search className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Nama tamu (misal: Budi)"
                            className="flex-1 min-w-0 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-300"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                    </div>
                    <p className="text-center text-[11px] text-gray-400 mt-1.5">
                        *Nama akan ditampilkan di preview undangan
                    </p>
                </motion.div>

                {/* ── CATEGORY FILTER ── */}
                {!loading && categories.length > 2 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-none">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all ${activeCategory === cat
                                    ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                                    : "bg-white text-gray-500 border-pink-100 hover:border-pink-300 hover:text-pink-500"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── BUILDER PROMO CARD ── */}
                {!loading && activeCategory === "Semua" && currentPage === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-5 sm:p-8 text-white shadow-xl">
                            {/* Floating decorative elements */}
                            <div className="absolute top-3 right-4 sm:top-4 sm:right-8 opacity-10 text-white">
                                <Wand2 className="h-24 w-24 sm:h-36 sm:w-36 rotate-12" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-white/5 blur-2xl" />
                            <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-pink-400/10 blur-xl" />
                            
                            {/* Animated sparkles */}
                            <motion.div
                                className="absolute top-6 right-20 sm:right-32"
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                            </motion.div>
                            <motion.div
                                className="absolute bottom-8 right-12 sm:right-20"
                                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.2, 0.9] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                            >
                                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-200/80" />
                            </motion.div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
                                        <Wand2 className="h-3 w-3" /> Builder
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 backdrop-blur-sm text-[10px] sm:text-xs font-semibold tracking-wide uppercase text-yellow-200">
                                        <Sparkles className="h-3 w-3" /> Full Custom
                                    </span>
                                </div>
                                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold leading-tight mb-1.5 sm:mb-2">
                                    Buat Undangan Custom Sendiri
                                </h2>
                                <p className="text-xs sm:text-sm text-white/70 max-w-lg mb-4 sm:mb-5 leading-relaxed">
                                    Desain undangan digitalmu dari nol — atur warna, font, layout, dan 
                                    section sesuka hati. Kamu yang pegang kendali penuh!
                                </p>

                                {/* Feature highlights */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6">
                                    {[
                                        { icon: Palette, label: "Warna Bebas" },
                                        { icon: Type, label: "Font Pilihan" },
                                        { icon: LayoutGrid, label: "Layout Fleksibel" },
                                        { icon: Wand2, label: "Section Modular" },
                                    ].map((feat, i) => (
                                        <motion.div
                                            key={feat.label}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 + i * 0.08 }}
                                            className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5"
                                        >
                                            <feat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-300 flex-shrink-0" />
                                            <span className="text-[10px] sm:text-xs font-medium truncate">{feat.label}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-2 bg-white text-purple-700 hover:text-purple-800 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Mulai Buat Gratis
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── LEGACY TEMPLATE SECTION HEADER ── */}
                {!loading && (
                    <div className="mb-4">
                        {activeCategory === "Semua" && currentPage === 1 && (
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-pink-100">
                                        <LayoutGrid className="h-3.5 w-3.5 text-pink-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-gray-800">Template Siap Pakai</h3>
                                        <p className="text-[10px] sm:text-xs text-gray-400">Desain sudah jadi — kamu tinggal isi data undangan saja</p>
                                    </div>
                                </div>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                {filtered.length} tema tersedia
                                {activeCategory !== "Semua" && ` · ${activeCategory}`}
                            </p>
                            {totalPages > 1 && (
                                <p className="text-xs text-gray-400">
                                    Halaman {currentPage} dari {totalPages}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── GRID ── */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-pink-50 animate-pulse">
                                <div className="aspect-square bg-pink-50" />
                                <div className="p-2.5 space-y-2">
                                    <div className="h-2.5 bg-pink-50 rounded w-1/2" />
                                    <div className="h-3.5 bg-pink-50 rounded w-3/4" />
                                    <div className="h-6 bg-pink-50 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeCategory}-${currentPage}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
                        >
                            {paginated.map((theme) => (
                                <div
                                    key={theme.id}
                                    className="bg-white rounded-xl sm:rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group w-full min-w-0"
                                >
                                    {/* Image — square ratio (1:1) */}
                                    <div className="relative aspect-square bg-pink-50 overflow-hidden">
                                        <img
                                            src={theme.image}
                                            alt={theme.name}
                                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        {/* Hover overlay — preview link */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Link
                                                href={getPreviewUrl(theme.localId)}
                                                target="_blank"
                                                className="flex items-center gap-1.5 bg-white text-pink-600 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md hover:bg-pink-50 transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Preview
                                            </Link>
                                        </div>
                                        {/* Usage badge */}
                                        {theme.usage_count > 0 && (
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                {theme.usage_count}x dipakai
                                            </div>
                                        )}
                                    </div>

                                    {/* Card info */}
                                    <div className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 flex-1 min-w-0">
                                        <div className="min-w-0">
                                            <p className="text-[9px] sm:text-[10px] text-pink-400 font-semibold uppercase tracking-wide truncate">{theme.category}</p>
                                            <h3 className="text-[11px] sm:text-sm font-bold text-gray-800 truncate leading-snug">{theme.name}</h3>
                                        </div>
                                        <div className="flex gap-1 sm:gap-1.5 mt-auto min-w-0">
                                            <Link
                                                href={getPreviewUrl(theme.localId)}
                                                target="_blank"
                                                className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 text-[10px] sm:text-xs font-semibold border border-pink-100 transition-colors"
                                            >
                                                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                                <span className="truncate">Lihat</span>
                                            </Link>
                                            <Link
                                                href={getWhatsAppUrl(theme.name)}
                                                target="_blank"
                                                className="flex-1 min-w-0 flex items-center justify-center gap-0.5 sm:gap-1 py-1 sm:py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-[10px] sm:text-xs font-semibold transition-colors"
                                            >
                                                <FaWhatsapp className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                                <span className="truncate">Order</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* ── PAGINATION ── */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-8 flex-wrap">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 sm:p-2 rounded-xl border border-pink-100 bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                            aria-label="Halaman sebelumnya"
                        >
                            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => {
                                if (totalPages <= 5) return true;
                                if (p === 1 || p === totalPages) return true;
                                if (Math.abs(p - currentPage) <= 1) return true;
                                return false;
                            })
                            .reduce<(number | '...')[]>((acc, p, i, arr) => {
                                if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) {
                                    acc.push('...');
                                }
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, i) =>
                                item === '...' ? (
                                    <span key={`dot-${i}`} className="px-0.5 text-gray-400 text-xs">…</span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => goToPage(item as number)}
                                        className={`min-w-[30px] sm:min-w-[36px] h-8 sm:h-9 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-sm ${currentPage === item
                                            ? "bg-pink-500 text-white border-pink-500"
                                            : "bg-white text-gray-600 border-pink-100 hover:bg-pink-50 hover:text-pink-600"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 sm:p-2 rounded-xl border border-pink-100 bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
                            aria-label="Halaman berikutnya"
                        >
                            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                )}

                {/* ── CTA ── */}
                <div className="text-center bg-white rounded-2xl p-6 md:p-10 border border-pink-100 shadow-sm">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">Siap Buat Undanganmu?</h2>
                    <p className="text-sm text-gray-400 mb-6 max-w-lg mx-auto">
                        Pilih template siap pakai dan langsung isi data, atau gunakan Builder untuk desain custom tanpa batas.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
                        >
                            <Wand2 className="h-4 w-4" />
                            Buat Custom (Builder)
                        </Link>
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors"
                        >
                            <BadgeCheck className="h-4 w-4" />
                            Pakai Template
                        </Link>
                    </div>
                </div>
            </main>

            <FooterSection />
        </div>
    );
}
