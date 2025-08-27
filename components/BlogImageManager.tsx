'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ImageIcon, 
  TrashIcon, 
  EyeIcon, 
  StarIcon,
  RefreshCwIcon 
} from 'lucide-react';

interface BlogImage {
  id: number;
  blog_id: number | null;
  filename: string;
  original_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_featured: number;
  is_used: number;
  created_at: string;
}

interface BlogImageManagerProps {
  blogId?: string | number;
  onImageSelect?: (imageUrl: string) => void;
  showControls?: boolean;
}

export default function BlogImageManager({ 
  blogId, 
  onImageSelect, 
  showControls = true 
}: BlogImageManagerProps) {
  const [images, setImages] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = blogId 
        ? `https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=list&blog_id=${blogId}`
        : 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=list';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        setImages(data.data);
      } else {
        setError(data.message || 'Failed to fetch images');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [blogId]);

  const deleteImage = async (imageId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=delete&id=${imageId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchImages();
      } else {
        alert('Gagal menghapus gambar: ' + data.message);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Gagal menghapus gambar');
    }
  };

  const markAsFeatured = async (imageId: number) => {
    if (!blogId) {
      alert('Blog ID is required to mark image as featured');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', imageId.toString());
      formData.append('blog_id', blogId.toString());

      const response = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/blog_images.php?action=mark_featured',
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      
      if (data.status === 'success') {
        fetchImages();
      } else {
        alert('Gagal menandai gambar: ' + data.message);
      }
    } catch (err) {
      console.error('Error marking image as featured:', err);
      alert('Gagal menandai gambar');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-pink-800 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gambar Blog {blogId ? `(Blog #${blogId})` : '(Semua)'}
        </h3>
        <Button
          onClick={fetchImages}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-pink-300 text-pink-600 hover:bg-pink-50"
        >
          <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-pink-600">Memuat gambar...</p>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="h-12 w-12 text-pink-300 mx-auto mb-2" />
          <p className="text-pink-500">Tidak ada gambar yang ditemukan</p>
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border border-pink-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={image.file_url}
                  alt={image.original_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
                {image.is_featured === 1 && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                      <StarIcon className="h-3 w-3" />
                      Featured
                    </div>
                  </div>
                )}
                {image.is_used === 0 && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                      Unused
                    </div>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                  {image.original_name}
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  {formatFileSize(image.file_size)} • {formatDate(image.created_at)}
                </p>

                {/* Action Buttons */}
                {showControls && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(image.file_url, '_blank')}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      <EyeIcon className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    
                    {blogId && (
                      <Button
                        onClick={() => markAsFeatured(image.id)}
                        size="sm"
                        variant={image.is_featured === 1 ? "default" : "outline"}
                        className={`text-xs ${
                          image.is_featured === 1 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                            : 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                        }`}
                      >
                        <StarIcon className="h-3 w-3" />
                      </Button>
                    )}

                    <Button
                      onClick={() => deleteImage(image.id)}
                      size="sm"
                      variant="outline"
                      className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {onImageSelect && (
                  <Button
                    onClick={() => onImageSelect(image.file_url)}
                    size="sm"
                    className="w-full mt-2 text-xs bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Select Image
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
