'use client';

import React, { useState } from 'react';
import { useBuilder } from './BuilderContext';
import type { BuilderSection } from './types';

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

export default function BuilderCanvas() {
  const { state, selectSection } = useBuilder();
  const { page, selectedSectionId } = state;
  const style = page.style as unknown as Record<string, string | number>;

  const [viewMode, setViewMode] = useState<'all' | 'opening' | 'inner'>('all');

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

  return (
    // Outer: fills remaining flex space, scrolls vertically
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-100 py-6 px-4 flex flex-col">
      
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

      {/* Phone-like frame — centered, max width, clips corners */}
      <div
        className="relative shadow-2xl rounded-3xl overflow-hidden mx-auto mb-8 flex-shrink-0 w-full"
        style={{
          maxWidth: `${page.style.page_width}px`,
          minHeight: '800px',
          backgroundColor: page.style.bg_color,
          color: page.style.text_color,
          fontFamily: `'${page.style.font_body}', sans-serif`,
        }}
      >
        {visibleSections.map(section => {
          const isSelected = section.id === selectedSectionId;
          return (
            <div
              key={section.id}
              className={`relative cursor-pointer transition-all ${!section.visible ? 'opacity-30' : ''}`}
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
              <SectionRenderer section={section} style={style} />
            </div>
          );
        })}

        {/* Bottom spacer */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-[10px] text-gray-300">papunda.com</p>
        </div>
      </div>
    </div>
  );
}
