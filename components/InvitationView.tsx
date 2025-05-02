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
import "@/styles/template.css";

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

export default function InvitationView({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const searchParams = useSearchParams();
  const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!data) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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

  return (
    <main
      className="relative min-h-screen text-center overflow-hidden flex md:flex-row"
      style={{ color: theme.textColor }}
    >
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
          className="absolute text-white font-bold z-10"
          style={{
            top: '500px',
            left: '36px',
            fontSize: '40px',
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
        {!isOpen && (
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
        {isOpen && (
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
        {isOpen && (
          <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        )}
      </div>
    </main>
  );
}
