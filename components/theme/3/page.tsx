"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeData, processFont, getFirstEvent, createCalendarUrl } from "@/lib/theme-data";
import { midtransAction, toggleStatusAction } from "@/app/actions/indexcontent";
import { recordContentView } from "@/app/actions/view";
import NetflixContainer, { NetflixSection, NetflixHeader, NetflixText, NetflixBadge } from "./NetflixComponents";
import NetflixStyleImage from "./NetflixStyleImage";
import ProfilePopup from "./ProfilePopup";
import { NetflixIcon, DownArrowIcon } from "./icon";
import { FaUser, FaWhatsapp, FaComment, FaCalendarCheck, FaPaperPlane } from 'react-icons/fa';
import { FiChevronDown, FiLock, FiCopy } from 'react-icons/fi';
import { submitRsvp, getRsvpList } from '@/app/actions/rsvp';
import { submitBankTransfer } from '@/app/actions/bank';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });

interface Theme3Props {
  data: ThemeData;
}

export default function Theme3({ data }: Theme3Props) {
  const cuId = data.content_user_id;
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<{ userId?: string; title?: string; toName?: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
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
  const [errorRsvp, setErrorRsvp] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState(5);
  const [showComments, setShowComments] = useState(false);
  // Gift/Bank transfer states
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [namaGift, setNamaGift] = useState('');
  const [jumlahGift, setJumlahGift] = useState('');
  const [formattedJumlahGift, setFormattedJumlahGift] = useState('');
  const [loadingGift, setLoadingGift] = useState(false);
  const [errorGift, setErrorGift] = useState<string | null>(null);
  const [successGift, setSuccessGift] = useState(false);
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);

  const searchParams = useSearchParams();
  const params = useParams();

  // Payment handler
  const handlePayment = async () => {
    if (typeof window === 'undefined') {
      setPaymentError('Fitur pembayaran tidak tersedia');
      return;
    }

    const { userId, title } = urlParams;
    
    if (!cuId || !userId || !title) {
      console.error('Payment data missing:', { cuId, userId, title });
      setPaymentError('Data undangan tidak lengkap');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const mjson = await midtransAction({
        user_id: parseInt(userId),
        id_content: cuId,
        title: decodeURIComponent(title),
      });

      if (mjson.status === 'paid') {
        await toggleStatusAction({
          user_id: parseInt(userId),
          id: cuId,
          title: decodeURIComponent(title),
          status: 1,
        });
        window.location.reload();
      } else {
        // @ts-ignore
        if (typeof window.snap !== 'undefined') {
          // @ts-ignore
          window.snap.pay(mjson.snap_token, {
            onSuccess: async () => {
              await toggleStatusAction({
                user_id: parseInt(userId),
                id: cuId,
                title: decodeURIComponent(title),
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

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const userId = params?.userId as string;
      const title = params?.title as string;
      const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";
      
      setUrlParams({ userId, title, toName });
    }
    
    // Only hide scroll on landing page, allow scroll when content is open
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [params, searchParams, isOpen]);

  // Load RSVP list
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

  // Destructure data
  const { theme, content, event: apiEvents, category_type } = data;
  const { children, gallery, title: eventTitle } = content;

  // Get bank transfer data
  const bankTransfer = content?.bank_transfer;

  // Get first event
  const firstEvent = getFirstEvent(apiEvents);
  const nickname1 = children?.[0]?.nickname || '';
  const nickname2 = children?.[1]?.nickname || '';
  const nickname = [nickname1, nickname2].filter(Boolean).join(' & ');

  // Get background image
  const backgroundImage = gallery?.items?.[0] || theme.defaultBgImage1 || '/images/default-wedding.jpg';

  // Check if it's wedding
  const isWedding = !!content.parents?.groom;
  const lowerCategory = (category_type?.name || '').toString().toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');

  // Check for YouTube video
  const youtubeLink = content?.plugin?.youtube_link;
  const hasYoutubeVideo = youtubeLink && youtubeLink.trim() !== '';

  // Validate YouTube URL
  const isValidYouTubeLink = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // RSVP form handlers
  const handleKeyPressWa = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !ucapan.trim() || !konfirmasi || !wa.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (wa.trim().length < 10) {
      setError('Nomor WhatsApp tidak valid.');
      return;
    }

    setLoading(true);
    try {
      await submitRsvp(cuId, nama, wa, ucapan, konfirmasi, `/undang/${cuId}`);
      setSuccess(true);
      setNama(''); setWa(''); setUcapan(''); setKonfirmasi('');
      setShowComments(true);
      const updated = await getRsvpList(cuId);
      setRsvpList(updated);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const loadMoreComments = () => setVisibleComments(prev => prev + 5);

  const timeAgo = (dateString: string) => {
    const utcDate = new Date(dateString);
    const jakartaOffset = 7 * 60; // in minutes
    const localDate = new Date(utcDate.getTime() + jakartaOffset * 60000);
    const now = new Date();
    const diff = now.getTime() - localDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} bulan yang lalu`;
    if (weeks > 0) return `${weeks} minggu yang lalu`;
    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    return `${minutes} menit yang lalu`;
  };

  // Gift form handlers
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

  const handleCopyAccountNumber = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      alert("Nomor rekening berhasil disalin!");
    } catch {
      alert("Gagal menyalin nomor rekening.");
    }
  };

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGift(null);
    if (!namaGift.trim() || !jumlahGift.trim()) {
      setErrorGift('Nama dan jumlah wajib diisi.');
      return;
    }
    setLoadingGift(true);
    try {
      await submitBankTransfer({
        nominal: parseFloat(jumlahGift),
        user_id: cuId,
        nama_pemberi: namaGift,
      });

      setSuccessGift(true);
      setNamaGift("");
      setJumlahGift("");
      setFormattedJumlahGift("");
    } catch (err: any) {
      setErrorGift(err.message);
    }
    setLoadingGift(false);
  };

  // Format date
  const eventDate = firstEvent ? new Date(`${firstEvent.date}T${firstEvent.time}`) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }) : '';

  return (
    <NetflixContainer>
      {/* Payment Banner */}
      {data.status === "tidak" && (
        <div className="fixed top-0 left-0 w-full bg-yellow-300 text-yellow-900 py-1 z-50 text-center font-medium" style={{ maxWidth: '400px', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3">
            <span className="text-xs sm:text-sm">Undangan dalam mode ujicoba/gratis.</span>
            {isClient && (
              <Button 
                size="sm"
                variant="outline"
                className="bg-white text-yellow-900 border-yellow-600 hover:bg-yellow-50 disabled:opacity-50 text-xs whitespace-nowrap px-2 py-1"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Memproses...' : 'Aktifkan Sekarang'}
              </Button>
            )}
          </div>
          {paymentError && isClient && (
            <div className="text-red-600 text-xs mt-1 px-3">
              {paymentError}
            </div>
          )}
        </div>
      )}

      {/* Landing Page */}
      {!isOpen && (
        <div className="relative min-h-screen w-full overflow-hidden">
          {/* Background Image - Full Screen */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          
          {/* Gradient Overlay - More solid at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Top Header with Netflix Logo and Profile */}
            <div className="flex items-center justify-between p-4 sm:p-6 pt-6 sm:pt-8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <NetflixIcon className="w-16 sm:w-20 h-auto text-red-600" />
              </div>
              <ProfilePopup toName={urlParams.toName || "Bapak/Ibu/Saudara/i"} />
            </div>
            
            {/* Spacer to push content to bottom */}
            <div className="flex-1" />
            
            {/* Main Content - Bottom Left */}
            <div className="p-4 sm:p-6 pb-20 sm:pb-24 space-y-3 sm:space-y-4 flex-shrink-0">
              <div className="text-left">
                {isKhitan ? (
                  <>
                    <div className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-1">{nickname1}:</div>
                    <div className="text-xl sm:text-3xl font-semibold text-white">Khitanan</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-1">{nickname}:</div>
                    <div className="text-xl sm:text-3xl font-semibold text-white">
                      {isWedding ? 'Menuju Hari Bahagia' : 'Celebration'}
                    </div>
                  </>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <NetflixBadge variant="primary">Coming soon</NetflixBadge>
                <NetflixText variant="meta">{formattedDate}</NetflixText>
              </div>
              
              {/* Genre Tags */}
              <div className="flex gap-2 flex-wrap mb-4 sm:mb-6">
                <NetflixBadge>{isKhitan ? '#khitanan' : '#romantic'}</NetflixBadge>
                <NetflixBadge>{isKhitan ? '#family' : '#getmarried'}</NetflixBadge>
                <NetflixBadge>#family</NetflixBadge>
                <NetflixBadge>#documenter</NetflixBadge>
              </div>
              
              {/* CTA Button */}
              <div className="flex flex-col items-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                {/* Down Arrow */}
                <div className="animate-bounce">
                  <DownArrowIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-300" />
                </div>
                
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-base sm:text-lg font-bold text-white hover:text-gray-200 transition-colors px-4 py-2"
                >
                  SEE THE DETAIL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {isOpen && (
        <div className="bg-black text-white" style={{ minHeight: '100vh', overflowY: 'auto', paddingBottom: '2rem' }}>
          {/* Hero Video Section - Full Width */}
          <div className="relative aspect-video w-full overflow-hidden">
            {hasYoutubeVideo && isValidYouTubeLink(youtubeLink) ? (
              <div className="relative w-full h-full">
                <ReactPlayer
                  url={youtubeLink}
                  width="100%"
                  height="100%"
                  controls={false}
                  muted={isVideoMuted}
                  playing={isVideoPlaying}
                  loop={true}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
                
                {/* Custom Video Controls */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors"
                  >
                    {isVideoPlaying ? (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                  
                  {/* Mute/Unmute Button */}
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors"
                  >
                    {isVideoMuted ? (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
          </div>

          {/* Content Details - Scrollable */}
          <div className="p-4 space-y-6" style={{ paddingBottom: '1rem' }}>
            {/* Netflix Style Header */}
            <div className="flex items-start gap-2">
              <NetflixIcon className="w-4 h-3 text-red-600 mt-1" />
              <NetflixText variant="caption" color="gray">
                DOCUMENTER
              </NetflixText>
            </div>

            {/* Title */}
            <NetflixHeader size="xl" className="text-3xl leading-tight">
              {isKhitan ? (
                <>
                  <div className="text-4xl font-bold">{nickname1}:</div>
                  <div className="text-3xl font-semibold">Khitanan</div>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold">{nickname}:</div>
                  <div className="text-3xl font-semibold">
                    {isWedding ? 'Menuju Hari Bahagia' : 'Celebration'}
                  </div>
                </>
              )}
            </NetflixHeader>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <NetflixText variant="meta" color="green">100% match</NetflixText>
              <NetflixBadge>SU</NetflixBadge>
              <NetflixText variant="meta">{eventDate ? eventDate.getFullYear() : '-'}</NetflixText>
              <NetflixText variant="meta">
                {firstEvent && firstEvent.time ? (() => {
                  // Estimasi durasi: jika ada endTime di event, hitung selisih, jika tidak tampilkan jam saja
                  const [startHour, startMinute] = firstEvent.time.split(":").map(Number);
                  let endHour = startHour, endMinute = startMinute;
                  // Coba cari endTime di note, format "- HH:MM" atau "sampai HH:MM"
                  let found = false;
                  if (firstEvent.note) {
                    const match = firstEvent.note.match(/(?:-|sampai)\s*(\d{1,2}):(\d{2})/i);
                    if (match) {
                      endHour = parseInt(match[1], 10);
                      endMinute = parseInt(match[2], 10);
                      found = true;
                    }
                  }
                  let durasi = 0;
                  if (found) {
                    durasi = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                  }
                  if (found && durasi > 0) {
                    const jam = Math.floor(durasi / 60);
                    const menit = durasi % 60;
                    return `${jam > 0 ? jam + 'h ' : ''}${menit > 0 ? menit + 'm' : ''}`.trim();
                  } else {
                    return `${startHour}h`;
                  }
                })() : '-'}
              </NetflixText>
              <img src="/ICON4K.webp" alt="4K" className="w-4 h-4 inline" />
              <img src="/ICONHD.webp" alt="HD" className="w-4 h-4 inline" />
            </div>

            {/* Coming Soon Banner */}
            <NetflixBadge variant="primary">
              Coming soon on {formattedDate}
            </NetflixBadge>

            {/* Description */}
<NetflixSection>
  <NetflixText>
    {isKhitan ? 
      `Setelah perjalanan panjang, kami dengan bangga mengundang Anda untuk menghadiri acara khitanan ${nickname1}. Sebuah momen sakral yang menandai babak baru dalam kehidupan spiritual.` :
      `Penantian panjang itu akhirnya berujung pada waktu yang tepat. Saat kedewasaan telah menyatukan hati, ${nickname1} dan ${nickname2} kini bersiap mengawali perjalanan indah mereka menuju ${isWedding ? 'pernikahan' : 'kebahagiaan'}.`
    }
  </NetflixText>
  <NetflixText variant="caption" color="gray">
    {data.content.quote
      ? (typeof data.content.quote === 'string'
          ? data.content.quote
          : (data.content.quote.text || data.content.quote.quote || ''))
      : (isKhitan
          ? '"Dan bahwasannya kepada Tuhanmu adalah kesudahan (segala sesuatu)" (Q.S An-Najm: 42)'
          : '"Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)" (Q.S Az-Zariyah: 49)')
    }
  </NetflixText>
</NetflixSection>

            {/* Breaking News Section */}
            <NetflixSection>
              <NetflixHeader>Breaking News</NetflixHeader>
              <div className="relative aspect-video w-full overflow-hidden rounded">
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${gallery?.items?.[1] || backgroundImage})` }}
                />
              </div>
              <div className="space-y-4">
  <NetflixText variant="body" color="gray">
    {isKhitan ?
      `Dengan penuh syukur, kami mengumumkan bahwa ${nickname1} akan menjalani proses khitanan sebagai bagian dari perjalanan menuju kedewasaan. 🌟` :
      `Setelah melalui perjalanan panjang penuh cerita, kini kami tiba di babak paling berharga dalam hidup. 🌸 Seseorang yang telah mengisi hari dengan makna, kini menjadi sosok yang terpilih untuk saling mendampingi dalam ikatan janji seumur hidup.`
    }
  </NetflixText>
  <NetflixText variant="body" color="gray">
    {isKhitan ?
      `Acara ini merupakan momen sakral yang menandai kedewasaan dan komitmen keluarga dalam menjaga nilai-nilai kebaikan. 🤲` :
      'Dengan hati yang penuh rasa bahagia, kami ingin berbagi kabar indah ini — kami akan segera menyatukan langkah dalam ikatan pernikahan! 💖'
    }
  </NetflixText>
                <NetflixText variant="body" color="gray">
  Hari istimewa kami akan diselenggarakan di {firstEvent?.location || 'tempat yang telah ditentukan'}.
</NetflixText>
                <NetflixText variant="body" color="gray">
                  Kami mohon doa terbaik dari kalian yang selama ini menjadi bagian berharga dalam hidup kami, agar setiap langkah menuju hari itu, dan hari-hari setelahnya, senantiasa dipenuhi cinta, berkah, dan kebahagiaan.
                </NetflixText>
                <NetflixText variant="body" color="gray">Dengan penuh cinta,</NetflixText>
                <NetflixText>
                  {isKhitan
                    ? nickname1
                    : [nickname1, nickname2].filter(Boolean).join(' & ')
                  } &lt;3
                </NetflixText>
              </div>
            </NetflixSection>

            {/* Bride and Groom / Child Section */}
            <NetflixSection>
              <NetflixHeader>{isKhitan ? 'The Star' : 'Bride and Groom'}</NetflixHeader>
              <div className="flex gap-5">
                {children?.map((child, index) => (
                  <div key={index} className="max-w-40">
                    <div className="relative w-40 h-40 overflow-hidden rounded bride-groom-image">
                      <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${child.image || child.profile || ''})` }}
                      />
                    </div>
                    <NetflixText variant="meta" color="white">
                      {child.name}
                    </NetflixText>
                    <NetflixText variant="caption" color="gray">
                      {isKhitan ? 
                        `Putra dari keluarga yang penuh berkah` :
                        (() => {
                          // Groom = index 0, Bride = index 1
                          const isGroom = index === 0;
                          const parents = isGroom ? content.parents?.groom : content.parents?.bride;
                          if (parents && parents.father && parents.mother) {
                            return `${isGroom ? 'Putra' : 'Putri'} dari ${parents.father} & ${parents.mother}`;
                          }
                          return `${isGroom ? 'Putra' : 'Putri'} dari Bapak & Ibu`;
                        })()
                      }
                    </NetflixText>
                  </div>
                ))}
              </div>
            </NetflixSection>

            {/* Event Timeline */}
            {apiEvents && Object.keys(apiEvents).length > 0 && (
              <NetflixSection>
                <NetflixHeader>Timeline & Location</NetflixHeader>
                <div className="space-y-4">
                  {Object.entries(apiEvents).map(([key, evt], idx) => {
                    // Support both mapsLink (theme 1) and location_url (theme 3)
                    const mapsUrl = evt.mapsLink || evt.location_url || '';
                    const hasMaps = typeof mapsUrl === 'string' && mapsUrl.trim() !== '';
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="relative w-16 h-16 flex items-center justify-center overflow-hidden rounded bg-gray-800">
                          <img src="/icon-maps.png" alt="Maps" className="w-10 h-10 object-contain" onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<span style=\'color:white;font-size:2rem\'>📍</span>'; }} />
                        </div>
                        <div className="flex-1">
                          <NetflixText variant="meta" color="white">
                            {isKhitan ? 'Khitanan' : evt.title || (idx === 0 ? 'Akad Nikah' : 'Resepsi')}
                          </NetflixText>
                          <NetflixText variant="caption" color="gray">
                            {(() => {
                              // Format date to Indo style
                              try {
                                const date = new Date(evt.date);
                                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                                return date.toLocaleDateString('id-ID', options) + ' ' + evt.time;
                              } catch {
                                return evt.date + ' ' + evt.time;
                              }
                            })()}
                          </NetflixText>
                          <NetflixText variant="caption" color="gray">
                            {evt.location}
                          </NetflixText>
                          {hasMaps && (
                            <div className="mt-1">
                              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Lihat Maps</a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </NetflixSection>
            )}

            {/* Our Story Section */}
            {Array.isArray(content.our_story) && content.our_story.length > 0 && (
              <NetflixSection>
                <NetflixHeader>Our Love Story</NetflixHeader>
                <div className="space-y-8">
                  {content.our_story.map((story, idx) => {
                    const hasImage = story.pictures && story.pictures[0] && story.pictures[0].trim() !== '';
                    return (
                      <div key={idx} className="flex flex-col gap-3">
                        {/* Header: Image + Title */}
                        <div className="flex flex-row items-start gap-4">
                          <div className="relative w-32 h-20 flex items-center justify-center overflow-hidden rounded bg-gray-800">
                            {hasImage ? (
                              <img src={story.pictures[0]} alt={story.title || `Episode ${idx+1}`} className="object-cover w-full h-full" onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<span style=\'color:white;font-size:2rem\'>📖</span>'; }} />
                            ) : (
                              <span style={{color: 'white', fontSize: '2rem'}}>📖</span>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-start">
                            <div className="font-bold text-base md:text-lg text-white mb-1">Episode {idx+1}: {story.title}</div>
                            {story.date && (
                              <div className="text-xs text-gray-400 mb-1">{story.date}</div>
                            )}
                            <div className="flex items-center gap-1">
                              <img src="/ICON4K.webp" alt="4K" className="w-4 h-4 inline" />
                              <img src="/ICONHD.webp" alt="HD" className="w-4 h-4 inline" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content: Full width description */}
                        <div className="text-sm text-gray-200 whitespace-pre-line leading-relaxed">{story.description}</div>
                      </div>
                    );
                  })}
                </div>
              </NetflixSection>
            )}

            {/* Gallery Section */}
            {Array.isArray(gallery?.items) && gallery.items.length > 0 && (
              <NetflixSection>
                <NetflixHeader>Our Gallery</NetflixHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }, (_, idx) => {
                    const imgSrc = gallery.items[idx % gallery.items.length] || gallery.items[0];
                    const hasImage = imgSrc && imgSrc.trim() !== '';
                    const gradientColors = [
                      'from-purple-900/90 via-purple-600/60 to-transparent',
                      'from-pink-900/90 via-pink-600/60 to-transparent', 
                      'from-yellow-900/90 via-yellow-600/60 to-transparent',
                      'from-green-900/90 via-green-600/60 to-transparent',
                      'from-indigo-900/90 via-indigo-600/60 to-transparent',
                      'from-rose-900/90 via-rose-600/60 to-transparent'
                    ];
                    return (
                      <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 cursor-pointer" onClick={() => hasImage && setSelectedImage(imgSrc)}>
                        {hasImage ? (
                          <img src={imgSrc} alt={`Gallery ${idx + 1}`} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <span className="text-4xl">📷</span>
                          </div>
                        )}
                        
                        {/* Gradient shadow overlay - bottom to top */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${gradientColors[idx]}`} />
                        
                        {/* Top number badge */}
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {idx + 1}
                        </div>
                        
                        {/* Top right favorite badges */}
                        {(idx === 1 || idx === 4) && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] px-1 py-0.5 rounded max-w-[60px]">
                            {idx === 1 && 'Our Favorite'} 
                            {idx === 4 && "Groom's Fav"}
                          </div>
                        )}
                        
                        {/* Bottom overlay with title */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <div className="text-white text-xs font-semibold">
                            {idx === 0 && 'Perfect Date'} 
                            {idx === 1 && 'Nanti Kita Cerita Tentang Hari Ini'} 
                            {idx === 2 && 'Jatuh Cinta Seperti Di Film-Film'} 
                            {idx === 3 && 'Tune Infor Love'} 
                            {idx === 4 && 'Teman Tapi Menikah'} 
                            {idx === 5 && 'Architecture of Love'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </NetflixSection>
            )}

            {/* Gift for Couple Section */}
            {bankTransfer?.enabled && Array.isArray(bankTransfer?.accounts) && bankTransfer.accounts.some(acc => 
              acc.bank_name?.trim() && acc.account_name?.trim() && acc.account_number?.trim()
            ) && (
              <NetflixSection>
                {/* Free Mode Overlay */}
                {data.status === "tidak" && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="text-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-xl max-w-xs mx-4">
                      <FiLock className="mx-auto mb-3 text-4xl text-red-500" />
                      <NetflixHeader size="sm" className="mb-2 text-white">
                        Mode Gratis
                      </NetflixHeader>
                      <NetflixText variant="caption" color="gray">
                        Fitur tidak tersedia.<br />Silahkan klik tombol aktifkan sekarang di header untuk menggunakan fitur ini.
                      </NetflixText>
                    </div>
                  </div>
                )}
                
                <NetflixHeader size="lg" className="mb-4 text-center">
                  Gift for the couple
                </NetflixHeader>
                
                <NetflixText variant="body" color="gray" className="text-center mb-6">
                  Bagi tamu undangan yang ingin memberikan tanda kasih untuk calon pengantin, dapat diberikan melalui:
                </NetflixText>

                <Button
                  onClick={() => setShowGiftForm(prev => !prev)}
                  className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] mb-4 bg-red-600 hover:bg-red-700 text-white"
                  disabled={data.status === "tidak"}
                >
                  {showGiftForm ? 'Hide Account Details' : 'Show Account Details'}
                </Button>

                {showGiftForm && (
                  <div className="space-y-6">
                    {/* Bank Account Selection */}
                    {bankTransfer.accounts.filter(acc => 
                      acc.bank_name?.trim() && acc.account_name?.trim() && acc.account_number?.trim()
                    ).length > 1 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto">
                        {bankTransfer.accounts.filter(acc => 
                          acc.bank_name?.trim() && acc.account_name?.trim() && acc.account_number?.trim()
                        ).map((acc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`px-4 py-2 rounded-lg border whitespace-nowrap ${
                              selectedAccountIdx === idx 
                                ? 'bg-red-600 border-red-500 text-white' 
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                            onClick={() => setSelectedAccountIdx(idx)}
                            disabled={data.status === "tidak"}
                          >
                            {acc.bank_name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Bank Account Details */}
                    {(() => {
                      const validAccounts = bankTransfer.accounts.filter(acc => 
                        acc.bank_name?.trim() && acc.account_name?.trim() && acc.account_number?.trim()
                      );
                      const selectedAccount = validAccounts[selectedAccountIdx];
                      
                      return selectedAccount && (
                        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 relative overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-cover bg-center opacity-30"
                              style={{ backgroundImage: `url(${gallery?.items?.[0] || backgroundImage})` }}
                            />
                            <div className="absolute inset-0 bg-black/50" />
                            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
                              <NetflixText className="text-3xl font-bold mb-2">
                                {nickname1} & {nickname2}
                              </NetflixText>
                              <NetflixText variant="caption" color="gray">
                                {formattedDate}
                              </NetflixText>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-center">
                              <NetflixText className="font-semibold text-lg text-white">
                                {selectedAccount.bank_name}
                              </NetflixText>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gray-800 border border-gray-600 rounded-lg p-3">
                              <div className="flex-1">
                                <NetflixText variant="caption" color="gray" className="text-xs mb-1">
                                  Account Number
                                </NetflixText>
                                <NetflixText className="font-mono text-lg text-white">
                                  {selectedAccount.account_number}
                                </NetflixText>
                              </div>
                              <button
                                onClick={() => handleCopyAccountNumber(selectedAccount.account_number)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                disabled={data.status === "tidak"}
                              >
                                <FiCopy className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            
                            <div className="text-center">
                              <NetflixText variant="caption" color="gray" className="text-xs">
                                Account Holder
                              </NetflixText>
                              <NetflixText className="font-semibold text-white">
                                {selectedAccount.account_name}
                              </NetflixText>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Gift Amount Form */}
                    <form onSubmit={handleGiftSubmit} className="space-y-4">
                      {errorGift && (
                        <div className="p-3 rounded-lg bg-red-900/50 flex items-center gap-2 text-red-300 border border-red-500">
                          <FaComment className="flex-shrink-0" />
                          <span>{errorGift}</span>
                        </div>
                      )}

                      {successGift && (
                        <div className="p-3 rounded-lg bg-green-900/50 flex items-center gap-2 text-green-300 border border-green-500">
                          <FaComment className="flex-shrink-0" />
                          <span>Terima kasih! Konfirmasi transfer telah terkirim.</span>
                        </div>
                      )}

                      <div className="relative">
                        <FaUser className="absolute top-3 left-3 text-gray-400" />
                        <input
                          type="text"
                          value={namaGift}
                          onChange={(e) => setNamaGift(e.target.value)}
                          placeholder="Nama Pengirim"
                          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          disabled={data.status === "tidak"}
                        />
                      </div>

                      <div className="relative">
                        <span className="absolute top-3 left-3 text-gray-400 text-sm">IDR</span>
                        <input
                          type="text"
                          value={formattedJumlahGift}
                          onChange={handleJumlahGiftChange}
                          placeholder="Jumlah Transfer"
                          className="w-full pl-12 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          disabled={data.status === "tidak"}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loadingGift || data.status === "tidak"}
                        className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] bg-red-600 hover:bg-red-700 text-white"
                        style={{
                          opacity: loadingGift || data.status === "tidak" ? 0.7 : 1
                        }}
                      >
                        <FaPaperPlane className="mr-2" />
                        {data.status === "tidak" ? "Free Mode - Not Available" : loadingGift ? "Sending..." : "Send Confirmation"}
                      </Button>
                    </form>
                  </div>
                )}
              </NetflixSection>
            )}

            {/* Comments/RSVP Section */}
            <NetflixSection>
              {/* Free Mode Overlay */}
              {data.status === "tidak" && (
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-xl max-w-xs mx-4">
                    <FiLock className="mx-auto mb-3 text-4xl text-red-500" />
                    <NetflixHeader size="sm" className="mb-2 text-white">
                      Mode Gratis
                    </NetflixHeader>
                    <NetflixText variant="caption" color="gray">
                      Fitur tidak tersedia.<br />Silahkan klik tombol aktifkan sekarang di header untuk menggunakan fitur ini.
                    </NetflixText>
                  </div>
                </div>
              )}
              
              <NetflixHeader size="lg" className="mb-6 text-center flex items-center justify-center gap-2">
                <FaComment className="inline-block" />
                Wish for the couple
              </NetflixHeader>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-900/50 flex items-center gap-2 text-red-300 border border-red-500">
                    <FaComment className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-green-900/50 flex items-center gap-2 text-green-300 border border-green-500">
                    <FaComment className="flex-shrink-0" />
                    <span>Terima kasih! Ucapan Anda telah terkirim.</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Name"
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      disabled={data.status === "tidak"}
                    />
                  </div>

                  <div className="relative">
                    <FaWhatsapp className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="tel"
                      value={wa}
                      onKeyPress={handleKeyPressWa}
                      onChange={(e) => setWa(e.target.value)}
                      placeholder="WhatsApp"
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      disabled={data.status === "tidak"}
                    />
                  </div>
                </div>

                <div className="relative">
                  <FaComment className="absolute top-3 left-3 text-gray-400" />
                  <textarea
                    value={ucapan}
                    onChange={(e) => setUcapan(e.target.value)}
                    placeholder="Message"
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                    disabled={data.status === "tidak"}
                  />
                </div>

                <div className="relative">
                  <FaCalendarCheck className="absolute top-3 left-3 text-gray-400" />
                  <select
                    value={konfirmasi}
                    onChange={(e) => setKonfirmasi(e.target.value as any)}
                    className="w-full pl-10 pr-8 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none"
                    disabled={data.status === "tidak"}
                  >
                    <option value="" className="text-gray-400">Attendance Confirmation</option>
                    <option value="hadir">Will Attend</option>
                    <option value="tidak hadir">Cannot Attend</option>
                  </select>
                  <FiChevronDown className="absolute top-3 right-3 pointer-events-none text-gray-400" />
                </div>

                <Button
                  type="submit"
                  disabled={loading || data.status === "tidak"}
                  className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] bg-red-600 hover:bg-red-700 text-white"
                  style={{
                    opacity: loading || data.status === "tidak" ? 0.7 : 1
                  }}
                >
                  <FaPaperPlane className="mr-2" />
                  {data.status === "tidak" ? "Free Mode - Not Available" : loading ? "Sending..." : "Send"}
                </Button>
              </form>

              <Button
                onClick={() => setShowComments(prev => !prev)}
                className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] mb-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              >
                {showComments ? 'Hide Comments' : `Show Comments (${rsvpList.length})`}
              </Button>

              {/* Comments Section */}
              {showComments && (
                <div className="rounded-xl shadow-md space-y-4 max-h-96 overflow-y-auto bg-gray-900 border border-gray-600">
                  {loadingRsvp ? (
                    <div className="text-center py-4 text-gray-400">Loading comments...</div>
                  ) : errorRsvp ? (
                    <div className="text-red-400 text-center py-4">{errorRsvp}</div>
                  ) : rsvpList.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {rsvpList.slice(0, visibleComments).map((rsvp, index) => {
                        // Generate random colors for avatar background
                        const colors = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed', '#a21caf', '#be185d'];
                        const bgColor = colors[index % colors.length];
                        
                        return (
                          <div key={index} className="flex gap-3 items-start">
                            {/* Avatar with FACE.webp */}
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                              style={{ backgroundColor: bgColor }}
                            >
                              <img 
                                src="/FACE.webp" 
                                alt="Face" 
                                className="w-6 h-6 object-contain"
                              />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-semibold text-sm block truncate max-w-[180px] text-left text-white" title={rsvp.nama}>
                                    {rsvp.nama}
                                  </span>
                                  <span className="text-xs text-gray-400 mb-1 block text-left">
                                    {timeAgo(rsvp.created_at)}
                                  </span>
                                </div>
                                <div className="text-lg flex-shrink-0">
                                  {rsvp.konfirmasi === 'hadir' ? '✅' : '❌'}
                                </div>
                              </div>
                              <p className="text-sm mt-1 break-words text-left text-gray-300">
                                {rsvp.ucapan}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      
                      {visibleComments < rsvpList.length && (
                        <div className="text-center pt-4">
                          <Button
                            onClick={loadMoreComments}
                            className="px-6 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-white"
                          >
                            Load More
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">No comments yet</div>
                  )}
                </div>
              )}
            </NetflixSection>

            {/* Footer */}
            <NetflixSection className="text-center py-8">
              <NetflixText>Thank you for checking up all the things up there!</NetflixText>
              <NetflixText>Can't wait to see u again! &lt;3</NetflixText>
              <NetflixText variant="caption" color="gray">
                E-Invitation Powered By <a href="https://papunda.com/" target="_blank" className="font-bold">papunda.com</a>
              </NetflixText>
            </NetflixSection>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setSelectedImage(null)}>
            &times;
          </button>
          <img src={selectedImage} alt="Gallery" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </NetflixContainer>
  );
}

// Add CSS animations
const styleSheet = `
  @keyframes fadeInSlide {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// Inject styles on component mount
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styleSheet;
  if (!document.head.querySelector('style[data-netflix-popup]')) {
    style.setAttribute('data-netflix-popup', 'true');
    document.head.appendChild(style);
  }
}