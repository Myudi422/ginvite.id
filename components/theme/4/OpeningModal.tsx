"use client";

import { useState } from "react";
import { FaQrcode } from 'react-icons/fa';
import { ThemeText, ThemeButton } from './ThemeComponents';

interface OpeningModalProps {
  onClose: (guestName: string) => void;
  selectedProfile: string;
  qrData?: string;
  onShowQr?: () => void;
  showQrButton?: boolean;
}

export default function OpeningModal({ onClose, selectedProfile, qrData, onShowQr, showQrButton }: OpeningModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleVideoEnd = () => {
    setShowContent(true);
  };

  const handleContinue = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onClose(selectedProfile);
    }, 500);
  };

  const handleShowQr = () => {
    onShowQr?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">

      {/* Main Container (Mobile Size) */}
      <div className={`relative w-full max-w-[480px] h-full max-h-screen overflow-hidden shadow-2xl transition-all duration-700 transform ${isConfirming ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}>

        {/* Video Background */}
        <div className="absolute inset-0 bg-black">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
          >
            <source src="https://ccgnimex.s3.us-east-005.backblazeb2.com/papunda/theme/4/grok-video-82da76ee-5924-4fe3-a778-b31f5e99b359.mp4" type="video/mp4" />
          </video>
          {/* Dim Overlay when content shows */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Content Overlay */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 translate-y-10 invisible pointer-events-none'}`}>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'var(--t4-border-glass, rgba(245, 158, 11, 0.1))' }} />

          <div className="relative z-10 space-y-8 w-full max-w-sm">
            {/* Header */}
            <div className="space-y-2">
              <ThemeText variant="caption" color="gold" className="tracking-[0.3em]">
                THE WEDDING OF
              </ThemeText>
              <h1 className="text-4xl font-serif text-white tracking-wide drop-shadow-lg">
                Invitation
              </h1>
            </div>

            {/* Guest Name Card */}
            <div className="py-8 px-6 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl space-y-4">
              <ThemeText variant="meta" color="gray" className="uppercase tracking-widest text-[10px] text-zinc-300">
                Dear Mr/Mrs/Ms
              </ThemeText>

              <div className="py-2 border-b w-3/4 mx-auto" style={{ borderColor: 'var(--t4-border-glass, rgba(245, 158, 11, 0.3))' }}>
                <p className="text-2xl font-serif leading-tight text-center break-words" style={{ color: 'var(--t4-text-primary, #fef3c7)' }}>
                  {selectedProfile}
                </p>
              </div>

              <ThemeText variant="body" color="gray" className="text-xs pt-2 text-zinc-300">
                We saved a seat for you
              </ThemeText>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <ThemeButton
                onClick={handleContinue}
                className="w-full shadow-lg"
              >
                Open Invitation
              </ThemeButton>
            </div>

            {/* QR Link */}
            {showQrButton && qrData && qrData.trim() !== '' && (
              <div
                onClick={handleShowQr}
                className="inline-flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-amber-400 transition-colors group"
              >
                <FaQrcode className="text-lg group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-wider font-medium">Show QR Code</span>
              </div>
            )}
          </div>
        </div>

        {/* Skip Button (Only generic, if needed, but user wanted "one with video") */}
        {!showContent && (
          <button
            onClick={() => setShowContent(true)}
            className="absolute bottom-8 right-4 text-white/50 text-xs uppercase tracking-widest hover:text-white border border-white/20 px-3 py-1 rounded-full z-20"
          >
            Skip
          </button>
        )}

      </div>
    </div>
  );
}
