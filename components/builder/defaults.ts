// components/builder/defaults.ts
import { v4 as uuidv4 } from 'uuid';
import type { BuilderSection, BuilderPage, EventType } from './types';

export function makeId() {
  return uuidv4();
}

// ── Per-event default section stacks ─────────────────────────────────────────
export const DEFAULT_SECTIONS: Record<EventType, BuilderSection[]> = {
  pernikahan: [
    {
      id: makeId(), type: 'opening', label: 'Sampul Depan', visible: true, order: 0, group: 'opening',
      props: { title: 'The Wedding Of', name_primary: 'Nama Pengantin Pria', name_secondary: 'Nama Pengantin Wanita', names_size: 36, greeting_text: 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang', to_label: 'Kepada Yth. Bapak/Ibu/Saudara/i', button_text: 'Buka Undangan', bg_type: 'solid', bg_color: '#7e0758', bg_image: '', overlay_opacity: 0, show_qr: false, layout_template: 'classic', open_animation: 'slide_up' },
    },
    {
      id: makeId(), type: 'hero', label: 'Hero / Cover Dalam', visible: true, order: 1, group: 'inner',
      props: { bg_image: '', overlay_opacity: 0.4, couple_photo: '', greeting: 'The Wedding of', name_primary: 'Nama Pengantin Pria', name_secondary: 'Nama Pengantin Wanita', show_scroll_hint: true },
    },
    {
      id: makeId(), type: 'couple', label: 'Profil Pasangan', visible: true, order: 1,
      props: {
        layout: 'side_by_side',
        person_a: { name: '', nickname: '', photo: '', parent_father: '', parent_mother: '', instagram: '' },
        person_b: { name: '', nickname: '', photo: '', parent_father: '', parent_mother: '', instagram: '' },
      },
    },
    {
      id: makeId(), type: 'event_details', label: 'Detail Acara', visible: true, order: 2,
      props: {
        events: [
          { id: makeId(), name: 'Akad Nikah', date: '', time: '', location: '', maps_link: '', note: '' },
          { id: makeId(), name: 'Resepsi', date: '', time: '', location: '', maps_link: '', note: '' },
        ],
      },
    },
    {
      id: makeId(), type: 'countdown', label: 'Hitung Mundur', visible: true, order: 3,
      props: { event_date: '', event_time: '10:00', label: 'Menuju Hari Bahagia' },
    },
    {
      id: makeId(), type: 'gallery', label: 'Galeri Foto', visible: true, order: 4,
      props: { images: [], layout: 'grid', columns: 3 },
    },
    {
      id: makeId(), type: 'our_story', label: 'Kisah Kami', visible: false, order: 5,
      props: { items: [] },
    },
    {
      id: makeId(), type: 'maps', label: 'Peta Lokasi', visible: true, order: 6,
      props: {
        label: 'Lokasi Acara',
        locations: [
          { id: makeId(), label: 'Lokasi Acara', venue_name: '', venue_address: '', maps_url: '', button_text: 'Buka Google Maps' }
        ]
      },
    },
    {
      id: makeId(), type: 'rsvp', label: 'RSVP', visible: true, order: 7,
      props: { enabled: true, deadline: '', title: '', layout_template: 'classic', animation_preset: 'none', bg_type: 'solid', bg_color: '#ffffff', initial_comments: 5 },
    },
    {
      id: makeId(), type: 'gift', label: 'Hadiah / Gift', visible: false, order: 8,
      props: {
        enabled: false,
        title: '',
        layout_template: 'classic',
        animation_preset: 'none',
        bg_type: 'solid',
        bg_color: '#ffffff',
        banks: [],
        address_enabled: false,
        address_title: '',
        address_recipient: '',
        address_text: '',
        address_phone: '',
      },
    },
    {
      id: makeId(), type: 'quote', label: 'Kutipan', visible: true, order: 9,
      props: {
        text: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu..."',
        source: 'QS. Ar-Rum: 21',
        layout_template: 'classic',
        animation_preset: 'none',
        bg_type: 'solid',
        bg_color: '#ffffff',
      },
    },
  ],

  ulang_tahun: [
    {
      id: makeId(), type: 'opening', label: 'Sampul Depan', visible: true, order: 0, group: 'opening',
      props: { title: 'You Are Invited', name_primary: 'Nama Pemilik Acara', name_secondary: '', names_size: 36, greeting_text: 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang', to_label: 'Kepada Yth. Bapak/Ibu/Saudara/i', button_text: 'Buka Undangan', bg_type: 'solid', bg_color: '#7e0758', bg_image: '', overlay_opacity: 0, show_qr: false, layout_template: 'classic', open_animation: 'slide_up' },
    },
    {
      id: makeId(), type: 'hero', label: 'Hero / Cover Dalam', visible: true, order: 1, group: 'inner',
      props: { bg_image: '', overlay_opacity: 0.35, couple_photo: '', greeting: '🎉 Happy Birthday!', name_primary: 'Nama Pemilik Acara', name_secondary: '', show_scroll_hint: true },
    },
    {
      id: makeId(), type: 'countdown', label: 'Hitung Mundur', visible: true, order: 1,
      props: { event_date: '', event_time: '17:00', label: 'Menuju Hari Ulang Tahun' },
    },
    {
      id: makeId(), type: 'event_details', label: 'Detail Acara', visible: true, order: 2,
      props: {
        events: [
          { id: makeId(), name: 'Pesta Ulang Tahun', date: '', time: '', location: '', maps_link: '', note: '' },
        ],
      },
    },
    {
      id: makeId(), type: 'gallery', label: 'Galeri Foto', visible: true, order: 3,
      props: { images: [], layout: 'grid', columns: 3 },
    },
    {
      id: makeId(), type: 'maps', label: 'Peta Lokasi', visible: true, order: 4,
      props: {
        label: 'Lokasi Pesta',
        locations: [
          { id: makeId(), label: 'Lokasi Pesta', venue_name: '', venue_address: '', maps_url: '', button_text: 'Buka Google Maps' }
        ]
      },
    },
    {
      id: makeId(), type: 'rsvp', label: 'RSVP', visible: true, order: 5,
      props: { enabled: true, deadline: '', title: '', layout_template: 'classic', animation_preset: 'none', bg_type: 'solid', bg_color: '#ffffff', initial_comments: 5 },
    },
    {
      id: makeId(), type: 'gift', label: 'Hadiah', visible: true, order: 6,
      props: {
        enabled: true,
        title: '',
        layout_template: 'classic',
        animation_preset: 'none',
        bg_type: 'solid',
        bg_color: '#ffffff',
        banks: [],
        address_enabled: false,
        address_title: '',
        address_recipient: '',
        address_text: '',
        address_phone: '',
      },
    },
    {
      id: makeId(), type: 'quote', label: 'Pesan Ucapan', visible: true, order: 7,
      props: {
        text: '"Semoga panjang umur, sehat selalu, dan bahagia selamanya!"',
        source: '',
        layout_template: 'classic',
        animation_preset: 'none',
        bg_type: 'solid',
        bg_color: '#ffffff',
      },
    },
  ],

  khitanan: [
    {
      id: makeId(), type: 'opening', label: 'Sampul Depan', visible: true, order: 0, group: 'opening',
      props: { title: 'Walimatul Khitan', name_primary: 'Nama Anak', name_secondary: '', names_size: 36, greeting_text: 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang', to_label: 'Kepada Yth. Bapak/Ibu/Saudara/i', button_text: 'Buka Undangan', bg_type: 'solid', bg_color: '#7e0758', bg_image: '', overlay_opacity: 0, show_qr: false, layout_template: 'classic', open_animation: 'slide_up' },
    },
    {
      id: makeId(), type: 'hero', label: 'Hero / Cover Dalam', visible: true, order: 1, group: 'inner',
      props: { bg_image: '', overlay_opacity: 0.35, couple_photo: '', greeting: '🤲 Bismillah...', name_primary: 'Nama Anak', name_secondary: '', show_scroll_hint: true },
    },
    {
      id: makeId(), type: 'countdown', label: 'Hitung Mundur', visible: true, order: 1,
      props: { event_date: '', event_time: '09:00', label: 'Menuju Hari Khitanan' },
    },
    {
      id: makeId(), type: 'event_details', label: 'Detail Acara', visible: true, order: 2,
      props: {
        events: [
          { id: makeId(), name: 'Acara Khitanan', date: '', time: '', location: '', maps_link: '', note: '' },
        ],
      },
    },
    {
      id: makeId(), type: 'gallery', label: 'Galeri Foto', visible: true, order: 3,
      props: { images: [], layout: 'grid', columns: 3 },
    },
    {
      id: makeId(), type: 'maps', label: 'Peta Lokasi', visible: true, order: 4,
      props: {
        label: 'Lokasi Acara',
        locations: [
          { id: makeId(), label: 'Lokasi Acara', venue_name: '', venue_address: '', maps_url: '', button_text: 'Buka Google Maps' }
        ]
      },
    },
    {
      id: makeId(), type: 'rsvp', label: 'RSVP', visible: true, order: 5,
      props: { enabled: true, deadline: '', title: '', layout_template: 'classic', animation_preset: 'none', bg_type: 'solid', bg_color: '#ffffff', initial_comments: 5 },
    },
    {
      id: makeId(), type: 'gift', label: 'Hadiah', visible: false, order: 6,
      props: {
        enabled: false,
        title: '',
        layout_template: 'classic',
        animation_preset: 'none',
        bg_type: 'solid',
        bg_color: '#ffffff',
        banks: [],
        address_enabled: false,
        address_title: '',
        address_recipient: '',
        address_text: '',
        address_phone: '',
      },
    },
    {
      id: makeId(), type: 'quote', label: 'Kutipan / Doa', visible: true, order: 7,
      props: {
        text: '"Sesungguhnya anak adalah anugerah terindah dari Allah SWT."',
        source: '',
        layout_template: 'classic',
        animation_preset: 'none',
        bg_type: 'solid',
        bg_color: '#ffffff',
      },
    },
  ],

  custom: [
    {
      id: makeId(), type: 'opening', label: 'Sampul Depan', visible: true, order: 0, group: 'opening',
      props: { title: 'Undangan Spesial', name_primary: 'Nama Acara', name_secondary: '', names_size: 36, greeting_text: 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang', to_label: 'Kepada Yth. Bapak/Ibu/Saudara/i', button_text: 'Buka Undangan', bg_type: 'solid', bg_color: '#7e0758', bg_image: '', overlay_opacity: 0, show_qr: false, layout_template: 'classic', open_animation: 'slide_up' },
    },
    {
      id: makeId(), type: 'hero', label: 'Hero / Cover Dalam', visible: true, order: 1, group: 'inner',
      props: { bg_image: '', overlay_opacity: 0.4, couple_photo: '', greeting: 'Selamat Datang di', name_primary: 'Nama Acara', name_secondary: '', show_scroll_hint: true },
    },
    {
      id: makeId(), type: 'text_block', label: 'Teks Bebas', visible: true, order: 1,
      props: { heading: 'Tentang Acara', body: 'Tulis deskripsi acaramu di sini...', align: 'center' },
    },
    {
      id: makeId(), type: 'event_details', label: 'Detail Acara', visible: true, order: 2,
      props: {
        events: [
          { id: makeId(), name: 'Nama Sesi', date: '', time: '', location: '', maps_link: '', note: '' },
        ],
      },
    },
    {
      id: makeId(), type: 'countdown', label: 'Hitung Mundur', visible: true, order: 3,
      props: { event_date: '', event_time: '09:00', label: 'Menuju Hari-H' },
    },
    {
      id: makeId(), type: 'gallery', label: 'Galeri Foto', visible: false, order: 4,
      props: { images: [], layout: 'grid', columns: 3 },
    },
    {
      id: makeId(), type: 'maps', label: 'Peta Lokasi', visible: true, order: 5,
      props: {
        label: 'Lokasi Acara',
        locations: [
          { id: makeId(), label: 'Lokasi Acara', venue_name: '', venue_address: '', maps_url: '', button_text: 'Buka Google Maps' }
        ]
      },
    },
    {
      id: makeId(), type: 'rsvp', label: 'RSVP', visible: false, order: 6,
      props: { enabled: false, deadline: '', title: '', layout_template: 'classic', animation_preset: 'none', bg_type: 'solid', bg_color: '#ffffff', initial_comments: 5 },
    },
  ],
};

export function makeDefaultPage(opts: {
  slug: string;
  user_id: number;
  event_type: EventType;
  page_title: string;
}): BuilderPage {
  const { slug, user_id, event_type, page_title } = opts;
  return {
    slug,
    user_id,
    event_type,
    title: slug,
    page_title,
    style: {
      bg_color: '#fff9fb',
      text_color: '#3d1c2a',
      accent_color: '#e879a0',
      font_body: 'Montserrat',
      font_heading: 'Playfair Display',
      page_width: 700,
      music_enabled: false,
      music_url: '',
      music_autoplay: true,
      nav_enabled: false,
    },
    sections: DEFAULT_SECTIONS[event_type].map((s, i) => ({ ...s, id: makeId(), order: i })),
  };
}
