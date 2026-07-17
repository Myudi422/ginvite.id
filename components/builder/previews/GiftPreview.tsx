'use client';

import React, { useState, useEffect } from 'react';
import { FaGift, FaPaperPlane, FaUser, FaMoneyBillWave, FaMapMarkerAlt, FaCopy } from 'react-icons/fa';
import { FiCopy, FiLock } from 'react-icons/fi';
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
  const userId        = (style._user_id as number) || 0;
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

  // ── STYLE BLOCK INJECTION ──
  const styleBlock = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes giftKenburns {
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

  // ── Sub-components for Rendering ─────────────────────────────────────────

  const renderTitle = () => (
    <div className={`text-center space-y-3 ${getAnimClass(1)}`}>
      <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center justify-center gap-2.5"
        style={{ color: textColor, fontFamily: fontHead }}>
        <FaGift style={{ color: accent }} />
        {sectionTitle}
      </h2>
      <p className="text-sm sm:text-base opacity-80 max-w-md sm:max-w-lg mx-auto leading-relaxed" style={{ color: textColor }}>
        Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui:
      </p>
    </div>
  );

  // Tabs for switching between Digital Wallet (Banks) and Physical Address
  const renderGiftCategoryTabs = () => {
    if (!hasBanks || !hasAddress) return null;
    return (
      <div className={`flex justify-center gap-3 mb-8 ${getAnimClass(2)}`}>
        <button
          type="button"
          onClick={() => setActiveGiftTab('bank')}
          className="px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold rounded-full transition-all border shadow-md focus:outline-none"
          style={{
            backgroundColor: activeGiftTab === 'bank' ? accent : bgColor,
            color: activeGiftTab === 'bank' ? bgColor : accent,
            borderColor: accent,
          }}
        >
          💳 Transfer Bank
        </button>
        <button
          type="button"
          onClick={() => setActiveGiftTab('address')}
          className="px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-extrabold rounded-full transition-all border shadow-md focus:outline-none"
          style={{
            backgroundColor: activeGiftTab === 'address' ? accent : bgColor,
            color: activeGiftTab === 'address' ? bgColor : accent,
            borderColor: accent,
          }}
        >
          📦 Kirim Kado Fisik
        </button>
      </div>
    );
  };

  // Sub-component: Bank Account Details Card & Selector tabs
  const renderBankDetails = () => {
    if (!hasBanks) return null;
    const currentAccount = banks[selectedAccountIdx];
    if (!currentAccount) return null;

    return (
      <div className="space-y-4">
        {/* If multiple bank accounts, show switching tabs */}
        {banks.length > 1 && (
          <div className="flex flex-wrap gap-2.5 justify-center mb-1">
            {banks.map((acc, idx) => (
              <button
                key={acc.id || idx}
                type="button"
                className="px-4 py-1.5 text-xs rounded-xl border font-bold transition-all focus:outline-none shadow-sm"
                style={{
                  backgroundColor: selectedAccountIdx === idx ? accent + '1e' : bgColor + 'cc',
                  color: selectedAccountIdx === idx ? accent : textColor + '99',
                  borderColor: selectedAccountIdx === idx ? accent : accent + '33',
                }}
                onClick={() => setSelectedAccountIdx(idx)}
              >
                {acc.bank_name || 'Rekening'}
              </button>
            ))}
          </div>
        )}

        {/* Selected Account display box */}
        <div
          className="p-6 sm:p-8 rounded-3xl border backdrop-blur-sm relative overflow-hidden transition-all shadow-md"
          style={{
            backgroundColor: bgColor + '90',
            borderColor: accent + '40',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: accent + '22', color: accent }}>
                {currentAccount.bank_name || 'Bank'}
              </span>
              <div className="pt-1">
                <p className="text-xl sm:text-2xl font-extrabold tracking-wider leading-none" style={{ color: textColor }}>
                  {currentAccount.account_number || 'Nomor Rekening'}
                </p>
                <p className="text-sm sm:text-base opacity-75 mt-2" style={{ color: textColor }}>
                  a.n. <strong className="font-semibold">{currentAccount.account_name || 'Nama Pemilik'}</strong>
                </p>
              </div>
            </div>

            {/* Quick copy button */}
            <button
              type="button"
              onClick={() => handleCopyText(currentAccount.account_number, 'Nomor rekening')}
              className="p-3.5 rounded-2xl transition-all hover:scale-105 shadow-md border focus:outline-none"
              style={{
                backgroundColor: accent,
                color: bgColor,
                borderColor: accent,
              }}
              title="Salin Nomor Rekening"
            >
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Sub-component: Physical Address Details Card
  const renderAddressDetails = () => {
    if (!hasAddress) return null;

    return (
      <div className="space-y-3">
        <div
          className="p-6 sm:p-8 rounded-3xl border backdrop-blur-sm relative overflow-hidden transition-all shadow-md text-left"
          style={{
            backgroundColor: bgColor + '90',
            borderColor: accent + '40',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: accent + '22', color: accent }}>
                📍 {addressTitle}
              </span>
              <div className="pt-1 space-y-1.5">
                <p className="text-base sm:text-lg font-bold opacity-90" style={{ color: textColor }}>
                  Penerima: <strong className="font-extrabold">{addressRecipient || '-'}</strong>
                </p>
                {addressPhone && (
                  <p className="text-sm sm:text-base opacity-80" style={{ color: textColor }}>
                    No. HP: {addressPhone}
                  </p>
                )}
                <p className="text-sm sm:text-base opacity-90 leading-relaxed border-t border-gray-150/40 pt-2.5 mt-2.5 break-words" style={{ color: textColor }}>
                  {addressText}
                </p>
              </div>
            </div>

            {/* Quick copy address button */}
            <button
              type="button"
              onClick={() => handleCopyText(`${addressRecipient}\n${addressPhone}\n${addressText}`, 'Alamat pengiriman')}
              className="p-3.5 rounded-2xl transition-all hover:scale-105 shadow-md border focus:outline-none shrink-0"
              style={{
                backgroundColor: accent,
                color: bgColor,
                borderColor: accent,
              }}
              title="Salin Alamat Lengkap"
            >
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Sub-component: Bank Confirmation Form (renders only when Bank tab is active)
  const renderConfirmationForm = () => {
    if (!hasBanks) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="text-sm sm:text-base uppercase tracking-widest font-extrabold mb-2 opacity-80 text-center" style={{ color: accent }}>
          Formulir Konfirmasi Transfer
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-100/90 flex items-start gap-2.5 text-red-800 text-sm text-left">
            <span>⚠️ {error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 rounded-2xl bg-green-100/90 flex items-start gap-2.5 text-green-800 text-sm text-left">
            <span>🎉 Terima kasih! Konfirmasi hadiah berhasil terkirim.</span>
          </div>
        )}

        <div className="space-y-3.5">
          {/* Sender Name */}
          <div className="relative">
            <FaUser className="absolute top-4 left-3.5 text-sm opacity-60" style={{ color: accent }} />
            <input
              id="bank-nama"
              type="text"
              disabled={loading}
              value={nama}
              onChange={e => setNama(e.target.value)}
              placeholder="Nama Pengirim"
              className={`w-full pl-11 pr-4 py-3 border rounded-2xl focus:outline-none bg-transparent transition-all text-sm sm:text-base ${
                isMinimal ? 'border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0 focus:border-b-accent' : ''
              }`}
              style={resolvedInputStyle}
            />
          </div>

          {/* Nominal Transfer */}
          <div className="relative">
            <FaMoneyBillWave className="absolute top-4 left-3.5 text-sm opacity-60" style={{ color: accent }} />
            <input
              id="bank-jumlah"
              type="text"
              disabled={loading}
              value={formattedJumlah}
              onChange={handleJumlahChange}
              placeholder="Nominal Transfer (Rp)"
              className={`w-full pl-11 pr-4 py-3 border rounded-2xl focus:outline-none bg-transparent transition-all text-sm sm:text-base ${
                isMinimal ? 'border-b-2 border-t-0 border-x-0 rounded-none focus:ring-0' : ''
              }`}
              style={resolvedInputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          style={isMinimal ? { border: `2px solid ${accent}`, color: accent, background: 'transparent' } : { backgroundColor: accent, color: bgColor }}
        >
          <FaPaperPlane className="text-xs sm:text-sm" />
          {loading ? 'Mengirim...' : 'Kirim Konfirmasi'}
        </button>
      </form>
    );
  };

  // ── Layout Render Selectors ──────────────────────────────────────────────

  const renderClassic = () => (
    <div className="space-y-6 w-full max-w-2xl sm:max-w-3xl mx-auto">
      {renderTitle()}
      {renderGiftCategoryTabs()}
      
      {activeGiftTab === 'bank' && hasBanks && (
        <div className={`space-y-6 ${getAnimClass(3)}`}>
          {renderBankDetails()}
          {renderConfirmationForm()}
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div className={`space-y-4 ${getAnimClass(3)}`}>
          {renderAddressDetails()}
        </div>
      )}
    </div>
  );

  const renderCard = () => (
    <div className={`w-full max-w-xl sm:max-w-2xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl p-8 sm:p-12 space-y-6 ${getAnimClass(1)}`}>
      {renderTitle()}
      <div className="w-full border-t border-gray-100 dark:border-gray-800 my-1" />
      {renderGiftCategoryTabs()}

      {activeGiftTab === 'bank' && hasBanks && (
        <div className="space-y-6">
          {renderBankDetails()}
          {renderConfirmationForm()}
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div className="space-y-4">
          {renderAddressDetails()}
        </div>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className="space-y-6 w-full max-w-xl sm:max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest block opacity-75" style={{ color: accent }}>
          Kado & Hadiah
        </span>
        {renderTitle()}
      </div>
      {renderGiftCategoryTabs()}

      {activeGiftTab === 'bank' && hasBanks && (
        <div className="space-y-6">
          {renderBankDetails()}
          <div className="w-full border-t border-gray-150/40 my-6" />
          {renderConfirmationForm()}
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div className="space-y-4">
          {renderAddressDetails()}
        </div>
      )}
    </div>
  );

  const renderFloating = () => (
    <div className="space-y-6 w-full max-w-xl sm:max-w-2xl mx-auto">
      {renderTitle()}
      {renderGiftCategoryTabs()}

      {activeGiftTab === 'bank' && hasBanks && (
        <div className="space-y-4 sm:space-y-6">
          <div className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/40 transform hover:-translate-y-1 transition-transform duration-300 ${getAnimClass(2)}`}>
            {renderBankDetails()}
          </div>
          <div className={`w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-md p-4 sm:p-8 border border-white/20 ${getAnimClass(3)}`}>
            {renderConfirmationForm()}
          </div>
        </div>
      )}

      {activeGiftTab === 'address' && hasAddress && (
        <div className={`w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/40 transform hover:-translate-y-1 transition-transform duration-300 ${getAnimClass(2)}`}>
          {renderAddressDetails()}
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
    <section className="relative mx-auto overflow-hidden transition-all duration-300 min-h-[60dvh] flex flex-col justify-center py-12 sm:py-28" style={{ backgroundColor: parentBgClr }}>
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
      <div className="relative z-10 p-4 sm:p-6 w-full flex flex-col justify-center">
        {renderLayout()}
      </div>
    </section>
  );
}
