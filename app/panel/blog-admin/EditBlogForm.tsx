// app/panel/blog-admin/EditBlogForm.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
import RichTextEditor from '@/components/QuillRichTextEditor';

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

export default function EditBlogForm({ blogId, onUpdateSuccess }: EditBlogFormProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('draft');
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(true);
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

  // Function to sync blog images with database
  const syncBlogImages = async (blogId: string | number, content: string) => {
    try {
      const formData = new FormData();
      formData.append('blog_id', blogId.toString());
      formData.append('content', content);

      // Use local API endpoint for development
      const apiUrl = window.location.hostname === 'localhost' 
        ? '/api/page/blog_images.php?action=mark_unused'
        : 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=mark_unused';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status === 'success') {
        console.log('Images synced successfully:', data);
      }
    } catch (error) {
      console.error('Error syncing images:', error);
      // Fail silently for now
    }
  };

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoadingBlog(true);
        const response = await fetch(
          `https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=get&id=${blogId}`
        );
        const data = await response.json();
        
        if (data.status === 'success') {
          const blogData = data.data;
          setBlog(blogData);
          setTitle(blogData.title);
          setSlug(blogData.slug);
          setContent(blogData.content);
          setCategory(blogData.category);
          setStatus(blogData.status);
        } else {
          setMessage('Gagal memuat data blog.');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setMessage('Gagal memuat data blog.');
      } finally {
        setLoadingBlog(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

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
    formData.append('id', blogId);
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
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=update',
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
        // Sync images after successful blog update
        await syncBlogImages(blogId, content);
        
        setMessage('Artikel berhasil diperbarui 🎉');
        
        setTimeout(() => {
          setProgress(0);
          onUpdateSuccess();
        }, 500);
      } else {
        setMessage(`Error: ${data.message || 'Gagal memperbarui artikel.'}`);
      }
    } catch (err) {
      console.error('Error saat memperbarui:', err);
      setMessage('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return (
      <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm mb-8">
        <p className="text-pink-600">Memuat data artikel...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm mb-8">
        <p className="text-red-500">Artikel tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold text-pink-800 mb-4">Edit Artikel</h2>

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
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Tulis konten artikel di sini..."
            height={400}
            blogId={blogId}
          />
          <p className="text-sm text-pink-500 mt-1">
            Anda dapat menyisipkan gambar langsung ke dalam konten dengan cara:
            <br />• Klik tombol gambar di toolbar
            <br />• Seret dan lepas (drag & drop) gambar
            <br />• Copy paste gambar dari clipboard
          </p>
        </div>

        {/* Current Image */}
        {blog.image_url && (
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Gambar Saat Ini
            </label>
            <div className="mb-2">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
            <p className="text-sm text-pink-500">
              Pilih gambar baru jika ingin mengubah gambar artikel.
            </p>
          </div>
        )}

        {/* File Gambar */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            {blog.image_url ? 'Ganti Gambar Artikel' : 'Gambar Artikel'}
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
              Progres Update: {progress}%
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
          {loading ? 'Memperbarui...' : 'Perbarui Artikel'}
        </Button>
      </form>
    </div>
  );
}
