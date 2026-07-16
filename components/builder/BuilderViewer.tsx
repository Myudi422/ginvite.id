'use client';

import React from 'react';
import type { BuilderPage, BuilderSection } from '@/components/builder/types';
import MusicPlayer from '@/components/MusicPlayer';
import BuilderNavigation from '@/components/builder/ui/BuilderNavigation';
import { midtransAction, toggleStatusAction } from '@/app/actions/indexcontent';
import { recordContentView } from '@/app/actions/view';

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
import DresscodePreview from '@/components/builder/previews/DresscodePreview';

interface Props {
  page: BuilderPage;
}

function SectionRenderer({ section, style, onOpen, isExiting, pageStatus }: {
  section: BuilderSection;
  style: Record<string, string | number>;
  onOpen?: () => void;
  isExiting?: boolean;
  pageStatus?: number;
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
    case 'rsvp':          return <RsvpPreview props={props} style={style} pageStatus={pageStatus} />;
    case 'gift':          return <GiftPreview props={props} style={style} />;
    case 'dresscode':     return <DresscodePreview props={props} style={style} />;
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
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className="scroll-reveal-section"
      style={{
        scrollSnapAlign: 'start',
        height: '100dvh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="flex-1 flex flex-col section-renderer-wrapper">
        {children}
      </div>
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
  const [loadingPayment, setLoadingPayment] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [showBanner, setShowBanner] = React.useState(true);
  // Ref for the mobile scrollable container — passed directly to BuilderNavigation
  // so nav clicks don't rely on fragile DOM traversal from a fixed-position element.
  const mobileScrollRef = React.useRef<HTMLDivElement | null>(null);

  const handleWatermarkPayment = async () => {
    setLoadingPayment(true);
    setPaymentError(null);

    const builderId = page.id || 0;
    const userId = page.user_id || 0;
    const slug = page.slug || page.title || '';

    try {
      const result = await midtransAction({
        user_id: userId,
        id_content: builderId,
        title: slug,
        invitation_type: 'builder',
      });

      if (result.status === 'paid') {
        await toggleStatusAction({
          user_id: userId,
          id: builderId,
          title: slug,
          status: 1,
          invitation_type: 'builder',
        });
        window.location.reload();
        return;
      }

      // @ts-ignore
      if (typeof window.snap !== 'undefined') {
        // @ts-ignore
        window.snap.pay(result.snap_token, {
          onSuccess: async () => {
            try {
              await toggleStatusAction({
                user_id: userId,
                id: builderId,
                title: slug,
                status: 1,
                invitation_type: 'builder',
              });
            } catch (_) {}
            window.location.reload();
          },
          onError: (e: any) => {
            setPaymentError('Pembayaran gagal: ' + (e?.message || 'Terjadi kesalahan'));
            setLoadingPayment(false);
          },
          onClose: () => {
            setLoadingPayment(false);
          },
        });
      } else {
        setPaymentError('Sistem pembayaran belum siap. Silakan refresh halaman.');
        setLoadingPayment(false);
      }
    } catch (err: any) {
      setPaymentError('Gagal memproses: ' + err.message);
      setLoadingPayment(false);
    }
  };

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
      if (section.type === 'dresscode' && Array.isArray(props.items)) {
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
  const style = {
    ...(page.style as unknown as Record<string, string | number>),
    _page_id: page.id ?? 0,
    _user_id: page.user_id ?? 0,
  };

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

  React.useEffect(() => {
    if (page.id) {
      recordContentView(page.id, 'builder').catch(err => {
        console.error('Failed to record builder view:', err);
      });
    }
  }, [page.id]);

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
      className="h-screen flex flex-col lg:flex-row overflow-hidden relative"
      style={{
        height: '100dvh',
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
        /* ── Scroll-reveal: pause animasi sampai section masuk viewport ── */
        .scroll-reveal-section .animate-item {
          animation-play-state: paused !important;
        }
        .scroll-reveal-section.section-in-view .animate-item {
          animation-play-state: running !important;
        }

        /* ── Page-reveal: efek "buka lembaran" saat section masuk viewport ── */
        @keyframes pageReveal {
          from {
            clip-path: inset(100% 0 0 0);
            transform: translateY(8px);
          }
          to {
            clip-path: inset(0% 0 0 0);
            transform: translateY(0);
          }
        }

        /* Setiap scroll-reveal-section mendapat animasi pageReveal saat in-view */
        .scroll-reveal-section.section-in-view {
          animation: pageReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: clip-path, transform;
        }

        /* Optimize for mobile viewports to prevent jank/stiff touch scroll */
        @media (max-width: 1023px) {
          .scroll-reveal-section.section-in-view {
            animation: mobilePageReveal 0.35s ease-out forwards !important;
            will-change: opacity, transform !important;
            clip-path: none !important;
          }
        }

        @keyframes mobilePageReveal {
          from {
            opacity: 0.3;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Snap scroll container */
        .builder-snap-container {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        /* Sembunyikan scrollbar */
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

      {/* ── Desktop Split Layout (Visible when opened / transition starts) ── */}
      {hasOpening && (isOpen || isExiting) && (
        <div className="hidden lg:flex w-full h-screen overflow-hidden relative">
          {/* Left Pane: Static Desktop Event Cover */}
          <div 
            className="w-[60%] h-full flex flex-col items-center justify-center text-center p-8 select-none border-r border-white/10 relative"
            style={{
              backgroundColor: page.style.bg_color,
              color: contrastTextColor,
            }}
          >
            {renderLeftBackground()}

            {/* Static details content */}
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

          {/* Right Pane: Scrollable Inner Sections - full-page snap */}
          <div className="w-[40%] h-full overflow-y-auto relative no-scrollbar builder-snap-container">
            {innerSections.map(section => (
              <ScrollRevealSection key={section.id} id={`desktop-section-${section.id}`}>
                <SectionRenderer section={section} style={style} pageStatus={page.status} />
              </ScrollRevealSection>
            ))}
          </div>

          {/* Divider line & Vertical Nav for Desktop View */}
          <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-white/20 z-40 pointer-events-none" />
          {page.style.nav_enabled !== false && (
            <BuilderNavigation
              isVertical={true}
              items={innerSections
                .filter(s => s.visible && (
                  page.style.nav_items
                    ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id))
                    : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps', 'dresscode'].includes(s.type)
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
      )}

      {/* ── Mobile Layout or Full Screen Cover Overlay ── */}
      <div className={`${hasOpening && (isOpen || isExiting) ? 'lg:hidden' : ''} w-full h-full flex flex-col`}>
        {/* Main Content (Inner sections) */}
        {showInner && (
          <div 
            ref={mobileScrollRef}
            className="h-full w-full mx-auto relative overflow-y-auto no-scrollbar builder-snap-container" 
            style={{ maxWidth: `${page.style.page_width || 700}px` }}
          >
            {innerSections.map(section => (
              <ScrollRevealSection key={section.id} id={`mobile-section-${section.id}`}>
                <SectionRenderer section={section} style={style} pageStatus={page.status} />
              </ScrollRevealSection>
            ))}
          </div>
        )}

        {/* Opening cover — overlay fixed full screen on both desktop and mobile initially */}
        {showCover && openingSections.map(section => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="fixed inset-0 z-50 overflow-hidden w-full h-screen"
          >
            <SectionRenderer
              section={section}
              style={style}
              onOpen={handleOpen}
              isExiting={isExiting}
            />
          </div>
        ))}
      </div>

      {/* Horizontal Nav for Mobile View */}
      {page.style.nav_enabled !== false && isOpen && (
        <div className={`fixed bottom-0 left-0 right-0 z-[999] pointer-events-none ${hasOpening ? 'lg:hidden' : ''}`}>
          <BuilderNavigation
            items={innerSections
              .filter(s => s.visible && (
                page.style.nav_items
                  ? page.style.nav_items.some((i: any) => (typeof i === 'string' ? i === s.id : i.id === s.id))
                  : ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps', 'dresscode'].includes(s.type)
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
            scrollContainerRef={mobileScrollRef}
          />
        </div>
      )}

      {(isOpen || isExiting) && page.style.music_enabled && page.style.music_url && (
        <MusicPlayer
          url={page.style.music_url}
          autoPlay={page.style.music_autoplay}
          accentColor={page.style.accent_color}
        />
      )}

      {/* Floating Watermark Banner - Versi Gratis / Percobaan */}
      {page.status === 0 && showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-md mx-auto p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-pink-100 dark:border-pink-950 flex flex-col gap-3 transition-all duration-300 font-sans">
          {/* Close button */}
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            title="Tutup Peringatan"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-3 pr-6">
            <span className="text-xl animate-bounce shrink-0">✨</span>
            <div className="flex-1 text-left">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Undangan Versi Gratis / Percobaan
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                Aktifkan undangan untuk menghilangkan watermark gratis dan mengaktifkan masa berlaku selamanya.
              </p>
            </div>
          </div>

          {paymentError && (
            <div className="text-[10px] bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-lg px-2.5 py-1.5 text-left border border-red-100/50 dark:border-red-950/50">
              {paymentError}
            </div>
          )}

          <button
            onClick={handleWatermarkPayment}
            disabled={loadingPayment}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-300 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loadingPayment ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Aktifkan Sekarang (Rp 50.000)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
