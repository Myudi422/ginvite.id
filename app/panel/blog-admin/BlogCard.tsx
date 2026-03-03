// app/panel/blog-admin/BlogCard.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EditIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  SparklesIcon,
  Globe,
  FileText,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { GeminiAPI } from '@/lib/gemini';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BlogCardProps {
  blog: Blog;
  onDelete: () => void;
}

const API_BASE = 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-zA-Z]+;/g, ' ').trim();
}

const CATEGORY_COLORS: Record<string, string> = {
  tutorial: 'bg-blue-100 text-blue-700',
  tips: 'bg-yellow-100 text-yellow-700',
  inspiration: 'bg-purple-100 text-purple-700',
  news: 'bg-red-100 text-red-700',
  wedding: 'bg-pink-100 text-pink-700',
  event: 'bg-green-100 text-green-700',
};

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(blog.status);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const displayedTitle =
    blog.title.length > 55 ? `${blog.title.substring(0, 55)}...` : blog.title;

  const plainContent = stripHtml(blog.content);
  const displayedContent =
    plainContent.length > 120 ? `${plainContent.substring(0, 120)}...` : plainContent;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToggleStatus = async () => {
    setIsTogglingStatus(true);
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const formData = new FormData();
      formData.append('id', blog.id.toString());
      formData.append('status', newStatus);

      const response = await fetch(`${API_BASE}?action=toggle_status`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') {
        setCurrentStatus(newStatus);
      } else {
        alert('Gagal mengubah status artikel');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Gagal mengubah status artikel');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}?action=delete&id=${blog.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'success') {
        onDelete();
      } else {
        alert('Gagal menghapus artikel');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Gagal menghapus artikel');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleEdit = () => router.push(`/panel/blog-admin/edit/${blog.id}`);
  const handleView = () => window.open(`/blog/${blog.slug}`, '_blank');

  const handleRegenerate = async () => {
    if (
      !confirm(
        'Apakah Anda yakin ingin regenerate konten artikel ini dengan AI? Konten lama akan diganti.'
      )
    )
      return;

    setIsRegenerating(true);
    try {
      const blogData = await GeminiAPI.regenerateBlog(blog.title, blog.content);
      const newSlug =
        blogData.title !== blog.title
          ? GeminiAPI.generateSlug(blogData.title)
          : blog.slug;

      const formData = new FormData();
      formData.append('id', blog.id.toString());
      formData.append('title', blogData.title);
      formData.append('slug', newSlug);
      formData.append('content', blogData.content);
      formData.append('category', blog.category || 'General');
      formData.append('status', blog.status || 'draft');

      const updateResponse = await fetch(`${API_BASE}?action=update`, {
        method: 'POST',
        body: formData,
      });
      const updateResult = await updateResponse.json();
      if (updateResult.status === 'success') {
        alert('Artikel berhasil di-regenerate dengan AI!');
        onDelete();
      } else {
        throw new Error(updateResult.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error regenerating blog:', error);
      if (error instanceof Error) {
        alert('Gagal regenerate artikel: ' + error.message);
      } else {
        alert('Gagal regenerate artikel: Error tidak dikenal');
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const catColor = CATEGORY_COLORS[blog.category] || 'bg-gray-100 text-gray-600';
  const isPublished = currentStatus === 'published';

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl
                   transition-all duration-300 border border-slate-100 hover:border-pink-200
                   flex flex-col"
      >
        {/* Thumbnail */}
        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden flex-shrink-0">
          {blog.image_url ? (
            <Image
              src={blog.image_url}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-pink-200" />
            </div>
          )}

          {/* Status Overlay Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md
                ${isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}
            >
              {isPublished ? (
                <Globe className="w-3 h-3" />
              ) : (
                <FileText className="w-3 h-3" />
              )}
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${catColor}`}>
              {blog.category}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          {/* Date */}
          <div className="flex items-center text-xs text-slate-400 mb-2 gap-1">
            <CalendarIcon className="h-3 w-3" />
            {formatDate(blog.created_at)}
          </div>

          {/* Title */}
          <h3
            className="text-sm font-bold text-slate-800 mb-2 leading-snug group-hover:text-pink-600 transition-colors"
            title={blog.title}
          >
            {displayedTitle}
          </h3>

          {/* Content Preview */}
          <p className="text-xs text-slate-500 flex-1 leading-relaxed mb-4">
            {displayedContent || 'Tidak ada preview konten.'}
          </p>

          {/* Divider */}
          <div className="border-t border-slate-100 pt-3">
            {/* Toggle Status */}
            <button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className={`w-full mb-2 flex items-center justify-center gap-2 py-1.5 rounded-xl text-xs font-semibold
                transition-all duration-200 border
                ${isPublished
                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                }
                disabled:opacity-50`}
            >
              {isTogglingStatus ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : isPublished ? (
                <ToggleRight className="h-3.5 w-3.5" />
              ) : (
                <ToggleLeft className="h-3.5 w-3.5" />
              )}
              {isTogglingStatus
                ? 'Memproses...'
                : isPublished
                  ? 'Unpublish'
                  : 'Publish Sekarang'}
            </button>

            {/* Action Buttons Row */}
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <button
                  onClick={handleView}
                  className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                  title="Lihat artikel"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Regenerate dengan AI"
                >
                  {isRegenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={handleEdit}
                  className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit artikel"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  disabled={isDeleting}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Hapus artikel"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <TrashIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Hapus Artikel?</h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak bisa dibatalkan.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-5 bg-slate-50 rounded-lg p-3">
              "{displayedTitle}"
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
