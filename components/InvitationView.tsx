"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import CountdownTimer from "@/components/countdown-timer";
import MusicPlayer from "@/components/MusicPlayer";
import QRModal from "@/components/QRModal";
import '@/styles/font.css';
import { AnimatePresence, motion } from 'framer-motion';

// Section components
import OpeningSection from "@/components/theme/1/OpeningSection";
import ProfileSection from "@/components/theme/1/ProfileSection";
import QuoteSection from "@/components/theme/1/QuoteSection";
import ImportantEventSection from "@/components/theme/1/ImportantEventSection";
import InvitationTextSection from "@/components/theme/1/InvitationTextSection";
import FamilySection from "@/components/theme/1/FamilySection";
import CountdownSection from "@/components/theme/1/CountdownSection";
import EventSection from "@/components/theme/1/EventSection";
import OurStorySection from "@/components/theme/1/OurStorySection";
import GallerySection from "@/components/theme/1/GallerySection";
import ClosingSection from "@/components/theme/1/ClosingSection";
import FooterSection from "@/components/theme/1/FooterSection";
import WeddingLoading from "@/components/WeddingLoading"; // Pastikan import ini benar

export default function InvitationView({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true); // State untuk mengontrol loading

  const searchParams = useSearchParams();
  const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";

  useEffect(() => {
    // Simulasikan loading dengan timeout
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Ubah durasi sesuai kebutuhan

    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(loadingTimeout); // Bersihkan timeout jika komponen unmount sebelum selesai loading
    };
  }, [isOpen]);

  if (!data) {
    return <div className="flex items-center justify-center h-screen">Loading Data...</div>;
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
    our_story,
    closing,
  } = content;

  const eventDate = new Date(event.iso);
  const isWedding = !!parents.groom;

  // Prepare Google Calendar URL
  const start = eventDate.toISOString().replace(/-|:|\.\d+/g, "");
  const end = new Date(eventDate.getTime() + 3600000)
    .toISOString()
    .replace(/-|:|\.\d+/g, "");
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}&text=${encodeURIComponent(
    opening.title
  )}&details=${encodeURIComponent(invitation)}&location=${encodeURIComponent(
    event.location
  )}`;

  const sampleQrData = "SampleGuestID12345";

  // Proses specialFontFamily untuk menghilangkan titik koma jika ada
  const processedSpecialFontFamily = content?.font?.special?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';

  return (
    <main
      className="relative min-h-screen text-center overflow-hidden flex md:flex-row"
      style={{ color: theme.textColor }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center"
        >
          <WeddingLoading /> {/* Gunakan komponen WeddingLoading dari Shadcn UI style */}
        </motion.div>
      )}

      {/* Left Section (Desktop Only) - Sticky Background */}
      <div
        className="hidden md:block w-[70%] sticky top-0 h-screen relative"
        style={{
          backgroundImage: `url(${gallery?.items?.[1] || '/default-cover.jpg'})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />

        {/* Teks di kiri bawah */}
        <div
          className="absolute text-white z-10"
          style={{
            top: '500px',
            left: '36px',
            fontSize: '40px',
            fontFamily: content?.font?.special?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif',
          }}
        >
          Hai, {toName}
        </div>
      </div>

      {/* Right Section (Scrollable Content) */}
      <div className="w-full md:w-[30%] overflow-y-auto h-screen">
        {/* Music & QR Modal */}
        {isOpen && <MusicPlayer autoPlay />}
        <QRModal show={showQr} onClose={() => setShowQr(false)} qrData={sampleQrData} />

        {/* Opening Cover */}
        {!isOpen && !isLoading && (
          <OpeningSection
            opening={opening}
            gallery={gallery}
            decorations={decorations}
            theme={theme}
            isWedding={isWedding}
            childrenData={children}
            onOpen={() => setIsOpen(true)}
            onShowQr={() => setShowQr(true)}
          />
        )}

        {/* Main Sections Container */}
        {isOpen && !isLoading && (
          <div className="w-full">
            <ProfileSection
              gallery={gallery}
              defaultBgImage1={theme.defaultBgImage1}
              opening={opening}
              childrenData={children}
              isWedding={isWedding}
              nameFontSize={{ fontSize: '50px' }}
              weddingTextFontSize={{ fontSize: '20px' }}
              marginBottomWeddingText="mb-3"
              marginBottomName="mb-4"
              topLeftDecoration={decorations?.topLeft}
              topRightDecoration={decorations?.topRight}
              bottomLeftDecoration={decorations?.bottomLeft}
              bottomRightDecoration={decorations?.bottomRight}
              specialFontFamily={processedSpecialFontFamily}
              event={event} // Pastikan Anda meneruskan objek event di sini
            />
            <QuoteSection quotes={quotes} />
            <ImportantEventSection quotes={quotes} />
            <InvitationTextSection invitation={invitation} />
            <FamilySection
              children={children}
              parents={parents}
              isWedding={isWedding}
              theme={theme}
            />
            <CountdownSection eventDate={eventDate} calendarUrl={calendarUrl} theme={theme} />
            <EventSection content={content} theme={theme} />
            {our_story?.length > 0 && <OurStorySection ourStory={our_story} theme={theme} />}
            <GallerySection gallery={gallery} theme={{ defaultBgImage: theme.defaultBgImage }} />
            <ClosingSection closing={closing} defaultBgImage={theme.defaultBgImage} />
            <FooterSection textColor={theme.textColor} />
          </div>
        )}

        {/* Navigation */}
        {isOpen && !isLoading && (
          <Navigation
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            accentColor={theme.accentColor} // Pass accent color from theme
          />
        )}
      </div>
    </main>
  );
}