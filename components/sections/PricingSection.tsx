"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

const pricingPlans = {
  perUndangan: [
    {
      title: "Basic",
      price: "40RB",
      features: [
        "Semua Preset/Design Tema",
        "Edit warna & Font",
        "Gallery",
        "Background Music",
        "Maps",
        "RSVP (Konfirmasi kehadiran)",
        "Share Eksklusif - Nama Tamu",
        "Masa Aktif 1 Tahun",
        "Edit Tanpa Batas"
      ],
      cta: "Pilih Paket Ini"
    },
    {
      title: "Premium",
      price: "100RB",
      features: [
        "Semua Fitur Paket Basic",
        "BANK TRANSFER",
        "Gift",
        "Wa Blast & Notif Hadir",
        "Masa Aktif Selamanya",
        "Buku Hadir QR"
      ],
      cta: "Pilih Paket Populer",
      popular: true
    }
  ],
  langganan: [
    {
      title: "Langganan",
      price: "120RB/bulan",
      features: [
        "Bikin Unlimited Undangan",
        "Footer Brand Kamu",
        "Custom Domain Kamu",
        "Semua Fitur Paket Premium",
        "Prioritas Support",
        "Update Fitur Eksklusif"
      ],
      cta: "Mulai Langganan"
    }
  ]
};

export default function PricingSection() {
  const [selectedType, setSelectedType] = useState<"perUndangan" | "langganan">("perUndangan");

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
            Pilihan Paket Undangan
          </h2>
          
          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-pink-50 p-1 rounded-full">
              <button
                onClick={() => setSelectedType("perUndangan")}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedType === "perUndangan"
                    ? "bg-pink-600 text-white"
                    : "text-pink-600 hover:bg-pink-100"
                }`}
              >
                Per Undangan
              </button>
              <button
                onClick={() => setSelectedType("langganan")}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedType === "langganan"
                    ? "bg-pink-600 text-white"
                    : "text-pink-600 hover:bg-pink-100"
                }`}
              >
                Langganan
              </button>
            </div>
          </div>

          <p className="text-gray-600 md:text-lg">
            {selectedType === "perUndangan"
              ? "Bayar sekali untuk undangan spesialmu"
              : "Paket langganan untuk kebutuhan profesional"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(selectedType === "perUndangan"
              ? pricingPlans.perUndangan
              : pricingPlans.langganan
            ).map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-2 border-pink-300 bg-gradient-to-b from-pink-50 to-white"
                    : "border border-pink-100 bg-white"
                } ${
                  selectedType === "langganan"
                    ? "lg:col-span-3 bg-gradient-to-b from-pink-500 to-purple-500 text-white"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-pink-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                    POPULAR
                  </div>
                )}

                <div
                  className={`${
                    selectedType === "langganan" ? "text-white" : "text-pink-600"
                  } mb-6`}
                >
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {selectedType === "perUndangan" && (
                      <span className="text-gray-500">/undangan</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className={`flex-shrink-0 ${
                          selectedType === "langganan" ? "text-white" : "text-pink-500"
                        }`}
                        size={20}
                      />
                      <span
                        className={selectedType === "langganan" ? "text-white" : "text-gray-600"}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-full text-lg font-semibold py-6 ${
                    selectedType === "langganan"
                      ? "bg-white text-pink-600 hover:bg-gray-100"
                      : "bg-pink-600 hover:bg-pink-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}