"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SectionCTA() {
  const handleCTAClick = (buttonName: string) => {
    // Track with Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: buttonName,
        content_category: 'cta_section'
      });
    }
  };

  // Tambahkan fungsi gtag_report_conversion
  // Tambahkan fungsi gtag_report_conversion (robust)
  function gtag_report_conversion(url: string, label?: string) {
    const navigate = () => {
      if (typeof url === 'undefined') return;
      if (/^https?:\/\//.test(url)) {
        try {
          window.open(url, '_blank');
        } catch (e) {
          window.location.href = url;
        }
      } else {
        window.location.href = url;
      }
    };

    if (typeof window === 'undefined') return;

    const isGtagReady = !!(window as any).gtag;
    if (!isGtagReady) {
      navigate();
      return;
    }

    let navigated = false;
    const callback = () => {
      if (navigated) return;
      navigated = true;
      navigate();
    };

    try {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-674897184/BcVHCNOC-KkaEKC66MEC',
        event_label: label || 'cta_section',
        value: 1.0,
        currency: 'IDR',
        transaction_id: '',
        event_callback: callback,
      });
    } catch (e) {
      callback();
    }

    setTimeout(() => {
      if (!navigated) {
        navigated = true;
        navigate();
      }
    }, 1000);
  }

  return (
    <motion.section
      className="relative py-20 md:py-24 overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" />


      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/20">
            🌟 Siap Mulai?
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight max-w-3xl mx-auto">
            Wujudkan Acara Spesialmu
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Bersama Papunda!
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Konsultasi gratis, tanpa tekanan. Ceritakan kebutuhan acaramu dan tim kami siap bantu mewujudkannya.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => {
                handleCTAClick("cta_section_wa");
                gtag_report_conversion("https://wa.me/6289654728249?text=Halo%20Papunda,%20saya%20mau%20konsultasi%20acara", "cta_section_wa");
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-full px-8 py-4 text-base shadow-xl shadow-green-900/30 hover:-translate-y-0.5 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Konsultasi Gratis via WhatsApp
            </Button>
            <Button
              onClick={() => {
                handleCTAClick("cta_section_undangan");
                gtag_report_conversion("/admin", "cta_section_undangan");
              }}
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-4 text-base font-bold transition-all"
            >
              💌 Buat Undangan Digital Gratis
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
