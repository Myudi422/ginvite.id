// app/panel/blog-admin/edit/[id]/page.tsx
'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, Eye } from 'lucide-react';
import EditBlogForm from '../../EditBlogForm';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const handleUpdateSuccess = () => {
    router.push('/panel/blog-admin');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Edit Artikel
              </h1>
              <p className="text-xs text-slate-400">ID #{blogId}</p>
            </div>
          </div>

          <button
            onClick={() => window.open(`/blog/`, '_blank')}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-pink-500 bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-200 px-4 py-2 rounded-xl transition-all"
          >
            <Eye className="w-4 h-4" />
            Lihat Blog
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <EditBlogForm blogId={blogId} onUpdateSuccess={handleUpdateSuccess} />
      </div>
    </div>
  );
}
