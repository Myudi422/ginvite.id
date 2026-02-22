"use client";

import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import { FaCheckCircle, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';

interface QRModalProps {
  show: boolean;
  onClose: () => void;
  qrData: string;
  guestName?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  coverImage?: string;
}

export default function QRModal({
  show,
  onClose,
  qrData,
  guestName = "Nama Tamu",
  eventName = "The Wedding Of",
  eventDate = "17 AGUSTUS 2024",
  eventTime = "09.00 WIB - Selesai",
  coverImage = "/images/default-wedding.jpg"
}: QRModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [base64Cover, setBase64Cover] = useState<string | null>(null);

  useEffect(() => {
    if (coverImage) {
      if (coverImage.startsWith('http')) {
        setBase64Cover(`/api/proxy-image?url=${encodeURIComponent(coverImage)}`);
      } else {
        setBase64Cover(coverImage);
      }
    }
  }, [coverImage]);

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (ticketRef.current) {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `QR-Ticket-${guestName.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("Failed to download ticket", error);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Container */}
          <div className="rounded-xl shadow-2xl max-w-sm w-full relative overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header / Ticket ref wrapper */}
            <div ref={ticketRef} className="bg-white w-full rounded-xl overflow-hidden flex flex-col h-full">
              {/* Header Bar */}
              <div className="bg-[#8A8A8A] text-white px-3 py-2 sm:px-4 sm:py-3 flex justify-between items-center relative">
                <div className="w-6" /> {/* Spacer for centering */}
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <FaCheckCircle className="text-white text-base sm:text-lg" />
                  <span className="font-bold tracking-widest text-xs sm:text-sm">CHECK-IN</span>
                </div>
                {/* Close Button, disabled in canvas by html2canvas using data-html2canvas-ignore */}
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                  data-html2canvas-ignore="true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cover Image */}
              <div className="relative h-28 sm:h-40 w-full border-b-[6px] sm:border-b-[8px] border-[#8A8A8A] shrink-0">
                <img
                  src={base64Cover || coverImage}
                  alt="Event Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-left">
                  <p className="text-white/90 text-[9px] sm:text-[10px] font-medium tracking-widest uppercase">The Wedding Of</p>
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-serif font-bold leading-tight">{eventName}</h3>
                </div>
              </div>

              {/* Middle Section */}
              <div className="p-4 sm:p-5 bg-white text-left overflow-y-auto">
                {/* Date & Time */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <FaCalendarAlt className="text-gray-700 text-2xl sm:text-3xl shrink-0 mt-0.5 sm:mt-1" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm sm:text-base uppercase tracking-widest leading-tight">{eventDate}</p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1">{eventTime}</p>
                  </div>
                </div>

                {/* Info & QR */}
                <div className="flex justify-between items-end gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] sm:text-xs text-gray-600 mb-1 leading-tight">Kepada Yth:<br />Bapak/Ibu/Saudara/i</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 break-words leading-tight">{guestName}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">di Tempat</p>
                  </div>

                  <div className="shrink-0 bg-white p-1.5 sm:p-2 rounded-xl border-2 sm:border-4 border-gray-900 mx-auto sm:mx-0">
                    <QRCode value={qrData} size={80} className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]" />
                  </div>
                </div>
              </div>

              {/* Bottom Section (Tear-off ticket style) */}
              <div className="relative bg-[#8A8A8A] text-white p-4 pt-6 sm:p-5 sm:pt-7 mt-0 shrink-0">
                {/* Jagged border top using repeating circles to clip background */}
                <div className="absolute -top-[8px] sm:-top-[10px] left-0 right-0 h-[16px] sm:h-[20px] w-full flex justify-between px-[2px] overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 50% 1px, white 5px, transparent 6px)', backgroundSize: '16px 20px', backgroundRepeat: 'repeat-x' }}>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex flex-col items-start leading-[1.1]">
                    <span className="font-bold tracking-widest text-sm md:text-base lg:text-lg ml-1">papunda</span>
                    <span className="text-[7px] sm:text-[8px] md:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] ml-1 opacity-80 uppercase">Digital Invitation</span>
                  </div>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] leading-relaxed text-white max-w-[120px] sm:max-w-[140px] text-right font-medium opacity-90">
                    HARAP TUNJUKAN QR CODE INI<br />
                    UNTUK CHECK-IN DI LOKASI ACARA.
                  </p>
                </div>

                {/* Action Buttons (Not part of downloaded image) */}
                <div className="mt-4 sm:mt-6 flex justify-center" data-html2canvas-ignore="true">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 border border-white/40 rounded-full text-white text-xs sm:text-sm font-medium hover:bg-white/10 hover:border-white transition-all active:scale-95"
                  >
                    <FaDownload className="text-sm" />
                    <span>Download QR</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}