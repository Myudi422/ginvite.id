'use client';

import React from 'react';
import type { BuilderPage, BuilderSection } from '@/components/builder/types';

// Section renderers (reuse dari builder)
import HeroPreview from '@/components/builder/previews/HeroPreview';
import CountdownPreview from '@/components/builder/previews/CountdownPreview';
import CouplePreview from '@/components/builder/previews/CouplePreview';
import EventDetailsPreview from '@/components/builder/previews/EventDetailsPreview';
import GalleryPreview from '@/components/builder/previews/GalleryPreview';
import QuotePreview from '@/components/builder/previews/QuotePreview';
import TextBlockPreview from '@/components/builder/previews/TextBlockPreview';
import MapsPreview from '@/components/builder/previews/MapsPreview';
import RsvpPreview from '@/components/builder/previews/RsvpPreview';
import GiftPreview from '@/components/builder/previews/GiftPreview';
import MusicPreview from '@/components/builder/previews/MusicPreview';
import OurStoryPreview from '@/components/builder/previews/OurStoryPreview';
import DividerPreview from '@/components/builder/previews/DividerPreview';
import SocialLinksPreview from '@/components/builder/previews/SocialLinksPreview';

interface Props {
  page: BuilderPage;
}

function SectionRenderer({ section, style }: { section: BuilderSection; style: Record<string, string | number> }) {
  const props = section.props as Record<string, unknown>;
  if (!section.visible) return null;
  switch (section.type) {
    case 'hero':          return <HeroPreview props={props} style={style} />;
    case 'countdown':     return <CountdownPreview props={props} style={style} />;
    case 'couple':        return <CouplePreview props={props} style={style} />;
    case 'event_details': return <EventDetailsPreview props={props} style={style} />;
    case 'gallery':       return <GalleryPreview props={props} style={style} />;
    case 'quote':         return <QuotePreview props={props} style={style} />;
    case 'text_block':    return <TextBlockPreview props={props} style={style} />;
    case 'maps':          return <MapsPreview props={props} style={style} />;
    case 'rsvp':          return <RsvpPreview props={props} style={style} />;
    case 'gift':          return <GiftPreview props={props} style={style} />;
    case 'music':         return <MusicPreview props={props} style={style} />;
    case 'our_story':     return <OurStoryPreview props={props} style={style} />;
    case 'divider':       return <DividerPreview props={props} style={style} />;
    case 'social_links':  return <SocialLinksPreview props={props} style={style} />;
    default: return null;
  }
}

export default function BuilderViewer({ page }: Props) {
  const sections = [...(page.sections || [])].sort((a, b) => a.order - b.order);
  const style = page.style as unknown as Record<string, string | number>;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: page.style.bg_color,
        color: page.style.text_color,
        fontFamily: `'${page.style.font_body}', sans-serif`,
      }}
    >
      {/* Centered 700px container */}
      <div
        className="mx-auto"
        style={{ maxWidth: `${page.style.page_width || 700}px` }}
      >
        {sections.map(section => (
          <SectionRenderer key={section.id} section={section} style={style} />
        ))}

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-[11px] text-gray-300">
            Dibuat dengan ❤️ oleh{' '}
            <a
              href="https://papunda.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 transition-opacity"
            >
              papunda.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
