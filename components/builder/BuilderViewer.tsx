'use client';

import React from 'react';
import type { BuilderPage, BuilderSection } from '@/components/builder/types';
import MusicPlayer from '@/components/MusicPlayer';
import BuilderNavigation from '@/components/builder/ui/BuilderNavigation';

// Section renderers (reuse dari builder)
import OpeningPreview from '@/components/builder/previews/OpeningPreview';
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

function SectionRenderer({ section, style, onOpen }: { section: BuilderSection; style: Record<string, string | number>; onOpen?: () => void }) {
  const props = section.props as Record<string, unknown>;
  if (!section.visible) return null;
  switch (section.type) {
    case 'opening':       return <OpeningPreview props={props} style={style} onOpen={onOpen} />;
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

const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          if (!url) {
            resolve();
            return;
          }
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Tetap jalan meskipun gambar gagal diload
        })
    )
  );
};

export default function BuilderViewer({ page }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // 1. Kumpulkan semua url gambar kritis yang harus di-preload terlebih dahulu
    const criticalImages: string[] = [];
    
    // Gambar dari opening section
    const opening = page.sections?.find(s => s.type === 'opening');
    if (opening?.props) {
      const props = opening.props as any;
      if (props.bg_image) criticalImages.push(props.bg_image as string);
      if (Array.isArray(props.bg_slideshow_images)) {
        props.bg_slideshow_images.forEach((img: any) => {
          if (img) criticalImages.push(img as string);
        });
      }
    }
    
    // Gambar dari hero section
    const hero = page.sections?.find(s => s.type === 'hero');
    if (hero?.props) {
      const props = hero.props as any;
      if (props.bg_image) criticalImages.push(props.bg_image as string);
      if (props.couple_photo) criticalImages.push(props.couple_photo as string);
    }

    // Gambar dari couple section
    const couple = page.sections?.find(s => s.type === 'couple');
    if (couple?.props) {
      const props = couple.props as any;
      if (props.person_a?.photo) criticalImages.push(props.person_a.photo as string);
      if (props.person_b?.photo) criticalImages.push(props.person_b.photo as string);
    }

    const uniqueImages = Array.from(new Set(criticalImages.filter(Boolean)));

    // Gabungkan minimal loading time 1.2s dan proses preloading gambar
    const minTimeout = new Promise(resolve => setTimeout(resolve, 1200));
    const imagePreloader = preloadImages(uniqueImages);

    Promise.all([minTimeout, imagePreloader]).then(() => {
      setIsLoaded(true);
    });
  }, [page]);

  const sections = [...(page.sections || [])].sort((a, b) => a.order - b.order);
  const style = page.style as unknown as Record<string, string | number>;

  const openingSections = sections.filter(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) === 'opening');
  const innerSections = sections.filter(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) !== 'opening');

  // Jika tidak ada halaman opening, langsung anggap terbuka
  if (!isOpen && openingSections.length === 0) {
    setIsOpen(true);
  }

  const sectionsToRender = isOpen ? innerSections : openingSections;

  if (!isLoaded) {
    return (
      <div 
        className="min-h-screen min-h-[100dvh] flex items-center justify-center transition-opacity duration-1000"
        style={{ backgroundColor: page.style.bg_color }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto" style={{ borderColor: page.style.accent_color }}></div>
          <p className="mt-4 animate-pulse text-sm" style={{ color: page.style.text_color, fontFamily: `'${page.style.font_body}', sans-serif` }}>
            Memuat Undangan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen min-h-[100dvh]"
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
        {sectionsToRender.map(section => (
          <div key={section.id} id={`section-${section.id}`}>
            <SectionRenderer section={section} style={style} onOpen={() => setIsOpen(true)} />
          </div>
        ))}

        {/* Footer hanya tampil jika sudah terbuka */}
        {isOpen && (
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
        )}
      </div>
      
      {isOpen && page.style.music_enabled && page.style.music_url && (
        <MusicPlayer 
          url={page.style.music_url} 
          autoPlay={page.style.music_autoplay} 
          accentColor={page.style.accent_color} 
        />
      )}
      
      {page.style.nav_enabled !== false && isOpen && (
        <BuilderNavigation 
          items={innerSections.filter(s => s.visible && (page.style.nav_items ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id)) : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps'].includes(s.type))).map(s => {
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
  );
}
