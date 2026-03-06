// app/admin/music/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import UploadMusicForm from './UploadMusicForm';
import MusicCard from './MusicCard';

interface Music {
  Nama_lagu: string;
  link_lagu: string;
  kategori: string;
}

export default function MusicPage() {
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('');

  const fetchMusics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=musiclist'
      );
      const data = await res.json();
      if (data.status === 'success') {
        setMusics(data.data);
      } else {
        setError('Gagal memuat daftar musik.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusics();
  }, []);

  // Ambil daftar kategori unik dari data
  const categories = Array.from(new Set(musics.map((m) => m.kategori))).sort();

  // Filter berdasarkan searchText & filterKategori
  const filteredMusics = musics.filter((m) => {
    const matchesSearch = m.Nama_lagu
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesKategori =
      filterKategori === '' || m.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 
                     bg-clip-text text-transparent mb-2"
        >
          Kelola Musik
        </h1>
        <p className="text-sm text-pink-600">
          Tambahkan dan cari lagu berdasarkan kategori atau nama
        </p>
      </div>

      {/* FORM UPLOAD */}
      <UploadMusicForm onUploadSuccess={fetchMusics} />

      {/* FILTER & SEARCH (FULL WIDTH, RATA SEJULUR) */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 w-full">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari judul lagu..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-pink-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-pink-300 text-pink-700 transition duration-200 hover:shadow-md"
        />

        {/* Kategori Dropdown */}
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-pink-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-700 transition duration-200 hover:shadow-md appearance-none"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* DAFTAR MUSIK */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-pink-800 mb-3">Daftar Musik</h2>
        {loading && <p className="text-pink-600">Memuat daftar musik...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && filteredMusics.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-pink-500 text-lg">
              Tidak ada lagu yang sesuai pencarian.
            </p>
          </div>
        )}

        {filteredMusics.map((music, idx) => (
          <MusicCard key={idx} music={music} />
        ))}
      </div>
    </div>
  );
}
