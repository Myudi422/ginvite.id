'use client';

import React, { useState } from 'react';
import { XIcon, SparklesIcon, LayoutTemplateIcon, ChevronRightIcon } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Buat Undangan Baru</h2>
            <p className="text-sm text-gray-400 mt-0.5">Pilih cara membuat undangan</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-3">
          {/* Versi Lama */}
          <button
            onClick={() => setStep('legacy')}
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center transition-colors flex-shrink-0">
                <LayoutTemplateIcon className="h-6 w-6 text-gray-400 group-hover:text-pink-500 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-800 text-sm">Versi Lama</p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Formulir</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Buat undangan dengan formulir lengkap. Pilih tema dari template yang tersedia.</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-pink-400 flex-shrink-0 transition-colors" />
            </div>
          </button>

          {/* Versi Baru - Builder (Coming Soon) */}
          <button
            disabled
            className="w-full text-left p-4 rounded-2xl border-2 border-gray-150 bg-gray-50/50 opacity-70 cursor-not-allowed transition-all relative overflow-hidden group"
          >
            <div className="absolute top-3 right-3">
              <span className="text-[10px] bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-bold">Segera Hadir ⏳</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0 pr-10">
                <p className="font-bold text-gray-500 text-sm">Versi Baru — Page Builder</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Drag & drop builder visual. Atur setiap seksi, warna, font, dan konten bebas untuk semua jenis acara.</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Pernikahan', 'Ulang Tahun', 'Khitanan', 'Custom'].map(t => (
                    <span key={t} className="text-[10px] bg-white text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
