'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadThemeFormProps {
  onUploadSuccess: () => void;
}

export default function UploadThemeForm({ onUploadSuccess }: UploadThemeFormProps) {
  // ------------------------
  // State untuk teks, kategori, & color picker
  // ------------------------
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('1');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [accentColor, setAccentColor] = useState<string>('#ff00ff');

  // ------------------------
  // State untuk setiap file input
  // ------------------------
  const [imageThemeFile, setImageThemeFile] = useState<File | null>(null);

  // Untuk pilihan satu background tunggal
  const [useSingleBg, setUseSingleBg] = useState(false);
  const [singleBgFile, setSingleBgFile] = useState<File | null>(null);

  // Jika tidak menggunakan singleBg, pakai tiga field terpisah
  const [defaultBgFile, setDefaultBgFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [defaultBg1File, setDefaultBg1File] = useState<File | null>(null);

  const [decorTLFile, setDecorTLFile] = useState<File | null>(null);
  const [decorTRFile, setDecorTRFile] = useState<File | null>(null);
  const [decorBLFile, setDecorBLFile] = useState<File | null>(null);
  const [decorBRFile, setDecorBRFile] = useState<File | null>(null);

  // ------------------------
  // State untuk loading & progress & pesan
  // ------------------------
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  // ------------------------
  // Handler perubahan file
  // ------------------------
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    } else {
      setter(null);
    }
  };

  // ------------------------
  // Handle form submit (upload)
  // ------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validasi wajib: name, category, color, image_theme, dan background(s)
    if (
      !name.trim() ||
      !category ||
      !textColor.trim() ||
      !accentColor.trim() ||
      !imageThemeFile ||
      (useSingleBg
        ? !singleBgFile
        : (!defaultBgFile || !backgroundFile || !defaultBg1File))
    ) {
      setMessage('Nama theme, kategori, warna, dan file image_theme/background harus diisi.');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('text_color', textColor);
      formData.append('accent_color', accentColor);

      formData.append('image_theme', imageThemeFile);

      if (useSingleBg && singleBgFile) {
        // Jika menggunakan satu background untuk semua
        formData.append('default_bg_image', singleBgFile);
        formData.append('background', singleBgFile);
        formData.append('default_bg_image1', singleBgFile);
      } else {
        // Pakai tiga input terpisah
        if (defaultBgFile) formData.append('default_bg_image', defaultBgFile);
        if (backgroundFile) formData.append('background', backgroundFile);
        if (defaultBg1File) formData.append('default_bg_image1', defaultBg1File);
      }

      // Dekorasi (opsional)
      if (decorTLFile) formData.append('decorations_top_left', decorTLFile);
      if (decorTRFile) formData.append('decorations_top_right', decorTRFile);
      if (decorBLFile) formData.append('decorations_bottom_left', decorBLFile);
      if (decorBRFile) formData.append('decorations_bottom_right', decorBRFile);

      const response = await axios.post(
        'https://ccgnimex.my.id/v2/android/ginvite/page/theme_upload.php', // ← sesuaikan endpoint Anda
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

      const data = response.data;
      if (data.success) {
        setMessage('Theme berhasil diunggah 🎉');
        // Reset semua state
        setName('');
        setCategory('1');
        setTextColor('#000000');
        setAccentColor('#ff00ff');
        setImageThemeFile(null);
        setUseSingleBg(false);
        setSingleBgFile(null);
        setDefaultBgFile(null);
        setBackgroundFile(null);
        setDefaultBg1File(null);
        setDecorTLFile(null);
        setDecorTRFile(null);
        setDecorBLFile(null);
        setDecorBRFile(null);

        setTimeout(() => {
          setProgress(0);
          onUploadSuccess();
        }, 500);
      } else {
        setMessage(`Error: ${data.message || 'Upload gagal.'}`);
      }
    } catch (err) {
      console.error('Error saat upload theme:', err);
      setMessage('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold text-pink-800 mb-4">Upload Theme Baru</h2>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-white bg-pink-500">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1) Nama Theme */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Nama Theme <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama theme"
            className="w-full"
            required
          />
        </div>

        {/* 2) Kategori Dropdown */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-pink-200
                       focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                       text-pink-600 shadow-sm"
          >
            <option value="1">Pernikahan</option>
            <option value="2">Khitan</option>
            {/* Tambahkan opsi lain nanti */}
          </select>
        </div>

        {/* 3) Color Pickers + Image Theme (sebaris) */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col">
            <label className="text-pink-700 font-medium mb-1">
              Text Color <span className="text-red-500">*</span>
            </label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-12 h-12 border-0 p-0"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-pink-700 font-medium mb-1">
              Accent Color <span className="text-red-500">*</span>
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-12 h-12 border-0 p-0"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="block text-pink-700 font-medium mb-1">
              Image Theme <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e, setImageThemeFile)}
              className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold
                         file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
              required
            />
          </div>
        </div>

        {/* 4) Judul “Background” */}
        <div>
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Background</h3>
          <label className="inline-flex items-center text-pink-700">
            <input
              type="checkbox"
              checked={useSingleBg}
              onChange={(e) => setUseSingleBg(e.target.checked)}
              className="mr-2 accent-pink-500"
            />
            Gunakan satu file background untuk semua
          </label>
        </div>

        {/* 5) Input Background */}
        {useSingleBg ? (
          <div>
            {/* Tampilkan satu input background */}
            <label className="block text-pink-700 font-medium mb-1">
              File Background (untuk ketiga field) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e, setSingleBgFile)}
              className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold
                         file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
              required
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Default BG Image */}
            <div className="flex-1">
              <label className="block text-pink-700 font-medium mb-1">
                Default BG Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setDefaultBgFile)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
                required
              />
            </div>

            {/* Background */}
            <div className="flex-1">
              <label className="block text-pink-700 font-medium mb-1">
                Background <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setBackgroundFile)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
                required
              />
            </div>

            {/* Default BG Image 1 */}
            <div className="flex-1">
              <label className="block text-pink-700 font-medium mb-1">
                Default BG Image 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setDefaultBg1File)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
                required
              />
            </div>
          </div>
        )}

        {/* 6) Dekorasi (Opsional) */}
        <div>
          <h3 className="text-lg font-semibold text-pink-700 mb-2">
            Dekorasi (Opsional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deco Top Left */}
            <div>
              <label className="block text-pink-700 font-medium mb-1">
                Deco Top Left
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setDecorTLFile)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
              />
            </div>

            {/* Deco Top Right */}
            <div>
              <label className="block text-pink-700 font-medium mb-1">
                Deco Top Right
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setDecorTRFile)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
              />
            </div>

            {/* Deco Bottom Left */}
            <div>
              <label className="block text-pink-700 font-medium mb-1">
                Deco Bottom Left
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setDecorBLFile)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
              />
            </div>

            {/* Deco Bottom Right */}
            <div>
              <label className="block text-pink-700 font-medium mb-1">
                Deco Bottom Right
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileChange(e, setDecorBRFile)}
                className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
              />
            </div>
          </div>
        </div>

        {/* 7) Progress Bar (hanya tampil saat loading) */}
        {loading && (
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Progres Upload: {progress}%
            </label>
            <Progress value={progress} className="h-2 rounded-xl" />
          </div>
        )}

        {/* 8) Tombol Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white"
        >
          {loading ? 'Mengunggah...' : 'Upload Theme'}
        </Button>
      </form>
    </div>
  );
}
