"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { ThemeData, getFirstEvent, createCalendarUrl } from "@/lib/theme-data";
import { midtransAction, toggleStatusAction } from "@/app/actions/indexcontent";
import { recordContentView } from "@/app/actions/view";
import ThemeContainer, { ThemeSection, ThemeHeader, ThemeText, ThemeBadge, ThemeButton } from "./ThemeComponents";
import ProfilePopup from "./ProfilePopup";
import Navigation, { useNavigation } from "./Navigation";
import OpeningModal from "./OpeningModal";
import { MaleIcon, FemaleIcon, DownArrowIcon } from "./icon";
import { submitRsvp, getRsvpList } from '@/app/actions/rsvp';
import { submitBankTransfer } from '@/app/actions/bank';
import QRModal from "@/components/QRModal";
import dynamic from 'next/dynamic';
import { FaUser, FaWhatsapp, FaComment } from 'react-icons/fa';
import { FiCopy, FiLock, FiMail } from 'react-icons/fi';
import Image from 'next/image';
import themeConfig from './theme.json';

// Dynamic imports
const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });
const MusicPlayer = dynamic(() => import('./MusicPlayer'), { ssr: false, loading: () => null });
const TurutSection = dynamic(() => import('./TurutSection'), { ssr: false, loading: () => null });
const VideoSection = dynamic(() => import('./VideoSection'), { ssr: false, loading: () => null });

interface Theme6Props {
  data: ThemeData;
}

const ScrollReveal = ({ children, delay = 0, className = '' }: { children: ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
};

export default function Theme6({ data }: Theme6Props) {
  const cuId = data.content_user_id;
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<{ userId?: string; title?: string; toName?: string }>({});

  // RSVP form states
  const [nama, setNama] = useState('');
  const [ucapan, setUcapan] = useState('');
  const [wa, setWa] = useState('');
  const [konfirmasi, setKonfirmasi] = useState<'hadir' | 'tidak hadir' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [rsvpList, setRsvpList] = useState<any[]>([]);
  const [loadingRsvp, setLoadingRsvp] = useState(true);
  const [visibleComments, setVisibleComments] = useState(5);
  const [errorRsvp, setErrorRsvp] = useState<string | null>(null);

  // Gift/Bank transfer states
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [namaGift, setNamaGift] = useState('');
  const [jumlahGift, setJumlahGift] = useState('');
  const [formattedJumlahGift, setFormattedJumlahGift] = useState('');
  const [loadingGift, setLoadingGift] = useState(false);
  const [errorGift, setErrorGift] = useState<string | null>(null);
  const [successGift, setSuccessGift] = useState(false);
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);

  // Navigation state
  const { activeSection, setActiveSection } = useNavigation();

  const searchParams = useSearchParams();
  const params = useParams();

  const [showOpeningText, setShowOpeningText] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Destructure data
  const { theme, content, event: apiEvents, category_type } = data;
  const { children, gallery, title: eventTitle, music } = content;
  const { plugin } = content;

  // Music settings
  const { url: musicUrl = "", enabled: musicEnabled = false } = music || {};

  // Event parsing
  const firstEvent = getFirstEvent(apiEvents);
  const nickname1 = children?.[0]?.nickname || '';
  const nickname2 = children?.[1]?.nickname || '';
  const nickname = [nickname1, nickname2].filter(Boolean).join(' & ');

  // Backgrounds
  const bgImages = gallery?.items && gallery.items.length > 0 ? gallery.items : [theme.defaultBgImage1 || '/images/default-wedding.jpg'];
  const backgroundImage = bgImages[0];
  const openingVideoUrl = (content.plugin as any)?.opening_video || content.plugin?.youtube_link;
  // Determine if openingVideoUrl is a direct video file or youtube link
  const isDirectVideo = openingVideoUrl && (openingVideoUrl.includes('.mp4') || openingVideoUrl.includes('.webm'));

  // Category Check
  const lowerCategory = (category_type?.name || '').toString().toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');
  const isWedding = !!content.parents?.groom;

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const userId = params?.userId as string;
      const title = params?.title as string;
      const toName = searchParams?.get("to");
      setUrlParams({ userId, title, toName: toName || undefined });
      setShowProfileModal(true);

      // Delay showing text in opening
      setTimeout(() => setShowOpeningText(true), 500);
    }
  }, [params, searchParams]);

  useEffect(() => {
    const items = gallery?.items;
    if (items && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentBgIndex((prev) => (prev + 1) % items.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [gallery?.items]);

  // Custom Theme Colors (from JSON in DB)
  // Custom Theme Colors & Assets (from JSON in DB)
  const customSettings = typeof (theme as any)?.custom === 'string' && (theme as any).custom.trim().startsWith('{')
    ? (() => { try { return JSON.parse((theme as any).custom).theme5 || null; } catch (e) { return null; } })()
    : null;

  const assets = customSettings?.assets || themeConfig.assets;

  const customStyle = {
    '--t6-bg-main': customSettings?.colors?.background?.main || themeConfig.colors.background.main,
    '--t6-bg-cover': customSettings?.colors?.background?.cover || themeConfig.colors.background.cover,
    '--t6-text-primary': customSettings?.colors?.text?.primary || themeConfig.colors.text.primary,
    '--t6-text-secondary': customSettings?.colors?.text?.secondary || themeConfig.colors.text.secondary,
    '--t6-text-accent': customSettings?.colors?.text?.accent || themeConfig.colors.text.accent,
    '--t6-text-white': customSettings?.colors?.text?.white || themeConfig.colors.text.white,
    '--t6-border-glass': customSettings?.colors?.borders?.glass || themeConfig.colors.borders.glass,
    '--t6-grad-button': customSettings?.colors?.gradients?.button || themeConfig.colors.gradients.button,
    '--t6-font-heading': customSettings?.fonts?.heading || themeConfig.fonts.heading,
  } as React.CSSProperties;

  useEffect(() => {
    if (!cuId) return;
    (async () => {
      setLoadingRsvp(true);
      try {
        const data = await getRsvpList(cuId);
        setRsvpList(data);
      } catch (err: any) {
        setErrorRsvp(err.message);
      } finally {
        setLoadingRsvp(false);
      }
    })();
  }, [cuId]);

  // View tracking
  useEffect(() => {
    if (!cuId) return;
    const viewedKey = `viewed_${cuId}`;
    const lastViewedTimeKey = `lastViewedTime_${cuId}`;
    const oneHour = 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const lastViewed = localStorage.getItem(viewedKey);
    const lastTime = localStorage.getItem(lastViewedTimeKey);

    if (lastViewed !== 'true' || !lastTime || currentTime - parseInt(lastTime) >= oneHour) {
      recordContentView(cuId)
        .then(() => {
          localStorage.setItem(viewedKey, 'true');
          localStorage.setItem(lastViewedTimeKey, currentTime.toString());
        })
        .catch(console.error);
    }
  }, [cuId]);

  // Validate YouTube URL
  const isValidYouTubeLink = (url: string): boolean => {
    // Basic check, can be expanded
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const midtransResult = await midtransAction({
        user_id: parseInt(urlParams.userId || '0'),
        id_content: cuId,
        title: decodeURIComponent(urlParams.title || ''),
      });

      if (midtransResult.status === 'paid') {
        await toggleStatusAction({
          user_id: parseInt(urlParams.userId || '0'),
          id: cuId,
          title: decodeURIComponent(urlParams.title || ''),
          status: 1,
        });
        window.location.reload();
      } else {
        // @ts-ignore
        if (typeof window.snap !== 'undefined') {
          // @ts-ignore
          window.snap.pay(midtransResult.snap_token, {
            onSuccess: async () => {
              await toggleStatusAction({
                user_id: parseInt(urlParams.userId || '0'),
                id: cuId,
                title: decodeURIComponent(urlParams.title || ''),
                status: 1,
              });
              window.location.reload();
            },
            onError: (e: any) => {
              setPaymentError('Pembayaran gagal: ' + (e?.message || 'Terjadi kesalahan'));
            },
            onClose: () => {
              setPaymentLoading(false);
            }
          });
        } else {
          setPaymentError('Sistem pembayaran belum siap. Silakan refresh halaman.');
          setPaymentLoading(false);
        }
      }
    } catch (err: any) {
      setPaymentError('Gagal memproses pembayaran: ' + err.message);
      setPaymentLoading(false);
    }
  };

  const handleKeyPressWa = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) event.preventDefault();
  };

  const handleProfileModalClose = (guestName: string) => {
    setUrlParams(prev => ({ ...prev, toName: guestName }));
    setShowProfileModal(false);
    setIsOpen(true); // Auto open when profile selected
  };



  // RSVP Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !ucapan.trim() || !konfirmasi || !wa.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      await submitRsvp(cuId, nama, wa, ucapan, konfirmasi, `/undang/${cuId}`);
      setSuccess(true);
      setNama(''); setWa(''); setUcapan(''); setKonfirmasi('');
      const updated = await getRsvpList(cuId);
      setRsvpList(updated);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Gift Handlers
  const formatToRupiah = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) return "";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleJumlahGiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setJumlahGift(raw);
    setFormattedJumlahGift(formatToRupiah(raw));
  };

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGift(null);
    if (!namaGift.trim() || !jumlahGift.trim()) return;
    setLoadingGift(true);
    try {
      await submitBankTransfer({
        nominal: parseFloat(jumlahGift),
        user_id: cuId,
        nama_pemberi: namaGift,
      });
      setSuccessGift(true);
      setNamaGift(""); setJumlahGift(""); setFormattedJumlahGift("");
    } catch (err: any) {
      setErrorGift(err.message);
    }
    setLoadingGift(false);
  };

  const handleCopyAccountNumber = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      alert("Nomor rekening berhasil disalin!");
    } catch {
      alert("Gagal menyalin nomor rekening.");
    }
  };

  const eventDate = firstEvent ? new Date(`${firstEvent.date}T${firstEvent.time}`) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  }) : '';

  // Generate calendar URL
  let calendarUrl = '';
  if (eventDate && firstEvent) {
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(eventDate.getTime() + 3600000);
    const end = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    let titleText = `Undangan ${isKhitan ? 'Khitanan' : 'Pernikahan'} - ${isKhitan ? nickname1 : nickname}`;

    const mapsLink = (firstEvent as any).location_url || firstEvent.mapsLink || '';

    let detailsText = isKhitan
      ? `Kami mengundang Anda untuk menghadiri acara khitanan ${nickname1}. Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan mendoakan.`
      : `Kami mengundang Anda untuk menghadiri acara pernikahan ${nickname}. Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`;

    if (mapsLink && mapsLink.trim() !== '') {
      detailsText += `\n\nMaps: ${mapsLink}`;
    }

    calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}` +
      `&text=${encodeURIComponent(titleText)}` +
      `&details=${encodeURIComponent(detailsText)}` +
      `&location=${encodeURIComponent(firstEvent.location)}`;
  }

  return (
    <div style={customStyle} className="w-full h-full">
      <ThemeContainer className="flex flex-col w-full min-h-[100dvh] overflow-x-hidden relative">
        {/* Payment Banner */}
        {data.status === "tidak" && isOpen && (
          <div className="fixed top-20 inset-x-0 mx-auto max-w-[420px] z-[60] flex flex-col items-center justify-center gap-2 pointer-events-none px-4">
            <div className="bg-red-600/90 backdrop-blur-md text-white py-3 px-4 rounded-xl shadow-2xl pointer-events-auto flex items-center gap-4 w-full border border-red-400/30">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-100 mb-0.5">Trial Mode</p>
                <p className="text-[10px] text-red-50/80 leading-tight">Aktifkan untuk fitur lengkap & hilangkan watermark.</p>
              </div>
              <ThemeButton
                variant="primary"
                className="py-1.5 px-4 text-[10px] h-auto min-w-[80px]"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Loading...' : 'Aktifkan'}
              </ThemeButton>
            </div>
            {paymentError && (
              <div className="bg-red-900/90 text-white text-[10px] py-1 px-3 rounded-full pointer-events-auto">
                {paymentError}
              </div>
            )}
          </div>
        )}

        <QRModal
          show={showQr}
          onClose={() => setShowQr(false)}
          qrData={urlParams.toName || "Bapak/Ibu/Saudara/i"}
          guestName={urlParams.toName || "Bapak/Ibu/Saudara/i"}
          eventName={isKhitan ? nickname1 : nickname}
          eventDate={formattedDate}
          eventTime={firstEvent?.time || "Pukul 09.00 WIB - Selesai"}
          coverImage={gallery?.items?.[0] || backgroundImage}
        />

        {/* Music Player */}
        {musicEnabled && musicUrl && isClient && (
          <MusicPlayer url={musicUrl} autoPlay={isOpen} />
        )}

        {/* COVER (Mobile: Full Screen initially then slides up or fades) */}
        <div className={`fixed inset-x-0 mx-auto max-w-[420px] w-full h-[100dvh] flex flex-col justify-between z-50 transition-transform duration-1000 overflow-hidden py-10 px-6 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>

          {/* Background Image full bleed */}
          <div className="absolute inset-0 z-0 bg-blue-50/50">
            {isDirectVideo ? (
              <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60 mix-blend-multiply">
                <source src={openingVideoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full bg-cover bg-center opacity-50 mix-blend-multiply" style={{ backgroundImage: `url(${bgImages[0] || backgroundImage})` }} />
            )}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px]" />
          </div>

          {/* Floral Top Left */}
          {assets.flower1 && <img src={assets.flower1} className="absolute top-0 left-0 w-[85%] max-w-[320px] opacity-90 pointer-events-none z-10 -translate-x-4 -translate-y-4 drop-shadow-md" alt="" />}

          {/* Floral Bottom Right */}
          {assets.flowerL && <img src={assets.flowerL} className="absolute bottom-0 right-0 w-[85%] max-w-[320px] opacity-90 pointer-events-none z-10 translate-x-4 translate-y-4 drop-shadow-md" alt="" />}

          {/* Top Content: Title & Names */}
          <div className="w-full text-center relative z-20 mt-14 sm:mt-16 flex-1 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-[var(--t6-text-accent)] tracking-wide mb-2 opacity-90">
              {isKhitan ? "Walimatul Khitan" : "Undangan Pernikahan"}
            </h2>

            {isKhitan ? (
              <h1 className="text-6xl text-[var(--t6-text-accent)] mt-4 drop-shadow-sm" style={{ fontFamily: 'var(--t6-font-heading)' }}>
                {nickname1}
              </h1>
            ) : (
              <div className="relative flex flex-col items-center justify-center mt-2 leading-none gap-2">
                <span className="text-6xl text-[var(--t6-text-accent)] -ml-8 drop-shadow-sm" style={{ fontFamily: 'var(--t6-font-heading)' }}>{nickname1}</span>
                <span className="text-4xl text-[var(--t6-text-accent)]" style={{ fontFamily: 'var(--t6-font-heading)' }}>&amp;</span>
                <span className="text-6xl text-[var(--t6-text-accent)] ml-8 drop-shadow-sm" style={{ fontFamily: 'var(--t6-font-heading)' }}>{nickname2}</span>
              </div>
            )}
          </div>

          {/* Middle: Date with Pipes */}
          <div className="w-full flex justify-center items-center gap-5 relative z-20 mb-10 shrink-0">
            <span className="text-sm font-semibold text-[var(--t6-text-accent)]">
              {(() => {
                try {
                  const d = new Date(firstEvent?.date || Date.now());
                  return d.toLocaleDateString('id-ID', { weekday: 'long' });
                } catch { return 'Sabtu'; }
              })()}
            </span>
            <div className="w-px h-14 bg-[var(--t6-text-accent)] pointer-events-none" />
            <div className="flex flex-col items-center text-[var(--t6-text-accent)] leading-tight">
              <span className="text-4xl font-serif font-bold tracking-tight">
                {(() => {
                  try {
                    const d = new Date(firstEvent?.date || Date.now());
                    return d.getDate();
                  } catch { return '28'; }
                })()}
              </span>
              <span className="text-sm border-t border-[var(--t6-text-accent)] pt-1 w-[120%] text-center mt-1">
                {(() => {
                  try {
                    const d = new Date(firstEvent?.date || Date.now());
                    return d.getFullYear();
                  } catch { return '2026'; }
                })()}
              </span>
            </div>
            <div className="w-px h-14 bg-[var(--t6-text-accent)] pointer-events-none" />
            <span className="text-sm font-semibold text-[var(--t6-text-accent)]">
              {(() => {
                try {
                  const d = new Date(firstEvent?.date || Date.now());
                  return d.toLocaleDateString('id-ID', { month: 'long' });
                } catch { return 'Maret'; }
              })()}
            </span>
          </div>

          {/* Bottom Content: Kepada & Button */}
          <div className="w-full flex justify-center items-end relative z-20 shrink-0 mb-4">
            <div className="flex flex-col items-center text-center gap-5 w-full">
              <div className={`transition-all duration-1000 w-full ${showOpeningText ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm text-[var(--t6-text-accent)] mb-1">Kepada Yth:</p>
                <p className="text-xl font-bold text-[var(--t6-text-accent)] leading-tight px-4 break-words">
                  {urlParams.toName || "Bapak/Ibu/Saudara/i"}
                </p>
              </div>

              {/* QR Code trigger integrated in Cover */}
              {!isOpen && !!(plugin as any)?.qrcode && urlParams.toName && urlParams.toName !== "Bapak/Ibu/Saudara/i" && (
                <button
                  onClick={() => setShowQr(true)}
                  className="flex flex-col items-center gap-2 text-[var(--t6-text-accent)] opacity-90 hover:opacity-100 hover:scale-105 transition-all bg-black/10 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-white/20 mb-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                  <span className="text-xs uppercase font-bold tracking-wider">QR Code Tamu</span>
                </button>
              )}

              {!isOpen && (
                <button
                  onClick={() => { setIsOpen(true); setShowProfileModal(false); }}
                  className="flex items-center justify-center gap-2 bg-[#5d7c9d] text-white py-3 px-8 rounded-lg text-sm font-semibold shadow-lg hover:bg-[var(--t6-text-primary)] hover:shadow-xl transition-all"
                >
                  <FiMail className="text-lg" /> Buka Undangan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className={`w-full min-h-screen relative z-10 transition-all duration-1000 bg-[var(--t6-bg-main)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 h-0 overflow-hidden pointer-events-none'}`}>

          {/* Header (Visual Hero) */}
          <section id="home" className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-blue-50/30 pt-16 pb-12">

            {/* Background Image full bleed */}
            <div className="absolute inset-0 z-0 bg-blue-50/50">
              <div className="w-full h-full bg-cover bg-center opacity-60 mix-blend-multiply" style={{ backgroundImage: `url(${themeConfig.assets.flowerR})` }} />
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
            </div>

            {/* Floral Top Left */}
            {assets.flower1 && <img src={assets.flower1} className="absolute top-0 left-0 w-[85%] max-w-[320px] opacity-90 pointer-events-none z-10 -translate-x-4 -translate-y-4 drop-shadow-md" alt="" />}

            {/* Floral Bottom Right */}
            {assets.flowerL && <img src={assets.flowerL} className="absolute bottom-0 right-0 w-[85%] max-w-[320px] opacity-90 pointer-events-none z-10 translate-x-4 translate-y-4 drop-shadow-md" alt="" />}

            {/* Floating Card */}
            <div className="relative z-20 bg-white/85 backdrop-blur-md rounded-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 p-8 w-[90%] max-w-sm flex flex-col items-center justify-center text-center mt-6">
              <ThemeText variant="caption" className="mb-2 tracking-wide text-sm font-semibold text-[var(--t6-text-secondary)] opacity-90">
                {isKhitan ? "Walimatul Khitan" : "Undangan Pernikahan"}
              </ThemeText>

              {isKhitan ? (
                <h1 className="text-5xl text-[var(--t6-text-primary)] my-2" style={{ fontFamily: 'var(--t6-font-heading)' }}>
                  {nickname1}
                </h1>
              ) : (
                <div className="flex flex-col items-center gap-1 my-2">
                  <h1 className="text-5xl text-[var(--t6-text-primary)] leading-none" style={{ fontFamily: 'var(--t6-font-heading)' }}>
                    {nickname1}
                  </h1>
                  <span className="text-3xl text-[var(--t6-text-primary)] font-serif italic">&amp;</span>
                  <h1 className="text-5xl text-[var(--t6-text-primary)] leading-none" style={{ fontFamily: 'var(--t6-font-heading)' }}>
                    {nickname2}
                  </h1>
                </div>
              )}

              <div className="my-6">
                <p className="text-sm text-[var(--t6-text-secondary)] font-medium mb-1">
                  {(() => {
                    try {
                      const d = new Date(firstEvent?.date || Date.now());
                      return d.toLocaleDateString('id-ID', { weekday: 'long' });
                    } catch { return 'Sabtu'; }
                  })()}
                </p>
                <p className="text-base text-[var(--t6-text-primary)] font-bold tracking-widest">
                  {(() => {
                    try {
                      const d = new Date(firstEvent?.date || Date.now());
                      const day = String(d.getDate()).padStart(2, '0');
                      const mon = String(d.getMonth() + 1).padStart(2, '0');
                      const yr = d.getFullYear();
                      return `${day} • ${mon} • ${yr}`;
                    } catch { return '28 • 03 • 2026'; }
                  })()}
                </p>
              </div>

              {/* Countdown inside Card */}
              {eventDate && (
                <div className="flex justify-center gap-3 mt-2 w-full">
                  {(() => {
                    const now = new Date().getTime();
                    const eventTime = eventDate.getTime();
                    const diff = eventTime - now;

                    const renderCircles = (d: number, h: number, m: number, s: number) => {
                      const units = [
                        { label: 'Hari', value: d },
                        { label: 'Jam', value: h },
                        { label: 'Menit', value: m },
                        { label: 'Detik', value: s }
                      ];
                      return units.map((unit, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-[#5d7c9d] text-white flex items-center justify-center text-lg shadow-md font-bold mb-1.5" style={{ fontFamily: 'sans-serif' }}>
                            {String(unit.value).padStart(2, '0')}
                          </div>
                          <div className="text-[10px] text-[var(--t6-text-secondary)] font-semibold">{unit.label}</div>
                        </div>
                      ));
                    };

                    if (diff <= 0) return renderCircles(0, 0, 0, 0);

                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    return renderCircles(days, hours, minutes, seconds);
                  })()}
                </div>
              )}
            </div>
          </section>

          {/* Quote Section */}
          <ThemeSection className="text-center relative py-20 px-6">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[var(--t6-bg-cover)]"
            />
            <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-black/5 relative mt-6">
              <ThemeText variant="quote" color="black" className="mb-6 text-zinc-600">
                {data.content.quote
                  ? (typeof data.content.quote === 'string' ? data.content.quote : (data.content.quote.text || data.content.quote.quote))
                  : (isKhitan
                    ? '"Dan bahwasannya kepada Tuhanmu adalah kesudahan (segala sesuatu)"'
                    : '"Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)"'
                  )
                }
              </ThemeText>
              {!data.content.quote && (
                <ThemeText variant="meta" color="black" className="font-bold text-[var(--t6-text-primary)]">
                  {isKhitan ? "(Q.S An-Najm: 42)" : "(Q.S Az-Zariyah: 49)"}
                </ThemeText>
              )}
            </div>
          </ThemeSection>

          {/* Our Love Story */}
          {Array.isArray(content.our_story) && content.our_story.length > 0 && (
            <ThemeSection id="story" className="py-12 px-4 relative">
              <ThemeHeader size="lg" className="mb-12 text-center uppercase tracking-widest text-[var(--t6-text-primary)] relative z-10">
                Our Journey
              </ThemeHeader>

              <div className="relative space-y-10 max-w-2xl mx-auto">
                {content.our_story.map((item, index) => {
                  const hasImage = item.pictures && item.pictures[0] && item.pictures[0].trim() !== '';
                  return (
                    <ScrollReveal key={index} delay={index * 150} className="w-full flex flex-col items-center group">
                      {/* Content Card */}
                      <div className="w-full sm:w-[85%] bg-white/70 backdrop-blur-sm rounded-[32px] shadow-sm hover:shadow-md transition-shadow border border-white overflow-hidden text-center">
                        {hasImage && (
                          <div className="w-full aspect-video relative">
                            <Image unoptimized={true} 
                              src={item.pictures[0]}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                            />
                            {/* Gradient fade at bottom of image */}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                          </div>
                        )}
                        {/* Text content */}
                        <div className={`px-6 pb-7 relative z-10 ${hasImage ? '-mt-6' : 'pt-7'}`}>
                          {item.date && (
                            <div className="inline-block bg-[var(--t6-bg-main)] px-4 py-1.5 rounded-full border border-[var(--t6-border-glass)] text-xs font-bold text-[var(--t6-text-primary)] mb-3 shadow-sm">
                              {item.date}
                            </div>
                          )}
                          <h4 className="text-2xl font-bold text-[var(--t6-text-primary)] mb-3" style={{ fontFamily: 'var(--t6-font-heading)' }}>
                            {item.title}
                          </h4>
                          <ThemeText variant="body" color="gray" align="center" className="text-sm leading-relaxed text-[var(--t6-text-secondary)] font-medium">
                            {item.description}
                          </ThemeText>
                        </div>
                      </div>

                      {/* Connector Line (except last item) */}
                      {index !== content.our_story.length - 1 && (
                        <div className="w-px h-10 bg-gradient-to-b from-[var(--t6-border-glass)] to-transparent mt-4" />
                      )}
                    </ScrollReveal>
                  );
                })}
              </div>
            </ThemeSection>
          )}

          {/* Bride & Groom / Childs */}
          <ThemeSection id="profile" className="py-20 px-4 overflow-hidden relative">
            {assets.flowerL && <img src={assets.flowerL} className="absolute top-0 left-0 w-32 opacity-30 pointer-events-none -translate-x-1/4 -translate-y-1/4" alt="" />}
            {assets.flowerR && <img src={assets.flowerR} className="absolute bottom-0 right-0 w-32 opacity-30 pointer-events-none translate-x-1/4 translate-y-1/4" alt="" />}

            <ThemeHeader size="lg" className="mb-16 text-center uppercase tracking-widest relative z-10 text-[var(--t6-text-primary)]">
              {isKhitan ? 'The Star' : 'We Are Tying The Knot'}
            </ThemeHeader>

            <div className="flex flex-col gap-16 w-full max-w-2xl mx-auto">
              {(isKhitan ? children?.slice(0, 1) : children)?.map((child, index) => {
                const hasImage = child.image || child.profile;

                if (!hasImage) {
                  return (
                    <div key={index} className="flex flex-col items-center gap-3 w-full text-center py-6">
                      <ThemeText variant="caption" color="black" className="tracking-[0.3em] opacity-80 mb-2">
                        {isKhitan ? 'THE STAR' : (index === 0 ? 'THE GROOM' : 'THE BRIDE')}
                      </ThemeText>

                      <h3 className="text-4xl font-bold text-[var(--t6-text-primary)] break-words" style={{ fontFamily: 'var(--t6-font-heading)' }}>
                        {child.name}
                      </h3>

                      <ThemeText variant="body" color="gray" className="max-w-md mx-auto mt-4">
                        {isKhitan ? 'Putra Kebanggaan' : (index === 0 ? 'Putra dari' : 'Putri dari')}
                      </ThemeText>

                      <ThemeText variant="body" color="black" className="font-semibold max-w-md mx-auto text-lg">
                        {(() => {
                          const isGroom = index === 0;
                          const parents = isGroom ? content.parents?.groom : content.parents?.bride;
                          if (parents && parents.father && parents.mother) return `Bapak ${parents.father} & Ibu ${parents.mother}`;
                          return "Bapak & Ibu";
                        })()}
                      </ThemeText>
                    </div>
                  );
                }

                return (
                  <div key={index} className={`flex flex-col items-center gap-8 w-full`}>
                    {/* Image Circular Frame (Mildness Style) */}
                    <div className="relative group w-full max-w-[14rem] mx-auto">
                      <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-white shadow-[0_4px_20px_rgba(74,111,165,0.15)] bg-white">
                        <Image unoptimized={true} 
                          src={child.image || child.profile || ""}
                          alt={child.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover rounded-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-2 w-full mt-2">
                      <h3 className="text-[2.75rem] text-[var(--t6-text-primary)] break-words leading-none" style={{ fontFamily: 'var(--t6-font-heading)' }}>{child.name}</h3>
                      <ThemeText variant="body" color="gray" className="max-w-xs mx-auto text-sm">
                        {isKhitan ? 'Putra Kebanggaan dari' : (index === 0 ? 'Putra Bapak' : 'Putri Bapak')}
                      </ThemeText>
                      <ThemeText variant="body" color="gray" className="max-w-xs mx-auto text-sm font-semibold">
                        {(() => {
                          const isGroom = index === 0;
                          const parents = isGroom ? content.parents?.groom : content.parents?.bride;
                          if (parents && parents.father && parents.mother) return `${parents.father} & Ibu ${parents.mother}`;
                          return "Bapak & Ibu";
                        })()}
                      </ThemeText>
                    </div>
                  </div>
                );
              })}
            </div>
          </ThemeSection>

          {/* Event Details */}
          {
            apiEvents && (
              <ThemeSection
                id="event"
                className="relative py-20"
                style={{ background: 'var(--t6-bg-main)' }}
              >
                {assets.ellipse2 && <img src={assets.ellipse2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg opacity-10 pointer-events-none z-0" alt="" />}

                {/* Mildness Styled Section Header */}
                <ThemeHeader size="lg" className="mb-12 text-center text-[var(--t6-text-primary)] relative z-10" style={{ fontFamily: 'var(--t6-font-heading)', fontSize: '3.5rem', textTransform: 'none', letterSpacing: 'normal' }}>
                  Acara
                </ThemeHeader>

                <div className="grid grid-cols-1 gap-8 relative z-10 px-4">
                  {Object.entries(apiEvents).map(([key, evt], idx) => (
                    <div
                      key={key}
                      className="p-8 rounded-[32px] border text-center space-y-4 hover:shadow-xl transition-all shadow-md bg-white/70 backdrop-blur-md"
                      style={{
                        borderColor: 'white'
                      }}
                    >
                      <ThemeText variant="caption" className="text-xl font-bold text-[var(--t6-text-primary)] tracking-widest uppercase">
                        {evt.title || (isKhitan ? 'Walimatul Khitan' : key === 'pemberkatan' ? 'Pemberkatan' : key === 'resepsi' ? 'Resepsi' : key === 'akad' ? 'Akad Nikah' : (idx === 0 ? 'Akad Nikah' : 'Resepsi'))}
                      </ThemeText>

                      <div className="py-4 border-y border-[var(--t6-border-glass)]">
                        <h4 className="text-2xl font-bold mb-1" style={{ color: 'var(--t6-text-secondary)', fontFamily: 'sans-serif' }}>
                          {(() => {
                            try {
                              const d = new Date(evt.date);
                              return d.toLocaleDateString('id-ID', { weekday: 'long' });
                            } catch { return ''; }
                          })()}
                        </h4>
                        <p className="text-[3rem] font-bold text-[var(--t6-text-primary)] my-0 leading-none" style={{ fontFamily: 'serif' }}>
                          {(() => {
                            try {
                              const d = new Date(evt.date);
                              return d.getDate();
                            } catch { return ''; }
                          })()}
                        </p>
                        <p className="text-lg text-[var(--t6-text-secondary)] font-medium mt-2">
                          {(() => {
                            try {
                              const d = new Date(evt.date);
                              return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                            } catch { return evt.date; }
                          })()}
                        </p>
                      </div>

                      <div className="space-y-1 pt-2">
                        <ThemeText color="gray" className="font-semibold">{evt.time}</ThemeText>
                        <ThemeText color="black" className="font-bold text-[var(--t6-text-primary)]">{evt.location}</ThemeText>
                      </div>

                      {(evt.mapsLink) && (
                        <button
                          onClick={() => window.open(evt.mapsLink, '_blank')}
                          className="mt-6 w-full py-3 rounded-full bg-[#5d7c9d] text-white font-bold text-sm shadow-md hover:bg-[var(--t6-text-primary)] transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Lokasi Acara
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Countdown Timer Section */}
                {eventDate && (
                  <div className="mt-8 mx-4 rounded-[32px] p-8 bg-white/80 backdrop-blur-sm shadow-md border border-white relative z-10">
                    <div className="flex flex-col items-center justify-between gap-6">
                      {/* Center: Timer */}
                      <div className="flex-1 w-full text-center space-y-4">
                        <ThemeText variant="caption" color="black" className="tracking-widest uppercase text-xs text-[var(--t6-text-primary)] font-bold">
                          Menuju Hari Bahagia
                        </ThemeText>
                        <div className="flex justify-center gap-3">
                          {(() => {
                            const now = new Date().getTime();
                            const eventTime = eventDate.getTime();
                            const diff = eventTime - now;

                            // Return early with zeros if event has passed
                            if (diff <= 0) {
                              return ['Days', 'Hours', 'Mins', 'Secs'].map((label, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                  <div className="w-14 h-14 rounded-2xl bg-[var(--t6-bg-main)] flex items-center justify-center text-xl shadow-inner" style={{ color: 'var(--t6-text-primary)', fontFamily: 'var(--t6-font-heading)' }}>
                                    00
                                  </div>
                                  <div className="text-[10px] text-[var(--t6-text-secondary)] mt-2 uppercase tracking-widest font-bold">{label}</div>
                                </div>
                              ));
                            }

                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                            const timeUnits = [
                              { label: 'Hari', value: days },
                              { label: 'Jam', value: hours },
                              { label: 'Menit', value: minutes },
                              { label: 'Detik', value: seconds }
                            ];

                            return timeUnits.map((unit, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--t6-bg-main)] flex items-center justify-center text-2xl shadow-lg relative overflow-hidden" style={{ color: 'var(--t6-text-primary)', fontFamily: 'var(--t6-font-heading)' }}>
                                  <span className="relative z-10">{String(unit.value).padStart(2, '0')}</span>
                                </div>
                                <div className="text-[10px] text-[var(--t6-text-secondary)] mt-2 uppercase tracking-widest font-bold">
                                  {unit.label}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Right: Save Button */}
                      {calendarUrl && (
                        <div className="flex-shrink-0 flex w-full justify-center pt-2">
                          <ThemeButton
                            variant="primary"
                            onClick={() => window.open(calendarUrl, '_blank', 'noopener,noreferrer')}
                            className="w-full px-8 py-3 text-sm"
                          >
                            Simpan ke Kalender
                          </ThemeButton>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ThemeSection>
            )
          }

          {/* Turut Mengundang */}
          <TurutSection enabled={content?.turut?.enabled} list={content?.turut?.list} />

          {/* Video Section */}
          {content?.plugin?.youtube_link && (
            <VideoSection youtubeLink={content.plugin.youtube_link} defaultBgImage1={bgImages[0] || backgroundImage} />
          )}

          {/* Gallery */}
          {
            (gallery?.items && gallery.items.length > 0) && (
              <ThemeSection id="gallery" className="py-20 relative overflow-hidden bg-white/50">
                {/* Decorative background floral */}
                {assets.flowerR && <img src={assets.flowerR} className="absolute -top-10 -right-10 w-48 opacity-20 pointer-events-none rotate-90" alt="" />}
                {assets.flowerL && <img src={assets.flowerL} className="absolute -bottom-10 -left-10 w-48 opacity-20 pointer-events-none -rotate-90" alt="" />}

                <ThemeHeader size="lg" className="mb-12 text-center text-[var(--t6-text-primary)] relative z-10" style={{ fontFamily: 'var(--t6-font-heading)', fontSize: '3rem', textTransform: 'none' }}>
                  Momen Bahagia
                </ThemeHeader>
                <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                  <div className="flex gap-6 px-4 w-max mx-auto">
                    {gallery.items.map((item, idx) => (
                      <div key={idx} className="snap-center shrink-0 w-[280px] sm:w-[320px] rounded-[32px] overflow-hidden shadow-lg border-8 border-white bg-white group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-full aspect-[4/5] relative">
                          <Image unoptimized={true} 
                            src={item}
                            alt="Gallery"
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="object-cover rounded-3xl"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ThemeSection>
            )
          }

          {/* Gift & RSVP */}
          <ThemeSection id="gift" className="py-20 relative">
            {content?.bank_transfer?.enabled && (
              <div className="mb-16">
                <ThemeHeader size="lg" className="mb-10 text-center text-[var(--t6-text-primary)]" style={{ fontFamily: 'var(--t6-font-heading)', fontSize: '3rem', textTransform: 'none' }}>
                  {isKhitan ? "Tanda Kasih" : "Wedding Gift"}
                </ThemeHeader>
                <div className="text-center mb-8">
                  <ThemeText color="gray" className="max-w-md mx-auto">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. <br /> Namun jika Bapak/Ibu/Saudara/i ingin memberikan tanda kasih, dapat melalui dompet digital berikut:
                  </ThemeText>
                </div>

                {/* Relative wrapper so overlay covers entire gift content */}
                <div className="relative">
                  {/* Free Mode Overlay — covers show account button + form */}
                  {data.status === "tidak" && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl border border-[var(--t6-text-primary)]" style={{ minHeight: '80px' }}>
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-[var(--t6-bg-main)] rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiLock className="text-2xl text-[var(--t6-text-primary)]" />
                        </div>
                        <ThemeText variant="meta" color="black" className="mb-1 text-sm font-bold">Mode Trial</ThemeText>
                        <ThemeText variant="caption" color="gray" className="text-xs">
                          Aktifkan undangan untuk fitur ini
                        </ThemeText>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mb-6">
                    <ThemeButton onClick={() => setShowGiftForm(!showGiftForm)}>
                      {showGiftForm ? "Sembunyikan Rekening" : "Tampilkan Rekening"}
                    </ThemeButton>
                  </div>

                  {showGiftForm && (
                    <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md border border-white rounded-[32px] p-8 transition-all shadow-lg mt-4 text-left">
                      {/* Bank Accounts */}
                      {content.bank_transfer?.accounts?.map((acc: any, idx: number) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-[var(--t6-border-glass)] shadow-sm mb-4 relative overflow-hidden group">
                          <div className="relative z-10 flex justify-between items-center">
                            <div>
                              <p className="text-sm uppercase text-[var(--t6-text-secondary)] font-bold mb-1 tracking-widest">{acc.bank_name}</p>
                              <p className="text-2xl font-mono text-[var(--t6-text-primary)] tracking-wider mt-1">{acc.account_number}</p>
                              <p className="text-sm text-zinc-600 mt-2 font-medium">{acc.account_name}</p>
                            </div>
                            <button onClick={() => handleCopyAccountNumber(acc.account_number)} className="p-3 bg-blue-50/50 rounded-xl hover:bg-blue-100 transition-colors text-[var(--t6-text-primary)]">
                              <FiCopy className="text-xl" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Confirmation Form */}
                      <form onSubmit={handleGiftSubmit} className="space-y-4 mt-8 pt-8 border-t border-[var(--t6-border-glass)]">
                        <ThemeText variant="caption" className="text-center mb-6 text-[var(--t6-text-primary)] font-bold text-lg">Konfirmasi Hadiah</ThemeText>

                        <input
                          type="text"
                          placeholder="Nama Lengkap"
                          value={namaGift}
                          onChange={e => setNamaGift(e.target.value)}
                          disabled={data.status === "tidak"}
                          className="w-full bg-white border border-[var(--t6-border-glass)] rounded-xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-[var(--t6-text-primary)] outline-none disabled:opacity-50 shadow-sm"
                        />
                        <input
                          type="text"
                          placeholder="Jumlah Transfer"
                          value={formattedJumlahGift}
                          onChange={handleJumlahGiftChange}
                          disabled={data.status === "tidak"}
                          className="w-full bg-white border border-[var(--t6-border-glass)] rounded-xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-[var(--t6-text-primary)] outline-none disabled:opacity-50 shadow-sm"
                        />
                        <button type="submit" className="w-full mt-4 py-4 rounded-xl bg-[#5d7c9d] text-white font-bold text-sm shadow-md hover:bg-[var(--t6-text-primary)] transition-colors" disabled={loadingGift || data.status === "tidak"}>
                          {data.status === "tidak" ? "Gratis / Trial Mode" : loadingGift ? "Mengirim..." : "Konfirmasi Transfer"}
                        </button>
                        {successGift && <p className="text-green-600 font-medium text-center text-sm pt-2">Terima kasih atas tanda kasihnya!</p>}
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ThemeSection>

          {/* RSVP Section */}
          {content.plugin?.rsvp && (
            <ThemeSection id="rsvp" className="max-w-md mx-auto pt-10 pb-20 px-4">
              <ThemeHeader size="lg" className="mb-10 text-center text-[var(--t6-text-primary)]" style={{ fontFamily: 'var(--t6-font-heading)', fontSize: '3rem', textTransform: 'none' }}>
                Buku Tamu & RSVP
              </ThemeHeader>

              <div className="bg-white/70 backdrop-blur-md shadow-lg border border-white rounded-[32px] p-8 relative">

                {/* Free Mode Overlay for RSVP */}
                {data.status === "tidak" && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[32px] border" style={{ borderColor: 'var(--t6-border-glass)' }}>
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white shadow-sm border border-[var(--t6-border-glass)]">
                        <FiLock className="text-3xl text-[var(--t6-text-primary)]" />
                      </div>
                      <ThemeText variant="meta" className="mb-2 text-lg font-bold text-[var(--t6-text-primary)]">Mode Trial</ThemeText>
                      <ThemeText variant="caption" className="text-sm text-[var(--t6-text-secondary)] font-medium">
                        Aktifkan undangan untuk fitur ini
                      </ThemeText>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    disabled={data.status === "tidak"}
                    className="w-full bg-white border border-[var(--t6-border-glass)] rounded-xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-[var(--t6-text-primary)] outline-none disabled:opacity-50 shadow-sm"
                  />

                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Nomor WhatsApp"
                      value={wa}
                      onChange={e => setWa(e.target.value)}
                      onKeyPress={handleKeyPressWa}
                      disabled={data.status === "tidak"}
                      className="w-full bg-white border border-[var(--t6-border-glass)] rounded-xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-[var(--t6-text-primary)] outline-none disabled:opacity-50 shadow-sm"
                    />
                    <select
                      value={konfirmasi}
                      onChange={e => setKonfirmasi(e.target.value as any)}
                      disabled={data.status === "tidak"}
                      className="w-full bg-white border border-[var(--t6-border-glass)] rounded-xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-[var(--t6-text-primary)] outline-none disabled:opacity-50 shadow-sm"
                    >
                      <option value="" disabled>Kehadiran</option>
                      <option value="hadir">Hadir</option>
                      <option value="tidak hadir">Tidak Hadir</option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Berikan ucapan & doa restu"
                    value={ucapan}
                    onChange={e => setUcapan(e.target.value)}
                    disabled={data.status === "tidak"}
                    rows={4}
                    className="w-full bg-white border border-[var(--t6-border-glass)] rounded-xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-[var(--t6-text-primary)] outline-none disabled:opacity-50 resize-none shadow-sm"
                  />

                  <button type="submit" className="w-full mt-2 py-4 rounded-xl bg-[#5d7c9d] text-white font-bold text-sm shadow-md hover:bg-[var(--t6-text-primary)] transition-colors" disabled={loading || data.status === "tidak"}>
                    {data.status === "tidak" ? "Gratis / Trial Mode" : loading ? "Mengirim..." : "Kirim RSVP"}
                  </button>

                  {success && <p className="text-green-600 font-medium text-center text-sm relative z-20 pt-2">RSVP Berhasil dikirim!</p>}
                  {error && <p className="text-red-500 font-medium text-center text-sm relative z-20 pt-2">{error}</p>}
                </form>

                {/* Comments List */}
                <div className="mt-10 pt-8 border-t border-[var(--t6-border-glass)] space-y-4">
                  <ThemeText variant="caption" className="mb-6 text-[var(--t6-text-primary)] font-bold text-lg text-center">Daftar Ucapan</ThemeText>
                  {rsvpList.slice(0, visibleComments).map((rsvp, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-[var(--t6-border-glass)] shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-bold text-base text-[var(--t6-text-primary)]">{rsvp.nama}</p>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${rsvp.konfirmasi === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {rsvp.konfirmasi}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--t6-text-secondary)] italic leading-relaxed">"{rsvp.ucapan}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </ThemeSection>
          )}

          {/* Footer */}
          <div className="py-8 text-center bg-white/50 backdrop-blur-sm border-t border-white/50 relative z-10">
            <ThemeText variant="meta" color="gray" className="opacity-70 text-sm">
              Created with Papunda
            </ThemeText>
          </div>
        </div>

        {/* Navigation */}
        {isOpen && (
          <Navigation
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            showGallery={!!gallery?.items?.length}
            showGift={!!content?.bank_transfer?.enabled}
            showRsvp={!!content.plugin?.rsvp}
          />
        )}
      </ThemeContainer>
    </div>
  );
}
