"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import CountdownTimer from "@/components/countdown-timer";
import MusicPlayer from "@/components/MusicPlayer";
import VideoSection from '@/components/theme/1/videosection';
import QRModal from "@/components/QRModal";
import '@/styles/font.css';
import { AnimatePresence, motion } from 'framer-motion';

// Lottie player for loading
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Section components
import RsmpSection from "@/components/theme/1/rsmpsection";
import BankSection from "./BankSection";
import OpeningSection from "@/components/theme/1/OpeningSection";
import ProfileSection from "@/components/theme/1/ProfileSection";
import QuoteSection from "@/components/theme/1/QuoteSection";
import ImportantEventSection from "@/components/theme/1/ImportantEventSection";
import InvitationTextSection from "@/components/theme/1/InvitationTextSection";
import FamilySection from "@/components/theme/1/FamilySection";
import TurutSection from "@/components/theme/1/TurutSection";
import CountdownSection from "@/components/theme/1/CountdownSection";
import EventSection from "@/components/theme/1/EventSection";
import OurStorySection from "@/components/theme/1/OurStorySection";
import GallerySection from "@/components/theme/1/GallerySection";
import ClosingSection from "@/components/theme/1/ClosingSection";
import FooterSection from "@/components/theme/1/FooterSection";
import { recordContentView } from "@/app/actions/view";

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
  const cuId = data.content_user_id;
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";
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

  useEffect(() => {
    if (!cuId) return;

    const viewedKey = `viewed_${cuId}`;
    const lastViewedTimeKey = `lastViewedTime_${cuId}`;
    const oneHour = 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const lastViewed = localStorage.getItem(viewedKey);
    const lastTime = localStorage.getItem(lastViewedTimeKey);

    // Only record view if not viewed in last hour
    if (lastViewed !== 'true' || !lastTime || currentTime - parseInt(lastTime) >= oneHour) {
      recordContentView(cuId)
        .then(() => {
          localStorage.setItem(viewedKey, 'true');
          localStorage.setItem(lastViewedTimeKey, currentTime.toString());
        })
        .catch(console.error);
    }
  }, [cuId]);

  // Destructure API data
  const { theme, content, decorations, event: apiEvents, category_type } = data;
  const { plugin } = content;
  const { opening, quotes, invitation, children, parents, gallery, our_story, music, closing, title: eventTitle, quote, 
    quote_enabled, gallery_enabled = false } = content;

  const { url: musicUrl = "", enabled: musicEnabled = false } = music || {};
  const leftBgImage = gallery?.items?.[1] || theme.defaultBgImage1

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

  const nickname1 = children?.[0]?.nickname || '';
  const nickname2 = children?.[1]?.nickname || '';
  const nickname = [nickname1, nickname2].filter(Boolean).join(' & ');

  let calendarUrl = '';
  if (firstEvent && eventDate) {
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(eventDate.getTime() + 3600000);
    const end = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const eventDetails = sortedEvents.map(ev =>
      `${ev.title}: ${ev.date} ${ev.time} @ ${ev.location} (${ev.mapsLink})`
    ).join('\n');

    const detailsText = `Kami dari papunda.com bermaksud mengundang Anda di acara ini. Merupakan suatu kehormatan dan kebahagiaan bagi pihak mengundang, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu pada hari :\n${eventDetails}`;

    const titleText = `Undangan Pernikahan - ${nickname}`;

    calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}` +
      `&text=${encodeURIComponent(titleText)}` +
      `&details=${encodeURIComponent(detailsText)}` +
      `&location=${encodeURIComponent(firstEvent.location)}`;
  }


  const processedSpecialFontFamily = content?.font?.special?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';
  const processedBodyFontFamily = content?.font?.body?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';
  const processedHeadingFontFamily = content?.font?.heading?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';

    // setelah destructure content
    const turutList = content?.turut?.list || [];
    const turutEnabled = content?.turut?.enabled;

    return (
    <main className="relative min-h-screen text-center overflow-hidden flex md:flex-row" style={{ color: theme.textColor }}>
      {data.status === "tidak" && (
        <div className="fixed top-0 left-0 w-full bg-yellow-300 text-yellow-900 py-3 z-50 text-center font-semibold">
          Undangan dalam mode ujicoba/gratis.
        </div>
      )}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center"
        >
          <DotLottieReact
            src="/loading.lottie"
            autoplay
            loop
            style={{ width: '400px', height: '400px' }}
          />
        </motion.div>
      )}


      {/* Left Cover */}
      <div className="hidden md:block w-[70%] sticky top-0 h-screen relative" style={{ backgroundImage: `url(${leftBgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
        <div className="absolute text-white z-10" style={{ top: '500px', left: '36px', fontSize: '40px', fontFamily: processedSpecialFontFamily }}>
          Hai, {toName}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-[30%] overflow-y-auto h-screen">
        {isOpen && musicEnabled && <MusicPlayer url={musicUrl} autoPlay accentColor={theme.accentColor} />}
        <QRModal show={showQr} onClose={() => setShowQr(false)} qrData={toName} />

        {!isOpen && !isLoading && (
          <OpeningSection
            opening={opening}
            defaultBgImage1={theme.defaultBgImage1}
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
            plugin={plugin} // <-- Tambahkan prop plugin
            category_type={category_type} // <-- Tambahkan prop category_type
          />
        )}

        {isOpen && !isLoading && (
          <div className="w-full">
            <ProfileSection
              id="home"
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
              event={firstEvent}
              category_type={category_type}
            />

            {quote_enabled && (
              <QuoteSection
                quote={quote}
                theme={theme}
                specialFontFamily={processedSpecialFontFamily}
                BodyFontFamily={processedBodyFontFamily}
                HeadingFontFamily={processedHeadingFontFamily}
              />
            )}
            <InvitationTextSection invitation={invitation} theme={theme} />
            <FamilySection
              childrenData={children}
              parents={parents}
              isWedding={isWedding}
              theme={theme}
              category_type={category_type}
            />

            {/* Tambahkan TurutSection di sini */}
            <TurutSection enabled={turutEnabled} list={turutList} accentColor={theme.accentColor} />

            <CountdownSection eventDate={eventDate || new Date()} calendarUrl={calendarUrl} theme={theme} />

            <EventSection events={sortedEvents} theme={theme} sectionTitle={eventTitle} specialFontFamily={processedSpecialFontFamily} />

            {content.our_story?.length > 0 && content.our_story_enabled && (
      <OurStorySection ourStory={our_story} theme={theme} specialFontFamily={processedSpecialFontFamily} BodyFontFamily={processedBodyFontFamily} HeadingFontFamily={processedHeadingFontFamily} />
    )}
            {gallery_enabled && gallery?.items?.length > 0 && (
      <GallerySection gallery={gallery} theme={theme} />
    )}
    {content?.plugin?.gift && content?.plugin?.youtube_link && (
  <VideoSection youtubeLink={content.plugin.youtube_link} defaultBgImage1={theme.defaultBgImage1} />
)}
            {content.bank_transfer?.enabled && (
  <BankSection
    theme={theme}
    specialFontFamily={processedSpecialFontFamily}
    bodyFontFamily={processedBodyFontFamily}
    bankTransfer={content.bank_transfer}
    contentUserId={data.content_user_id}
    status={data.status} // Pass status here
  />
)}
           {content?.plugin?.rsvp && (
      <RsmpSection
        theme={theme}
        specialFontFamily={processedSpecialFontFamily}
        bodyFontFamily={processedBodyFontFamily}
        contentUserId={data.content_user_id}
        id="rsvp"
        plugin={plugin}
        status={data.status} // Pass status here
      />
    )}
            <ClosingSection
              gallery={gallery}
              childrenData={children}
              specialFontFamily={processedSpecialFontFamily}
              BodyFontFamily={processedBodyFontFamily}
              HeadingFontFamily={processedHeadingFontFamily}
              defaultBgImage1={theme.defaultBgImage1}
              category_type={category_type}
            />
          </div>
        )}

        {isOpen && !isLoading && plugin?.navbar && (
  <Navigation
    activeSection={activeSection}
    setActiveSection={setActiveSection}
    accentColor={theme.accentColor}
    showGallery={!!gallery_enabled}
    showRsvp={!!plugin?.rsvp}
  />
)}
      </div>
    </main>
  );
}