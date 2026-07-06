"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-pink-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo & About */}
        <div className="flex flex-col items-start">
          <Image src="/logo.svg" alt="Papunda - Partner Kreatif Event" width={120} height={40} className="mb-4" />
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Partner kreatif terpercaya untuk semua acara spesialmu — dari undangan digital hingga event organizer skala besar.
          </p>
          {/* Social Media — TikTok & WA only */}
          <div className="flex gap-3 mt-5">
            <a
              href="https://www.tiktok.com/@papundastudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Papunda"
              className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 hover:bg-slate-900 hover:border-slate-900 hover:text-white flex items-center justify-center text-pink-400 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.86 4.86 0 01-1.01-.08z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/6289654728249"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Papunda"
              className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 hover:bg-green-500 hover:border-green-500 hover:text-white flex items-center justify-center text-pink-400 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Layanan Event */}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Layanan Event</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "🎉 Event Organizer", href: "#layanan" },
              { label: "💒 Wedding & Ceremony", href: "#layanan" },
              { label: "📸 Content Creator", href: "#layanan" },
              { label: "🎭 Pentas Seni", href: "#layanan" },
              { label: "🎤 MC Ulang Tahun", href: "#layanan" },
              { label: "🎮 Ice Breaking Games", href: "#layanan" },
              { label: "✨ Jasa Edit Foto", href: "/photo-editing" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-slate-500 hover:text-pink-600 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Undangan Digital */}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Undangan Digital</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "💌 Buat Undangan Gratis", href: "/admin" },
              { label: "💒 Undangan Pernikahan", href: "/undangan-pernikahan" },
              { label: "✂️ Undangan Khitanan", href: "/undangan-khitanan" },
              { label: "🎂 Undangan Ulang Tahun", href: "/undangan-ulang-tahun" },
              { label: "🖼️ Katalog Tema", href: "/katalog" },
              { label: "💒 Wedding Planner", href: "/wedding-planner" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-slate-500 hover:text-pink-600 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak & Pembayaran */}
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Hubungi Kami</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">WhatsApp</p>
              <a href="https://wa.me/6289654728249" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                +62 896-5472-8249
              </a>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:papundacare@gmail.com" className="text-slate-500 hover:text-pink-600 transition-colors">
                papundacare@gmail.com
              </a>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Website</p>
              <a href="https://papunda.com" className="text-slate-500 hover:text-pink-600 transition-colors">
                papunda.com
              </a>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Metode Pembayaran</p>
            <Image src="/payment.svg" alt="BCA, Mandiri, BRI, BNI" width={200} height={50} className="object-contain opacity-80" />
          </div>
        </div>
      </div>

      <Separator className="border-pink-100" />
      <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <p>Copyright © 2025 PT Digital Inter Nusa. All Rights Reserved.</p>
        <p>Made with 💗 by Papunda Team</p>
      </div>
    </footer>
  );
}
