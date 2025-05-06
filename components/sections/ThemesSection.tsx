"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import Image from 'next/image';

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
  { id: 1, name: "Bee-Classic", price: "Rp.39.000", image: "https://i.pinimg.com/736x/5a/ff/2c/5aff2c0f8e41dcc3a2b5c98700fe8b72.jpg", category: "wedding" },
  { id: 2, name: "Baby-Sweet", price: "Rp.39.000", image: "https://i.pinimg.com/736x/92/67/da/9267da618d0a2f2965a43e2125898c2a.jpg", category: "aqiqah" },
  { id: 3, name: "Honey-Night", price: "Rp.39.000", image: "https://i.pinimg.com/736x/f1/1a/84/f11a843c1c2efc8dca8d587ae3a4245f.jpg", category: "wedding" },
  { id: 4, name: "Elegan-Black", price: "Rp.39.000", image: "https://i.pinimg.com/736x/d8/c7/ba/d8c7ba234e63270d007bd48f1d52d3e0.jpg", category: "seminar" },
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-6">
            Pilih Template Undangan
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Temukan template undangan yang sesuai dengan kebutuhan dan tema acara Anda
          </p>
        </div>

        <div className="mb-10">
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {filteredThemes.map((theme) => (
            <div key={theme.id} className="group">
              <Card className="overflow-hidden">
                <div className="relative overflow-hidden h-60 md:h-80">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <Eye size={16} className="mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                    <h3 className="font-medium text-lg text-slate-800 mb-2 sm:mb-0">{theme.name}</h3>
                    <p className="text-pink-600 font-semibold">{theme.price}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-6 rounded-lg text-lg">
            Lihat Semua Template
          </Button>
        </div>
      </div>
    </section>
  );
}