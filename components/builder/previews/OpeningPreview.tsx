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
      {/* Background Image */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: overlayOpacity / 100 }}
      />

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
