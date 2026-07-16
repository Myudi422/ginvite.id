'use client';
import React, { useEffect, useState } from 'react';
import type { OpeningProps } from '../types';
import QRModal from '@/components/QRModal';

interface PreviewProps {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
  onOpen?: () => void;
  isExiting?: boolean;
}

export default function OpeningPreview({ props, style, onOpen, isExiting = false }: PreviewProps) {
  const typedProps = props as unknown as OpeningProps;
  
  const title = typedProps.title || 'The Wedding Of';
  const greetingText = typedProps.greeting_text || 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang';
  const toLabel = typedProps.to_label || 'Kepada Yth. Bapak/Ibu/Saudara/i';
  const buttonText = typedProps.button_text || 'Buka Undangan';
  const bgImage = typedProps.bg_image || '';
  const overlayOpacity = typedProps.overlay_opacity ?? 50;
  const showQr = typedProps.show_qr ?? true;
  const overlayType = typedProps.overlay_type || 'solid';
  const overlayColor = typedProps.overlay_color || '#000000';
  const overlayColor2 = typedProps.overlay_color2 || '#000000';
  const overlayOpacity2 = typedProps.overlay_opacity2 ?? 0;

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
  const bgType = typedProps.bg_type || 'image';
  const bgColor = typedProps.bg_color || '';
  const bgColor2 = typedProps.bg_color2 || '';
  const bgImageBlur = typedProps.bg_image_blur ?? 0;
  const bgImageGrayscale = typedProps.bg_image_grayscale ?? false;
  const slideshowImages = typedProps.bg_slideshow_images || [];
  const slideshowAnimation = typedProps.bg_slideshow_animation || 'fade';
  const slideshowDuration = typedProps.bg_slideshow_duration ?? 5;

  const [activeSlide, setActiveSlide] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % validSlides.length);
    }, slideshowDuration * 1000);
    return () => clearInterval(interval);
  }, [bgType, validSlides.length, slideshowDuration]);

  const namePrimary = typedProps.name_primary || 'Nama Pengantin';
  const nameSecondary = typedProps.name_secondary || '';
  const namesSize = typedProps.names_size ?? 36;

  const [toName, setToName] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to');
      if (to) {
        return decodeURIComponent(to).replace(/-/g, ' ');
      }
    }
    return "Tamu Undangan";
  });

  const openAnimation = typedProps.open_animation || 'slide_up';
  const isSplit = ['split_vertical', 'split_horizontal', 'door_open'].includes(openAnimation);

  const renderBackground = (clipPathValue?: string, extraClass = '', customStyle: React.CSSProperties = {}) => {
    const combinedStyle: React.CSSProperties = {
      ...customStyle,
      ...(clipPathValue ? { clipPath: clipPathValue, WebkitClipPath: clipPathValue } : {})
    };
    return (
      <div className={`absolute inset-0 w-full h-full overflow-hidden ${extraClass}`} style={combinedStyle}>
        {/* Background Layer */}
        {bgType === 'solid' && (
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: bgColor || '#ffffff' }}
          />
        )}

        {bgType === 'gradient' && (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${bgColor || '#ff7e5f'}, ${bgColor2 || '#feb47b'})` 
            }}
          />
        )}

        {(bgType === 'image' && bgImage) && (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{ 
              backgroundImage: `url(${bgImage})`,
              filter: `${bgImageGrayscale ? 'grayscale(100%)' : ''} ${bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : ''}`.trim() || undefined,
              transform: bgImageBlur > 0 ? 'scale(1.1)' : 'scale(1)'
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
                  : 'opacity 1000ms ease-in-out, transform 1000ms ease-in-out'
              }}
            />
          );
        })}

        {/* Overlay */}
        {overlayType === 'gradient' ? (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              backgroundImage: `linear-gradient(${typedProps.overlay_gradient_angle ?? 180}deg, ${getHexWithOpacity(overlayColor, overlayOpacity)}, ${getHexWithOpacity(overlayColor2, overlayOpacity2)})`
            }}
          />
        ) : (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100 
            }}
          />
        )}
      </div>
    );
  };

  const isNormalExiting = !isSplit && isExiting && openAnimation !== 'none';
  const exitClass = isNormalExiting ? `animate-exit-${openAnimation}` : '';

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 text-center overflow-hidden min-h-screen min-h-[100dvh] ${exitClass}`}
      style={{
        backgroundColor: style.bg_color as string || '#ffffff',
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.15); }
        }
        @keyframes animFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes animFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes animFadeDown {
          from { opacity: 0; transform: translateY(-24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes animZoomIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes animTrackingWide {
          from { opacity: 0; letter-spacing: -0.2em; filter: blur(4px); }
          to { opacity: 1; }
        }
        @keyframes animSlideLeft {
          from { opacity: 0; transform: translateX(-35px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes animSlideRight {
          from { opacity: 0; transform: translateX(35px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes animBlurReveal {
          from { opacity: 0; filter: blur(12px); transform: scale(0.96); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }
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

        /* Exit Animations keyframes */
        @keyframes exitSlideUp {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        @keyframes exitSlideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        @keyframes exitFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes exitZoomFade {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.92); }
        }
        @keyframes exitZoomInFade {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(1.08); }
        }

        /* Split/Door Keyframes */
        @keyframes exitSplitUp {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        @keyframes exitSplitDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
        @keyframes exitSplitLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes exitSplitRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes exitDoorLeft {
          from { transform: perspective(1200px) rotateY(0deg); transform-origin: left; opacity: 1; }
          to { transform: perspective(1200px) rotateY(-95deg); transform-origin: left; opacity: 0; }
        }
        @keyframes exitDoorRight {
          from { transform: perspective(1200px) rotateY(0deg); transform-origin: right; opacity: 1; }
          to { transform: perspective(1200px) rotateY(95deg); transform-origin: right; opacity: 0; }
        }
        @keyframes exitContent {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.96); }
        }

        /* Exit Transition Classes */
        .animate-exit-slide_up { animation: exitSlideUp 1000ms cubic-bezier(0.85, 0, 0.15, 1) forwards; }
        .animate-exit-slide_down { animation: exitSlideDown 1000ms cubic-bezier(0.85, 0, 0.15, 1) forwards; }
        .animate-exit-fade_out { animation: exitFadeOut 800ms ease-in-out forwards; }
        .animate-exit-zoom_fade { animation: exitZoomFade 900ms cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-exit-zoom_in_fade { animation: exitZoomInFade 900ms cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        .animate-exit-split-up { animation: exitSplitUp 1000ms cubic-bezier(0.85, 0, 0.15, 1) forwards; }
        .animate-exit-split-down { animation: exitSplitDown 1000ms cubic-bezier(0.85, 0, 0.15, 1) forwards; }
        .animate-exit-split-left { animation: exitSplitLeft 1000ms cubic-bezier(0.85, 0, 0.15, 1) forwards; }
        .animate-exit-split-right { animation: exitSplitRight 1000ms cubic-bezier(0.85, 0, 0.15, 1) forwards; }
        .animate-exit-door-left { animation: exitDoorLeft 1100ms cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-exit-door-right { animation: exitDoorRight 1100ms cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .animate-exit-content { animation: exitContent 700ms ease-in-out forwards; }
      `}} />

      {/* Background Layers */}
      {isSplit ? (
        <>
          {openAnimation === 'split_vertical' && (
            <>
              {renderBackground('inset(0 0 50% 0)', isExiting ? 'animate-exit-split-up' : '')}
              {renderBackground('inset(50% 0 0 0)', isExiting ? 'animate-exit-split-down' : '')}
            </>
          )}
          {openAnimation === 'split_horizontal' && (
            <>
              {renderBackground('inset(0 50% 0 0)', isExiting ? 'animate-exit-split-left' : '')}
              {renderBackground('inset(0 0 0 50%)', isExiting ? 'animate-exit-split-right' : '')}
            </>
          )}
          {openAnimation === 'door_open' && (
            <>
              {renderBackground('inset(0 50% 0 0)', isExiting ? 'animate-exit-door-left' : '', { transformStyle: 'preserve-3d' })}
              {renderBackground('inset(0 0 0 50%)', isExiting ? 'animate-exit-door-right' : '', { transformStyle: 'preserve-3d' })}
            </>
          )}
        </>
      ) : (
        renderBackground()
      )}

      {/* Modular Visual Elements Helpers */}
      <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center ${isSplit && isExiting ? 'animate-exit-content' : ''}`}>
        {(() => {
        const layoutTemplate = typedProps.layout_template || 'classic';

        // Auto-detect event category based on title text
        const detectedCategory = (() => {
          const t = (title || '').toLowerCase();
          if (t.includes('wedding') || t.includes('nikah') || t.includes('ursy') || t.includes('marriage') || t.includes('akad') || t.includes('resep')) {
            return 'pernikahan';
          }
          if (t.includes('khitan') || t.includes('sunat')) {
            return 'khitanan';
          }
          if (t.includes('birthday') || t.includes('ulang tahun') || t.includes('milad') || t.includes('ultah') || t.includes('lahir') || t.includes('anniversary') || t.includes('party')) {
            return 'ulang_tahun';
          }
          return 'custom';
        })();

        const albumCoverUrl = bgImage || (validSlides.length > 0 ? validSlides[0] : '');

        const animationPreset = typedProps.animation_preset || 'none';
        const isAnimated = animationPreset !== 'none';
        
        const getAnimClass = (delayIndex: number) => {
          if (!isAnimated) return '';
          return `animate-item animate-${animationPreset} delay-${delayIndex}`;
        };

        const renderTitle = (customClass = '') => (
          <h1 
            className={`text-2xl font-bold text-white drop-shadow-md ${getAnimClass(1)} ${customClass}`.trim()}
            style={{ fontFamily: `'${style.font_heading || 'Playfair Display'}', serif` }}
          >
            {title}
          </h1>
        );

        const renderNames = (customClass = '') => (
          <h2 
            className={`font-extrabold text-white drop-shadow-md leading-tight ${getAnimClass(2)} ${customClass}`.trim()}
            style={{ 
              fontFamily: `'${style.font_heading || 'Playfair Display'}', serif`,
              fontSize: `${namesSize}px`
            }}
          >
            {namePrimary}
            {nameSecondary && (
              <>
                <span 
                  className="block text-white/80 my-1 font-normal"
                  style={{ fontSize: `${Math.round(namesSize * 0.65)}px` }}
                >
                  &amp;
                </span>
                {nameSecondary}
              </>
            )}
          </h2>
        );

        const renderGreeting = (customClass = '') => (
          <p 
            className={`text-sm text-white/90 drop-shadow ${getAnimClass(3)} ${customClass}`.trim()}
            style={{ fontFamily: `'${style.font_body || 'sans-serif'}', sans-serif` }}
          >
            {greetingText}
          </p>
        );

        const renderRecipientBox = (customClass = '') => (
          <div className={`w-full py-5 border-t border-b border-white/30 text-white text-center ${getAnimClass(3)} ${customClass}`.trim()}>
            <h3 className="text-sm font-medium mb-2 text-white/80">{toLabel}</h3>
            <p className="text-xl font-bold tracking-wide">{toName}</p>
          </div>
        );

        const renderButtons = (stacked = true, customClass = '') => (
          <div className={`${stacked ? 'flex flex-col gap-3 w-full max-w-[200px]' : 'flex gap-3 w-full max-w-sm justify-center'} ${getAnimClass(4)} ${customClass}`.trim()}>
            <button 
              onClick={onOpen}
              className={`${stacked ? 'w-full' : 'flex-1'} py-3 px-6 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-center`}
              style={{ 
                backgroundColor: style.accent_color as string || '#e879a0',
                color: '#ffffff'
              }}
            >
              {buttonText}
            </button>

            {showQr && (
              <button 
                onClick={() => setShowQrModal(true)}
                className={`${stacked ? 'w-full' : 'flex-1'} py-3 px-6 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-center`}
                style={{ 
                  backgroundColor: style.accent_color as string || '#e879a0',
                  color: '#ffffff'
                }}
              >
                QR CHECK-IN
              </button>
            )}
          </div>
        );

        return (
          <>
            {/* 1. CLASSIC LAYOUT */}
            {layoutTemplate === 'classic' && (
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center gap-6">
                {renderTitle()}
                {renderNames()}
                {renderGreeting('mt-4')}
                {renderRecipientBox('my-6')}
                {renderButtons(true)}
              </div>
            )}

            {/* 2. MODERN SPLIT LAYOUT */}
            {layoutTemplate === 'modern_split' && (
              <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[80dvh] py-10 px-4">
                <div className="space-y-4 w-full text-center sm:text-left">
                  {renderTitle('sm:text-left border-pink-400 sm:border-l-4 sm:pl-4 tracking-wider')}
                  {renderNames('sm:text-left text-white/95 mt-4 font-bold')}
                </div>
                
                <div className="w-full space-y-6 mt-auto">
                  {renderGreeting('text-center sm:text-left text-white/80 max-w-sm')}
                  
                  {/* Glass Card Recipient Tag */}
                  <div className="w-full text-center sm:text-left py-4 px-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-1">{toLabel}</h3>
                    <p className="text-2xl font-black text-white tracking-wide">{toName}</p>
                  </div>
                  
                  {renderButtons(false, 'w-full')}
                </div>
              </div>
            )}

            {/* 3. CARD GLASS LAYOUT */}
            {layoutTemplate === 'card_glass' && (
              <div className="relative z-10 w-full max-w-sm mx-auto">
                <div className="p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl flex flex-col items-center gap-5 text-center">
                  {renderTitle('opacity-90 uppercase tracking-widest text-xs')}
                  {renderNames('my-2')}
                  <div className="w-12 h-0.5 bg-white/30 rounded-full" />
                  {renderGreeting('text-xs text-white/80 max-w-xs')}
                  
                  {/* Recipient badge */}
                  <div className="w-full py-4 px-4 bg-black/25 rounded-2xl border border-white/10 text-white my-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-medium mb-1">{toLabel}</h3>
                    <p className="text-lg font-bold tracking-wide">{toName}</p>
                  </div>
                  
                  {renderButtons(true, 'w-full')}
                </div>
              </div>
            )}

            {/* 4. ELEGANT BOTTOM LAYOUT */}
            {layoutTemplate === 'elegant_bottom' && (
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-end min-h-[90dvh] py-8">
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    {renderTitle('text-lg tracking-widest uppercase opacity-75')}
                    {renderNames()}
                  </div>
                  
                  <div className="pt-4 border-t border-white/20 space-y-4">
                    {renderGreeting('text-xs opacity-90 max-w-xs mx-auto')}
                    
                    {/* Minimal recipient */}
                    <div className="py-2 text-white">
                      <span className="text-xs opacity-60 block font-medium mb-0.5">{toLabel}</span>
                      <span className="text-xl font-bold tracking-wide border-b border-pink-400/50 pb-1 px-4">{toName}</span>
                    </div>
                    
                    {renderButtons(true, 'mx-auto')}
                  </div>
                </div>
              </div>
            )}

            {/* 5. NETFLIX CINEMATIC STYLE LAYOUT */}
            {layoutTemplate === 'netflix_style' && (
              <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-between min-h-[90dvh] py-10 px-4 text-left">
                
                {/* Netflix Top original tag */}
                <div className={`flex items-center gap-2 select-none self-center sm:self-start ${getAnimClass(1)}`.trim()}>
                  <span className="text-3xl font-black text-red-600 tracking-tighter drop-shadow-md">N</span>
                  <span className="text-[10px] tracking-[0.2em] text-white/80 font-bold uppercase drop-shadow">
                    {title || 'ORIGINAL'}
                  </span>
                </div>

                {/* Bottom section of Netflix card */}
                <div className="w-full space-y-5 mt-auto">
                  {/* Genre / Meta Tags */}
                  <div className={`flex items-center gap-2 flex-wrap text-xs text-white/90 drop-shadow font-semibold ${getAnimClass(2)}`.trim()}>
                    <span className="text-emerald-400 font-bold">99% Cocok</span>
                    <span className="text-white/40">•</span>
                    <span className="px-1.5 py-0.5 rounded border border-white/30 text-[10px] uppercase font-bold tracking-wider">
                      {detectedCategory === 'pernikahan' && 'Momen Bahagia'}
                      {detectedCategory === 'ulang_tahun' && 'Pesta Ulang Tahun'}
                      {detectedCategory === 'khitanan' && 'Walimatul Khitan'}
                      {detectedCategory === 'custom' && 'Acara Spesial'}
                    </span>
                    <span className="text-white/40">•</span>
                    <span>2026</span>
                    <span className="text-white/40">•</span>
                    <span>
                      {detectedCategory === 'pernikahan' && 'Romantis'}
                      {detectedCategory === 'ulang_tahun' && 'Keseruan'}
                      {detectedCategory === 'khitanan' && 'Khidmat'}
                      {detectedCategory === 'custom' && 'Kebersamaan'}
                    </span>
                  </div>

                  {/* Gigantic Cinematic Title */}
                  <h2 
                    className={`font-black text-white leading-tight uppercase tracking-tighter drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] ${getAnimClass(2)}`.trim()}
                    style={{ 
                      fontFamily: style.font_heading ? `'${style.font_heading}', sans-serif` : 'Impact, sans-serif',
                      fontSize: `${namesSize}px`
                    }}
                  >
                    {namePrimary}
                    {nameSecondary && ` & ${nameSecondary}`}
                  </h2>

                  {/* Synopsis text matching the Netflix theme */}
                  <p 
                    className={`text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm drop-shadow ${getAnimClass(3)}`.trim()}
                    style={{ fontFamily: `'${style.font_body || 'sans-serif'}', sans-serif` }}
                  >
                    {detectedCategory === 'pernikahan' && (
                      nameSecondary 
                        ? `Kisah cinta sejati yang mempersatukan ${namePrimary} & ${nameSecondary}. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menjadi bagian dari momen bahagia ini.`
                        : `Momen istimewa dan bersejarah bagi ${namePrimary}. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menyaksikan awal lembaran baru hidup kami.`
                    )}
                    {detectedCategory === 'ulang_tahun' && (
                      nameSecondary
                        ? `Perayaan pertambahan usia yang dinanti-nanti oleh ${namePrimary} & ${nameSecondary}. Mari bergabung dalam tawa dan keseruan acara spesial kami.`
                        : `Petualangan baru bertambahnya usia ${namePrimary}! Bersama teman dan keluarga tercinta, mari kita rayakan hari kelahiran penuh tawa dan kebahagiaan ini.`
                    )}
                    {detectedCategory === 'khitanan' && (
                      nameSecondary
                        ? `Langkah suci dalam syariat islam bagi putra tercinta, ${namePrimary} & ${nameSecondary}. Mari bersama mengiringi momen penuh syukur dan doa restu ini.`
                        : `Langkah suci dalam syariat islam bagi putra tercinta, ${namePrimary}. Kehadiran Anda adalah doa dan restu terbaik untuk menghiasi perjalanannya yang baru.`
                    )}
                    {detectedCategory === 'custom' && (
                      nameSecondary
                        ? `Momen kebersamaan berharga persembahan dari ${namePrimary} & ${nameSecondary}. Mari berkumpul, berbagi kebahagiaan, dan ciptakan memori indah bersama.`
                        : `Sebuah pertemuan penuh keakraban bersama ${namePrimary}. Tanpa mengurangi rasa hormat, kehadiran Anda di acara spesial ini sangat berarti bagi kami.`
                    )}
                  </p>

                  {/* Recipient custom Netflix banner */}
                  <div className={`w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm ${getAnimClass(3)}`.trim()}>
                    <span className="text-[10px] uppercase tracking-widest text-white/50 block font-semibold mb-0.5">{toLabel}</span>
                    <span className="text-lg font-black text-white tracking-wide uppercase">{toName}</span>
                  </div>

                  {/* Netflix Quick action buttons */}
                  <div className={`flex gap-3 w-full justify-center ${getAnimClass(4)}`.trim()}>
                    <button 
                      onClick={onOpen}
                      className="flex-1 py-3 px-6 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-center bg-white text-black flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <span className="text-base">▶</span> Buka Undangan
                    </button>

                    {showQr && (
                      <button 
                        onClick={() => setShowQrModal(true)}
                        className="flex-1 py-3 px-6 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-center bg-[#515050]/80 hover:bg-[#515050]/90 border border-white/20 text-white flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <span className="text-base">ⓘ</span> Info QR
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 6. ROYAL VINTAGE LAYOUT */}
            {layoutTemplate === 'royal_vintage' && (
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-[1px] bg-white/60" />
                  {renderTitle('italic font-serif tracking-widest text-white/90 text-sm')}
                  <div className="w-8 h-[1px] bg-white/60" />
                </div>
                
                {renderNames('text-white text-3xl font-serif tracking-wide py-2')}
                {renderGreeting('text-xs italic opacity-95 max-w-xs font-serif')}
                
                {/* Royal double bordered recipient box */}
                <div className="w-full py-5 border-double border-t-4 border-b-4 border-white/40 text-white my-3 text-center">
                  <h3 className="text-xs uppercase tracking-widest text-white/70 italic font-serif mb-1.5">{toLabel}</h3>
                  <p className="text-2xl font-serif tracking-wider font-semibold">{toName}</p>
                </div>
                
                {renderButtons(true)}
              </div>
            )}

            {/* 7. MINIMALISTIC TOP ANCHOR */}
            {layoutTemplate === 'minimal_top' && (
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-between min-h-[85dvh] py-8 px-4 text-center">
                
                {/* Thin Luxury Artistic Border Frame */}
                <div className="absolute inset-2 border border-white/10 pointer-events-none rounded-2xl" />

                {/* Top Section */}
                <div className="pt-8 space-y-3 relative z-10">
                  {renderTitle('text-[9px] font-mono tracking-[0.4em] uppercase text-white/80')}
                  <div className="w-12 h-[1px] bg-white/20 mx-auto my-2" />
                  {renderNames('text-3xl font-serif italic font-light tracking-wide text-white py-1')}
                </div>

                {/* Middle Elegant Vertical Dividing Line */}
                <div className="my-auto py-8 flex flex-col items-center justify-center relative z-10">
                  <div className="w-[1px] h-16 bg-white/20" />
                </div>

                {/* Bottom Section */}
                <div className="pb-8 space-y-5 relative z-10">
                  {/* Clean elegant recipient display */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-white/50 block font-mono">
                      {toLabel || 'SPECIAL INVITATION TO'}
                    </span>
                    <span className="text-xl font-light tracking-wide text-white block font-serif italic border-b border-white/10 pb-2 px-6 inline-block">
                      {toName || 'Tamu Undangan'}
                    </span>
                  </div>

                  {renderGreeting('text-[10px] font-light opacity-75 max-w-xs mx-auto italic')}

                  <div className="pt-2">
                    {renderButtons(true, 'mx-auto')}
                  </div>
                </div>

              </div>
            )}

            {/* 8. ASYMMETRIC BLOCK ACCENT */}
            {layoutTemplate === 'block_asymmetric' && (
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center gap-6">
                <div className="w-full text-left -skew-x-6 bg-white/10 border-l-4 border-pink-500 p-4 backdrop-blur-sm">
                  {renderTitle('text-xs font-mono uppercase tracking-widest opacity-80 text-pink-400')}
                  {renderNames('text-3xl font-black mt-2 tracking-tight')}
                </div>
                
                {renderGreeting('text-left text-xs opacity-85 mt-2 self-start pl-2')}
                
                {/* Skewed modern recipient box */}
                <div className="w-full py-4 px-5 bg-white/5 border border-white/10 rounded-2xl -skew-x-3 backdrop-blur-md my-2">
                  <h3 className="text-[10px] uppercase tracking-wider text-pink-400 font-bold mb-1 skew-x-3">{toLabel}</h3>
                  <p className="text-xl font-black tracking-wide text-white skew-x-3">{toName}</p>
                </div>
                
                {renderButtons(true, 'w-full')}
              </div>
            )}

            {/* 9. LUXURY EDITORIAL MAGAZINE COVER LAYOUT */}
            {layoutTemplate === 'luxury_magazine' && (
              <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col justify-between min-h-[90dvh] py-8 px-4 text-left">
                
                {/* Magazine Large Title Header */}
                <div className={`w-full text-center border-b border-white/20 pb-4 select-none ${getAnimClass(1)}`.trim()}>
                  <h1 
                    className="text-3xl sm:text-4xl font-serif font-extrabold tracking-[0.25em] text-white uppercase leading-none drop-shadow"
                    style={{ fontFamily: style.font_heading ? `'${style.font_heading}', serif` : 'serif' }}
                  >
                    {title || 'SPECIAL EDITION'}
                  </h1>
                  <div className="flex justify-between items-center text-[9px] tracking-[0.3em] text-white/50 font-mono uppercase mt-2.5 px-1">
                    <span>EDISI SPESIAL</span>
                    <span>EST. 2026</span>
                  </div>
                </div>

                {/* Central Feature Spotlight */}
                <div className={`w-full space-y-4 my-auto py-6 ${getAnimClass(2)}`.trim()}>
                  <span className="text-[10px] tracking-[0.3em] text-[#f43f5e] font-extrabold uppercase block select-none">
                    ★ LIPUTAN EKSKLUSIF
                  </span>
                  
                  <h2 
                    className="font-black text-white leading-none tracking-tighter uppercase drop-shadow"
                    style={{ 
                      fontFamily: style.font_heading ? `'${style.font_heading}', sans-serif` : 'sans-serif',
                      fontSize: `${namesSize}px`
                    }}
                  >
                    {namePrimary}
                    {nameSecondary && ` & ${nameSecondary}`}
                  </h2>

                  <p 
                    className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm border-l-2 border-[#f43f5e] pl-3 drop-shadow font-light"
                    style={{ fontFamily: `'${style.font_body || 'sans-serif'}', sans-serif` }}
                  >
                    {nameSecondary 
                      ? `Sorotan Utama: Edisi spesial yang mendokumentasikan momen berharga dan bersejarah dari ${namePrimary} & ${nameSecondary}. Temukan detail lengkap acara, galeri dokumentasi eksklusif, serta ucapan doa terbaik di dalam.`
                      : `Sorotan Utama: Edisi khusus yang merayakan momen istimewa dan bersejarah dari ${namePrimary}. Menampilkan dokumentasi eksklusif, rincian lengkap agenda acara, serta ucapan doa terbaik di dalam.`}
                  </p>
                </div>

                {/* Bottom Pass & Actions */}
                <div className={`w-full pt-4 border-t border-white/20 flex flex-col gap-4 ${getAnimClass(3)}`.trim()}>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-white/50 block font-mono mb-0.5">{toLabel || 'DIUNDANG'}</span>
                      <span className="text-lg font-bold text-white tracking-wide uppercase font-serif">{toName || 'Tamu Undangan'}</span>
                    </div>
                    <span className="text-[9px] font-mono border border-white/30 rounded px-2.5 py-0.5 text-white/60 tracking-widest select-none">
                      VIP PASS
                    </span>
                  </div>

                  {/* Elegant Magazine Action buttons */}
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={onOpen}
                      className="flex-1 py-3 px-6 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-center bg-white text-black flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider uppercase font-mono"
                    >
                      Buka Undangan
                    </button>

                    {showQr && (
                      <button 
                        onClick={() => setShowQrModal(true)}
                        className="flex-1 py-3 px-6 rounded-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-center bg-transparent border border-white/30 text-white hover:bg-white/5 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider uppercase font-mono"
                      >
                        QR INFO
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}
          </>
        );
      })()}
      </div>
      <QRModal
        show={showQrModal}
        onClose={() => setShowQrModal(false)}
        qrData={toName || "Tamu Undangan"}
        guestName={toName}
        eventName={nameSecondary ? `${namePrimary} & ${nameSecondary}` : namePrimary}
        coverImage={bgImage || (validSlides.length > 0 ? validSlides[0] : undefined)}
      />
    </div>
  );
}
