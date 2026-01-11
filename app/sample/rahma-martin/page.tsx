"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// Menggunakan komponen tema 1 yang sudah ada
import OpeningSection from "@/components/theme/1/OpeningSection";
import ProfileSection from "@/components/theme/1/ProfileSection";
import QuoteSection from "@/components/theme/1/QuoteSection";
import CountdownSection from "@/components/theme/1/CountdownSection";
import EventSection from "@/components/theme/1/EventSection";
import GallerySection from "@/components/theme/1/GallerySection";
import ClosingSection from "@/components/theme/1/ClosingSection";
import FooterSection from "@/components/theme/1/FooterSection";
import dynamic from 'next/dynamic';

// Music Player yang proper
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), { 
  ssr: false, 
  loading: () => null 
});

// Simple Audio Player untuk fallback
function SimpleAudioPlayer({ src, autoPlay = false }: { src: string; autoPlay?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio(src);
      audioElement.loop = true;
      audioElement.volume = 0.3;
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [src]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audio && autoPlay) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [audio, autoPlay]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={togglePlay}
        className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#d4a574', color: '#fff' }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </Button>
    </div>
  );
}

function SampleTheme1Component({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(true);

  const { theme, content, event: apiEvents } = data;
  const { children, gallery, quotes, our_story, quote_enabled, gallery_enabled } = content;

  // Transform children data untuk komponen tema 1
  const transformedChildren = children?.map((child: any) => ({
    name: child.name,
    nickname: child.nama // nama pendek/panggilan
  })) || [];

  // Event list transformation
  const eventsList = Object.entries(apiEvents ?? {}).map(([key, ev]: [string, any]) => ({
    key: key,
    title: ev?.title || key.charAt(0).toUpperCase() + key.slice(1),
    date: ev?.date || '',
    time: ev?.time || '',
    location: ev?.location || '',
    mapsLink: ev?.mapsLink || '',
  })).filter(Boolean);

  const sortedEvents = [...eventsList].sort((a, b) => {
    try {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    } catch {
      return 0;
    }
  });

  // Transform eventsList untuk CountdownSection
  const firstEvent = sortedEvents[0];
  const eventDate = firstEvent ? new Date(`${firstEvent.date}T${firstEvent.time}:00`) : new Date();
  
  // Generate calendar URL untuk event pertama
  const generateCalendarUrl = (event: any) => {
    if (!event) return '#';
    const startDate = new Date(`${event.date}T${event.time}:00`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title || 'Wedding Event',
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      location: event.location || '',
      details: `Undangan pernikahan ${transformedChildren[0]?.name} & ${transformedChildren[1]?.name}`,
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };
  
  const calendarUrl = generateCalendarUrl(firstEvent);

  // Debug log untuk memastikan data tersedia
  console.log('Children data:', transformedChildren);
  console.log('Theme:', theme);
  console.log('isOpen state:', isOpen);

  // Mock handlers
  const handlePayment = () => {
    alert("Sample mode - payment tidak tersedia");
  };

  const handleToggleQr = () => {
    setShowQr(!showQr);
  };

  const handleOpenInvitation = () => {
    console.log('Opening invitation...');
    setIsOpen(true);
  };

  // Sample music URL
  const musicUrl = "https://drive.google.com/uc?export=download&id=1mHkzKKlImGzGJMqxTtJE2JQAg4CJ4Ug0"; // Sample wedding music

  return (
    <main className={`relative min-h-screen text-center overflow-hidden flex md:flex-row ${data.status === "tidak" ? "pt-16 sm:pt-12" : ""}`} style={{ color: theme.textColor }}>
      {/* Background Music Player - Auto Play setelah user interaction */}
      {content.music?.enabled && isOpen && (
        <SimpleAudioPlayer 
          src={content.music.url || musicUrl}
          autoPlay={true}
        />
      )}

      {/* Mock QR Modal */}
      {showQr && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">QR Code Sample</h3>
            <div className="bg-gray-200 w-48 h-48 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500">Sample QR</span>
            </div>
            <Button onClick={() => setShowQr(false)} className="w-full">Tutup</Button>
          </div>
        </div>
      )}

      {/* Main Content menggunakan komponen tema 1 */}
      <div className="w-full">
        {/* Opening Section - hanya tampil jika undangan belum dibuka */}
        {!isOpen && (
          <OpeningSection 
            opening={content.opening}
            theme={theme}
            childrenData={transformedChildren}
            gallery={gallery}
            decorations={data.decorations}
            isWedding={true}
            onOpen={handleOpenInvitation}
            onShowQr={handleToggleQr}
            specialFontFamily="'Playfair Display', serif"
            BodyFontFamily="'Inter', sans-serif"
            HeadingFontFamily="'Playfair Display', serif"
          />
        )}

        {/* Konten utama hanya tampil jika undangan dibuka */}
        {isOpen && (
          <>
            {/* Profile Section */}
            <ProfileSection 
              theme={theme}
              childrenData={transformedChildren}
              gallery={gallery}
              defaultBgImage1={theme.defaultBgImage1}
              opening={content.opening}
              waktu_acara={sortedEvents[0]?.date || "2026-01-16"}
              isWedding={true}
            />

            {/* Quote Section */}
            {quote_enabled && quotes?.enabled && (
              <QuoteSection 
                theme={theme}
                quote={quotes.text || content.quote}
                source={quotes.source}
              />
            )}

            {/* Countdown Section */}
            <CountdownSection 
              eventDate={eventDate}
              calendarUrl={calendarUrl}
              theme={theme}
            />

            {/* Event Section */}
            <EventSection 
              events={sortedEvents}
              sectionTitle="Acara Pernikahan"
              theme={theme}
              specialFontFamily="'Playfair Display', serif"
            />

            {/* Gallery Section */}
            {gallery_enabled && gallery?.items?.length > 0 && (
              <GallerySection 
                gallery={gallery}
                theme={theme}
              />
            )}

            {/* Bank Section - Simple Implementation */}
            {content.bank_accounts && content.bank_accounts.length > 0 && (
              <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: "'Playfair Display', serif", color: theme.accentColor }}>
                    Amplop Digital
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {content.bank_accounts.map((account: any, index: number) => (
                      <div key={index} className="p-8 bg-white rounded-lg shadow-lg text-center">
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme.accentColor }}>
                          {account.bank_name}
                        </h3>
                        <p className="text-lg font-mono mb-2" style={{ color: "#4a281e" }}>{account.account_number}</p>
                        <p className="font-semibold mb-6" style={{ color: "#4a281e" }}>{account.account_name}</p>
                        <Button 
                          onClick={() => {
                            navigator.clipboard.writeText(account.account_number);
                            alert("Nomor rekening berhasil disalin!");
                          }}
                          className="w-full"
                          style={{ 
                            backgroundColor: theme.accentColor, 
                            color: "#ffffff",
                            border: 'none'
                          }}
                        >
                          Salin Nomor
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Closing Section */}
            <ClosingSection 
              gallery={gallery}
              childrenData={transformedChildren}
              specialFontFamily="'Playfair Display', serif"
              BodyFontFamily="'Inter', sans-serif"
              HeadingFontFamily="'Playfair Display', serif"
              defaultBgImage1={theme.defaultBgImage1}
              category_type={{ id: 1, name: "pernikahan" }}
            />

            {/* Footer Section */}
            <FooterSection 
              textColor={theme.textColor}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default function SampleInvitationPage() {
  // Data statis yang kompatibel dengan tema 1
  const staticData = {
    theme: {
      textColor: "#ffffff",
      bgColor: "#fef7ed",
      accentColor: "#d4a574",
      background: "linear-gradient(135deg, #fef7ed 0%, #f3e8d8 100%)",
      defaultBgImage1: "/211/IMG_2506_263.jpg",
    },
    decorations: {
      enabled: true,
      topLeft: "",
      topRight: "",
      bottomLeft: "",
      bottomRight: "",
    },
    content_user_id: 999,
    status: "ya", // Status aktif untuk menghindari warning banner
    event: {
      akad: {
        title: "AKAD NIKAH",
        date: "2026-01-16",
        time: "09:00",
        location: "Rumah Mempelai Wanita",
        mapsLink: "https://maps.app.goo.gl/i1jQCniwymKSBRwU9?g_st=aw",
      },
      resepsi: {
        title: "RESEPSI PERNIKAHAN",
        date: "2026-01-18",
        time: "11:00",
        location: "Rumah Mempelai Wanita",
        mapsLink: "https://maps.app.goo.gl/i1jQCniwymKSBRwU9?g_st=aw",
      },
    },
    content: {
      themeCategory: "1",
      opening: {
        enabled: true,
        title: "The Wedding of",
        subtitle: "RAHMA & MARTIN",
        toLabel: "Kepada Yth",
        to: "Bapak/Ibu/Saudara/i",
        wedding_text: "RAHMA & MARTIN",
      },
      music: {
        url: "https://www.bensound.com/bensound-music/bensound-memories.mp3",
        enabled: true,
      },
      plugin: {
        youtube_link: "",
      },
      font: {
        heading: "font-family: 'Playfair Display', serif;",
        body: "font-family: 'Inter', sans-serif;",
      },
      quotes: {
        enabled: true,
        text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.",
        source: "QS. Ar-Rum: 21",
      },
      quote_enabled: true,
      gallery_enabled: true,
      turut: {
        enabled: false,
        list: [],
      },
      closing: {
        enabled: true,
        text: "Terima kasih atas doa dan kehadiran Anda dalam hari bahagia kami.",
      },
      children: [
        {
          name: "RAHMA & MARTIN",
          nama: "RAHMA & MARTIN",
          ayah: "Rahman",
          ibu: "Sopi",
          gender: "wanita",
          profile: "/211/IMG_2504_263.jpg",
          child_type: "putri pertama",
        },
        {
          name: "MARTIN",
          nama: "MARTIN", 
          ayah: "Inan",
          ibu: "Tini",
          gender: "pria",
          profile: "/211/IMG_2504_264.jpg",
          child_type: "putra bungsu",
        },
      ],
      parents: [
        {
          father: "Rahman",
          mother: "Sopi", 
          child_name: "SITI RAHMAWATI AULIAH",
        },
        {
          father: "Inan",
          mother: "Tini",
          child_name: "MARTIN",
        },
      ],
      invitation: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i dalam acara pernikahan kami.",
      title: "The Wedding of RAHMA & MARTIN",
      our_story: [
        {
          title: "Pertemuan Pertama",
          date: "2023-05-15",
          description: "Pertemuan yang tidak terduga menjadi awal dari kisah cinta kami.",
        },
        {
          title: "Tunangan",
          date: "2025-08-20", 
          description: "Hari yang indah saat kami memutuskan untuk mengikat janji suci.",
        },
      ],
      gallery: {
        items: [
          "/211/IMG_2506_263.jpg",
          "/211/IMG_2507_263.jpg",
          "/211/IMG_2507_264.jpg",
        ],
      },
      quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.",
      bank_accounts: [
        {
          bank_name: "DANA",
          account_number: "085813603655",
          account_name: "SITI RAHMAWATI AULIAH",
        },
        {
          bank_name: "DANA", 
          account_number: "+62 896-7397-0754",
          account_name: "MARTIN",
        },
      ],
    },
    category_type: {
      name: "pernikahan",
    },
    user: {
      first_name: "RAHMA & MARTIN",
      pictures_url: "/211/IMG_2504_263.jpg",
    },
    _displayName: "RAHMA & MARTIN",
  };

  return <SampleTheme1Component data={staticData} />;
}