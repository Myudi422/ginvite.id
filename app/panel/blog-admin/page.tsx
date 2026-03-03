// app/panel/blog-admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  Search,
  FileText,
  Globe,
  LayoutGrid,
  List,
  RefreshCw,
} from 'lucide-react';
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

const API_BASE = 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php';

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBlogs = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?action=list`);
      const data = await res.json();
      if (data.status === 'success') {
        setBlogs(data.data);
      } else {
        setError('Gagal memuat daftar blog.');
      }
    } catch {
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = Array.from(new Set(blogs.map((b) => b.category))).sort();

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === '' || b.category === filterCategory;
    const matchesStatus = filterStatus === '' || b.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPublished = blogs.filter((b) => b.status === 'published').length;
  const totalDraft = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── TOP HEADER BAR ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Blog Manager
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {blogs.length} total artikel
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => fetchBlogs(true)}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <AutoGenerateBlog onBlogGenerated={() => fetchBlogs(true)} />
            <BulkGenerateBlog onBlogsGenerated={() => fetchBlogs(true)} />
            <Button
              onClick={() => router.push('/panel/blog-admin/create')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-md hover:shadow-pink-200 transition-all text-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Artikel Baru
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Artikel"
            value={blogs.length}
            icon={<FileText className="w-5 h-5" />}
            color="bg-gradient-to-br from-slate-600 to-slate-800"
          />
          <StatCard
            label="Published"
            value={totalPublished}
            icon={<Globe className="w-5 h-5" />}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            label="Draft"
            value={totalDraft}
            icon={<FileText className="w-5 h-5" />}
            color="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <StatCard
            label="Kategori"
            value={categories.length}
            icon={<LayoutGrid className="w-5 h-5" />}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
          />
        </div>

        {/* ── AI STATS ── */}
        <AIStats blogs={blogs} />

        {/* ── FILTER & SEARCH ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari artikel berdasarkan judul..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300
                           text-slate-700 text-sm placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm
                         focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                    ? 'bg-white text-pink-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                    ? 'bg-white text-pink-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filters summary */}
          {(searchText || filterCategory || filterStatus) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">
                Menampilkan {filteredBlogs.length} dari {blogs.length} artikel
              </span>
              {(searchText || filterCategory || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchText('');
                    setFilterCategory('');
                    setFilterStatus('');
                  }}
                  className="text-xs text-pink-500 hover:text-pink-600 underline"
                >
                  Reset filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── BLOG LIST ── */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => fetchBlogs()}
                className="mt-4 text-sm text-red-500 underline"
              >
                Coba lagi
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">
                {blogs.length === 0
                  ? 'Belum ada artikel. Buat artikel pertamamu!'
                  : 'Tidak ada artikel yang sesuai pencarian.'}
              </p>
              {blogs.length === 0 && (
                <Button
                  onClick={() => router.push('/panel/blog-admin/create')}
                  className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Buat Artikel Pertama
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onDelete={() => fetchBlogs(true)} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBlogs.map((blog) => (
                <BlogListItem key={blog.id} blog={blog} onDelete={() => fetchBlogs(true)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function BlogListItem({ blog, onDelete }: { blog: Blog; onDelete: () => void }) {
  const router = useRouter();
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(blog.status);

  const plainText = blog.content.replace(/<[^>]*>/g, '').trim();
  const excerpt = plainText.length > 100 ? `${plainText.substring(0, 100)}...` : plainText;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

  const handleToggle = async () => {
    setIsTogglingStatus(true);
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const formData = new FormData();
      formData.append('id', blog.id.toString());
      formData.append('status', newStatus);
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=toggle_status',
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.status === 'success') setCurrentStatus(newStatus);
    } catch {
      //
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:border-pink-200 transition-all group">
      {/* Thumbnail */}
      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
        {blog.image_url ? (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-200" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentStatus === 'published'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
              }`}
          >
            {currentStatus === 'published' ? 'Published' : 'Draft'}
          </span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {blog.category}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-slate-800 truncate">{blog.title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{excerpt}</p>
      </div>

      {/* Date */}
      <div className="text-xs text-slate-400 hidden md:block flex-shrink-0">
        {formatDate(blog.created_at)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleToggle}
          disabled={isTogglingStatus}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
            ${currentStatus === 'published'
              ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            } disabled:opacity-50`}
        >
          {isTogglingStatus ? '...' : currentStatus === 'published' ? 'Unpublish' : 'Publish'}
        </button>
        <button
          onClick={() => router.push(`/panel/blog-admin/edit/${blog.id}`)}
          className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          ✏️
        </button>
        <button
          onClick={async () => {
            if (!confirm('Hapus artikel ini?')) return;
            await fetch(
              `https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=delete&id=${blog.id}`,
              { method: 'DELETE' }
            );
            onDelete();
          }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="w-full aspect-[16/9] bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-8 bg-slate-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}
