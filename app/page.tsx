"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import CountdownTimer from "@/components/countdown-timer";
import MusicPlayer from "@/components/MusicPlayer";
import { CalendarDays } from "lucide-react";



export default function InvitationPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    fetch(
      "https://ccgnimex.my.id/v2/android/admin/index.php?action=result&user=1&theme=1&category=2"
    )
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const { theme, content, decorations } = data;
  const {
    opening,
    quotes,
    invitation,
    children,
    parents,
    event,
    gallery,
    closing,
  } = content;
  const { defaultBgImage, defaultBgImage1 } = theme;
  const eventDate = new Date(event.iso);

  // Deteksi jenis event berdasar struktur parents
  const isWedding = !!parents.groom;
  
  // Generate Google Calendar URL
  const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(eventDate.getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, '');
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${startDate}/${endDate}&text=${encodeURIComponent(opening.title)}&details=${encodeURIComponent(invitation)}&location=${encodeURIComponent(event.location)}`;


  return (
    <main
      className="relative min-h-screen text-center overflow-hidden"
      style={{ color: theme.textColor }}
    >
      {isOpen && <MusicPlayer autoPlay />}

      {/* Cover Opening */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center p-6 z-40"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Decorations */}
            {[decorations.topLeft, decorations.topRight, decorations.bottomLeft, decorations.bottomRight].map(
              (src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt=""
                  className={`absolute ${["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"][i]} w-48 h-48`}
                  animate={{ x: i % 2 ? [30, 0, 30] : [-30, 0, -30], y: i < 2 ? [-30, 0, -30] : [30, 0, 30] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              )
            )}
            <motion.div
              className="text-center space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden">
                <Image
                  src={gallery.items[0]}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold">{opening.title}</h1>
              <div className="mt-2 space-y-1">
                {children.map((c: any, i: number) => (
                  <h2
                    key={i}
                    className="text-2xl md:text-4xl font-extrabold"
                    style={{ color: theme.accentColor }}
                  >
                    {c.nickname}
                  </h2>
                ))}
              </div>
              <p className="text-sm">
                Tanpa Mengurangi Rasa Hormat, Kami Mengundang
              </p>
              <div className="my-8 py-4 border-t border-b border-white/30">
                <h2 className="text-lg mb-2">{opening.toLabel}</h2>
                <p className="text-xl font-semibold">{opening.to}</p>
              </div>
              <Button
                onClick={() => setIsOpen(true)}
                className="text-white px-8 py-4 rounded-full font-medium shadow-lg"
                style={{
                  backgroundColor: theme.accentColor,  }}
              >
                Buka Undangan
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {isOpen && (
        <div className="container max-w-md mx-auto pb-24">
          {/* Home Section */}
          <section
            id="home"
            className="py-12 px-6 space-y-8"
            style={{
              backgroundImage: `url(${defaultBgImage1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden">
                <Image
                  src={gallery.items[0]}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  {quotes.arabic}
                </h2>
                <p className="text-sm text-gray-600">{quotes.latin}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Peristiwa Penting</h2>
                <p
  className="text-sm leading-relaxed"
  dangerouslySetInnerHTML={{
    __html: quotes.importantEvent.replace(/\n/g, '<br />'),
  }}
/>
              </div>
              <div
                className="w-16 h-1 mx-auto"
                style={{ backgroundColor: theme.accentColor }}
              />
              <div
                className="space-y-4 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: invitation }}
              />
{/* Children + Parent Info Section */}
<div className="py-6 px-6 border-2 rounded-lg bg-white/50">
                {children.map((c: any, i: number) => {
                  const photoSrc = c.profile1 || c.profile2;
                  return (
                    <div key={i} className="mb-6 text-center">
                      {photoSrc && (
                        <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden mb-4">
                          <Image
                            src={photoSrc}
                            alt={`${c.name} Profile`}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3
                        className="text-2xl font-bold"
                        style={{ color: theme.accentColor }}
                      >
                        {c.name}
                      </h3>
                      <p className="text-sm">({c.nickname})</p>
                      <p className="text-sm mb-2">{c.order}</p>

                      {isWedding && c.order === "Pengantin Pria" && (
                        <p className="text-sm">
                          Putra dari {parents.groom.father} &amp; {parents.groom.mother}
                        </p>
                      )}
                      {isWedding && c.order === "Pengantin Wanita" && (
                        <p className="text-sm">
                          Putri dari {parents.bride.father} &amp; {parents.bride.mother}
                        </p>
                      )}
                      {!isWedding && (
                        <p className="text-sm">
                          Putra dari {parents.father} &amp; {parents.mother}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-12 md:mt-16">
  <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white/95 rounded-xl shadow-soft backdrop-blur-sm">
    <div className="text-center mb-8">
      <div className="inline-flex items-center space-x-3 text-rose-500 mb-4">
        <span className="text-2xl">🌸</span>
        <h3 className="text-2xl font-serif text-gray-700 italic">
          Menuju Hari Bahagia
        </h3>
        <span className="text-2xl">🌸</span>
      </div>
      
     <div
  className="my-6"
  style={{ color: theme.accentColor }}
>
  <CountdownTimer 
    targetDate={eventDate}
    className="flex justify-center space-x-4 md:space-x-6"
    // hilangkan semua kelas warna di sini
    numberStyle="text-3xl md:text-4xl font-bold"
    labelStyle="text-sm md:text-base mt-2 text-inherit"
  />
</div>


      {/* Calendar Button */}
      <Link 
        href={calendarUrl} 
        target="_blank"
        className="inline-block transform transition-all hover:scale-[1.02]"
      >
        <Button 
            className="text-white px-8 py-4 rounded-full font-medium shadow-lg"
            style={{
              backgroundColor: theme.accentColor,  }}
          >
          <CalendarDays className="mr-2 h-5 w-5" />
          Simpan di Kalender
        </Button>
      </Link>
    </div>
  </div>
</div>
            </motion.div>
          </section>

          {/* Event Section */}
<section
  id="event"
  className="relative py-12 px-4 sm:px-6 lg:py-24 lg:px-8 text-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,245,240,0.97)), url(${defaultBgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="max-w-2xl mx-auto">
    {/* Wedding Title */}
    <div className="mb-12">
      <h2 className="text-4xl md:text-5xl font-cursive mb-4"  style={{ color: theme.accentColor }}>
        {content.event.title}
      </h2>
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="w-8 h-px bg-rose-300"></div>
        <span className="text-gray-600 text-sm">&#10084; 20 . 09 . 2025 &#10084;</span>
        <div className="w-8 h-px bg-rose-300"></div>
      </div>
    </div>

    <div className="space-y-8 md:space-y-12">
      {/* Date & Time Card */}
      <div className="relative p-6 md:p-8 bg-white rounded-lg shadow-soft transition-all duration-300 hover:shadow-medium">
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <CalendarDays className="w-10 h-10 bg-white p-2 rounded-full shadow-icon" style={{ color: theme.accentColor }} />
        </div>
        <div className="pt-6 space-y-3">
          <h3 className="text-xl font-serif text-gray-700">Waktu & Tanggal</h3>
          <div className="text-2xl font-bold" style={{ color: theme.accentColor }}>
            {content.event.date}
          </div>
          <div className="text-lg text-gray-600">
            Pukul {content.event.time} 
            <span className="text-sm ml-2"  style={{ color: theme.accentColor }}>{content.event.note}</span>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="relative p-6 md:p-8 bg-white rounded-lg shadow-soft transition-all duration-300 hover:shadow-medium">
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <MapPin className="w-10 h-10 bg-white p-2 rounded-full shadow-icon" style={{ color: theme.accentColor }} />
        </div>
        <div className="pt-6 space-y-4">
          <h3 className="text-xl font-serif text-gray-700">Lokasi Acara</h3>
          <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
            {content.event.location}
          </p>
          <div className="pt-4">
            <Link 
              href={content.event.mapsLink} 
              target="_blank"
              className="inline-block transform transition-all hover:scale-105"
            >
             <Button
  className="text-white px-8 py-4 rounded-full font-medium shadow-lg"
  style={{
    backgroundColor: theme.accentColor,  }}
>
                <MapPin className="mr-2 h-5 w-5" />
                Petunjuk Lokasi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Floral Decoration */}
    <div className="hidden md:block absolute -bottom-20 left-0 right-0 opacity-20">
      <svg className="mx-auto h-48 w-48" viewBox="0 0 100 100">
        <path fill="currentColor" d="M50 0 Q60 20 70 0 Q80 20 90 0 Q95 30 100 50 Q80 60 70 50 Q60 60 50 50 Q40 60 30 50 Q20 60 0 50 Q5 30 10 0 Q20 20 30 0 Q40 20 50 0" class="" style={{ color: theme.accentColor }}/>
      </svg>
    </div>
  </div>
</section>

          {/* Gallery Section */}
          <section
            id="gallery"
            className="py-12 px-6 text-center"
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-2xl font-bold mb-6">Galeri</h2>
            {gallery.items.map((img: string, idx: number) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow-md overflow-hidden mb-6"
              >
                <div className="relative aspect-square">
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover rounded-lg" />
                </div>
              </div>
            ))}
          </section>

          {/* Closing Section */}
          <section
            id="penutup"
            className="py-12 px-6 text-center"
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-2xl font-bold mb-6">{closing.title}</h2>
            <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: closing.text }} />
          </section>

          {/* Footer */}
          <footer className="text-center py-8 text-sm" style={{ color: theme.textColor }}>
            <p>© ginvite.id – By PT DIGITAL INTER NUSA</p>
          </footer>
        </div>
      )}

      {isOpen && (
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      )}
    </main>
  );
}
