"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import {
  PlasmicRootProvider,
  PlasmicComponent,
} from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/plasmic-init";
import dynamic from "next/dynamic";
import QRModal from "@/components/QRModal";

// Add global styles for Plasmic responsiveness
const GlobalStyles = () => (
  <style jsx global>{`
    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    .plasmic_page_wrapper {
      width: 100% !important;
      min-height: 100dvh !important;
      display: flex !important;
      flex-direction: column !important;
      background-color: transparent !important;
    }
    /* Memaksa elemen pertama Plasmic untuk memenuhi layar */
    .plasmic_page_wrapper > div:first-child {
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      min-height: 100dvh !important;
      width: 100% !important;
    }
  `}</style>
);

// Lazy-load MusicPlayer agar tidak menyebabkan hydration error
const MusicPlayer = dynamic(
  () =>
    import("@/components/MusicPlayer").catch(() => ({
      default: () => null,
    })),
  { ssr: false, loading: () => null }
);

interface Theme8Props {
  data: any;
}

export default function Theme8({ data }: Theme8Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const params = useParams();

  const toName =
    searchParams?.get("to") || data?.content?.opening?.to || "Bapak/Ibu/Saudara/i";

  const { content, theme, decorations, category_type, event: apiEvents } = data || {};

  // Destructure flag-flag aktif/nonaktif dari API
  const { 
    music, opening, gallery, children, quote, our_story,
    quote_enabled, gallery_enabled, our_story_enabled 
  } = content || {};

  const musicUrl = music?.url || "";
  const musicEnabled = music?.enabled || false;

  // Additional data mapping inspired by Theme 7
  const lowerCategory = (category_type?.name || "").toString().toLowerCase();
  const isKhitan = lowerCategory.includes("khitan");
  const isWedding = !!content?.parents?.groom;
  const nickname1 = children?.[0]?.nickname || children?.[0]?.name || "";
  const nickname2 = children?.[1]?.nickname || children?.[1]?.name || "";
  const coupleNickname = [nickname1, nickname2].filter(Boolean).join(" & ");

  const eventsList = Object.entries(apiEvents ?? {})
    .map(([key, ev]: [string, any]) => {
      return ev ? {
        key: key,
        title: ev.title || key.charAt(0).toUpperCase() + key.slice(1),
        date: ev.date || '',
        time: ev.time || '',
        location: ev.location || '',
        mapsLink: ev.mapsLink || '',
      } : null;
    })
    .filter(Boolean) as any[];

  const sortedEvents = [...eventsList].sort((a, b) => {
    try {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      return 0;
    }
  });

  const firstEvent = sortedEvents[0];
  const weddingDateFormatted = firstEvent?.date
    ? new Date(firstEvent.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  // Google Calendar Integration logic from Theme 1
  let calendarUrl = '';
  let eventDate: Date | null = null;
  if (firstEvent?.date && firstEvent?.time) {
    try {
      eventDate = new Date(`${firstEvent.date}T${firstEvent.time}`);
    } catch (error) {
      eventDate = null;
    }
  }

  if (firstEvent && eventDate) {
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(eventDate.getTime() + 3600000); // 1 hour duration
    const end = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const eventDetails = sortedEvents.map(ev =>
      `${ev.title}: ${ev.date} ${ev.time} @ ${ev.location} (${ev.mapsLink})`
    ).join('\n');

    let titleText = `Undangan Pernikahan - ${coupleNickname}`;
    let detailsText = `Kami dari papunda.com bermaksud mengundang Anda di acara ini. Merupakan suatu kehormatan dan kebahagiaan bagi pihak mengundang, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu pada hari :\n${eventDetails}`;

    if (isKhitan) {
      const rawChild = children?.[0]?.name || children?.[0]?.nickname || coupleNickname || '';
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


  // Adjust loading timing and cleanup
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__GINVITE_DATA__ = data;
      (window as any).__GINVITE_TO__ = toName;
    }

    const t = setTimeout(() => setIsLoading(false), 1200);

    // Reset body spacing to ensure full bleed
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = isOpen ? "auto" : "hidden";
    // Optional: match body bg with theme to hide any gaps
    document.body.style.backgroundColor = "#fff";

    return () => {
      document.body.style.overflowX = "auto";
      document.body.style.overflowY = "auto";
      clearTimeout(t);
    };
  }, [isOpen, data, toName]);

  const themeColor = theme?.accentColor || "#c9a96e";

  const countdownDateRaw = firstEvent?.date 
    ? `${firstEvent.date}T${firstEvent.time || "09:00:00"}` 
    : "";

  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00" });

  useEffect(() => {
    if (!countdownDateRaw) return;
    
    const targetDate = new Date(countdownDateRaw);
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0')
        });
      }
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [countdownDateRaw]);

  const commonProps = {
    data,
    toName,
    guestName: toName,
    coupleName: data?._displayName || "",
    coupleNickname,
    nickname1,
    nickname2,
    weddingDate: weddingDateFormatted,
    countdownDate: countdownDateRaw,
    // Prop teks untuk bind langsung ke elemen Text di Plasmic
    daysLeft: timeLeft.days,
    hoursLeft: timeLeft.hours,
    minutesLeft: timeLeft.minutes,
    // Prop Quote (Kutipan) - Sekarang Taat pada Saklar API
    quote: typeof quote === "string" ? quote : quote?.text || quote?.quote || "",
    quoteSource: quote?.source || "",
    quoteEnabled: !!quote_enabled, 
    galleryEnabled: !!gallery_enabled,
    storyEnabled: !!our_story_enabled,
    isWedding,
    isKhitan,
    eventLabel: isKhitan ? "Walimatul Khitan" : "Wedding Invitation",
    eventSubtitle: isKhitan ? "Khitannya" : "The Wedding Of",
    parentLabel: isKhitan ? "Putra dari" : "Putra/i dari",
    themeColor: themeColor,
    calendarUrl: calendarUrl,
    coverImage:
      gallery?.items?.[0] ||
      theme?.defaultBgImage1 ||
      "/images/default-wedding.jpg",
    onSaveCalendar: () => {
      if (calendarUrl) {
        window.open(calendarUrl, "_blank");
      }
    },
    showQrPlugin: !!searchParams?.get("to") && !!content?.plugin?.qrcode, // Hanya muncul jika ada ?to=... di URL dan plugin aktif

    onOpen: () => setIsOpen(true),
    onShowQr: () => setShowQr(true),
    groomProfile: children?.[0]?.profile || "",
    brideProfile: children?.[1]?.profile || "",
    hasGroomProfile: !!(children?.[0]?.profile && children[0].profile.trim() !== ""),
    hasBrideProfile: !!(children?.[1]?.profile && children[1].profile.trim() !== ""),
    hasAnyProfile: !!((children?.[0]?.profile && children[0].profile.trim() !== "") || (children?.[1]?.profile && children[1].profile.trim() !== "")),
    
    // Combined Parent Props
    groomParentText: `${isKhitan ? "Putra dari" : "Putra dari"} ${content?.parents?.groom?.father || ""}${content?.parents?.groom?.father && content?.parents?.groom?.mother ? " & " : ""}${content?.parents?.groom?.mother || ""}`.trim(),
    brideParentText: `${isKhitan ? "Putra dari" : "Putri dari"} ${content?.parents?.bride?.father || ""}${content?.parents?.bride?.father && content?.parents?.bride?.mother ? " & " : ""}${content?.parents?.bride?.mother || ""}`.trim(),

    // --- Helper Event Props ---
    ...(() => {
      const formatEvDate = (d?: string) => {
        if (!d) return "";
        try {
          return new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          });
        } catch (e) { return d; }
      };

      const getEv = (key: string) => {
        const ev = apiEvents?.[key];
        return {
          exists: !!ev,
          title: ev?.title || "",
          date: formatEvDate(ev?.date),
          time: ev?.time || "",
          location: ev?.location || "",
          maps: ev?.mapsLink || ""
        };
      };

      const akad = getEv("akad");
      const resepsi = getEv("resepsi");
      const pemberkatan = getEv("pemberkatan");
      const unduhMantu = getEv("unduh_mantu");
      let khitan = getEv("khitanan");
      if (!khitan.exists) khitan = getEv("walimatul_khitan");

      return {
        hasAkad: akad.exists,
        akadTitle: akad.title || "Akad Nikah",
        akadDate: akad.date,
        akadTime: akad.time,
        akadLocation: akad.location,
        akadMaps: akad.maps,
        onAkadMaps: () => { if (akad.maps) window.open(akad.maps, "_blank"); },

        hasResepsi: resepsi.exists,
        resepsiTitle: resepsi.title || "Resepsi",
        resepsiDate: resepsi.date,
        resepsiTime: resepsi.time,
        resepsiLocation: resepsi.location,
        resepsiMaps: resepsi.maps,
        onResepsiMaps: () => { if (resepsi.maps) window.open(resepsi.maps, "_blank"); },

        hasPemberkatan: pemberkatan.exists,
        pemberkatanTitle: pemberkatan.title || "Pemberkatan",
        pemberkatanDate: pemberkatan.date,
        pemberkatanTime: pemberkatan.time,
        pemberkatanLocation: pemberkatan.location,
        pemberkatanMaps: pemberkatan.maps,
        onPemberkatanMaps: () => { if (pemberkatan.maps) window.open(pemberkatan.maps, "_blank"); },

        hasUnduhMantu: unduhMantu.exists,
        unduhMantuTitle: unduhMantu.title || "Unduh Mantu",
        unduhMantuDate: unduhMantu.date,
        unduhMantuTime: unduhMantu.time,
        unduhMantuLocation: unduhMantu.location,
        unduhMantuMaps: unduhMantu.maps,
        onUnduhMantuMaps: () => { if (unduhMantu.maps) window.open(unduhMantu.maps, "_blank"); },

        hasKhitanEvent: khitan.exists,
        khitanTitle: khitan.title || "Walimatul Khitan",
        khitanDate: khitan.date,
        khitanTime: khitan.time,
        khitanLocation: khitan.location,
        khitanMaps: khitan.maps,
        onKhitanMaps: () => { if (khitan.maps) window.open(khitan.maps, "_blank"); },
      };
    })(),
  };

  // Debug Logging
  useEffect(() => {
    console.log("[Theme 8 Debug] Profile Data:", {
      groomProfile: children?.[0]?.profile,
      brideProfile: children?.[1]?.profile,
      hasAnyProfile: commonProps.hasAnyProfile
    });
  }, [children, commonProps.hasAnyProfile]);

  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <GlobalStyles />
      {/* Loading Overlay - Fixed Blank White with Smooth Fade out */}
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 border-2 border-slate-100 border-t-slate-400 rounded-full animate-spin mb-6"
            style={{ borderTopColor: themeColor }}
          />
        </div>
      </div>

      <QRModal
        show={showQr}
        onClose={() => setShowQr(false)}
        qrData={toName}
        guestName={toName}
        eventName={data?._displayName || (isKhitan ? nickname1 : coupleNickname)}
        eventDate={weddingDateFormatted}
        eventTime={firstEvent?.time || ""}
        coverImage={gallery?.items?.[0] || theme?.defaultBgImage1 || ""}
      />

      {/* Halaman pembuka - Render 'Opening2' dari Plasmic */}
      {!isOpen && (
        <div className="relative w-full min-h-[100dvh] overflow-x-hidden flex flex-col">
          <PlasmicComponent
            component="NewPage"
            componentProps={commonProps}
            className="flex-1 w-full"
          />
        </div>
      )}

      {/* Halaman utama undangan - Render 'Theme8' dari Plasmic */}
      {isOpen && (
        <div className="relative w-full min-h-[100dvh] overflow-x-hidden flex flex-col">
          {musicEnabled && (
            <MusicPlayer url={musicUrl} autoPlay accentColor={theme?.accentColor} />
          )}
          <PlasmicComponent
            component="WeddingPage"
            className="flex-1 w-full"
            componentProps={{
              ...commonProps,
              galleryImages: gallery?.items || [],
              invitationText: content?.invitation || "",
              quote: typeof quote === "string" ? quote : quote?.text || quote?.quote || "",
              quoteSource: quote?.source || "",
              groomName: children?.[0]?.name || "",
              brideName: children?.[1]?.name || "",
              groomInstagram: children?.[0]?.instagram || "",
              brideInstagram: children?.[1]?.instagram || "",
              brideProfile: children?.[1]?.profile || "",
              groomFather: content?.parents?.groom?.father || "",
              groomMother: content?.parents?.groom?.mother || "",
              brideFather: content?.parents?.bride?.father || "",
              brideMother: content?.parents?.bride?.mother || "",
              story: our_story || [],
              events: apiEvents || {},
              categoryType: category_type?.name || "pernikahan",
            }}
          />
        </div>
      )}
    </PlasmicRootProvider>
  );
}

