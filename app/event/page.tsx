"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  Sparkles,
  Utensils,
  Flower2,
  Camera,
  Video,
  Smile,
  Home,
  Mic,
  Music,
  Gift,
  Shirt,
  Mail,
  ShieldCheck,
  PackageCheck,
  CheckCircle,
  HelpCircle,
  Phone,
  Instagram,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Calendar,
  Layers,
  Sparkle
} from "lucide-react";
import { partnersData } from "@/lib/partner-data";
import { Button } from "@/components/ui/button";

// Service categories grouping
const serviceCategories = [
  {
    id: "perencanaan",
    label: "Perencanaan & Acara",
    services: [
      { name: "Wedding Organizer", icon: Sparkles, desc: "Koordinasi lengkap acara dari awal hingga hari H." },
      { name: "Venue", icon: Home, desc: "Gedung, hotel, villa, atau area outdoor pilihan terbaik." },
      { name: "MC", icon: Mic, desc: "Pemandu acara berpengalaman yang menghidupkan suasana." },
      { name: "Undangan Digital", icon: Mail, desc: "Undangan digital premium terintegrasi ekosistem Papunda." }
    ]
  },
  {
    id: "dekorasi",
    label: "Dekorasi & Konsumsi",
    services: [
      { name: "Dekorasi", icon: Flower2, desc: "Konsep pelaminan dan ruangan yang elegan & personal." },
      { name: "Catering", icon: Utensils, desc: "Pilihan menu lezat, higienis, dan cita rasa bintang lima." }
    ]
  },
  {
    id: "dokumentasi",
    label: "Dokumentasi & Media",
    services: [
      { name: "Photography", icon: Camera, desc: "Dokumentasi foto premium menangkap setiap momen berharga." },
      { name: "Videography", icon: Video, desc: "Video cinematic beresolusi tinggi dengan alur cerita indah." },
      { name: "Entertainment", icon: Music, desc: "Live music acoustic atau full band pengiring pesta." }
    ]
  },
  {
    id: "busana",
    label: "Rias, Busana & Cendera",
    services: [
      { name: "Makeup Artist", icon: Smile, desc: "Riasan wajah flawless dan tahan lama dari MUA profesional." },
      { name: "Souvenir", icon: Gift, desc: "Cendera mata unik dan berkualitas untuk para tamu." },
      { name: "Bridal", icon: Shirt, desc: "Gaun pengantin dan jas elegan rancangan desainer." }
    ]
  }
];

// Why choose us cards
const valueProps = [
  {
    title: "Layanan Terpercaya",
    desc: "Layanan terstandarisasi secara ketat di setiap kota demi kualitas konsisten yang dapat diandalkan.",
    icon: ShieldCheck
  },
  {
    title: "Layanan Lengkap",
    desc: "Semua kebutuhan wedding tersedia dalam satu layanan terpadu tanpa perlu mencari vendor secara terpisah.",
    icon: PackageCheck
  },
  {
    title: "Layanan Transparan",
    desc: "Pilihan paket dengan informasi rincian terperinci tanpa adanya biaya tambahan siluman.",
    icon: CheckCircle
  },
  {
    title: "Konsultasi Gratis",
    desc: "Diskusikan semua konsep dan kebutuhan pernikahan impian Anda bersama tim ahli sebelum menentukan pilihan.",
    icon: Smile
  },
  {
    title: "Didampingi Hingga Hari H",
    desc: "Tim kami siap mendampingi Anda di setiap langkah perencanaan hingga pelaksanaan acara selesai.",
    icon: Sparkles
  },
  {
    title: "Terintegrasi dengan Papunda",
    desc: "Undangan digital, RSVP online, buku tamu digital, hingga dashboard wedding planner terhubung penuh.",
    icon: Mail
  }
];

// Portfolios in Asymmetrical Layout sizes
const portfolios = [
  { title: "Elegant Grand Ballroom", category: "Wedding Indoor", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop", layout: "md:col-span-2 md:row-span-1" },
  { title: "Pine Forest Ceremony", category: "Wedding Outdoor", img: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop", layout: "md:col-span-1 md:row-span-2" },
  { title: "Sunset Beach Altar", category: "Garden Party", img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop", layout: "md:col-span-1 md:row-span-1" },
  { title: "Sundanese Ceremony", category: "Traditional Wedding", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop", layout: "md:col-span-1 md:row-span-1" },
  { title: "Bohemian Backyard Party", category: "Modern Wedding", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop", layout: "md:col-span-2 md:row-span-1" }
];

const testimonials = [
  {
    name: "Rian & Dita",
    city: "Bogor",
    comment: "Sangat puas dengan tim Papunda Bogor! Semua terorganisir rapi dan dekorasi pelaminan persis seperti keinginan kami.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "Fadel & Sarah",
    city: "Bandung",
    comment: "Dekorasi Lembang Garden Party kami sangat indah dan aesthetic. Komunikasi dengan tim Papunda Bandung sangat gampang.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    name: "Andito & Clarissa",
    city: "Jakarta",
    comment: "Pernikahan di ballroom SCBD berjalan mulus tanpa hambatan. Katering premiumnya dipuji semua tamu undangan.",
    rating: 5,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  }
];

const faqs = [
  {
    q: "Apakah bisa hanya menggunakan salah satu layanan saja (misalnya catering saja)?",
    a: "Tentu saja! Meskipun kami menawarkan paket all-in-one yang lengkap dan ekonomis, Anda tetap bisa memilih layanan satuan (custom) sesuai dengan kebutuhan acara Anda."
  },
  {
    q: "Apakah bisa request konsep adat tertentu?",
    a: "Sangat bisa. Layanan Event Papunda di setiap kota telah berpengalaman menangani berbagai jenis pernikahan adat daerah (Sunda, Jawa, Batak, Bugis, dll.) serta konsep modern internasional."
  },
  {
    q: "Apakah bisa mengadakan pernikahan di luar kota layanan?",
    a: "Layanan kami dapat mencakup area sekitar kota domisili. Untuk lokasi yang lebih jauh, silakan hubungi kami terlebih dahulu untuk dikoordinasikan dengan tim kota terdekat."
  },
  {
    q: "Bagaimana proses konsultasi awal?",
    a: "Sangat mudah! Pilih kota Anda di halaman ini, lalu klik tombol konsultasi WhatsApp. Anda akan langsung terhubung dengan tim Planner resmi untuk mendiskusikan tanggal, venue, konsep, dan anggaran secara gratis."
  },
  {
    q: "Apakah tersedia paket custom?",
    a: "Ya. Setiap paket yang kami sediakan bersifat fleksibel. Anda dapat memilih layanan secara custom (seperti hanya katering + dekorasi, atau WO + dokumentasi) dan menyusunnya sendiri secara transparan."
  }
];

// Cities grouped by region
const regionGroups = [
  {
    id: "jabodetabek",
    label: "Jabodetabek & Jabar",
    cities: [
      { id: "bogor", name: "Bogor" },
      { id: "jakarta", name: "Jakarta" },
      { id: "bekasi", name: "Bekasi" },
      { id: "depok", name: "Depok" },
      { id: "bandung", name: "Bandung" }
    ]
  },
  {
    id: "jateng-diy",
    label: "Jawa Tengah & DIY",
    cities: [
      { id: "yogyakarta", name: "Yogyakarta" },
      { id: "semarang", name: "Semarang" }
    ]
  },
  {
    id: "jatim",
    label: "Jawa Timur",
    cities: [
      { id: "surabaya", name: "Surabaya" },
      { id: "malang", name: "Malang" }
    ]
  },
  {
    id: "luar-jawa",
    label: "Bali & Luar Jawa",
    cities: [
      { id: "medan", name: "Medan" },
      { id: "makassar", name: "Makassar" },
      { id: "bali", name: "Bali" }
    ]
  }
];

const allCitiesList = [
  { id: "bogor", name: "Bogor" },
  { id: "bandung", name: "Bandung" },
  { id: "jakarta", name: "Jakarta" },
  { id: "bekasi", name: "Bekasi" },
  { id: "depok", name: "Depok" },
  { id: "yogyakarta", name: "Yogyakarta" },
  { id: "semarang", name: "Semarang" },
  { id: "surabaya", name: "Surabaya" },
  { id: "malang", name: "Malang" },
  { id: "medan", name: "Medan" },
  { id: "makassar", name: "Makassar" },
  { id: "bali", name: "Bali" }
];

export default function EventHomepage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTesti, setCurrentTesti] = useState(0);
  
  // Interactive section states
  const [activeServiceTab, setActiveServiceTab] = useState("perencanaan");
  const [activeRegionTab, setActiveRegionTab] = useState("jabodetabek");

  const handleSearch = () => {
    if (selectedCity) {
      router.push(`/event/${selectedCity}`);
    }
  };

  const nextTestimonial = () => {
    setCurrentTesti((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTesti((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-white to-rose-50/40 text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      {/* ─── HEADER (Glassmorphic) ─── */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-pink-100/40 shadow-sm shadow-pink-100/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="relative h-8 w-24 sm:h-10 sm:w-32 transition-opacity hover:opacity-90">
            <Image src="/logo.svg" alt="Papunda Logo" fill className="object-contain" priority />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#tentang" className="text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors">Tentang</a>
            <a href="#cara-kerja" className="text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors">Cara Kerja</a>
            <a href="#layanan" className="text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors">Layanan</a>
            <a href="#kota" className="text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors">Kota</a>
            <a href="#portofolio" className="text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors">Portofolio</a>
          </nav>
          <div>
            <Button
              onClick={() => window.open("https://wa.me/6289654728249?text=Halo%20Event%20Papunda%2C%20saya%20ingin%20konsultasi%20mengenai%20wedding%20organizer", "_blank")}
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-full px-6 py-2.5 text-sm shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Konsultasi Gratis
            </Button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50/60 via-white to-rose-50/50">
        {/* Glow Blobs */}
        <div className="absolute top-12 right-[-5%] w-96 h-96 bg-gradient-to-br from-pink-200/50 to-rose-300/40 rounded-full blur-3xl opacity-70 z-0 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-gradient-to-tr from-rose-100/50 via-pink-100/40 to-transparent rounded-full blur-3xl opacity-80 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/60 text-pink-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm shadow-pink-100/30">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '3s' }} />
                Layanan Resmi Event Papunda Indonesia
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
                Semua Kebutuhan <br className="hidden sm:inline" />
                Pernikahan dalam{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 bg-clip-text text-transparent">
                  Satu Tempat.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Temukan layanan pernikahan terpadu Event Papunda di kotamu. Mulai dari Wedding Organizer, Catering, Dekorasi, Dokumentasi, hingga Undangan Digital, semuanya dalam satu layanan terpercaya.
              </p>
            </motion.div>

            {/* City Selector Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border border-pink-200/60 shadow-2xl shadow-pink-200/40 max-w-lg flex flex-col sm:flex-row gap-3 items-stretch sm:items-center hover:border-pink-300 transition-all"
            >
              <div className="flex-1 flex items-center gap-3 px-3">
                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-transparent text-slate-800 text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>Pilih Kota Acara Anda...</option>
                  {allCitiesList.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleSearch}
                disabled={!selectedCity}
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-pink-300 disabled:to-rose-300 text-white rounded-full px-8 py-4 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-100"
              >
                <Search className="w-4 h-4" />
                Cari Layanan
              </Button>
            </motion.div>

            {/* Micro Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-500 font-semibold"
            >
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-pink-100/50 px-3.5 py-1.5 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Layanan Terpadu
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-pink-100/50 px-3.5 py-1.5 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Tanpa Biaya Siluman
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-pink-100/50 px-3.5 py-1.5 rounded-full shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Free Konsultasi
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 relative w-full aspect-square sm:max-w-md lg:max-w-none mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl shadow-pink-200/50 border-[6px] border-white"
            >
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
                alt="Beautiful Wedding Couple"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent z-10" />
              <div className="absolute bottom-8 left-8 right-8 text-white z-20">
                <p className="text-xs font-bold tracking-wider uppercase text-pink-200">Layanan Unggulan</p>
                <p className="text-2xl font-bold font-serif mt-1">Event Papunda</p>
                <p className="text-xs text-slate-200 flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" /> Seluruh Kota Indonesia
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TENTANG SEKSI (Creative Dual Column Layout) ─── */}
      <section id="tentang" className="py-24 bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30 relative overflow-hidden">
        {/* Glow detail background */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Left: Digital Wedding Dashboard Mockup */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            {/* Inner glow circle behind card */}
            <div className="absolute w-72 h-72 bg-gradient-to-br from-pink-200/40 to-rose-200/30 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
            
            {/* Dashboard Container (frosted glass) */}
            <div className="relative bg-white/80 backdrop-blur-md border border-pink-100/60 p-6 sm:p-7 rounded-[2.5rem] shadow-2xl shadow-pink-200/30 max-w-sm w-full space-y-6 z-10 hover:shadow-pink-200/40 transition-shadow duration-300">
              
              {/* Header Widget */}
              <div className="flex items-center justify-between border-b border-pink-50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs">💖</div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Wedding Dashboard</p>
                    <p className="text-[10px] text-slate-400 font-medium">Budi & Maya Wedding</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Aktif</span>
              </div>

              {/* Progress Card (rose gradient) */}
              <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 p-5 rounded-3xl text-white shadow-lg shadow-pink-200/60">
                <p className="text-[10px] font-bold tracking-wider uppercase text-pink-200">Kesiapan Pernikahan</p>
                <div className="flex items-end gap-2.5 mt-1.5 mb-3">
                  <span className="text-4xl font-black leading-none">78%</span>
                  <span className="text-pink-100 text-xs mb-1">overall progress</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full bg-white w-[78%]" />
                </div>
              </div>

              {/* Checklist items mock */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50/40 p-2.5 rounded-xl border border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Konsep Dekorasi & Catering</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Selesai</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50/40 p-2.5 rounded-xl border border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Undangan Digital & RSVP</span>
                  </div>
                  <span className="text-[9px] font-bold text-pink-500 uppercase">Active</span>
                </div>
              </div>

              {/* Floating Widget 1 (top-right) */}
              <div className="absolute -right-6 -top-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg border border-pink-100/40 text-xs font-bold text-slate-800 flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="text-pink-500">📅</span>
                <span>H-30 Acara</span>
              </div>

              {/* Floating Widget 2 (bottom-left) */}
              <div className="absolute -left-8 -bottom-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg border border-pink-100/40 text-xs font-bold text-pink-600 flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="text-rose-500">✨</span>
                <span>Katering Ready</span>
              </div>

            </div>
          </div>

          {/* Pillars Content Right */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 bg-pink-150/40 border border-pink-200/50 text-pink-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                Konsep Terintegrasi
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Lebih dari Sekadar Wedding Organizer
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Event Papunda adalah jaringan layanan pernikahan terpadu yang didesain secara khusus untuk menyajikan kualitas resep berkelas tinggi dan kemudahan koordinasi berbasis teknologi.
              </p>
            </div>

            {/* Core Pillars List */}
            <div className="space-y-6">
              {[
                {
                  title: "Kurasi Layanan Ketat & Profesional",
                  desc: "Seluruh aspek dekorasi, katering, makeup artist, dan tim pelaksana dikelola langsung di setiap kota dengan standar mutu tinggi.",
                  icon: ShieldCheck,
                  iconColor: "from-pink-500 to-rose-500 text-white shadow-pink-100"
                },
                {
                  title: "Terhubung Penuh Ekosistem Digital",
                  desc: "Pesta Anda otomatis terhubung dengan rincian undangan online, data RSVP waktu nyata, buku tamu digital QR code, dan pelacak budget.",
                  icon: Mail,
                  iconColor: "from-rose-500 to-red-500 text-white shadow-red-100"
                },
                {
                  title: "Solusi Manajemen Satu Pintu",
                  desc: "Cukup satu kontak koordinator Event Papunda untuk memantau semua katering, dokumentasi, hiburan, dan WO di hari H.",
                  icon: Sparkles,
                  iconColor: "from-pink-600 to-rose-600 text-white shadow-pink-100"
                }
              ].map((pillar, pIdx) => {
                const Icon = pillar.icon;
                return (
                  <div key={pIdx} className="flex gap-4 items-start group hover:translate-x-1.5 transition-transform duration-300">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.iconColor} flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{pillar.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ─── CARA KERJA (Zigzag / Timeline Kreatif) ─── */}
      <section id="cara-kerja" className="py-24 bg-gradient-to-b from-pink-50/30 via-white to-rose-50/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Alur Perjalanan</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Bagaimana Event Papunda Bekerja
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Perjalanan romantis nan praktis menuju hari kebahagiaan Anda.
            </p>
          </div>

          {/* Zigzag Timeline */}
          <div className="relative space-y-16 before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-pink-100/70 before:hidden md:before:block">
            {[
              { step: "01", title: "Pilih Kota Anda", desc: "Temukan tim perencana lokal Event Papunda di wilayah tempat acara pernikahan Anda akan dilangsungkan.", img: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=500&auto=format&fit=crop" },
              { step: "02", title: "Pilih Paket atau Layanan Kustom", desc: "Pilih dari paket terstruktur kami atau kombinasikan layanan (katering, dekorasi, dokumentasi, dll.) sesuka Anda.", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=500&auto=format&fit=crop" },
              { step: "03", title: "Konsultasikan Secara Gratis", desc: "Tim perencana Event Papunda akan mengundang Anda berdiskusi secara langsung untuk menyesuaikan konsep, warna, dan anggaran.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500&auto=format&fit=crop" },
              { step: "04", title: "Nikmati Hari Bahagia", desc: "Semua persiapan dikelola terpusat dari perizinan hingga hari H, sehingga Anda bisa menikmati setiap momen sakral dengan tenang.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop" }
            ].map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative ${isEven ? "" : "md:flex-row-reverse"}`}>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-4 border-white shadow-md shadow-pink-100 hidden md:flex items-center justify-center z-10">
                    <Sparkle className="w-3 h-3 text-white fill-white" />
                  </div>

                  {/* Left Column (Content) */}
                  <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                    <div className="inline-block text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                      Step {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Right Column (Image Card) */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-[4/3] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl shadow-pink-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                      <Image src={item.img} alt={item.title} fill className="object-cover" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LAYANAN KAMI (Tabbed Categories - Creative Layout) ─── */}
      <section id="layanan" className="py-24 bg-gradient-to-b from-white via-pink-50/20 to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Katalog Jasa</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Satu Ekosistem Kebutuhan Pernikahan
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Semua layanan disediakan secara profesional oleh tim ahli Event Papunda. Pilih kategori di bawah ini.
            </p>
          </div>

          {/* Interactive Category Switcher (Pill Tabs) */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveServiceTab(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all ${
                  activeServiceTab === cat.id
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow-lg shadow-pink-150"
                    : "bg-white/80 backdrop-blur-sm border-pink-100/40 text-slate-600 hover:border-pink-300 hover:text-pink-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Animated Tab Content Grid */}
          <div className="min-h-[250px]">
            <AnimatePresence mode="wait">
              {serviceCategories.map((cat) => {
                if (cat.id !== activeServiceTab) return null;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {cat.services.map((srv, idx) => {
                      const Icon = srv.icon;
                      return (
                        <div key={idx} className="p-8 rounded-3xl border border-pink-100/30 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-pink-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100/50 flex items-center justify-center mb-6 border border-pink-100/40 shadow-inner">
                              <Icon className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.name}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{srv.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-pink-500 mt-6 block">Kualitas Terjamin</span>
                        </div>
                      );
                    })}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ─── KOTA TERSEDIA (Region Categorized Grid) ─── */}
      <section id="kota" className="py-24 bg-gradient-to-b from-rose-50/30 via-white to-pink-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Cabang Layanan</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Temukan Layanan Resmi di Kotamu
            </h2>
            <p className="text-slate-500">
              Kami melayani berbagai daerah utama di Indonesia dengan tim lokal berpengalaman.
            </p>
          </div>

          {/* Region Selector Switcher */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {regionGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveRegionTab(group.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all ${
                  activeRegionTab === group.id
                    ? "bg-slate-900 text-white border-transparent shadow-lg"
                    : "bg-white/80 backdrop-blur-sm border-pink-100/40 text-slate-600 hover:border-pink-300 hover:text-pink-600"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* Grid of regional cities */}
          <div className="min-h-[180px]">
            <AnimatePresence mode="wait">
              {regionGroups.map((group) => {
                if (group.id !== activeRegionTab) return null;
                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
                  >
                    {group.cities.map((ct) => {
                      const detail = partnersData[ct.id];
                      return (
                        <Link
                          key={ct.id}
                          href={`/event/${ct.id}`}
                          className="group bg-white/80 backdrop-blur-md border border-pink-100/40 hover:border-pink-300 hover:bg-white p-6 rounded-3xl shadow-md shadow-pink-100/5 text-center block transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                        >
                          <div className="w-10 h-10 bg-pink-50/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-pink-100/40">
                            <MapPin className="w-5 h-5 text-pink-500" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{ct.name}</h3>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {detail ? `${detail.rating} ★ (${detail.reviewsCount} Resepsi)` : "Terverifikasi"}
                          </p>
                          <span className="inline-block mt-4 text-xs font-bold text-pink-500">
                            Lihat Paket →
                          </span>
                        </Link>
                      );
                    })}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ─── PORTOFOLIO (Mosaic Asymmetrical Layout) ─── */}
      <section id="portofolio" className="py-24 bg-gradient-to-b from-pink-50/20 via-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Dokumentasi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Galeri Hasil Karya Kreatif Kami
            </h2>
            <p className="text-slate-500">
              Koleksi dokumentasi visual nyata dari hari bahagia pasangan Event Papunda.
            </p>
          </div>

          {/* Mosaic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] relative z-10">
            {portfolios.map((item, idx) => (
              <div key={idx} className={`relative rounded-[2.5rem] overflow-hidden shadow-lg border border-pink-100/40 group hover:shadow-2xl transition-all duration-500 ${item.layout}`}>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-950/70 via-black/10 to-transparent opacity-90 transition-opacity" />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-slate-800 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-sm">
                  {item.category}
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-gradient-to-b from-rose-50/30 via-white to-pink-50/40 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 bg-pink-100/50 px-3.5 py-1.5 rounded-full">Ulasan Pengantin</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Kisah Sukses Mereka</h2>
          </div>

          {/* Carousel */}
          <div className="relative bg-white/80 backdrop-blur-md border border-pink-100/60 rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-pink-100/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTesti}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-pink-200 shadow-md">
                  <Image
                    src={testimonials[currentTesti].img}
                    alt={testimonials[currentTesti].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex justify-center gap-1 text-amber-400">
                  {Array.from({ length: testimonials[currentTesti].rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-base sm:text-lg text-slate-600 italic leading-relaxed">
                  &ldquo;{testimonials[currentTesti].comment}&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonials[currentTesti].name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Cabang Kota {testimonials[currentTesti].city}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white border border-pink-100 shadow-md flex items-center justify-center text-slate-600 hover:text-pink-600 pointer-events-auto hover:shadow-lg transition-shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white border border-pink-100 shadow-md flex items-center justify-center text-slate-600 hover:text-pink-600 pointer-events-auto hover:shadow-lg transition-shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 bg-gradient-to-b from-rose-50/40 via-white to-pink-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <HelpCircle className="w-10 h-10 text-pink-500 mx-auto" />
            <h2 className="text-3xl font-extrabold text-slate-900">Pertanyaan Umum (FAQ)</h2>
            <p className="text-slate-500">Segala informasi dasar yang perlu Anda ketahui.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100/50 shadow-md shadow-pink-100/5 overflow-hidden transition-all duration-300 hover:border-pink-300">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? <Minus className="w-4 h-4 text-pink-500 flex-shrink-0" /> : <Plus className="w-4 h-4 text-pink-500 flex-shrink-0" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-pink-50/50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA PENUTUP ─── */}
      <section className="py-24 bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-2xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Siap Merencanakan Pernikahan Impian?
          </h2>
          <p className="text-lg text-pink-50 leading-relaxed max-w-xl mx-auto">
            Mulai konsultasi bersama tim Event Papunda di kotamu dan temukan solusi wedding yang sesuai dengan kebutuhanmu.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => window.open("https://wa.me/6289654728249?text=Halo%20Event%20Papunda%2C%20saya%20ingin%20konsultasi%20gratis%20mengenai%20pernikahan%20saya", "_blank")}
              className="bg-white hover:bg-pink-50 text-pink-600 font-bold rounded-full px-8 py-4 text-base shadow-2xl hover:shadow-pink-100 transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              Konsultasi Sekarang (Gratis)
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <div className="relative h-10 w-32 filter brightness-0 invert">
              <Image src="/logo.svg" alt="Papunda Logo" fill className="object-contain" />
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-slate-500">
              Jaringan resmi layanan pernikahan terpadu yang lengkap, hemat, dan terintegrasi digital sepenuhnya di bawah Papunda.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navigasi</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tentang" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Layanan</a></li>
              <li><a href="#kota" className="hover:text-white transition-colors">Kota Layanan</a></li>
              <li><a href="#portofolio" className="hover:text-white transition-colors">Portofolio</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Sosial Media</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/papunda.id" target="_blank" rel="noopener noreferrer" className="hover:text-white text-slate-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-slate-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Hubungi Kami</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              WhatsApp: <a href="https://wa.me/6289654728249" className="text-pink-500 hover:underline">+62 896-5472-8249</a><br />
              Email: papundacare@gmail.com
            </p>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-600">
          Copyright © 2026 PT Digital Inter Nusa. All Rights Reserved
        </div>
      </footer>

    </div>
  );
}
