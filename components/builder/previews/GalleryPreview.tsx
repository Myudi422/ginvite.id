'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

function lum(hex: string): number {
  let c = (hex||'').replace('#','');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const v = parseInt(c, 16);
  return 0.2126*((v>>16)&0xff) + 0.7152*((v>>8)&0xff) + 0.0722*(v&0xff);
}
const isDark = (hex: string) => { try { return lum(hex) < 140; } catch { return false; } };

export default function GalleryPreview({ props, style }: P) {
  const images      = ((props.images as string[]) || []).filter(s => typeof s === 'string' && s.trim()).slice(0, 6);
  const cols        = Number(props.columns) || 3;
  const layout      = (props.layout_template as string) || 'grid';
  const animPreset  = (props.animation_preset as string) || 'none';
  const accent      = (style.accent_color as string) || '#e879a0';
  const fontHead    = (style.font_heading as string) || 'inherit';
  const fontBody    = (style.font_body as string) || 'inherit';

  const bgType          = (props.bg_type as string) || 'solid';
  const bgColor         = (props.bg_color as string) || '';
  const bgColor2        = (props.bg_color2 as string) || '';
  const bgGradientAngle = Number(props.bg_gradient_angle ?? 135);
  const bgImage         = (props.bg_image as string) || '';
  const bgImageBlur     = Number(props.bg_image_blur ?? 0);
  const bgImageGrayscale= !!props.bg_image_grayscale;
  const slideshowImages = (props.bg_slideshow_images as string[]) || [];
  const slideshowAnim   = (props.bg_slideshow_animation as string) || 'fade';
  const slideshowDur    = Number(props.bg_slideshow_duration ?? 5);
  const overlayType     = (props.overlay_type as string) || 'solid';
  const overlayColor    = (props.overlay_color as string) || '#000000';
  const overlayColor2   = (props.overlay_color2 as string) || '#000000';
  const overlayOpacity  = Number(props.overlay_opacity ?? 50);
  const overlayOpacity2 = Number(props.overlay_opacity2 ?? 0);
  const overlayGradAng  = Number(props.overlay_gradient_angle ?? 180);

  const isCustomBg   = bgType !== 'solid';
  const parentBgColor = bgType === 'solid' ? (bgColor || (style.bg_color as string) || '#ffffff') : undefined;
  const isOnDark     = isCustomBg || isDark(parentBgColor || '#fff');

  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox]       = useState<number | null>(null);
  const [mounted, setMounted]         = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const t = setInterval(() => setActiveSlide(p => (p+1) % validSlides.length), slideshowDur * 1000);
    return () => clearInterval(t);
  }, [bgType, validSlides.length, slideshowDur]);

  const hexAlpha = (hex: string, pct: number) => {
    if (!hex) return '';
    let c = hex.trim();
    if (!c.startsWith('#')) c = '#' + c;
    if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
    if (c.length > 7) c = c.slice(0, 7);
    return `${c}${Math.round((pct/100)*255).toString(16).padStart(2,'0')}`;
  };

  const getAnim = (i: number) => animPreset === 'none' ? '' : `animate-item animate-${animPreset} delay-${Math.min(i,6)}`;

  // ── Mosaic span helper ───────────────────────────────────────────────────
  const mosaicSpan = (i: number, total: number): string => {
    if (total <= 1) return 'col-span-3 row-span-2';
    if (total === 2) return i === 0 ? 'col-span-2' : 'col-span-1';
    if (total === 3) return i === 0 ? 'col-span-2 row-span-2' : 'col-span-1';
    if (total === 4) { if (i===0) return 'col-span-2 row-span-2'; if (i===3) return 'col-span-3'; return 'col-span-1'; }
    if (total === 5) { if (i===0) return 'col-span-2 row-span-2'; if (i===4) return 'col-span-2'; return 'col-span-1'; }
    if (i===0) return 'col-span-2 row-span-2'; if (i===4) return 'col-span-2'; if (i===5) return 'col-span-3'; return 'col-span-1';
  };

  const scrollSlider = (dir: 'left'|'right') => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir==='left' ? -260 : 260, behavior: 'smooth' });
  };

  // ── Captions / rotations for polaroid ───────────────────────────────────
  const caps = ['Momen Berharga','Kisah Indah','Penuh Ceria','Tawa & Senyum','Hari Istimewa','Kenangan Abadi'];
  const rots = ['-1deg','1.5deg','-1.5deg','1deg','-1.8deg','1.8deg'];

  // ── Render helpers ───────────────────────────────────────────────────────
  const Img = ({ src, className='', style: s={}, onClick }: { src: string; className?: string; style?: React.CSSProperties; onClick?: () => void }) => (
    <img src={src} alt="" loading="lazy" draggable={false}
      className={`w-full h-full object-cover ${className}`}
      style={s} onClick={onClick} />
  );

  // ── Root ─────────────────────────────────────────────────────────────────
  return (
    <div className="gal-root" style={{ backgroundColor: parentBgColor }}>
      {/* ── Scoped CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        /* ── Keyframes ── */
        @keyframes animFadeIn   { from{opacity:0;}        to{opacity:1;} }
        @keyframes animFadeUp   { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes animFadeDown { from{opacity:0;transform:translateY(-18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes animZoomIn   { from{opacity:0;transform:scale(0.93);} to{opacity:1;transform:scale(1);} }
        @keyframes animTrackingWide { from{opacity:0;letter-spacing:-0.2em;filter:blur(4px);} to{opacity:1;} }
        @keyframes animSlideLeft  { from{opacity:0;transform:translateX(-28px);} to{opacity:1;transform:translateX(0);} }
        @keyframes animSlideRight { from{opacity:0;transform:translateX(28px);}  to{opacity:1;transform:translateX(0);} }
        @keyframes animBlurReveal { from{opacity:0;filter:blur(12px);transform:scale(0.96);} to{opacity:1;filter:blur(0);transform:scale(1);} }
        @keyframes animBounceSoft { 0%{opacity:0;transform:scale(0.5);} 60%{opacity:.95;transform:scale(1.04);} 100%{opacity:1;transform:scale(1);} }
        @keyframes bgKB { 0%{transform:scale(1.02);} 100%{transform:scale(1.12);} }
        .animate-item{opacity:0;animation-fill-mode:forwards !important;}
        .animate-fade_in   {animation:animFadeIn .8s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-fade_up   {animation:animFadeUp 1s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-fade_down {animation:animFadeDown 1s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-zoom_in   {animation:animZoomIn .9s cubic-bezier(.34,1.56,.64,1) forwards;}
        .animate-tracking_wide{animation:animTrackingWide 1.2s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-slide_left  {animation:animSlideLeft 1s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-slide_right {animation:animSlideRight 1s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-blur_reveal {animation:animBlurReveal 1.2s cubic-bezier(.16,1,.3,1) forwards;}
        .animate-bounce_soft {animation:animBounceSoft 1s cubic-bezier(.175,.885,.32,1.275) forwards;}
        .delay-1{animation-delay:100ms;} .delay-2{animation-delay:200ms;} .delay-3{animation-delay:300ms;}
        .delay-4{animation-delay:400ms;} .delay-5{animation-delay:500ms;} .delay-6{animation-delay:600ms;}

        /* ── Root fills parent (parent CSS forces flex:1 flex-col) ── */
        .gal-root {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* ── Inner wrapper: centred, fills full height ── */
        .gal-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 56rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: clamp(0.75rem,3dvh,2rem) clamp(0.75rem,3vw,1.5rem);
          gap: clamp(0.4rem,1.5dvh,1rem);
        }

        /* ── Header (shrinks to content, never grows) ── */
        .gal-header {
          flex-shrink: 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.1rem,0.4dvh,0.3rem);
        }
        .gal-tag {
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: clamp(0.55rem,1.6vw,0.7rem);
          color: ${accent};
        }
        .gal-title {
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.15;
          font-size: clamp(1rem,4vw,1.85rem);
          color: ${isOnDark ? '#ffffff' : '#0f172a'};
          font-family: '${fontHead}', serif;
          text-shadow: ${isOnDark ? '0 2px 10px rgba(0,0,0,0.4)' : 'none'};
        }
        .gal-divider {
          width: 2.5rem;
          height: 2px;
          border-radius: 1px;
          background-color: ${accent};
          opacity: 0.8;
          margin-top: clamp(0.1rem,0.4dvh,0.25rem);
        }

        /* ── Gallery area fills remaining height ── */
        .gal-area {
          flex: 1;
          min-height: 0;
          width: 100%;
          position: relative;
        }

        /* ─────────────── GRID ─────────────── */
        .gal-grid {
          height: 100%;
          width: 100%;
          display: grid;
          gap: clamp(0.3rem,1.2vw,0.65rem);
        }
        .gal-grid-cell {
          position: relative;
          overflow: hidden;
          border-radius: clamp(0.5rem,2vw,1rem);
          cursor: zoom-in;
          background: rgba(128,128,128,0.12);
        }
        .gal-grid-cell:hover .gal-grid-overlay { opacity: 1; }
        .gal-grid-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.35s;
          display: flex;
          align-items: flex-end;
          padding: clamp(0.4rem,1.5vw,0.75rem);
        }
        .gal-grid-cell img { transition: transform 0.6s; }
        .gal-grid-cell:hover img { transform: scale(1.06); }

        /* ─────────────── MASONRY / POLAROID ─────────────── */
        .gal-masonry {
          height: 100%;
          width: 100%;
          display: grid;
          align-items: start;
          gap: clamp(0.4rem,1.5vw,0.85rem);
        }
        .gal-polaroid {
          background: #faf9f6;
          border: 1px solid rgba(0,0,0,0.09);
          box-shadow: 0 4px 18px rgba(0,0,0,0.11);
          padding: clamp(0.3rem,1.2vw,0.7rem);
          padding-bottom: clamp(1.25rem,4dvh,2rem);
          position: relative;
          cursor: zoom-in;
          transition: transform 0.3s;
          box-sizing: border-box;
        }
        .gal-polaroid:hover { transform: scale(1.03) !important; }
        .gal-polaroid-tape {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          top: clamp(-0.55rem,-2vw,-0.4rem);
          width: clamp(1.5rem,5vw,2.5rem);
          height: clamp(0.45rem,1.5vw,0.75rem);
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.3);
          z-index: 2;
        }
        .gal-polaroid-img {
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #e5e7eb;
        }
        .gal-polaroid-img img { transition: transform 0.5s; }
        .gal-polaroid:hover .gal-polaroid-img img { transform: scale(1.05); }
        .gal-polaroid-cap {
          text-align: center;
          margin-top: clamp(0.2rem,0.8vw,0.4rem);
          font-family: 'Caveat', cursive;
          font-size: clamp(0.65rem,2.2vw,0.9rem);
          color: #2c2c2c;
          line-height: 1.2;
        }

        /* ─────────────── SLIDER / FILMSTRIP ─────────────── */
        .gal-slider-wrap {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .gal-slider {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none;
          scrollbar-width: none;
          gap: clamp(0.4rem,1.5vw,0.85rem);
          padding: clamp(0.5rem,2dvh,1rem) clamp(0.25rem,1vw,0.4rem);
          align-items: center;
        }
        .gal-slider::-webkit-scrollbar { display: none; }
        .gal-film-card {
          flex-shrink: 0;
          scroll-snap-align: center;
          cursor: zoom-in;
          background: #111;
          /* width relative to viewport width but capped */
          width: clamp(8rem,30vw,18rem);
          aspect-ratio: 4/3;
          border-top: clamp(5px,1.5vw,12px) solid #0d0d0d;
          border-bottom: clamp(5px,1.5vw,12px) solid #0d0d0d;
          border-left: clamp(3px,1vw,7px) solid #0a0a0a;
          border-right: clamp(3px,1vw,7px) solid #0a0a0a;
          position: relative;
          transition: transform 0.3s;
          box-sizing: content-box;
        }
        .gal-film-card:hover { transform: scale(1.02); }
        .gal-film-card img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .gal-film-holes {
          position: absolute;
          left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          padding: 0 clamp(0.25rem,1vw,0.5rem);
        }
        .gal-film-hole {
          width: clamp(3px,0.8vw,5px);
          height: clamp(4px,1vw,7px);
          background: #f0f0f0;
          border-radius: 1px;
          opacity: 0.85;
        }
        .gal-film-quote {
          flex-shrink: 0;
          scroll-snap-align: center;
          width: clamp(8rem,30vw,18rem);
          aspect-ratio: 4/3;
          border-top: clamp(5px,1.5vw,12px) solid #0d0d0d;
          border-bottom: clamp(5px,1.5vw,12px) solid #0d0d0d;
          border-left: clamp(3px,1vw,7px) solid #0a0a0a;
          border-right: clamp(3px,1vw,7px) solid #0a0a0a;
          background: #181818;
          color: #ccc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(0.5rem,2vw,1.2rem);
          box-sizing: content-box;
          position: relative;
        }
        .gal-slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          padding: clamp(0.35rem,1.2vw,0.6rem);
          transition: background 0.2s;
        }
        .gal-slider-btn:hover { background: rgba(255,255,255,0.32); }
        @media (min-width: 640px) {
          .gal-slider-wrap:hover .gal-slider-btn { display: flex; }
        }

        /* ─────────────── MOSAIC / LOOKBOOK ─────────────── */
        .gal-mosaic {
          height: 100%;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3,1fr);
          grid-auto-rows: 1fr;
          gap: clamp(0.25rem,1vw,0.5rem);
        }
        .gal-mosaic-cell {
          position: relative;
          overflow: hidden;
          cursor: zoom-in;
          background: #e5e7eb;
          min-height: 0;
        }
        .gal-mosaic-cell:hover img { transform: scale(1.05); }
        .gal-mosaic-cell img { transition: transform 0.6s; display: block; width: 100%; height: 100%; object-fit: cover; }
        .gal-mosaic-numeral {
          position: absolute;
          top: clamp(0.25rem,1vw,0.6rem);
          left: clamp(0.25rem,1vw,0.6rem);
          font-size: clamp(0.75rem,3vw,2.25rem);
          color: white;
          opacity: 0.25;
          font-family: '${fontHead}', serif;
          line-height: 1;
          pointer-events: none;
          select: none;
        }

        /* ─────────────── Quote cards ─────────────── */
        .gal-quote-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(0.5rem,2vw,1.25rem);
          border-radius: clamp(0.5rem,2vw,1rem);
          background: ${isOnDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)'};
          border: 1px solid ${isOnDark ? 'rgba(255,255,255,0.14)' : accent + '28'};
          gap: clamp(0.25rem,1vw,0.5rem);
        }
        .gal-quote-lookbook {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(0.5rem,2vw,1.5rem);
          border-left: 3px solid ${accent};
          background: ${isOnDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'};
        }

        /* ─────────────── Lightbox ─────────────── */
        .gal-lb {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.94);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: animFadeIn 0.18s ease forwards;
        }
        .gal-lb-img {
          max-width: 88vw;
          max-height: 82vh;
          object-fit: contain;
          border-radius: 0.75rem;
          box-shadow: 0 25px 80px rgba(0,0,0,0.6);
        }
        .gal-lb-btn {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: clamp(0.4rem,1.5vw,0.7rem);
          transition: background 0.2s, transform 0.15s;
          z-index: 10;
        }
        .gal-lb-btn:hover { background: rgba(255,255,255,0.22); transform: scale(1.08); }
        .gal-lb-count {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(0.6rem,2vw,0.75rem);
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.1);
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          letter-spacing: 0.1em;
        }
      `}} />

      {/* ── Backgrounds ── */}
      {bgType === 'gradient' && (
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${bgGradientAngle}deg,${bgColor||'#ff7e5f'},${bgColor2||'#feb47b'})` }} />
      )}
      {bgType === 'image' && bgImage && (
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: `url(${bgImage})`,
          filter: `${bgImageGrayscale?'grayscale(100%)':''} ${bgImageBlur>0?`blur(${bgImageBlur}px)`:''}`.trim()||undefined,
          transform: bgImageBlur>0 ? 'scale(1.05)' : undefined,
        }} />
      )}
      {bgType === 'slideshow' && validSlides.map((url, idx) => {
        const isA = idx === activeSlide;
        const isP = idx === (activeSlide - 1 + validSlides.length) % validSlides.length;
        let tr = 'none', op = 0, anim: string|undefined;
        if (slideshowAnim === 'fade') { op = isA ? 1 : 0; }
        else if (slideshowAnim === 'zoom') { op = isA ? 1 : 0; if (isA) anim = `bgKB ${slideshowDur+1}s ease-in-out infinite alternate`; }
        else { op = isA ? 1 : 0; tr = isA ? 'translateX(0)' : isP ? 'translateX(-100%)' : 'translateX(100%)'; }
        return (
          <div key={idx} className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage:`url(${url})`, opacity: op, transform: tr === 'none' ? undefined : tr, animation: anim,
              filter:`${bgImageGrayscale?'grayscale(100%)':''} ${bgImageBlur>0?`blur(${bgImageBlur}px)`:''}`.trim()||undefined,
              transition: slideshowAnim==='slide' ? 'transform 1s,opacity 1s' : 'opacity 1s' }} />
        );
      })}
      {isCustomBg && (overlayType === 'gradient'
        ? <div className="absolute inset-0 pointer-events-none z-[1]" style={{ backgroundImage: `linear-gradient(${overlayGradAng}deg,${hexAlpha(overlayColor,overlayOpacity)},${hexAlpha(overlayColor2,overlayOpacity2)})` }} />
        : <div className="absolute inset-0 pointer-events-none z-[1]" style={{ backgroundColor: overlayColor, opacity: overlayOpacity/100 }} />
      )}

      {/* ── Inner ── */}
      <div className="gal-inner">

        {/* Header */}
        <div className={`gal-header ${getAnim(1)}`}>
          <span className="gal-tag">Our Memories</span>
          <h2 className="gal-title">Galeri Foto Bahagia</h2>
          <div className="gal-divider" />
        </div>

        {/* Gallery area */}
        <div className="gal-area">

          {/* Empty */}
          {images.length === 0 && (
            <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem',
              border:`2px dashed ${isOnDark?'rgba(255,255,255,0.2)':accent+'30'}`, borderRadius:'1rem',
              background: isOnDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize:'clamp(1.5rem,6vw,2.5rem)' }}>🖼️</span>
              <p style={{ fontSize:'clamp(0.7rem,2.5vw,0.875rem)', color: isOnDark?'rgba(255,255,255,0.5)':'#aaa', fontStyle:'italic' }}>
                Belum ada foto ditambahkan
              </p>
            </div>
          )}

          {/* ── 1. GRID ── */}
          {layout === 'grid' && images.length > 0 && (() => {
            const numCols  = images.length <= 2 ? images.length : (cols === 2 ? 2 : 3);
            const showQuote = images.length <= 3;
            const allItems = showQuote ? ['__quote__', ...images] : images;
            const numRows  = Math.ceil(allItems.length / numCols);
            return (
              <div className="gal-grid" style={{
                gridTemplateColumns: `repeat(${numCols}, 1fr)`,
                gridTemplateRows: `repeat(${numRows}, 1fr)`,
              }}>
                {allItems.map((src, i) => src === '__quote__' ? (
                  <div key="q" className={`gal-quote-grid ${getAnim(1)}`}>
                    <span style={{ fontSize:'clamp(1rem,3vw,1.5rem)', color: accent, opacity:0.6 }}>✦</span>
                    <p style={{ fontSize:'clamp(0.62rem,2vw,0.78rem)', color: isOnDark?'rgba(255,255,255,0.75)':'#555', lineHeight:1.5, fontFamily: fontBody }}>
                      "Setiap gambar menyimpan kenangan indah yang takkan terlupakan."
                    </p>
                  </div>
                ) : (
                  <div key={i} className={`gal-grid-cell ${getAnim(i + (showQuote ? 2 : 1))}`} onClick={() => setLightbox(showQuote ? i - 1 : i)}>
                    <Img src={src} />
                    <div className="gal-grid-overlay">
                      <div style={{ color:'white' }}>
                        <span style={{ fontSize:'clamp(7px,1.5vw,9px)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color: accent }}>Moment</span>
                        <br/><span style={{ fontSize:'clamp(9px,2vw,11px)', fontWeight:600 }}>MEMORIES #{showQuote ? i : i+1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── 2. MASONRY / POLAROID ── */}
          {layout === 'masonry' && images.length > 0 && (() => {
            const numCols = Math.min(images.length, cols === 2 ? 2 : 3);
            return (
              <div className="gal-masonry" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)`, alignItems:'start' }}>
                {images.map((src, i) => (
                  <div key={i} className={`gal-polaroid ${getAnim(i+1)}`}
                    style={{ transform: `rotate(${rots[i % rots.length]})` }}
                    onClick={() => setLightbox(i)}>
                    <div className="gal-polaroid-tape" />
                    <div className="gal-polaroid-img"><Img src={src} /></div>
                    <div className="gal-polaroid-cap">{caps[i % caps.length]}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── 3. SLIDER / FILMSTRIP ── */}
          {layout === 'slider' && images.length > 0 && (
            <div className="gal-slider-wrap">
              <button className="gal-slider-btn" style={{ left: '0.25rem' }} onClick={() => scrollSlider('left')}>
                <ChevronLeft style={{ width:'clamp(0.9rem,2.5vw,1.25rem)', height:'clamp(0.9rem,2.5vw,1.25rem)' }} />
              </button>

              <div ref={sliderRef} className="gal-slider">
                {images.length <= 3 && (
                  <div className={`gal-film-quote ${getAnim(1)}`}>
                    <div style={{ position:'absolute', inset:0 }}>
                      <div className="gal-film-holes" style={{ top: 'clamp(-12px,-2vw,-7px)' }}>
                        {[...Array(7)].map((_,k) => <div key={k} className="gal-film-hole" />)}
                      </div>
                      <div className="gal-film-holes" style={{ bottom: 'clamp(-12px,-2vw,-7px)' }}>
                        {[...Array(7)].map((_,k) => <div key={k} className="gal-film-hole" />)}
                      </div>
                    </div>
                    <span style={{ fontSize:'clamp(1rem,3vw,1.5rem)' }}>🎞️</span>
                    <p style={{ fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.15em', fontSize:'clamp(6px,1.5vw,9px)', marginTop:'0.3rem' }}>
                      Our Story in Reels
                    </p>
                  </div>
                )}
                {images.map((src, i) => (
                  <div key={i} className={`gal-film-card ${getAnim(i+2)}`} onClick={() => setLightbox(i)}>
                    <div className="gal-film-holes" style={{ top: 'clamp(-12px,-2vw,-7px)' }}>
                      {[...Array(7)].map((_,k) => <div key={k} className="gal-film-hole" />)}
                    </div>
                    <Img src={src} />
                    <div className="gal-film-holes" style={{ bottom: 'clamp(-12px,-2vw,-7px)' }}>
                      {[...Array(7)].map((_,k) => <div key={k} className="gal-film-hole" />)}
                    </div>
                  </div>
                ))}
              </div>

              <button className="gal-slider-btn" style={{ right: '0.25rem' }} onClick={() => scrollSlider('right')}>
                <ChevronRight style={{ width:'clamp(0.9rem,2.5vw,1.25rem)', height:'clamp(0.9rem,2.5vw,1.25rem)' }} />
              </button>
            </div>
          )}

          {/* ── 4. MOSAIC / LOOKBOOK ── */}
          {layout === 'grid_mosaic' && images.length > 0 && (() => {
            const nums = ['I','II','III','IV','V','VI'];
            if (images.length <= 3) {
              return (
                <div style={{ height:'100%', display:'grid', gridTemplateColumns:`repeat(${images.length+1}, 1fr)`, gap:'clamp(0.25rem,1vw,0.5rem)', gridAutoRows:'1fr' }}>
                  <div className={`gal-quote-lookbook ${getAnim(1)}`}>
                    <span style={{ fontFamily:`'${fontHead}',serif`, fontSize:'clamp(1.25rem,4vw,2.5rem)', color:accent, opacity:0.25, lineHeight:1 }}>"</span>
                    <p style={{ fontFamily:`'${fontHead}',serif`, fontStyle:'italic', fontSize:'clamp(0.6rem,2vw,0.875rem)', color: isOnDark?'rgba(255,255,255,0.75)':'#444', lineHeight:1.5, marginTop:'-0.3em', paddingLeft:'0.25rem' }}>
                      Kisah terbaik ditulis waktu, diabadikan dalam gambar.
                    </p>
                    <span style={{ fontSize:'clamp(0.5rem,1.5vw,0.65rem)', letterSpacing:'0.18em', textTransform:'uppercase', color:accent, fontWeight:700, opacity:0.7, marginTop:'0.4rem', paddingLeft:'0.25rem' }}>— THE JOURNEY</span>
                  </div>
                  {images.map((src, i) => (
                    <div key={i} className={`gal-mosaic-cell ${getAnim(i+2)}`} onClick={() => setLightbox(i)}>
                      <Img src={src} />
                      <div className="gal-mosaic-numeral">{nums[i]}</div>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div className="gal-mosaic" style={{ gridTemplateRows:`repeat(${images.length <= 4 ? 2 : 3}, 1fr)` }}>
                {images.map((src, i) => (
                  <div key={i} className={`gal-mosaic-cell ${mosaicSpan(i, images.length)} ${getAnim(i+1)}`} onClick={() => setLightbox(i)}>
                    <Img src={src} />
                    <div className="gal-mosaic-numeral">{nums[i]}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && images[lightbox] && mounted && createPortal(
        <div className="gal-lb" onClick={() => setLightbox(null)}>
          <button className="gal-lb-btn" style={{ top:'1rem', right:'1rem' }} onClick={() => setLightbox(null)}>
            <X style={{ width:'clamp(1rem,3.5vw,1.35rem)', height:'clamp(1rem,3.5vw,1.35rem)' }} />
          </button>
          <button className="gal-lb-btn" style={{ left:'clamp(0.5rem,2vw,1.5rem)', top:'50%', transform:'translateY(-50%)' }}
            onClick={e => { e.stopPropagation(); setLightbox(p => p !== null ? (p - 1 + images.length) % images.length : null); }}>
            <ChevronLeft style={{ width:'clamp(1.1rem,4vw,1.5rem)', height:'clamp(1.1rem,4vw,1.5rem)' }} />
          </button>
          <div onClick={e => e.stopPropagation()}>
            <img src={images[lightbox]} alt="" className="gal-lb-img" />
          </div>
          <button className="gal-lb-btn" style={{ right:'clamp(0.5rem,2vw,1.5rem)', top:'50%', transform:'translateY(-50%)' }}
            onClick={e => { e.stopPropagation(); setLightbox(p => p !== null ? (p + 1) % images.length : null); }}>
            <ChevronRight style={{ width:'clamp(1.1rem,4vw,1.5rem)', height:'clamp(1.1rem,4vw,1.5rem)' }} />
          </button>
          <div className="gal-lb-count">{lightbox + 1} / {images.length}</div>
        </div>,
        document.body
      )}
    </div>
  );
}
