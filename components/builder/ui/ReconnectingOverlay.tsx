'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReconnectingOverlayProps {
  isLoading: boolean;
  onRetry: () => Promise<void>;
}

export default function ReconnectingOverlay({ isLoading, onRetry }: ReconnectingOverlayProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [autoRetryActive, setAutoRetryActive] = useState(true);

  // Auto retry countdown logic
  useEffect(() => {
    if (!autoRetryActive || isLoading) return;

    if (countdown <= 0) {
      handleRetry();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, autoRetryActive, isLoading]);

  const handleRetry = async () => {
    setCountdown(5);
    await onRetry();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/80 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6 md:p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />

        {/* Pulse radar & icon container */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Pulsing rings */}
          <div className="absolute inset-0 bg-pink-500/10 rounded-full animate-ping duration-1000" />
          <div className="absolute inset-2 bg-purple-500/10 rounded-full animate-pulse duration-700" />
          <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 shadow-lg text-white">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <WifiOff className="h-8 w-8 animate-bounce" />
            )}
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight mb-3">
          {isLoading ? 'Menghubungkan Kembali...' : 'Gagal Terhubung ke Server'}
        </h2>

        {/* Description & Warnings */}
        <div className="space-y-3 mb-8 w-full">
          <p className="text-sm text-gray-500 leading-relaxed">
            Sistem mendeteksi gangguan jaringan saat mengambil data undangan Anda dari server.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-left w-full">
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              ⚠️ <strong>Penting:</strong> Editor kami tunda sementara waktu demi melindungi data Anda agar tidak tertimpa oleh template kosong/default.
            </p>
          </div>
        </div>

        {/* Dynamic Countdown & Loading state */}
        <div className="w-full flex flex-col gap-3.5 mb-4">
          {isLoading ? (
            <div className="text-xs font-semibold text-pink-600 animate-pulse py-2">
              Sedang mengambil data terbaru dari server, mohon tunggu...
            </div>
          ) : (
            <>
              {autoRetryActive ? (
                <div className="text-xs text-gray-400 font-medium">
                  Mencoba menghubungkan kembali secara otomatis dalam{' '}
                  <span className="text-pink-600 font-bold text-sm bg-pink-50 px-2 py-0.5 rounded-full inline-block min-w-[1.5rem]">
                    {countdown}
                  </span>{' '}
                  detik...
                </div>
              ) : (
                <div className="text-xs text-gray-400 font-medium">
                  Percobaan otomatis dijeda.
                </div>
              )}

              {/* Retry Button */}
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="group relative flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 transition-transform group-hover:rotate-45 duration-300 ${isLoading ? 'animate-spin' : ''}`} />
                Hubungkan Sekarang
              </button>
            </>
          )}

          {/* Pause / Resume Auto Retry Toggle */}
          {!isLoading && (
            <button
              onClick={() => setAutoRetryActive(!autoRetryActive)}
              className="text-xs text-gray-400 hover:text-gray-600 underline font-medium transition-colors"
            >
              {autoRetryActive ? 'Jeda percobaan otomatis' : 'Aktifkan percobaan otomatis'}
            </button>
          )}
        </div>

        {/* Exit Button */}
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
