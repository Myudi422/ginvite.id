// components/builder/types.ts

export type EventType = 'pernikahan' | 'ulang_tahun' | 'khitanan' | 'custom';

export type SectionType =
  | 'opening'
  | 'hero'
  | 'countdown'
  | 'couple'
  | 'event_details'
  | 'gallery'
  | 'our_story'
  | 'rsvp'
  | 'gift'
  | 'dresscode'
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
  group?: 'opening' | 'inner'; // Halaman Opening vs Halaman Dalam
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
    music_enabled?: boolean;
    music_url?: string;
    music_autoplay?: boolean;
    nav_enabled?: boolean;
    nav_items?: { id: string; icon: string }[];
    nav_bg_type?: 'solid' | 'gradient';
    nav_bg_color?: string;
    nav_bg_color2?: string;
    nav_bg_opacity?: number;
    nav_active_color?: string;
    nav_inactive_color?: string;
  };

  sections: BuilderSection[];
  
  // meta
  created_at?: string;
  updated_at?: string;
}

// ── Section Prop Interfaces ───────────────────────────────────────────────────

export interface OpeningProps {
  title: string;          // e.g., "The Wedding Of", "Walimatul Khitan"
  name_primary: string;
  name_secondary: string;
  names_size: number;
  greeting_text: string;  // e.g., "Tanpa Mengurangi Rasa Hormat..."
  to_label: string;       // e.g., "Kepada Yth. Bapak/Ibu/Saudara/i"
  button_text: string;    // e.g., "Buka Undangan"
  bg_image: string;
  overlay_opacity: number;
  show_qr: boolean;
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  layout_template?: 'classic' | 'modern_split' | 'card_glass' | 'elegant_bottom' | 'netflix_style' | 'royal_vintage' | 'minimal_top' | 'block_asymmetric' | 'luxury_magazine';
  bg_color?: string;
  bg_color2?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];
  animation_preset?: 'none' | 'fade_in' | 'fade_up' | 'fade_down' | 'zoom_in' | 'tracking_wide' | 'slide_left' | 'slide_right' | 'blur_reveal' | 'bounce_soft';
  open_animation?: 'none' | 'slide_up' | 'slide_down' | 'fade_out' | 'zoom_fade' | 'zoom_in_fade' | 'split_vertical' | 'split_horizontal' | 'door_open';
}

export interface HeroProps {
  bg_image: string;
  overlay_opacity: number;
  couple_photo: string;
  greeting: string;       // e.g. "The Wedding of"
  name_primary: string;
  name_secondary: string;
  show_scroll_hint: boolean;
  
  // Unified background/overlay settings from OpeningProps
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  bg_color?: string;
  bg_color2?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];
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
  layout_template?: 'classic' | 'card' | 'minimal' | 'floating';
  animation_preset?: 'none' | 'fade_in' | 'fade_up' | 'fade_down' | 'zoom_in' | 'tracking_wide' | 'slide_left' | 'slide_right' | 'blur_reveal' | 'bounce_soft';
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  bg_color?: string;
  bg_color2?: string;
  bg_gradient_angle?: number;
  bg_image?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity?: number;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];
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
  title?: string;
  layout_template?: 'classic' | 'card' | 'minimal' | 'floating';
  animation_preset?: 'none' | 'fade_in' | 'fade_up' | 'fade_down' | 'zoom_in' | 'tracking_wide' | 'slide_left' | 'slide_right' | 'blur_reveal' | 'bounce_soft';
  initial_comments?: number;
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  bg_color?: string;
  bg_color2?: string;
  bg_gradient_angle?: number;
  bg_image?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity?: number;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];
}

export interface GiftProps {
  enabled: boolean;
  title?: string;
  layout_template?: 'classic' | 'card' | 'minimal' | 'floating';
  animation_preset?: 'none' | 'fade_in' | 'fade_up' | 'fade_down' | 'zoom_in' | 'tracking_wide' | 'slide_left' | 'slide_right' | 'blur_reveal' | 'bounce_soft';
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  bg_color?: string;
  bg_color2?: string;
  bg_gradient_angle?: number;
  bg_image?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity?: number;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];

  banks: Array<{
    id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
  }>;

  address_enabled?: boolean;
  address_title?: string;
  address_recipient?: string;
  address_text?: string;
  address_phone?: string;
}

export interface MapsProps {
  label: string;
  locations?: Array<{
    id: string;
    label: string;
    venue_name: string;
    venue_address: string;
    maps_url: string;
    button_text: string;
  }>;
  maps_url?: string;
  venue_name?: string;
  venue_address?: string;
  button_text?: string;
}

export interface MusicProps {
  url: string;
  autoplay: boolean;
}

export interface QuoteProps {
  text: string;
  source: string;
  layout_template?: 'classic' | 'card' | 'minimal' | 'floating';
  animation_preset?: 'none' | 'fade_in' | 'fade_up' | 'fade_down' | 'zoom_in' | 'tracking_wide' | 'slide_left' | 'slide_right' | 'blur_reveal' | 'bounce_soft';
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  bg_color?: string;
  bg_color2?: string;
  bg_gradient_angle?: number;
  bg_image?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity?: number;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];
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

export interface DresscodeProps {
  enabled: boolean;
  title?: string;
  description?: string;
  layout_template?: 'classic' | 'card' | 'minimal' | 'floating';
  animation_preset?: 'none' | 'fade_in' | 'fade_up' | 'fade_down' | 'zoom_in' | 'tracking_wide' | 'slide_left' | 'slide_right' | 'blur_reveal' | 'bounce_soft';
  bg_type?: 'solid' | 'gradient' | 'image' | 'slideshow';
  bg_color?: string;
  bg_color2?: string;
  bg_gradient_angle?: number;
  bg_image?: string;
  bg_image_blur?: number;
  bg_image_grayscale?: boolean;
  bg_slideshow_images?: string[];
  bg_slideshow_animation?: 'fade' | 'zoom' | 'slide';
  bg_slideshow_duration?: number;
  overlay_type?: 'solid' | 'gradient';
  overlay_color?: string;
  overlay_color2?: string;
  overlay_opacity?: number;
  overlay_opacity2?: number;
  overlay_gradient_angle?: number;
  bg_new_uploaded_images?: string[];

  items: Array<{
    id: string;
    name: string;
    description: string;
    colors: string[];
    image?: string;
  }>;
}
