'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaUser, FaWhatsapp, FaComment, FaCalendarCheck, FaPaperPlane } from 'react-icons/fa';
import { FiChevronDown, FiLock } from 'react-icons/fi';

// ── Types ─────────────────────────────────────────────────────────────────────
interface RsvpData {
  nama: string;
  wa: string;
  ucapan: string;
  konfirmasi: 'hadir' | 'tidak hadir';
  created_at: string;
}

interface P {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
  pageStatus?: number;
}

// ── API Constants ─────────────────────────────────────────────────────────────
const RSVP_SUBMIT_URL = 'https://dev.legalpilar.id/v2/android/ginvite/index.php?action=rsmp';
const RSVP_GET_URL    = 'https://dev.legalpilar.id/v2/android/ginvite/index.php?action=get_rsmp';

// ── Time helper ───────────────────────────────────────────────────────────────
const timeAgo = (dateString: string): string => {
  const local = new Date(new Date(dateString).getTime() + 7 * 3600000);
  const diff  = Date.now() - local.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (Math.floor(d / 30) > 0) return `${Math.floor(d / 30)} bulan yang lalu`;
  if (Math.floor(d / 7) > 0)  return `${Math.floor(d / 7)} minggu yang lalu`;
  if (d > 0) return `${d} hari yang lalu`;
  if (h > 0) return `${h} jam yang lalu`;
  return `${m} menit yang lalu`;
};

// ── Overlay helper (hex + opacity%) → hex8 ───────────────────────────────────
function hexWithOpacity(hex: string, pct: number): string {
  let c = hex.trim();
  if (!c.startsWith('#')) c = '#' + c;
  if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  c = c.slice(0, 7);
  return `${c}${Math.round((pct / 100) * 255).toString(16).padStart(2, '0')}`;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RsvpPreview({ props, style, pageStatus }: P) {
  // ── Resolve IDs ──────────────────────────────────────────────────────────
  const contentId     = (style._page_id as number) || 0;
  const isPreviewMode = contentId === 0;   // builder canvas: no live API

  // ── Section props ─────────────────────────────────────────────────────────
  const enabled         = (props.enabled as boolean) ?? true;
  const deadline        = (props.deadline as string) || '';
  const sectionTitle    = (props.title as string) || 'Ucapan & Konfirmasi';
  const initialComments = (props.initial_comments as number) ?? 5;
  const layoutTemplate  = (props.layout_template as string) || 'classic';
  const animationPreset = (props.animation_preset as string) || 'none';

  // ── Style tokens ──────────────────────────────────────────────────────────
  const accent    = (style.accent_color as string) || '#e879a0';
  const textColor = (style.text_color as string)   || '#333333';
  const bgColor   = (style.bg_color as string)     || '#ffffff';
  const fontBody  = (style.font_body as string)    || 'inherit';
  const fontHead  = (style.font_heading as string) || fontBody;

  // ── Background props ──────────────────────────────────────────────────────
  const bgType            = (props.bg_type as string)                     || 'solid';
  const bgSolidColor      = (props.bg_color as string)                    || bgColor;
  const bgColor2          = (props.bg_color2 as string)                   || '#feb47b';
  const bgGradAngle       = Number(props.bg_gradient_angle ?? 135);
  const bgImage           = (props.bg_image as string)                    || '';
  const bgBlur            = Number(props.bg_image_blur ?? 0);
  const bgGray            = Boolean(props.bg_image_grayscale);
  const slideshowImages   = (props.bg_slideshow_images as string[])       || [];
  const slideshowAnim     = (props.bg_slideshow_animation as string)      || 'fade';
  const slideshowDuration = Number(props.bg_slideshow_duration ?? 5);

  const overlayType   = (props.overlay_type as string)   || 'solid';
  const overlayColor  = (props.overlay_color as string)  || '#000000';
  const overlayColor2 = (props.overlay_color2 as string) || '#000000';
  const overlayOp     = Number(props.overlay_opacity  ?? 50);
  const overlayOp2    = Number(props.overlay_opacity2 ?? 0);
  const overlayAngle  = Number(props.overlay_gradient_angle ?? 180);

  const isCustomBg   = bgType !== 'solid';
  const parentBgClr  = bgType === 'solid' ? (bgSolidColor || bgColor) : undefined;
  const validSlides  = slideshowImages.filter(Boolean);

  // ── Slideshow state ───────────────────────────────────────────────────────
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (bgType !== 'slideshow' || validSlides.length <= 1) return;
    const t = setInterval(() => setActiveSlide(p => (p + 1) % validSlides.length), slideshowDuration * 1000);
    return () => clearInterval(t);
  }, [bgType, validSlides.length, slideshowDuration]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [nama, setNama]             = useState('');
  const [wa, setWa]                 = useState('');
  const [ucapan, setUcapan]         = useState('');
  const [konfirmasi, setKonfirmasi] = useState<'hadir' | 'tidak hadir' | ''>('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  // ── Comments state ────────────────────────────────────────────────────────
  const [rsvpList, setRsvpList]         = useState<RsvpData[]>([]);
  const [loadingList, setLoadingList]   = useState(false);
  const [errorList, setErrorList]       = useState<string | null>(null);
  const [visible, setVisible]           = useState(initialComments);
  const [showComments, setShowComments] = useState(false);

  // Deadline check
  const isDeadlinePassed = deadline ? new Date() > new Date(deadline + 'T23:59:59') : false;

  // ── Fetch comments ────────────────────────────────────────────────────────
  const fetchList = useCallback(async () => {
    if (!contentId) return;
    setLoadingList(true);
    setErrorList(null);
    try {
      const res  = await fetch(`${RSVP_GET_URL}&content_id=${contentId}&invitation_type=builder`, { cache: 'no-store' });
      const json = await res.json();
      if (json.status === 'success') {
        setRsvpList(json.data ?? []);
      } else {
        setErrorList(json.message || 'Gagal memuat ucapan.');
      }
    } catch {
      setErrorList('Gagal terhubung ke server.');
    } finally {
      setLoadingList(false);
    }
  }, [contentId]);

  useEffect(() => {
    if (!isPreviewMode && contentId) fetchList();
  }, [contentId, isPreviewMode, fetchList]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !wa.trim() || !ucapan.trim() || !konfirmasi) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (wa.trim().length < 10) {
      setError('Nomor WhatsApp tidak valid (min. 10 digit).');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(RSVP_SUBMIT_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId, invitation_type: 'builder', nama: nama.trim(), wa: wa.trim(), ucapan: ucapan.trim(), konfirmasi }),
      });
      const json = await res.json();
      if (json.status === 'success' || json.status === 'partial_success') {
        setSuccess(true);
        setNama(''); setWa(''); setUcapan(''); setKonfirmasi('');
        setShowComments(true);
        await fetchList();
      } else {
        setError(json.message || 'Gagal mengirim ucapan.');
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const ProfileInitial = ({ name }: { name: string }) => (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold flex-shrink-0 text-base"
      style={{ backgroundColor: accent, color: bgColor }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );

  const filterStr = [bgBlur > 0 ? `blur(${bgBlur}px)` : '', bgGray ? 'grayscale(100%)' : ''].filter(Boolean).join(' ') || undefined;

  // ── Unified Mockup comments for preview mode ──────────────────────────────
  const mockComments: RsvpData[] = [
    { nama: 'Budi Santoso', wa: '08123456789', ucapan: 'Selamat menempuh hidup baru! Semoga sakinah mawaddah warahmah.', konfirmasi: 'hadir', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { nama: 'Siti Rahma', wa: '08123456780', ucapan: 'Selamat ya! Maaf belum bisa hadir karena ada tugas ke luar kota.', konfirmasi: 'tidak hadir', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { nama: 'Dedi Kurniawan', wa: '08123456781', ucapan: 'Happy wedding! Lancar-lancar acaranya sampai hari H.', konfirmasi: 'hadir', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
  ];

  const displayList = isPreviewMode ? mockComments : rsvpList;
  const displayLoadingList = isPreviewMode ? false : loadingList;
  const displayErrorList = isPreviewMode ? null : errorList;

  // ── Styles / Layouts constants ───────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    borderColor: accent + '55',
    color: textColor,
    background: bgColor + 'cc',
    fontFamily: fontBody,
  };

  const isMinimal = layoutTemplate === 'minimal';
  const resolvedInputStyle: React.CSSProperties = isMinimal
    ? {
        borderBottom: `2px solid ${accent}55`,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        color: textColor,
        background: 'transparent',
        fontFamily: fontBody,
        borderRadius: 0,
      }
    : inputStyle;

  const getAnimClass = (delayIndex: number) => {
    if (animationPreset === 'none') return '';
    return `animate-item animate-${animationPreset} delay-${delayIndex}`;
  };

  // ── STYLE BLOCK INJECTION ──
  const styleBlock = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes rsvpKenburns {
        0% { transform: scale(1.05); }
        100% { transform: scale(1.15); }
      }
      @keyframes animFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes animFadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes animFadeDown {
        from { opacity: 0; transform: translateY(-28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes animZoomIn {
        from { opacity: 0; transform: scale(0.93); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes animTrackingWide {
        from { opacity: 0; letter-spacing: -0.2em; filter: blur(4px); }
        to { opacity: 1; }
      }
      @keyframes animSlideLeft {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes animSlideRight {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes animBlurReveal {
        from { opacity: 0; filter: blur(14px); transform: scale(0.95); }
        to { opacity: 1; filter: blur(0); transform: scale(1); }
      }
      @keyframes animBounceSoft {
        0% { opacity: 0; transform: scale(0.5); }
        60% { opacity: 0.95; transform: scale(1.04); }
        100% { opacity: 1; transform: scale(1); }
      }

      .animate-item {
        opacity: 0;
        animation-fill-mode: forwards !important;
      }
      .animate-fade_in { animation: animFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade_up { animation: animFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-fade_down { animation: animFadeDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-zoom_in { animation: animZoomIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      .animate-tracking_wide { animation: animTrackingWide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-slide_left { animation: animSlideLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-slide_right { animation: animSlideRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-blur_reveal { animation: animBlurReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .animate-bounce_soft { animation: animBounceSoft 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

      .delay-1 { animation-delay: 150ms; }
      .delay-2 { animation-delay: 350ms; }
      .delay-3 { animation-delay: 550ms; }
    `}} />
  );

  // ── Layout Render Blocks ─────────────────────────────────────────────────
  const renderTitle = () => (
    <h2 className={`text-3xl sm:text-4xl font-extrabold text-center flex items-center justify-center gap-2.5 ${getAnimClass(1)}`}
      style={{ color: textColor, fontFamily: fontHead }}>
      <FaComment className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: accent }} />
      {sectionTitle}
    </h2>
  );

  const renderForm = () => {
    if (!enabled) return null;

    const isFormDisabled = isPreviewMode || loading || isDeadlinePassed;

    return (
      <form onSubmit={isPreviewMode ? e => e.preventDefault() : handleSubmit} className={`space-y-4.5 ${getAnimClass(2)}`}>
        {!isPreviewMode && error && (
          <div className="p-3.5 rounded-2xl bg-red-100/90 flex items-start gap-2.5 text-red-800 text-sm">
            <FaComment className="flex-shrink-0 mt-1 text-sm sm:text-base" />
            <span>{error}</span>
          </div>
        )}
        {!isPreviewMode && success && (
          <div className="p-3.5 rounded-2xl bg-green-100/90 flex items-start gap-2.5 text-green-800 text-sm">
            <FaComment className="flex-shrink-0 mt-1 text-sm sm:text-base" />
            <span>Terima kasih! Ucapan Anda telah terkirim. 🎉</span>
          </div>
        )}

        {/* Nama + WA */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaUser className="absolute top-4.5 left-4 text-sm sm:text-base opacity-60" style={{ color: accent }} />
            <input
              id="rsvp-nama"
              type="text"
              disabled={isFormDisabled}
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Nama Lengkap"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl focus:outline-none bg-transparent transition-all text-sm sm:text-base ${
                isMinimal ? 'border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-b-accent' : ''
              }`}
              style={resolvedInputStyle}
            />
          </div>
          <div className="flex-1 relative">
            <FaWhatsapp className="absolute top-4.5 left-4 text-sm sm:text-base opacity-60" style={{ color: accent }} />
            <input
              id="rsvp-wa"
              type="tel"
              disabled={isFormDisabled}
              onKeyPress={e => { if (e.which < 48 || e.which > 57) e.preventDefault(); }}
              value={wa}
              onChange={e => setWa(e.target.value)}
              placeholder="Nomor WhatsApp"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl focus:outline-none bg-transparent transition-all text-sm sm:text-base ${
                isMinimal ? 'border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-b-accent' : ''
              }`}
              style={resolvedInputStyle}
            />
          </div>
        </div>

        {/* Ucapan */}
        <div className="relative">
          <FaComment className="absolute top-4.5 left-4 text-sm sm:text-base opacity-60" style={{ color: accent }} />
          <textarea
            id="rsvp-ucapan"
            disabled={isFormDisabled}
            value={ucapan}
            onChange={e => setUcapan(e.target.value)}
            placeholder="Tulis ucapan dan doa..."
            rows={3}
            className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl focus:outline-none bg-transparent resize-none transition-all text-sm sm:text-base ${
              isMinimal ? 'border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-b-accent' : ''
            }`}
            style={resolvedInputStyle}
          />
        </div>

        {/* Konfirmasi */}
        <div className="relative">
          <FaCalendarCheck className="absolute top-4.5 left-4 text-sm sm:text-base opacity-60" style={{ color: accent }} />
          <select
            id="rsvp-konfirmasi"
            disabled={isFormDisabled}
            value={konfirmasi}
            onChange={e => setKonfirmasi(e.target.value as any)}
            className={`w-full pl-12 pr-10 py-3.5 border rounded-2xl appearance-none focus:outline-none bg-transparent transition-all text-sm sm:text-base ${
              isMinimal ? 'border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0' : ''
            }`}
            style={resolvedInputStyle}
          >
            <option value="" style={{ color: '#000' }}>-- Konfirmasi Kehadiran --</option>
            <option value="hadir" style={{ color: '#000' }}>✅ Hadir</option>
            <option value="tidak hadir" style={{ color: '#000' }}>❌ Tidak Hadir</option>
          </select>
          <FiChevronDown className="absolute top-4.5 right-4 pointer-events-none text-sm sm:text-base" style={{ color: accent }} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isFormDisabled}
          className="w-full py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base"
          style={isMinimal ? { border: `2px solid ${accent}`, color: accent, background: 'transparent' } : { backgroundColor: accent, color: bgColor }}
        >
          <FaPaperPlane className="text-xs sm:text-sm" />
          {loading ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>
    );
  };

  const renderComments = () => {
    return (
      <div className={`space-y-4 w-full ${getAnimClass(3)}`}>
        {/* Toggle Comments Button */}
        <button
          onClick={() => setShowComments(p => !p)}
          className="w-full py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.02] text-sm sm:text-base shadow-sm"
          style={{ border: `2px solid ${accent}`, color: accent, background: accent + '11' }}
        >
          {showComments
            ? 'Sembunyikan Ucapan'
            : `Tampilkan Ucapan (${displayList.length})`}
        </button>

        {/* Comments list */}
        {showComments && (
          <div className="rounded-3xl max-h-[30rem] overflow-y-auto transition-all duration-300 shadow-md border"
            style={{ backgroundColor: bgColor + 'cc', borderColor: accent + '30' }}>
            {displayLoadingList ? (
              <p className="text-center py-8 text-sm opacity-60" style={{ color: textColor }}>Memuat ucapan...</p>
            ) : displayErrorList ? (
              <p className="text-center py-8 text-sm text-red-500">{displayErrorList}</p>
            ) : displayList.length === 0 ? (
              <p className="text-center py-8 text-sm opacity-50" style={{ color: textColor }}>Belum ada ucapan. Jadilah yang pertama! 🎉</p>
            ) : (
              <div className="p-6 space-y-6">
                {displayList.slice(0, visible).map((item, i) => (
                  <div key={i} className="flex gap-4 items-start border-b border-gray-150/40 pb-5 last:border-0 last:pb-0">
                    <ProfileInitial name={item.nama} />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-base block truncate max-w-[220px]"
                            style={{ color: accent }} title={item.nama}>{item.nama}</span>
                          <span className="text-xs sm:text-sm opacity-60 block mt-0.5" style={{ color: textColor }}>
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                        <span className="text-xl flex-shrink-0 ml-2">
                          {item.konfirmasi === 'hadir' ? '✅' : '❌'}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base mt-2 break-words text-left font-medium opacity-90" style={{ color: textColor }}>
                        {item.ucapan}
                      </p>
                    </div>
                  </div>
                ))}

                {visible < displayList.length && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setVisible(p => p + initialComments)}
                      className="px-8 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all hover:scale-105"
                      style={{ border: `2px solid ${accent}`, color: accent }}>
                      Muat Lebih Banyak
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── Layout render selectors ──────────────────────────────────────────────
  const renderClassic = () => (
    <div className="space-y-6 w-full max-w-2xl sm:max-w-3xl mx-auto">
      {renderTitle()}
      {renderForm()}
      {renderComments()}
    </div>
  );

  const renderCard = () => (
    <div className={`w-full max-w-xl sm:max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl p-8 sm:p-12 space-y-6 ${getAnimClass(1)}`}>
      {renderTitle()}
      <div className="w-full border-t border-gray-100 dark:border-gray-800 my-1" />
      {renderForm()}
      {renderComments()}
    </div>
  );

  const renderMinimal = () => (
    <div className="space-y-6 w-full max-w-xl sm:max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest block opacity-70" style={{ color: accent }}>
          RSVP
        </span>
        {renderTitle()}
      </div>
      {renderForm()}
      <div className="w-full border-t border-gray-150/40 my-6" />
      {renderComments()}
    </div>
  );

  const renderFloating = () => (
    <div className="space-y-6 w-full max-w-xl sm:max-w-2xl mx-auto">
      <div className="text-center py-2">
        {renderTitle()}
      </div>
      {enabled && (
        <div className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/40 transform hover:-translate-y-1 transition-transform duration-300 ${getAnimClass(2)}`}>
          <div className="text-sm sm:text-base uppercase tracking-widest font-extrabold mb-4 opacity-60 text-center" style={{ color: accent }}>
            Formulir Kehadiran
          </div>
          {renderForm()}
        </div>
      )}
      <div className={`w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-md p-8 sm:p-12 border border-white/20 ${getAnimClass(3)}`}>
        {renderComments()}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (layoutTemplate) {
      case 'card':
        return renderCard();
      case 'minimal':
        return renderMinimal();
      case 'floating':
        return renderFloating();
      case 'classic':
      default:
        return renderClassic();
    }
  };

  return (
    <section className="relative mx-auto overflow-hidden transition-all duration-300 min-h-[65dvh] py-20 sm:py-28 px-6 flex flex-col justify-center" style={{ backgroundColor: parentBgClr }}>
      {/* ── STYLE BLOCK INJECTION ── */}
      {styleBlock}

      {/* ── Background layers ── */}
      {bgType === 'gradient' && (
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${bgGradAngle}deg, ${bgSolidColor}, ${bgColor2})` }} />
      )}
      {bgType === 'image' && bgImage && (
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-300" style={{ backgroundImage: `url(${bgImage})`, filter: filterStr, transform: bgBlur > 0 ? 'scale(1.05)' : undefined }} />
      )}
      {bgType === 'slideshow' && validSlides.map((s, i) => {
        const isAct  = i === activeSlide;
        const isPrev = i === (activeSlide - 1 + validSlides.length) % validSlides.length;
        let tr = 'scale(1)', op = 0, anim: string | undefined;
        if (slideshowAnim === 'fade') { op = isAct ? 1 : 0; if (bgBlur > 0) tr = 'scale(1.05)'; }
        else if (slideshowAnim === 'zoom') { op = isAct ? 1 : 0; if (isAct) anim = `rsvpKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`; if (bgBlur > 0) tr = 'scale(1.05)'; }
        else if (slideshowAnim === 'slide') { op = isAct ? 1 : 0; tr = isAct ? 'translateX(0)' : isPrev ? 'translateX(-100%)' : 'translateX(100%)'; if (bgBlur > 0) tr += ' scale(1.05)'; }
        return (
          <div key={i} className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s})`, opacity: op, transform: tr, animation: anim, filter: filterStr, transition: 'opacity 1s ease-in-out, transform 1s ease-in-out' }} />
        );
      })}

      {/* ── Overlay ── */}
      {isCustomBg && (
        overlayType === 'gradient'
          ? <div className="absolute inset-0 z-[1]" style={{ backgroundImage: `linear-gradient(${overlayAngle}deg, ${hexWithOpacity(overlayColor, overlayOp)}, ${hexWithOpacity(overlayColor2, overlayOp2)})` }} />
          : <div className="absolute inset-0 z-[1]" style={{ backgroundColor: overlayColor, opacity: overlayOp / 100 }} />
      )}

      {/* ── Deadline Lock overlay ── */}
      {!isPreviewMode && enabled && isDeadlinePassed && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center p-6 bg-white/90 rounded-2xl shadow-xl max-w-xs mx-4">
            <FiLock className="mx-auto mb-3 text-4xl" style={{ color: accent }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: accent, fontFamily: fontHead }}>Batas Konfirmasi</h3>
            <p className="text-sm text-gray-600">
              Batas konfirmasi berakhir{' '}
              {new Date(deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </p>
          </div>
        </div>
      )}

      {/* ── Payment Lock overlay (Jika belum bayar) ── */}
      {!isPreviewMode && pageStatus === 0 && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] flex items-center justify-center z-20">
          <div className="text-center p-6 bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl max-w-xs mx-4 border border-pink-100 dark:border-pink-950">
            <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/30 rounded-full flex items-center justify-center mx-auto mb-3 border border-pink-100 dark:border-pink-900">
              <FiLock className="text-xl text-pink-500 animate-pulse" />
            </div>
            <h3 className="text-base font-bold mb-1.5 text-gray-800 dark:text-gray-100" style={{ fontFamily: fontHead }}>
              Fitur RSVP Dikunci
            </h3>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed mb-0">
              Fitur RSVP & Ucapan tamu hanya aktif pada versi Premium. Silakan lakukan pembayaran untuk membuka fitur ini.
            </p>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="relative z-10 p-6 w-full flex flex-col justify-center">
        {renderLayout()}
      </div>
    </section>
  );
}
