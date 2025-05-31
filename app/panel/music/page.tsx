// app/admin/music/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import UploadMusicForm from './UploadMusicForm';
import MusicCard from './MusicCard';

// Definisi tipe musik
interface Music {
  Nama_lagu: string;
  link_lagu: string;
  kategori: string;
}

export default function MusicPage() {
  const [musics, setMusics] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi fetch daftar musik
  const fetchMusics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=musiclist');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 
                       bg-clip-text text-transparent mb-2">
          Kelola Musik
        </h1>
        <p className="text-sm text-pink-600">
          Tambahkan dan lihat daftar lagu untuk undangan Anda
        </p>
      </div>

      {/* FORM UPLOAD */}
      <UploadMusicForm onUploadSuccess={fetchMusics} />

      {/* DAFTAR MUSIK */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-pink-800 mb-3">Daftar Musik</h2>
        {loading && <p className="text-pink-600">Memuat daftar musik...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && musics.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-pink-500 text-lg">Belum ada lagu terdaftar.</p>
          </div>
        )}

        {musics.map((music, idx) => (
          <MusicCard key={idx} music={music} />
        ))}
      </div>
    </div>
  );
}
