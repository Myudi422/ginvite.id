// app/panel/blog-admin/EditBlogForm.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import RichTextEditor from '@/components/QuillRichTextEditor';
import {
  ImagePlus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
} from 'lucide-react';

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

interface EditBlogFormProps {
  blogId: string;
  onUpdateSuccess: () => void;
}

const API_BASE = 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php';

const CATEGORIES = [
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'tips', label: 'Tips & Trik' },
  { value: 'inspiration', label: 'Inspirasi' },
  { value: 'news', label: 'Berita' },
  { value: 'wedding', label: 'Pernikahan' },
  { value: 'event', label: 'Event' },
];

export default function EditBlogForm({ blogId, onUpdateSuccess }: EditBlogFormProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('draft');
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim();

  const syncBlogImages = async (id: string | number, c: string) => {
    try {
      const formData = new FormData();
      formData.append('blog_id', id.toString());
      formData.append('content', c);
      const apiUrl =
        window.location.hostname === 'localhost'
          ? '/api/page/blog_images.php?action=mark_unused'
          : 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=mark_unused';
      await fetch(apiUrl, { method: 'POST', body: formData });
    } catch {
      // fail silently
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoadingBlog(true);
        const response = await fetch(`${API_BASE}?action=get&id=${blogId}`);
        const data = await response.json();
        if (data.status === 'success') {
          const d = data.data;
          setBlog(d);
          setTitle(d.title);
          setSlug(d.slug);
          setContent(d.content);
          setCategory(d.category);
          setStatus(d.status);
        } else {
          setMessage({ type: 'error', text: 'Gagal memuat data blog.' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Gagal memuat data blog.' });
      } finally {
        setLoadingBlog(false);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File harus berupa gambar (JPG, PNG, GIF).' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 5MB.' });
      return;
    }
    setFileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !slug.trim() || !content.trim() || !category) {
      setMessage({ type: 'error', text: 'Judul, slug, konten, dan kategori wajib diisi.' });
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('id', blogId);
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('status', status);
    if (fileImage) formData.append('image', fileImage);

    try {
      const response = await axios.post(`${API_BASE}?action=update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => {
          if (ev.total) {
            setProgress(Math.round((ev.loaded * 100) / ev.total));
          }
        },
      });

      const data = response.data;
      if (data.status === 'success') {
        await syncBlogImages(blogId, content);
        setMessage({ type: 'success', text: 'Artikel berhasil diperbarui! 🎉' });
        setTimeout(() => {
          setProgress(0);
          onUpdateSuccess();
        }, 800);
      } else {
        setMessage({ type: 'error', text: `Error: ${data.message || 'Gagal memperbarui artikel.'}` });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menghubungi server.' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-pink-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium">Memuat data artikel...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 font-medium">Artikel tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Alert Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm
            ${message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
            }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN (main content) ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Card: Informasi Dasar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="text-base font-bold text-slate-700 border-b border-slate-100 pb-3">
                Informasi Artikel
              </h2>

              {/* Judul */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="Masukkan judul artikel yang menarik..."
                  className="w-full text-slate-800 border-slate-200 focus:border-pink-400 focus:ring-pink-300"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Slug URL <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 whitespace-nowrap">
                    /blog/
                  </span>
                  <Input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-artikel-anda"
                    className="flex-1 text-slate-800 border-slate-200 focus:border-pink-400 focus:ring-pink-300 font-mono text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSlug(generateSlug(title))}
                    className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                    title="Generate ulang dari judul"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  URL publik: papunda.com/blog/{slug || '...'}
                </p>
              </div>
            </div>

            {/* Card: Konten */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-700 border-b border-slate-100 pb-3 mb-4">
                Konten Artikel <span className="text-red-500">*</span>
              </h2>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Tulis konten artikel di sini..."
                height={480}
                blogId={blogId}
              />
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                  <ImagePlus className="w-3.5 h-3.5 text-pink-400" />
                  Klik ikon gambar di toolbar
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                  <span>🖱️</span> Drag & drop gambar
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-2">
                  <span>📋</span> Paste dari clipboard
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (settings) ── */}
          <div className="space-y-5">
            {/* Card: Publikasi */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-700 border-b border-slate-100 pb-3">
                Pengaturan Publikasi
              </h2>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                <Select onValueChange={(v) => setStatus(v)} value={status}>
                  <SelectTrigger className="w-full border-slate-200">
                    <SelectValue placeholder="Pilih status…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        Draft
                      </span>
                    </SelectItem>
                    <SelectItem value="published">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Published
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(v) => setCategory(v)} value={category}>
                  <SelectTrigger className="w-full border-slate-200">
                    <SelectValue placeholder="Pilih kategori…" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Progress Bar */}
              {loading && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Menyimpan perubahan...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 rounded-full" />
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-pink-200 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>

            {/* Card: Gambar Artikel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-700 border-b border-slate-100 pb-3">
                Gambar Artikel
              </h2>

              {/* Current Image Preview */}
              {(previewUrl || blog.image_url) && (
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    {previewUrl ? 'Preview Gambar Baru' : 'Gambar Saat Ini'}
                  </label>
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-50">
                    <img
                      src={previewUrl || blog.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {previewUrl && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Baru
                        </span>
                      </div>
                    )}
                  </div>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFileImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Batalkan perubahan gambar
                    </button>
                  )}
                </div>
              )}

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                  ${isDragging
                    ? 'border-pink-400 bg-pink-50'
                    : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
              >
                <ImagePlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-500">
                  {blog.image_url ? 'Ganti gambar' : 'Upload gambar'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Drag & drop atau klik untuk pilih
                </p>
                <p className="text-xs text-slate-300 mt-1">JPG, PNG, GIF · Maks 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
