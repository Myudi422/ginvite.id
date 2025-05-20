"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

// Cover video menggunakan image 1.jpeg
const tutorialImage = "/tutor1.jpg";

const steps = [
  {
    step: 1,
    title: "Buat Akun",
    linkText: "Daftar & Login Sekarang",
    subtitle: "Cukup Login Pakai akun google anda",
    linkUrl: "/login",
    image: "/tutor1.jpg",
  },
  {
    step: 2,
    title: "Klik Tombol + Buat Undangan",
    subtitle: "Pilih Kategori Undangan Yang ingin dipilih, dan isi judul undangan, lalu simpan",
    image: "/tutor2.jpg",
  },
  {
    step: 3,
    title: "Pilih Template & Isi Data",
    subtitle: "Pilih Template Undangan serta isi data formulir dan aktifkan/nonaktifkan fitur yang ingin dipilih, lalu simpan",
    image: "/tutor3.jpg",
  },
  {
    step: 4,
    title: "Terbitkan & Bagikan",
    subtitle: "Kirim tautan undangan ke tamu, kamu bisa juga kirim tautan spesial per tamu!",
    image: "/tutor4.jpg",
  },
];

export default function InstructionsSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const scrollAmount = slider.clientWidth * 0.8;
    slider.scrollTo({
      left:
        direction === "left"
          ? slider.scrollLeft - scrollAmount
          : slider.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6 md:py-6 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Cara Menggunakan Papunda
          </h2>
          <p className="text-gray-600 md:text-lg max-w-xl mx-auto leading-relaxed">
            Buat undangan profesional hanya dalam {" "}
            <span className="font-semibold text-pink-500">5 menit</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-8">
          {/* Steps Grid */}
          <div className="lg:contents">
            {/* Mobile Carousel */}
            <div className="lg:hidden relative group">
              {/* Mobile nav */}
              <div className="absolute inset-y-0 left-0 z-10 flex items-center -translate-x-3">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-105"
                >
                  <ChevronLeft
                    className="w-6 h-6 text-gray-700"
                    strokeWidth={2}
                  />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 z-10 flex items-center translate-x-3">
                <button
                  onClick={() => scroll("right")}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-105"
                >
                  <ChevronRight
                    className="w-6 h-6 text-gray-700"
                    strokeWidth={2}
                  />
                </button>
              </div>

              <div
                ref={sliderRef}
                className="pb-4 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              >
                <div className="flex gap-4 w-max">
                  {steps.map((item) => (
                    <div
                      key={item.step}
                      className="w-[85vw] snap-center flex-shrink-0 mx-2"
                    >
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full overflow-hidden flex flex-col">
                        <div className="p-5 flex-grow">
                          <div className="text-pink-500 font-bold text-lg mb-2">
                            Step {item.step}
                          </div>
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
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="relative aspect-video bg-gray-50">
                          <Image
                            src={item.image}
                            alt={`Step ${item.step}`}
                            fill
                            className="object-cover object-center"
                            quality={85}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-6 h-full">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="text-pink-500 font-bold text-lg mb-3">
                      Step {item.step}
                    </div>
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
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="relative aspect-video bg-gray-50">
                    <Image
                      src={item.image}
                      alt={`Step ${item.step}`}
                      fill
                      className="object-cover object-center"
                      quality={85}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div className="
            group
            relative
            rounded-xl
            overflow-hidden
            shadow-xl hover:shadow-2xl transition-all
            aspect-video        /* default mobile 16:9 */
            lg:aspect-auto      /* desktop override */
            lg:h-full           /* desktop full height */
          ">
            {/* Background image fills entire box */}
            <Image
              src={tutorialImage}
              alt="Tutorial Video"
              fill
              className="object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
              quality={90}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/20 to-transparent" />

            {/* Play button */}
            <Button
              variant="ghost"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-0 w-20 h-20 bg-pink-500/90 hover:bg-pink-600 backdrop-blur-sm"
            >
              <PlayCircle className="text-white w-14 h-14" strokeWidth={1.5} />
            </Button>

            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-gray-900/80">
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}
