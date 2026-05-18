'use client';

import React, { useState, useEffect } from 'react';

interface PreviewProps {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
}

export default function HeroPreview({ props, style }: PreviewProps) {
  const greeting      = props.greeting         as string  || 'The Wedding of';
  const namePrimary   = props.name_primary     as string  || 'Nama Utama';
  const nameSecondary = props.name_secondary   as string  || '';
  const showScrollHint= (props.show_scroll_hint as boolean) ?? true;

  // ── Text Customizer Options ──────────────────────────────────────────────
  const greetingSize  = (props.greeting_size   as number) ?? 12;
  const namesSize     = (props.names_size      as number) ?? 36;
  const textAnim      = props.text_anim        as string  || 'none';
  const textAnimDur   = (props.text_anim_duration as number) ?? 1;
  const alignV        = props.align_vertical   as string  || 'center';
  const alignH        = props.align_horizontal as string  || 'center';

  // ── Background Configuration ─────────────────────────────────────────────
  const bgType        = props.bg_type         as string  ?? 'single';
  const bgImage       = props.bg_image        as string  || '';
  const bgImages      = (props.bg_images      as string[] || []).filter(Boolean);
  const bgSlideEffect = props.bg_slide_effect as string  ?? 'fade';
  const bgSlideSpeed  = (props.bg_slide_speed  as number)  ?? 5;
  const bgBlur        = (props.bg_blur        as number)  ?? 0;
  
  const bgColor       = props.bg_color        as string  || '';
  const bgColor2      = props.bg_color2       as string  || '#9333ea';
  const bgAngle       = (props.bg_angle       as number)  ?? 135;
  const bgSolidColor  = props.bg_solid_color  as string  || '';

  // Slideshow active index state
  const [activeIdx, setActiveIdx] = useState(0);

  // Resolve legacy background type ('single' / 'multi') dynamically
  let resolvedBgType = bgType;
  if (resolvedBgType === 'single') {
    resolvedBgType = bgImage ? 'image' : 'gradient';
  } else if (resolvedBgType === 'multi') {
    resolvedBgType = 'image';
  }

  // Resolve image mode (single photo vs slideshow)
  const bgImageMode = props.bg_image_mode as string || (bgType === 'multi' ? 'multi' : 'single');

  useEffect(() => {
    if (resolvedBgType !== 'image' || bgImageMode !== 'multi' || bgImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % bgImages.length);
    }, bgSlideSpeed * 1000);
    return () => clearInterval(interval);
  }, [resolvedBgType, bgImageMode, bgImages.length, bgSlideSpeed]);

  // ── Height ───────────────────────────────────────────────────────────────
  const rawHeight = props.height as string ?? '480';
  const minHeight = /^\d+$/.test(rawHeight) ? `${rawHeight}px` : rawHeight;

  // ── Border Radius (Melengkung) ───────────────────────────────────────────
  const roundedType = props.rounded_type as string ?? 'all';
  const roundedAll  = (props.rounded_all as number) ?? 0;
  const roundedTL   = (props.rounded_tl as number) ?? 0;
  const roundedTR   = (props.rounded_tr as number) ?? 0;
  const roundedBL   = (props.rounded_bl as number) ?? 0;
  const roundedBR   = (props.rounded_br as number) ?? 0;

  let borderRadius = '0px';
  if (roundedType === 'all') {
    borderRadius = `${roundedAll}px`;
  } else {
    borderRadius = `${roundedTL}px ${roundedTR}px ${roundedBR}px ${roundedBL}px`;
  }

  // ── Overlay ──────────────────────────────────────────────────────────────
  const overlayType    = props.overlay_type    as string  ?? 'solid';
  const overlayOpacity = (props.overlay_opacity as number) ?? 0.4;
  const overlayColor   = props.overlay_color   as string  ?? '#000000';
  const overlayColor2  = props.overlay_color2  as string  ?? '#9333ea';
  const overlayAngle   = (props.overlay_angle  as number) ?? 135;
  const overlayPattern = props.overlay_pattern as string  ?? '';

  // Animation & Transition
  const overlayAnim    = props.overlay_anim    as string  ?? 'none';
  const overlaySpeed   = (props.overlay_speed   as number) ?? 3;

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  let overlayStyle: React.CSSProperties = {
    borderRadius,
    transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease, background 0.5s ease',
  };

  if (overlayType === 'solid') {
    overlayStyle = { 
      ...overlayStyle,
      backgroundColor: hexToRgba(overlayColor, overlayOpacity) 
    };
  } else if (overlayType === 'gradient') {
    const c1 = hexToRgba(overlayColor,  overlayOpacity);
    const c2 = hexToRgba(overlayColor2, overlayOpacity);
    overlayStyle = { 
      ...overlayStyle,
      background: `linear-gradient(${overlayAngle}deg, ${c1} 0%, ${c2} 100%)` 
    };
  } else if (overlayType === 'pattern' && overlayPattern) {
    overlayStyle = {
      ...overlayStyle,
      backgroundImage: `url(${overlayPattern})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: overlayOpacity,
    };
  }

  const animationClassName = overlayAnim !== 'none' ? `hero-overlay-anim-${overlayAnim}` : '';

  // ── Render Background Layers ─────────────────────────────────────────────
  const renderBackgrounds = () => {
    // 1. SOLID COLOR MODE
    if (resolvedBgType === 'solid') {
      const color = bgSolidColor || (style.accent_color as string) || '#e879a0';
      return (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: color,
            borderRadius,
          }}
        />
      );
    }

    // 2. GRADIENT MODE
    if (resolvedBgType === 'gradient') {
      const color1 = bgColor || (style.accent_color as string) || '#e879a0';
      const color2 = bgColor2;
      return (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${bgAngle}deg, ${color1} 0%, ${color2} 100%)`,
            borderRadius,
          }}
        />
      );
    }

    // 3. IMAGE MODE
    if (resolvedBgType === 'image') {
      // 3a. Slideshow (Multi) mode
      if (bgImageMode === 'multi' && bgImages.length > 0) {
        return bgImages.map((imgUrl, idx) => {
          const isActive = idx === activeIdx;
          let slideStyle: React.CSSProperties = {
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius,
          };

          if (bgBlur > 0) {
            slideStyle = {
              ...slideStyle,
              filter: `blur(${bgBlur}px)`,
              transform: 'scale(1.05)',
            };
          }

          if (bgSlideEffect === 'fade') {
            slideStyle = {
              ...slideStyle,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: isActive ? 1 : 0,
            };
          } else if (bgSlideEffect === 'slide') {
            const offset = (idx - activeIdx) * 100;
            slideStyle = {
              ...slideStyle,
              transform: `translateX(${offset}%) ${bgBlur > 0 ? 'scale(1.05)' : ''}`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1,
            };
          } else if (bgSlideEffect === 'zoom') {
            slideStyle = {
              ...slideStyle,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: isActive ? 1 : 0,
            };
          }

          const slideClassName = (bgSlideEffect === 'zoom' && isActive) ? 'animate-ken-burns' : '';

          return (
            <div 
              key={idx}
              className={slideClassName}
              style={slideStyle}
            />
          );
        });
      }

      // 3b. Single Image mode
      if (bgImage) {
        let imageStyle: React.CSSProperties = {
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius,
        };

        if (bgBlur > 0) {
          imageStyle = {
            ...imageStyle,
            filter: `blur(${bgBlur}px)`,
            transform: 'scale(1.05)',
          };
        }

        return <div style={imageStyle} />;
      }
    }

    // Fallback: Default Gradient
    return (
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${style.accent_color || '#e879a0'} 0%, #9333ea 100%)`,
          borderRadius,
        }}
      />
    );
  };

  return (
    <div
      className={`relative flex flex-col overflow-hidden ${
        alignV === 'top' ? 'justify-start pt-20 pb-8' : alignV === 'bottom' ? 'justify-end pt-8 pb-20' : 'justify-center py-16'
      }`}
      style={{ 
        minHeight, 
        borderRadius,
      }}
    >
      {/* Dynamic Keyframes injection */}
      <style>{`
        @keyframes heroOverlayFade {
          from { opacity: 0; }
          to { opacity: ${overlayOpacity}; }
        }
        @keyframes heroOverlayFadeOut {
          from { opacity: ${overlayOpacity}; }
          to { opacity: 0; }
        }
        @keyframes heroOverlayBreath {
          0%, 100% { opacity: ${Math.max(0.05, overlayOpacity * 0.4)}; }
          50% { opacity: ${overlayOpacity}; }
        }
        @keyframes kenBurnsEffect {
          from { transform: scale(1) ${bgBlur > 0 ? 'blur(' + bgBlur + 'px)' : ''}; }
          to { transform: scale(1.15) ${bgBlur > 0 ? 'blur(' + bgBlur + 'px)' : ''}; }
        }
        
        /* Text entrance animations */
        @keyframes textFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes textSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes textZoom {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes textTracking {
          from { opacity: 0; letter-spacing: 0.1em; }
          to { opacity: 1; }
        }

        .hero-overlay-anim-fade {
          animation: heroOverlayFade ${overlaySpeed}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hero-overlay-anim-fade-out {
          animation: heroOverlayFadeOut ${overlaySpeed}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hero-overlay-anim-breath {
          animation: heroOverlayBreath ${overlaySpeed}s ease-in-out infinite;
        }
        .animate-ken-burns {
          animation: kenBurnsEffect ${bgSlideSpeed + 1}s ease-out forwards;
        }

        /* Text Animation Classes */
        .text-anim-fade {
          animation: textFade ${textAnimDur}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .text-anim-slide-up {
          animation: textSlideUp ${textAnimDur}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .text-anim-zoom {
          animation: textZoom ${textAnimDur}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .text-anim-tracking {
          animation: textTracking ${textAnimDur}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Render Latar Belakang */}
      {renderBackgrounds()}

      {/* Overlay (solid / gradient / custom pattern) dengan kelas animasi kustom */}
      {overlayType !== 'none' && (
        <div 
          key={`${overlayType}-${overlayAnim}-${overlaySpeed}-${overlayOpacity}-${activeIdx}`}
          className={`absolute inset-0 ${animationClassName}`} 
          style={{ ...overlayStyle, zIndex: 2 }} 
        />
      )}

      {/* Content Container (Key changes on content, alignment, or anim triggers remount to preview transition instantly) */}
      <div 
        key={`${textAnim}-${textAnimDur}-${greeting}-${namePrimary}-${nameSecondary}-${alignV}-${alignH}`}
        className={`relative flex flex-col gap-4 w-full z-10 ${
          alignH === 'left' ? 'items-start text-left pl-12 pr-6' : alignH === 'right' ? 'items-end text-right pr-12 pl-6' : 'items-center text-center px-8'
        } ${textAnim !== 'none' ? `text-anim-${textAnim}` : ''}`}
      >
        <p 
          className="tracking-[0.3em] text-white/70 uppercase"
          style={{ fontSize: `${greetingSize}px` }}
        >
          {greeting}
        </p>

        <h1
          className="leading-tight text-white font-bold"
          style={{ 
            fontFamily: `'${style.font_heading || 'Playfair Display'}', serif`,
            fontSize: `${namesSize}px`
          }}
        >
          {namePrimary}
          {nameSecondary && (
            <>
              <span 
                className="block text-white/60 my-1 font-normal"
                style={{ fontSize: `${Math.round(namesSize * 0.65)}px` }}
              >
                &amp;
              </span>
              {nameSecondary}
            </>
          )}
        </h1>

        {showScrollHint && (
          <div className="mt-8 flex flex-col items-center gap-1 animate-bounce">
            <div className="w-px h-8 bg-white/40" />
            <span className="text-[10px] text-white/50 tracking-widest">SCROLL</span>
          </div>
        )}
      </div>
    </div>
  );
}
