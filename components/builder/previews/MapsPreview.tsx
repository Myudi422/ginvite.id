'use client';
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function MapsPreview({ props, style }: P) {
  // ── CORE DATA ──
  const label = (props.label as string) || 'Lokasi Acara';
  const layoutTemplate = (props.layout_template as string) || 'modern_card';
  const animationPreset = (props.animation_preset as string) || 'none';

  // On-the-fly migration fallback
  const rawLocations = props.locations as Array<{
    id: string;
    label: string;
    venue_name: string;
    venue_address: string;
    maps_url: string;
    button_text: string;
  }> | undefined;

  const locations = rawLocations && rawLocations.length > 0
    ? rawLocations
    : [
        {
          id: 'default',
          label: label,
          venue_name: (props.venue_name as string) || '',
          venue_address: (props.venue_address as string) || '',
          maps_url: (props.maps_url as string) || '',
          button_text: (props.button_text as string) || 'Buka Google Maps'
        }
      ];

  const accent = (style.accent_color as string) || '#e879a0';

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
  const validSlides = slideshowImages.filter(Boolean);

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

  const isCustomBg = bgType !== 'solid';
  const parentBgColor = bgType === 'solid'
    ? (bgColor || (style.bg_color as string) || '#ffffff')
    : undefined;

  const isBroadLayout = layoutTemplate === 'split_landscape' || layoutTemplate === 'magazine_full';
  const containerMaxWidthClass = isBroadLayout ? 'max-w-4xl' : 'max-w-xl';

  const btnStyle = {
    background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
    boxShadow: `0 4px 14px ${accent}30`,
  };

  const renderLayout = () => {
    switch (layoutTemplate) {
      case 'split_landscape':
        return (
          <div className="space-y-8 w-full">
            {locations.map((loc, idx) => {
              const isEven = idx % 2 === 0;
              const animClass = getAnimClass(idx + 1);
              
              // Decorative visual panel with grid SVGs
              const visualPanel = (
                <div className="w-full md:w-1/2 rounded-3xl overflow-hidden border border-white/40 shadow-lg bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-4 flex items-center justify-center min-h-[220px] relative group hover:shadow-xl transition-all duration-300">
                  {/* Grid network background */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none transition-transform duration-750 group-hover:scale-105" style={{ color: accent }}>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`grid-${loc.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                          <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid-${loc.id})`} />
                    </svg>
                  </div>
                  
                  {/* Subtle radiating accent glow */}
                  <div 
                    className="absolute w-24 h-24 rounded-full blur-2xl opacity-20 animate-pulse pointer-events-none" 
                    style={{ backgroundColor: accent }} 
                  />

                  <div 
                    className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-center select-none z-10"
                    style={{
                      background: `linear-gradient(135deg, ${accent}08, ${accent}15)`,
                      border: `1px dashed ${accent}30`
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-pink-500 animate-bounce relative group-hover:scale-110 transition-transform duration-300" style={{ color: accent }}>
                      <MapPin className="w-8 h-8" />
                      {/* Pulse rings */}
                      <span className="absolute inset-0 rounded-2xl bg-current opacity-20 animate-ping" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">{loc.label}</p>
                      <p className="text-[11px] font-medium text-slate-450 dark:text-slate-400/80">Ketuk navigasi arah untuk rute terdekat</p>
                    </div>
                  </div>
                </div>
              );

              // Detail info panel
              const infoPanel = (
                <div className="w-full md:w-1/2 flex flex-col justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 gap-5 relative overflow-hidden">
                  {/* Accent bar at the top */}
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />
                  
                  <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider" style={{ color: accent }}>
                    <MapPin className="w-4 h-4" />
                    <span>{loc.label}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {loc.venue_name && <h4 className="text-xl font-bold text-slate-800 dark:text-white leading-snug">{loc.venue_name}</h4>}
                    {loc.venue_address && <p className="text-xs text-slate-500 dark:text-slate-300/90 font-medium leading-relaxed">{loc.venue_address}</p>}
                  </div>

                  {loc.maps_url && (
                    <div className="pt-2">
                      <a
                        href={loc.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white hover:scale-[1.03] hover:shadow-lg active:scale-95 transition-all duration-300 focus:outline-none"
                        style={btnStyle}
                      >
                        <MapPin className="w-3.5 h-3.5" /> {loc.button_text || 'Buka Google Maps'}
                      </a>
                    </div>
                  )}
                </div>
              );

              return (
                <div 
                  key={loc.id} 
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-6 w-full ${animClass}`}
                >
                  {visualPanel}
                  {infoPanel}
                </div>
              );
            })}
          </div>
        );

      case 'minimalist':
        return (
          <div className="space-y-4 w-full">
            {locations.map((loc, idx) => (
              <div 
                key={loc.id} 
                className={`w-full border-l-4 border-y border-r border-black/5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getAnimClass(idx + 1)}`}
                style={{ borderLeftColor: accent }}
              >
                <div className="flex gap-4 items-start min-w-0">
                  <div className="p-3 rounded-xl flex-shrink-0 mt-0.5 shadow-sm text-white" style={{ backgroundColor: accent }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: accent }}>
                      {loc.label}
                    </span>
                    {loc.venue_name && <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight mt-1">{loc.venue_name}</h4>}
                    {loc.venue_address && <p className="text-xs text-slate-500 dark:text-slate-350 font-medium leading-normal mt-1">{loc.venue_address}</p>}
                  </div>
                </div>

                {loc.maps_url && (
                  <a
                    href={loc.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white hover:scale-[1.03] active:scale-95 transition-all duration-300 focus:outline-none w-full sm:w-auto text-center"
                    style={btnStyle}
                  >
                    <MapPin className="w-3.5 h-3.5" /> {loc.button_text || 'Buka Google Maps'}
                  </a>
                )}
              </div>
            ))}
          </div>
        );

      case 'magazine_full':
        const magGridClass = locations.length === 1 ? 'max-w-xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
        return (
          <div className={magGridClass}>
            {locations.map((loc, idx) => (
              <div 
                key={loc.id} 
                className={`w-full bg-slate-950/90 text-white backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center text-center gap-6 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 ${getAnimClass(idx + 1)}`}
              >
                {/* Grid network background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-700">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`mag-grid-${loc.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#mag-grid-${loc.id})`} />
                  </svg>
                </div>

                {/* Floating glow */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-500 group-hover:opacity-40" style={{ backgroundColor: accent }} />

                <div className="p-4 rounded-full bg-white/5 text-pink-400 border border-white/10 flex items-center justify-center animate-pulse z-10" style={{ color: accent, borderColor: `${accent}30` }}>
                  <MapPin className="w-6 h-6" />
                </div>
                
                <div className="space-y-3.5 flex-1 flex flex-col justify-center z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest block font-sans" style={{ color: accent }}>
                    {loc.label}
                  </span>
                  {loc.venue_name && <h4 className="text-2xl font-serif text-white leading-snug tracking-wide">{loc.venue_name}</h4>}
                  {loc.venue_address && <p className="text-xs text-white/70 leading-relaxed font-medium max-w-md mx-auto">{loc.venue_address}</p>}
                </div>

                {loc.maps_url && (
                  <div className="pt-2 w-full max-w-xs mt-auto mx-auto z-10">
                    <a
                      href={loc.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white hover:scale-[1.02] active:scale-95 transition-all duration-300 focus:outline-none text-center"
                      style={btnStyle}
                    >
                      <MapPin className="w-4 h-4" /> {loc.button_text || 'Buka Google Maps'}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'modern_card':
      default:
        const gridColsClass = locations.length === 1 ? 'max-w-xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 gap-6 w-full';
        return (
          <div className={gridColsClass}>
            {locations.map((loc, idx) => (
              <div 
                key={loc.id} 
                className={`w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl p-8 flex flex-col items-center text-center gap-6 relative overflow-hidden hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 ${getAnimClass(idx + 1)}`}
              >
                {/* Visual Accent Corner tag */}
                <div className="absolute top-0 right-0 py-1.5 px-4 rounded-bl-2xl text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: accent }}>
                  {loc.label}
                </div>

                <div className="p-3.5 rounded-full flex items-center justify-center relative mt-2" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  <MapPin className="w-6 h-6 animate-pulse" />
                  <span className="absolute inset-0 rounded-full bg-current opacity-10 animate-ping" />
                </div>
                
                <div className="flex flex-col gap-2.5 items-center flex-1">
                  {loc.venue_name && <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">{loc.venue_name}</h4>}
                  {loc.venue_address && <p className="text-xs text-slate-500 dark:text-slate-300 max-w-md font-medium leading-relaxed">{loc.venue_address}</p>}
                </div>

                {loc.maps_url && (
                  <a
                    href={loc.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white hover:scale-[1.03] hover:shadow-lg active:scale-95 transition-all duration-300 focus:outline-none mt-auto"
                    style={btnStyle}
                  >
                    <MapPin className="w-4 h-4" /> {loc.button_text || 'Buka Google Maps'}
                  </a>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

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
        @keyframes mapKenburns {
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
        .delay-2 { animation-delay: 350ms; }
        .delay-3 { animation-delay: 550ms; }
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
            animationStr = `mapKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`;
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
        <p className={`text-center text-xs tracking-widest uppercase font-semibold transition-colors duration-300 ${isCustomBg ? 'text-white/95 drop-shadow-sm' : 'text-gray-400'}`}>
          📍 {label}
        </p>

        {renderLayout()}
      </div>
    </div>
  );
}
