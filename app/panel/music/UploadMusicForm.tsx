// app/admin/music/UploadMusicForm.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface UploadMusicFormProps {
  onUploadSuccess: () => void;
}

export default function UploadMusicForm({ onUploadSuccess }: UploadMusicFormProps) {
  const [namaLagu, setNamaLagu] = useState('');
  const [kategori, setKategori] = useState('');
  const [fileMusic, setFileMusic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileMusic(file);

      // Ambil nama file tanpa ekstensi untuk mengisi otomatis "namaLagu"
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setNamaLagu(nameWithoutExt);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!namaLagu.trim() || !kategori.trim() || !fileMusic) {
      setMessage('Semua field wajib diisi dan pilih file MP3.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('nama_lagu', namaLagu);
    formData.append('kategori', kategori);
    formData.append('music', fileMusic);

    try {
      // Ganti URL berikut dengan path ke music_upload.php Anda
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=music_upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();

      if (data.success) {
        setMessage('Upload berhasil 🎉');
        setNamaLagu('');
        setKategori('');
        setFileMusic(null);
        onUploadSuccess(); // refresh list
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('Gagal menghubungi server.');
      console.error(err);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Lagu (otomatis terisi dari nama file tetapi tetap bisa diedit) */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Nama Lagu<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={namaLagu}
            onChange={(e) => setNamaLagu(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-pink-200
                       focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
            placeholder="Nama file akan muncul otomatis (edit & sesuaikan)"
            required
          />
        </div>

        {/* Kategori (dropdown) */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Kategori<span className="text-red-500">*</span>
          </label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-pink-200
                       focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
            required
          >
            <option value="" disabled>
              Pilih kategori…
            </option>
            <option value="pernikahan">Pernikahan</option>
            <option value="khitanan">Khitanan</option>
            <option value="ulang tahun">Ulang Tahun</option>
            {/* Tambahkan opsi lain jika perlu */}
          </select>
        </div>

        {/* File MP3 */}
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            File MP3<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            className="w-full text-pink-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl 
                      shadow-sm hover:from-pink-500 hover:to-pink-600 transition-all transform 
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Mengunggah...' : 'Upload Musik'}
        </button>
      </form>
    </div>
  );
}
