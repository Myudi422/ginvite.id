"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";

const modules = [
    { emoji: "💰", label: "Budget", desc: "Pantau pengeluaran vs anggaran", color: "bg-emerald-50 border-emerald-100", dot: "bg-emerald-400" },
    { emoji: "🤝", label: "Vendor", desc: "Kelola status pembayaran vendor", color: "bg-violet-50 border-violet-100", dot: "bg-violet-400" },
    { emoji: "📋", label: "Administrasi", desc: "Checklist tugas pernikahan", color: "bg-amber-50 border-amber-100", dot: "bg-amber-400" },
    { emoji: "👗", label: "Seragam", desc: "Koordinasi seragam keluarga", color: "bg-pink-50 border-pink-100", dot: "bg-pink-400" },
    { emoji: "🎁", label: "Seserahan", desc: "Daftar & estimasi seserahan", color: "bg-orange-50 border-orange-100", dot: "bg-orange-400" },
];

export default function WeddingPlannerSpoiler() {
    return (
        <section className="py-20 px-4 bg-white overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-6"
                    >
                        <div>
                            <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                                ✨ Fitur Baru — Gratis!
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 leading-tight">
                            Wedding Planner{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
                                Sudah Termasuk
                            </span>{" "}
                            di Undanganmu
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                            Selain undangan digital cantik, kamu juga dapat akses <strong>Wedding Planner lengkap</strong> — kelola semua persiapan pernikahan dari satu tempat.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "5 modul persiapan: budget, vendor, administrasi, seragam & seserahan",
                                "Dashboard progress pernikahan secara real-time",
                                "Gratis untuk semua pengguna Papunda",
                            ].map((t) => (
                                <li key={t} className="flex items-start gap-3 text-slate-700">
                                    <CheckCircle2 className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link href="/wedding-planner">
                                <Button
                                    size="lg"
                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 shadow-md hover:shadow-lg font-semibold group"
                                >
                                    Lihat Fitur Lengkap
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/admin">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full px-6 font-semibold"
                                >
                                    🚀 Coba Gratis
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="relative"
                    >
                        {/* Main dashboard card */}
                        <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-6 text-white shadow-2xl shadow-rose-200">
                            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-white/10 rounded-full" />

                            <div className="relative flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">💒</div>
                                <div>
                                    <p className="text-xs text-rose-200 uppercase tracking-widest font-semibold">Wedding Planner</p>
                                    <p className="text-sm font-bold">Pernikahan Ahmad & Rina</p>
                                </div>
                            </div>

                            <p className="text-xs text-rose-200 uppercase tracking-widest font-semibold mb-1 relative">Kesiapan Pernikahan</p>
                            <div className="flex items-end gap-3 mb-3 relative">
                                <span className="text-5xl font-black">72%</span>
                                <span className="text-rose-200 text-sm mb-1.5">overall progress</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-5 relative">
                                <motion.div
                                    className="h-2.5 rounded-full bg-white"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "72%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-2 relative">
                                {[
                                    { label: "Vendor", val: "5" },
                                    { label: "Tugas", val: "8/12" },
                                    { label: "Seserahan", val: "4/7" },
                                    { label: "Seragam", val: "12pcs" },
                                ].map((s) => (
                                    <div key={s.label} className="bg-white/15 rounded-xl p-2.5 text-center backdrop-blur-sm">
                                        <p className="text-sm font-bold">{s.val}</p>
                                        <p className="text-[9px] text-rose-200 mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Module cards floating below */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {modules.map((m, i) => (
                                <motion.div
                                    key={m.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    className={`flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border shadow-sm hover:shadow-md transition-all ${m.color}`}
                                >
                                    <div className={`w-6 h-6 ${m.dot} rounded-full flex items-center justify-center text-[11px] flex-shrink-0`}>
                                        {m.emoji}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-800 leading-tight">{m.label}</p>
                                        <p className="text-[10px] text-gray-500 leading-tight truncate">{m.desc}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* CTA mini card */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7 }}
                                className="flex items-center gap-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl px-3 py-2.5 shadow-sm"
                            >
                                <TrendingUp className="w-5 h-5 text-white flex-shrink-0" />
                                <Link href="/wedding-planner" className="min-w-0">
                                    <p className="text-xs font-bold text-white">Lihat semua →</p>
                                    <p className="text-[10px] text-rose-100">Detail fitur</p>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
