"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Phone,
    BadgeCheck,
    LogIn,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Users,
    ClipboardList,
    Shirt,
    Gift,
    Wallet,
    Sparkles,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FooterSection from "@/components/sections/FooterSection";
import { Toaster } from "@/components/ui/toaster";

// ─── Helpers ────────────────────────────────────────────────────────────────
function gtag_report_conversion(url: string, label?: string) {
    const navigate = () => {
        if (/^https?:\/\//.test(url)) {
            try { window.open(url, "_blank"); } catch { window.location.href = url; }
        } else {
            window.location.href = url;
        }
    };
    if (typeof window === "undefined") return;
    const isGtagReady = !!(window as any).gtag;
    if (!isGtagReady) { navigate(); return; }
    let navigated = false;
    const callback = () => { if (navigated) return; navigated = true; navigate(); };
    try {
        (window as any).gtag("event", "conversion", {
            send_to: "AW-674897184/BcVHCNOC-KkaEKC66MEC",
            event_label: label || "wp_cta",
            value: 1.0, currency: "IDR", transaction_id: "",
            event_callback: callback,
        });
    } catch { callback(); }
    setTimeout(() => { if (!navigated) { navigated = true; navigate(); } }, 1000);
}

// ─── Header ─────────────────────────────────────────────────────────────────
function Header() {
    return (
        <motion.header
            className="sticky top-0 z-20 shadow-sm"
            style={{ background: "rgba(255, 246, 247, 0.85)", backdropFilter: "blur(10px)" }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
                <Link href="/">
                    <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} />
                </Link>
                <nav className="hidden md:flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => gtag_report_conversion("https://wa.me/6289654728249", "cta_wp_header_wa")}
                        className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-pink-50"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Minta dibuatkan
                    </button>
                    <button
                        type="button"
                        onClick={() => gtag_report_conversion("/admin", "cta_wp_header_admin")}
                        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center"
                    >
                        <BadgeCheck className="w-4 h-4 mr-2" />
                        Coba Gratis Sekarang!
                    </button>
                </nav>
                <div className="md:hidden flex items-center space-x-2">
                    <button
                        type="button"
                        className="border-2 border-pink-500 text-pink-500 rounded-full shadow-md hover:shadow-lg transition-all p-2 inline-flex items-center hover:bg-pink-50"
                        onClick={() => gtag_report_conversion("https://wa.me/6289654728249", "cta_wp_header_wa")}
                    >
                        <Phone className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all p-2 inline-flex items-center"
                        onClick={() => gtag_report_conversion("/admin", "cta_wp_header_admin")}
                    >
                        <LogIn className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.header>
    );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection() {
    return (
        <section className="relative py-12 px-6 overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-100 to-transparent opacity-40 z-0" />
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-20 z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-20 z-0" />

            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left Text */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-sm font-semibold px-4 py-1.5 rounded-full">
                                <Sparkles className="w-4 h-4" />
                                Sudah Termasuk di Undanganmu!
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-pink-800 leading-tight">
                                Wedding Planner{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                                    Gratis
                                </span>
                                , Lengkap & Mudah
                            </h1>
                            <p className="text-base md:text-lg text-pink-700 max-w-lg leading-relaxed">
                                Dari <strong>budget</strong>, <strong>vendor</strong>, hingga <strong>seserahan</strong> — semua persiapan pernikahanmu bisa dikelola dari satu tempat, bareng undanganmu.
                            </p>
                            <ul className="space-y-2 text-pink-700">
                                {[
                                    "Pantau progress pernikahan secara real-time",
                                    "Kelola vendor & status pembayaran",
                                    "Checklist administrasi pernikahan",
                                ].map((t) => (
                                    <li key={t} className="flex items-center gap-2 text-sm md:text-base">
                                        <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button
                                size="lg"
                                onClick={() => gtag_report_conversion("/admin", "wp_hero_cta_admin")}
                                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md hover:shadow-lg px-6 py-3 font-semibold"
                            >
                                🚀 Coba Gratis Sekarang
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => gtag_report_conversion("https://wa.me/6289654728249", "wp_hero_cta_wa")}
                                className="w-full sm:w-auto border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-full flex items-center gap-2 px-6 py-3 font-semibold"
                            >
                                💬 Konsultasi Gratis
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right: Dashboard Preview Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Main card - dashboard mock */}
                        <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-5 shadow-2xl shadow-rose-200 text-white">
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
                            <p className="text-xs font-semibold uppercase tracking-widest text-rose-200 mb-1 relative">Kesiapan Pernikahan</p>
                            <div className="flex items-end gap-3 mb-3 relative">
                                <span className="text-5xl font-black">72%</span>
                                <span className="text-rose-200 text-sm mb-1.5">overall progress</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-4 relative">
                                <motion.div
                                    className="h-2.5 rounded-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: "72%" }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2 relative">
                                {[
                                    { label: "Vendor", val: "5" },
                                    { label: "Tugas Done", val: "8/12" },
                                    { label: "Seserahan", val: "4/7" },
                                    { label: "Seragam", val: "12 pcs" },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white/15 rounded-xl p-2 text-center backdrop-blur-sm">
                                        <p className="text-sm font-bold">{s.val}</p>
                                        <p className="text-[9px] text-rose-200 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floating sub-card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-rose-100 max-w-[180px]"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">💰</span>
                                <p className="text-xs font-semibold text-gray-700">Budget</p>
                            </div>
                            <p className="text-base font-bold text-rose-600">Rp 45jt</p>
                            <p className="text-[10px] text-gray-400">dari Rp 65jt · 69%</p>
                            <div className="w-full bg-rose-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                <div className="h-1.5 rounded-full bg-amber-400 w-[69%]" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            className="absolute -top-5 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-rose-100"
                        >
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm font-bold text-gray-800">Vendor OK</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5">3 Lunas · 2 Booking</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ─── Features ────────────────────────────────────────────────────────────────
const features = [
    {
        icon: <Wallet className="h-8 w-8 text-emerald-500" />,
        emoji: "💰",
        title: "Budget Pernikahan",
        color: "bg-emerald-50 border-emerald-100",
        iconBg: "bg-emerald-100",
        description: "Catat semua rencana pengeluaran dan pantau realisasinya. Tahu persis berapa yang sudah terpakai dan sisa anggaran yang ada.",
        points: ["Tambah & kategorikan pengeluaran", "Progress bar pemakaian budget", "Notifikasi saat budget hampir habis"],
    },
    {
        icon: <Users className="h-8 w-8 text-violet-500" />,
        emoji: "🤝",
        title: "Manajemen Vendor",
        color: "bg-violet-50 border-violet-100",
        iconBg: "bg-violet-100",
        description: "Catat semua vendor yang kamu pakai — dari fotografer, katering, hingga dekorasi. Pantau status pembayaran setiap vendor.",
        points: ["Daftar vendor lengkap dengan kontak", "Status: Booking / Lunas / Pending", "Total biaya vendor otomatis"],
    },
    {
        icon: <ClipboardList className="h-8 w-8 text-amber-500" />,
        emoji: "📋",
        title: "Administrasi",
        color: "bg-amber-50 border-amber-100",
        iconBg: "bg-amber-100",
        description: "Checklist tugas administrasi pernikahan — dari urus surat nikah, sewa gedung, hingga persiapan hari H.",
        points: ["Template tugas siap pakai", "Tandai tugas selesai", "Progress persentase tugas"],
    },
    {
        icon: <Shirt className="h-8 w-8 text-pink-500" />,
        emoji: "👗",
        title: "Seragam Keluarga",
        color: "bg-pink-50 border-pink-100",
        iconBg: "bg-pink-100",
        description: "Catat seragam keluarga — jumlah baju, warna, dan total biaya. Biar koordinasi seragam nggak ada yang kelewatan.",
        points: ["Catat jumlah & warna seragam", "Hitung total biaya seragam", "Pantau per kelompok keluarga"],
    },
    {
        icon: <Gift className="h-8 w-8 text-orange-500" />,
        emoji: "🎁",
        title: "Seserahan",
        color: "bg-orange-50 border-orange-100",
        iconBg: "bg-orange-100",
        description: "Kelola daftar barang seserahan — dari jumlah item, estimasi harga, hingga mana yang sudah dibeli.",
        points: ["List item seserahan lengkap", "Estimasi total biaya", "Tandai item sudah dibeli"],
    },
];

function FeaturesSection() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="text-pink-500 font-semibold uppercase tracking-wider text-sm mb-2 block">
                        Fitur Wedding Planner
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4">
                        5 Modul Lengkap Persiapan Nikah
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Semua yang kamu butuhkan untuk persiapan pernikahan sudah tersedia — gratis, dan bisa langsung dipakai bareng undangan digitalmu.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className={`rounded-2xl border p-6 ${f.color} hover:shadow-lg transition-all hover:-translate-y-1`}
                        >
                            <div className={`w-14 h-14 ${f.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                                {f.icon}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{f.emoji}</span>
                                <h3 className="font-bold text-xl text-slate-800">{f.title}</h3>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{f.description}</p>
                            <ul className="space-y-1.5">
                                {f.points.map((p) => (
                                    <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Extra CTA card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 p-6 text-white hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">Overall Progress</h3>
                            <p className="text-rose-100 text-sm leading-relaxed mb-4">
                                Dashboard utama yang menampilkan kesiapan pernikahanmu secara keseluruhan — budget, vendor, administrasi, seragam & seserahan.
                            </p>
                        </div>
                        <Button
                            onClick={() => gtag_report_conversion("/admin", "wp_feature_cta")}
                            className="bg-white text-rose-600 hover:bg-rose-50 font-semibold rounded-full w-full"
                        >
                            Coba Sekarang →
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ─── Gallery / Showcase ───────────────────────────────────────────────────────
const galleryItems = [
    {
        title: "Dashboard Utama",
        desc: "Lihat progress pernikahan secara keseluruhan",
        color: "from-rose-500 to-pink-400",
        mockContent: (
            <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 p-4 text-white flex flex-col gap-3 h-full">
                {/* Header */}
                <div>
                    <p className="text-[9px] uppercase tracking-widest text-rose-200 mb-0.5">Kesiapan Pernikahan</p>
                    <div className="flex items-end gap-2 mb-1.5">
                        <p className="text-3xl font-black leading-none">72%</p>
                        <p className="text-[10px] text-rose-200 mb-0.5">overall</p>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full bg-white w-[72%]" />
                    </div>
                </div>
                {/* Mini stat chips */}
                <div className="grid grid-cols-2 gap-1.5">
                    {[
                        { label: "Vendor", val: "5" },
                        { label: "Tugas", val: "8/12" },
                        { label: "Seserahan", val: "4/7" },
                        { label: "Seragam", val: "12pcs" },
                    ].map(s => (
                        <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-lg p-1.5 text-center">
                            <p className="text-sm font-bold">{s.val}</p>
                            <p className="text-[8px] text-rose-200">{s.label}</p>
                        </div>
                    ))}
                </div>
                {/* Per-module mini progress */}
                <div className="space-y-1.5">
                    {[
                        { label: "Budget", pct: 69 },
                        { label: "Vendor", pct: 80 },
                        { label: "Administrasi", pct: 67 },
                    ].map(m => (
                        <div key={m.label}>
                            <div className="flex justify-between text-[8px] text-rose-100 mb-0.5">
                                <span>{m.label}</span>
                                <span>{m.pct}%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                                <div className="h-1 rounded-full bg-white/80" style={{ width: `${m.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        title: "Budget Tracker",
        desc: "Pantau setiap pengeluaran dengan detail",
        color: "from-emerald-500 to-teal-400",
        mockContent: (
            <div className="p-4">
                <p className="text-xs font-bold text-gray-700 mb-3">💰 Budget Pernikahan</p>
                {[
                    { label: "Katering", val: "Rp 15jt", pct: 80 },
                    { label: "Dekorasi", val: "Rp 8jt", pct: 55 },
                    { label: "Fotografer", val: "Rp 5jt", pct: 100 },
                    { label: "Busana", val: "Rp 6jt", pct: 70 },
                ].map(i => (
                    <div key={i.label} className="mb-2">
                        <div className="flex justify-between text-[10px] text-gray-600 mb-0.5">
                            <span>{i.label}</span><span className="font-semibold">{i.val}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${i.pct}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Daftar Vendor",
        desc: "Semua vendor terorganisir rapi",
        color: "from-violet-500 to-purple-400",
        mockContent: (
            <div className="p-4">
                <p className="text-xs font-bold text-gray-700 mb-3">🤝 Manajemen Vendor</p>
                {[
                    { n: "Fotografer Reza", status: "Lunas", c: "bg-green-100 text-green-700" },
                    { n: "Katering Bu Siti", status: "Booking", c: "bg-amber-100 text-amber-700" },
                    { n: "Dekorasi Elegan", status: "Lunas", c: "bg-green-100 text-green-700" },
                    { n: "MC Wedding", status: "Pending", c: "bg-gray-100 text-gray-600" },
                ].map(v => (
                    <div key={v.n} className="flex items-center justify-between mb-2 py-1 border-b border-gray-50">
                        <span className="text-[10px] text-gray-700 font-medium">{v.n}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${v.c}`}>{v.status}</span>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "Checklist Administrasi",
        desc: "Tidak ada tugas yang terlewat",
        color: "from-amber-500 to-orange-400",
        mockContent: (
            <div className="p-4">
                <p className="text-xs font-bold text-gray-700 mb-1">📋 Administrasi</p>
                <p className="text-[9px] text-gray-400 mb-3">8/12 selesai · 67%</p>
                {[
                    { t: "Urus Surat Nikah", done: true },
                    { t: "Booking Gedung", done: true },
                    { t: "Undang Keluarga", done: true },
                    { t: "Fitting Baju", done: false },
                    { t: "Gladi Resik", done: false },
                ].map(item => (
                    <div key={item.t} className="flex items-center gap-2 mb-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-amber-400" : "border border-gray-300"}`}>
                            {item.done && <span className="text-white text-[8px]">✓</span>}
                        </div>
                        <p className={`text-[10px] ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.t}</p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: "List Seserahan",
        desc: "Track seserahan dengan mudah",
        color: "from-orange-500 to-red-400",
        mockContent: (
            <div className="p-4">
                <p className="text-xs font-bold text-gray-700 mb-1">🎁 Seserahan</p>
                <p className="text-[9px] text-gray-400 mb-3">4/7 item dibeli</p>
                {[
                    { t: "Cincin Emas", price: "Rp 5jt", done: true },
                    { t: "Parfum", price: "Rp 800rb", done: true },
                    { t: "Tas Branded", price: "Rp 3jt", done: false },
                    { t: "Al-Qur'an", price: "Rp 500rb", done: true },
                    { t: "Baju Muslim", price: "Rp 2jt", done: false },
                ].map(s => (
                    <div key={s.t} className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded flex items-center justify-center flex-shrink-0 ${s.done ? "bg-orange-400" : "border border-gray-300"}`}>
                                {s.done && <span className="text-white text-[7px]">✓</span>}
                            </div>
                            <p className={`text-[10px] ${s.done ? "text-gray-400 line-through" : "text-gray-700"}`}>{s.t}</p>
                        </div>
                        <p className="text-[9px] text-gray-500">{s.price}</p>
                    </div>
                ))}
            </div>
        ),
    },
];

function GallerySection() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const scroll = (dir: "left" | "right") => {
        if (!sliderRef.current) return;
        sliderRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    };

    return (
        <section className="py-16 px-4 bg-pink-50/50">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-pink-500 font-semibold uppercase tracking-wider text-sm mb-2 block">
                        Tampilan Fitur
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
                        Lihat Seperti Apa di Dalamnya
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        Desain bersih dan mudah digunakan — tampilan seperti yang kamu pakai sehari-hari.
                    </p>
                </motion.div>

                <div className="relative group">
                    {/* Nav buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>

                    <div
                        ref={sliderRef}
                        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                        style={{ scrollbarWidth: "none" }}
                    >
                        {galleryItems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-shrink-0 snap-center w-64 md:w-72"
                            >
                                {/* Phone mockup */}
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                    {/* Phone status bar */}
                                    <div className={`bg-gradient-to-r ${item.color} px-4 py-3 flex items-center justify-between`}>
                                        <span className="text-white text-[9px] font-semibold">{item.title}</span>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                                            <div className="w-1 h-1 bg-white/60 rounded-full" />
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="bg-white h-[260px] overflow-hidden">
                                        {item.mockContent}
                                    </div>
                                </div>
                                <div className="mt-3 text-center">
                                    <h3 className="font-semibold text-slate-800 text-sm">{item.title}</h3>
                                    <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Tutorial / How-To ────────────────────────────────────────────────────────
const tutorialSteps = [
    {
        step: 1,
        emoji: "🔑",
        title: "Buat Undangan Dulu",
        subtitle: "Login dengan akun Google, lalu klik \"+ Buat Undangan\". Wedding Planner otomatis tersedia di setiap undangan yang kamu buat.",
        color: "border-rose-200 bg-rose-50",
        numColor: "bg-rose-500",
    },
    {
        step: 2,
        emoji: "💒",
        title: "Buka Wedding Planner",
        subtitle: "Dari halaman kelola undangan, tap menu \"Wedding Planner\" lalu kamu akan langsung melihat dashboard kesiapan pernikahanmu.",
        color: "border-pink-200 bg-pink-50",
        numColor: "bg-pink-500",
    },
    {
        step: 3,
        emoji: "📝",
        title: "Isi Data Persiapan",
        subtitle: "Tambahkan budget, catat vendor, buat checklist administrasi, daftarkan seragam keluarga, dan list barang seserahan.",
        color: "border-violet-200 bg-violet-50",
        numColor: "bg-violet-500",
    },
    {
        step: 4,
        emoji: "📊",
        title: "Pantau Progress Pernikahan",
        subtitle: "Lihat overall progress pernikahanmu — dari budget yang terpakai, tugas yang selesai, hingga vendor yang sudah lunas.",
        color: "border-amber-200 bg-amber-50",
        numColor: "bg-amber-500",
    },
];

function TutorialSection() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const scroll = (dir: "left" | "right") => {
        if (!sliderRef.current) return;
        const amount = sliderRef.current.clientWidth * 0.8;
        sliderRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                        Cara Pakai Wedding Planner
                    </h2>
                    <p className="text-gray-600 md:text-lg max-w-xl mx-auto leading-relaxed">
                        Mulai dari nol sampai siap nikah, cukup{" "}
                        <span className="font-semibold text-pink-500">4 langkah</span>
                    </p>
                </div>

                {/* Mobile carousel */}
                <div className="lg:hidden relative group">
                    <div className="absolute inset-y-0 left-0 z-10 flex items-center -translate-x-3">
                        <button onClick={() => scroll("left")} className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white">
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 z-10 flex items-center translate-x-3">
                        <button onClick={() => scroll("right")} className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white">
                            <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                    <div ref={sliderRef} className="pb-4 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                        <div className="flex gap-4 w-max">
                            {tutorialSteps.map((s) => (
                                <div key={s.step} className="w-[80vw] snap-center flex-shrink-0 mx-2">
                                    <div className={`rounded-2xl border p-6 h-full ${s.color}`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`w-8 h-8 ${s.numColor} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                                                {s.step}
                                            </span>
                                            <span className="text-2xl">{s.emoji}</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{s.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop grid */}
                <div className="hidden lg:grid grid-cols-4 gap-6">
                    {tutorialSteps.map((s, i) => (
                        <motion.div
                            key={s.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`rounded-2xl border p-6 ${s.color} hover:shadow-md transition-all`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`w-8 h-8 ${s.numColor} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                                    {s.step}
                                </span>
                                <span className="text-2xl">{s.emoji}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{s.subtitle}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        onClick={() => gtag_report_conversion("/admin", "wp_tutorial_cta")}
                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all group"
                    >
                        Mulai Sekarang Gratis
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

// ─── Stats / Social Proof ─────────────────────────────────────────────────────
function StatsSection() {
    const stats = [
        { val: "10.000+", label: "Undangan Dibuat", icon: "💌" },
        { val: "5 Modul", label: "Fitur Wedding Planner", icon: "📦" },
        { val: "Gratis", label: "Untuk Semua Pengguna", icon: "🎁" },
        { val: "5 Menit", label: "Siap Pakai", icon: "⚡" },
    ];

    return (
        <section className="py-12 px-4 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-500">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center text-white"
                        >
                            <div className="text-3xl mb-1">{s.icon}</div>
                            <p className="text-2xl md:text-3xl font-black mb-1">{s.val}</p>
                            <p className="text-rose-200 text-sm">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
    return (
        <motion.section
            className="relative py-20 bg-pink-100 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full opacity-50 blur-xl" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-pink-300 rounded-full opacity-30 blur-2xl" />
            <div className="container mx-auto px-4 text-center relative z-10">
                <span className="text-rose-500 font-semibold uppercase tracking-wider text-sm mb-3 block">
                    All-in-One Invitation Platform
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-pink-800 mb-4">
                    Buat Undangan Sekarang & Dapatkan Wedding Planner Gratis!
                </h2>
                <p className="text-lg text-pink-700 mb-8 max-w-2xl mx-auto">
                    Satu akun, satu undangan digital cantik, plus fitur wedding planner lengkap. Gratis untuk dicoba, bayar kalau sudah puas.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        onClick={() => gtag_report_conversion("/admin", "wp_cta_section_admin")}
                        className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 py-3 shadow-lg hover:scale-105 transition-transform duration-300 text-base font-semibold"
                    >
                        🚀 Coba Gratis Sekarang
                    </Button>
                    <Button
                        onClick={() => gtag_report_conversion("https://wa.me/6289654728249", "wp_cta_section_wa")}
                        variant="outline"
                        className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 rounded-full px-8 py-3 shadow-inner hover:scale-105 transition-transform duration-300 text-base font-semibold"
                    >
                        💬 Hubungi Admin
                    </Button>
                </div>
            </div>
        </motion.section>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function WeddingPlannerLandingPage() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <GallerySection />
            <TutorialSection />
            <CTASection />
            <FooterSection />
            <Toaster />
        </main>
    );
}
