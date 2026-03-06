// app/admin/music/UploadMusicForm.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
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

interface UploadMusicFormProps {
  onUploadSuccess: () => void;
}

export default function UploadMusicForm({ onUploadSuccess }: UploadMusicFormProps) {
  const [namaLagu, setNamaLagu] = useState('');
  const [kategori, setKategori] = useState<string | undefined>(undefined);
  const [fileMusic, setFileMusic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileMusic(file);

      // Ambil nama file tanpa ekstensi untuk isi otomatis "namaLagu"
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setNamaLagu(nameWithoutExt);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!namaLagu.trim() || !kategori || !fileMusic) {
      setMessage('Semua field wajib diisi dan pilih file MP3.');
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('nama_lagu', namaLagu);
    formData.append('kategori', kategori);
    formData.append('music', fileMusic);

    try {
      const response = await axios.post(
        // → Ganti URL ini ke lokasi sesungguhnya music_upload.php kalian:
        'https://ccgnimex.my.id/v2/android/ginvite/page/music_upload.php',
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

      // Debug: lihat respons PHP
      console.log('Response dari PHP:', response.data);

      const data = response.data;
      if (data.success) {
        setMessage('Upload berhasil 🎉');
        setNamaLagu('');
        setKategori(undefined);
        setFileMusic(null);
        // Setelah upload sukses, refresh daftar musik
        setTimeout(() => {
          setProgress(0);
          onUploadSuccess();
        }, 500);
      } else {
        setMessage(`Error: ${data.message || 'Upload gagal.'}`);
      }
    } catch (err) {
      console.error('Error waktu upload:', err);
      setMessage('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 md:p-8 border border-pink-100 shadow-sm mb-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-500"></div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Musik Baru</h2>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-white bg-gradient-to-r from-pink-400 to-rose-400 shadow-sm font-medium">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Lagu (otomatis terisi dari nama file tetapi bisa diedit) */}
        <div>
          <label className="block text-pink-700 text-xs font-semibold mb-2 uppercase tracking-wide">
            Nama Lagu <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={namaLagu}
            onChange={(e) => setNamaLagu(e.target.value)}
            placeholder="Nama file akan muncul otomatis (edit jika perlu)"
            className="w-full rounded-xl border-pink-200 focus:ring-pink-300 py-6"
            required
          />
        </div>

        {/* Kategori (dropdown Shadcn UI) */}
        <div>
          <label className="block text-pink-700 text-xs font-semibold mb-2 uppercase tracking-wide">
            Kategori <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setKategori(value)}
            value={kategori}
            defaultValue=""
          >
            <SelectTrigger className="w-full rounded-xl border-pink-200 focus:ring-pink-300 py-6">
              <SelectValue placeholder="Pilih kategori…" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-pink-100">
              <SelectItem value="pernikahan">Pernikahan</SelectItem>
              <SelectItem value="khitanan">Khitanan</SelectItem>
              <SelectItem value="ulang tahun">Ulang Tahun</SelectItem>
              {/* Tambahkan opsi lain jika perlu */}
            </SelectContent>
          </Select>
        </div>

        {/* File MP3 */}
        <div>
          <label className="block text-pink-700 text-xs font-semibold mb-2 uppercase tracking-wide">
            File MP3 <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              type="file"
              accept=".mp3"
              onChange={handleFileChange}
              className="w-full text-pink-600 file:mr-4 file:py-3 file:px-6
                         file:rounded-xl file:border-0 file:text-sm file:font-semibold
                         file:bg-pink-100 file:text-pink-700 cursor-pointer
                         hover:file:bg-pink-200 transition-colors bg-pink-50/50 rounded-xl
                         border border-dashed border-pink-200 p-2"
              required
            />
          </div>
        </div>

        {/* Progress Bar (hanya tampil saat sedang upload) */}
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
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl py-6 text-base font-semibold shadow-md transform transition duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Mengunggah...' : 'Upload Musik'}
        </Button>
      </form>
    </div>
  );
}
