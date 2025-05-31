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
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-pink-200 shadow-sm mb-8">
      <h2 className="text-2xl font-semibold text-pink-800 mb-4">Upload Musik Baru</h2>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-white bg-pink-500">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Lagu (otomatis terisi dari nama file tetapi bisa diedit) */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Nama Lagu <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={namaLagu}
            onChange={(e) => setNamaLagu(e.target.value)}
            placeholder="Nama file akan muncul otomatis (edit jika perlu)"
            className="w-full"
            required
          />
        </div>

        {/* Kategori (dropdown Shadcn UI) */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setKategori(value)}
            value={kategori}
            defaultValue=""
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kategori…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pernikahan">Pernikahan</SelectItem>
              <SelectItem value="khitanan">Khitanan</SelectItem>
              <SelectItem value="ulang tahun">Ulang Tahun</SelectItem>
              {/* Tambahkan opsi lain jika perlu */}
            </SelectContent>
          </Select>
        </div>

        {/* File MP3 */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            File MP3 <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            className="w-full text-pink-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-pink-200 file:text-pink-700 hover:file:bg-pink-300"
            required
          />
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
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white"
        >
          {loading ? 'Mengunggah...' : 'Upload Musik'}
        </Button>
      </form>
    </div>
  );
}
