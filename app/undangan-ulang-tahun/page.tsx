"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare, Heart, BookUser, Users, Sparkles, CheckCircle2, Info, PartyPopper, Cake } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import FooterSection from "@/components/sections/FooterSection";
import { Toaster } from "@/components/ui/toaster";
import TestimonialsSection from "@/components/sections/testimoni";
import Image from 'next/image';
import { Menu, X, Phone, BadgeCheck, LogIn } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: "Kontak", href: "https://wa.me/6289654728249" },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function gtag_report_conversion(url: string, label: string) {
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
        event_label: label,
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
    <motion.header
      className="sticky top-0 z-20 shadow-sm"
      style={{
        background: 'rgba(255, 246, 247, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} />
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <button
            type="button"
            onClick={() => gtag_report_conversion(navigation[0].href, 'cta_header_wa_birthday')}
            className="border-2 border-purple-500 text-purple-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-purple-50"
          >
            <Phone className="w-4 h-4 mr-2" />
            Minta dibuatkan
          </button>
          <button
            type="button"
            onClick={() => gtag_report_conversion('/admin', 'cta_header_admin_birthday')}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 font-semibold whitespace-nowrap inline-flex items-center"
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            Coba Gratis Sekarang!
          </button>
        </nav>

        <div className="md:hidden flex items-center space-x-2">
          <button
            type="button"
            className="border-2 border-purple-500 text-purple-500 rounded-full shadow-md hover:shadow-lg transition-all p-2 font-semibold whitespace-nowrap inline-flex items-center hover:bg-purple-50"
            aria-label="Hubungi Admin"
            onClick={() => gtag_report_conversion(navigation[0].href, 'cta_header_wa_birthday')}
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all p-2 font-semibold whitespace-nowrap inline-flex items-center"
            aria-label="Coba Gratis"
            onClick={() => gtag_report_conversion('/admin', 'cta_header_admin_birthday')}
          >
            <LogIn className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function BirthdayHeroSection() {
  const handleCTAClick = (buttonName: string) => {
    trackCTAClick(buttonName, 'birthday_hero_section');
    
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: buttonName,
        content_category: 'birthday_hero_section'
      });
    }
  };

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
        event_label: label || 'birthday_hero_cta',
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
    <section className="relative py-6 px-6 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-transparent opacity-20 z-0" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 md:space-y-4 lg:space-y-5"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-purple-800 leading-tight">
                Undangan Ulang Tahun <br className="hidden md:block" />
                Digital <span className="text-purple-500">Meriah</span>
                <br className="hidden md:block" />
                <span className="text-green-600">GRATIS!</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-purple-700">
                <span className="text-purple-500">Ceria</span> & <span className="text-purple-500">Berkesan</span>!
              </h2>
              <p className="text-base md:text-lg text-purple-600 max-w-lg">
                Buat undangan ulang tahun digital yang <strong className="text-green-700">meriah dan ceria</strong>, 5 menit jadi! <br className="hidden md:block" />
                Dengan desain colorful untuk perayaan spesial Anda. <span className="italic text-orange-600">Gratis uji coba</span>, bayar setelah cocok.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => {
                  handleCTAClick('create_birthday_invitation');
                  gtag_report_conversion('/admin');
                }}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all px-6 py-3 font-semibold"
              >
                🎂 Buat Undangan Ulang Tahun
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  handleCTAClick('wa_cta_birthday');
                  gtag_report_conversion('https://wa.me/6289654728249');
                }}
                className="w-full sm:w-auto border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-full flex items-center gap-2 px-6 py-3 font-semibold"
              >
                <MessageSquare size={18} />
                <span>Minta Dibuatkan</span>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full max-w-[300px] mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 h-[320px] md:h-[400px] lg:h-[500px] w-[180px] md:w-[230px] lg:w-[260px] rounded-3xl shadow-xl transform -rotate-12 overflow-hidden border-4 md:border-6 lg:border-8 border-white">
                <img
                  src="/1.jpg"
                  alt="Birthday Invitation Template"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[360px] md:h-[450px] lg:h-[550px] w-[200px] md:w-[260px] lg:w-[290px] rounded-3xl shadow-xl transform rotate-3 overflow-hidden border-4 md:border-6 lg:border-8 border-white z-10">
                <img
                  src="/2.jpg"
                  alt="Colorful Birthday Invitation"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 h-[200px] md:h-[250px] lg:h-[300px] w-[160px] md:w-[200px] lg:w-[250px] rounded-3xl shadow-xl transform rotate-12 overflow-hidden border-4 md:border-6 lg:border-8 border-white">
                <img
                  src="/3.jpg"
                  alt="Birthday Digital Invitation Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BirthdayFeaturesSection() {
  return (
    <section className="px-6 py-6 bg-purple-10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-purple-500 uppercase tracking-wider mb-2">
            Fitur Undangan Ulang Tahun
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4">
            Undangan Digital Ulang Tahun
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Fitur lengkap untuk perayaan spesial Anda
          </p>
          <p className="text-xl font-medium text-slate-700 mt-2">
            Meriah, colorful, dan penuh kegembiraan!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {[
            {
              icon: <PartyPopper className="h-10 w-10 text-purple-500" />,
              title: "Desain Colorful",
              description: "Template undangan ulang tahun dengan desain meriah dan ceria"
            },
            {
              icon: <BookUser className="h-10 w-10" style={{ color: '#FF69B4' }} />,
              title: "Ucapan & Doa",
              description: "Koleksi ucapan selamat dan doa dari teman-teman"
            },
            {
              icon: <Users className="h-10 w-10 text-amber-500" />,
              title: "RSVP & Konfirmasi",
              description: "Kelola daftar tamu yang akan hadir di pesta ulang tahun"
            },
            {
              icon: <Cake className="h-10 w-10 text-orange-500" />,
              title: "Gallery & Memories",
              description: "Tampilkan foto-foto kenangan dan momen bahagia"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl text-slate-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-xl font-medium text-slate-700 italic">
            "Wujudkan pesta ulang tahun yang meriah dan berkesan selamanya"
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function BirthdayPricingSection() {
  const [showUjiCobaModal, setShowUjiCobaModal] = useState(false);

  const pricingPlans = [
    {
      title: "Uji Coba",
      price: "0",
      features: [
        "Semua Template Ulang Tahun",
        "Edit warna & Font",
        "Gallery Foto Kenangan",
        "Background Music Ceria",
        "Maps Lokasi Pesta",
        "RSVP (Konfirmasi kehadiran)",
        "Share dengan Nama Tamu",
        "Masa Aktif 4 Hari",
        "Edit Tanpa Batas",
      ],
      cta: "Coba Gratis!",
      note: "Semua fitur jika diaktifkan akan disesuaikan harganya jika sudah selesai.",
    },
    {
      title: "Basic",
      price: "40RB",
      features: [
        "Semua Template Ulang Tahun",
        "Edit warna & Font",
        "Gallery Foto Kenangan",
        "Background Music Ceria",
        "Maps Lokasi Pesta",
        "RSVP (Konfirmasi kehadiran)",
        "Share dengan Nama Tamu",
      ],
      cta: "Pilih Basic!",
    },
    {
      title: "Premium",
      price: "100RB",
      features: [
        "Semua Fitur Paket Basic",
        "Amplop Digital (Bank Transfer)",
        "Kado Digital",
        "WhatsApp Blast & Notifikasi",
        "RSVP Advanced",
        "Masa Aktif Selamanya",
        "Buku Tamu dengan QR Code",
      ],
      cta: "Pilih Premium!",
      popular: true,
    },
  ];

  const ujiCobaPlan = pricingPlans.find(plan => plan.title === "Uji Coba");
  const displayedUjiCobaFeatures = ujiCobaPlan?.features.slice(0, 5) || [];
  const remainingUjiCobaFeaturesCount = (ujiCobaPlan?.features.length || 0) - displayedUjiCobaFeatures.length;

  function gtag_report_conversion(url: string, label: string) {
    if (typeof window === 'undefined' || !(window as any).gtag) {
      window.location.href = url;
      return;
    }
    const callback = function () {
      if (typeof url !== 'undefined') {
        window.location.href = url;
      }
    };
    (window as any).gtag('event', 'conversion', {
      'send_to': 'AW-674897184/BcVHCNOC-KkaEKC66MEC',
      'event_label': label,
      'value': 1.0,
      'currency': 'IDR',
      'transaction_id': '',
      'event_callback': callback,
    });
    return false;
  }

  const handlePricingCTA = (planTitle: string, planPrice: string) => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "InitiateCheckout", {
        content_name: planTitle,
        content_category: "birthday_pricing",
        value: planPrice,
        currency: "IDR",
      });
    }
    gtag_report_conversion('/admin', `cta_birthday_pricing_${planTitle}`);
  };

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-purple-600 mb-4">
            Paket Undangan Ulang Tahun
          </h2>
          <p className="text-lg text-slate-600">
            Pilih paket yang sesuai untuk perayaan spesial Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-purple-300 bg-gradient-to-b from-purple-50 to-white"
                  : "border border-purple-100 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  POPULAR
                </div>
              )}

              <div className="text-purple-600 mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">
                    {plan.price === "0" ? "GRATIS" : plan.price}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-gray-500">/undangan</span>
                  )}
                </div>
              </div>
              <ul className="space-y-4 mb-4">
                {plan.title === "Uji Coba"
                  ? displayedUjiCobaFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          className="flex-shrink-0 text-purple-500"
                          size={20}
                        />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))
                  : plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          className="flex-shrink-0 text-purple-500"
                          size={20}
                        />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                {plan.title === "Uji Coba" &&
                  ujiCobaPlan?.features.length! > 5 && (
                    <li className="flex items-center gap-3">
                      <Info
                        className="flex-shrink-0 text-gray-500 cursor-pointer"
                        size={20}
                        onClick={() => setShowUjiCobaModal(true)}
                      />
                      <button
                        onClick={() => setShowUjiCobaModal(true)}
                        className="text-sm text-purple-500 hover:underline focus:outline-none"
                      >
                        Lainnya ({remainingUjiCobaFeaturesCount})
                      </button>
                    </li>
                  )}
              </ul>
              {plan.note && (
                <p className="text-sm text-gray-500 mb-4 italic">{plan.note}</p>
              )}

              <Link
                href="/admin"
                className="block mt-6"
                onClick={() => handlePricingCTA(plan.title, plan.price)}
              >
                <Button className="w-full rounded-full text-lg font-semibold py-3 bg-purple-600 hover:bg-purple-700 text-white">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={showUjiCobaModal} onOpenChange={setShowUjiCobaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Semua Fitur Paket Uji Coba Ulang Tahun</DialogTitle>
            <DialogDescription>
              Berikut adalah semua fitur yang tersedia pada paket Uji Coba untuk undangan ulang tahun:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-4">
            {ujiCobaPlan?.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  className="flex-shrink-0 text-purple-500"
                  size={20}
                />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Tutup
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function BirthdayCTASection() {
  const handleCTAClick = (buttonName: string) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: buttonName,
        content_category: 'birthday_cta_section'
      });
    }
  };

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
        event_label: label || 'birthday_cta_section',
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
      className="relative py-16 bg-purple-100 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
          Wujudkan Pesta Ulang Tahun Yang Meriah Dan Berkesan
        </h2>
        <p className="text-lg text-purple-600 mb-8">
          Mulai sekarang, buat undangan ulang tahun digital yang colorful dan ceria untuk perayaan spesial Anda.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={() => gtag_report_conversion('/admin', 'birthday_cta_section_admin')}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            🎂 Buat Undangan Ulang Tahun
          </Button>
          <Button 
            onClick={() => gtag_report_conversion('https://wa.me/6289654728249', 'birthday_cta_section_wa')}
            variant="outline" 
            className="border-purple-500 text-purple-500 hover:bg-purple-50 rounded-full px-6 py-3 shadow-inner transform hover:scale-105 transition-transform duration-300"
          >
            Hubungi Admin
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export default function UndanganUlangTahun() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <BirthdayHeroSection />
      <BirthdayFeaturesSection />
      <TestimonialsSection />
      <BirthdayPricingSection />
      <BirthdayCTASection />
      <FooterSection />
      <Toaster />
    </main>
  );
}