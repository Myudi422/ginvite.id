"use client";

import { useState, useEffect } from "react";
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
import LazyHydrate from '@/components/ui/lazy-hydrate';
import ClosingSection from "@/components/theme/1/ClosingSection";
import FooterSection from "@/components/theme/1/FooterSection";
import { recordContentView } from "@/app/actions/view";
import { midtransAction, toggleStatusAction } from "@/app/actions/indexcontent";

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

interface ThemeEvent {
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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [urlParams, setUrlParams] = useState<{ userId?: string; title?: string; toName?: string }>({});

  const searchParams = useSearchParams();
  const params = useParams();

  // Payment handler function
  const handlePayment = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setPaymentError('Fitur pembayaran tidak tersedia');
      return;
    }

    // Get URL params from state (set in useEffect)
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
        user_id: parseInt(userId),
        id_content: cuId,
        title: decodeURIComponent(title),
      });

      if (mjson.status === 'paid') {
        // Already paid, just activate
        await toggleStatusAction({
          user_id: parseInt(userId),
          id: cuId,
          title: decodeURIComponent(title),
          status: 1,
        });
        // Refresh page to show activated status
        window.location.reload();
      } else {
        // Open Midtrans Snap payment
        // @ts-ignore
        if (typeof window.snap !== 'undefined') {
          console.log('Opening Midtrans Snap payment...');
          // @ts-ignore
          window.snap.pay(mjson.snap_token, {
            onSuccess: async () => {
              await toggleStatusAction({
                user_id: parseInt(userId),
                id: cuId,
                title: decodeURIComponent(title),
                status: 1,
              });
              // Refresh page to show activated status
              window.location.reload();
            },
            onError: (e: any) => {
              setPaymentError('Pembayaran gagal: ' + (e?.message || 'Terjadi kesalahan'));
            },
            onClose: () => {
              // User closed the payment popup
              setPaymentLoading(false);
            }
          });
          // Don't set loading false here since Snap will handle the callbacks
        } else {
          setPaymentError('Sistem pembayaran belum siap. Silakan refresh halaman.');
          setPaymentLoading(false);
        }
      }
    } catch (err: any) {
      setPaymentError('Gagal memproses pembayaran: ' + err.message);
      setPaymentLoading(false);
    }
  };
  useEffect(() => {
    // Set client flag and URL params after mount
    setIsClient(true);

    // Safely get URL params on client side only
    if (typeof window !== 'undefined') {
      const userId = params?.userId as string;
      const title = params?.title as string;
      const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";

      setUrlParams({ userId, title, toName });
    }

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    document.body.style.overflow = isOpen ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
      clearTimeout(loadingTimeout);
    };
  }, [isOpen, params, searchParams]);

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
  const isKhitan = (category_type?.name || '').toString().toLowerCase().includes('khitan');

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

    let titleText = `Undangan Pernikahan - ${nickname}`;

    let detailsText = `Kami dari papunda.com bermaksud mengundang Anda di acara ini. Merupakan suatu kehormatan dan kebahagiaan bagi pihak mengundang, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu pada hari :\n${eventDetails}`;

    // Jika category_type atau event title/details mengindikasikan khitanan, ganti teks undangan untuk kalender
    const lowerCategory = (category_type || '').toString().toLowerCase();
    const lowerEventTitle = (eventTitle || '').toString().toLowerCase();
    const lowerEventDetails = eventDetails.toLowerCase();
    const anyEventTitleMentionsKhitan = sortedEvents.some(ev => (ev.title || '').toString().toLowerCase().includes('khitan'));
    const isKhitanTemp = lowerCategory.includes('khitan') || lowerEventTitle.includes('khitan') || lowerEventDetails.includes('khitan') || anyEventTitleMentionsKhitan;

    if (isKhitanTemp) {
      // Use only the first child's name and strip any '&' suffixes (e.g. "A & B")
      const rawChild = children?.[0]?.name || children?.[0]?.nickname || nickname || '';
      const firstChildName = rawChild ? rawChild.split('&')[0].trim() : '';
      const childName = firstChildName.replace(/\s*\&.*$/g, '').trim();
      titleText = `Undangan Khitanan${childName ? ' - ' + childName : ''}`;
      detailsText = `Kami mengundang Anda untuk menghadiri acara khitanan${childName ? ' ' + childName : ''}. Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan mendoakan. \n${eventDetails}`;
    }

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
          {paymentError && isClient && (
            <div className="text-red-600 text-xs mt-1 px-3">
              {paymentError}
            </div>
          )}
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
          Hai, {urlParams.toName || "Bapak/Ibu/Saudara/i"}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full md:w-[30%] overflow-y-auto h-screen">
        {isOpen && musicEnabled && <MusicPlayer url={musicUrl} autoPlay accentColor={theme.accentColor} />}
        <QRModal
          show={showQr}
          onClose={() => setShowQr(false)}
          qrData={urlParams.toName || "Bapak/Ibu/Saudara/i"}
          guestName={urlParams.toName || "Bapak/Ibu/Saudara/i"}
          eventName={isKhitan ? nickname1 : nickname}
          eventDate={firstEvent?.date ? new Date(`${firstEvent.date}T${firstEvent.time}`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          eventTime={firstEvent?.time || "Pukul 09.00 WIB - Selesai"}
          coverImage={gallery?.items?.[0] || theme.defaultBgImage1 || '/images/default-wedding.jpg'}
        />

        {!isOpen && !isLoading && (
          <OpeningSection
            opening={{ ...opening, to: urlParams.toName }}
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
              waktu_acara={`${firstEvent?.date ?? ''} ${firstEvent?.time ?? ''}`}
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
              event={firstEvent as any}
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
              <LazyHydrate>
                <OurStorySection ourStory={our_story} theme={theme} specialFontFamily={processedSpecialFontFamily} BodyFontFamily={processedBodyFontFamily} HeadingFontFamily={processedHeadingFontFamily} />
              </LazyHydrate>
            )}
            {gallery_enabled && gallery?.items?.length > 0 && (
              <LazyHydrate>
                <GallerySection gallery={gallery} theme={theme} />
              </LazyHydrate>
            )}
            {content?.plugin?.gift && content?.plugin?.youtube_link && (
              <LazyHydrate>
                <VideoSection youtubeLink={content.plugin.youtube_link} defaultBgImage1={theme.defaultBgImage1} />
              </LazyHydrate>
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