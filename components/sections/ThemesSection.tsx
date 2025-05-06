"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";

// Category data
const categories = [
  { id: "all", name: "Semua" },
  { id: "wedding", name: "Pernikahan" },
  { id: "birthday", name: "Ulang Tahun" },
  { id: "aqiqah", name: "Aqiqah" },
  { id: "khitan", name: "Khitanan" },
  { id: "graduation", name: "Wisuda" },
  { id: "seminar", name: "Seminar" },
];

// Theme data
const themes = [
  {
    id: 1,
    name: "Bee-Classic",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/7180617/pexels-photo-7180617.jpeg",
    category: "wedding",
  },
  {
    id: 2,
    name: "Baby-Sweet",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/6341529/pexels-photo-6341529.jpeg",
    category: "aqiqah",
  },
  {
    id: 3,
    name: "Honey-Night",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg",
    category: "wedding",
  },
  {
    id: 4,
    name: "Elegan-Black",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/3469402/pexels-photo-3469402.jpeg",
    category: "seminar",
  },
  {
    id: 5,
    name: "Blissful-Day",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg",
    category: "wedding",
  },
  {
    id: 6,
    name: "Celebration",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/6341528/pexels-photo-6341528.jpeg",
    category: "birthday",
  },
  {
    id: 7,
    name: "Academy",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/6177640/pexels-photo-6177640.jpeg",
    category: "graduation",
  },
  {
    id: 8,
    name: "Little-Prince",
    price: "Rp.39.000",
    image: "https://images.pexels.com/photos/7180752/pexels-photo-7180752.jpeg",
    category: "khitan",
  },
];

interface ThemesSectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function ThemesSection({ 
  selectedCategory, 
  setSelectedCategory 
}: ThemesSectionProps) {
  const filteredThemes = selectedCategory === "all" 
    ? themes 
    : themes.filter(theme => theme.category === selectedCategory);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-6">
            Pilih Template Undangan
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Temukan template undangan yang sesuai dengan kebutuhan dan tema acara Anda
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Tabs 
            defaultValue="all" 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full justify-center"
          >
            <TabsList className="bg-slate-100 p-1 overflow-x-auto flex flex-nowrap max-w-full justify-start md:justify-center">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-pink-600 whitespace-nowrap"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {filteredThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden group">
                <div className="relative overflow-hidden h-80">
                  <img 
                    src={theme.image} 
                    alt={theme.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="mr-2">
                      <Eye size={16} className="mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                      <Download size={16} className="mr-1" />
                      Gunakan
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg text-slate-800">{theme.name}</h3>
                    <p className="text-pink-600 font-semibold">{theme.price}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-lg text-lg">
            Lihat Semua Template
          </Button>
        </motion.div>
      </div>
    </section>
  );
}