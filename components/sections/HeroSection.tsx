"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const eventTypes = [
  "Pernikahan",
  "Khitanan",
  "Aqiqah",
  "Peresmian",
  "Launching",
  "Ulang Tahun",
  "Semuanya",
  "Wisuda",
  "Seminar",
  "Semuanya",
];

export default function HeroSection() {
  const [currentEventType, setCurrentEventType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventType((prev) => (prev + 1) % eventTypes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-6 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-transparent opacity-40 z-0" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 md:space-y-4 lg:space-y-5"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 leading-tight">
                Undangan Online <br className="hidden md:block" />
                Untuk{" "}
                <motion.span
                  key={currentEventType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 inline-block"
                >
                  {eventTypes[currentEventType]}
                </motion.span>
                <br className="hidden md:block" />
                <span className="text-green-500">GRATIS!</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-700">
                <span className="text-blue-500">Gampang</span> Banget!
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-lg">
                Coba buat undangan online <strong className="text-green-600">GRATIS</strong>, 5 menit jadi! <br className="hidden md:block" />
                Mau dibantu admin? <span className="italic text-orange-500">Gratis Uji Coba</span>, bayar setelah oke.
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md hover:shadow-lg transition-all px-6 py-3 font-semibold"
              >
                🚀 Coba Gratis Sekarang
              </Button>
              <Button
                variant="outline"
                size="lg"
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
                  src="https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg"
                  alt="Wedding Invitation"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[360px] md:h-[450px] lg:h-[550px] w-[200px] md:w-[260px] lg:w-[290px] rounded-3xl shadow-xl transform rotate-3 overflow-hidden border-4 md:border-6 lg:border-8 border-white z-10">
                <img
                  src="https://images.pexels.com/photos/1391580/pexels-photo-1391580.jpeg"
                  alt="Wedding Invitation Template"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 h-[200px] md:h-[250px] lg:h-[300px] w-[160px] md:w-[200px] lg:w-[250px] rounded-3xl shadow-xl transform rotate-12 overflow-hidden border-4 md:border-6 lg:border-8 border-white">
                <img
                  src="https://images.pexels.com/photos/5874232/pexels-photo-5874232.jpeg"
                  alt="Wedding Invitation Preview"
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