"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import CountdownTimer from "@/components/countdown-timer";
// MusicPlayer and VideoSection are lazy-loaded below via next/dynamic
import QRModal from "@/components/QRModal";
import '@/styles/font.css';
import { AnimatePresence, motion } from 'framer-motion';

// Lottie player for loading
import dynamic from 'next/dynamic';
// Lazy-load heavy/hydration-sensitive components with error handling
const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact).catch(() => {
    console.warn('Failed to load DotLottieReact, using fallback');
    return () => <div className="flex items-center justify-center p-8">Loading…</div>;
  }), 
  { 
    ssr: false, 
    loading: () => <div className="flex items-center justify-center p-8">Loading…</div> 
  }
);

const MusicPlayer = dynamic(
  () => import('@/components/MusicPlayer').catch(() => {
    console.warn('Failed to load MusicPlayer');
    return { default: () => null };
  }), 
  { ssr: false, loading: () => null }
);

const VideoSection = dynamic(
  () => import('@/components/theme/1/videosection').catch(() => {
    console.warn('Failed to load VideoSection');
    return { default: () => null };
  }), 
  { ssr: false, loading: () => null }
);

// Section components
import RsmpSection from "@/components/theme/1/rsmpsection";
import BankSection from "@/components/theme/1/BankSection";
import OpeningSection from "@/components/theme/1/OpeningSection";
import ProfileSection from "@/components/theme/1/ProfileSection";
import QuoteSection from "@/components/theme/1/QuoteSection";
import EventSection from "@/components/theme/1/EventSection";
import ImportantEventSection from "@/components/theme/1/ImportantEventSection";
import CountdownSection from "@/components/theme/1/CountdownSection";
import InvitationTextSection from "@/components/theme/1/InvitationTextSection";
import GallerySection from "@/components/theme/1/GallerySection";
import OurStorySection from "@/components/theme/1/OurStorySection";
import TurutSection from "@/components/theme/1/TurutSection";
import ClosingSection from "@/components/theme/1/ClosingSection";
import FooterSection from "@/components/theme/1/FooterSection";

// Mock server actions untuk sample
import { recordContentView, midtransAction, toggleStatusAction } from "@/app/sample/mock-actions";

interface Theme1Props {
  data: any;
}

interface EventData {
  date: string;
  time: string;
  location: string;
  mapsLink: string;
  title?: string;
}

interface ThemeEvent {
  key: string;
  title?: string;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}

export default function Theme1Sample({ data }: Theme1Props) {
  const cuId = data.content_user_id;
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [urlParams, setUrlParams] = useState<{ userId?: string; title?: string; toName?: string }>({});

  const searchParams = useSearchParams();
  const params = useParams();

  // Payment handler function (mock for sample)
  const handlePayment = async () => {
    if (typeof window === 'undefined') {
      setPaymentError('Fitur pembayaran tidak tersedia');
      return;
    }

    const { userId, title } = urlParams;
    
    if (!cuId || !userId || !title) {
      console.error('Payment data missing:', { cuId, userId, title });
      setPaymentError('Data undangan tidak lengkap');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const mjson = await midtransAction({
        content_user_id: cuId,
        amount: 10000,
        orderId: `sample-${Date.now()}`,
      });

      if (mjson.success && mjson.redirect_url) {
        window.location.href = mjson.redirect_url;
      } else {
        if (mjson.message?.includes('sudah aktif')) {
          await toggleStatusAction({
            content_user_id: cuId,
            status: 'ya',
          });
          
          window.location.reload();
        } else {
          setPaymentError(mjson.message || 'Gagal memproses pembayaran');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Set client flag
  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
    
    // Set URL params
    if (params) {
      const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
      const title = Array.isArray(params.title) ? params.title[0] : params.title;
      
      setUrlParams({
        userId,
        title,
        toName: searchParams?.get("to") || undefined,
      });
    }
  }, [params, searchParams]);

  // Mock content view recording
  useEffect(() => {
    if (!cuId || typeof window === 'undefined') return;

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
  const eventsList: ThemeEvent[] = Object.entries(apiEvents ?? {})
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
  .filter(Boolean) as ThemeEvent[];

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

  // Fallback countdown untuk default atau error parsing
  const countdownDate = useMemo(() => {
    if (firstEvent && firstEvent.date && firstEvent.time) {
      try {
        const targetDate = new Date(`${firstEvent.date}T${firstEvent.time}:00`);
        if (!isNaN(targetDate.getTime())) {
          return targetDate;
        }
      } catch (error) {
        console.error("Error creating countdown date:", error);
      }
    }
    // Fallback: 30 hari dari sekarang
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback;
  }, [firstEvent]);

  const googleCalendarUrl = useMemo(() => {
    if (!firstEvent?.date || !firstEvent?.time) return "";

    try {
      const startDate = new Date(`${firstEvent.date}T${firstEvent.time}:00`);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours

      const formatDateTimeForGoogle = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      };

      const start = formatDateTimeForGoogle(startDate);
      const end = formatDateTimeForGoogle(endDate);

      let calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}`;
      calendarUrl += `&text=${encodeURIComponent(`${firstEvent.title || 'Acara Pernikahan'}`)}`;
      calendarUrl += `&location=${encodeURIComponent(firstEvent.location || '')}`;
      calendarUrl += `&details=${encodeURIComponent(`Acara ${firstEvent.title || 'pernikahan'} - ${firstEvent.location || ''}`)}`;

      return calendarUrl;
    } catch (error) {
      console.error("Error creating Google Calendar URL:", error);
      return "";
    }
  }, [firstEvent]);

  // Process font families
  const processedHeadingFontFamily = content?.font?.heading?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';
  const processedBodyFontFamily = content?.font?.body?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';

  // setelah destructure content
  const turutList = content?.turut?.list || [];
  const turutEnabled = content?.turut?.enabled;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotLottieReact
          src="/loading-animation.json"
          loop
          autoplay
          style={{ width: '200px', height: '200px' }}
        />
      </div>
    );
  }

  return (
    <main className={`relative min-h-screen text-center overflow-hidden flex md:flex-row ${data.status === "tidak" ? "pt-16 sm:pt-12" : ""}`} style={{ color: theme.textColor }}>
      {data.status === "tidak" && (
        <div className="fixed top-0 left-0 w-full bg-yellow-300 text-yellow-900 py-1 z-50 text-center font-medium">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3">
            <span className="text-xs sm:text-sm">Undangan dalam mode ujicoba/gratis.</span>
            {isClient && (
              <Button 
                size="sm"
                variant="outline"
                className="bg-white text-yellow-900 border-yellow-600 hover:bg-yellow-50 disabled:opacity-50 text-xs whitespace-nowrap px-2 py-1"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Memproses...' : 'Aktifkan Sekarang'}
              </Button>
            )}
          </div>
          {paymentError && (
            <div className="text-xs text-red-600 mt-1 px-3">
              {paymentError}
            </div>
          )}
        </div>
      )}

      {/* Background Image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(${leftBgImage})`,
          zIndex: 1,
        }}
      />

      {/* Main Content Container */}
      <div className={`relative z-10 w-full ${data.status === "tidak" ? "pt-16 sm:pt-12" : ""}`}>
        
        {/* Global Font Styles */}
        <style jsx global>{`
          .heading-font { font-family: ${processedHeadingFontFamily}; }
          .body-font { font-family: ${processedBodyFontFamily}; }
        `}</style>

        {/* Navigation */}
        <Navigation
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          accentColor={theme.accentColor}
          showQrModal={() => setShowQr(true)}
        />

        <div className="sections">
          {/* Opening Section */}
          <OpeningSection
            data={data}
            onOpen={() => setIsOpen(true)}
            onShowQr={() => setShowQr(true)}
            headingFontFamily={processedHeadingFontFamily}
            bodyFontFamily={processedBodyFontFamily}
          />

          {isOpen && (
            <AnimatePresence>
              {/* Profile Section */}
              <ProfileSection
                children={children}
                parents={parents}
                accentColor={theme.accentColor}
                bodyFontFamily={processedBodyFontFamily}
                headingFontFamily={processedHeadingFontFamily}
              />

              {/* Quote Section */}
              {quote_enabled && quotes?.enabled && (
                <QuoteSection
                  quote={quotes}
                  accentColor={theme.accentColor}
                  bodyFontFamily={processedBodyFontFamily}
                  headingFontFamily={processedHeadingFontFamily}
                />
              )}

              {/* Invitation Text Section */}
              <InvitationTextSection
                invitation={invitation}
                accentColor={theme.accentColor}
                bodyFontFamily={processedBodyFontFamily}
                headingFontFamily={processedHeadingFontFamily}
              />

              {/* Countdown Section */}
              <CountdownSection
                countdownDate={countdownDate}
                accentColor={theme.accentColor}
                bodyFontFamily={processedBodyFontFamily}
                headingFontFamily={processedHeadingFontFamily}
                googleCalendarUrl={googleCalendarUrl}
              />

              {/* Event Section */}
              <EventSection
                events={sortedEvents}
                accentColor={theme.accentColor}
                bodyFontFamily={processedBodyFontFamily}
                headingFontFamily={processedHeadingFontFamily}
              />

              {/* Our Story Section */}
              {our_story && our_story.length > 0 && (
                <OurStorySection
                  stories={our_story}
                  accentColor={theme.accentColor}
                  bodyFontFamily={processedBodyFontFamily}
                  headingFontFamily={processedHeadingFontFamily}
                />
              )}

              {/* Gallery Section */}
              {gallery_enabled && gallery?.items?.length > 0 && (
                <GallerySection
                  images={gallery.items}
                  accentColor={theme.accentColor}
                  headingFontFamily={processedHeadingFontFamily}
                />
              )}

              {/* Important Event Section */}
              <ImportantEventSection
                events={sortedEvents}
                accentColor={theme.accentColor}
                bodyFontFamily={processedBodyFontFamily}
                headingFontFamily={processedHeadingFontFamily}
              />

              {/* Video Section */}
              {plugin?.youtube_link && (
                <VideoSection 
                  youtubeLink={plugin.youtube_link} 
                  defaultBgImage1={theme.defaultBgImage1} 
                />
              )}

              {/* RSVP Section */}
              <RsmpSection
                theme={{
                  textColor: theme.textColor,
                  bgColor: theme.bgColor || '#ffffff',
                  accentColor: theme.accentColor,
                  background: theme.background || '#ffffff',
                }}
                specialFontFamily={processedHeadingFontFamily}
                bodyFontFamily={processedBodyFontFamily}
                contentUserId={cuId}
                id="rsvp"
              />

              {/* Bank Section */}
              {content.bank_accounts && content.bank_accounts.length > 0 && (
                <BankSection
                  theme={{
                    textColor: theme.textColor,
                    accentColor: theme.accentColor,
                    defaultBgImage: theme.defaultBgImage1,
                  }}
                  bankTransfer={{
                    enabled: true,
                    accounts: content.bank_accounts,
                  }}
                  bodyFontFamily={processedBodyFontFamily}
                  specialFontFamily={processedHeadingFontFamily}
                  contentUserId={cuId}
                  status={data.status}
                />
              )}

              {/* Turut Section */}
              <TurutSection enabled={turutEnabled} list={turutList} accentColor={theme.accentColor} />

              {/* Closing Section */}
              {closing?.enabled && (
                <ClosingSection
                  text={closing.text}
                  accentColor={theme.accentColor}
                  bodyFontFamily={processedBodyFontFamily}
                  headingFontFamily={processedHeadingFontFamily}
                />
              )}

              {/* Footer Section */}
              <FooterSection
                accentColor={theme.accentColor}
                bodyFontFamily={processedBodyFontFamily}
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Music Player */}
      {isOpen && musicEnabled && <MusicPlayer url={musicUrl} autoPlay accentColor={theme.accentColor} />}

      {/* QR Modal */}
      {showQr && <QRModal url={window.location.href} onClose={() => setShowQr(false)} />}
    </main>
  );
}