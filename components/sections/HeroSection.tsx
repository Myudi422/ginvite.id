"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, ChevronDown } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const services = [
  "Event Organizer",
  "Wedding & Ceremony",
  "Pentas Seni",
  "Family Gathering",
  "MC Ulang Tahun",
  "Ice Breaking Games",
  "Content Creator",
];

const badges = [
  "✅ Konsultasi Gratis",
  "🎉 Semua Jenis Acara",
  "⚡ Tim Profesional",
  "💌 Undangan Digital",
];

export default function HeroSection() {
  const [currentService, setCurrentService] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % services.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  function gtag_report_conversion(url: string, label?: string) {
    const navigate = () => {
      if (typeof url === "undefined") return;
      if (/^https?:\/\//.test(url)) {
        try { window.open(url, "_blank"); } catch (e) { window.location.href = url; }
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
        event_label: label || "hero_cta",
        value: 1.0,
        currency: "IDR",
        transaction_id: "",
        event_callback: callback,
      });
    } catch (e) { callback(); }
    setTimeout(() => { if (!navigated) { navigated = true; navigate(); } }, 1000);
  }

  const handleCTAClick = (buttonName: string) => {
    trackCTAClick(buttonName, "hero_section");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead", {
        content_name: buttonName,
        content_category: "hero_section",
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center py-12 px-6 overflow-hidden bg-white">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/40 to-violet-50/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(251,207,232,0.4),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(196,181,253,0.2),transparent_60%)]" />

      {/* Floating decorative shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-violet-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Text Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-md shadow-pink-200">
                🌟 Partner Kreatif #1 Pilihan Klien
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 leading-tight">
                Partner Kreatif
                <br />
                <span className="text-slate-600 text-3xl md:text-4xl lg:text-5xl">untuk Semua</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Acara Spesialmu
                </span>
              </h1>

              {/* Rotating service */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-slate-500 text-base md:text-lg">Ahli dalam:</span>
                <div className="overflow-hidden h-8">
                  <motion.span
                    key={currentService}
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -32, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="block font-bold text-base md:text-lg text-pink-600"
                  >
                    {services[currentService]}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-slate-500 max-w-lg leading-relaxed"
            >
              Dari undangan digital, MC, pentas seni, wedding organizer, hingga event besar —
              satu tim Papunda siap wujudkan semua momenmu jadi kenangan tak terlupakan.
            </motion.p>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-block bg-white border border-pink-200 text-slate-600 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                onClick={() => {
                  handleCTAClick("hero_wa_konsultasi");
                  gtag_report_conversion("https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi%20acara", "hero_konsultasi");
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-xl shadow-green-200 hover:shadow-green-300 transition-all px-8 py-6 font-bold text-base hover:-translate-y-0.5"
              >
                <MessageSquare size={20} className="mr-2" />
                Konsultasi Gratis via WA
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("layanan");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto border-2 border-slate-300 text-slate-600 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50/50 rounded-full flex items-center gap-2 px-8 py-6 font-bold text-base transition-all"
              >
                Lihat Semua Layanan
                <ChevronDown size={18} />
              </Button>
            </motion.div>

            {/* Undangan digital sub-link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs text-slate-400"
            >
              Cari undangan digital gratis?{" "}
              <a
                href="/admin"
                className="text-pink-500 font-semibold hover:underline"
                onClick={() => {
                  handleCTAClick("hero_undangan_link");
                  gtag_report_conversion("/admin", "hero_undangan");
                }}
              >
                Coba buat sendiri →
              </a>
            </motion.p>
          </div>

          {/* Right — Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main card grid */}
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Card 1 — Large */}
              <div className="col-span-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl p-6 shadow-2xl shadow-rose-200 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">💒</div>
                  <div>
                    <div className="font-bold">Wedding & Ceremony</div>
                    <div className="text-white/70 text-xs">WCC Paket Lengkap</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["WO", "Dekorasi", "Katering", "Foto & Video"].map((s) => (
                    <div key={s} className="bg-white/15 rounded-xl px-3 py-2 text-xs font-medium text-center">✓ {s}</div>
                  ))}
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 shadow-xl shadow-amber-200 text-white">
                <div className="text-3xl mb-2">🎉</div>
                <div className="font-bold text-sm">Event Organizer</div>
                <div className="text-white/70 text-xs mt-1">Semua Jenis Acara</div>
                <div className="mt-3 bg-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold text-center">A-Z Kami Handle</div>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 shadow-xl shadow-violet-200 text-white">
                <div className="text-3xl mb-2">🎤</div>
                <div className="font-bold text-sm">MC & Games</div>
                <div className="text-white/70 text-xs mt-1">Ultah & Gathering</div>
                <div className="mt-3 bg-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold text-center">Seru & Berkesan</div>
              </div>

              {/* Stats overlay */}
              <div className="col-span-2 flex gap-3">
                {[
                  { n: "200+", l: "Acara Sukses" },
                  { n: "98%", l: "Klien Puas" },
                  { n: "5+", l: "Tahun Pengalaman" },
                ].map((s) => (
                  <div key={s.l} className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 text-center">
                    <div className="text-xl font-black text-slate-800">{s.n}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white border-2 border-pink-200 rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
            >
              <span className="text-xl">⭐</span>
              <div>
                <div className="text-xs font-bold text-slate-700">Rating 5.0</div>
                <div className="text-[10px] text-slate-400">dari 100+ ulasan</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}