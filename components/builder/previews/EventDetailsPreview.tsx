'use client';
import React, { useEffect, useState } from 'react';
import { MapPinIcon, ClockIcon, CalendarIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function EventDetailsPreview({ props, style }: P) {
  const events = (props.events as Array<Record<string, string>>) || [];
  const accent = (style.accent_color as string) || '#e879a0';

  const bgType          = (props.bg_type as string) || 'solid';
  const bgColor         = (props.bg_color as string) || '';
  const bgColor2        = (props.bg_color2 as string) || '';
  const bgGradientAngle = (props.bg_gradient_angle as number) ?? 135;
  const bgImage         = (props.bg_image as string) || '';
  const bgImageBlur     = (props.bg_image_blur as number) ?? 0;
  const bgImageGrayscale= (props.bg_image_grayscale as boolean) ?? false;
  const slideshowImages = (props.bg_slideshow_images as string[]) || [];
  const slideshowAnim   = (props.bg_slideshow_animation as string) || 'fade';
  const slideshowDur    = (props.bg_slideshow_duration as number) ?? 5;
  const overlayType     = (props.overlay_type as string) || 'solid';
  const overlayColor    = (props.overlay_color as string) || '#000000';
  const overlayColor2   = (props.overlay_color2 as string) || '#000000';
  const overlayOpacity  = (props.overlay_opacity as number) ?? 50;
  const overlayOpacity2 = (props.overlay_opacity2 as number) ?? 0;
  const overlayGradAng  = (props.overlay_gradient_angle as number) ?? 180;
  const layoutTemplate  = (props.layout_template as string) || 'classic_list';
  const animPreset      = (props.animation_preset as string) || 'none';

  const [activeSlide, setActiveSlide] = useState(0);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const t = setInterval(() => setActiveSlide(p => (p + 1) % validSlides.length), slideshowDur * 1000);
    return () => clearInterval(t);
  }, [bgType, validSlides.length, slideshowDur]);

  const hexAlpha = (hex: string, pct: number) => {
    if (!hex) return '';
    let c = hex.trim();
    if (!c.startsWith('#')) c = '#' + c;
    if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
    if (c.length > 7) c = c.slice(0, 7);
    return `${c}${Math.round((pct / 100) * 255).toString(16).padStart(2, '0')}`;
  };

  const isCustomBg   = bgType !== 'solid';
  const parentBgColor = bgType === 'solid' ? (bgColor || (style.bg_color as string) || '#ffffff') : undefined;
  const onDark       = isCustomBg;

  const textMuted  = onDark ? 'rgba(255,255,255,0.78)' : '#6b7280';
  const textNote   = onDark ? 'rgba(255,255,255,0.52)' : '#9ca3af';
  const cardBg     = onDark ? 'rgba(255,255,255,0.10)' : accent + '0d';
  const cardBorder = onDark ? 'rgba(255,255,255,0.18)' : accent + '40';
  const titleColor = onDark ? '#ffffff' : accent;
  const labelColor = onDark ? 'rgba(255,255,255,0.7)' : '#9ca3af';

  const getAnim = (i: number) =>
    animPreset === 'none' ? '' : `animate-item animate-${animPreset} delay-${Math.min(i, 6)}`;

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return d; }
  };

  // ── Card ────────────────────────────────────────────────────────────────
  const Card = ({ ev, i }: { ev: Record<string, string>; i: number }) => (
    <div
      className={`ev-card relative rounded-xl border transition-all ${getAnim(i + 2)}`}
      style={{ background: cardBg, borderColor: cardBorder, backdropFilter: onDark ? 'blur(6px)' : undefined }}
    >
      <p className="ev-title font-extrabold leading-snug" style={{ color: titleColor, fontFamily: `'${style.font_heading}',serif` }}>
        {ev.name || 'Nama Acara'}
      </p>

      <div className="ev-details">
        {ev.date && (
          <div className="ev-row" style={{ color: textMuted }}>
            <CalendarIcon className="ev-icon" />
            <span>{fmtDate(ev.date)}</span>
          </div>
        )}
        {ev.time && (
          <div className="ev-row" style={{ color: textMuted }}>
            <ClockIcon className="ev-icon" />
            <span>{ev.time}{ev.timezone !== 'none' && ` ${ev.timezone || 'WIB'}`}</span>
          </div>
        )}
        {ev.location && (
          <div className="ev-row ev-row-top" style={{ color: textMuted }}>
            <MapPinIcon className="ev-icon" style={{ marginTop: '0.1rem' }} />
            <span>{ev.location}</span>
          </div>
        )}
        {ev.note && (
          <p className="ev-note" style={{ color: textNote }}>{ev.note}</p>
        )}
      </div>

      {ev.maps_link && (
        <a
          href={ev.maps_link} target="_blank" rel="noopener noreferrer"
          className="ev-btn inline-flex items-center font-bold rounded-lg shadow transition-all hover:scale-[1.03] active:scale-95 w-fit"
          style={{
            backgroundColor: onDark ? 'rgba(255,255,255,0.18)' : accent + '22',
            color: onDark ? '#ffffff' : accent,
            border: onDark ? '1px solid rgba(255,255,255,0.25)' : `1px solid ${accent}44`,
          }}
        >
          <MapPinIcon className="ev-btn-icon" />
          Lihat Peta
        </a>
      )}
    </div>
  );

  // ── Layout Content ───────────────────────────────────────────────────────
  const renderLayout = () => {
    switch (layoutTemplate) {
      case 'magazine_split':
        return (
          <div className="ev-magazine">
            <div className={`ev-mag-header ${getAnim(1)}`} style={{ borderColor: onDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb' }}>
              <span className="ev-mag-tag" style={{ color: accent }}>Informasi Sesi</span>
              <h3 className="ev-mag-title" style={{ color: onDark ? '#fff' : '#1f2937', fontFamily: `'${style.font_heading}',serif` }}>
                Detail Agenda
              </h3>
            </div>
            <div className="ev-list">
              {events.map((ev, i) => <Card key={ev.id || i} ev={ev} i={i} />)}
            </div>
          </div>
        );

      case 'timeline_minimal':
        return (
          <div className="ev-timeline">
            <div className="ev-timeline-line" style={{ backgroundColor: onDark ? '#ffffff' : accent }} />
            {events.map((ev, i) => (
              <div key={ev.id || i} className="ev-timeline-item">
                <div className="ev-timeline-dot" style={{ borderColor: accent }}>
                  <div style={{ width: '0.25rem', height: '0.25rem', borderRadius: '50%', backgroundColor: accent }} />
                </div>
                <Card ev={ev} i={i} />
              </div>
            ))}
          </div>
        );

      case 'compact_grid':
        return (
          <div className="ev-grid">
            {events.map((ev, i) => <Card key={ev.id || i} ev={ev} i={i} />)}
          </div>
        );

      default: // classic_list
        return (
          <div className="ev-list">
            {events.map((ev, i) => <Card key={ev.id || i} ev={ev} i={i} />)}
          </div>
        );
    }
  };

  // ── Root ─────────────────────────────────────────────────────────────────
  return (
    <div className="ev-root" style={{ backgroundColor: parentBgColor }}>
      {/* ── Scoped CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Keyframes ── */
        @keyframes animFadeIn   { from{opacity:0;}        to{opacity:1;} }
        @keyframes animFadeUp   { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes animFadeDown { from{opacity:0;transform:translateY(-18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes animZoomIn   { from{opacity:0;transform:scale(0.93);} to{opacity:1;transform:scale(1);} }
        @keyframes animTrackingWide { from{opacity:0;letter-spacing:-0.2em;filter:blur(4px);} to{opacity:1;} }
        @keyframes animSlideLeft  { from{opacity:0;transform:translateX(-28px);} to{opacity:1;transform:translateX(0);} }
        @keyframes animSlideRight { from{opacity:0;transform:translateX(28px);}  to{opacity:1;transform:translateX(0);} }
        @keyframes animBlurReveal { from{opacity:0;filter:blur(12px);transform:scale(0.96);} to{opacity:1;filter:blur(0);transform:scale(1);} }
        @keyframes animBounceSoft { 0%{opacity:0;transform:scale(0.6);} 60%{opacity:.9;transform:scale(1.05);} 100%{opacity:1;transform:scale(1);} }
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
        .delay-1{animation-delay:120ms;} .delay-2{animation-delay:240ms;} .delay-3{animation-delay:360ms;}
        .delay-4{animation-delay:480ms;} .delay-5{animation-delay:600ms;} .delay-6{animation-delay:720ms;}

        /* ── Root ── */
        .ev-root {
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

        /* ── Content wrapper ── */
        .ev-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 38rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: clamp(1rem,4dvh,2.5rem) clamp(0.85rem,4vw,1.75rem);
          gap: clamp(0.5rem,1.5dvh,1rem);
          max-height: 100%;
          overflow-y: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .ev-content::-webkit-scrollbar { display: none; }
        .ev-content.is-wide { max-width: 52rem; }

        /* ── Section label ── */
        .ev-label {
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-size: clamp(0.6rem,1.8vw,0.72rem);
          flex-shrink: 0;
        }

        /* ── Card ── */
        .ev-card {
          padding: clamp(0.65rem,2dvh,1.1rem) clamp(0.75rem,2.5vw,1.25rem);
          display: flex;
          flex-direction: column;
          gap: clamp(0.25rem,0.8dvh,0.5rem);
        }
        .ev-title {
          font-size: clamp(0.82rem,2.5vw,1rem);
          line-height: 1.3;
        }
        .ev-details {
          display: flex;
          flex-direction: column;
          gap: clamp(0.2rem,0.6dvh,0.4rem);
        }
        .ev-row {
          display: flex;
          align-items: center;
          gap: clamp(0.35rem,1.2vw,0.55rem);
          font-size: clamp(0.68rem,2vw,0.82rem);
          line-height: 1.4;
        }
        .ev-row-top { align-items: flex-start !important; }
        .ev-icon {
          width: clamp(0.75rem,2.2vw,0.95rem) !important;
          height: clamp(0.75rem,2.2vw,0.95rem) !important;
          flex-shrink: 0;
        }
        .ev-note {
          font-size: clamp(0.62rem,1.8vw,0.75rem);
          font-style: italic;
        }
        .ev-btn {
          gap: clamp(0.25rem,1vw,0.4rem);
          font-size: clamp(0.6rem,1.8vw,0.75rem);
          padding: clamp(0.25rem,0.8dvh,0.4rem) clamp(0.5rem,2vw,0.85rem);
          margin-top: clamp(0.2rem,0.6dvh,0.35rem);
        }
        .ev-btn-icon {
          width: clamp(0.65rem,1.8vw,0.85rem) !important;
          height: clamp(0.65rem,1.8vw,0.85rem) !important;
        }

        /* ── List layout ── */
        .ev-list {
          display: flex;
          flex-direction: column;
          gap: clamp(0.4rem,1.2dvh,0.75rem);
        }

        /* ── Grid layout ── */
        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
          gap: clamp(0.4rem,1.2dvh,0.75rem);
        }

        /* ── Magazine ── */
        .ev-magazine {
          display: flex;
          flex-direction: column;
          gap: clamp(0.5rem,1.5dvh,0.85rem);
        }
        .ev-mag-header {
          text-align: center;
          border-bottom: 1px solid;
          padding-bottom: clamp(0.4rem,1.2dvh,0.65rem);
          flex-shrink: 0;
        }
        .ev-mag-tag {
          font-size: clamp(0.55rem,1.6vw,0.68rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .ev-mag-title {
          font-size: clamp(0.9rem,3vw,1.35rem);
          font-weight: 800;
          line-height: 1.2;
          margin-top: 0.2em;
        }

        /* ── Timeline ── */
        .ev-timeline {
          position: relative;
          padding-left: clamp(1rem,4vw,1.75rem);
          display: flex;
          flex-direction: column;
          gap: clamp(0.4rem,1.2dvh,0.75rem);
        }
        .ev-timeline-line {
          position: absolute;
          left: clamp(0.3rem,1.2vw,0.5rem);
          top: 0.5rem;
          bottom: 0.5rem;
          width: 1.5px;
          opacity: 0.3;
        }
        .ev-timeline-item { position: relative; }
        .ev-timeline-dot {
          position: absolute;
          left: clamp(-1.05rem,-3.8vw,-0.85rem);
          top: clamp(0.7rem,2dvh,0.95rem);
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          border: 1.5px solid;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
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
        const isA = idx === activeSlide, isP = idx === (activeSlide - 1 + validSlides.length) % validSlides.length;
        let tr = 'scale(1)', op = 0, anim: string|undefined;
        if (slideshowAnim === 'fade') { op = isA ? 1 : 0; }
        else if (slideshowAnim === 'zoom') { op = isA ? 1 : 0; if (isA) anim = `bgKB ${slideshowDur+1}s ease-in-out infinite alternate`; }
        else { op = isA ? 1 : 0; tr = isA ? 'translateX(0)' : isP ? 'translateX(-100%)' : 'translateX(100%)'; }
        return (
          <div key={idx} className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${url})`, opacity: op, transform: tr, animation: anim,
              filter: `${bgImageGrayscale?'grayscale(100%)':''} ${bgImageBlur>0?`blur(${bgImageBlur}px)`:''}`.trim()||undefined,
              transition: slideshowAnim==='slide' ? 'transform 1s,opacity 1s' : 'opacity 1s,transform 1s' }} />
        );
      })}
      {isCustomBg && (overlayType === 'gradient'
        ? <div className="absolute inset-0 pointer-events-none z-[1]" style={{ backgroundImage: `linear-gradient(${overlayGradAng}deg,${hexAlpha(overlayColor,overlayOpacity)},${hexAlpha(overlayColor2,overlayOpacity2)})` }} />
        : <div className="absolute inset-0 pointer-events-none z-[1]" style={{ backgroundColor: overlayColor, opacity: overlayOpacity/100 }} />
      )}

      {/* ── Content ── */}
      <div className={`ev-content ${(layoutTemplate==='magazine_split'||layoutTemplate==='compact_grid') ? 'is-wide' : ''}`}>
        {layoutTemplate !== 'magazine_split' && (
          <p className="ev-label" style={{ color: labelColor }}>Detail Acara</p>
        )}
        {events.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.8rem', fontStyle: 'italic', color: textNote }}>
            Belum ada acara ditambahkan
          </p>
        )}
        {renderLayout()}
      </div>
    </div>
  );
}
