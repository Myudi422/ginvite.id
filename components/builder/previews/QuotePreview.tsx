'use client';

import React, { useState, useEffect } from 'react';

interface P {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
}

// ── Overlay helper (hex + opacity%) → hex8 ───────────────────────────────────
function hexWithOpacity(hex: string, pct: number): string {
  let c = hex.trim();
  if (!c.startsWith('#')) c = '#' + c;
  if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  c = c.slice(0, 7);
  return `${c}${Math.round((pct / 100) * 255).toString(16).padStart(2, '0')}`;
}

export default function QuotePreview({ props, style }: P) {
  const text            = (props.text as string) || '';
  const source          = (props.source as string) || '';
  const layoutTemplate  = (props.layout_template as string) || 'classic';
  const animationPreset = (props.animation_preset as string) || 'none';

  // ── Style tokens ──────────────────────────────────────────────────────────
  const accent    = (style.accent_color as string) || '#e879a0';
  const textColor = (style.text_color as string)   || '#333333';
  const bgColor   = (style.bg_color as string)     || '#ffffff';
  const fontBody  = (style.font_body as string)    || 'inherit';
  const fontHead  = (style.font_heading as string) || fontBody;

  // ── Background props ──────────────────────────────────────────────────────
  const bgType            = (props.bg_type as string)                     || 'solid';
  const bgSolidColor      = (props.bg_color as string)                    || bgColor;
  const bgColor2          = (props.bg_color2 as string)                   || '#feb47b';
  const bgGradAngle       = Number(props.bg_gradient_angle ?? 135);
  const bgImage           = (props.bg_image as string)                    || '';
  const bgBlur            = Number(props.bg_image_blur ?? 0);
  const bgGray            = Boolean(props.bg_image_grayscale);
  const slideshowImages   = (props.bg_slideshow_images as string[])       || [];
  const slideshowAnim     = (props.bg_slideshow_animation as string)      || 'fade';
  const slideshowDuration = Number(props.bg_slideshow_duration ?? 5);

  const overlayType   = (props.overlay_type as string)   || 'solid';
  const overlayColor  = (props.overlay_color as string)  || '#000000';
  const overlayColor2 = (props.overlay_color2 as string) || '#000000';
  const overlayOp     = Number(props.overlay_opacity  ?? 50);
  const overlayOp2    = Number(props.overlay_opacity2 ?? 0);
  const overlayAngle  = Number(props.overlay_gradient_angle ?? 180);

  const isCustomBg   = bgType !== 'solid';
  const parentBgClr  = bgType === 'solid' ? (bgSolidColor || bgColor) : undefined;
  const validSlides  = slideshowImages.filter(Boolean);

  // ── Slideshow state ───────────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const t = setInterval(() => setActiveSlide(p => (p + 1) % validSlides.length), slideshowDuration * 1000);
    return () => clearInterval(t);
  }, [bgType, validSlides.length, slideshowDuration]);

  if (!text) return null;

  const filterStr = [bgBlur > 0 ? `blur(${bgBlur}px)` : '', bgGray ? 'grayscale(100%)' : ''].filter(Boolean).join(' ') || undefined;

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // ── STYLE BLOCK INJECTION ──
  const styleBlock = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes quoteKenburns {
        0% { transform: scale(1.05); }
        100% { transform: scale(1.15); }
      }
      @keyframes qAnimFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes qAnimFadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes qAnimFadeDown {
        from { opacity: 0; transform: translateY(-28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes qAnimZoomIn {
        from { opacity: 0; transform: scale(0.93); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes qAnimTrackingWide {
        from { opacity: 0; letter-spacing: -0.2em; filter: blur(4px); }
        to { opacity: 1; }
      }
      @keyframes qAnimSlideLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes qAnimSlideRight {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes qAnimBlurReveal {
        from { opacity: 0; filter: blur(14px); transform: scale(0.95); }
        to { opacity: 1; filter: blur(0); transform: scale(1); }
      }
      @keyframes qAnimBounceSoft {
        0% { opacity: 0; transform: scale(0.5); }
        60% { opacity: 0.95; transform: scale(1.04); }
        100% { opacity: 1; transform: scale(1); }
      }

      .animate-item {
        opacity: 0;
        animation-fill-mode: forwards !important;
      }
      .animate-fade_in { animation: qAnimFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade_up { animation: qAnimFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade_down { animation: qAnimFadeDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-zoom_in { animation: qAnimZoomIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      .animate-tracking_wide { animation: qAnimTrackingWide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-slide_left { animation: qAnimSlideLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-slide_right { animation: qAnimSlideRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-blur_reveal { animation: qAnimBlurReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-bounce_soft { animation: qAnimBounceSoft 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

      .delay-1 { animation-delay: 150ms; }
      .delay-2 { animation-delay: 350ms; }
      .delay-3 { animation-delay: 550ms; }
    `}} />
  );

  // ── Layout Render Selectors ──────────────────────────────────────────────

  const renderClassic = () => (
    <div className="py-16 px-8 flex flex-col items-center gap-4 text-center max-w-xl mx-auto">
      <span className={`text-6xl font-serif leading-none select-none ${getAnimClass(1)}`} style={{ color: accent + '40' }}>“</span>
      <p
        className={`text-base italic leading-relaxed font-medium ${getAnimClass(2)}`}
        style={{ fontFamily: `'${fontHead}', serif`, color: textColor }}
      >
        {text}
      </p>
      {source && (
        <p className={`text-xs opacity-75 font-semibold tracking-wide ${getAnimClass(3)}`} style={{ color: textColor }}>
          — {source}
        </p>
      )}
    </div>
  );

  const renderCard = () => (
    <div className={`max-w-lg mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl p-8 space-y-4 text-center ${getAnimClass(1)}`}>
      <span className="text-5xl font-serif leading-none select-none block" style={{ color: accent + '40' }}>“</span>
      <p
        className="text-base italic leading-relaxed font-medium"
        style={{ fontFamily: `'${fontHead}', serif`, color: textColor }}
      >
        {text}
      </p>
      {source && (
        <p className="text-xs opacity-75 border-t border-gray-150/40 pt-3 mt-3 font-semibold tracking-wide" style={{ color: textColor }}>
          — {source}
        </p>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className={`max-w-xl mx-auto py-12 px-6 border-l-4 text-left space-y-3 pl-6 ${getAnimClass(1)}`} style={{ borderColor: accent }}>
      <p
        className="text-base italic leading-relaxed font-medium"
        style={{ fontFamily: `'${fontHead}', serif`, color: textColor }}
      >
        {text}
      </p>
      {source && (
        <p className="text-xs tracking-wider uppercase font-bold opacity-75" style={{ color: accent }}>
          — {source}
        </p>
      )}
    </div>
  );

  const renderFloating = () => (
    <div className={`max-w-xl mx-auto py-14 px-8 text-center relative border-y-2 py-8 my-4 ${getAnimClass(1)}`} style={{ borderColor: accent + '33' }}>
      <span
        className="absolute -top-5 left-1/2 -translate-x-1/2 px-3 text-3xl font-serif select-none"
        style={{ backgroundColor: bgSolidColor || bgColor, color: accent }}
      >
        “
      </span>
      <p
        className="text-base italic leading-relaxed font-medium"
        style={{ fontFamily: `'${fontHead}', serif`, color: textColor }}
      >
        {text}
      </p>
      {source && (
        <p className="text-xs opacity-80 mt-4 font-semibold tracking-wide" style={{ color: textColor }}>
          — {source}
        </p>
      )}
    </div>
  );

  const renderLayout = () => {
    switch (layoutTemplate) {
      case 'card':
        return renderCard();
      case 'minimal':
        return renderMinimal();
      case 'floating':
        return renderFloating();
      case 'classic':
      default:
        return renderClassic();
    }
  };

  return (
    <section className="relative mx-auto overflow-hidden transition-all duration-300 min-h-[220px]" style={{ backgroundColor: parentBgClr }}>
      {/* ── STYLE BLOCK INJECTION ── */}
      {styleBlock}

      {/* ── Background layers ── */}
      {bgType === 'gradient' && (
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${bgGradAngle}deg, ${bgSolidColor}, ${bgColor2})` }} />
      )}
      {bgType === 'image' && bgImage && (
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-300" style={{ backgroundImage: `url(${bgImage})`, filter: filterStr, transform: bgBlur > 0 ? 'scale(1.05)' : undefined }} />
      )}
      {bgType === 'slideshow' && validSlides.map((s, i) => {
        const isAct  = i === activeSlide;
        const isPrev = i === (activeSlide - 1 + validSlides.length) % validSlides.length;
        let tr = 'scale(1)', op = 0, anim: string | undefined;
        if (slideshowAnim === 'fade') { op = isAct ? 1 : 0; if (bgBlur > 0) tr = 'scale(1.05)'; }
        else if (slideshowAnim === 'zoom') { op = isAct ? 1 : 0; if (isAct) anim = `quoteKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`; if (bgBlur > 0) tr = 'scale(1.05)'; }
        else if (slideshowAnim === 'slide') { op = isAct ? 1 : 0; tr = isAct ? 'translateX(0)' : isPrev ? 'translateX(-100%)' : 'translateX(100%)'; if (bgBlur > 0) tr += ' scale(1.05)'; }
        return (
          <div key={i} className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s})`, opacity: op, transform: tr, animation: anim, filter: filterStr, transition: 'opacity 1s ease-in-out, transform 1s ease-in-out' }} />
        );
      })}

      {/* ── Overlay ── */}
      {isCustomBg && (
        overlayType === 'gradient'
          ? <div className="absolute inset-0 z-[1]" style={{ backgroundImage: `linear-gradient(${overlayAngle}deg, ${hexWithOpacity(overlayColor, overlayOp)}, ${hexWithOpacity(overlayColor2, overlayOp2)})` }} />
          : <div className="absolute inset-0 z-[1]" style={{ backgroundColor: overlayColor, opacity: overlayOp / 100 }} />
      )}

      {/* ── Content ── */}
      <div className="relative z-10 p-6 w-full flex flex-col justify-center">
        {renderLayout()}
      </div>
    </section>
  );
}
