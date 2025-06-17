"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Testimonial data (sama seperti sebelumnya)
const testimonials = [
  { name: "Merry & Anne", image: "https://hi.browedding.id/wp-content/uploads/2024/10/resepsi-1-scaled-e1687971665857-150x150.jpg" },
  { name: "Elsa & Ahmad", image: "https://hi.browedding.id/wp-content/uploads/2024/10/3_11zon-150x150.webp" },
  { name: "Putri & Lyus", image: "https://hi.browedding.id/wp-content/uploads/2024/10/Tanpa-judul-300-×-300-piksel-1-1-150x150.png" },
  { name: "Intan & Sandi", image: "https://hi.browedding.id/wp-content/uploads/2024/10/intan-150x150.png" },
  { name: "Alisa & Khoir", image: "https://hi.browedding.id/wp-content/uploads/2024/10/6_11zon-1-150x150.webp" },
  { name: "Alfina & Dimas", image: "https://hi.browedding.id/wp-content/uploads/2024/10/4_11zon-150x150.webp" },
  { name: "Wita & Arya", image: "https://hi.browedding.id/wp-content/uploads/2024/10/wita-arya-8-150x150-1.jpg" },
  { name: "Novi & Ari", image: "https://hi.browedding.id/wp-content/uploads/2024/10/5_11zon-150x150.webp" },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Default for larger screens

  // Ini adalah inti dari responsivitas "grid" slider Anda:
  // Menyesuaikan jumlah testimonial yang terlihat per tampilan berdasarkan lebar layar.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // Tampilkan 1 testimonial per slide di layar kecil (mobile)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tampilkan 2 testimonial per slide di layar menengah (tablet)
      } else {
        setItemsPerPage(3); // Tampilkan 3 testimonial per slide di layar besar (desktop)
      }
    };

    handleResize(); // Set nilai awal saat komponen dimuat
    window.addEventListener("resize", handleResize); // Tambahkan event listener untuk resize
    return () => window.removeEventListener("resize", handleResize); // Cleanup event listener
  }, []);

  // Fungsionalitas autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  // Modifikasi handler navigasi
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      // Kembali ke 0 jika mencapai batas maksimum yang bisa ditampilkan
      return nextIndex > testimonials.length - itemsPerPage ? 0 : nextIndex;
    });
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      // Pindah ke index maksimum yang masih bisa menampilkan itemsPerPage item
      return nextIndex < 0 ? testimonials.length - itemsPerPage : nextIndex;
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4 tracking-tight">
            Our Happy Clients
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Dengarkan cerita dari pasangan yang telah berbahagia menciptakan momen tak terlupakan bersama kami.
          </p>
        </div>

        {/* Wrapper utama untuk slider dan tombol navigasi */}
        <div className="relative">
          {/* Kontainer untuk semua testimonial yang bergerak */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex * 100) / testimonials.length}%)`,
              width: `${(100 / itemsPerPage) * testimonials.length}%`,
            }}
          >
            {/* Duplikasi testimonials untuk efek infinite scroll */}
            {[...testimonials, ...testimonials.slice(0, itemsPerPage)].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-4 py-6"
                style={{ width: `${100 / testimonials.length}%` }}
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col items-center text-center h-full">
                  <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-pink-200 mb-6 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mt-auto">
                    {testimonial.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Navigasi (disembunyikan di mobile) */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-6 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-pink-600 p-3 rounded-full shadow-lg focus:outline-none transition-all duration-200 z-10 hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-6 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-pink-600 p-3 rounded-full shadow-lg focus:outline-none transition-all duration-200 z-10 hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indikator Pagination Dots */}
        <div className="flex justify-center mt-10 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                // Highlight dot jika slide testimonial berada dalam tampilan saat ini
                index >= currentIndex && index < currentIndex + itemsPerPage
                  ? "bg-pink-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}