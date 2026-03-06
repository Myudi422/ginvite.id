"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, MessageCircle, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

export default function StandaloneErrorPage() {
    const adminWhatsApp = "6289654728249";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />

                <div className="p-8 sm:p-10 text-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="w-24 h-24 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm"
                    >
                        <Wrench className="w-12 h-12" />
                    </motion.div>

                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
                        Sedang Perbaikan
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-[15px]">
                        Mohon maaf, halaman yang Anda tuju saat ini tidak dapat diakses atau sedang dalam tahap pemeliharaan. Kami sedang bekerja berusaha sebaik mungkin untuk segera menayangkannya kembali.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="group flex items-center justify-center w-full py-3.5 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold transition-all duration-200 gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                            Kembali ke Beranda
                        </Link>

                        <a
                            href={`https://wa.me/${adminWhatsApp}?text=Halo%20Admin,%20saya%20mendapatkan%20halaman%20error%terkait%pemeliharaan%20saat%20mengakses%20website%20Papunda.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full py-3.5 px-4 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-xl font-semibold transition-all duration-200 gap-2 active:scale-[0.98]"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Hubungi Admin via WhatsApp
                        </a>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                        Sistem Maintenance
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
