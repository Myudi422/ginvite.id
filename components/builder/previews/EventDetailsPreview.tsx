'use client';
import React, { useEffect, useState } from 'react';
import { MapPinIcon, ClockIcon, CalendarIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function EventDetailsPreview({ props, style }: P) {
  const events = (props.events as Array<Record<string, string>>) || [];
  const accent = style.accent_color as string || '#e879a0';

  // ── BACKGROUND & OVERLAY PROPERTIES ──
  const bgType = props.bg_type as string || 'solid';
  const bgColor = props.bg_color as string || '';
  const bgColor2 = props.bg_color2 as string || '';
  const bgGradientAngle = props.bg_gradient_angle as number ?? 135;
  const bgImage = props.bg_image as string || '';
  const bgImageBlur = props.bg_image_blur as number ?? 0;
  const bgImageGrayscale = props.bg_image_grayscale as boolean ?? false;
  const slideshowImages = (props.bg_slideshow_images as string[]) || [];
  const slideshowAnimation = props.bg_slideshow_animation as string || 'fade';
  const slideshowDuration = props.bg_slideshow_duration as number ?? 5;

  const overlayType = props.overlay_type as string || 'solid';
  const overlayColor = props.overlay_color as string || '#000000';
  const overlayColor2 = props.overlay_color2 as string || '#000000';
  const overlayOpacity = props.overlay_opacity as number ?? 50;
  const overlayOpacity2 = props.overlay_opacity2 as number ?? 0;
  const overlayGradientAngle = props.overlay_gradient_angle as number ?? 180;
  const layoutTemplate = props.layout_template as string || 'classic_list';
  const animationPreset = props.animation_preset as string || 'none';

  // ── SLIDESHOW PLAYBACK ──
  const [activeSlide, setActiveSlide] = useState(0);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % validSlides.length);
    }, slideshowDuration * 1000);
    return () => clearInterval(interval);
  }, [bgType, validSlides.length, slideshowDuration]);

  // Helper to convert hex to hex-alpha
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

  const isCustomBg = bgType !== 'solid';
  const parentBgColor = bgType === 'solid'
    ? (bgColor || (style.bg_color as string) || '#ffffff')
    : undefined;

  // Dynamic colors depending on custom background setting
  const labelColorClass = isCustomBg ? "text-white/90 drop-shadow-md font-medium" : "text-gray-400";
  const textColorClass = isCustomBg ? "text-white/80" : "text-gray-500";
  const noteColorClass = isCustomBg ? "text-white/60 italic" : "text-gray-400 italic";

  const cardBgStyle = isCustomBg 
    ? { background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)' } 
    : { background: accent + '08', borderColor: accent + '33' };
  
  const cardTitleStyle = { 
    color: isCustomBg ? '#ffffff' : accent, 
    fontFamily: `'${style.font_heading}', serif` 
  };

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${Math.min(delayIndex, 6)}`;
  };

  const containerMaxWidth = (layoutTemplate === 'magazine_split' || layoutTemplate === 'compact_grid')
    ? 'max-w-3xl'
    : 'max-w-sm';

  const renderCardContent = (ev: Record<string, string>) => {
    return (
      <>
        <p className="font-bold text-sm" style={cardTitleStyle}>{ev.name || 'Nama Acara'}</p>
        {ev.date && (
          <div className={`flex items-center gap-2 text-xs ${textColorClass}`}>
            <CalendarIcon className="h-3.5 w-3.5" />
            {new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        )}
        {ev.time && (
          <div className={`flex items-center gap-2 text-xs ${textColorClass}`}>
            <ClockIcon className="h-3.5 w-3.5" />
            {ev.time} WIB
          </div>
        )}
        {ev.location && (
          <div className={`flex items-start gap-2 text-xs ${textColorClass}`}>
            <MapPinIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{ev.location}</span>
          </div>
        )}
        {ev.note && <p className={`text-[11px] ${noteColorClass}`}>{ev.note}</p>}
        {ev.maps_link && (
          <a
            href={ev.maps_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl mt-1 shadow-sm transition-all hover:scale-[1.02]"
            style={isCustomBg ? {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            } : {
              backgroundColor: accent + '20',
              color: accent
            }}
          >
            <MapPinIcon className="h-3 w-3" /> Lihat Peta
          </a>
        )}
      </>
    );
  };

  const renderLayoutContent = () => {
    switch (layoutTemplate) {
      case 'magazine_split':
        return (
          <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-stretch text-left py-2">
            <div className={`flex flex-col justify-center md:w-1/3 text-center md:text-left border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 ${isCustomBg ? 'border-white/10' : 'border-gray-200'} ${getAnimClass(1)}`}>
              <span className="text-[9px] uppercase tracking-widest text-pink-500 font-extrabold">Informasi Sesi</span>
              <h3 className={`text-xl font-bold tracking-tight mt-1 leading-snug ${isCustomBg ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: `'${style.font_heading}', serif` }}>Detail Agenda Acara</h3>
              <p className={`text-xs mt-2 ${isCustomBg ? 'text-white/60' : 'text-gray-400'}`}>Kami sangat menantikan kehadiran Anda untuk berbagi kebahagiaan bersama kami di setiap momen spesial ini.</p>
            </div>
            <div className="flex flex-col gap-4 flex-1 w-full">
              {events.map((ev, i) => (
                <div key={ev.id || i} className={`w-full rounded-2xl border p-4 space-y-2 transition-all ${getAnimClass(i + 2)}`} style={cardBgStyle}>
                  {renderCardContent(ev)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'timeline_minimal':
        return (
          <div className="relative w-full pl-6 space-y-6 my-2">
            <div 
              className="absolute left-2 top-2 bottom-2 w-[1.5px] opacity-35" 
              style={{ backgroundColor: isCustomBg ? '#ffffff' : accent }}
            />
            {events.map((ev, i) => (
              <div key={ev.id || i} className={`relative w-full rounded-2xl border p-4 space-y-2 transition-all ${getAnimClass(i + 2)}`} style={cardBgStyle}>
                <div 
                  className="absolute -left-[21.5px] top-[22px] w-2.5 h-2.5 rounded-full border bg-white flex items-center justify-center shadow-sm"
                  style={{ borderColor: accent }}
                >
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} />
                </div>
                {renderCardContent(ev)}
              </div>
            ))}
          </div>
        );

      case 'compact_grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {events.map((ev, i) => (
              <div key={ev.id || i} className={`w-full rounded-2xl border p-4 space-y-2 transition-all ${getAnimClass(i + 2)}`} style={cardBgStyle}>
                {renderCardContent(ev)}
              </div>
            ))}
          </div>
        );

      case 'classic_list':
      default:
        return (
          <div className="flex flex-col gap-4 w-full">
            {events.map((ev, i) => (
              <div key={ev.id || i} className={`w-full rounded-2xl border p-4 space-y-2 transition-all ${getAnimClass(i + 2)}`} style={cardBgStyle}>
                {renderCardContent(ev)}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div
      className="relative py-12 px-6 flex flex-col items-center gap-6 overflow-hidden w-full transition-all duration-300"
      style={{ backgroundColor: parentBgColor }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes countdownKenburns {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.12); }
        }
        @keyframes animFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes animFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes animFadeDown { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes animZoomIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes animTrackingWide { from { opacity: 0; letter-spacing: -0.2em; filter: blur(4px); } to { opacity: 1; } }
        @keyframes animSlideLeft { from { opacity: 0; transform: translateX(-35px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes animSlideRight { from { opacity: 0; transform: translateX(35px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes animBlurReveal { from { opacity: 0; filter: blur(12px); transform: scale(0.96); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
        @keyframes animBounceSoft {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 0.9; transform: scale(1.05); }
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
        .delay-2 { animation-delay: 350ms; }
        .delay-3 { animation-delay: 550ms; }
        .delay-4 { animation-delay: 750ms; }
        .delay-5 { animation-delay: 950ms; }
        .delay-6 { animation-delay: 1150ms; }
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
            animationStr = `countdownKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`;
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

      {/* ── MAIN CONTENT ── */}
      <div className={`relative z-10 flex flex-col items-center gap-6 w-full mx-auto ${containerMaxWidth}`}>
        {layoutTemplate !== 'magazine_split' && (
          <p className={`text-center text-xs tracking-widest uppercase ${labelColorClass} ${getAnimClass(1)}`}>Detail Acara</p>
        )}
        {events.length === 0 && <p className="text-center text-xs text-gray-300 italic">Belum ada acara</p>}
        {renderLayoutContent()}
      </div>
    </div>
  );
}
