"use client";

import Image from "next/image";
import Link from "next/link";

const WA_LINK = "https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi";

const invitationLinks = [
  { label: "💌 Buat Undangan Gratis", href: "/admin" },
  { label: "💒 Undangan Pernikahan", href: "/undangan-pernikahan" },
  { label: "✂️ Undangan Khitanan", href: "/undangan-khitanan" },
  { label: "🎂 Undangan Ulang Tahun", href: "/undangan-ulang-tahun" },
  { label: "🌿 Undangan Aqiqah", href: WA_LINK },
  { label: "🖼️ Katalog Tema", href: "/katalog" },
];

const eventLinks = [
  { label: "🎉 Event Organizer", href: WA_LINK },
  { label: "💒 Wedding & Ceremony (WCC)", href: WA_LINK },
  { label: "📸 Content Creator", href: WA_LINK },
  { label: "🎭 Pentas Seni", href: WA_LINK },
  { label: "🎤 MC Ulang Tahun", href: WA_LINK },
  { label: "🎮 Ice Breaking Games", href: WA_LINK },
  { label: "✨ Jasa Edit Foto", href: "/photo-editing" },
];

export default function FooterSection() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div className="lg:col-span-1 flex flex-col items-start">
          <div className="mb-4 bg-white/10 rounded-2xl p-3 inline-block">
            <Image src="/logo.svg" alt="Papunda – Undangan Digital" width={110} height={36} />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-5">
            Platform undangan digital yang elegan, mudah digunakan, dan gratis untuk dicoba. Buat undangan impianmu bersama Papunda.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.tiktok.com/@papundastudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Papunda"
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.86 4.86 0 01-1.01-.08z"/>
              </svg>
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Papunda"
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-green-500 hover:border-green-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Undangan Digital links */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-5">Undangan Digital</h3>
          <ul className="space-y-2.5 text-sm">
            {invitationLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-slate-400 hover:text-pink-300 transition-colors"
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Layanan Event (semua ke WA) */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-5">Layanan Event</h3>
          <ul className="space-y-2.5 text-sm">
            {eventLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-slate-400 hover:text-pink-300 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
            💬 Konsultasi event? Langsung chat admin kami via WA — gratis!
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-5">Hubungi Kami</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">WhatsApp Admin</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                +62 896-5472-8249
              </a>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">Email</p>
              <a href="mailto:papundacare@gmail.com" className="text-slate-400 hover:text-pink-300 transition-colors">
                papundacare@gmail.com
              </a>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">Website</p>
              <a href="https://papunda.com" className="text-slate-400 hover:text-pink-300 transition-colors">
                papunda.com
              </a>
            </div>
          </div>

          {/* WA CTA button */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat Admin Sekarang
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>Copyright © 2025 PT Digital Inter Nusa. All Rights Reserved.</p>
          <p>Made with 💗 by Papunda Team</p>
        </div>
      </div>
    </footer>
  );
}
