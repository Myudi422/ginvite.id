'use client';

import React from 'react';
import { useBuilder } from './BuilderContext';
import { XIcon, SettingsIcon } from 'lucide-react';

// Section-specific editors
import HeroEditor from './editors/HeroEditor';
import CountdownEditor from './editors/CountdownEditor';
import CoupleEditor from './editors/CoupleEditor';
import EventDetailsEditor from './editors/EventDetailsEditor';
import GalleryEditor from './editors/GalleryEditor';
import QuoteEditor from './editors/QuoteEditor';
import TextBlockEditor from './editors/TextBlockEditor';
import MapsEditor from './editors/MapsEditor';
import RsvpEditor from './editors/RsvpEditor';
import GiftEditor from './editors/GiftEditor';
import MusicEditor from './editors/MusicEditor';
import OurStoryEditor from './editors/OurStoryEditor';
import DividerEditor from './editors/DividerEditor';
import SocialLinksEditor from './editors/SocialLinksEditor';
import type { SectionType } from './types';

const EDITORS: Record<SectionType, React.ComponentType<{ props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }>> = {
  hero: HeroEditor,
  countdown: CountdownEditor,
  couple: CoupleEditor,
  event_details: EventDetailsEditor,
  gallery: GalleryEditor,
  quote: QuoteEditor,
  text_block: TextBlockEditor,
  maps: MapsEditor,
  rsvp: RsvpEditor,
  gift: GiftEditor,
  music: MusicEditor,
  our_story: OurStoryEditor,
  divider: DividerEditor,
  social_links: SocialLinksEditor,
};

export default function PropertiesPanel() {
  const { state, selectSection, updateSectionProps } = useBuilder();
  const { page, selectedSectionId } = state;

  const section = page.sections.find(s => s.id === selectedSectionId);

  if (!section) {
    return (
      <div className="w-80 min-w-[280px] h-full min-h-0 border-l border-gray-100 bg-white flex flex-col items-center justify-center gap-3 p-6">
        <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center">
          <SettingsIcon className="h-6 w-6 text-pink-300" />
        </div>
        <p className="text-sm font-semibold text-gray-400 text-center">Klik seksi pada canvas<br />untuk mengubah isinya</p>
      </div>
    );
  }

  const Editor = EDITORS[section.type];

  return (
    <div className="w-80 min-w-[280px] h-full min-h-0 border-l border-gray-100 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Edit Seksi</p>
          <p className="text-sm font-bold text-gray-800 truncate">{section.label}</p>
        </div>
        <button
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
          onClick={() => selectSection(null)}
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        {Editor ? (
          <Editor
            props={section.props}
            onChange={(newProps) => updateSectionProps(section.id, newProps)}
          />
        ) : (
          <div className="p-6 text-center text-xs text-gray-400">Editor untuk tipe ini belum tersedia.</div>
        )}
      </div>
    </div>
  );
}
