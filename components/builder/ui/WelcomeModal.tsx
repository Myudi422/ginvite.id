'use client';

import React from 'react';
import { Sparkles, Palette, Layout, ArrowRight } from 'lucide-react';

interface Props {
  onSelectTemplate: () => void;
  onSelectBlank: () => void;
  onClose: () => void;
}

export default function WelcomeModal({ onSelectTemplate, onSelectBlank, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-zoom-in flex flex-col">
        
        {/* Decorative Top Banner */}
        <div className="h-32 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 relative flex items-center justify-center overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-10 -top-10 w-28 h-28 bg-pink-400/20 rounded-full blur-2xl" />
          <Sparkles className="w-10 h-10 text-pink-100 animate-pulse relative z-10" />
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
              Selamat Datang di Builder Papunda! 🌟
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Langkah pertama untuk membuat undangan digital impian Anda. Bagaimana Anda ingin memulai desain ini?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Option A: Template */}
            <button
              onClick={onSelectTemplate}
              className="group p-5 rounded-2xl border-2 border-pink-150 hover:border-pink-500 bg-pink-50/20 hover:bg-pink-50/50 transition-all flex flex-col gap-3.5 shadow-sm text-left active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-md">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1 group-hover:text-pink-600 transition-colors">
                  Pilih Template Desain
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Pilih dari puluhan pilihan tema siap pakai buatan desainer kami agar pembuatan undangan jauh lebih cepat.
                </p>
              </div>
            </button>

            {/* Option B: Blank */}
            <button
              onClick={onSelectBlank}
              className="group p-5 rounded-2xl border-2 border-gray-150 hover:border-pink-500 hover:bg-pink-50/30 transition-all flex flex-col gap-3.5 shadow-sm text-left active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-150 text-gray-600 group-hover:bg-pink-500 group-hover:text-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1 group-hover:text-pink-600 transition-colors">
                  Kanvas Kosong (Default)
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Mulai dari layout bawaan standar dan desain sendiri warna, musik, foto, serta bagian undangan dari nol.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-center gap-1">
          <p className="text-[10px] text-gray-400 font-semibold">
            Apapun pilihan Anda, Anda akan dipandu menggunakan **Formulir Cepat** setelah ini.
          </p>
        </div>

      </div>
    </div>
  );
}
