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
import { FiCopy } from 'react-icons/fi';

// Dynamic imports
const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });
const MusicPlayer = dynamic(() => import('./MusicPlayer'), { ssr: false, loading: () => null });
const TurutSection = dynamic(() => import('./TurutSection'), { ssr: false, loading: () => null });

interface Theme4Props {
  data: ThemeData;
}

export default function Theme4({ data }: Theme4Props) {
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
  const backgroundImage = gallery?.items?.[0] || theme.defaultBgImage1 || '/images/default-wedding.jpg';
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
      setUrlParams({ userId, title, toName });
      setShowProfileModal(true);

      // Delay showing text in opening
      setTimeout(() => setShowOpeningText(true), 3000);
    }
  }, [params, searchParams]);

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

  return (
    <ThemeContainer>
      {/* Payment Banner */}
      {data.status === "tidak" && (
        <div className="fixed top-20 left-4 right-4 z-50 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="bg-amber-600/90 backdrop-blur-md text-white py-3 px-4 rounded-xl shadow-2xl pointer-events-auto flex items-center gap-4 max-w-sm w-full border border-amber-400/30">
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
      {/* Opening / Profile Modal */}
      {showProfileModal && (
        <OpeningModal
          onClose={handleProfileModalClose}
          selectedProfile={urlParams.toName || "Bapak/Ibu/Saudara/i"}
          qrData={urlParams.toName}
          onShowQr={() => setShowQr(true)}
        />
      )}

      <QRModal
        show={showQr}
        onClose={() => setShowQr(false)}
        qrData={urlParams.toName || "Bapak/Ibu/Saudara/i"}
      />

      {/* Music Player */}
      {musicEnabled && musicUrl && isClient && (
        <MusicPlayer url={musicUrl} autoPlay={isOpen} />
      )}



      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>

        {/* Full Screen Video Hero */}
        <div id="home" className="relative h-screen w-full overflow-hidden">
          {isDirectVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={openingVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}

          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />

          {/* Opening Content Overlay */}
          <div className={`absolute inset-0 flex flex-col items-center justify-end pb-32 text-center px-4 space-y-4 transition-all duration-1000 ${showOpeningText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ThemeText variant="caption" color="gold" className="tracking-[0.5em]">
              THE WEDDING OF
            </ThemeText>
            <h1 className="text-5xl md:text-6xl font-serif text-white font-bold tracking-wide">
              {isKhitan ? nickname1 : nickname}
            </h1>
            <ThemeText variant="body" color="white" className="italic text-lg opacity-90">
              {formattedDate}
            </ThemeText>

            <div className="animate-bounce pt-8 opacity-70">
              <DownArrowIcon className="w-8 h-8 text-amber-200" />
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <ThemeSection className="text-center relative py-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-amber-500/50" />
          <ThemeText variant="quote" color="gold" className="max-w-xs mx-auto mb-6">
            {data.content.quote
              ? (typeof data.content.quote === 'string' ? data.content.quote : (data.content.quote.text || data.content.quote.quote))
              : (isKhitan
                ? '"Dan bahwasannya kepada Tuhanmu adalah kesudahan (segala sesuatu)"'
                : '"Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)"'
              )
            }
          </ThemeText>
          <ThemeText variant="meta" color="gray">
            {isKhitan ? "(Q.S An-Najm: 42)" : "(Q.S Az-Zariyah: 49)"}
          </ThemeText>
        </ThemeSection>

        {/* Our Love Story */}
        {Array.isArray(content.our_story) && content.our_story.length > 0 && (
          <ThemeSection id="story" className="py-12 px-4">
            <ThemeHeader size="lg" className="mb-12 text-center uppercase tracking-widest text-amber-500">
              Our Love Story
            </ThemeHeader>

            <div className="relative space-y-10">
              {content.our_story.map((item, index) => {
                const hasImage = item.pictures && item.pictures[0] && item.pictures[0].trim() !== '';
                return (
                  <div key={index} className="flex flex-col gap-3 bg-zinc-900/50 border border-white/5 rounded-2xl p-5 shadow-xl hover:border-amber-500/30 transition-all duration-300">
                    {/* Header: Image + Title */}
                    <div className="flex flex-row items-start gap-4">
                      <div className="relative w-28 h-20 flex items-center justify-center overflow-hidden rounded-lg bg-zinc-800 shrink-0">
                        {hasImage ? (
                          <img
                            src={item.pictures[0]}
                            alt={item.title || `Episode ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-3xl">📖</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Episode {index + 1}</span>
                        <h4 className="text-base font-serif font-bold text-white mt-0.5">{item.title}</h4>
                        {item.date && (
                          <span className="text-xs text-zinc-400">{item.date}</span>
                        )}
                      </div>
                    </div>
                    {/* Description */}
                    <ThemeText variant="body" color="gray" className="text-sm leading-relaxed">
                      {item.description}
                    </ThemeText>
                  </div>
                );
              })}
            </div>
          </ThemeSection>
        )}

{/* Bride & Groom / Childs */ }
<ThemeSection id="event" className="py-12 px-4 overflow-hidden">
  <ThemeHeader size="lg" className="mb-12 text-center uppercase tracking-widest text-amber-500">
    {isKhitan ? 'The Star' : 'The Couple'}
  </ThemeHeader>

  <div className="flex flex-col gap-12 w-full">
    {children?.map((child, index) => {
      const hasImage = child.image || child.profile;
      // Alternate layout logic if 2 people
      const isReverse = index % 2 !== 0;

      if (!hasImage) {
        return (
          <div key={index} className="flex flex-col items-center gap-3 w-full text-center py-6 animate-fade-in-up">
            <ThemeText variant="caption" color="gold" className="tracking-[0.3em] opacity-80 mb-2">
              {isKhitan ? 'THE STAR' : (index === 0 ? 'THE GROOM' : 'THE BRIDE')}
            </ThemeText>

            <h3 className="text-4xl md:text-5xl font-serif font-bold text-amber-100 break-words drop-shadow-2xl">
              {child.name}
            </h3>

            <div className="flex items-center gap-4 opacity-50 my-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-200"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200"></div>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-200"></div>
            </div>

            <ThemeText variant="body" color="gray" className="max-w-md mx-auto">
              {isKhitan ? 'Putra Kebanggaan' : (index === 0 ? 'Putra Pertama dari pasangan' : 'Putri Pertama dari pasangan')}
            </ThemeText>

            <ThemeText variant="meta" color="white" className="italic max-w-md mx-auto text-lg">
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
        <div key={index} className={`flex flex-col ${children.length > 1 ? (isReverse ? 'md:flex-row-reverse' : 'md:flex-row') : ''} items-center gap-6 md:gap-12 w-full`}>
          {/* Image Frame */}
          <div className="relative group w-full max-w-[16rem] mx-auto">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-all" />
            <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-amber-500/20 shadow-2xl">
              <img src={child.image || child.profile} alt={child.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left space-y-4 w-full">
            <h3 className="text-3xl font-serif font-bold text-amber-100 break-words">{child.name}</h3>
            <ThemeText variant="body" color="gray" className="max-w-xs mx-auto md:mx-0">
              {isKhitan ? 'Putra Kebanggaan' : (index === 0 ? 'Putra dari' : 'Putri dari')}
            </ThemeText>
            <ThemeText variant="meta" color="white" className="italic max-w-xs mx-auto md:mx-0">
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

{/* Event Details */ }
{
  apiEvents && (
    <ThemeSection className="bg-zinc-900/30 py-16">
      <ThemeHeader size="lg" className="mb-8 text-center uppercase tracking-widest text-amber-500">
        Save The Date
      </ThemeHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(apiEvents).map(([key, evt], idx) => (
          <div key={key} className="bg-zinc-950/50 p-8 rounded-2xl border border-white/5 text-center space-y-4 hover:border-amber-500/20 transition-all">
            <ThemeText variant="caption" color="gold" className="text-lg">
              {evt.title || (idx === 0 ? 'Akad Nikah' : 'Resepsi')}
            </ThemeText>

            <div className="py-4 border-y border-white/10">
              <h4 className="text-2xl font-serif text-white mb-1">
                {(() => {
                  try {
                    const d = new Date(evt.date);
                    return d.toLocaleDateString('id-ID', { weekday: 'long' });
                  } catch { return ''; }
                })()}
              </h4>
              <p className="text-4xl font-bold text-amber-100 my-2">
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
    </ThemeSection>
  )
}

{/* Turut Mengundang */ }
<TurutSection enabled={content?.turut?.enabled} list={content?.turut?.list} />

{/* Gallery */ }
{
  gallery?.items && gallery.items.length > 0 && (
    <ThemeSection id="gallery">
      <ThemeHeader size="lg" className="mb-8 text-center uppercase tracking-widest text-amber-500">
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

{/* Gift & RSVP */ }
<ThemeSection id="gift" className="mb-24">
  {content?.bank_transfer?.enabled && (
    <div className="mb-12">
      <ThemeHeader size="lg" className="mb-6 text-center uppercase tracking-widest text-amber-500">
        Wedding Gift
      </ThemeHeader>
      <div className="text-center mb-6">
        <ThemeText color="gray">
          Your blessing is enough for us. <br /> However, if you wish to give a gift, we provide a digital wallet.
        </ThemeText>
      </div>

      <div className="flex justify-center mb-6">
        <ThemeButton onClick={() => setShowGiftForm(!showGiftForm)}>
          {showGiftForm ? "Hide Account" : "Show Account"}
        </ThemeButton>
      </div>

      {showGiftForm && (
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all animate-in fade-in slide-in-from-bottom-4">
          {/* Bank Accounts */}
          {content.bank_transfer?.accounts?.map((acc: any, idx: number) => (
            <div key={idx} className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 rounded-xl border border-white/5 mb-4 relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase text-amber-500 font-bold mb-1">{acc.bank_name}</p>
                  <p className="text-xl font-mono text-white tracking-wider">{acc.account_number}</p>
                  <p className="text-sm text-zinc-400 mt-1">{acc.account_name}</p>
                </div>
                <button onClick={() => handleCopyAccountNumber(acc.account_number)} className="p-2 bg-zinc-700/50 rounded-lg hover:bg-zinc-700 transition-colors text-white">
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
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <input
              type="text"
              placeholder="Amount"
              value={formattedJumlahGift}
              onChange={handleJumlahGiftChange}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <ThemeButton variant="outline" className="w-full" disabled={loadingGift}>
              {loadingGift ? "Sending..." : "Confirm Transfer"}
            </ThemeButton>
            {successGift && <p className="text-green-500 text-center text-sm">Thank you!</p>}
          </form>
        </div>
      )}
    </div>
  )}

  {/* RSVP Section */}
  {content.plugin?.rsvp && (
    <div id="rsvp" className="max-w-md mx-auto">
      <ThemeHeader size="lg" className="mb-6 text-center uppercase tracking-widest text-amber-500">
        RSVP
      </ThemeHeader>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={nama}
            onChange={e => setNama(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <input
            type="text"
            placeholder="WhatsApp Number"
            value={wa}
            onChange={e => setWa(e.target.value)}
            onKeyPress={handleKeyPressWa}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <select
            value={konfirmasi}
            onChange={e => setKonfirmasi(e.target.value as any)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 outline-none"
          >
            <option value="">Confirmation</option>
            <option value="hadir">Hadir</option>
            <option value="tidak hadir">Tidak Hadir</option>
          </select>
          <textarea
            placeholder="Wishes"
            value={ucapan}
            onChange={e => setUcapan(e.target.value)}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <ThemeButton className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send RSVP"}
          </ThemeButton>
          {success && <p className="text-green-500 text-center text-sm">RSVP Sent successfully!</p>}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>

        {/* Comments List */}
        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
          <ThemeText variant="caption" className="mb-4">Recent Wishes</ThemeText>
          {rsvpList.slice(0, visibleComments).map((rsvp, idx) => (
            <div key={idx} className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-amber-200 text-sm">{rsvp.nama}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${rsvp.konfirmasi === 'hadir' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                  {rsvp.konfirmasi}
                </span>
              </div>
              <p className="text-xs text-zinc-400 italic">"{rsvp.ucapan}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

</ThemeSection>

{/* Footer */ }
<div className="py-8 text-center border-t border-white/5 bg-zinc-950">
  <ThemeText variant="meta" color="gray" className="opacity-50">
    Created with Papunda
  </ThemeText>
</div>
      </div >

  {/* Navigation */ }
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
    </ThemeContainer >
  );
}
