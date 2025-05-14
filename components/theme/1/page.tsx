// Theme1.tsx
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
import RsmpSection from "@/components/theme/1/rsmpsection";
import BankSection from "./BankSection";
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
import WeddingLoading from "@/components/WeddingLoading";

interface Theme1Props {
  data: any;
}

interface EventData {
  date: string;
  time: string;
  location: string;
  mapsLink: string;
  note?: string;
  title?: string;
}

interface Event {
  key: string;
  title?: string;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}

export default function Theme1({ data }: Theme1Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";
  const [showWatermark, setShowWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState("UNDANGAN BELUM AKTIF");

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(loadingTimeout);
    };
  }, [isOpen]);

  if (!data) return <div className="flex items-center justify-center h-screen">Loading Data...</div>;

  useEffect(() => {
    setShowWatermark(data?.status === "tidak");
  }, [data?.status]);

  // Destructure API data
  const { theme, content, decorations, event: apiEvents } = data;
  const { opening, quotes, invitation, children, parents, gallery, our_story, closing, title: eventTitle } = content;

  // Dynamic events list from API
  const eventsList: Event[] = Object.entries(apiEvents ?? {})
    .map(([key, ev]) => {
      const eventData = ev as EventData;
      return eventData ? {
        key: key,
        title: eventData.title || key.charAt(0).toUpperCase() + key.slice(1),
        date: eventData.date || '',
        time: eventData.time || '',
        location: eventData.location || '',
        mapsLink: eventData.mapsLink || '',
      } : null;
    })
    .filter(Boolean) as Event[];

  // Urutkan events berdasarkan tanggal dan waktu
  const sortedEvents = [...eventsList].sort((a, b) => {
    try {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.error("Error parsing date for countdown:", error, a, b);
      return 0;
    }
  });

  // Ambil event pertama untuk countdown
  const firstEvent = sortedEvents[0];
  let eventDate: Date | null = null;
  if (firstEvent?.date && firstEvent?.time) {
    try {
      eventDate = new Date(`${firstEvent.date}T${firstEvent.time}`);
    } catch (error) {
      console.error("Error creating Date object for countdown:", error, firstEvent);
      eventDate = null;
    }
  }

  const isWedding = !!parents?.groom;

  // Google Calendar URL (menggunakan data dari event pertama)
  let calendarUrl = '';
  if (firstEvent && eventDate) {
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const end = new Date(eventDate.getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, '');
    calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}&text=${encodeURIComponent(
      opening.title
    )}&details=${encodeURIComponent(invitation)}&location=${encodeURIComponent(
      firstEvent.location
    )}`;
  }

  const sampleQrData = "SampleGuestID12345";

  // Process font families
  const processedSpecialFontFamily = content?.font?.special?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';
  const processedBodyFontFamily = content?.font?.body?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';
  const processedHeadingFontFamily = content?.font?.heading?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';

  return (
    <main className="relative min-h-screen text-center overflow-hidden flex md:flex-row" style={{ color: theme.textColor }}>
      {isLoading && (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center">
          <WeddingLoading />
        </motion.div>
      )}

      {showWatermark && (
        <div className="fixed top-0 left-0 w-full h-full z-40 pointer-events-none flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
          <div className="relative text-white text-center text-xl font-bold opacity-50">
            {watermarkText}
            <div className="absolute bottom-[-5px] left-0 w-full h-[3px]" style={{ backgroundColor: 'rgba(255, 192, 203, 0.5)' }} />
          </div>
        </div>
      )}

      {/* Left Cover */}
      <div className="hidden md:block w-[70%] sticky top-0 h-screen relative" style={{ backgroundImage: `url(${gallery?.items?.[1] || '/default-cover.jpg'})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
        <div className="absolute text-white z-10" style={{ top: '500px', left: '36px', fontSize: '40px', fontFamily: processedSpecialFontFamily }}>
          Hai, {toName}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-[30%] overflow-y-auto h-screen">
        {isOpen && <MusicPlayer autoPlay />}
        <QRModal show={showQr} onClose={() => setShowQr(false)} qrData={sampleQrData} />

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
            specialFontFamily={processedSpecialFontFamily}
            BodyFontFamily={processedBodyFontFamily}
            HeadingFontFamily={processedHeadingFontFamily}
          />
        )}

        {isOpen && !isLoading && (
          <div className="w-full">
            <ProfileSection
              gallery={gallery}
              defaultBgImage1={theme.defaultBgImage1}
              opening={opening}
              childrenData={children}
              isWedding={isWedding}
              weddingTextFontSize={{ fontSize: '20px' }}
              marginBottomWeddingText="mb-3"
              marginBottomName="mb-4"
              topLeftDecoration={decorations?.topLeft}
              topRightDecoration={decorations?.topRight}
              bottomLeftDecoration={decorations?.bottomLeft}
              bottomRightDecoration={decorations?.bottomRight}
              specialFontFamily={processedSpecialFontFamily}
              BodyFontFamily={processedBodyFontFamily}
              HeadingFontFamily={processedHeadingFontFamily}
              theme={theme}
            />

            <ImportantEventSection theme={theme} quotes={quotes} specialFontFamily={processedSpecialFontFamily} BodyFontFamily={processedBodyFontFamily} />
            <InvitationTextSection invitation={invitation} theme={theme} />
            <FamilySection childrenData={children} parents={parents} isWedding={isWedding} theme={theme} />

            <CountdownSection eventDate={eventDate || new Date()} calendarUrl={calendarUrl} theme={theme} />

            <EventSection events={sortedEvents} theme={theme} sectionTitle={eventTitle} />

            {our_story?.length > 0 && <OurStorySection ourStory={our_story} theme={theme} />}
            <GallerySection gallery={gallery} theme={theme} />
            <BankSection theme={theme} specialFontFamily={processedSpecialFontFamily} bodyFontFamily={processedBodyFontFamily} />
            <RsmpSection contentId={3} theme={theme} specialFontFamily={processedSpecialFontFamily} bodyFontFamily={processedBodyFontFamily} />
            <ClosingSection gallery={gallery} childrenData={children} specialFontFamily={processedSpecialFontFamily} BodyFontFamily={processedBodyFontFamily} HeadingFontFamily={processedHeadingFontFamily} />
          </div>
        )}

        {isOpen && !isLoading && (
          <Navigation activeSection={activeSection} setActiveSection={setActiveSection} accentColor={theme.accentColor} />
        )}
      </div>
    </main>
  );
}