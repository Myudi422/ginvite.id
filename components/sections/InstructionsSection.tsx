"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

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
    <section className="py-6 md:py-6 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Cara Menggunakan Platform
          </h2>
          <p className="text-gray-600 md:text-lg max-w-xl mx-auto leading-relaxed">
            Buat undangan profesional hanya dalam{' '}
            <span className="font-semibold text-pink-500">5 menit</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_0.9fr] gap-8 lg:gap-12">
          {/* Steps Grid */}
          <div className="lg:contents">
            {/* Mobile Carousel */}
            <div className="lg:hidden pb-4 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <div className="flex gap-4 w-max">
                {steps.map((item) => (
                  <div key={item.step} className="w-[calc(100vw-2rem)] snap-center flex-shrink-0">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full overflow-hidden">
                      <div className="p-5">
                        <div className="text-pink-500 font-bold text-lg mb-2">Step {item.step}</div>
                        <h3 className="text-gray-900 font-semibold text-lg mb-1.5">
                          {item.title}
                          {item.linkText && (
                            <a
                              href={item.linkUrl}
                              className="block text-pink-500 hover:text-pink-600 text-sm mt-1"
                            >
                              {item.linkText} →
                            </a>
                          )}
                        </h3>
                        {item.subtitle && (
                          <p className="text-gray-600 text-sm leading-relaxed">{item.subtitle}</p>
                        )}
                      </div>
                      <div className="relative aspect-video bg-gray-50">
                        <Image
                          src={item.image}
                          alt={`Step ${item.step}`}
                          fill
                          className="object-cover"
                          quality={85}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="text-pink-500 font-bold text-lg mb-3">Step {item.step}</div>
                    <h3 className="text-gray-900 font-semibold text-lg mb-2">
                      {item.title}
                      {item.linkText && (
                        <a
                          href={item.linkUrl}
                          className="block text-pink-500 hover:text-pink-600 text-sm mt-2"
                        >
                          {item.linkText} →
                        </a>
                      )}
                    </h3>
                    {item.subtitle && (
                      <p className="text-gray-600 text-sm leading-relaxed">{item.subtitle}</p>
                    )}
                  </div>
                  <div className="relative aspect-video bg-gray-50">
                    <Image
                      src={item.image}
                      alt={`Step ${item.step}`}
                      fill
                      className="object-cover"
                      quality={85}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div className="group relative h-full rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
            <div className="relative aspect-video bg-gray-900">
              <Image
                src={tutorialImage}
                alt="Tutorial Video"
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/20 to-transparent" />
              
              <Button
                variant="ghost"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 w-20 h-20 bg-pink-500/90 hover:bg-pink-600 backdrop-blur-sm"
              >
                <PlayCircle className="text-white w-14 h-14" strokeWidth={1.5} />
              </Button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-gray-900/80">
              <h3 className="text-2xl font-bold mb-2">
                Tutorial <span className="text-pink-300">Video</span>
              </h3>
              <p className="text-gray-200 text-sm">Buat undangan online dengan cepat dan mudah.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}