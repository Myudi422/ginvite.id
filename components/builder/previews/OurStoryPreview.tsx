'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Heart, BookOpen } from 'lucide-react';

interface P {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
}

type StoryItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
};

// ── Overlay helper (hex + opacity%) → hex8 ───────────────────────────────────
function hexWithOpacity(hex: string, pct: number): string {
  let c = hex.trim();
  if (!c.startsWith('#')) c = '#' + c;
  if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  c = c.slice(0, 7);
  return `${c}${Math.round((pct / 100) * 255).toString(16).padStart(2, '0')}`;
}

export default function OurStoryPreview({ props, style }: P) {
  // ── Section props ─────────────────────────────────────────────────────────
  const sectionTitle    = (props.title as string) || 'Kisah Kami';
  const sectionDesc     = (props.description as string) || '';
  const layoutTemplate  = (props.layout_template as string) || 'classic';
  const animationPreset = (props.animation_preset as string) || 'none';

  const items = (props.items as StoryItem[]) || [];

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

  const filterStr = [bgBlur > 0 ? `blur(${bgBlur}px)` : '', bgGray ? 'grayscale(100%)' : ''].filter(Boolean).join(' ') || undefined;

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // ── STYLE BLOCK INJECTION ──
  const styleBlock = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes storyKenburns {
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
      .delay-4 { animation-delay: 750ms; }
      .delay-5 { animation-delay: 950ms; }
    `}} />
  );

  // ── Sub-components for Rendering ─────────────────────────────────────────

  const renderTitle = () => (
    <div className={`text-center space-y-2 mb-6 ${getAnimClass(1)}`}>
      <h2 className="text-2xl font-semibold flex items-center justify-center gap-2"
        style={{ color: textColor, fontFamily: fontHead }}>
        <Heart className="h-5 w-5 shrink-0 animate-pulse" style={{ color: accent, fill: accent + '30' }} />
        {sectionTitle}
      </h2>
      {sectionDesc.trim().length > 0 && (
        <p className="text-xs opacity-80 max-w-md mx-auto leading-relaxed" style={{ color: textColor }}>
          {sectionDesc}
        </p>
      )}
    </div>
  );

  // ── Layout Render Selectors ──────────────────────────────────────────────

  const renderClassic = () => (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      {renderTitle()}
      {items.length > 0 ? (
        <div className={`relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200/60 ${getAnimClass(2)}`}>
          {items.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Dot */}
              <div 
                className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110" 
                style={{ backgroundColor: bgType === 'solid' ? bgSolidColor : '#ffffff', borderColor: accent }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
              </div>
              
              {item.image && (
                <div className="w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-gray-50 border border-gray-100 max-w-md">
                  <img src={item.image} alt={item.title} className="w-full object-cover aspect-video transition-transform duration-500 hover:scale-102" />
                </div>
              )}
              
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: accent }}>{item.date}</p>
                <h3 className="text-sm font-bold" style={{ color: textColor, fontFamily: fontHead }}>{item.title}</h3>
                <p className="text-xs opacity-85 leading-relaxed" style={{ color: textColor }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada kisah.</p>
      )}
    </div>
  );

  const renderCard = () => (
    <div className="space-y-6 w-full max-w-lg mx-auto">
      {renderTitle()}
      {items.length > 0 ? (
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div 
              key={item.id || idx} 
              className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${getAnimClass(2 + idx)}`}
              style={{ borderColor: accent + '20' }}
            >
              {item.image && (
                <div className="w-full aspect-[2/1] overflow-hidden bg-gray-50 border-b border-gray-100/30">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: accent + '1a', color: accent }}>
                    {item.date}
                  </span>
                </div>
                <h3 className="text-base font-bold" style={{ color: textColor, fontFamily: fontHead }}>{item.title}</h3>
                <p className="text-xs opacity-90 leading-relaxed font-medium" style={{ color: textColor }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada kisah.</p>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest block opacity-75" style={{ color: accent }}>
          Perjalanan Cinta Kami
        </span>
        {renderTitle()}
      </div>
      {items.length > 0 ? (
        <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200/60">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="pl-8 relative group">
              {/* Minimal Dot */}
              <div 
                className="absolute left-2.5 top-2 w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover:scale-150" 
                style={{ backgroundColor: accent }}
              />
              <div className="space-y-1">
                <span className="text-[10px] font-mono opacity-60" style={{ color: textColor }}>{item.date}</span>
                <h3 className="text-sm font-bold" style={{ color: textColor, fontFamily: fontHead }}>{item.title}</h3>
                {item.image && (
                  <div className="my-2 rounded-lg overflow-hidden max-w-xs">
                    <img src={item.image} alt={item.title} className="w-full object-cover aspect-video" />
                  </div>
                )}
                <p className="text-xs opacity-75 leading-relaxed" style={{ color: textColor }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada kisah.</p>
      )}
    </div>
  );

  const renderFloating = () => (
    <div className="space-y-6 w-full max-w-lg mx-auto">
      {renderTitle()}
      {items.length > 0 ? (
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div 
              key={item.id || idx} 
              className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 transform hover:-translate-y-1 transition-all duration-300 p-5 ${getAnimClass(2 + idx)}`}
              style={{ borderColor: accent + '20' }}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {item.image && (
                  <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>{item.date}</span>
                  </div>
                  <h3 className="text-sm font-extrabold" style={{ color: textColor, fontFamily: fontHead }}>{item.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-medium" style={{ color: textColor }}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada kisah.</p>
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
    <section className="relative mx-auto overflow-hidden transition-all duration-300 min-h-[220px] py-12 px-6" style={{ backgroundColor: parentBgClr }}>
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
        else if (slideshowAnim === 'zoom') { op = isAct ? 1 : 0; if (isAct) anim = `storyKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`; if (bgBlur > 0) tr = 'scale(1.05)'; }
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
      <div className="relative z-10 w-full flex flex-col justify-center">
        {renderLayout()}
      </div>
    </section>
  );
}
