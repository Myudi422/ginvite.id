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
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
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
              <NetflixText variant="meta">2025</NetflixText>
              <NetflixText variant="meta">9h 11m</NetflixText>
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
                  `Setelah ${isWedding ? '10 Tahun' : 'perjalanan panjang'} ${nickname1} dan ${nickname2} dipertemukan dalam situasi yang tepat, di mana keduanya telah siap untuk memulai hubungan bersama, tibalah mereka di awal perjalanan baru menuju ${isWedding ? 'pernikahan' : 'kebahagiaan'}.`
                }
              </NetflixText>
              <NetflixText variant="caption" color="gray">
                {isKhitan ? 
                  '"Dan bahwasannya kepada Tuhanmu adalah kesudahan (segala sesuatu)" (Q.S An-Najm: 42)' :
                  '"Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah)" (Q.S Az-Zariyah: 49)'
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
                    `Dengan penuh syukur kepada Allah SWT, kami mengumumkan bahwa ${nickname1} akan menjalani proses khitanan sebagai bagian dari perjalanan spiritual dalam agama Islam. 🌟` :
                    `Setelah perjalanan panjang penuh cerita, tawa, dan doa, akhirnya kami sampai pada babak baru dalam kisah kami. 🌸 Seseorang yang dulu hanya sebatas teman kini menjadi takdir yang Allah pilih untuk mendampingi seumur hidup.`
                  }
                </NetflixText>
                <NetflixText variant="body" color="gray">
                  {isKhitan ?
                    `Acara khitanan ini merupakan momen sakral yang menandai kedewasaan dan komitmen spiritual ${nickname1} dalam menjalankan ajaran agama Islam. 🤲` :
                    'Dengan hati yang bergetar bahagia, kami ingin berbagi kabar indah ini — kami akan segera menikah! 💖'
                  }
                </NetflixText>
                <NetflixText variant="body" color="gray">
                  InsyaAllah, hari istimewa kami akan diselenggarakan di {firstEvent?.location || 'tempat yang telah ditentukan'}.
                </NetflixText>
                <NetflixText variant="body" color="gray">
                  Kami mohon doa terbaik dari kalian yang selama ini menjadi bagian berharga dalam hidup kami, agar setiap langkah menuju hari itu, dan hari-hari setelahnya, senantiasa dipenuhi cinta, berkah, dan kebahagiaan.
                </NetflixText>
                <NetflixText variant="body" color="gray">Dengan penuh cinta,</NetflixText>
                <NetflixText>
                  {isKhitan ? 'Keluarga besar' : 'The bride and groom'} &lt;3
                </NetflixText>
              </div>
            </NetflixSection>

            {/* Bride and Groom / Child Section */}
            <NetflixSection>
              <NetflixHeader>{isKhitan ? 'The Star' : 'Bride and Groom'}</NetflixHeader>
              <div className="flex gap-5">
                {children?.map((child, index) => (
                  <div key={index} className="max-w-40">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded bride-groom-image">
                      <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${gallery?.items?.[index + 2] || backgroundImage})` }}
                      />
                    </div>
                    <NetflixText variant="meta" color="white">
                      {child.name}
                    </NetflixText>
                    <NetflixText variant="caption" color="gray">
                      {isKhitan ? 
                        `Putra dari keluarga yang penuh berkah` :
                        `${index === 0 ? 'Putri' : 'Putra'} dari Bapak & Ibu`
                      }
                    </NetflixText>
                  </div>
                ))}
              </div>
            </NetflixSection>

            {/* Event Timeline */}
            {firstEvent && (
              <NetflixSection>
                <NetflixHeader>Timeline</NetflixHeader>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 overflow-hidden rounded">
                    <div 
                      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${gallery?.items?.[3] || backgroundImage})` }}
                    />
                  </div>
                  <div className="flex-1">
                    <NetflixText variant="meta" color="white">
                      {isKhitan ? 'Khitanan' : firstEvent.title || 'Akad Nikah'}
                    </NetflixText>
                    <NetflixText variant="caption" color="gray">
                      {firstEvent.date} • {firstEvent.time}
                    </NetflixText>
                    <NetflixText variant="caption" color="gray">
                      {firstEvent.location}
                    </NetflixText>
                  </div>
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