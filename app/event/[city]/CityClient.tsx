"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Check,
  Phone,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Shield,
  Clock,
  Heart,
  Sparkles,
  CheckSquare,
  Square
} from "lucide-react";
import { Partner, WeddingPackage } from "@/lib/partner-data";
import { Button } from "@/components/ui/button";

interface CityClientProps {
  partner: Partner;
}

export default function CityClient({ partner }: CityClientProps) {
  // Checklist state for custom services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleToggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const getCustomWaLink = () => {
    const serviceList = selectedServices.map((s) => `- ${s}`).join("\n");
    const text = `Halo Event Papunda ${partner.cityName}, saya ingin berkonsultasi mengenai paket kustom pernikahan dengan layanan berikut:\n${serviceList}\n\nMohon info detail dan penawarannya.`;
    return `https://wa.me/${partner.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-white to-rose-50/40 text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      {/* ─── HEADER (Glassmorphic) ─── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-pink-100/40 shadow-sm shadow-pink-100/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/event" className="p-2 hover:bg-pink-50 rounded-full text-slate-600 hover:text-pink-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="relative h-8 w-24 sm:h-10 sm:w-32 transition-opacity hover:opacity-90">
              <Image src="/logo.svg" alt="Papunda Logo" fill className="object-contain" priority />
            </Link>
          </div>
          <div>
            <a
              href={`https://wa.me/${partner.whatsapp}?text=Halo%20Event%20Papunda%20${partner.cityName}%2C%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20wedding%20di%20${partner.cityName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-full px-6 py-2.5 text-sm shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Konsultasi Layanan
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* ─── BREADCRUMB (Soft gradient background) ─── */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-pink-100/30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-pink-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/event" className="hover:text-pink-600 transition-colors">Event</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-semibold">{partner.cityName}</span>
        </nav>
      </div>

      {/* ─── HERO PROFILE (Faded glass & blobs) ─── */}
      <section className="relative py-16 border-b border-pink-100/30 bg-gradient-to-b from-white to-pink-50/20 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-10 right-[-10%] w-[24rem] h-[24rem] bg-gradient-to-br from-pink-200/30 to-rose-200/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Profile Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/50 text-pink-600 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                <Shield className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Layanan Resmi Terstandarisasi Papunda
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Event Papunda {partner.cityName}
              </h1>
              <p className="text-slate-500 text-sm flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                {partner.address}
              </p>
            </div>

            {/* Stats (Elevated panels) */}
            <div className="flex gap-8 items-center py-3 px-6 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-100/40 shadow-md shadow-pink-100/5 w-fit">
              <div>
                <div className="flex items-center gap-1 text-slate-900 font-bold text-lg">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  {partner.rating}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Rating</p>
              </div>
              <div className="w-px h-8 bg-pink-100/50" />
              <div>
                <div className="text-slate-900 font-bold text-lg">
                  {partner.reviewsCount}+
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Pesta Sukses</p>
              </div>
              <div className="w-px h-8 bg-pink-100/50" />
              <div>
                <div className="text-slate-900 font-bold text-lg flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Cepat
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Respon CS</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {partner.about}
            </p>

            {/* List of Services icons */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilihan Jasa Tersedia:</h4>
              <div className="flex flex-wrap gap-2.5">
                {partner.services.map((srv, idx) => (
                  <span key={idx} className="bg-white/80 backdrop-blur-sm border border-pink-100/40 text-slate-700 text-xs px-3.5 py-1.5 rounded-full font-semibold shadow-sm hover:border-pink-300 transition-colors">
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Right Image */}
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-pink-200/30 border-4 border-white">
            <Image
              src={partner.heroImage}
              alt={`Event Papunda ${partner.cityName}`}
              fill
              className="object-cover"
              priority
            />
          </div>

        </div>
      </section>

      {/* ─── PACKAGES SECTION (Frosted Glass Package Cards) ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Pilihan Paket</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Paket Resepsi Pernikahan Lengkap
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            Kami menyusun paket siap pakai dengan rincian lengkap yang dapat disesuaikan dengan kebutuhan pesta pernikahan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partner.packages.map((pkg, idx) => {
            const isGold = pkg.name.toLowerCase().includes("gold");
            const waLink = `https://wa.me/${partner.whatsapp}?text=Halo%20Event%20Papunda%20${partner.cityName}%2C%20saya%20ingin%20konsultasi%20mengenai%20paket%20%22${encodeURIComponent(pkg.name)}%22`;
            
            return (
              <div
                key={idx}
                className={`bg-white/80 backdrop-blur-md rounded-3xl p-8 border shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/25 hover:-translate-y-1.5 ${
                  isGold ? "border-pink-300 ring-2 ring-pink-500/10" : "border-pink-100/40"
                }`}
              >
                {isGold && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-white" /> Rekomendasi Utama
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="py-4 border-y border-pink-100/30 bg-pink-50/20 px-4 rounded-2xl text-center shadow-inner">
                    <span className="text-sm font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent block">
                      Hubungi Tim untuk Penawaran Harga
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Dapatkan estimasi biaya terbaik sesuai konsep Anda</span>
                  </div>

                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Layanan:</h4>
                    <ul className="space-y-2.5">
                      {pkg.inclusions.map((inc, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-pink-100/30">
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button
                      className={`w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 ${
                        isGold
                          ? "bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:opacity-95 text-white shadow-md shadow-pink-200"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Konsultasikan Paket Ini
                    </Button>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CUSTOM SERVICES SELECTOR SECTION (Gradient backdrop & Styled grid) ─── */}
      <section className="py-24 bg-gradient-to-tr from-rose-50/50 via-white to-pink-50/40 border-y border-pink-200/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-200/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Pilihan Bebas</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Atur Pernikahan Impian (Jasa Custom)</h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Pilih sendiri layanan yang Anda butuhkan. Kami akan membuat penawaran harga khusus yang paling efisien untuk Anda.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 sm:p-10 border border-pink-100/60 shadow-2xl shadow-pink-100/10 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {partner.services.map((service, idx) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleService(service)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] duration-200 ${
                      isSelected
                        ? "border-pink-500 bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-700 font-bold shadow-md shadow-pink-100/50"
                        : "border-pink-100/40 hover:border-pink-300 text-slate-600 bg-slate-50/20"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-pink-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm">{service}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-4 border-t border-pink-100/30">
              <a
                href={getCustomWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block ${selectedServices.length === 0 ? "pointer-events-none opacity-50" : ""}`}
              >
                <Button
                  disabled={selectedServices.length === 0}
                  className="bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-full px-10 py-4.5 shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 transition-all flex items-center gap-2.5 text-base"
                >
                  <MessageSquare className="w-5 h-5" />
                  Konsultasikan Jasa Custom ({selectedServices.length} Terpilih)
                </Button>
              </a>
              {selectedServices.length === 0 && (
                <p className="text-xs text-slate-400 mt-2">Pilih minimal 1 jasa di atas untuk memulai</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO / PAST WORK ─── */}
      <section className="bg-gradient-to-b from-white to-pink-50/20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Portofolio Kerja</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Dokumentasi Resepsi Event Papunda {partner.cityName}
            </h2>
            <p className="text-slate-500">
              Galeri dari dekorasi dan dokumentasi acara nyata yang dikerjakan oleh tim kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {partner.portfolio.map((item, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg border border-pink-100/40 group hover:shadow-xl hover:border-pink-300 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full font-semibold">
                    {item.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS / TESTIMONIALS ─── */}
      <section className="py-24 bg-gradient-to-b from-pink-50/20 via-white to-rose-50/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Kata Pengantin</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Dipercaya oleh Pasangan di {partner.cityName}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partner.testimonials.map((testi, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-md border border-pink-100/50 p-8 rounded-3xl space-y-4 shadow-lg shadow-pink-100/5 flex flex-col justify-between hover:border-pink-300 transition-colors">
                <p className="text-slate-600 italic text-sm leading-relaxed">
                  &ldquo;{testi.comment}&rdquo;
                </p>
                <div className="flex items-center gap-3.5 pt-4 border-t border-pink-100/30">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-pink-200">
                    <Image src={testi.couplePhoto} alt={testi.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{testi.name}</h4>
                    <div className="flex items-center gap-0.5 text-amber-400 text-xs mt-0.5">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQS SECTION FOR MITRA ─── */}
      <section className="py-24 bg-gradient-to-b from-rose-50/30 via-white to-pink-50/50 border-t border-pink-100/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900">Ada Pertanyaan Lain?</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Apakah Anda ingin melakukan kustomisasi paket, menanyakan ketersediaan tanggal, atau merencanakan janji temu? Tim kami siap melayani Anda.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${partner.whatsapp}?text=Halo%20Event%20Papunda%20${partner.cityName}%2C%20saya%20ingin%20tanya-tanya%20detail%20mengenai%20layanan%20wedding`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-full px-8 py-4.5 text-sm flex items-center gap-2.5 mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
                <Phone className="w-4 h-4 text-pink-500 animate-bounce" />
                Mulai Konsultasi Gratis
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="relative h-8 w-24 sm:h-10 sm:w-32 mx-auto filter brightness-0 invert">
            <Image src="/logo.svg" alt="Papunda Logo" fill className="object-contain" />
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Layanan Resmi Event Papunda di {partner.cityName}. Terintegrasi penuh dengan seluruh ekosistem digital Papunda untuk menjamin kelancaran hari bahagia Anda.
          </p>
          <div className="text-xs text-slate-600 pt-4 border-t border-slate-800/80">
            Copyright © 2026 PT Digital Inter Nusa. All Rights Reserved
          </div>
        </div>
      </footer>

    </div>
  );
}
