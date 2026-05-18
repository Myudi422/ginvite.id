// components/builder/types.ts

export type EventType = 'pernikahan' | 'ulang_tahun' | 'khitanan' | 'custom';

export type SectionType =
  | 'hero'
  | 'countdown'
  | 'couple'
  | 'event_details'
  | 'gallery'
  | 'our_story'
  | 'rsvp'
  | 'gift'
  | 'maps'
  | 'music'
  | 'quote'
  | 'text_block'
  | 'divider'
  | 'social_links';

export interface BuilderSection {
  id: string;            // unique uuid
  type: SectionType;
  label: string;
  visible: boolean;
  order: number;
  props: Record<string, unknown>;  // section-specific data
}

export interface BuilderPage {
  id?: number;
  slug: string;
  user_id: number;
  event_type: EventType;
  title: string;         // undangan name / slug
  page_title: string;   // display title shown on page
  
  // Global style
  style: {
    bg_color: string;
    text_color: string;
    accent_color: string;
    font_body: string;
    font_heading: string;
    page_width: number; // default 700
  };

  sections: BuilderSection[];
  
  // meta
  created_at?: string;
  updated_at?: string;
}

// ── Section Prop Interfaces ───────────────────────────────────────────────────

export interface HeroProps {
  bg_image: string;
  overlay_opacity: number;
  couple_photo: string;
  greeting: string;       // e.g. "The Wedding of"
  name_primary: string;
  name_secondary: string;
  show_scroll_hint: boolean;
}

export interface CountdownProps {
  event_date: string;     // ISO date
  event_time: string;
  label: string;
}

export interface CoupleProps {
  person_a: {
    name: string;
    nickname: string;
    photo: string;
    parent_father: string;
    parent_mother: string;
    instagram: string;
  };
  person_b: {
    name: string;
    nickname: string;
    photo: string;
    parent_father: string;
    parent_mother: string;
    instagram: string;
  };
  layout: 'side_by_side' | 'stacked';
}

export interface EventDetailsProps {
  events: Array<{
    id: string;
    name: string;
    date: string;
    time: string;
    location: string;
    maps_link: string;
    note: string;
  }>;
}

export interface GalleryProps {
  images: string[];
  layout: 'grid' | 'masonry' | 'slider';
  columns: 2 | 3;
}

export interface OurStoryProps {
  items: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    image: string;
  }>;
}

export interface RsvpProps {
  enabled: boolean;
  deadline: string;
}

export interface GiftProps {
  enabled: boolean;
  banks: Array<{
    id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
  }>;
}

export interface MapsProps {
  maps_url: string;
  embed_url: string;
  label: string;
}

export interface MusicProps {
  url: string;
  autoplay: boolean;
}

export interface QuoteProps {
  text: string;
  source: string;
}

export interface TextBlockProps {
  heading: string;
  body: string;
  align: 'left' | 'center' | 'right';
}

export interface DividerProps {
  style: 'line' | 'floral' | 'dots' | 'wave';
  color: string;
}

export interface SocialLinksProps {
  links: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
}
