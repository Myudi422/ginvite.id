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
  const { music, opening, gallery, children, quote, our_story } = content || {};
  const musicUrl = music?.url || "";
  const musicEnabled = music?.enabled || false;

  // Additional data mapping inspired by Theme 7
  const lowerCategory = (category_type?.name || "").toString().toLowerCase();
  const isKhitan = lowerCategory.includes("khitan");
  const isWedding = !!data?.parents?.groom;
  const nickname1 = children?.[0]?.nickname || children?.[0]?.name || "";
  const nickname2 = children?.[1]?.nickname || children?.[1]?.name || "";
  const coupleNickname = [nickname1, nickname2].filter(Boolean).join(" & ");

  const firstEvent = apiEvents && Object.values(apiEvents)[0] ? (Object.values(apiEvents)[0] as any) : null;
  const weddingDateFormatted = firstEvent?.date
    ? new Date(firstEvent.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : "";

  // Adjust loading timing and cleanup
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__GINVITE_DATA__ = data;
      (window as any).__GINVITE_TO__ = toName;
    }

    const t = setTimeout(() => setIsLoading(false), 1200);

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = isOpen ? "auto" : "hidden";

    return () => {
      document.body.style.overflowX = "auto";
      document.body.style.overflowY = "auto";
      clearTimeout(t);
    };
  }, [isOpen, data, toName]);

  const themeColor = theme?.accentColor || "#c9a96e";

  const commonProps = {
    data,
    toName,
    guestName: toName,
    coupleName: data?._displayName || "",
    coupleNickname,
    nickname1,
    nickname2,
    weddingDate: weddingDateFormatted,
    isWedding,
    isKhitan,
    eventLabel: isKhitan ? "Walimatul Khitan" : "Wedding Invitation",
    eventSubtitle: isKhitan ? "Khitannya" : "The Wedding Of",
    parentLabel: isKhitan ? "Putra dari" : "Putra/i dari",
    themeColor: themeColor,
    coverImage:
      gallery?.items?.[0] ||
      theme?.defaultBgImage1 ||
      "/images/default-wedding.jpg",
    onOpen: () => setIsOpen(true),
    onShowQr: () => setShowQr(true),
  };

  return (
    <PlasmicRootProvider loader={PLASMIC}>
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
        <div className="relative w-full min-h-screen overflow-x-hidden">
          <PlasmicComponent
            component="NewPage"
            componentProps={commonProps}
          />
        </div>
      )}

      {/* Halaman utama undangan - Render 'Theme8' dari Plasmic */}
      {isOpen && (
        <div className="relative w-full max-w-full min-h-screen overflow-x-hidden">
          {musicEnabled && (
            <MusicPlayer url={musicUrl} autoPlay accentColor={theme?.accentColor} />
          )}
          <PlasmicComponent
            component="Theme8"
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
              groomFather: data?.parents?.groom?.father || "",
              groomMother: data?.parents?.groom?.mother || "",
              brideFather: data?.parents?.bride?.father || "",
              brideMother: data?.parents?.bride?.mother || "",
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

