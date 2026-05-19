// components/builder/ui/ImagePicker.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  Upload,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Search,
  ChevronRight,
  X,
  Folder,
  RefreshCw,
  Check,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { uploadImageToBackblaze, deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { useBuilder } from '../BuilderContext';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper fetch with timeout & auto retry (reconnection)
const fetchWithRetry = async (
  url: string | URL,
  options: RequestInit = {},
  maxRetries = 3,
  delayMs = 1000
): Promise<Response> => {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout per attempt

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err;
      console.warn(`[ImagePicker API] Attempt ${attempt} failed: ${err.message || err}. Retrying...`);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt)); // incremental delay (1s, 2s, 3s...)
      }
    }
  }
  throw lastError || new Error("Failed after max retries");
};

interface FileItem {
  type: 'file';
  name: string;
  key: string;
  size: number;
  lastModified: string;
  url: string;
}

interface FolderItem {
  type: 'folder';
  name: string;
  path: string;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string, isNewUpload?: boolean) => void;
  label?: string;
  placeholder?: string;
}

export default function ImagePicker({
  value,
  onChange,
  label = 'Foto Background',
  placeholder = 'https://...'
}: ImagePickerProps) {
  const { state } = useBuilder();
  const userId = state.page?.user_id;
  const invitationId = state.page?.id || Math.floor(Math.random() * 100000) + 1;

  const [uploadedInSession, setUploadedInSession] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'upload' | 'filemanager'>('upload');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [recentImages, setRecentImages] = useState<FileItem[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [recentError, setRecentError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to change URL and reset uploaded session status
  const handleUrlChange = (url: string) => {
    onChange(url, false);
    setUploadedInSession(false);
  };

  // Determine active tab automatically on mount if there's an initial value
  useEffect(() => {
    if (value) {
      if (value.includes('backblaze') || value.includes('s3') || value.includes('ccgnimex.my.id')) {
        setActiveTab('upload');
      } else {
        setActiveTab('link');
      }
    }
  }, []);

  // Fetch recent images for File Manager tab
  useEffect(() => {
    if (activeTab === 'filemanager') {
      fetchRecentImages();
    }
  }, [activeTab]);

  const fetchRecentImages = async () => {
    setLoadingRecent(true);
    setRecentError(null);
    try {
      const res = await fetchWithRetry("https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_list.php?prefix=background/");
      const data = await res.json();
      if (data.success && data.files) {
        // Filter only images and sort by last modified descending
        const imagesOnly = (data.files as FileItem[]).filter(f =>
          /\.(jpg|jpeg|png|gif|svg|webp|bmp)$/i.test(f.name)
        );
        const sorted = imagesOnly.sort((a, b) =>
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );
        setRecentImages(sorted.slice(0, 6)); // take top 6
      } else {
        throw new Error(data.message || "Gagal memproses data");
      }
    } catch (err: any) {
      console.error("Gagal memuat gambar terbaru:", err);
      setRecentError("Gagal memuat");
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) {
      alert("Error: Missing userId in builder context.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const url = await uploadImageToBackblaze(formData, userId, invitationId);

      // Hapus gambar lama jika ada dan berasal dari server kita (biar hemat storage)
      if (value && (value.includes('backblaze') || value.includes('s3') || value.includes('ccgnimex'))) {
        try {
          await deleteImageFromBackblaze(value);
        } catch (delErr) {
          console.warn("Gagal menghapus gambar lama saat me-replace:", delErr);
        }
      }

      onChange(url, true);
      setUploadedInSession(true);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    // Check if it's a Backblaze/S3/ccgnimex URL and was newly uploaded in this session.
    // If it was chosen from the File Manager or pasted, just clear it.
    const isNewUpload = uploadedInSession;
    if (!isNewUpload || (!value.includes('backblaze') && !value.includes('s3') && !value.includes('ccgnimex'))) {
      handleUrlChange('');
      return;
    }

    if (!window.confirm('Hapus gambar ini dari server penyimpanan?')) return;

    setDeleting(true);
    try {
      await deleteImageFromBackblaze(value);
      handleUrlChange('');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus gambar');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Premium Tabs */}
      <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[10px] font-bold leading-tight transition-all select-none focus:outline-none ${activeTab === 'link'
            ? 'bg-white text-pink-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          <Link2 className="w-4 h-4 flex-shrink-0" />
          <span>By Link</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[10px] font-bold leading-tight transition-all select-none focus:outline-none ${activeTab === 'upload'
            ? 'bg-white text-pink-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          <Upload className="w-4 h-4 flex-shrink-0" />
          <span>Upload Baru</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('filemanager')}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[10px] font-bold leading-tight transition-all select-none focus:outline-none ${activeTab === 'filemanager'
            ? 'bg-white text-pink-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
          <span>File Manager</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3">
        {/* Tab 1: BY LINK */}
        {activeTab === 'link' && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={e => handleUrlChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 pr-10 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
              />
              {value && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 rounded-lg disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {value ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 flex items-center justify-center">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-pink-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-1.5 bg-white rounded-lg text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
                <ImageIcon className="w-8 h-8 text-gray-300 mb-1.5" />
                <p className="text-xs text-center font-medium">Masukkan URL foto atau gunakan tab Unggah/File Manager</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: UPLOAD BARU */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            {value ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 flex items-center justify-center">
                <img
                  src={value}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {uploadedInSession ? (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={uploading || deleting}
                      className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all disabled:opacity-50 flex items-center justify-center"
                      title="Hapus gambar dari Server Penyimpanan"
                    >
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUrlChange('')}
                      className="p-2 bg-white rounded-xl text-amber-500 hover:bg-amber-50 hover:text-amber-700 transition-all flex items-center justify-center"
                      title="Lepas Gambar (Tidak Menghapus dari Server)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:bg-pink-50/30 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : 'border-gray-200 hover:border-pink-300'
                    }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin text-pink-500 mb-2" />
                      <p className="text-xs text-gray-500 font-medium animate-pulse">Mengunggah ke server...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-pink-500 mb-2 transition-colors" />
                      <p className="text-xs text-gray-600 font-bold group-hover:text-pink-600">Klik untuk Unggah Foto Baru</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Format JPG, PNG, WEBP max 5MB</p>
                    </>
                  )}
                </div>
              </div>
            )}
            {deleting && (
              <span className="text-[10px] text-pink-500 font-medium animate-pulse block text-center">
                Menghapus foto dari server...
              </span>
            )}
          </div>
        )}

        {/* Tab 3: FILE MANAGER */}
        {activeTab === 'filemanager' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 hover:border-pink-300 rounded-xl font-bold text-xs text-gray-700 hover:text-pink-600 shadow-sm transition-all hover:shadow-md"
            >
              <FolderOpen className="w-4 h-4 text-pink-500" />
              Pilih dari File Manager
            </button>

            {/* Quick Select / Recent Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Gambar Baru Diunggah</p>
                {recentError && (
                  <button
                    type="button"
                    onClick={fetchRecentImages}
                    className="text-[9px] font-bold text-pink-500 hover:text-pink-600 flex items-center gap-0.5"
                    title="Coba muat ulang"
                  >
                    <RefreshCw className="w-2.5 h-2.5 animate-spin-once" />
                    Coba Lagi
                  </button>
                )}
              </div>
              {loadingRecent ? (
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-square bg-white border border-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentError ? (
                <p className="text-[10px] text-gray-400 italic">Koneksi terputus. Silakan klik Coba Lagi.</p>
              ) : recentImages.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic">Belum ada gambar tersimpan di File Manager.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {recentImages.map((file) => {
                    const isSelected = value === file.url;
                    return (
                      <button
                        key={file.key}
                        type="button"
                        onClick={() => handleUrlChange(file.url)}
                        className={`group relative aspect-square rounded-lg overflow-hidden border bg-white flex items-center justify-center transition-all ${isSelected
                          ? 'border-pink-500 ring-2 ring-pink-200'
                          : 'border-gray-200 hover:border-pink-300'
                          }`}
                        title={file.name}
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-pink-500 text-white rounded-md p-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white py-0.5 px-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Display Selected Status */}
            {value && (
              <div className="flex items-center gap-2 p-2 bg-pink-50/50 border border-pink-100 rounded-xl mt-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-pink-200 flex-shrink-0">
                  <img src={value} alt="Selected" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-pink-700 truncate">Gambar Terpilih</p>
                  <p className="text-[8px] text-gray-500 truncate">{value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUrlChange('')}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* File Manager Modal */}
      {isModalOpen && (
        <FileManagerModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(url) => {
            handleUrlChange(url);
            setIsModalOpen(false);
          }}
          selectedValue={value}
        />
      )}
    </div>
  );
}

/* ── FILE MANAGER MODAL COMPONENT ── */
interface FileManagerModalProps {
  onClose: () => void;
  onSelect: (url: string) => void;
  selectedValue: string;
}

function FileManagerModal({ onClose, onSelect, selectedValue }: FileManagerModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentPrefix, setCurrentPrefix] = useState("background/");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<string>(selectedValue);

  useEffect(() => {
    fetchFiles(currentPrefix);
  }, [currentPrefix]);

  const fetchFiles = async (prefix: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_list.php");
      if (prefix) url.searchParams.append("prefix", prefix);

      const res = await fetchWithRetry(url.toString());
      const data = await res.json();
      if (data.success) {
        setFiles(data.files || []);
        setFolders(data.folders || []);
      } else {
        throw new Error(data.message || "Gagal memproses data");
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal menghubungi server penyimpanan. Koneksi lambat atau server sedang sibuk.");
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (name: string) => name.split('.').pop()?.toLowerCase() || '';
  const isImage = (name: string) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(getFileExtension(name));
  };

  const navigateToFolder = (path: string) => {
    setCurrentPrefix(path);
  };

  const navigateUp = () => {
    if (currentPrefix === "background/") return;
    const parts = currentPrefix.split('/').filter(Boolean);
    parts.pop();
    const newPrefix = parts.length > 0 ? parts.join('/') + '/' : 'background/';
    if (!newPrefix.startsWith("background/")) {
      setCurrentPrefix("background/");
    } else {
      setCurrentPrefix(newPrefix);
    }
  };

  // Breadcrumbs builder
  const breadcrumbs = [];
  let pathBuilder = "background/";
  const parts = currentPrefix.replace(/^background\//, '').split('/').filter(Boolean);
  for (const part of parts) {
    pathBuilder += part + '/';
    breadcrumbs.push({ name: part, path: pathBuilder });
  }

  // Filter Folders and Files (Limit to Image files for picker!)
  const filteredFolders = folders.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isImg = isImage(f.name);
    return matchesSearch && isImg; // Only show images!
  });

  // Sort files by date descending
  const sortedFiles = [...filteredFiles].sort((a, b) =>
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-purple-50/30">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-pink-500" />
              File Manager
            </h3>
            <p className="text-xs text-gray-500">Pilih foto dari penyimpanan</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Search Toolbar */}
        <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

          {/* Breadcrumbs */}
          <div className="flex items-center text-xs font-semibold text-gray-600 overflow-x-auto whitespace-nowrap py-1">
            <button
              onClick={() => navigateToFolder('background/')}
              className="hover:text-pink-600 transition-colors flex items-center text-pink-500"
            >
              <Folder className="w-3.5 h-3.5 mr-1 text-pink-400" /> Background
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-gray-400 flex-shrink-0" />
                <button
                  onClick={() => navigateToFolder(crumb.path)}
                  className="hover:text-pink-600 transition-colors flex-shrink-0"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center px-3 bg-white border border-gray-200 rounded-xl w-full sm:w-64 focus-within:ring-2 focus-within:ring-pink-200 focus-within:border-pink-300 transition-all shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Cari foto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs py-2 w-full text-gray-700 outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 bg-white min-h-[300px]">
          {loading ? (
            <div className="space-y-4">
              {/* Folder list rows skeleton */}
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-2xl animate-pulse h-[66px]" />
                ))}
              </div>
              {/* Divider skeleton */}
              <div className="h-[1px] bg-gray-100 w-full" />
              {/* Photo grid skeleton */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center px-4">
              <RefreshCw className="w-12 h-12 mb-3 text-pink-400 animate-spin-once" />
              <p className="text-sm font-bold text-gray-700">Gagal Menghubungkan</p>
              <p className="text-xs text-gray-400 max-w-sm mt-1 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => fetchFiles(currentPrefix)}
                className="flex items-center gap-1.5 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Coba Hubungkan Kembali
              </button>
            </div>
          ) : (filteredFolders.length === 0 && sortedFiles.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Folder className="w-16 h-16 mb-3 text-gray-200" />
              <p className="text-sm font-medium">Folder ini tidak memiliki file gambar.</p>
              {currentPrefix !== "background/" && (
                <button
                  onClick={navigateUp}
                  className="text-pink-500 hover:text-pink-600 font-bold text-xs mt-2 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">

              {/* Render Back Button & Folders in List Format */}
              {(currentPrefix !== "background/" || filteredFolders.length > 0) && (
                <div className="space-y-2">
                  {/* Back Folder Button if nested */}
                  {currentPrefix !== "background/" && (
                    <div
                      onClick={navigateUp}
                      className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-pink-50/20 rounded-2xl border border-dashed border-gray-200 hover:border-pink-300 cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-pink-100/50 transition-colors flex-shrink-0">
                        <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-pink-500 group-hover:-translate-x-0.5 transition-transform" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-600 group-hover:text-pink-600">.. (Kembali ke folder sebelumnya)</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">Naik satu tingkat direktori</p>
                      </div>
                    </div>
                  )}

                  {/* Render Folders as list items */}
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.path}
                      onClick={() => navigateToFolder(folder.path)}
                      className="flex items-center justify-between p-3 bg-white hover:bg-gray-50/60 border border-gray-100 hover:border-pink-200 rounded-2xl cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100/50 transition-colors flex-shrink-0">
                          <Folder className="w-6 h-6 text-amber-400 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate" title={folder.name}>
                            {folder.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Folder Direktori</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-transform mr-1 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* Render Photos in IG-Feed-style Grid Format */}
              {sortedFiles.length > 0 && (
                <div>
                  {/* Label/Header section for photos only if folders were present */}
                  {(currentPrefix !== "background/" || filteredFolders.length > 0) && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-[1px] flex-1 bg-gray-100" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2">Galeri Foto</span>
                      <div className="h-[1px] flex-1 bg-gray-100" />
                    </div>
                  )}

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {sortedFiles.map((file) => {
                      const isSelected = tempSelected === file.url;
                      return (
                        <div
                          key={file.key}
                          onClick={() => setTempSelected(file.url)}
                          onDoubleClick={() => {
                            onSelect(file.url);
                          }}
                          className={`bg-gray-50 rounded-lg border overflow-hidden cursor-pointer group hover:shadow-md transition-all flex flex-col aspect-square relative ${isSelected
                            ? 'border-pink-500 ring-2 ring-pink-100 scale-[0.98]'
                            : 'border-gray-100 hover:border-pink-300'
                            }`}
                          title={file.name}
                        >
                          <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gray-100">
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />

                            {/* Selected Overlay */}
                            {isSelected && (
                              <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-pink-500 text-white rounded-lg p-1 shadow-lg animate-in zoom-in-50 duration-150">
                                  <Check className="w-5 h-5" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:flex-1 text-center sm:text-left min-w-0">
            {tempSelected ? (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-pink-200 flex-shrink-0">
                  <img src={tempSelected} alt="Selected Thumbnail" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-pink-600 truncate">Terpilih</p>
                  <p className="text-[10px] text-gray-500 truncate max-w-[280px]" title={tempSelected}>{tempSelected}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">Klik foto, untuk memilih</p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => tempSelected && onSelect(tempSelected)}
              disabled={!tempSelected}
              className="flex-1 sm:flex-none px-5 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Pilih
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
