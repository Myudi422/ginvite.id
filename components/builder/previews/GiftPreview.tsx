'use client';

import React, { useState, useEffect } from 'react';
import { FaGift, FaPaperPlane, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { submitBankTransfer } from '@/app/actions/bank';

// ── Types ─────────────────────────────────────────────────────────────────────
interface P {
  props: Record<string, unknown>;
  style: Record<string, string | number>;
}

// ── Overlay helper (hex + opacity%) → hex8 ───────────────────────────────────
function hexWithOpacity(hex: string, pct: number): string {
  let c = hex.trim();
  if (!c.startsWith('#')) c = '#' + c;
  if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  c = c.slice(0, 7);
  return `${c}${Math.round((pct / 100) * 255).toString(16).padStart(2, '0')}`;
}

export default function GiftPreview({ props, style }: P) {
  // ── Resolve IDs ──────────────────────────────────────────────────────────
  const contentId     = (style._page_id as number) || 0;
  const isPreviewMode = contentId === 0;

  // ── Section props ─────────────────────────────────────────────────────────
  const enabled         = (props.enabled as boolean) ?? false;
  const sectionTitle    = (props.title as string) || 'Hadiah / Gift';
  const layoutTemplate  = (props.layout_template as string) || 'classic';
  const animationPreset = (props.animation_preset as string) || 'none';

  const banks = (props.banks as Array<{ id: string; bank_name: string; account_name: string; account_number: string }>) || [];

  const addressEnabled   = (props.address_enabled as boolean) ?? false;
  const addressTitle     = (props.address_title as string) || 'Alamat Pengiriman';
  const addressRecipient = (props.address_recipient as string) || '';
  const addressText      = (props.address_text as string) || '';
  const addressPhone     = (props.address_phone as string) || '';

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

  // ── Active Gift Tab (Banks vs Physical Address) ───────────────────────────
  const hasBanks = banks.length > 0;
  const hasAddress = addressEnabled && addressText.trim().length > 0;
  const [activeGiftTab, setActiveGiftTab] = useState<'bank' | 'address'>(hasBanks ? 'bank' : 'address');

  // Sync tab selection if banks or address properties are toggled
  useEffect(() => {
    if (hasBanks && !hasAddress) {
      setActiveGiftTab('bank');
    } else if (!hasBanks && hasAddress) {
      setActiveGiftTab('address');
    }
  }, [hasBanks, hasAddress]);

  // ── Bank switching state ──────────────────────────────────────────────────
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);

  // Reset indices if banks array changes
  useEffect(() => {
    if (selectedAccountIdx >= banks.length) {
      setSelectedAccountIdx(0);
    }
  }, [banks, selectedAccountIdx]);

  // ── Form State ────────────────────────────────────────────────────────────
  const [nama, setNama]                     = useState('');
  const [jumlah, setJumlah]                 = useState('');
  const [formattedJumlah, setFormattedJumlah] = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [success, setSuccess]               = useState(false);

  // ── Rupiah input formatting helper ────────────────────────────────────────
  const formatToRupiah = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setJumlah(raw);
    setFormattedJumlah(formatToRupiah(raw));
  };

  // ── Clipboard copy helper ─────────────────────────────────────────────────
  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} berhasil disalin!`);
    } catch {
      alert(`Gagal menyalin ${label}.`);
    }
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !jumlah.trim()) {
      setError('Semua field konfirmasi wajib diisi.');
      return;
    }

    if (isPreviewMode) {
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
        setNama('');
        setJumlah('');
        setFormattedJumlah('');
        setLoading(false);
      }, 800);
      return;
    }

    setLoading(true);
    try {
      await submitBankTransfer({
        nominal: parseFloat(jumlah),
        user_id: contentId,
        nama_pemberi: nama.trim(),
        invitation_type: 'builder',
      });
      setSuccess(true);
      setNama('');
      setJumlah('');
      setFormattedJumlah('');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim konfirmasi.');
    } finally {
      setLoading(false);
    }
  };

  if (!enabled) return null;

  const filterStr = [bgBlur > 0 ? `blur(${bgBlur}px)` : '', bgGray ? 'grayscale(100%)' : ''].filter(Boolean).join(' ') || undefined;

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

  // ── Sub-components for Rendering ─────────────────────────────────────────

  const renderTitle = () => (
    <div className={`text-center flex flex-col items-center ${getAnimClass(1)}`} style={{ gap: 'clamp(0.2rem, 0.8dvh, 0.4rem)' }}>
      <h2 className="font-extrabold flex items-center justify-center gap-2"
        style={{ color: textColor, fontFamily: fontHead, fontSize: 'clamp(1rem, 3.5vw, 1.45rem)' }}>
        <FaGift style={{ color: accent, fontSize: '1.05em' }} />
        {sectionTitle}
      </h2>
      <p className="opacity-80 max-w-md mx-auto leading-relaxed" style={{ color: textColor, fontSize: 'clamp(0.68rem, 2vw, 0.82rem)' }}>
        Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
      </p>
    </div>
  );

  const renderGiftCategoryTabs = () => {
    if (!hasBanks || !hasAddress) return null;
    return (
      <div className={`flex justify-center gap-2.5 ${getAnimClass(2)}`} style={{ margin: 'clamp(0.15rem, 0.6dvh, 0.35rem) 0' }}>
        <button
          type="button"
          onClick={() => setActiveGiftTab('bank')}
          className="font-extrabold rounded-full transition-all border shadow-sm focus:outline-none"
          style={{
            backgroundColor: activeGiftTab === 'bank' ? accent : bgColor,
            color: activeGiftTab === 'bank' ? bgColor : accent,
            borderColor: accent,
            fontSize: 'clamp(0.62rem, 1.8vw, 0.75rem)',
            padding: 'clamp(0.25rem, 0.8dvh, 0.4rem) clamp(0.6rem, 2.5vw, 1rem)',
          }}
        >
          💳 Transfer Bank
        </button>
        <button
          type="button"
          onClick={() => setActiveGiftTab('address')}
          className="font-extrabold rounded-full transition-all border shadow-sm focus:outline-none"
          style={{
            backgroundColor: activeGiftTab === 'address' ? accent : bgColor,
            color: activeGiftTab === 'address' ? bgColor : accent,
            borderColor: accent,
            fontSize: 'clamp(0.62rem, 1.8vw, 0.75rem)',
            padding: 'clamp(0.25rem, 0.8dvh, 0.4rem) clamp(0.6rem, 2.5vw, 1rem)',
          }}
        >
          📦 Kirim Kado Fisik
        </button>
      </div>
    );
  };

  const renderBankDetails = () => {
    if (!hasBanks) return null;
    const currentAccount = banks[selectedAccountIdx];
    if (!currentAccount) return null;

    return (
      <div className="flex flex-col" style={{ gap: 'clamp(0.25rem, 0.8dvh, 0.5rem)' }}>
        {banks.length > 1 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {banks.map((acc, idx) => (
              <button
                key={acc.id || idx}
                type="button"
                className="rounded-lg border font-bold transition-all focus:outline-none shadow-sm"
                style={{
                  backgroundColor: selectedAccountIdx === idx ? accent + '1e' : bgColor + 'cc',
                  color: selectedAccountIdx === idx ? accent : textColor + '99',
                  borderColor: selectedAccountIdx === idx ? accent : accent + '33',
                  fontSize: 'clamp(0.6rem, 1.6vw, 0.7rem)',
                  padding: '0.15rem 0.45rem',
                }}
                onClick={() => setSelectedAccountIdx(idx)}
              >
                {acc.bank_name || 'Rekening'}
              </button>
            ))}
          </div>
        )}

        <div
          className="rounded-2xl border backdrop-blur-sm relative overflow-hidden transition-all shadow-sm flex items-center justify-between"
          style={{
            backgroundColor: bgColor + '90',
            borderColor: accent + '30',
            padding: 'clamp(0.5rem, 1.8dvh, 0.85rem) clamp(0.65rem, 2.2vw, 1.1rem)',
          }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-extrabold uppercase tracking-widest w-fit"
              style={{ backgroundColor: accent + '15', color: accent, fontSize: 'clamp(0.52rem, 1.4vw, 0.65rem)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
              {currentAccount.bank_name || 'Bank'}
            </span>
            <div className="flex flex-col">
              <p className="font-extrabold tracking-wider leading-tight" style={{ color: textColor, fontSize: 'clamp(0.95rem, 3.2vw, 1.3rem)' }}>
                {currentAccount.account_number || 'Nomor Rekening'}
              </p>
              <p className="opacity-75 mt-0.5" style={{ color: textColor, fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)' }}>
                a.n. <strong className="font-semibold">{currentAccount.account_name || 'Nama Pemilik'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopyText(currentAccount.account_number, 'Nomor rekening')}
            className="rounded-xl transition-all hover:scale-105 shadow-sm border focus:outline-none flex items-center justify-center shrink-0"
            style={{
              backgroundColor: accent,
              color: bgColor,
              borderColor: accent,
              padding: 'clamp(0.35rem, 1.2vw, 0.55rem)',
            }}
            title="Salin Nomor Rekening"
          >
            <FiCopy style={{ width: 'clamp(0.8rem, 1.8vw, 0.95rem)', height: 'clamp(0.8rem, 1.8vw, 0.95rem)' }} />
          </button>
        </div>
      </div>
    );
  };

  const renderAddressDetails = () => {
    if (!hasAddress) return null;

    return (
      <div
        className="rounded-2xl border backdrop-blur-sm relative overflow-hidden transition-all shadow-sm text-left flex items-start justify-between"
        style={{
          backgroundColor: bgColor + '90',
          borderColor: accent + '30',
          padding: 'clamp(0.5rem, 1.8dvh, 0.85rem) clamp(0.65rem, 2.2vw, 1.1rem)',
          gap: 'clamp(0.4rem, 1.8vw, 0.85rem)',
        }}
      >
        <div className="flex-1 flex flex-col gap-1">
          <span className="font-extrabold uppercase tracking-widest w-fit"
            style={{ backgroundColor: accent + '15', color: accent, fontSize: 'clamp(0.52rem, 1.4vw, 0.65rem)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
            📍 {addressTitle}
          </span>
          <div className="space-y-0.5">
            <p className="font-bold opacity-90" style={{ color: textColor, fontSize: 'clamp(0.72rem, 2vw, 0.85rem)' }}>
              Penerima: <strong className="font-extrabold">{addressRecipient || '-'}</strong>
            </p>
            {addressPhone && (
              <p className="opacity-80" style={{ color: textColor, fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)' }}>
                No. HP: {addressPhone}
              </p>
            )}
            <p className="opacity-90 leading-relaxed border-t border-gray-100 pt-1.5 mt-1.5 break-words" style={{ color: textColor, fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)' }}>
              {addressText}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopyText(`${addressRecipient}\n${addressPhone}\n${addressText}`, 'Alamat pengiriman')}
          className="rounded-xl transition-all hover:scale-105 shadow-sm border focus:outline-none shrink-0"
          style={{
            backgroundColor: accent,
            color: bgColor,
            borderColor: accent,
            padding: 'clamp(0.35rem, 1.2vw, 0.55rem)',
          }}
          title="Salin Alamat Lengkap"
        >
          <FiCopy style={{ width: 'clamp(0.8rem, 1.8vw, 0.95rem)', height: 'clamp(0.8rem, 1.8vw, 0.95rem)' }} />
        </button>
      </div>
    );
  };

  const renderConfirmationForm = () => {
    if (!hasBanks) return null;

    return (
      <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'clamp(0.3rem, 0.8dvh, 0.5rem)' }}>
        <div className="uppercase tracking-widest font-extrabold text-center opacity-85" style={{ color: accent, fontSize: 'clamp(0.58rem, 1.6vw, 0.68rem)' }}>
          Konfirmasi Transfer
        </div>

        {error && (
          <div className="p-2 rounded-xl bg-red-50 flex items-start gap-2 text-red-800 text-[10px] sm:text-xs text-left">
            <span>⚠️ {error}</span>
          </div>
        )}
        {success && (
          <div className="p-2 rounded-xl bg-green-50 flex items-start gap-2 text-green-800 text-[10px] sm:text-xs text-left">
            <span>🎉 Konfirmasi terkirim. Terima kasih!</span>
          </div>
        )}

        <div className="flex flex-col" style={{ gap: 'clamp(0.25rem, 0.7dvh, 0.45rem)' }}>
          <div className="relative flex items-center">
            <FaUser className="absolute left-3.5 text-[10px] opacity-60 pointer-events-none" style={{ color: accent }} />
            <input
              id="bank-nama"
              type="text"
              disabled={loading}
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Nama Pengirim"
              className={`w-full pl-10 pr-3 border rounded-xl focus:outline-none bg-transparent transition-all`}
              style={{
                ...resolvedInputStyle,
                fontSize: 'clamp(0.68rem, 1.8vw, 0.82rem)',
                paddingTop: 'clamp(0.35rem, 1dvh, 0.6rem)',
                paddingBottom: 'clamp(0.35rem, 1dvh, 0.6rem)',
              }}
            />
          </div>

          <div className="relative flex items-center">
            <FaMoneyBillWave className="absolute left-3.5 text-[10px] opacity-60 pointer-events-none" style={{ color: accent }} />
            <input
              id="bank-jumlah"
              type="text"
              disabled={loading}
              value={formattedJumlah}
              onChange={handleJumlahChange}
              placeholder="Nominal Transfer (Rp)"
              className={`w-full pl-10 pr-3 border rounded-xl focus:outline-none bg-transparent transition-all`}
              style={{
                ...resolvedInputStyle,
                fontSize: 'clamp(0.68rem, 1.8vw, 0.82rem)',
                paddingTop: 'clamp(0.35rem, 1dvh, 0.6rem)',
                paddingBottom: 'clamp(0.35rem, 1dvh, 0.6rem)',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          style={{
            ...(isMinimal ? { border: `1.5px solid ${accent}`, color: accent, background: 'transparent' } : { backgroundColor: accent, color: bgColor }),
            fontSize: 'clamp(0.68rem, 1.8vw, 0.82rem)',
            paddingTop: 'clamp(0.4rem, 1.2dvh, 0.65rem)',
            paddingBottom: 'clamp(0.4rem, 1.2dvh, 0.65rem)',
          }}
        >
          <FaPaperPlane className="text-[9px] sm:text-xs" />
          {loading ? 'Mengirim...' : 'Kirim Konfirmasi'}
        </button>
      </form>
    );
  };

  const renderClassic = () => (
    <div className="w-full flex flex-col" style={{ gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)' }}>
      {renderTitle()}
      {renderGiftCategoryTabs()}
      
      {activeGiftTab === 'bank' && hasBanks && (
        <div className={`flex flex-col ${getAnimClass(3)}`} style={{ gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)' }}>
          {renderBankDetails()}
          {renderConfirmationForm()}
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div className={`${getAnimClass(3)}`}>
          {renderAddressDetails()}
        </div>
      )}
    </div>
  );

  const renderCard = () => (
    <div className={`w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-md flex flex-col ${getAnimClass(1)}`}
      style={{
        padding: 'clamp(0.6rem, 2.5dvh, 1.5rem) clamp(0.6rem, 3vw, 1.25rem)',
        gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)',
      }}>
      {renderTitle()}
      <div className="w-full border-t border-gray-100 dark:border-gray-800" />
      {renderGiftCategoryTabs()}

      {activeGiftTab === 'bank' && hasBanks && (
        <div className="flex flex-col" style={{ gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)' }}>
          {renderBankDetails()}
          {renderConfirmationForm()}
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div>
          {renderAddressDetails()}
        </div>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className="w-full flex flex-col" style={{ gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)' }}>
      {renderTitle()}
      {renderGiftCategoryTabs()}

      {activeGiftTab === 'bank' && hasBanks && (
        <div className="flex flex-col" style={{ gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)' }}>
          {renderBankDetails()}
          <div className="w-full border-t border-gray-100" />
          {renderConfirmationForm()}
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div>
          {renderAddressDetails()}
        </div>
      )}
    </div>
  );

  const renderFloating = () => (
    <div className="w-full flex flex-col" style={{ gap: 'clamp(0.4rem, 1.2dvh, 0.85rem)' }}>
      {renderTitle()}
      {renderGiftCategoryTabs()}

      {activeGiftTab === 'bank' && hasBanks && (
        <div className="flex flex-col" style={{ gap: 'clamp(0.35rem, 1dvh, 0.65rem)' }}>
          <div className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 transition-all ${getAnimClass(2)}`}
            style={{ padding: 'clamp(0.45rem, 1.8dvh, 0.85rem)' }}>
            {renderBankDetails()}
          </div>
          <div className={`w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/10 ${getAnimClass(3)}`}
            style={{ padding: 'clamp(0.45rem, 1.8dvh, 0.85rem)' }}>
            {renderConfirmationForm()}
          </div>
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 transition-all ${getAnimClass(2)}`}
          style={{ padding: 'clamp(0.45rem, 1.8dvh, 0.85rem)' }}>
          {addressRecipient && renderAddressDetails()}
        </div>
      )}
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
    <div className="gift-root" style={{ backgroundColor: parentBgClr }}>
      {/* ── Scoped CSS ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes giftKenburns {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.1); }
        }
        @keyframes animFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes animFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes animFadeDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes animZoomIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        @keyframes animTrackingWide { from { opacity: 0; letter-spacing: -0.2em; filter: blur(4px); } to { opacity: 1; } }
        @keyframes animSlideLeft { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes animSlideRight { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes animBlurReveal { from { opacity: 0; filter: blur(12px); transform: scale(0.96); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
        @keyframes animBounceSoft {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 0.9; transform: scale(1.04); }
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

        .delay-1 { animation-delay: 100ms; }
        .delay-2 { animation-delay: 200ms; }
        .delay-3 { animation-delay: 300ms; }

        .gift-root {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
        }

        .gift-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 38rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: clamp(0.75rem, 3.5dvh, 2rem) clamp(0.75rem, 4vw, 1.5rem);
          gap: clamp(0.4rem, 1.2dvh, 0.75rem);
          max-height: 100%;
          overflow-y: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .gift-content::-webkit-scrollbar { display: none; }
      `}} />

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
        else if (slideshowAnim === 'zoom') { op = isAct ? 1 : 0; if (isAct) anim = `giftKenburns ${slideshowDuration + 1}s ease-in-out infinite alternate`; if (bgBlur > 0) tr = 'scale(1.05)'; }
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

      {/* ── Content ── */}
      <div className="gift-content">
        {renderLayout()}
      </div>
    </div>
  );
}
