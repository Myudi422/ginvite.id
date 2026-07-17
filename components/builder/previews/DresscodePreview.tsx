'use client';

import React, { useState, useEffect } from 'react';
import { FaShirt } from 'react-icons/fa6'; // Or another icon
import { Shirt } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface P {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
}

type DresscodeItem = {
  id: string;
  name: string;
  description: string;
  colors: string[];
  image?: string;
};

// ── Overlay helper (hex + opacity%) → hex8 ───────────────────────────────────
function hexWithOpacity(hex: string, pct: number): string {
  let c = hex.trim();
  if (!c.startsWith('#')) c = '#' + c;
  if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  c = c.slice(0, 7);
  return `${c}${Math.round((pct / 100) * 255).toString(16).padStart(2, '0')}`;
}

export default function DresscodePreview({ props, style }: P) {
  // ── Section props ─────────────────────────────────────────────────────────
  const enabled         = (props.enabled as boolean) ?? false;
  const sectionTitle    = (props.title as string) || 'Dress Code';
  const sectionDesc     = (props.description as string) || '';
  const layoutTemplate  = (props.layout_template as string) || 'classic';
  const animationPreset = (props.animation_preset as string) || 'none';

  const items = (props.items as DresscodeItem[]) || [];

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

  if (!enabled) return null;

  const filterStr = [bgBlur > 0 ? `blur(${bgBlur}px)` : '', bgGray ? 'grayscale(100%)' : ''].filter(Boolean).join(' ') || undefined;

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // ── STYLE BLOCK INJECTION ──
  const styleBlock = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes dresscodeKenburns {
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

  // ── Sub-components for Rendering ─────────────────────────────────────────

  const renderTitle = () => (
    <div className={`text-center space-y-3 mb-8 ${getAnimClass(1)}`}>
      <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-2.5"
        style={{ color: textColor, fontFamily: fontHead }}>
        <Shirt className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 animate-bounce-slow" style={{ color: accent }} />
        {sectionTitle}
      </h2>
      {sectionDesc.trim().length > 0 && (
        <p className="text-sm sm:text-base opacity-80 max-w-lg mx-auto leading-relaxed" style={{ color: textColor }}>
          {sectionDesc}
        </p>
      )}
    </div>
  );

  // Sub-component: Renders each category dresscode item details
  const renderItemCard = (item: DresscodeItem, idx: number, isMinimalLayout: boolean = false) => {
    return (
      <div
        key={item.id || idx}
        className={`flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 shadow-md ${
          isMinimalLayout 
            ? 'border-gray-150/40 bg-transparent shadow-none' 
            : 'hover:scale-[1.02] hover:shadow-lg'
        }`}
        style={isMinimalLayout ? {} : {
          backgroundColor: bgColor + '90',
          borderColor: accent + '30',
        }}
      >
        {/* Attire Sketch/Image */}
        {item.image && (
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-gray-50 border border-gray-100 relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name || 'Contoh Pakaian'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="space-y-4 w-full">
          {/* Category title */}
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full inline-block"
            style={{ backgroundColor: accent + '1a', color: accent }}>
            {item.name || 'Kategori'}
          </span>

          {/* Palette Swatches */}
          {item.colors && item.colors.length > 0 && (
            <div className="flex justify-center items-center gap-3 py-1">
              {item.colors.map((color, cIdx) => (
                <div
                  key={cIdx}
                  className="w-9 h-9 rounded-full border border-black/10 shadow-sm relative group shrink-0"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {/* Tooltip to show hex code on hover */}
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-mono text-white bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-sm sm:text-base opacity-90 leading-relaxed font-medium" style={{ color: textColor }}>
            {item.description}
          </p>
        </div>
      </div>
    );
  };

  // ── Layout Render Selectors ──────────────────────────────────────────────

  const renderClassic = () => (
    <div className="space-y-6 w-full max-w-2xl sm:max-w-3xl mx-auto">
      {renderTitle()}
      {items.length > 0 ? (
        <div className={`grid grid-cols-1 ${items.length === 1 ? 'max-w-md mx-auto' : 'sm:grid-cols-2'} gap-8 ${getAnimClass(2)}`}>
          {items.map((item, idx) => renderItemCard(item, idx))}
        </div>
      ) : (
        <p className="text-sm opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada data dresscode.</p>
      )}
    </div>
  );

  const renderCard = () => (
    <div className={`w-full ${items.length === 1 ? 'max-w-md' : 'max-w-xl sm:max-w-2xl'} mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl p-8 sm:p-12 space-y-6 ${getAnimClass(1)}`}>
      {renderTitle()}
      <div className="w-full border-t border-gray-100 dark:border-gray-800 my-1" />
      {items.length > 0 ? (
        <div className={`grid grid-cols-1 ${items.length === 1 ? '' : 'sm:grid-cols-2'} gap-6`}>
          {items.map((item, idx) => renderItemCard(item, idx))}
        </div>
      ) : (
        <p className="text-sm opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada data dresscode.</p>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className={`space-y-6 w-full ${items.length === 1 ? 'max-w-sm' : 'max-w-xl sm:max-w-2xl'} mx-auto`}>
      <div className="text-center space-y-1">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest block opacity-75" style={{ color: accent }}>
          Ketentuan Busana
        </span>
        {renderTitle()}
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 divide-y divide-gray-150/40">
          {items.map((item, idx) => (
            <div key={item.id || idx} className={idx > 0 ? 'pt-6' : ''}>
              {renderItemCard(item, idx, true)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada data dresscode.</p>
      )}
    </div>
  );

  const renderFloating = () => (
    <div className="space-y-6 w-full max-w-xl sm:max-w-2xl mx-auto">
      {renderTitle()}
      {items.length > 0 ? (
        <div className={`grid grid-cols-1 ${items.length === 1 ? 'max-w-md mx-auto' : 'sm:grid-cols-2'} gap-8`}>
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 transform hover:-translate-y-1.5 transition-transform duration-300 ${getAnimClass(2 + idx)}`}
            >
              {renderItemCard(item, idx)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-50 italic text-center py-4" style={{ color: textColor }}>Belum ada data dresscode.</p>
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
    <section className="relative mx-auto overflow-hidden transition-all duration-300 min-h-[50dvh] py-12 sm:py-28 px-4 sm:px-6 flex flex-col justify-center" style={{ backgroundColor: parentBgClr }}>
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
        else if (slideshowAnim === 'zoom') { op = isAct ? 1 : 0; if (isAct) anim = `dresscodeKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`; if (bgBlur > 0) tr = 'scale(1.05)'; }
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
      <div className="relative z-10 p-4 sm:p-6 w-full flex flex-col justify-center">
        {renderLayout()}
      </div>
    </section>
  );
}
