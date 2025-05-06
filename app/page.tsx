"use client";

import { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ThemesSection from "@/components/sections/ThemesSection";
import InstructionsSection from "@/components/sections/InstructionsSection";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <ThemesSection 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <InstructionsSection />
      <Toaster />
    </main>
  );
}