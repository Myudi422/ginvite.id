'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Undangan Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Undangan Tidak Ditemukan
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            {error.message.includes('404') 
              ? 'Undangan yang Anda cari tidak ditemukan atau mungkin belum dibuat.'
              : 'Terjadi kesalahan saat memuat undangan.'}
          </p>
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
            Error: {error.message}
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={reset}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            Coba Lagi
          </Button>
          
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Jika masalah berlanjut, silakan hubungi tim dukungan kami.
          </p>
        </div>
      </div>
    </div>
  );
}