'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function GalleryPreview({ props, style }: P) {
  // ── CORE DATA ──
  const images = (props.images as string[]) || [];
  const cols = Number(props.columns) || 3;
  const layoutTemplate = (props.layout_template as string) || 'grid';
  const animationPreset = (props.animation_preset as string) || 'none';

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
    if (total === 1) return 'col-span-3 row-span-2 aspect-video';
    if (total === 2) {
      if (idx === 0) return 'col-span-2 row-span-1 aspect-[4/3]';
      return 'col-span-1 row-span-1 aspect-square';
    }
    if (total === 3) {
      if (idx === 0) return 'col-span-2 row-span-2 aspect-square';
      return 'col-span-1 row-span-1 aspect-square';
    }
    if (total === 4) {
      if (idx === 0) return 'col-span-2 row-span-2 aspect-square';
      if (idx === 3) return 'col-span-3 row-span-1 aspect-[2.5/1]';
      return 'col-span-1 row-span-1 aspect-square';
    }
    if (total === 5) {
      if (idx === 0) return 'col-span-2 row-span-2 aspect-square';
      if (idx === 3) return 'col-span-1 row-span-1 aspect-square';
      if (idx === 4) return 'col-span-2 row-span-1 aspect-[2/1]';
      return 'col-span-1 row-span-1 aspect-square';
    }
    // For 6 photos
    if (idx === 0) return 'col-span-2 row-span-2 aspect-square';
    if (idx === 4) return 'col-span-2 row-span-1 aspect-[2/1]';
    if (idx === 5) return 'col-span-3 row-span-1 aspect-[3/1]';
    return 'col-span-1 row-span-1 aspect-square';
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Background and Canvas styles
  const isCustomBg = bgType !== 'solid';
  const parentBgColor = bgType === 'solid'
    ? (bgColor || (style.bg_color as string) || '#ffffff')
    : undefined;

  const isBroadLayout = layoutTemplate === 'slider' || layoutTemplate === 'grid_mosaic';
  const containerMaxWidthClass = isBroadLayout ? 'max-w-4xl' : 'max-w-2xl';

  return (
    <div
      className="relative py-16 px-4 overflow-hidden w-full transition-all duration-300 min-h-[300px] flex items-center justify-center"
      style={{
        backgroundColor: parentBgColor,
      }}
    >
      {/* ── STYLE BLOCK INJECTION ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
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

      {/* ── MAIN CONTENT CANVAS ── */}
      <div className={`relative z-10 flex flex-col items-center gap-6 w-full mx-auto ${containerMaxWidthClass}`}>
        <p className={`text-center text-xs tracking-widest uppercase font-semibold transition-colors duration-300 ${isCustomBg ? 'text-white/90 drop-shadow-sm' : 'text-gray-400'}`}>
          Galeri Foto
        </p>

        {images.length === 0 ? (
          <div className="w-full max-w-xl border-2 border-dashed border-gray-300/40 rounded-3xl py-12 flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm shadow-sm">
            <span className="text-4xl animate-bounce">🖼️</span>
            <p className={`text-xs font-semibold ${isCustomBg ? 'text-white/80' : 'text-gray-400'}`}>
              Belum ada foto galeri
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* 1. LAYOUT: CLASSIC COLUMN GRID */}
            {layoutTemplate === 'grid' && (
              <div className={`grid gap-4 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveLightboxIndex(i)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100 shadow-sm border border-black/5 hover:scale-[1.03] hover:shadow-lg hover:border-black/10 transition-all duration-300 group ${getAnimClass(i + 1)}`}
                  >
                    <img
                      src={img}
                      alt={`gallery-${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 2. LAYOUT: ASYMMETRIC MASONRY */}
            {layoutTemplate === 'masonry' && (
              <div className={`gap-4 ${cols === 2 ? 'columns-2' : 'columns-3'}`}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveLightboxIndex(i)}
                    className={`break-inside-avoid mb-4 rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100 shadow-sm border border-black/5 hover:scale-[1.02] hover:shadow-md hover:border-black/10 transition-all duration-300 group ${getAnimClass(i + 1)}`}
                  >
                    <img
                      src={img}
                      alt={`gallery-${i}`}
                      className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 3. LAYOUT: CAROUSEL SLIDER */}
            {layoutTemplate === 'slider' && (
              <div className="relative w-full group">
                {/* Left navigation arrow */}
                <button
                  onClick={() => scrollSlider('left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden md:flex items-center justify-center focus:outline-none"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div
                  ref={sliderRef}
                  className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 scroll-smooth"
                >
                  {images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveLightboxIndex(i)}
                      className={`flex-shrink-0 w-64 md:w-72 aspect-[4/3] rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100 snap-center shadow-md border border-black/5 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 group ${getAnimClass(i + 1)}`}
                    >
                      <img
                        src={img}
                        alt={`gallery-${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Right navigation arrow */}
                <button
                  onClick={() => scrollSlider('right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hidden md:flex items-center justify-center focus:outline-none"
                  title="Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* 4. LAYOUT: ARTISTIC MOSAIC COLLAGE */}
            {layoutTemplate === 'grid_mosaic' && (
              <div className="grid grid-cols-3 gap-4 auto-rows-[130px] sm:auto-rows-[170px] md:auto-rows-[210px]">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveLightboxIndex(i)}
                    className={`${getMosaicClass(i, images.length)} rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100 shadow-sm border border-black/5 hover:scale-[1.02] hover:shadow-md transition-all duration-300 group ${getAnimClass(i + 1)}`}
                  >
                    <img
                      src={img}
                      alt={`gallery-${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
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
