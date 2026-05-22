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

function SectionRenderer({ section, style, onOpen, isExiting }: {
  section: BuilderSection;
  style: Record<string, string | number>;
  onOpen?: () => void;
  isExiting?: boolean;
}) {
  const props = section.props as Record<string, unknown>;
  if (!section.visible) return null;
  switch (section.type) {
    case 'opening':       return <OpeningPreview props={props} style={style} onOpen={onOpen} isExiting={isExiting} />;
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

// ── Scroll Reveal Wrapper ─────────────────────────────────────────────────────
// Setiap section isi undangan dibungkus komponen ini.
// IntersectionObserver menambahkan class `section-in-view` saat section masuk
// viewport, lalu CSS global mengubah animation-play-state dari paused → running.
// Animasi berjalan sesuai scroll — section pertama langsung, berikutnya nunggu scroll.
function ScrollRevealSection({ children, id }: { children: React.ReactNode; id: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('section-in-view');
          observer.unobserve(el); // Trigger sekali saja — tidak reset saat scroll naik
        }
      },
      // threshold 0.08 = animasi mulai ketika 8% section sudah masuk viewport
      // rootMargin -40px bottom = tidak trigger dari bawah layar terlalu dini
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} className="scroll-reveal-section">
      {children}
    </div>
  );
}

// ── Image Preloader ───────────────────────────────────────────────────────────
// Selain download (network cache), kita juga decode() agar GPU-ready sebelum
// gambar pertama kali dipaint — ini menghilangkan white-flash saat scroll.
const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          if (!url) { resolve(); return; }
          const img = new Image();
          img.src = url;
          img.onload = () => {
            // decode() = memaksa browser men-decode gambar ke GPU memory sekarang,
            // bukan nunggu saat pertama kali dipaint (yang menyebabkan white flash).
            // Berlaku untuk <img> dan CSS background-image (shared decode cache).
            if (typeof img.decode === 'function') {
              img.decode().then(() => resolve()).catch(() => resolve());
            } else {
              resolve();
            }
          };
          img.onerror = () => resolve();
        })
    )
  );
};

export default function BuilderViewer({ page }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // ── Preload semua gambar dari seluruh section ──────────────────────────────
  React.useEffect(() => {
    const criticalImages: string[] = [];

    const extractSectionImages = (props: any) => {
      if (!props) return;
      if (props.bg_image) criticalImages.push(props.bg_image as string);
      if (Array.isArray(props.bg_slideshow_images)) {
        props.bg_slideshow_images.forEach((img: any) => { if (img) criticalImages.push(img); });
      }
      if (Array.isArray(props.bg_images)) {
        props.bg_images.forEach((img: any) => { if (img) criticalImages.push(img); });
      }
    };

    page.sections?.forEach(section => {
      if (!section.visible) return;
      const props = section.props as any;
      if (!props) return;

      switch (section.type) {
        case 'opening':
          extractSectionImages(props);
          break;
        case 'hero':
          extractSectionImages(props);
          if (props.couple_photo) criticalImages.push(props.couple_photo);
          break;
        case 'couple':
          extractSectionImages(props);
          if (props.person_a?.photo) criticalImages.push(props.person_a.photo);
          if (props.person_b?.photo) criticalImages.push(props.person_b.photo);
          break;
        default:
          extractSectionImages(props);
          break;
      }

      if (section.type === 'gallery' && Array.isArray(props.images)) {
        props.images.forEach((img: any) => { if (img) criticalImages.push(img); });
      }
      if (section.type === 'our_story' && Array.isArray(props.items)) {
        props.items.forEach((item: any) => { if (item?.image) criticalImages.push(item.image); });
      }
    });

    const uniqueImages = Array.from(new Set(criticalImages.filter(Boolean)));
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

  const hasOpening = openingSections.length > 0;
  const showInner = !hasOpening || isOpen || isExiting;
  const showCover = hasOpening && !isOpen;

  if (!isOpen && !hasOpening) {
    setIsOpen(true);
  }

  const handleOpen = () => {
    const opening = page.sections?.find(s => s.type === 'opening');
    const openAnimation = (opening?.props as any)?.open_animation || 'slide_up';
    if (openAnimation === 'none') {
      setIsOpen(true);
    } else {
      setIsExiting(true);
      setTimeout(() => {
        setIsOpen(true);
        setIsExiting(false);
      }, 1100);
    }
  };

  React.useEffect(() => {
    if (hasOpening && !isOpen && !isExiting) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen, isExiting, hasOpening]);

  if (!isLoaded) {
    return (
      <div
        className="min-h-screen min-h-[100dvh] flex items-center justify-center"
        style={{ backgroundColor: page.style.bg_color }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: page.style.accent_color }}
          />
          <p
            className="mt-4 animate-pulse text-sm"
            style={{ color: page.style.text_color, fontFamily: `'${page.style.font_body}', sans-serif` }}
          >
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
      {/*
        ── Global Scroll-Reveal CSS ──────────────────────────────────────────
        Setiap `.scroll-reveal-section` mem-pause semua `.animate-item` di dalamnya.
        Elemen yang di-pause tetap diam di frame awal (opacity:0 dari keyframe `from`).

        Saat IntersectionObserver menambahkan `.section-in-view`, play-state berubah
        ke `running` → animasi berjalan dari awal sesuai urutan scroll.

        ⚠️ KENAPA BUKAN `animation: none/unset`?
        `animation: unset` = initial value = `none` → animasi tidak pernah bisa jalan.
        `animation-play-state` hanya mengontrol KAPAN animasi berjalan, bukan menghapusnya.
      */}
      <style>{`
        .scroll-reveal-section .animate-item {
          animation-play-state: paused !important;
        }
        .scroll-reveal-section.section-in-view .animate-item {
          animation-play-state: running !important;
        }
      `}</style>

      {/* Centered container */}
      <div
        className="mx-auto"
        style={{ maxWidth: `${page.style.page_width || 700}px` }}
      >
        {/* Inner sections — masing-masing dibungkus ScrollRevealSection */}
        {showInner && innerSections.map(section => (
          <ScrollRevealSection key={section.id} id={`section-${section.id}`}>
            <SectionRenderer section={section} style={style} />
          </ScrollRevealSection>
        ))}

        {/* Footer */}
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

      {/* Opening cover — tidak pakai ScrollRevealSection, langsung tampil */}
      {showCover && openingSections.map(section => (
        <div
          key={section.id}
          id={`section-${section.id}`}
          className="fixed inset-y-0 left-0 right-0 mx-auto z-50 overflow-hidden w-full"
          style={{ maxWidth: `${page.style.page_width || 700}px` }}
        >
          <SectionRenderer
            section={section}
            style={style}
            onOpen={handleOpen}
            isExiting={isExiting}
          />
        </div>
      ))}

      {(isOpen || isExiting) && page.style.music_enabled && page.style.music_url && (
        <MusicPlayer
          url={page.style.music_url}
          autoPlay={page.style.music_autoplay}
          accentColor={page.style.accent_color}
        />
      )}

      {page.style.nav_enabled !== false && isOpen && (
        <BuilderNavigation
          items={innerSections
            .filter(s => s.visible && (
              page.style.nav_items
                ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id))
                : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps'].includes(s.type)
            ))
            .map(s => {
              const navItemConfig = page.style.nav_items?.find((i: any) =>
                (typeof i === 'string' ? i === s.id : i.id === s.id)
              );
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
