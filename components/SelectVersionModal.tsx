'use client';

import React, { useState } from 'react';
import { XIcon, SparklesIcon, LayoutTemplateIcon, ChevronRightIcon, MessageCircleIcon } from 'lucide-react';
import CreateInvitationPopup from '@/components/CreateInvitationPopup';
import CreateBuilderPopup from '@/components/builder/CreateBuilderPopup';

interface Props {
  userId: number;
  onClose: () => void;
  onInvitationCreated: (slug: string) => void;
  onBuilderCreated: (slug: string, eventType: string, pageTitle: string) => void;
}

type Step = 'select' | 'legacy' | 'builder';

export default function SelectVersionModal({ userId, onClose, onInvitationCreated, onBuilderCreated }: Props) {
  const [step, setStep] = useState<Step>('select');

  if (step === 'legacy') {
    return (
      <CreateInvitationPopup
        userId={userId}
        onClose={onClose}
        onInvitationCreated={onInvitationCreated}
      />
    );
  }

  if (step === 'builder') {
    return (
      <CreateBuilderPopup
        userId={userId}
        onClose={onClose}
        onCreated={(slug, eventType, pageTitle) => onBuilderCreated(slug, eventType, pageTitle)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-4xl lg:max-w-5xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between flex-shrink-0 border-b border-gray-50 md:border-none">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Buat Undangan Baru</h2>
            <p className="text-sm md:text-base text-gray-500 mt-1">Pilih versi pembuat undangan yang paling sesuai</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 overflow-y-auto">
          {/* Versi Lama */}
          <button
            onClick={() => setStep('legacy')}
            className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all group flex flex-col h-full"
          >
            <div className="flex flex-row md:flex-col gap-4 md:gap-5 h-full w-full">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center transition-colors flex-shrink-0">
                <LayoutTemplateIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-400 group-hover:text-pink-500 transition-colors" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-1.5 md:mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 text-sm md:text-lg">Versi Lama</p>
                    <span className="text-[10px] md:text-xs bg-gray-100 text-gray-500 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full font-medium">Formulir</span>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-pink-400 flex-shrink-0 transition-colors md:hidden" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed flex-1">Buat undangan dengan formulir lengkap. Pilih tema dari template yang tersedia.</p>
              </div>
            </div>
          </button>

          {/* Versi Baru - Builder */}
          <button
            onClick={() => setStep('builder')}
            className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all group relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-4 right-4 md:top-5 md:right-5">
              <span className="text-[10px] md:text-xs bg-pink-100 text-pink-600 px-2.5 py-1 rounded-full font-bold">Baru ✨</span>
            </div>
            <div className="flex flex-row md:flex-col gap-4 md:gap-5 h-full w-full">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <SparklesIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-400 group-hover:text-pink-500 transition-colors" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="mb-1.5 md:mb-3 pr-16 md:pr-0">
                  <p className="font-bold text-gray-800 text-sm md:text-lg group-hover:text-pink-600 transition-colors md:mb-2">Versi Baru — Builder</p>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed flex-1">Drag & drop visual builder. Atur seksi, warna, font, dan konten sebebasnya.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-auto pt-2">
                  {['Pernikahan', 'Ulang Tahun', 'Khitanan', 'Custom'].map(t => (
                    <span key={t} className="text-[10px] md:text-xs bg-white text-gray-400 border border-gray-200 px-2 py-0.5 md:py-1 rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Terima Beres */}
          <a
            href="https://wa.me/6289654728249?text=Halo%20Admin%20Papunda,%20saya%20mau%20pesan%20undangan%20Terima%20Beres%20seharga%2080rb."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left p-5 rounded-2xl border-2 border-green-100 md:border-gray-100 md:hover:border-green-200 bg-green-50/30 md:bg-transparent md:hover:bg-green-50/50 transition-all group relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-4 right-4 md:top-5 md:right-5">
              <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold shadow-sm">Promo 80k ✨</span>
            </div>
            <div className="flex flex-row md:flex-col gap-4 md:gap-5 h-full w-full">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-green-100 md:bg-gray-100 md:group-hover:bg-green-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <MessageCircleIcon className="h-6 w-6 md:h-7 md:w-7 text-green-500 md:text-gray-400 md:group-hover:text-green-500 transition-colors" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="mb-1.5 md:mb-3 pr-20 md:pr-0">
                  <p className="font-bold text-gray-800 text-sm md:text-lg md:group-hover:text-green-600 transition-colors md:mb-2">Terima Beres</p>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed flex-1">Cuman 80rb! Dibuatkan sampai jadi. Bebas request lagu & semua fitur terbuka.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mt-auto pt-2">
                  <span className="text-[10px] md:text-xs bg-white text-gray-500 border border-gray-200 px-2 py-0.5 md:py-1 rounded-full font-medium">Bebas Request Lagu</span>
                  <span className="text-[10px] md:text-xs bg-white text-gray-500 border border-gray-200 px-2 py-0.5 md:py-1 rounded-full font-medium">Semua Fitur Terbuka</span>
                  <span className="text-[10px] md:text-xs bg-white text-gray-500 border border-gray-200 px-2 py-0.5 md:py-1 rounded-full font-medium">Semua Jenis Undangan</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
