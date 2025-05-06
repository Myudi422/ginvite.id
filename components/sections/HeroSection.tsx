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
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-transparent opacity-40 z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800">
                Buat Undangan<br />
                Online Gratis<br />
                Untuk{" "}
                <motion.span
                  key={currentEventType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500 inline-block"
                >
                  {eventTypes[currentEventType]}
                </motion.span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-700">
                Tanpa Ribet!
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-lg">
                Coba sekarang dan buat undangan online uji coba{" "}
                <span className="font-semibold text-blue-500">GRATIS</span> untuk segala acara
                dalam waktu 5 menit - Gak mau ribet? Minta dibuatin admin uji coba Gratis, 
                bayar setelah jadi
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
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all px-8"
              >
                Uji Coba Gratis
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full flex items-center gap-2 px-8"
              >
                <MessageSquare size={18} />
                <span>Dibuatkan Admin</span>
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[600px] w-full max-w-[300px] mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 h-[500px] w-[250px] rounded-3xl shadow-2xl transform -rotate-12 overflow-hidden border-8 border-white">
                <img 
                  src="https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg" 
                  alt="Wedding Invitation" 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[550px] w-[280px] rounded-3xl shadow-2xl transform rotate-3 overflow-hidden border-8 border-white z-10">
                <img 
                  src="https://images.pexels.com/photos/1391580/pexels-photo-1391580.jpeg" 
                  alt="Wedding Invitation Template" 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 h-[300px] w-[250px] rounded-3xl shadow-2xl transform rotate-12 overflow-hidden border-8 border-white">
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