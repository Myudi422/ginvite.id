"use client";

import { useState, useEffect } from "react";
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

// Dynamic imports
const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });
const MusicPlayer = dynamic(() => import('./MusicPlayer'), { ssr: false, loading: () => null });
const TurutSection = dynamic(() => import('./TurutSection'), { ssr: false, loading: () => null });

interface Theme5Props {
  data: ThemeData;
}

export default function Theme5({ data }: Theme5Props) {
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
      setTimeout(() => setShowOpeningText(true), 3000);
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

  // Default Wevitation Bloom Blue fallback assets if JSON is empty
  const defaultAssets = {
    flower1: 'https://www.wevitation.com/themes/bloom-blue/img/flower_1.svg',
    flowerL: 'https://www.wevitation.com/themes/bloom-blue/img/flower_l.svg',
    flowerR: 'https://www.wevitation.com/themes/bloom-blue/img/flower_r.svg',
    ellipse1: 'https://www.wevitation.com/themes/bloom-blue/img/ellipse_1.svg',
    ellipse2: 'https://www.wevitation.com/themes/bloom-blue/img/ellipse_2.svg',
  };

  const assets = customSettings?.assets || defaultAssets;

  const customStyle = {
    '--t5-bg-main': customSettings?.colors?.background?.main || '#F5F8FF',
    '--t5-bg-cover': customSettings?.colors?.background?.cover || '#0d3663',
    '--t5-text-primary': customSettings?.colors?.text?.primary || '#4A719C',
    '--t5-text-secondary': customSettings?.colors?.text?.secondary || '#555555',
    '--t5-text-accent': customSettings?.colors?.text?.accent || '#F9EFCB',
    '--t5-text-white': customSettings?.colors?.text?.white || '#FFFFFF',
    '--t5-border-glass': customSettings?.colors?.borders?.glass || 'rgba(74, 113, 156, 0.2)',
    '--t5-grad-button': customSettings?.colors?.gradients?.button || 'linear-gradient(to right, #4A719C, #3b5f87)',
    '--t5-font-heading': customSettings?.fonts?.heading || "'Dancing Script', cursive",
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
            <div className="bg-amber-600/90 backdrop-blur-md text-white py-3 px-4 rounded-xl shadow-2xl pointer-events-auto flex items-center gap-4 w-full border border-amber-400/30">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-100 mb-0.5">Trial Mode</p>
                <p className="text-[10px] text-amber-50/80 leading-tight">Aktifkan untuk fitur lengkap & hilangkan watermark.</p>
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
        <div className={`fixed inset-x-0 mx-auto max-w-[420px] w-full h-[100dvh] flex flex-col justify-between z-50 transition-transform duration-1000 bg-white overflow-hidden py-8 px-6 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
          {/* Top Title */}
          <div className="w-full text-center relative z-20 mt-4">
            <h2 className="text-sm font-bold text-[var(--t5-text-primary)]">
              Wedding Invitation
            </h2>
          </div>

          {/* Main Image Frame */}
          <div className="relative w-full aspect-[3/4] max-h-[45vh] mt-6 mb-8 z-20 mx-auto">
            {/* Decorative Circles */}
            <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#f9efcb] z-30" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-[#d2e0f0] z-30" />

            {/* Image Box */}
            <div className="relative w-full h-full border-[8px] border-[var(--t5-text-primary)] overflow-hidden z-20 bg-zinc-100">
              {isDirectVideo ? (
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={openingVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url(${bgImages[0] || backgroundImage})` }} />
              )}
            </div>
          </div>

          {/* Names */}
          <div className="relative w-full text-center mb-6 z-20">
            {isKhitan ? (
              <h1 className="text-5xl text-[var(--t5-text-primary)]" style={{ fontFamily: 'var(--t5-font-heading)' }}>
                {nickname1}
              </h1>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <span className="text-5xl text-[var(--t5-text-primary)] -ml-12" style={{ fontFamily: 'var(--t5-font-heading)' }}>{nickname1}</span>
                <span className="text-7xl opacity-20 absolute top-1/2 left-1/2 translate-x-2 -translate-y-6 z-0" style={{ color: 'var(--t5-text-primary)', fontFamily: 'serif' }}>&amp;</span>
                <span className="text-5xl text-[var(--t5-text-primary)] ml-8 z-10" style={{ fontFamily: 'var(--t5-font-heading)' }}>{nickname2}</span>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="w-full text-center mb-6 z-20">
            <p className="text-xs font-bold text-[var(--t5-text-primary)]">
              {(() => {
                try {
                  const d = new Date(firstEvent?.date || Date.now());
                  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                } catch { return ''; }
              })()}
            </p>
          </div>

          {/* Bottom Area: Button + Guest + Decor */}
          <div className="w-full flex justify-between items-end relative z-20 flex-1 pb-4">
            <div className="flex flex-col gap-6 w-2/3">
              {/* Action Button */}
              {!isOpen && (
                <button
                  onClick={() => { setIsOpen(true); setShowProfileModal(false); }}
                  className="flex items-center justify-center gap-2 bg-[var(--t5-text-primary)] text-white py-3 px-6 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all self-start w-auto"
                >
                  <FiMail className="text-sm" /> Open Invitation
                </button>
              )}

              {/* Guest Box */}
              <div className={`transition-all duration-1000 ${showOpeningText ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm text-[var(--t5-text-primary)] mb-1">To:</p>
                <p className="text-lg font-bold text-[var(--t5-text-primary)] leading-tight truncate pr-4">
                  {urlParams.toName || "Bapak/Ibu/Saudara/i"}
                </p>
              </div>

              {/* QR Code trigger */}
              {!isOpen && !!(plugin as any)?.qrcode && urlParams.toName && urlParams.toName !== "Bapak/Ibu/Saudara/i" && (
                <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowQr(true)}>
                  <div className="flex flex-col items-start gap-1 text-[var(--t5-text-primary)] opacity-80 hover:opacity-100 group">
                    <span className="text-[10px] uppercase font-bold border-b border-[var(--t5-text-primary)] pb-0.5">Show QR Code</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floral bottom right (anchored to screen corner) */}
          <div className="absolute -bottom-20 -right-16 w-64 opacity-60 pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d2e0f0] rounded-full -translate-y-8 translate-x-4 mix-blend-multiply opacity-60" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#d2e0f0] rounded-full translate-y-4 -translate-x-4 mix-blend-multiply opacity-60" />
            {assets.flowerR && <img src={assets.flowerR} className="w-full h-auto drop-shadow-sm relative z-20" alt="" />}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className={`w-full min-h-screen relative z-10 transition-all duration-1000 bg-[var(--t5-bg-main)] ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 h-0 overflow-hidden pointer-events-none'}`}>

          {/* Quote Section */}
          <ThemeSection className="text-center relative py-20 px-6">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[var(--t5-bg-cover)]"
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
                <ThemeText variant="meta" color="black" className="font-bold text-[var(--t5-text-primary)]">
                  {isKhitan ? "(Q.S An-Najm: 42)" : "(Q.S Az-Zariyah: 49)"}
                </ThemeText>
              )}
            </div>
          </ThemeSection>

          {/* Our Love Story */}
          {Array.isArray(content.our_story) && content.our_story.length > 0 && (
            <ThemeSection id="story" className="py-12 px-4 relative">
              <ThemeHeader size="lg" className="mb-12 text-center uppercase tracking-widest text-[var(--t5-text-primary)] relative z-10">
                Our Journey
              </ThemeHeader>

              <div className="relative space-y-12 max-w-2xl mx-auto before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--t5-border-glass)] before:to-transparent">
                {content.our_story.map((item, index) => {
                  const hasImage = item.pictures && item.pictures[0] && item.pictures[0].trim() !== '';
                  return (
                    <div key={index} className={`relative flex items-center justify-between group is-active`}>
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[var(--t5-bg-main)] shadow shrink-0 z-10" style={{ borderColor: 'var(--t5-bg-main)' }}>
                        <div className="w-3 h-3 bg-[var(--t5-text-primary)] rounded-full"></div>
                      </div>

                      {/* Content Card */}
                      <div className="w-[calc(100%-4rem)] bg-white p-6 rounded-2xl shadow-lg border border-black/5 hover:shadow-xl transition-shadow">
                        {hasImage && (
                          <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
                            <img src={item.pictures[0]} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <h4 className="text-xl font-bold text-[var(--t5-text-primary)] mb-1" style={{ fontFamily: 'var(--t5-font-heading)' }}>{item.title}</h4>
                        {item.date && (
                          <span className="text-xs font-semibold text-[var(--t5-text-secondary)] block mb-3 opacity-80">{item.date}</span>
                        )}
                        <ThemeText variant="body" color="gray" align="left" className="text-sm">
                          {item.description}
                        </ThemeText>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ThemeSection>
          )}

          {/* Bride & Groom / Childs */}
          <ThemeSection id="profile" className="py-20 px-4 overflow-hidden relative">
            {assets.flowerL && <img src={assets.flowerL} className="absolute top-0 left-0 w-32 opacity-30 pointer-events-none -translate-x-1/4 -translate-y-1/4" alt="" />}
            {assets.flowerR && <img src={assets.flowerR} className="absolute bottom-0 right-0 w-32 opacity-30 pointer-events-none translate-x-1/4 translate-y-1/4" alt="" />}

            <ThemeHeader size="lg" className="mb-16 text-center uppercase tracking-widest relative z-10 text-[var(--t5-text-primary)]">
              {isKhitan ? 'The Star' : 'We Are Tying The Knot'}
            </ThemeHeader>

            <div className="flex flex-col gap-16 w-full max-w-2xl mx-auto">
              {children?.map((child, index) => {
                const hasImage = child.image || child.profile;

                if (!hasImage) {
                  return (
                    <div key={index} className="flex flex-col items-center gap-3 w-full text-center py-6">
                      <ThemeText variant="caption" color="black" className="tracking-[0.3em] opacity-80 mb-2">
                        {isKhitan ? 'THE STAR' : (index === 0 ? 'THE GROOM' : 'THE BRIDE')}
                      </ThemeText>

                      <h3 className="text-4xl font-bold text-[var(--t5-text-primary)] break-words" style={{ fontFamily: 'var(--t5-font-heading)' }}>
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
                    {/* Image Frame - Arched shape */}
                    <div className="relative group w-full max-w-[14rem] mx-auto">
                      <div className="relative w-full aspect-[3/4] rounded-t-full rounded-b-3xl overflow-hidden border border-[var(--t5-border-glass)] shadow-xl bg-white p-2">
                        <img src={child.image || child.profile} alt={child.name} className="w-full h-full object-cover rounded-t-full rounded-b-2xl transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-3 w-full">
                      <ThemeText variant="caption" color="black" className="tracking-[0.3em] opacity-80">
                        {isKhitan ? 'THE STAR' : (index === 0 ? 'THE GROOM' : 'THE BRIDE')}
                      </ThemeText>
                      <h3 className="text-4xl font-bold text-[var(--t5-text-primary)] break-words" style={{ fontFamily: 'var(--t5-font-heading)' }}>{child.name}</h3>
                      <ThemeText variant="body" color="gray" className="max-w-xs mx-auto">
                        {isKhitan ? 'Putra Kebanggaan dari' : (index === 0 ? 'Putra dari' : 'Putri dari')}
                      </ThemeText>
                      <ThemeText variant="body" color="black" className="font-semibold max-w-xs mx-auto text-lg pt-1">
                        {(() => {
                          const isGroom = index === 0;
                          const parents = isGroom ? content.parents?.groom : content.parents?.bride;
                          if (parents && parents.father && parents.mother) return `Bapak ${parents.father} & Ibu ${parents.mother}`;
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
                style={{ background: 'var(--t5-bg-main)' }}
              >
                {assets.ellipse2 && <img src={assets.ellipse2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg opacity-10 pointer-events-none z-0" alt="" />}

                <ThemeHeader size="lg" className="mb-10 text-center uppercase tracking-widest relative z-10">
                  Save The Date
                </ThemeHeader>

                <div className="grid grid-cols-1 gap-8 relative z-10">
                  {Object.entries(apiEvents).map(([key, evt], idx) => (
                    <div
                      key={key}
                      className="p-8 rounded-3xl border text-center space-y-4 hover:shadow-2xl transition-all shadow-xl backdrop-blur-sm bg-white"
                      style={{
                        borderColor: 'var(--t5-border-glass)'
                      }}
                    >
                      <ThemeText variant="caption" color="gold" className="text-lg font-bold">
                        {evt.title || (key === 'pemberkatan' ? 'Pemberkatan' : key === 'resepsi' ? 'Resepsi' : key === 'akad' ? 'Akad Nikah' : (idx === 0 ? 'Akad Nikah' : 'Resepsi'))}
                      </ThemeText>

                      <div className="py-4 border-y border-black/10">
                        <h4 className="text-3xl font-bold mb-1" style={{ color: 'var(--t5-text-primary)', fontFamily: 'var(--t5-font-heading)' }}>
                          {(() => {
                            try {
                              const d = new Date(evt.date);
                              return d.toLocaleDateString('id-ID', { weekday: 'long' });
                            } catch { return ''; }
                          })()}
                        </h4>
                        <p className="text-4xl font-bold text-[var(--t5-text-primary)] my-2">
                          {(() => {
                            try {
                              const d = new Date(evt.date);
                              return d.getDate();
                            } catch { return ''; }
                          })()}
                        </p>
                        <p className="text-lg text-zinc-400">
                          {(() => {
                            try {
                              const d = new Date(evt.date);
                              return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                            } catch { return evt.date; }
                          })()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <ThemeText color="gray">{evt.time}</ThemeText>
                        <ThemeText color="white" className="font-medium">{evt.location}</ThemeText>
                      </div>

                      {(evt.mapsLink) && (
                        <ThemeButton variant="outline" className="mt-4 w-full" onClick={() => window.open(evt.mapsLink, '_blank')}>
                          Open Maps
                        </ThemeButton>
                      )}
                    </div>
                  ))}
                </div>

                {/* Countdown Timer Section */}
                {eventDate && (
                  <div className="mt-8 w-full max-w-sm mx-auto rounded-3xl p-6 bg-white shadow-xl transition-all border border-black/5">
                    <div className="flex flex-col items-center justify-between gap-6">
                      {/* Center: Timer */}
                      <div className="flex-1 w-full text-center space-y-4">
                        <ThemeText variant="caption" color="black" className="tracking-widest uppercase text-xs text-[var(--t5-text-primary)] font-bold">
                          Counting Down
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
                                  <div className="w-14 h-14 rounded-2xl bg-[var(--t5-bg-main)] flex items-center justify-center text-xl shadow-inner" style={{ color: 'var(--t5-text-primary)', fontFamily: 'var(--t5-font-heading)' }}>
                                    00
                                  </div>
                                  <div className="text-[10px] text-[var(--t5-text-secondary)] mt-2 uppercase tracking-widest font-bold">{label}</div>
                                </div>
                              ));
                            }

                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                            const timeUnits = [
                              { label: 'Days', value: days },
                              { label: 'Hours', value: hours },
                              { label: 'Mins', value: minutes },
                              { label: 'Secs', value: seconds }
                            ];

                            return timeUnits.map((unit, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--t5-bg-main)] flex items-center justify-center text-2xl shadow-lg relative overflow-hidden" style={{ color: 'var(--t5-text-primary)', fontFamily: 'var(--t5-font-heading)' }}>
                                  <span className="relative z-10">{String(unit.value).padStart(2, '0')}</span>
                                </div>
                                <div className="text-[10px] text-[var(--t5-text-secondary)] mt-2 uppercase tracking-widest font-bold">
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
                            Save to Calendar
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

          {/* Gallery */}
          {
            gallery?.items && gallery.items.length > 0 && (
              <ThemeSection id="gallery">
                <ThemeHeader size="lg" className="mb-8 text-center uppercase tracking-widest text-[var(--t5-text-primary)]">
                  Our Moments
                </ThemeHeader>
                <div className="columns-2 gap-3 space-y-3">
                  {gallery.items.map((item, idx) => (
                    <div key={idx} className="break-inside-avoid rounded-xl overflow-hidden shadow-lg border border-white/5 group">
                      <img
                        src={item}
                        alt="Gallery"
                        className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </ThemeSection>
            )
          }

          {/* Gift & RSVP */}
          <ThemeSection id="gift">
            {content?.bank_transfer?.enabled && (
              <div className="mb-8">
                <ThemeHeader size="lg" className="mb-6 text-center uppercase tracking-widest text-[var(--t5-text-primary)]">
                  Wedding Gift
                </ThemeHeader>
                <div className="text-center mb-6">
                  <ThemeText color="gray">
                    Your blessing is enough for us. <br /> However, if you wish to give a gift, we provide a digital wallet.
                  </ThemeText>
                </div>

                {/* Relative wrapper so overlay covers entire gift content */}
                <div className="relative">
                  {/* Free Mode Overlay — covers show account button + form */}
                  {data.status === "tidak" && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl border border-[var(--t5-text-primary)]" style={{ minHeight: '80px' }}>
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-[var(--t5-bg-main)] rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiLock className="text-2xl text-[var(--t5-text-primary)]" />
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
                      {showGiftForm ? "Hide Account" : "Show Account"}
                    </ThemeButton>
                  </div>

                  {showGiftForm && (
                    <div className="max-w-md mx-auto bg-white border border-black/10 rounded-2xl p-6 transition-all shadow-xl">
                      {/* Bank Accounts */}
                      {content.bank_transfer?.accounts?.map((acc: any, idx: number) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-black/10 shadow-md mb-4 relative overflow-hidden">
                          <div className="relative z-10 flex justify-between items-center">
                            <div>
                              <p className="text-xs uppercase text-[var(--t5-text-primary)] font-bold mb-1">{acc.bank_name}</p>
                              <p className="text-xl font-mono text-zinc-900 tracking-wider">{acc.account_number}</p>
                              <p className="text-sm text-zinc-600 mt-1">{acc.account_name}</p>
                            </div>
                            <button onClick={() => handleCopyAccountNumber(acc.account_number)} className="p-2 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors text-zinc-900">
                              <FiCopy />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Confirmation Form */}
                      <form onSubmit={handleGiftSubmit} className="space-y-4 mt-6 pt-6 border-t border-white/10">
                        <ThemeText variant="caption" color="gold" className="text-center mb-4">Confirmation Form</ThemeText>

                        <input
                          type="text"
                          placeholder="Name"
                          value={namaGift}
                          onChange={e => setNamaGift(e.target.value)}
                          disabled={data.status === "tidak"}
                          className="w-full bg-zinc-50 border border-black/10 rounded-lg px-4 py-3 text-zinc-900 focus:ring-1 focus:ring-[var(--t5-text-primary)] outline-none disabled:opacity-50"
                        />
                        <input
                          type="text"
                          placeholder="Amount"
                          value={formattedJumlahGift}
                          onChange={handleJumlahGiftChange}
                          disabled={data.status === "tidak"}
                          className="w-full bg-zinc-50 border border-black/10 rounded-lg px-4 py-3 text-zinc-900 focus:ring-1 focus:ring-[var(--t5-text-primary)] outline-none disabled:opacity-50"
                        />
                        <ThemeButton variant="outline" className="w-full" disabled={loadingGift || data.status === "tidak"}>
                          {data.status === "tidak" ? "Free Mode" : loadingGift ? "Sending..." : "Confirm Transfer"}
                        </ThemeButton>
                        {successGift && <p className="text-green-500 text-center text-sm">Thank you!</p>}
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ThemeSection>

          {/* RSVP Section */}
          {content.plugin?.rsvp && (
            <ThemeSection id="rsvp" className="max-w-md mx-auto">
              <ThemeHeader size="lg" className="mb-6 text-center uppercase tracking-widest text-[var(--t5-text-primary)]">
                RSVP
              </ThemeHeader>

              <div className="bg-white shadow-xl border border-black/10 rounded-2xl p-6 relative">

                {/* Free Mode Overlay for RSVP */}
                {data.status === "tidak" && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl border" style={{ borderColor: 'var(--t5-border-glass)' }}>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--t5-border-glass)' }}>
                        <FiLock className="text-2xl text-[var(--t5-text-primary)]" />
                      </div>
                      <ThemeText variant="meta" color="white" className="mb-1 text-sm">Mode Trial</ThemeText>
                      <ThemeText variant="caption" color="gray" className="text-xs">
                        Aktifkan undangan untuk fitur ini
                      </ThemeText>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    disabled={data.status === "tidak"}
                    className="w-full bg-zinc-50 border border-black/10 rounded-lg px-4 py-3 text-zinc-900 focus:ring-1 focus:ring-[var(--t5-text-primary)] outline-none disabled:opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp Number"
                    value={wa}
                    onChange={e => setWa(e.target.value)}
                    onKeyPress={handleKeyPressWa}
                    disabled={data.status === "tidak"}
                    className="w-full bg-zinc-50 border border-black/10 rounded-lg px-4 py-3 text-zinc-900 focus:ring-1 focus:ring-[var(--t5-text-primary)] outline-none disabled:opacity-50"
                  />
                  <select
                    value={konfirmasi}
                    onChange={e => setKonfirmasi(e.target.value as any)}
                    disabled={data.status === "tidak"}
                    className="w-full bg-zinc-50 border border-black/10 rounded-lg px-4 py-3 text-zinc-900 focus:ring-1 focus:ring-[var(--t5-text-primary)] outline-none disabled:opacity-50 appearance-none"
                  >
                    <option value="" disabled>Will you attend?</option>
                    <option value="hadir">Yes, I will attend</option>
                    <option value="tidak hadir">Sorry, I can't attend</option>
                  </select>
                  <textarea
                    placeholder="Wishes & Prayers"
                    value={ucapan}
                    onChange={e => setUcapan(e.target.value)}
                    disabled={data.status === "tidak"}
                    rows={4}
                    className="w-full bg-zinc-50 border border-black/10 rounded-lg px-4 py-3 text-zinc-900 focus:ring-1 focus:ring-[var(--t5-text-primary)] outline-none disabled:opacity-50 resize-none"
                  />
                  <ThemeButton className="w-full" disabled={loading || data.status === "tidak"}>
                    {data.status === "tidak" ? "Free Mode" : loading ? "Sending..." : "Send RSVP"}
                  </ThemeButton>
                  {success && <p className="text-green-500 text-center text-sm relative z-20">RSVP Sent successfully!</p>}
                  {error && <p className="text-red-500 text-center text-sm relative z-20">{error}</p>}
                </form>

                {/* Comments List */}
                <div className="mt-8 pt-8 border-t border-black/10 space-y-4">
                  <ThemeText variant="caption" className="mb-4 text-[var(--t5-text-primary)] font-bold">Recent Wishes</ThemeText>
                  {rsvpList.slice(0, visibleComments).map((rsvp, idx) => (
                    <div key={idx} className="bg-zinc-50 p-4 rounded-xl border border-black/5 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-sm text-[var(--t5-text-primary)]">{rsvp.nama}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${rsvp.konfirmasi === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {rsvp.konfirmasi}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 italic">"{rsvp.ucapan}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </ThemeSection>
          )}

          {/* Footer */}
          <div className="py-8 text-center border-t border-black/5 bg-white">
            <ThemeText variant="meta" color="gray" className="opacity-70 text-sm">
              Created with Papunda
            </ThemeText>
          </div>
        </div >

        {/* Navigation */}
        {
          isOpen && (
            <Navigation
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              showGallery={!!gallery?.items?.length}
              showGift={!!content?.bank_transfer?.enabled}
              showRsvp={!!content.plugin?.rsvp}
            />
          )
        }
      </ThemeContainer>
    </div>
  );
}
