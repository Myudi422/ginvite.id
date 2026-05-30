"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, Sparkles, AlertCircle, Wand2, UserCheck, Heart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const pricingPlans = [
  {
    title: "Uji Coba",
    price: "0",
    description: "Coba gratis bikin undangan sendiri & rasakan kemudahannya sebelum mengaktifkan.",
    features: [
      "Bebas Pilih Semua Desain Tema",
      "Kustom Warna & Font Sepuasnya",
      "Galeri Foto & Background Music",
      "Navigasi Peta Lokasi (Maps)",
      "Fitur RSVP Konfirmasi Kehadiran",
      "Masa Aktif Trial 3 Hari",
      "Edit Tanpa Batas Selama Trial",
    ],
    cta: "Mulai Coba Gratis",
    note: "Semua data kustomisasi Anda akan tersimpan saat Anda upgrade ke paket aktif.",
    color: "from-slate-50 to-slate-100/50 border-slate-200 text-slate-800",
    icon: <Wand2 className="w-5 h-5 text-slate-500" />,
    badge: null,
  },
  {
    title: "Builder Sepuasnya",
    price: "50.000",
    description: "Buat & edit undangan digital sepuasnya secara mandiri dengan platform builder canggih.",
    features: [
      "Bebas Drag & Drop Semua Section",
      "Masa Aktif Selamanya (Aktif Selamanya)",
      "Kolom Kado Digital & Bank Transfer",
      "Fitur RSVP & Buku Tamu Digital",
      "QR Code Check-In Tamu Cepat",
      "Navigasi Peta / Google Maps",
      "Background Musik Bebas Pilih",
      "Share Link Nama Tamu VIP Unlimited",
    ],
    cta: "Buat Sendiri Sekarang",
    popular: true,
    color: "from-pink-50 via-rose-50/30 to-white border-pink-300 text-pink-700 shadow-pink-100",
    icon: <Sparkles className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />,
    badge: "Paling Populer & Hemat",
  },
  {
    title: "Minta Dibuatkan",
    price: "80.000",
    description: "Terima beres! Kirim data & foto via WA, tim desainer ahli kami yang buatkan sampai rapi.",
    features: [
      "Semua Fitur Paket Builder Aktif",
      "Dibuatkan Langsung oleh Admin Papunda",
      "Revisi Sepuasnya Sampai Puas",
      "Bonus Sistem WA Blast Premium",
      "Notifikasi Tamu Hadir via WhatsApp",
      "Buku Tamu Kehadiran QR & RSVP",
      "Pengerjaan Super Cepat 1-2 Hari",
      "Konsultasi Persiapan Acara Gratis",
    ],
    cta: "Hubungi Admin via WA",
    color: "from-violet-500 via-purple-600 to-indigo-700 border-violet-600 text-white shadow-violet-200 dark:shadow-none",
    icon: <UserCheck className="w-5 h-5 text-violet-200" />,
    badge: "Mewah & Praktis",
    whatsappLink: "https://wa.me/6289654728249?text=Halo%20Admin%20Papunda,%20saya%20ingin%20pesan%20Paket%20Minta%20Dibuatkan%20Rp%20100rb",
  },
];

export default function PricingSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanFeatures, setSelectedPlanFeatures] = useState<string[]>([]);
  const [selectedPlanTitle, setSelectedPlanTitle] = useState("");

  const handleOpenDetails = (title: string, features: string[]) => {
    setSelectedPlanTitle(title);
    setSelectedPlanFeatures(features);
    setShowModal(true);
  };

  // Tambahkan fungsi gtag_report_conversion
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

  const handlePricingCTA = (planTitle: string, planPrice: string, targetUrl: string) => {
    // Track with Facebook Pixel
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "InitiateCheckout", {
        content_name: planTitle,
        content_category: "pricing",
        value: planPrice.replace(".", ""),
        currency: "IDR",
      });
    }
    gtag_report_conversion(targetUrl, `cta_pricing_${planTitle}`);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white via-pink-50/20 to-white overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            Harga Transparan
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-5 leading-tight">
            Pilihan Paket Undangan
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Pilih paket terbaik sesuai kebutuhan acaramu. Gratis uji coba, aktifkan kapan saja ketika sudah puas dengan hasilnya.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative flex flex-col justify-between rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 bg-gradient-to-b ${plan.popular ? "scale-105 z-10 hover:border-pink-400" : "hover:border-slate-300"
                } ${plan.color}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${plan.title === "Minta Dibuatkan"
                    ? "bg-amber-400 text-slate-900 border-amber-300"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400"
                  }`}>
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">{plan.title}</span>
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10">
                    {plan.icon}
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-[14px] font-bold opacity-75">Rp</span>
                  <span className="text-4xl md:text-5xl font-black tracking-tight">
                    {plan.price === "0" ? "GRATIS" : plan.price}
                  </span>
                  {plan.price !== "0" && (
                    <span className="text-xs font-bold opacity-70 ml-1">/Acara</span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-sm opacity-80 mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.slice(0, 6).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm leading-tight">
                      <CheckCircle2
                        className={`flex-shrink-0 mt-0.5 ${plan.title === "Minta Dibuatkan" ? "text-violet-200" : "text-pink-500"
                          }`}
                        size={16}
                      />
                      <span className="opacity-90">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 6 && (
                    <li>
                      <button
                        onClick={() => handleOpenDetails(plan.title, plan.features)}
                        className={`text-xs font-bold flex items-center gap-1 hover:underline ${plan.title === "Minta Dibuatkan" ? "text-violet-200" : "text-pink-600"
                          }`}
                      >
                        <Info size={14} />
                        Lihat {plan.features.length - 6} Fitur Lainnya...
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Area */}
              <div className="mt-auto">
                {plan.note && (
                  <p className="text-[11px] opacity-75 mb-4 italic text-center leading-tight">
                    {plan.note}
                  </p>
                )}

                <Link
                  href={plan.whatsappLink ? plan.whatsappLink : "/admin"}
                  target={plan.whatsappLink ? "_blank" : "_self"}
                  onClick={() => handlePricingCTA(plan.title, plan.price, plan.whatsappLink ? plan.whatsappLink : "/admin")}
                  className="block w-full"
                >
                  <Button className={`w-full py-6 rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${plan.title === "Minta Dibuatkan"
                      ? "bg-white text-violet-700 hover:bg-slate-50"
                      : plan.title === "Builder Sepuasnya"
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-pink-200"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}>
                    {plan.cta}
                  </Button>
                </Link>
                <p className="text-center text-[10px] opacity-60 mt-2">
                  {plan.title === "Uji Coba" ? "Tidak butuh kartu kredit" : "Satu kali bayar, aktif selamanya"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Feature Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold font-serif text-slate-800">
              Semua Fitur Paket {selectedPlanTitle}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Berikut adalah daftar lengkap keunggulan yang akan Anda dapatkan pada paket ini:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedPlanFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-tight text-slate-700">
                <CheckCircle2
                  className="flex-shrink-0 text-pink-500 mt-0.5"
                  size={16}
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-3 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="rounded-xl px-5">
                Tutup
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
