'use client';

import { useState } from 'react';
import { midtransAction, toggleStatusAction } from '@/app/actions/indexcontent';

interface PaymentRequiredProps {
  userId: string;
  title: string;
  contentUserId: number;
}

export default function PaymentRequired({ userId, title, contentUserId }: PaymentRequiredProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayTitle = (() => {
    try {
      return decodeURIComponent(title).replace(/-/g, ' ');
    } catch {
      return title.replace(/-/g, ' ');
    }
  })();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await midtransAction({
        user_id: parseInt(userId),
        id_content: contentUserId,
        title: decodeURIComponent(title),
      });

      if (result.status === 'paid') {
        await toggleStatusAction({
          user_id: parseInt(userId),
          id: contentUserId,
          title: decodeURIComponent(title),
          status: 1,
        });
        window.location.reload();
        return;
      }

      // Open Midtrans Snap
      // @ts-ignore
      if (typeof window.snap !== 'undefined') {
        // @ts-ignore
        window.snap.pay(result.snap_token, {
          onSuccess: async () => {
            try {
              await toggleStatusAction({
                user_id: parseInt(userId),
                id: contentUserId,
                title: decodeURIComponent(title),
                status: 1,
              });
            } catch (_) {}
            window.location.reload();
          },
          onError: (e: any) => {
            setError('Pembayaran gagal: ' + (e?.message || 'Terjadi kesalahan'));
            setLoading(false);
          },
          onClose: () => {
            setLoading(false);
          },
        });
      } else {
        setError('Sistem pembayaran belum siap. Silakan refresh halaman.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Gagal memproses: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-pink-100">

          {/* Header gradient bar */}
          <div className="h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400" />

          <div className="p-8 text-center">
            {/* Lock icon */}
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Undangan Belum Aktif
            </h1>
            <p className="text-sm text-pink-600 font-medium mb-4 capitalize">
              {displayTitle}
            </p>

            {/* Divider */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-pink-300 to-rose-300 mx-auto mb-5" />

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Masa percobaan undangan ini sudah habis. Aktifkan sekarang untuk membuka undangan dan menikmati semua fitur tanpa batas.
            </p>

            {/* Features */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 mb-6 text-left space-y-2">
              {[
                'Undangan aktif tanpa batas waktu',
                'Tanpa watermark percobaan',
                'Fitur RSVP & amplop digital',
                'Musik & galeri foto',
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            {/* Payment button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-300 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 transition-all duration-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 active:translate-y-0 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses Pembayaran...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Aktifkan Undangan Sekarang
                </span>
              )}
            </button>

            {/* Back link */}
            <a
              href="/"
              className="block mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Kembali ke Beranda
            </a>
          </div>
        </div>

        {/* Papunda branding */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by <span className="font-semibold text-pink-400">Papunda</span>
        </p>
      </div>
    </div>
  );
}
