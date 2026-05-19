'use client';
import React, { useEffect, useState } from 'react';
import type { OpeningProps } from '../types';

interface PreviewProps {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
  onOpen?: () => void;
}

export default function OpeningPreview({ props, style, onOpen }: PreviewProps) {
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

  return (
    <div
      className="relative flex flex-col items-center justify-center p-6 text-center overflow-hidden min-h-[100dvh]"
      style={{
        backgroundColor: style.bg_color as string || '#ffffff',
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.15); }
        }
      `}} />

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
            backgroundImage: `linear-gradient(180deg, ${getHexWithOpacity(overlayColor, overlayOpacity)}, ${getHexWithOpacity(overlayColor2, overlayOpacity2)})`
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center gap-6">
        
        {/* Title */}
        <h1 
          className="text-2xl font-bold text-white drop-shadow-md"
          style={{ fontFamily: `'${style.font_heading || 'Playfair Display'}', serif` }}
        >
          {title}
        </h1>

        {/* Names */}
        <h2 
          className="font-extrabold text-white drop-shadow-md leading-tight"
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

        {/* Greeting */}
        <p 
          className="text-sm text-white/90 drop-shadow mt-4"
          style={{ fontFamily: `'${style.font_body || 'sans-serif'}', sans-serif` }}
        >
          {greetingText}
        </p>

        {/* Recipient Box */}
        <div className="w-full my-6 py-5 border-t border-b border-white/30 text-white">
          <h3 className="text-sm font-medium mb-2 text-white/80">{toLabel}</h3>
          <p className="text-xl font-bold tracking-wide">{toName}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
          <button 
            onClick={onOpen}
            className="w-full py-3 px-6 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: style.accent_color as string || '#e879a0',
              color: '#ffffff'
            }}
          >
            {buttonText}
          </button>

          {showQr && (
            <button 
              className="w-full py-3 px-6 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: style.accent_color as string || '#e879a0',
                color: '#ffffff'
              }}
            >
              QR CHECK-IN
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
