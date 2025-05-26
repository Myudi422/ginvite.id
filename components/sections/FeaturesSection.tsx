"use client";

import { motion } from "framer-motion";
import { Heart, BookUser, Users, Sparkles } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="px-6 py-6 bg-pink-10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-pink-500 uppercase tracking-wider mb-2">
            No #1 Platform
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-4">
            Undangan Digital
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Kostumisasi - Simple - All in One
          </p>
          <p className="text-xl font-medium text-slate-700 mt-2">
            Solusi lengkap untuk undangan Anda!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {[
            {
              icon: <Heart className="h-10 w-10 text-pink-500" />,
              title: "Undangan Elegan",
              description: "Undangan digital dengan desain premium dan elegan"
            },
            {
              icon: <BookUser className="h-10 w-10 text-blue-500" />,
              title: "Digital Guestbook",
              description: "Buku tamu digital untuk mencatat kehadiran tamu"
            },
            {
              icon: <Users className="h-10 w-10 text-amber-500" />,
              title: "Rundown Planner",
              description: "Kelola dan atur seluruh jadwal acara dengan mudah"
            },
            {
              icon: <Sparkles className="h-10 w-10 text-violet-500" />,
              title: "Custom Design",
              description: "Kostumisasi desain sesuai dengan tema impian Anda"
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
              <div className="bg-pink-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
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
            "Solusi undanganmu jadi lebih modern, efisien dan terukur"
          </p>
        </motion.div>
      </div>
    </section>
  );
}