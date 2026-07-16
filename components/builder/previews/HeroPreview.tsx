'use client';

import React, { useState, useEffect } from 'react';

interface PreviewProps {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
}

export default function HeroPreview({ props, style }: PreviewProps) {
  const typedProps = props as unknown as any;

  const greeting      = typedProps.greeting         || 'The Wedding of';
  const namePrimary   = typedProps.name_primary     || 'Nama Utama';
  const nameSecondary = typedProps.name_secondary   || '';
  const showScrollHint= (typedProps.show_scroll_hint as boolean) ?? true;

  // ── Text Customizer Options ──────────────────────────────────────────────
  const greetingSize  = (typedProps.greeting_size   as number) ?? 12;
  const namesSize     = (typedProps.names_size      as number) ?? 36;
  const textAnim      = typedProps.text_anim        as string  || 'none';
  const textAnimDur   = (typedProps.text_anim_duration as number) ?? 1;
  const alignV        = typedProps.align_vertical   as string  || 'center';
  const alignH        = typedProps.align_horizontal as string  || 'center';

  // ── Height ───────────────────────────────────────────────────────────────
  const rawHeight = typedProps.height as string ?? '480';
  const minHeight = /^\d+$/.test(rawHeight) ? `${rawHeight}px` : rawHeight;

  // ── Border Radius (Melengkung) ───────────────────────────────────────────
  const roundedType = typedProps.rounded_type as string ?? 'all';
  const roundedAll  = (typedProps.rounded_all as number) ?? 0;
  const roundedTL   = (typedProps.rounded_tl as number) ?? 0;
  const roundedTR   = (typedProps.rounded_tr as number) ?? 0;
  const roundedBL   = (typedProps.rounded_bl as number) ?? 0;
  const roundedBR   = (typedProps.rounded_br as number) ?? 0;

  let borderRadius = '0px';
  if (roundedType === 'all') {
    borderRadius = `${roundedAll}px`;
  } else {
    borderRadius = `${roundedTL}px ${roundedTR}px ${roundedBR}px ${roundedBL}px`;
  }

  // ── Unified & Legacy Background Configuration ────────────────────────────
  const bgType = typedProps.bg_type || 'image';
  let resolvedBgType = bgType;
  if (resolvedBgType === 'single') {
    resolvedBgType = typedProps.bg_image ? 'image' : 'solid';
  } else if (resolvedBgType === 'multi') {
    resolvedBgType = 'slideshow';
  }

  const bgColor = typedProps.bg_color || '';
  const bgColor2 = typedProps.bg_color2 || '';
  const bgImage = typedProps.bg_image || '';
  
  // Blur & Grayscale
  const bgImageBlur = typedProps.bg_image_blur ?? (typedProps.bg_blur as number ?? 0);
  const bgImageGrayscale = typedProps.bg_image_grayscale ?? false;

  // Slideshow
  const slideshowImages = typedProps.bg_slideshow_images || (typedProps.bg_images as string[]) || [];
  const slideshowAnimation = typedProps.bg_slideshow_animation || (typedProps.bg_slide_effect as 'fade' | 'zoom' | 'slide') || 'fade';
  const slideshowDuration = typedProps.bg_slideshow_duration ?? (typedProps.bg_slide_speed as number ?? 5);

  const [activeSlide, setActiveSlide] = useState(0);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => {
    if (resolvedBgType !== 'slideshow' && resolvedBgType !== 'multi' && bgType !== 'slideshow') return;
    if (validSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % validSlides.length);
    }, slideshowDuration * 1000);
    return () => clearInterval(interval);
  }, [resolvedBgType, bgType, validSlides.length, slideshowDuration]);

  // ── Unified & Legacy Overlay Configuration ───────────────────────────────
  const overlayType = (typedProps.overlay_type || 'solid') as 'solid' | 'gradient' | 'none' | 'pattern';
  const overlayColor = typedProps.overlay_color || '#000000';
  const overlayColor2 = typedProps.overlay_color2 || '#000000';
  
  const rawOverlayOpacity = typedProps.overlay_opacity ?? 40;
  const overlayOpacity = typeof rawOverlayOpacity === 'number'
    ? (rawOverlayOpacity <= 1 && rawOverlayOpacity > 0 ? rawOverlayOpacity * 100 : rawOverlayOpacity)
    : 40;

  const overlayOpacity2 = typedProps.overlay_opacity2 ?? 0;
  const overlayGradientAngle = typedProps.overlay_gradient_angle ?? (typedProps.overlay_angle as number ?? 180);

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

  // Legacy Animations (Still supported!)
  const overlayAnim = typedProps.overlay_anim as string ?? 'none';
  const overlaySpeed = (typedProps.overlay_speed as number) ?? 3;
  const animationClassName = overlayAnim !== 'none' ? `hero-overlay-anim-${overlayAnim}` : '';

  let overlayStyle: React.CSSProperties = {
    borderRadius,
    transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease, background 0.5s ease',
    pointerEvents: 'none',
  };

  if (overlayType === 'gradient') {
    overlayStyle = {
      ...overlayStyle,
      backgroundImage: `linear-gradient(${overlayGradientAngle}deg, ${getHexWithOpacity(overlayColor, overlayOpacity)}, ${getHexWithOpacity(overlayColor2, overlayOpacity2)})`,
      zIndex: 2,
    };
  } else if ((overlayType as string) === 'pattern' && typedProps.overlay_pattern) {
    overlayStyle = {
      ...overlayStyle,
      backgroundImage: `url(${typedProps.overlay_pattern})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: overlayOpacity / 100,
      zIndex: 2,
    };
  } else {
    overlayStyle = {
      ...overlayStyle,
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100,
      zIndex: 2,
    };
  }

  // ── Render Background Layers ─────────────────────────────────────────────
  const renderBackgrounds = () => {
    // 1. SOLID COLOR MODE
    if (resolvedBgType === 'solid') {
      const color = bgColor || typedProps.bg_solid_color || (style.accent_color as string) || '#e879a0';
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
      const color2 = bgColor2 || typedProps.bg_color2 || '#9333ea';
      const angle = typedProps.bg_angle ?? 135;
      return (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`,
            borderRadius,
          }}
        />
      );
    }

    // 3. IMAGE MODE (SINGLE)
    if (resolvedBgType === 'image' && bgImage) {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            filter: `${bgImageGrayscale ? 'grayscale(100%)' : ''} ${bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : ''}`.trim() || undefined,
            transform: bgImageBlur > 0 ? 'scale(1.1)' : 'scale(1)',
            borderRadius,
          }}
        />
      );
    }

    // 4. SLIDESHOW MODE (MULTI)
    if ((resolvedBgType === 'slideshow' || resolvedBgType === 'image') && validSlides.length > 0) {
      return validSlides.map((slideUrl: string, idx: number) => {
        const isActive = idx === activeSlide;
        const isPrevious = idx === (activeSlide - 1 + validSlides.length) % validSlides.length;
        
        let transformStr = 'scale(1)';
        let opacityVal = 0;
        let animationStr = undefined;
        
        if (slideshowAnimation === 'fade') {
          opacityVal = isActive ? 1 : 0;
          if (bgImageBlur > 0) {
            transformStr = 'scale(1.1)';
          }
        } else if (slideshowAnimation === 'zoom') {
          opacityVal = isActive ? 1 : 0;
          if (isActive) {
            animationStr = `kenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`;
          }
          if (bgImageBlur > 0) {
            transformStr = 'scale(1.1)';
          }
        } else if (slideshowAnimation === 'slide') {
          opacityVal = isActive ? 1 : 0;
          if (isActive) {
            transformStr = bgImageBlur > 0 ? 'translateX(0) scale(1.1)' : 'translateX(0)';
          } else if (isPrevious) {
            transformStr = bgImageBlur > 0 ? 'translateX(-100%) scale(1.1)' : 'translateX(-100%)';
          } else {
            transformStr = bgImageBlur > 0 ? 'translateX(100%) scale(1.1)' : 'translateX(100%)';
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
                : 'opacity 1000ms ease-in-out, transform 1000ms ease-in-out',
              borderRadius,
            }}
          />
        );
      });
    }

    // Fallback: Default Gradient
    return (
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(135deg, ${style.accent_color || '#e879a0'} 0%, #9333ea 100%)`,
          borderRadius,
        }}
      />
    );
  };

  return (
    <div
      className={`relative flex flex-col overflow-hidden w-full min-h-[100dvh] ${
        alignV === 'top' ? 'justify-start pt-24 pb-12' : alignV === 'bottom' ? 'justify-end pt-12 pb-24' : 'justify-center py-20'
      }`}
      style={{ 
        minHeight: minHeight || '100dvh', 
        borderRadius,
      }}
    >
      {/* Dynamic Keyframes injection */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.15); }
        }
        @keyframes heroOverlayFade {
          from { opacity: 0; }
          to { opacity: ${overlayOpacity / 100}; }
        }
        @keyframes heroOverlayFadeOut {
          from { opacity: ${overlayOpacity / 100}; }
          to { opacity: 0; }
        }
        @keyframes heroOverlayBreath {
          0%, 100% { opacity: ${Math.max(0.05, (overlayOpacity / 100) * 0.4)}; }
          50% { opacity: ${overlayOpacity / 100}; }
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
          key={`${overlayType}-${overlayAnim}-${overlaySpeed}-${overlayOpacity}-${activeSlide}`}
          className={`absolute inset-0 ${animationClassName}`} 
          style={overlayStyle} 
        />
      )}

      {/* Content Container (Key changes on content, alignment, or anim triggers remount to preview transition instantly) */}
      <div 
        key={`${textAnim}-${textAnimDur}-${greeting}-${namePrimary}-${nameSecondary}-${alignV}-${alignH}`}
        className={`relative flex flex-col gap-5 w-full z-10 ${
          alignH === 'left' ? 'items-start text-left pl-12 pr-6' : alignH === 'right' ? 'items-end text-right pr-12 pl-6' : 'items-center text-center px-8'
        } ${textAnim !== 'none' ? `text-anim-${textAnim}` : ''}`}
      >
        <p 
          className="tracking-[0.3em] text-white/70 uppercase font-semibold"
          style={{ fontSize: `calc(${greetingSize}px * 1.25)` }}
        >
          {greeting}
        </p>

        <h1
          className="leading-tight text-white font-extrabold"
          style={{ 
            fontFamily: `'${style.font_heading || 'Playfair Display'}', serif`,
            fontSize: `calc(${namesSize}px * 1.25)`
          }}
        >
          {namePrimary}
          {nameSecondary && (
            <>
              <span 
                className="block text-white/60 my-2 font-normal"
                style={{ fontSize: `calc(${Math.round(namesSize * 0.65)}px * 1.2)` }}
              >
                &amp;
              </span>
              {nameSecondary}
            </>
          )}
        </h1>

        {showScrollHint && (
          <div className="mt-12 flex flex-col items-center gap-2 animate-bounce">
            <div className="w-px h-12 bg-white/40" />
            <span className="text-xs text-white/50 tracking-widest font-semibold">SCROLL DOWN</span>
          </div>
        )}
      </div>
    </div>
  );
}
