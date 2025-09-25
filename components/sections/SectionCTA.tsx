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
      className="relative py-16 bg-pink-100 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Decorative Shapes */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-pink-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-pink-700 mb-4">
          Yuk Buat Undangan Digital Anda dengan cepat & rayakan moment mu bersama Papunda.
        </h2>
        <p className="text-lg text-pink-600 mb-8">
          Mulai sekarang, buat undangan digital cantik tanpa ribet dan nikmati kemudahan dalam mengundang tamu.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => gtag_report_conversion('/admin', 'cta_section_admin')}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Coba Gratis
          </Button>
          <Button 
            onClick={() => gtag_report_conversion('https://wa.me/6289654728249', 'cta_section_wa')}
            variant="outline" 
            className="border-pink-500 text-pink-500 hover:bg-pink-50 rounded-full px-6 py-3 shadow-inner transform hover:scale-105 transition-transform duration-300"
          >
            Hubungi Admin
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
