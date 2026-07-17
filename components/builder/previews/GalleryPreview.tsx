'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

function getLuminance(hex: string): number {
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isDarkColor(hex: string): boolean {
  if (!hex || !hex.startsWith('#')) return false;
  try {
    return getLuminance(hex) < 140;
  } catch {
    return false;
  }
}

export default function GalleryPreview({ props, style }: P) {
  // ── CORE DATA ──
  const images = ((props.images as string[]) || [])
    .filter(img => typeof img === 'string' && img.trim() !== '')
    .slice(0, 6);
  const cols = Number(props.columns) || 3;
  const layoutTemplate = (props.layout_template as string) || 'grid';
  const animationPreset = (props.animation_preset as string) || 'none';

  // ── STYLE TOKENS ──
  const accent    = (style.accent_color as string) || '#e879a0';
  const textColor = (style.text_color as string)   || '#333333';
  const styleBgColor = (style.bg_color as string)  || '#ffffff';
  const fontBody  = (style.font_body as string)    || 'inherit';
  const fontHead  = (style.font_heading as string) || fontBody;

  // ── BACKGROUND & OVERLAY PROPERTIES ──
  const bgType = (props.bg_type as string) || 'solid';
  const bgColor = (props.bg_color as string) || '';
  const bgColor2 = (props.bg_color2 as string) || '';
  const bgGradientAngle = Number(props.bg_gradient_angle ?? 135);
  const bgImage = (props.bg_image as string) || '';
  const bgImageBlur = Number(props.bg_image_blur ?? 0);
  const bgImageGrayscale = !!props.bg_image_grayscale;
  const slideshowImages = (props.bg_slideshow_images as string[]) || [];
  const slideshowAnimation = (props.bg_slideshow_animation as string) || 'fade';
  const slideshowDuration = Number(props.bg_slideshow_duration ?? 5);

  const overlayType = (props.overlay_type as string) || 'solid';
  const overlayColor = (props.overlay_color as string) || '#000000';
  const overlayColor2 = (props.overlay_color2 as string) || '#000000';
  const overlayOpacity = Number(props.overlay_opacity ?? 50);
  const overlayOpacity2 = Number(props.overlay_opacity2 ?? 0);
  const overlayGradientAngle = Number(props.overlay_gradient_angle ?? 180);

  // Background and Canvas styles
  const isCustomBg = bgType !== 'solid';
  const parentBgColor = bgType === 'solid'
    ? (bgColor || (style.bg_color as string) || '#ffffff')
    : undefined;

  // Determine if the background is dark
  let isBackgroundDark = false;
  if (bgType === 'solid') {
    isBackgroundDark = isDarkColor(parentBgColor || '#ffffff');
  } else if (bgType === 'gradient') {
    const c1 = bgColor || '#ffffff';
    const c2 = bgColor2 || '#ffffff';
    const averageLuma = (getLuminance(c1) + getLuminance(c2)) / 2;
    isBackgroundDark = averageLuma < 140;
  } else if (bgType === 'image' || bgType === 'slideshow') {
    const isOverlayDark = isDarkColor(overlayColor);
    if (isOverlayDark && overlayOpacity >= 30) {
      isBackgroundDark = true;
    } else if (!isOverlayDark && overlayOpacity >= 30) {
      isBackgroundDark = false;
    } else {
      isBackgroundDark = true; 
    }
  }

  // ── AUTO-CONTRAST TEXT COLORS ──
  const resolvedTextColor = isBackgroundDark 
    ? '#edece8' 
    : (isDarkColor(textColor) ? textColor : '#1c1b18');

  const resolvedTitleColor = isBackgroundDark
    ? '#ffffff'
    : (isDarkColor(textColor) ? textColor : '#0f172a');

  const cardBgStyle = isBackgroundDark
    ? { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }
    : { backgroundColor: 'rgba(0, 0, 0, 0.03)', borderColor: accent + '30' };

  // ── ACTIVE STATE HELD BY HOOKS ──
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── SLIDESHOW TIMER ──
  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % validSlides.length);
    }, slideshowDuration * 1000);
    return () => clearInterval(interval);
  }, [bgType, validSlides.length, slideshowDuration]);

  // ── HELPER FUNCTIONS ──
  const getHexWithOpacity = (hex: string, opacityPercent: number): string => {
    if (!hex) return '';
    let clean = hex.trim();
    if (!clean.startsWith('#')) {
      clean = '#' + clean;
    }
    if (clean.length === 4) {
      const r = clean[1];
      const g = clean[2];
      const b = clean[3];
      clean = `#${r}${r}${g}${g}${b}${b}`;
    }
    if (clean.length > 7) {
      clean = clean.slice(0, 7);
    }
    const opacityHex = Math.round((opacityPercent / 100) * 255).toString(16).padStart(2, '0');
    return `${clean}${opacityHex}`;
  };

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // Artistic Mosaic Spanning Mapper
  const getMosaicClass = (idx: number, total: number): string => {
    if (total === 1) return 'col-span-3 row-span-2';
    if (total === 2) {
      if (idx === 0) return 'col-span-2 row-span-1';
      return 'col-span-1 row-span-1';
    }
    if (total === 3) {
      if (idx === 0) return 'col-span-2 row-span-2';
      return 'col-span-1 row-span-1';
    }
    if (total === 4) {
      if (idx === 0) return 'col-span-2 row-span-2';
      if (idx === 3) return 'col-span-3 row-span-1';
      return 'col-span-1 row-span-1';
    }
    if (total === 5) {
      if (idx === 0) return 'col-span-2 row-span-2';
      if (idx === 3) return 'col-span-1 row-span-1';
      if (idx === 4) return 'col-span-2 row-span-1';
      return 'col-span-1 row-span-1';
    }
    // For 6 photos
    if (idx === 0) return 'col-span-2 row-span-2';
    if (idx === 4) return 'col-span-2 row-span-1';
    if (idx === 5) return 'col-span-3 row-span-1';
    return 'col-span-1 row-span-1';
  };

  const renderPolaroidCard = (imgUrl: string, idx: number, aspectClass: string = 'aspect-square', fillParent: boolean = false) => {
    const rotations = ['rotate-[-1.5deg]', 'rotate-[2deg]', 'rotate-[-2.5deg]', 'rotate-[1deg]', 'rotate-[-3deg]', 'rotate-[2.5deg]'];
    const rotClass = rotations[idx % rotations.length];
    
    const captions = [
      'Momen Berharga',
      'Kisah Indah',
      'Penuh Kebahagiaan',
      'Tawa & Ceria',
      'Hari Istimewa',
      'Kenangan Abadi'
    ];
    const caption = captions[idx % captions.length];

    return (
      <div
        key={idx}
        onClick={() => setActiveLightboxIndex(idx)}
        className={`relative p-3 pb-7 sm:p-4 sm:pb-9 bg-[#faf9f6] text-[#2c2c2c] dark:bg-[#1c1b18] dark:text-[#edece8] border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] hover:scale-[1.03] transition-all duration-300 cursor-zoom-in group ${rotClass} ${getAnimClass(idx + 1)} ${fillParent ? 'h-full flex flex-col' : ''}`}
      >
        {/* Tape element */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/40 dark:bg-white/10 backdrop-blur-[2px] border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rotate-[-2deg] z-10 pointer-events-none before:content-[''] before:absolute before:inset-y-0 before:left-0 before:border-l before:border-dashed before:border-black/20 after:content-[''] after:absolute after:inset-y-0 after:right-0 after:border-r after:border-dashed after:border-black/20" />

        {/* Photo Container */}
        <div className={`overflow-hidden rounded-sm bg-gray-150 ${fillParent ? 'flex-1 min-h-0' : aspectClass}`}>
          <img
            src={imgUrl}
            alt={`gallery-${idx}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Cursive Handwriting Caption */}
        <div className="mt-3 text-center flex-shrink-0">
          <span 
            className="text-base sm:text-lg block tracking-wide select-none"
            style={{ 
              fontFamily: "'Caveat', cursive",
              color: 'currentColor'
            }}
          >
            {caption}
          </span>
        </div>
      </div>
    );
  };

  const renderQuoteCard = () => (
    <div
      className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl border shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md min-h-[220px]"
      style={{
        backgroundColor: cardBgStyle.backgroundColor,
        borderColor: cardBgStyle.borderColor,
      }}
    >
      <span className="text-3xl mb-3 filter drop-shadow-sm select-none animate-pulse" style={{ color: accent }}>❦</span>
      <p className="text-sm sm:text-base font-semibold italic leading-relaxed" style={{ color: resolvedTextColor }}>
        "Kebahagiaan sejati ditemukan dalam setiap detik momen yang kita bagikan bersama orang-orang tercinta."
      </p>
      <div className="w-12 h-[2px] mt-4 opacity-65" style={{ backgroundColor: accent }} />
    </div>
  );

  const renderGridArtCard = (imgUrl: string, idx: number) => {
    return (
      <div
        key={idx}
        onClick={() => setActiveLightboxIndex(idx)}
        className={`relative aspect-square rounded-3xl overflow-hidden cursor-zoom-in bg-white/5 border border-black/5 dark:border-white/10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group ${getAnimClass(idx + 1)}`}
      >
        <img
          src={imgUrl}
          alt={`gallery-${idx}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
          <div className="text-white text-left">
            <span className="text-[10px] tracking-[0.25em] font-bold uppercase block mb-1 opacity-70" style={{ color: accent }}>
              Moment
            </span>
            <span className="text-xs font-semibold tracking-wider font-sans">
              MEMORIES #{idx + 1}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderGridQuoteCard = () => (
    <div
      className="flex flex-col items-center justify-center text-center p-8 rounded-3xl border shadow-md backdrop-blur-md min-h-[220px]"
      style={{
        backgroundColor: cardBgStyle.backgroundColor,
        borderColor: cardBgStyle.borderColor,
      }}
    >
      <span className="text-2xl mb-3 opacity-60" style={{ color: accent }}>✦</span>
      <p className="text-sm font-sans tracking-wide leading-relaxed uppercase opacity-80" style={{ color: resolvedTextColor }}>
        "Setiap gambar memiliki cerita tersendiri tentang kebersamaan yang tulus dan abadi."
      </p>
      <div className="w-8 h-[1px] mt-4 opacity-50" style={{ backgroundColor: accent }} />
    </div>
  );

  const renderFilmstripCard = (imgUrl: string, idx: number) => {
    return (
      <div
        key={idx}
        onClick={() => setActiveLightboxIndex(idx)}
        className={`relative flex-shrink-0 w-72 sm:w-80 md:w-[340px] aspect-[4/3] bg-neutral-900 border-y-[16px] border-x-[8px] border-neutral-950 shadow-[0_12px_36px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition-all duration-300 cursor-zoom-in group snap-center ${getAnimClass(idx + 1)}`}
      >
        <div className="absolute top-[-12px] left-0 right-0 h-2 flex justify-between px-2 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-2.5 h-2 bg-neutral-100 rounded-sm opacity-90" />
          ))}
        </div>

        <div className="w-full h-full overflow-hidden bg-neutral-900">
          <img
            src={imgUrl}
            alt={`gallery-${idx}`}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 filter brightness-95 group-hover:brightness-100"
          />
        </div>

        <div className="absolute bottom-[-12px] left-0 right-0 h-2 flex justify-between px-2 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-2.5 h-2 bg-neutral-100 rounded-sm opacity-90" />
          ))}
        </div>
      </div>
    );
  };

  const renderFilmQuoteCard = () => (
    <div className="flex-shrink-0 w-72 sm:w-80 snap-center self-center bg-neutral-900 text-neutral-300 p-6 border-y-[16px] border-x-[8px] border-neutral-950 shadow-[0_12px_36px_rgba(0,0,0,0.3)] relative min-h-[220px] flex flex-col justify-center items-center text-center">
      <div className="absolute top-[-12px] left-0 right-0 h-2 flex justify-between px-2 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-neutral-100 rounded-sm opacity-90" />
        ))}
      </div>

      <span className="text-xl mb-2 text-pink-400">🎞️</span>
      <p className="text-xs font-mono tracking-wider leading-relaxed uppercase">
        "KODAK SAFETY FILM — OUR STORY IN REELS"
      </p>

      <div className="absolute bottom-[-12px] left-0 right-0 h-2 flex justify-between px-2 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-2.5 h-2 bg-neutral-100 rounded-sm opacity-90" />
        ))}
      </div>
    </div>
  );

  const renderLookbookCard = (imgUrl: string, idx: number, fillParent: boolean = false) => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const num = numerals[idx % numerals.length];

    return (
      <div
        key={idx}
        onClick={() => setActiveLightboxIndex(idx)}
        className={`relative overflow-hidden cursor-zoom-in bg-gray-200 shadow-sm border border-black/5 hover:scale-[1.02] transition-all duration-500 group ${fillParent ? 'h-full w-full' : 'aspect-square'} ${getAnimClass(idx + 1)}`}
      >
        <img
          src={imgUrl}
          alt={`gallery-${idx}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 pointer-events-none select-none opacity-25 group-hover:opacity-40 transition-opacity duration-300">
          <span 
            className="text-4xl sm:text-5xl md:text-6xl font-light font-serif tracking-widest text-white drop-shadow"
            style={{ fontFamily: fontHead }}
          >
            {num}
          </span>
        </div>
      </div>
    );
  };

  const renderLookbookQuoteCard = () => (
    <div
      className="flex flex-col items-start justify-center text-left p-8 rounded-none border-l-4 shadow-sm min-h-[220px]"
      style={{
        backgroundColor: isBackgroundDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderColor: accent,
      }}
    >
      <span className="text-4xl leading-none font-serif opacity-30 select-none" style={{ color: accent }}>“</span>
      <p className="text-base sm:text-lg font-serif italic leading-relaxed -mt-2 pl-2" style={{ color: resolvedTextColor, fontFamily: fontHead }}>
        Kisah terbaik adalah kisah yang ditulis oleh waktu, diabadikan dalam gambar, dan disimpan selamanya di dalam hati.
      </p>
      <span className="text-xs tracking-[0.2em] uppercase mt-4 pl-2 font-bold opacity-60" style={{ color: accent }}>
        — THE JOURNEY
      </span>
    </div>
  );

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  const isBroadLayout = layoutTemplate === 'slider' || layoutTemplate === 'grid_mosaic';
  const containerMaxWidthClass = isBroadLayout ? 'max-w-5xl' : 'max-w-3xl sm:max-w-4xl';

  return (
    <div
      className="relative py-14 sm:py-32 px-4 sm:px-6 overflow-hidden w-full transition-all duration-300 min-h-[100dvh] flex flex-col justify-center items-center"
      style={{
        backgroundColor: parentBgColor,
      }}
    >
      {/* ── STYLE BLOCK INJECTION ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        @keyframes galleryKenburns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        @keyframes animFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes animFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes animFadeDown {
          from { opacity: 0; transform: translateY(-28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes animZoomIn {
          from { opacity: 0; transform: scale(0.93); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes animTrackingWide {
          from { opacity: 0; letter-spacing: -0.2em; filter: blur(4px); }
          to { opacity: 1; }
        }
        @keyframes animSlideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes animSlideRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes animBlurReveal {
          from { opacity: 0; filter: blur(14px); transform: scale(0.95); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }
        @keyframes animBounceSoft {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 0.95; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-item {
          opacity: 0;
          animation-fill-mode: forwards !important;
        }
        .animate-fade_in { animation: animFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade_up { animation: animFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade_down { animation: animFadeDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-zoom_in { animation: animZoomIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-tracking_wide { animation: animTrackingWide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide_left { animation: animSlideLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide_right { animation: animSlideRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-blur_reveal { animation: animBlurReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce_soft { animation: animBounceSoft 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .delay-1 { animation-delay: 150ms; }
        .delay-2 { animation-delay: 300ms; }
        .delay-3 { animation-delay: 450ms; }
        .delay-4 { animation-delay: 600ms; }
        .delay-5 { animation-delay: 750ms; }
        .delay-6 { animation-delay: 900ms; }
      `}} />

      {/* ── BACKGROUND LAYERS ── */}
      {bgType === 'gradient' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${bgGradientAngle}deg, ${bgColor || '#ff7e5f'}, ${bgColor2 || '#feb47b'})`
          }}
        />
      )}

      {(bgType === 'image' && bgImage) && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: `${bgImageGrayscale ? 'grayscale(100%)' : ''} ${bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : ''}`.trim() || undefined,
            transform: bgImageBlur > 0 ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      )}

      {bgType === 'slideshow' && validSlides.map((slideUrl, idx) => {
        const isActive = idx === activeSlide;
        const isPrevious = idx === (activeSlide - 1 + validSlides.length) % validSlides.length;

        let transformStr = 'scale(1)';
        let opacityVal = 0;
        let animationStr = undefined;

        if (slideshowAnimation === 'fade') {
          opacityVal = isActive ? 1 : 0;
          if (bgImageBlur > 0) {
            transformStr = 'scale(1.05)';
          }
        } else if (slideshowAnimation === 'zoom') {
          opacityVal = isActive ? 1 : 0;
          if (isActive) {
            animationStr = `galleryKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`;
          }
          if (bgImageBlur > 0) {
            transformStr = 'scale(1.05)';
          }
        } else if (slideshowAnimation === 'slide') {
          opacityVal = isActive ? 1 : 0;
          if (isActive) {
            transformStr = bgImageBlur > 0 ? 'translateX(0) scale(1.05)' : 'translateX(0)';
          } else if (isPrevious) {
            transformStr = bgImageBlur > 0 ? 'translateX(-100%) scale(1.05)' : 'translateX(-100%)';
          } else {
            transformStr = bgImageBlur > 0 ? 'translateX(100%) scale(1.05)' : 'translateX(100%)';
          }
        }

        return (
          <div
            key={idx}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slideUrl})`,
              opacity: opacityVal,
              transform: transformStr,
              animation: animationStr,
              filter: `${bgImageGrayscale ? 'grayscale(100%)' : ''} ${bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : ''}`.trim() || undefined,
              transition: slideshowAnimation === 'slide'
                ? 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 1000ms ease-in-out'
                : 'opacity 1000ms ease-in-out, transform 1000ms ease-in-out'
            }}
          />
        );
      })}

      {/* ── OVERLAY LAYER ── */}
      {isCustomBg && (
        overlayType === 'gradient' ? (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage: `linear-gradient(${overlayGradientAngle}deg, ${getHexWithOpacity(overlayColor, overlayOpacity)}, ${getHexWithOpacity(overlayColor2, overlayOpacity2)})`
            }}
          />
        ) : (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100
            }}
          />
        )
      )}

      {/* Giant Background Word */}
      <div className="absolute inset-x-0 top-1/3 -translate-y-1/2 flex justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.03] dark:opacity-[0.02]">
        <span className="text-[12rem] sm:text-[18rem] font-extrabold tracking-widest font-serif uppercase">
          MEMORIES
        </span>
      </div>

      {/* ── MAIN CONTENT CANVAS ── */}
      <div className={`relative z-10 flex flex-col items-center gap-8 w-full mx-auto ${containerMaxWidthClass}`}>
        {/* Elegant Header */}
        <div className="text-center space-y-2 mb-4">
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase" style={{ color: accent }}>
            OUR MEMORIES
          </span>
          <h2 
            className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" 
            style={{ color: '#ffffff', fontFamily: fontHead }}
          >
            Galeri Foto Bahagia
          </h2>
          <div className="w-16 h-0.5 mx-auto mt-3 opacity-80" style={{ backgroundColor: accent }} />
        </div>

        {images.length === 0 ? (
          <div className="w-full max-w-xl border-2 border-dashed border-gray-300/40 rounded-3xl py-16 flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm shadow-sm">
            <span className="text-4xl animate-bounce">🖼️</span>
            <p className="text-xs font-semibold" style={{ color: resolvedTextColor }}>
              Belum ada foto galeri
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* 1. LAYOUT: CLASSIC COLUMN GRID */}
            {layoutTemplate === 'grid' && (
              <div className="w-full">
                {images.length <= 3 ? (
                  <div className={`grid gap-4 sm:gap-8 ${images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : images.length === 2 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'}`}>
                    {renderGridQuoteCard()}
                    {images.map((img, i) => renderGridArtCard(img, i))}
                  </div>
                ) : (
                  <div className={`grid gap-4 sm:gap-8 ${cols === 2 ? 'grid-cols-2 max-w-3xl' : 'grid-cols-2 md:grid-cols-3'} mx-auto`}>
                    {images.map((img, i) => renderGridArtCard(img, i))}
                  </div>
                )}
              </div>
            )}

            {/* 2. LAYOUT: ASYMMETRIC MASONRY */}
            {layoutTemplate === 'masonry' && (
              <div className="w-full">
                {images.length <= 3 ? (
                  <div className={`grid gap-4 sm:gap-8 ${images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : images.length === 2 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'}`}>
                    {renderQuoteCard()}
                    {images.map((img, i) => renderPolaroidCard(img, i))}
                  </div>
                ) : (
                  <div className={`gap-4 sm:gap-8 ${cols === 2 ? 'columns-2 max-w-3xl' : 'columns-2 md:columns-3'} mx-auto`}>
                    {images.map((img, i) => (
                      <div key={i} className="break-inside-avoid mb-4 sm:mb-8">
                        {renderPolaroidCard(img, i, 'aspect-auto')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. LAYOUT: CAROUSEL SLIDER */}
            {layoutTemplate === 'slider' && (
              <div className="relative w-full group">
                {/* Left navigation arrow */}
                <button
                  onClick={() => scrollSlider('left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden md:flex items-center justify-center focus:outline-none"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div
                  ref={sliderRef}
                  className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 sm:py-6 px-2 sm:px-4 scroll-smooth"
                >
                  {images.length <= 3 && (
                    <div className="flex-shrink-0 w-60 sm:w-80 snap-center self-center">
                      {renderFilmQuoteCard()}
                    </div>
                  )}
                  {images.map((img, i) => (
                    <div key={i} className="flex-shrink-0 w-60 sm:w-80 md:w-[340px] snap-center">
                      {renderFilmstripCard(img, i)}
                    </div>
                  ))}
                </div>

                {/* Right navigation arrow */}
                <button
                  onClick={() => scrollSlider('right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden md:flex items-center justify-center focus:outline-none"
                  title="Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* 4. LAYOUT: ARTISTIC MOSAIC COLLAGE */}
            {layoutTemplate === 'grid_mosaic' && (
              <div className="w-full">
                {images.length <= 3 ? (
                  <div className={`grid gap-4 sm:gap-8 ${images.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : images.length === 2 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'}`}>
                    {renderLookbookQuoteCard()}
                    {images.map((img, i) => renderLookbookCard(img, i))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 sm:gap-8 auto-rows-[140px] sm:auto-rows-[250px] md:auto-rows-[300px]">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`${getMosaicClass(i, images.length)} h-full`}
                      >
                        {renderLookbookCard(img, i, true)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── IMMERSIVE FULLSCREEN LIGHTBOX MODAL ── */}
      {activeLightboxIndex !== null && images[activeLightboxIndex] && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center select-none animate-item animate-fade_in">
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50 hover:scale-110 active:scale-95 focus:outline-none"
            title="Tutup"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={() => setActiveLightboxIndex(prev => prev !== null ? (prev - 1 + images.length) % images.length : null)}
            className="absolute left-4 md:left-8 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50 hover:scale-110 active:scale-95 focus:outline-none"
            title="Sebelumnya"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Centered Image */}
          <div className="relative max-w-[85vw] max-h-[80vh] flex items-center justify-center">
            <img
              src={images[activeLightboxIndex]}
              alt={`lightbox-${activeLightboxIndex}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl animate-item animate-zoom_in"
            />
          </div>

          {/* Next button */}
          <button
            onClick={() => setActiveLightboxIndex(prev => prev !== null ? (prev + 1) % images.length : null)}
            className="absolute right-4 md:right-8 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer z-50 hover:scale-110 active:scale-95 focus:outline-none"
            title="Berikutnya"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Counter Indicator */}
          <div className="absolute bottom-6 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-widest shadow-sm">
            {activeLightboxIndex + 1} / {images.length}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
