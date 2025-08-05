// app/panel/blog-admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCard from './BlogCard';
import AutoGenerateBlog from './AutoGenerateBlog';
import BulkGenerateBlog from './BulkGenerateBlog';
import AIStats from './AIStats';

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

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=list'
      );
      const data = await res.json();
      if (data.status === 'success') {
        setBlogs(data.data);
      } else {
        setError('Gagal memuat daftar blog.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Ambil daftar kategori unik dari data
  const categories = Array.from(new Set(blogs.map((b) => b.category))).sort();

  // Filter berdasarkan searchText, filterCategory & filterStatus
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === '' || b.category === filterCategory;
    const matchesStatus =
      filterStatus === '' || b.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateNew = () => {
    router.push('/panel/blog-admin/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 
                       bg-clip-text text-transparent mb-2"
          >
            Kelola Blog
          </h1>
          <p className="text-sm text-pink-600">
            Kelola artikel blog dengan mudah dan efisien
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <AutoGenerateBlog onBlogGenerated={fetchBlogs} />
          <BulkGenerateBlog onBlogsGenerated={fetchBlogs} />
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600 px-6 py-2 rounded-xl flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Buat Artikel Baru
          </Button>
        </div>
      </div>

      {/* AI STATS */}
      <AIStats blogs={blogs} />

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari judul blog..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-pink-200
                     focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                     placeholder:text-pink-400 text-pink-600 shadow-sm"
        />

        {/* Kategori Dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-pink-200
                     focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                     text-pink-600 shadow-sm"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-pink-200
                     focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                     text-pink-600 shadow-sm"
        >
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* DAFTAR BLOG */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-pink-800 mb-3">Daftar Artikel</h2>
        {loading && <p className="text-pink-600">Memuat daftar blog...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && filteredBlogs.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-pink-500 text-lg">
              Tidak ada artikel yang sesuai pencarian.
            </p>
          </div>
        )}

        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} onDelete={fetchBlogs} />
        ))}
      </div>
    </div>
  );
}
