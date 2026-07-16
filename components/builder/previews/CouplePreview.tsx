'use client';

import React, { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';

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

export default function CouplePreview({ props, style }: P) {
  const pA = (props.person_a as Record<string, string>) || {};
  const pB = (props.person_b as Record<string, string>) || {};
  
  // ── Style tokens ──────────────────────────────────────────────────────────
  const accent = (style.accent_color as string) || '#e879a0';
  const textColor = (style.text_color as string) || '#333333';
  const bgSectionColor = (style.bg_color as string) || '#ffffff';
  const fontBody = (style.font_body as string) || 'inherit';
  const fontHead = (style.font_heading as string) || fontBody;

  // ── Section configurations ────────────────────────────────────────────────
  const layout = (props.layout as string) || 'side_by_side';
  const layoutTemplate = (props.layout_template as string) || 'classic';
  const animationPreset = (props.animation_preset as string) || 'none';

  // ── Background props ──────────────────────────────────────────────────────
  const bgType            = (props.bg_type as string)                     || 'solid';
  const bgSolidColor      = (props.bg_color as string)                    || bgSectionColor;
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
  const parentBgClr  = bgType === 'solid' ? (bgSolidColor || bgSectionColor) : undefined;
  const validSlides  = slideshowImages.filter(Boolean);

  // ── Slideshow state ───────────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const t = setInterval(() => setActiveSlide(p => (p + 1) % validSlides.length), slideshowDuration * 1000);
    return () => clearInterval(t);
  }, [bgType, validSlides.length, slideshowDuration]);

  // ── Helper to determine active profile data ──
  const hasA = !!(pA.name?.trim() || pA.nickname?.trim() || pA.photo?.trim());
  const hasB = !!(pB.name?.trim() || pB.nickname?.trim() || pB.photo?.trim());

  // If both empty, show both as builder default placeholder
  const showA = hasA || (!hasA && !hasB);
  const showB = hasB || (!hasA && !hasB);
  const isSingle = (hasA && !hasB) || (hasB && !hasA);

  const filterStr = [bgBlur > 0 ? `blur(${bgBlur}px)` : '', bgGray ? 'grayscale(100%)' : ''].filter(Boolean).join(' ') || undefined;

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // ── STYLE BLOCK INJECTION ──
  const styleBlock = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes coupleKenburns {
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
  );

  function Avatar({ person, label, isMinimalLayout = false }: { person: Record<string, string>; label?: string; isMinimalLayout?: boolean }) {
    return (
      <div 
        className={`flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl border transition-all duration-300 shadow-md hover:scale-[1.02] hover:shadow-lg w-full max-w-sm mx-auto backdrop-blur-sm ${
          isMinimalLayout 
            ? 'border-gray-150/40 bg-transparent shadow-none hover:scale-100 hover:shadow-none p-4' 
            : ''
        }`}
        style={isMinimalLayout ? {} : {
          backgroundColor: bgSectionColor + '90',
          borderColor: accent + '20',
        }}
      >
        {label && (
          <span 
            className="text-xs sm:text-sm font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 inline-block animate-pulse"
            style={{ backgroundColor: accent + '15', color: accent }}
          >
            {label}
          </span>
        )}
        <div 
          className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 shadow-xl shrink-0 transition-transform duration-500 hover:rotate-2 mb-5"
          style={{ borderColor: accent + '44' }}
        >
          {person.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={person.photo} alt={person.name || 'Foto'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: accent + '10', color: accent }}>
              👤
            </div>
          )}
        </div>
        <div className="space-y-2.5 w-full">
          <p className="text-xs sm:text-sm uppercase tracking-widest font-extrabold opacity-60" style={{ color: textColor }}>
            {person.nickname || 'Panggilan'}
          </p>
          <p className="font-extrabold text-xl sm:text-2xl" style={{ color: textColor, fontFamily: fontHead }}>
            {person.name || 'Nama Lengkap'}
          </p>
          
          {(person.parent_father || person.parent_mother) && (
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed pt-2" style={{ color: textColor }}>
              Putra/i dari:<br />
              <span className="font-semibold">Bpk. {person.parent_father || '-'}</span>
              <br />&<br />
              <span className="font-semibold">Ibu {person.parent_mother || '-'}</span>
            </p>
          )}

          {person.instagram && (
            <div className="pt-3">
              <a
                href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-pink-500 hover:text-pink-600 bg-pink-500/10 hover:bg-pink-500/20 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
                style={{ color: accent, backgroundColor: accent + '15' }}
              >
                <Instagram className="w-4 h-4" />
                @{person.instagram.replace('@', '')}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Renders ─────────────────────────────────────────────────────────────────

  const renderSingle = (isMinimal: boolean = false) => {
    const activePerson = hasA ? pA : pB;
    const label = hasA ? 'Mempelai Pria' : 'Mempelai Wanita';
    return (
      <div className="w-full max-w-sm mx-auto flex justify-center py-4">
        <Avatar person={activePerson} label={label} isMinimalLayout={isMinimal} />
      </div>
    );
  };

  const renderSideBySide = (isMinimal: boolean = false) => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full max-w-3xl sm:max-w-4xl mx-auto">
      {showA && <Avatar person={pA} label="Mempelai Pria" isMinimalLayout={isMinimal} />}
      
      {!isSingle && (
        <div className="flex flex-col items-center justify-center shrink-0 py-2">
          <span className="text-4xl sm:text-5xl animate-pulse" style={{ color: accent }}>
            ♥
          </span>
        </div>
      )}

      {showB && <Avatar person={pB} label="Mempelai Wanita" isMinimalLayout={isMinimal} />}
    </div>
  );

  const renderStacked = (isMinimal: boolean = false) => (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto">
      {showA && <Avatar person={pA} label="Mempelai Pria" isMinimalLayout={isMinimal} />}
      
      {!isSingle && (
        <div className="flex items-center justify-center py-1">
          <span className="text-3xl opacity-40 shrink-0" style={{ color: accent }}>
            ─── ♥ ───
          </span>
        </div>
      )}

      {showB && <Avatar person={pB} label="Mempelai Wanita" isMinimalLayout={isMinimal} />}
    </div>
  );

  const renderLayout = (isMinimal: boolean = false) => {
    if (isSingle) return renderSingle(isMinimal);
    return layout === 'stacked' ? renderStacked(isMinimal) : renderSideBySide(isMinimal);
  };

  // ── Layout Render Selectors ──
  const renderClassic = () => (
    <div className={`space-y-8 w-full max-w-3xl sm:max-w-4xl mx-auto ${getAnimClass(2)}`}>
      {renderLayout(false)}
    </div>
  );

  const renderCard = () => (
    <div className={`w-full max-w-3xl sm:max-w-4xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl p-8 md:p-14 ${getAnimClass(1)}`}>
      {renderLayout(false)}
    </div>
  );

  const renderMinimal = () => (
    <div className={`space-y-8 w-full max-w-3xl sm:max-w-4xl mx-auto ${getAnimClass(2)}`}>
      {renderLayout(true)}
    </div>
  );

  const renderFloating = () => (
    <div className={`space-y-8 w-full max-w-3xl sm:max-w-4xl mx-auto ${getAnimClass(2)}`}>
      <div className="hover:-translate-y-1.5 transition-transform duration-300">
        {renderLayout(false)}
      </div>
    </div>
  );

  const selectLayout = () => {
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
    <section className="relative mx-auto overflow-hidden transition-all duration-300 min-h-[300px] w-full" style={{ backgroundColor: parentBgClr }}>
      {/* STYLE BLOCK INJECTION */}
      {styleBlock}

      {/* ── Background layers ── */}
      {bgType === 'gradient' && (
        <div className="absolute inset-0 animate-item" style={{ backgroundImage: `linear-gradient(${bgGradAngle}deg, ${bgSolidColor}, ${bgColor2})`, opacity: 1 }} />
      )}
      {bgType === 'image' && bgImage && (
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-300" style={{ backgroundImage: `url(${bgImage})`, filter: filterStr, transform: bgBlur > 0 ? 'scale(1.05)' : undefined }} />
      )}
      {bgType === 'slideshow' && validSlides.map((s, i) => {
        const isAct  = i === activeSlide;
        const isPrev = i === (activeSlide - 1 + validSlides.length) % validSlides.length;
        let tr = 'scale(1)', op = 0, anim: string | undefined;
        if (slideshowAnim === 'fade') { op = isAct ? 1 : 0; if (bgBlur > 0) tr = 'scale(1.05)'; }
        else if (slideshowAnim === 'zoom') { op = isAct ? 1 : 0; if (isAct) anim = `coupleKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`; if (bgBlur > 0) tr = 'scale(1.05)'; }
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
      <div className="relative z-10 py-20 sm:py-28 px-6 w-full min-h-[60dvh] flex flex-col justify-center">
        {/* Decorative top header */}
        <div className={`text-center space-y-2.5 mb-12 ${getAnimClass(1)}`}>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest block opacity-65" style={{ color: accent }}>
            Profil Pasangan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: textColor, fontFamily: fontHead }}>
            Mempelai
          </h2>
        </div>

        {selectLayout()}
      </div>
    </section>
  );
}
