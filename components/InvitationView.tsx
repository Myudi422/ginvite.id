// components/InvitationView.tsx
"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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

  if (!data) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <main
      className="relative min-h-screen text-center overflow-hidden"
      style={{ color: theme.textColor }}
    >
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
        <div className="w-full max-w-md mx-auto"> {/* Mengembalikan max-w-md mx-auto */}
          <ProfileSection
  gallery={gallery}
  defaultBgImage1={theme.defaultBgImage1}
  opening={opening}
  childrenData={children}
  isWedding={isWedding}
  nameFontSize={{ fontSize: '50px' }} // Mengatur ukuran font nama menjadi 32px
  weddingTextFontSize={{ fontSize: '20px' }} // Mengatur ukuran font "The Wedding Of" menjadi 20px
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
    </main>
  );
}