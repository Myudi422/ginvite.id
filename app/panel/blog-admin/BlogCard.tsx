// app/panel/blog-admin/BlogCard.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditIcon, TrashIcon, EyeIcon, CalendarIcon, SparklesIcon } from 'lucide-react';
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

export default function BlogCard({ blog, onDelete }: BlogCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const displayedTitle = blog.title.length > 40 ? `${blog.title.substring(0, 40)}...` : blog.title;
  const displayedContent = blog.content.length > 100 ? `${blog.content.substring(0, 100)}...` : blog.content;
  
  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=delete&id=${blog.id}`,
        {
          method: 'DELETE',
        }
      );
      
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
    }
  };

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/panel/blog-admin/edit/${blog.id}`);
  };

  const handleView = () => {
    // Open blog in new tab (adjust URL as needed)
    window.open(`/blog/${blog.slug}`, '_blank');
  };

  const handleRegenerate = async () => {
    if (!confirm('Apakah Anda yakin ingin regenerate konten artikel ini dengan AI? Konten lama akan diganti.')) {
      return;
    }

    setIsRegenerating(true);
    try {
      // Generate improved content with Gemini
      const blogData = await GeminiAPI.regenerateBlog(blog.title, blog.content);
      
      // Generate new slug if title changed
      const newSlug = blogData.title !== blog.title 
        ? GeminiAPI.generateSlug(blogData.title)
        : blog.slug;
      
      // Update the blog via API
      const updateResponse = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/page/blog_admin.php?action=update&id=${blog.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: blogData.title,
            slug: newSlug,
            content: blogData.content,
            category: blog.category,
            status: blog.status,
            image_url: blog.image_url
          })
        }
      );
      
      const updateResult = await updateResponse.json();
      if (updateResult.status === 'success') {
        alert('Artikel berhasil di-regenerate dengan AI!');
        onDelete(); // Refresh the blog list
      } else {
        throw new Error(updateResult.message || 'Gagal update artikel');
      }
    } catch (error) {
      console.error('Error regenerating blog:', error);
      alert('Gagal regenerate artikel: ' + (error as Error).message);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div
      className="bg-white/30 backdrop-blur-md rounded-2xl p-4 relative
               border border-white/20 shadow-md hover:shadow-lg transition-all
               hover:border-pink-200 group"
    >
      {/* Image */}
      {blog.image_url && (
        <div className="mb-3 w-full h-40 relative rounded-lg overflow-hidden">
          <Image
            src={blog.image_url}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Status Badge */}
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          blog.status === 'published' 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-500 text-white'
        }`}>
          {blog.status === 'published' ? 'Published' : 'Draft'}
        </span>
        
        <span className="px-2 py-1 bg-pink-500 text-white rounded-full text-xs">
          {blog.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-pink-800 mb-2" title={blog.title}>
        {displayedTitle}
      </h3>

      {/* Content Preview */}
      <p className="text-sm text-gray-600 mb-3" title={blog.content}>
        {displayedContent}
      </p>

      {/* Date */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <CalendarIcon className="h-3 w-3 mr-1" />
        {formatDate(blog.created_at)}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleView}
          className="p-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
          title="Lihat artikel"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
          title="Regenerate dengan AI"
        >
          <SparklesIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleEdit}
          className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Edit artikel"
        >
          <EditIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Hapus artikel"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
