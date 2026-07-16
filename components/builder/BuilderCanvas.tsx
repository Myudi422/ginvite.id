'use client';

import React from 'react';
import { useBuilder } from './BuilderContext';
import type { BuilderSection } from './types';
import BuilderNavigation from './ui/BuilderNavigation';

// ── Section Preview Renderers ─────────────────────────────────────────────────
import OpeningPreview from './previews/OpeningPreview';
import HeroPreview from './previews/HeroPreview';
import CountdownPreview from './previews/CountdownPreview';
import CouplePreview from './previews/CouplePreview';
import EventDetailsPreview from './previews/EventDetailsPreview';
import GalleryPreview from './previews/GalleryPreview';
import QuotePreview from './previews/QuotePreview';
import TextBlockPreview from './previews/TextBlockPreview';
import MapsPreview from './previews/MapsPreview';
import RsvpPreview from './previews/RsvpPreview';
import GiftPreview from './previews/GiftPreview';
import DresscodePreview from './previews/DresscodePreview';
import MusicPreview from './previews/MusicPreview';
import OurStoryPreview from './previews/OurStoryPreview';
import DividerPreview from './previews/DividerPreview';
import SocialLinksPreview from './previews/SocialLinksPreview';

function SectionRenderer({ section, style }: { section: BuilderSection; style: Record<string, string | number> }) {
  const props = section.props as Record<string, unknown>;
  switch (section.type) {
    case 'opening': return <OpeningPreview props={props} style={style} />;
    case 'hero': return <HeroPreview props={props} style={style} />;
    case 'countdown': return <CountdownPreview props={props} style={style} />;
    case 'couple': return <CouplePreview props={props} style={style} />;
    case 'event_details': return <EventDetailsPreview props={props} style={style} />;
    case 'gallery': return <GalleryPreview props={props} style={style} />;
    case 'quote': return <QuotePreview props={props} style={style} />;
    case 'text_block': return <TextBlockPreview props={props} style={style} />;
    case 'maps': return <MapsPreview props={props} style={style} />;
    case 'rsvp': return <RsvpPreview props={props} style={style} />;
    case 'gift': return <GiftPreview props={props} style={style} />;
    case 'dresscode': return <DresscodePreview props={props} style={style} />;
    case 'music': return <MusicPreview props={props} style={style} />;
    case 'our_story': return <OurStoryPreview props={props} style={style} />;
    case 'divider': return <DividerPreview props={props} style={style} />;
    case 'social_links': return <SocialLinksPreview props={props} style={style} />;
    default: return (
      <div className="py-6 text-center text-sm text-gray-400">
        Preview untuk &ldquo;{section.type}&rdquo; belum tersedia.
      </div>
    );
  }
}

// ── Section Wrapper with full-page snap ───────────────────────────────────────
function SectionSnapWrapper({
  section,
  style,
  selectedSectionId,
  selectSection,
}: {
  section: BuilderSection;
  style: Record<string, string | number>;
  selectedSectionId: string | null;
  selectSection: (id: string) => void;
}) {
  const isSelected = section.id === selectedSectionId;
  return (
    <div
      id={`section-${section.id}`}
      className={`relative cursor-pointer snap-section flex flex-col ${!section.visible ? 'opacity-30' : ''}`}
      style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always', minHeight: '100%' }}
      onClick={() => selectSection(section.id)}
    >
      {/* Highlight overlay on selected */}
      {isSelected && (
        <div className="absolute inset-0 ring-2 ring-pink-400 ring-inset z-10 pointer-events-none" />
      )}
      {/* Selection label */}
      {isSelected && (
        <div className="absolute top-0 left-0 z-20 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg pointer-events-none">
          {section.label}
        </div>
      )}
      {/* Hidden badge */}
      {!section.visible && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="bg-white/90 text-gray-500 text-xs px-3 py-1 rounded-full shadow border">Tersembunyi</span>
        </div>
      )}
      {/* Content fills full height */}
      <div className="flex-1 flex flex-col section-renderer-wrapper">
        <SectionRenderer section={section} style={style} />
      </div>
    </div>
  );
}

export default function BuilderCanvas() {
  const { state, selectSection, setViewMode } = useBuilder();
  const { page, selectedSectionId, viewMode } = state;
  const style = page.style as unknown as Record<string, string | number>;
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedSectionId && containerRef.current) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`section-${selectedSectionId}`);
        const container = containerRef.current;
        if (element && container) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedSectionId, viewMode]);

  // Sort sections by group first (opening always on top), then by order
  const sections = [...page.sections].sort((a, b) => {
    const groupA = a.group || (a.type === 'opening' ? 'opening' : 'inner');
    const groupB = b.group || (b.type === 'opening' ? 'opening' : 'inner');
    if (groupA !== groupB) {
      return groupA === 'opening' ? -1 : 1;
    }
    return a.order - b.order;
  });

  const visibleSections = sections.filter(s => {
    const group = s.group || (s.type === 'opening' ? 'opening' : 'inner');
    if (viewMode === 'all') return true;
    return group === viewMode;
  });

  const openingSection = sections.find(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) === 'opening');
  const innerSections = sections.filter(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) !== 'opening');
  const hasOpening = !!openingSection;

  const getLeftPaneData = () => {
    let names = '';
    const openingSection = page.sections?.find((s: any) => s.type === 'opening');
    const coupleSection = page.sections?.find((s: any) => s.type === 'couple');
    
    if (openingSection?.props?.name_primary) {
      const p = openingSection.props.name_primary;
      const s = openingSection.props.name_secondary;
      names = p + (s ? ` & ${s}` : '');
    } else if (coupleSection?.props?.person_a?.nickname || coupleSection?.props?.person_a?.name) {
      const pA = coupleSection.props.person_a?.nickname || coupleSection.props.person_a?.name;
      const pB = coupleSection.props.person_b?.nickname || coupleSection.props.person_b?.name;
      names = pA + (pB ? ` & ${pB}` : '');
    } else {
      names = page.page_title || page.slug || 'Save The Date';
    }

    let date = '';
    const countdownSection = page.sections?.find((s: any) => s.type === 'countdown');
    const eventDetailsSection = page.sections?.find((s: any) => s.type === 'event_details');
    const rawDate = countdownSection?.props?.event_date || eventDetailsSection?.props?.events?.[0]?.date;
    
    if (rawDate && typeof rawDate === 'string') {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          };
          date = d.toLocaleDateString('id-ID', options);
        } else {
          date = rawDate;
        }
      } catch {
        date = rawDate;
      }
    }

    let location = '';
    const mapsSection = page.sections?.find((s: any) => s.type === 'maps');
    location = eventDetailsSection?.props?.events?.[0]?.location || mapsSection?.props?.venue_name || mapsSection?.props?.locations?.[0]?.venue_name || '';

    return { names, date, location };
  };

  const renderLeftBackground = () => {
    const openingSection = page.sections?.find((s: any) => s.type === 'opening');
    if (!openingSection) return null;
    const props = openingSection.props as any;
    const bgType = props.bg_type || 'image';
    const bgImage = props.bg_image || '';
    const bgColor = props.bg_color || '';
    const bgColor2 = props.bg_color2 || '';
    const overlayColor = props.overlay_color || '#000000';
    const overlayOpacity = props.overlay_opacity ?? 50;

    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {bgType === 'solid' && (
          <div className="absolute inset-0" style={{ backgroundColor: bgColor || '#ffffff' }} />
        )}
        {bgType === 'gradient' && (
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(135deg, ${bgColor || '#ff7e5f'}, ${bgColor2 || '#feb47b'})` }} />
        )}
        {bgType === 'image' && bgImage && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        )}
        {bgType === 'slideshow' && props.bg_slideshow_images?.[0] && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${props.bg_slideshow_images[0]})` }} />
        )}
        {/* Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: (overlayOpacity / 100) * 0.4 }} />
      </div>
    );
  };

  const getContrastTextColor = () => {
    const text_color = (page.style.text_color as string) || '#1f2937';
    const openingSection = page.sections?.find((s: any) => s.type === 'opening');
    if (!openingSection) return text_color;
    
    const props = openingSection.props as any;
    const bgType = props.bg_type || 'image';
    const bgColor = props.bg_color || '';
    const overlayColor = props.overlay_color || '#000000';
    const overlayOpacity = props.overlay_opacity ?? 50;

    const isHexDark = (hex: string) => {
      if (!hex) return false;
      let clean = hex.replace('#', '').trim();
      if (clean.length === 3) {
        clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
      }
      if (clean.length !== 6) return false;
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq < 140;
    };

    if (bgType === 'image' || bgType === 'slideshow') {
      if (isHexDark(overlayColor) && overlayOpacity > 30) {
        return '#ffffff';
      }
      return '#1f2937';
    }

    if (bgType === 'gradient') {
      return isHexDark(bgColor) ? '#ffffff' : text_color;
    }
    
    return isHexDark(bgColor || (page.style.bg_color as string)) ? '#ffffff' : text_color;
  };

  const leftPaneData = getLeftPaneData();
  const contrastTextColor = getContrastTextColor();

  // Shared snap container style
  const snapContainerStyle: React.CSSProperties = {
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
    overflowY: 'auto',
  };

  return (
    // Outer: fills remaining flex space, scrolls vertically
    <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto bg-gray-100 py-6 px-4 flex flex-col">

      {/* ── Global CSS for snap + page-reveal ── */}
      <style>{`
        @keyframes pageReveal {
          from {
            clip-path: inset(100% 0 0 0);
            transform: translateY(6px);
          }
          to {
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .section-renderer-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1 1 0%;
          min-height: 100%;
        }
        .section-renderer-wrapper > div:not([style*="display: none"]),
        .section-renderer-wrapper > section {
          flex: 1 1 0% !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 100% !important;
          width: 100% !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
      `}</style>

      {/* ── View Toggle ── */}
      <div className="flex justify-center mb-6 flex-shrink-0 sticky top-0 z-50">
        <div className="bg-white p-1 rounded-xl shadow-md border border-gray-200 flex items-center gap-1">
          <button 
            onClick={() => setViewMode('opening')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'opening' ? 'bg-pink-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Sampul Depan
          </button>
          <button 
            onClick={() => setViewMode('inner')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'inner' ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Isi Undangan
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button 
            onClick={() => setViewMode('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Tampilkan Semua
          </button>
        </div>
      </div>

      {/* Responsive layout: split screen on desktop (lg:flex) when viewMode is 'all' and hasOpening is true */}
      {hasOpening && viewMode === 'all' ? (
        <>
          {/* Desktop Split View Container */}
          <div className="hidden lg:flex w-full max-w-6xl mx-auto mb-8 flex-shrink-0 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-150 relative h-[800px]">
            {/* Left pane: Static Cover (Desktop Left Cover Panel) */}
            <div 
              className="w-[60%] h-full flex flex-col items-center justify-center text-center p-8 select-none border-r border-gray-100 relative"
              style={{
                backgroundColor: page.style.bg_color,
                color: contrastTextColor,
                fontFamily: `'${page.style.font_body}', sans-serif`,
              }}
            >
              {renderLeftBackground()}
              
              <div className="max-w-md mx-auto flex flex-col items-center gap-6 relative z-10">
                <span className="text-xs tracking-[0.3em] uppercase opacity-75 font-semibold">
                  SAVE THE DATE
                </span>
                
                <h1 
                  className="text-4xl sm:text-5xl font-bold font-serif leading-tight py-2"
                  style={{ fontFamily: `'${page.style.font_heading || 'Playfair Display'}', serif` }}
                >
                  {leftPaneData.names}
                </h1>
                
                {leftPaneData.date && (
                  <p className="text-sm font-medium tracking-wide opacity-90">
                    {leftPaneData.date}
                  </p>
                )}
                
                {leftPaneData.location && (
                  <p className="text-xs tracking-wider opacity-75 uppercase">
                    {leftPaneData.location}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 opacity-50">
                  <span className="w-4 h-[1px] bg-current" />
                  <span className="text-xs">✦</span>
                  <span className="w-4 h-[1px] bg-current" />
                </div>
              </div>
            </div>

            {/* Right pane: Full-page snap scroll sections */}
            <div 
              className="w-[40%] h-full relative no-scrollbar"
              style={{
                ...snapContainerStyle,
                backgroundColor: page.style.bg_color,
                color: page.style.text_color,
                fontFamily: `'${page.style.font_body}', sans-serif`,
              }}
            >
              {visibleSections.map(section => (
                <SectionSnapWrapper
                  key={section.id}
                  section={section}
                  style={style}
                  selectedSectionId={selectedSectionId}
                  selectSection={selectSection}
                />
              ))}
            </div>

            {/* Middle Vertical Divider Line */}
            <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-white/20 z-30 pointer-events-none" />

            {/* Vertical Navigation Menu on Divider */}
            {page.style.nav_enabled !== false && (
              <BuilderNavigation 
                isVertical={true}
                items={innerSections.filter(s => s.visible && (page.style.nav_items ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id)) : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps', 'dresscode'].includes(s.type))).map(s => {
                  const navItemConfig = page.style.nav_items?.find((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id));
                  return { id: s.id, type: s.type, icon: navItemConfig?.icon, label: s.label };
                })}
                bgColor={page.style.nav_bg_color as string}
                bgColor2={page.style.nav_bg_color2 as string}
                bgType={page.style.nav_bg_type as 'solid' | 'gradient'}
                bgOpacity={page.style.nav_bg_opacity as number}
                activeColor={page.style.nav_active_color as string}
                inactiveColor={page.style.nav_inactive_color as string}
                accentColor={page.style.accent_color as string} 
              />
            )}
          </div>

          {/* Mobile view fallback wrapper */}
          <div className="lg:hidden w-full">
            {/* Phone-like frame: snap container */}
            <div
              className="relative shadow-2xl rounded-3xl overflow-hidden mx-auto mb-8 flex-shrink-0 w-full no-scrollbar"
              style={{
                ...snapContainerStyle,
                maxWidth: `${page.style.page_width}px`,
                height: '85dvh',
                backgroundColor: page.style.bg_color,
                color: page.style.text_color,
                fontFamily: `'${page.style.font_body}', sans-serif`,
              }}
            >
              {visibleSections.map(section => (
                <SectionSnapWrapper
                  key={section.id}
                  section={section}
                  style={style}
                  selectedSectionId={selectedSectionId}
                  selectSection={selectSection}
                />
              ))}
            </div>

            {page.style.nav_enabled !== false && viewMode !== 'opening' && (
              <BuilderNavigation 
                items={visibleSections.filter(s => s.visible && (page.style.nav_items ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id)) : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps', 'dresscode'].includes(s.type))).map(s => {
                  const navItemConfig = page.style.nav_items?.find((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id));
                  return { id: s.id, type: s.type, icon: navItemConfig?.icon, label: s.label };
                })}
                bgColor={page.style.nav_bg_color as string}
                bgColor2={page.style.nav_bg_color2 as string}
                bgType={page.style.nav_bg_type as 'solid' | 'gradient'}
                bgOpacity={page.style.nav_bg_opacity as number}
                activeColor={page.style.nav_active_color as string}
                inactiveColor={page.style.nav_inactive_color as string}
                accentColor={page.style.accent_color as string} 
              />
            )}
          </div>
        </>
      ) : (
        /* Single column snap viewport */
        <>
          <div
            className="relative shadow-2xl rounded-3xl overflow-hidden mx-auto mb-8 flex-shrink-0 w-full no-scrollbar"
            style={{
              ...snapContainerStyle,
              maxWidth: `${page.style.page_width}px`,
              height: '85dvh',
              backgroundColor: page.style.bg_color,
              color: page.style.text_color,
              fontFamily: `'${page.style.font_body}', sans-serif`,
            }}
          >
            {visibleSections.map(section => (
              <SectionSnapWrapper
                key={section.id}
                section={section}
                style={style}
                selectedSectionId={selectedSectionId}
                selectSection={selectSection}
              />
            ))}
          </div>

          {page.style.nav_enabled !== false && viewMode !== 'opening' && (
            <BuilderNavigation 
              items={visibleSections.filter(s => s.visible && (page.style.nav_items ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id)) : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps', 'dresscode'].includes(s.type))).map(s => {
                const navItemConfig = page.style.nav_items?.find((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id));
                return { id: s.id, type: s.type, icon: navItemConfig?.icon, label: s.label };
              })}
              bgColor={page.style.nav_bg_color as string}
              bgColor2={page.style.nav_bg_color2 as string}
              bgType={page.style.nav_bg_type as 'solid' | 'gradient'}
              bgOpacity={page.style.nav_bg_opacity as number}
              activeColor={page.style.nav_active_color as string}
              inactiveColor={page.style.nav_inactive_color as string}
              accentColor={page.style.accent_color as string} 
            />
          )}
        </>
      )}
    </div>
  );
}
