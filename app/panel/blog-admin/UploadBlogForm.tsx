// app/panel/blog-admin/UploadBlogForm.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadBlogFormProps {
  onUploadSuccess: () => void;
}

export default function UploadBlogForm({ onUploadSuccess }: UploadBlogFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('draft');
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const titleValue = e.target.value;
    setTitle(titleValue);
    // Auto-generate slug from title
    if (titleValue) {
      setSlug(generateSlug(titleValue));
    } else {
      setSlug('');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileImage(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !slug.trim() || !content.trim() || !category) {
      setMessage('Judul, slug, konten, dan kategori wajib diisi.');
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('status', status);
    if (fileImage) {
      formData.append('image', fileImage);
    }

    try {
      const response = await axios.post(
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=create',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (ev) => {
            if (ev.total) {
              const percent = Math.round((ev.loaded * 100) / ev.total);
              setProgress(percent);
            }
          },
        }
      );

      console.log('Response dari PHP:', response.data);

      const data = response.data;
      if (data.status === 'success') {
        setMessage('Artikel berhasil disimpan 🎉');
        setTitle('');
        setSlug('');
        setContent('');
        setCategory(undefined);
        setStatus('draft');
        setFileImage(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => {
          setProgress(0);
          onUploadSuccess();
        }, 500);
      } else {
        setMessage(`Error: ${data.message || 'Gagal menyimpan artikel.'}`);
      }
    } catch (err) {
      console.error('Error saat menyimpan:', err);
      setMessage('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold text-pink-800 mb-4">Buat Artikel Baru</h2>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-white ${
          message.includes('berhasil') ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Judul Artikel <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Masukkan judul artikel"
            className="w-full"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-akan-dibuat-otomatis"
            className="w-full"
            required
          />
          <p className="text-sm text-pink-500 mt-1">
            Slug akan dibuat otomatis dari judul, tetapi Anda bisa mengeditnya.
          </p>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setCategory(value)}
            value={category}
            defaultValue=""
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kategori…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="tips">Tips & Trik</SelectItem>
              <SelectItem value="inspiration">Inspirasi</SelectItem>
              <SelectItem value="news">Berita</SelectItem>
              <SelectItem value="wedding">Pernikahan</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Status
          </label>
          <Select
            onValueChange={(value) => setStatus(value)}
            value={status}
            defaultValue="draft"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Konten Artikel */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Konten Artikel <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis konten artikel di sini..."
            className="w-full min-h-[200px]"
            required
          />
        </div>

        {/* File Gambar */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Gambar Artikel
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
          />
          <p className="text-sm text-pink-500 mt-1">
            Format yang didukung: JPG, PNG, GIF. Maksimal 5MB.
          </p>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Progres Upload: {progress}%
            </label>
            <Progress value={progress} className="h-2 rounded-xl" />
          </div>
        )}

        {/* Tombol Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white"
        >
          {loading ? 'Menyimpan...' : 'Simpan Artikel'}
        </Button>
      </form>
    </div>
  );
}
