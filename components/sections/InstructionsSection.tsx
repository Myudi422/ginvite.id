"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function InstructionsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-pink-500 mb-4">
            Cara Membuat Undangan kamu
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Cara mudah membuat undangan, hanya butuh <span className="font-bold text-slate-800">5 menit</span> undangan 
            kamu sudah bisa di sebarkan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            {[
              {
                step: 1,
                title: "Registrasi untuk membuat akun undangan kamu",
                link: "di sini",
                image: "https://images.pexels.com/photos/1059114/pexels-photo-1059114.jpeg"
              },
              {
                step: 2,
                title: "Isi Info Acara & Profile dan juga upload foto/gallery.",
                subtitle: "Customize undangan kamu.",
                image: "https://images.pexels.com/photos/1059115/pexels-photo-1059115.jpeg"
              },
              {
                step: 3,
                title: "Pilih Preset / Template.",
                link: "Lihat daftar template kita.",
                image: "https://images.pexels.com/photos/3585090/pexels-photo-3585090.jpeg"
              },
              {
                step: 4,
                title: "Aktifkan",
                subtitle: ", dan undangan kamu siap untuk di sebarkan.",
                image: "https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-pink-100">
                  <img 
                    src={item.image} 
                    alt={`Step ${item.step}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-pink-500">{item.step}.</span> 
                    {item.title}
                    {item.link && <a href="#" className="text-blue-500 hover:underline">{item.link}</a>}
                  </h3>
                  {item.subtitle && (
                    <p className="text-slate-600 mt-1">{item.subtitle}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="text-lg font-semibold text-slate-800">
              Lihat Video
              <p className="text-sm font-normal text-slate-600">(Buat Undangan Dengan Mudah)</p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/265756/pexels-photo-265756.jpeg" 
                alt="Tutorial Video" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="rounded-full w-20 h-20 flex items-center justify-center hover:bg-white hover:bg-opacity-30 transition-colors"
                >
                  <PlayCircle size={64} className="text-white" />
                </Button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-2">
                  CARA MEMBUAT
                  <span className="block text-pink-300">UNDANGAN</span>
                </h3>
                <p className="text-lg">mudah, murah dan cepat</p>
                
                <div className="mt-4 bg-pink-400 rounded-full py-2 px-6 inline-block">
                  <p className="text-sm font-semibold">no 1 platform pembuatan undangan website</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}