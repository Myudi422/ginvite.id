// app/panel/blog-admin/create/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import UploadBlogForm from '../UploadBlogForm';

export default function CreateBlogPage() {
  const router = useRouter();

  const handleUploadSuccess = () => {
    router.push('/panel/blog-admin');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Buat Artikel Baru
            </h1>
            <p className="text-xs text-slate-400">Tambahkan artikel blog baru</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <UploadBlogForm onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}
