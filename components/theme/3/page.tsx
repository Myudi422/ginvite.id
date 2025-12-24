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
        <div className="relative h-screen w-full overflow-hidden">
          {/* Background Image - Full Screen */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          
          {/* Gradient Overlay - More solid at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Top Header with Netflix Logo and Profile */}
            <div className="flex items-center justify-between p-6 pt-8">
              <div className="flex items-center gap-2">
                <NetflixIcon className="w-20 h-auto text-red-600" />
              </div>
              <ProfilePopup toName={urlParams.toName || "Bapak/Ibu/Saudara/i"} />
            </div>
            
            {/* Spacer to push content to bottom */}
            <div className="flex-1" />
            
            {/* Main Content - Bottom Left */}
            <div className="p-6 pb-12 space-y-4">
              <div className="text-left">
                {isKhitan ? (
                  <>
                    <div className="text-4xl font-bold text-white leading-tight mb-1">{nickname1}:</div>
                    <div className="text-3xl font-semibold text-white">Khitanan</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-white leading-tight mb-1">{nickname}:</div>
                    <div className="text-3xl font-semibold text-white">
                      {isWedding ? 'Menuju Hari Bahagia' : 'Celebration'}
                    </div>
                  </>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex items-center gap-3 mb-4">
                <NetflixBadge variant="primary">Coming soon</NetflixBadge>
                <NetflixText variant="meta">{formattedDate}</NetflixText>
              </div>
              
              {/* Genre Tags */}
              <div className="flex gap-2 flex-wrap mb-6">
                <NetflixBadge>{isKhitan ? '#khitanan' : '#romantic'}</NetflixBadge>
                <NetflixBadge>{isKhitan ? '#family' : '#getmarried'}</NetflixBadge>
                <NetflixBadge>#family</NetflixBadge>
                <NetflixBadge>#documenter</NetflixBadge>
              </div>
              
              {/* CTA Button */}
              <div className="flex flex-col items-center space-y-4 pt-4">
                {/* Down Arrow */}
                <div className="animate-bounce">
                  <DownArrowIcon className="w-6 h-6 text-gray-300" />
                </div>
                
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-lg font-bold text-white hover:text-gray-200 transition-colors"
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
          <div className="p-4 space-y-6" style={{ paddingBottom: '5rem' }}>
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
                            {idx === 1 && 'Keluarga Cinta'} 
                            {idx === 2 && 'Jatuh Cinta'} 
                            {idx === 3 && 'Mohon Doa Restu'} 
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

            {/* Footer */}
            <NetflixSection className="text-center py-8">
              <NetflixText>Thank you for checking up all the things up there!</NetflixText>
              <NetflixText>Can't wait to see u again! &lt;3</NetflixText>
              <NetflixText variant="caption" color="gray">
                E-Invitation Powered By <a href="https://nikahfix.com/" target="_blank" className="font-bold">Nikahfix.com</a>
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