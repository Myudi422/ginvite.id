'use client';
import React, { useEffect, useState } from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function CountdownPreview({ props, style }: P) {
  const label = props.label as string || 'Menuju Hari-H';
  const eventDate = props.event_date as string || '';
  const eventTime = props.event_time as string || '00:00';

  // ── TICKING COUNTDOWN STATE ──
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let diff = { d: 0, h: 0, m: 0, s: 0 };
  if (eventDate) {
    const target = new Date(`${eventDate}T${eventTime || '00:00'}:00`).getTime();
    const ms = Math.max(0, target - now);
    diff = {
      d: Math.floor(ms / 86400000),
      h: Math.floor((ms % 86400000) / 3600000),
      m: Math.floor((ms % 3600000) / 60000),
      s: Math.floor((ms % 60000) / 1000)
    };
  }

  const accent = style.accent_color as string || '#e879a0';
  const displayUnits = (props.display_units as string) || 'd_h_m_s';
  const allBoxes = [
    { label: 'Hari', value: diff.d, key: 'd' },
    { label: 'Jam', value: diff.h, key: 'h' },
    { label: 'Menit', value: diff.m, key: 'm' },
    { label: 'Detik', value: diff.s, key: 's' },
  ];
  const boxes = allBoxes.filter(box => {
    if (displayUnits === 'd_h_m') return box.key !== 's';
    if (displayUnits === 'd_h') return box.key !== 'm' && box.key !== 's';
    if (displayUnits === 'd') return box.key === 'd';
    return true;
  });

  // ── BACKGROUND & OVERLAY PROPERTIES ──
  const bgType = props.bg_type as string || 'solid';
  const bgColor = props.bg_color as string || '';
  const bgColor2 = props.bg_color2 as string || '';
  const bgGradientAngle = props.bg_gradient_angle as number ?? 135;
  const bgImage = props.bg_image as string || '';
  const bgImageBlur = props.bg_image_blur as number ?? 0;
  const bgImageGrayscale = props.bg_image_grayscale as boolean ?? false;
  const slideshowImages = (props.bg_slideshow_images as string[]) || [];
  const slideshowAnimation = props.bg_slideshow_animation as string || 'fade';
  const slideshowDuration = props.bg_slideshow_duration as number ?? 5;

  const overlayType = props.overlay_type as string || 'solid';
  const overlayColor = props.overlay_color as string || '#000000';
  const overlayColor2 = props.overlay_color2 as string || '#000000';
  const overlayOpacity = props.overlay_opacity as number ?? 50;
  const overlayOpacity2 = props.overlay_opacity2 as number ?? 0;
  const overlayGradientAngle = props.overlay_gradient_angle as number ?? 180;
  const layoutTemplate = props.layout_template as string || 'classic';
  const animationPreset = props.animation_preset as string || 'none';

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // ── SLIDESHOW PLAYBACK ──
  const [activeSlide, setActiveSlide] = useState(0);
  const validSlides = slideshowImages.filter(Boolean);

  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % validSlides.length);
    }, slideshowDuration * 1000);
    return () => clearInterval(interval);
  }, [bgType, validSlides.length, slideshowDuration]);

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

  const isCustomBg = bgType !== 'solid';
  const parentBgColor = bgType === 'solid'
    ? (bgColor || (style.bg_color as string) || '#ffffff')
    : undefined;

  // Decide dynamic typography styles based on background
  const labelColorClass = isCustomBg ? "text-white/90 drop-shadow-md font-medium" : "text-gray-400";
  const sublabelColorClass = isCustomBg ? "text-white/80 drop-shadow-sm font-medium" : "text-gray-400";
  const italicTextColorClass = isCustomBg ? "text-white/70 italic drop-shadow-sm" : "text-gray-300 italic";

  // Dynamic contrast helpers for new layouts
  const itemBgStyle = isCustomBg 
    ? { background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)' } 
    : { background: 'rgba(0, 0, 0, 0.03)', borderColor: 'rgba(0, 0, 0, 0.08)' };
  
  const numberStyle = { color: isCustomBg ? '#ffffff' : accent };

  const renderCountdownLayout = () => {
    switch (layoutTemplate) {
      case 'modern_square':
        return (
          <div className="flex gap-2 flex-wrap justify-center w-full">
            {boxes.map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 animate-fade-in">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-semibold text-white shadow-sm border border-white/10"
                  style={{ backgroundColor: accent }}
                >
                  {String(b.value).padStart(2, '0')}
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${sublabelColorClass}`}>{b.label}</span>
              </div>
            ))}
          </div>
        );

      case 'glass_cards':
        return (
          <div className="flex gap-3.5 flex-wrap justify-center w-full">
            {boxes.map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 animate-fade-in">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg backdrop-blur-md border border-white/20"
                  style={{ background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15), ${accent}25)` }}
                >
                  {String(b.value).padStart(2, '0')}
                </div>
                <span className={`text-[9px] uppercase tracking-widest ${sublabelColorClass} font-semibold`}>{b.label}</span>
              </div>
            ))}
          </div>
        );

      case 'neo_brutalism':
        return (
          <div className="flex gap-4 flex-wrap justify-center w-full">
            {boxes.map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 animate-fade-in">
                <div
                  className="w-16 h-16 rounded-none flex items-center justify-center text-2xl font-black text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]"
                  style={{ backgroundColor: accent }}
                >
                  {String(b.value).padStart(2, '0')}
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wide ${isCustomBg ? 'text-white drop-shadow-sm' : 'text-slate-800'}`}>{b.label}</span>
              </div>
            ))}
          </div>
        );

      case 'minimal_split':
        return (
          <div className="flex gap-4 items-center justify-center w-full">
            {boxes.map((b, idx) => (
              <React.Fragment key={b.label}>
                <div className="flex flex-col items-center animate-fade-in">
                  <span 
                    className="text-3xl font-light tracking-tight" 
                    style={{ color: isCustomBg ? '#ffffff' : accent }}
                  >
                    {String(b.value).padStart(2, '0')}
                  </span>
                  <span className={`text-[9px] uppercase tracking-widest font-semibold ${sublabelColorClass}`}>{b.label}</span>
                </div>
                {idx < boxes.length - 1 && (
                  <span 
                    className="text-xl font-light opacity-50 relative -top-2" 
                    style={{ color: isCustomBg ? '#ffffff' : accent }}
                  >
                    :
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        );

      case 'circular_ring':
        return (
          <div className="flex gap-3 flex-wrap justify-center w-full">
            {boxes.map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 animate-fade-in">
                <div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl font-extrabold bg-transparent backdrop-blur-[1px]"
                  style={{ 
                    borderColor: isCustomBg ? '#ffffffcc' : accent,
                    color: isCustomBg ? '#ffffff' : accent
                  }}
                >
                  {String(b.value).padStart(2, '0')}
                </div>
                <span className={`text-[10px] ${sublabelColorClass}`}>{b.label}</span>
              </div>
            ))}
          </div>
        );

      case 'grid_2x2':
        const gridCols = boxes.length === 3 
          ? 'grid-cols-3 max-w-[360px]' 
          : boxes.length === 1 
            ? 'grid-cols-1 max-w-[140px]' 
            : 'grid-cols-2 max-w-[240px]';
        return (
          <div className={`grid ${gridCols} gap-3 mx-auto w-full justify-items-center animate-fade-in`}>
            {boxes.map(b => (
              <div 
                key={b.label} 
                className="w-full flex items-center justify-between p-3 rounded-2xl border shadow-sm"
                style={itemBgStyle}
              >
                <div className="flex flex-col">
                  <span className={`text-[9px] uppercase tracking-widest font-extrabold ${sublabelColorClass}`}>{b.label}</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tight" style={numberStyle}>
                  {String(b.value).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        );

      case 'inline_bar':
        return (
          <div 
            className="flex items-center justify-center gap-1.5 flex-wrap w-full py-2.5 px-4 rounded-full border shadow-sm animate-fade-in"
            style={itemBgStyle}
          >
            {boxes.map((b, idx) => (
              <React.Fragment key={b.label}>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight" style={numberStyle}>
                    {String(b.value).padStart(2, '0')}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider font-extrabold ${sublabelColorClass}`}>{b.label}</span>
                </div>
                {idx < boxes.length - 1 && (
                  <span className="opacity-20 text-xs mx-0.5" style={{ color: isCustomBg ? '#ffffff' : '#000000' }}>•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        );



      case 'classic':
      default:
        return (
          <div className="flex gap-3 flex-wrap justify-center w-full">
            {boxes.map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 animate-fade-in">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md backdrop-blur-[2px]"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}
                >
                  {String(b.value).padStart(2, '0')}
                </div>
                <span className={`text-[10px] ${sublabelColorClass}`}>{b.label}</span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div
      className="relative py-12 px-8 flex flex-col items-center gap-6 overflow-hidden w-full animate-fade-in duration-300"
      style={{ backgroundColor: parentBgColor }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes countdownKenburns {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.12); }
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
      `}} />

      {/* ── BACKGROUND LAYERS ── */}
      {bgType === 'gradient' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${bgGradientAngle}deg, ${bgColor || '#ff7e5f'}, ${bgColor2 || '#feb47b'})`
          }}
        />
      )}

      {(bgType === 'image' && bgImage) && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: `${bgImageGrayscale ? 'grayscale(100%)' : ''} ${bgImageBlur > 0 ? `blur(${bgImageBlur}px)` : ''}`.trim() || undefined,
            transform: bgImageBlur > 0 ? 'scale(1.05)' : 'scale(1)'
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
            transformStr = 'scale(1.05)';
          }
        } else if (slideshowAnimation === 'zoom') {
          opacityVal = isActive ? 1 : 0;
          if (isActive) {
            animationStr = `countdownKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`;
          }
          if (bgImageBlur > 0) {
            transformStr = 'scale(1.05)';
          }
        } else if (slideshowAnimation === 'slide') {
          opacityVal = isActive ? 1 : 0;
          if (isActive) {
            transformStr = bgImageBlur > 0 ? 'translateX(0) scale(1.05)' : 'translateX(0)';
          } else if (isPrevious) {
            transformStr = bgImageBlur > 0 ? 'translateX(-100%) scale(1.05)' : 'translateX(-100%)';
          } else {
            transformStr = bgImageBlur > 0 ? 'translateX(100%) scale(1.05)' : 'translateX(100%)';
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

      {/* ── OVERLAY LAYER ── */}
      {isCustomBg && (
        overlayType === 'gradient' ? (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage: `linear-gradient(${overlayGradientAngle}deg, ${getHexWithOpacity(overlayColor, overlayOpacity)}, ${getHexWithOpacity(overlayColor2, overlayOpacity2)})`
            }}
          />
        ) : (
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity / 100
            }}
          />
        )
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full">
        {layoutTemplate === 'split_editorial' ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 w-full justify-between max-w-sm mx-auto text-left py-2">
            <div className={`flex flex-col justify-center sm:w-1/3 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 sm:pr-4 ${getAnimClass(1)}`}>
              <span className="text-[9px] uppercase tracking-widest text-pink-500 font-extrabold">Hitung Mundur</span>
              <h3 className={`text-xs font-semibold tracking-wider uppercase mt-1 leading-snug ${labelColorClass}`}>{label}</h3>
            </div>
            <div className={`grid ${boxes.length === 3 ? 'grid-cols-3' : boxes.length === 1 ? 'grid-cols-1 max-w-[120px]' : 'grid-cols-2'} gap-3 flex-1 justify-center w-full max-w-[240px] sm:max-w-none ${getAnimClass(2)}`}>
              {boxes.map(b => (
                <div 
                  key={b.label} 
                  className="flex flex-col p-2.5 rounded-xl border backdrop-blur-md text-center shadow-sm"
                  style={itemBgStyle}
                >
                  <span className="text-2xl font-bold tracking-tight" style={numberStyle}>
                    {String(b.value).padStart(2, '0')}
                  </span>
                  <span className={`text-[8px] uppercase tracking-widest ${sublabelColorClass}`}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : layoutTemplate === 'title_bottom' ? (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className={`flex gap-3 flex-wrap justify-center w-full ${getAnimClass(1)}`}>
              {boxes.map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 animate-fade-in">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm backdrop-blur-md border"
                    style={{ 
                      ...itemBgStyle,
                      ...numberStyle
                    }}
                  >
                    {String(b.value).padStart(2, '0')}
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider ${sublabelColorClass}`}>{b.label}</span>
                </div>
              ))}
            </div>
            <div className={`w-12 h-px bg-white/20 my-1 ${getAnimClass(2)}`} />
            <p className={`text-[11px] tracking-widest uppercase font-semibold ${labelColorClass} ${getAnimClass(3)}`}>{label}</p>
          </div>
        ) : (
          <>
            <p className={`text-xs tracking-widest uppercase ${labelColorClass} ${getAnimClass(1)}`}>{label}</p>
            <div className={`w-full flex justify-center ${getAnimClass(2)}`}>
              {renderCountdownLayout()}
            </div>
          </>
        )}
        {!eventDate && <p className={`text-xs ${italicTextColorClass} ${getAnimClass(4)}`}>Tanggal belum diisi</p>}
      </div>
    </div>
  );
}
