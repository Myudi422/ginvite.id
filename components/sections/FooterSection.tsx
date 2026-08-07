"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Send, Scissors, Gift, Sparkles, LayoutGrid, MessageSquare } from "lucide-react";

const WA_LINK = "https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi";

const invitationLinks = [
  { label: "Buat Undangan Gratis", href: "/admin", icon: Send },
  { label: "Undangan Pernikahan", href: "/undangan-pernikahan", icon: Heart },
  { label: "Undangan Khitanan", href: "/undangan-khitanan", icon: Scissors },
  { label: "Undangan Ulang Tahun", href: "/undangan-ulang-tahun", icon: Gift },
  { label: "Undangan Aqiqah", href: WA_LINK, icon: Sparkles },
  { label: "Katalog Tema", href: "/katalog", icon: LayoutGrid },
];

const eventLinks = [
  { label: "Event Organizer", href: WA_LINK },
  { label: "Wedding & Ceremony (WCC)", href: WA_LINK },
  { label: "Content Creator", href: WA_LINK },
  { label: "Pentas Seni", href: WA_LINK },
  { label: "MC Ulang Tahun", href: WA_LINK },
  { label: "Ice Breaking Games", href: WA_LINK },
  { label: "Jasa Edit Foto", href: "/photo-editing" },
];

export default function FooterSection() {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div className="lg:col-span-1 flex flex-col items-start">
          <div className="mb-3 bg-white/10 rounded-2xl p-2.5 inline-block">
            <Image src="/logo.svg" alt="Papunda – Undangan Digital" width={110} height={36} />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-4">
            Platform undangan digital yang elegan, mudah digunakan, dan gratis untuk dicoba. Buat undangan impianmu bersama Papunda.
          </p>
          <div className="flex gap-2">
            <a
              href="https://www.tiktok.com/@papundastudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Papunda"
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.86 4.86 0 01-1.01-.08z"/>
              </svg>
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Papunda"
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Undangan Digital links */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4">Undangan Digital</h3>
          <ul className="space-y-2 text-xs">
            {invitationLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-rose-300 transition-colors"
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon className="w-3 h-3 text-rose-500" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Layanan Event */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4">Layanan Event</h3>
          <ul className="space-y-2 text-xs">
            {eventLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-slate-400 hover:text-rose-300 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4">Hubungi Kami</h3>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">WhatsApp Admin</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                +62 896-5472-8249
              </a>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:papundacare@gmail.com" className="text-slate-400 hover:text-rose-300 transition-colors">
                papundacare@gmail.com
              </a>
            </div>
          </div>

          {/* WA CTA button */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat Admin Sekarang
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>Copyright © 2025 PT Digital Inter Nusa. All Rights Reserved.</p>
          <p className="inline-flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by Papunda Team
          </p>
        </div>
      </div>
    </footer>
  );
}
