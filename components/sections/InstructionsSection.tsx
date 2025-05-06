"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

// Sample image for each step
const sampleImage = "https://i.pinimg.com/736x/86/3c/e4/863ce476748066d7923815576c6fb4fd.jpg";
const tutorialImage = "https://images.pexels.com/photos/265756/pexels-photo-265756.jpeg";

const steps = [
  { step: 1, title: "Buat Akun", linkText: "Daftar Sekarang", linkUrl: "/register", image: sampleImage },
  { step: 2, title: "Konfigurasi Acara & Profil", subtitle: "Upload foto, atur detail acara", image: sampleImage },
  { step: 3, title: "Pilih Template", linkText: "Eksplor Template", linkUrl: "/templates", image: sampleImage },
  { step: 4, title: "Terbitkan & Bagikan", subtitle: "Kirim tautan undangan ke tamu", image: sampleImage },
];

export default function InstructionsSection() {
  return (
    <section className="py-6 px-6 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Cara Menggunakan Platform
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Buat undangan profesional hanya dalam <span className="font-semibold text-pink-500">5 menit</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 order-1">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-gray-200 rounded-lg p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="text-2xl font-bold text-pink-500 mb-2">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {item.title}{' '}
                    {item.linkText && (
                      <a href={item.linkUrl} className="text-pink-500 hover:underline">
                        {item.linkText}
                      </a>
                    )}
                  </h3>
                  {item.subtitle && (
                    <p className="text-slate-700 text-sm">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={item.image}
                    alt={`Step ${item.step}`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 767px) 100vw, (min-width: 768px) 50vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Video */}
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-w-16 aspect-h-9 order-2">
            <Image
              src={tutorialImage}
              alt="Tutorial Video"
              className="object-cover"
              fill
              sizes="(max-width: 767px) 100vw, (min-width: 768px) 50vw"
            />
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full p-4 bg-pink-500 hover:bg-pink-600 transition-colors"
              >
                <PlayCircle size={48} className="text-white" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                Tutorial <span className="text-pink-500">Video</span>
              </h3>
              <p className="text-slate-700">Buat undangan online dengan cepat dan mudah.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
