"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const WA_NUMBER = "6289654728249";
const WA_DISPLAY = "+62 896-5472-8249";
const WA_URL = `https://wa.me/${WA_NUMBER}`;

const links = [
    {
        id: "website",
        label: "🌐 Kunjungi Website Kami",
        sub: "papunda.com",
        href: "https://papunda.com",
        external: true,
        gradient: "from-pink-500 to-rose-500",
        shadow: "shadow-pink-200",
        icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
            </svg>
        ),
    },
    {
        id: "katalog",
        label: "💌 Lihat Katalog Undangan",
        sub: "Pilih tema favoritmu",
        href: "/katalog",
        external: false,
        gradient: "from-violet-500 to-purple-600",
        shadow: "shadow-purple-200",
        icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        id: "whatsapp",
        label: "💬 Minta Dibuatkan (terima beres)",
        sub: WA_DISPLAY,
        href: WA_URL,
        external: true,
        gradient: "from-green-400 to-emerald-500",
        shadow: "shadow-green-200",
        icon: (
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
];

const stats = [
    { value: "1000+", label: "Undangan Dibuat" },
    { value: "4.9★", label: "Rating Klien" },
    { value: "Fast", label: "Respon CS" },
];

export default function BioPage() {
    const [pressed, setPressed] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1050] to-[#0f0a1e] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">

            {/* Ambient glow blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px]" />
            </div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="pointer-events-none absolute rounded-full"
                    style={{
                        width: `${6 + i * 3}px`,
                        height: `${6 + i * 3}px`,
                        background: i % 2 === 0 ? "rgba(236,72,153,0.4)" : "rgba(139,92,246,0.4)",
                        top: `${10 + i * 15}%`,
                        left: `${5 + i * 14}%`,
                    }}
                    animate={{ y: [-12, 12, -12], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                />
            ))}

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center gap-6">

                {/* Avatar & Identity */}
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center gap-3"
                >
                    {/* Logo ring */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-rose-400 to-violet-500 blur-sm scale-110 animate-pulse" />
                        <div className="relative w-24 h-24 rounded-full border-[3px] border-white/30 bg-white flex items-center justify-center overflow-hidden">
                            <Image
                                src="/logo.svg"
                                alt="Papunda Logo"
                                width={64}
                                height={64}
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Papunda</h1>
                        <p className="text-pink-300 text-sm font-medium mt-0.5">@papunda.id</p>
                        <p className="text-white/60 text-xs mt-2 leading-relaxed max-w-[260px]">
                            ✨ Platform undangan digital gratis ujicoba · Bantu sampai beres · Bayar kalau sudah puas!
                        </p>
                    </div>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="w-full grid grid-cols-3 gap-2"
                >
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-3 flex flex-col items-center gap-0.5">
                            <span className="text-white font-bold text-sm">{s.value}</span>
                            <span className="text-white/50 text-[10px] text-center leading-tight">{s.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Link Buttons */}
                <div className="w-full flex flex-col gap-3">
                    {links.map((link, i) => {
                        const Wrapper = link.external ? "a" : Link;
                        const wrapperProps = link.external
                            ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                            : { href: link.href };

                        return (
                            <motion.div
                                key={link.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Wrapper
                                    {...(wrapperProps as any)}
                                    onMouseDown={() => setPressed(link.id)}
                                    onMouseUp={() => setPressed(null)}
                                    onTouchStart={() => setPressed(link.id)}
                                    onTouchEnd={() => setPressed(null)}
                                    className={`
                    flex items-center gap-4 w-full rounded-2xl px-5 py-4
                    bg-gradient-to-r ${link.gradient}
                    text-white font-semibold
                    transition-all duration-200
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    ${pressed === link.id ? "scale-[0.97] brightness-90" : ""}
                    no-underline
                  `}
                                >
                                    <div className="bg-white/20 rounded-xl p-2 flex items-center justify-center">
                                        {link.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold leading-tight truncate">{link.label}</div>
                                        <div className="text-white/70 text-xs mt-0.5 truncate">{link.sub}</div>
                                    </div>
                                    <svg className="w-4 h-4 opacity-60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Wrapper>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center"
                >
                    <p className="text-white/70 text-xs leading-relaxed">
                        Mau undangan digital yang cantik? <br />
                        <span className="text-pink-300 font-semibold">Coba gratis sekarang — bayar kalau sudah puas! 🎉</span>
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-white/25 text-[10px] text-center"
                >
                    © 2025 Papunda · papunda.com
                </motion.p>

            </div>
        </div>
    );
}
