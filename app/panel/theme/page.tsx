// app/admin/theme/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import UploadThemeForm from './UploadThemeForm';
import ThemeCard from './ThemeCard';

interface Theme {
  id: number;
  name: string;
  text_color: string;
  accent_color: string;
  background_url: string;
  image_theme_url: string;
}

export default function ThemePage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pengaturan state untuk search/filter (jika nanti mau ditambah)
  const [searchText, setSearchText] = useState('');
  const [filterColor, setFilterColor] = useState<string>('');

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/theme_list.php'
      );
      const data = await res.json();
      if (data.status === 'success') {
        setThemes(data.data);
      } else {
        setError('Gagal memuat daftar tema.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  // Contoh di page.tsx (edit URL jika diperlukan)
const handleDelete = async (id: number) => {
  try {
    const formData = new FormData();
    formData.append('id', id.toString());
    const res = await fetch('https://ccgnimex.my.id/v2/android/ginvite/page/theme_delete.php', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      fetchThemes();
    } else {
      alert(`Error hapus: ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert('Gagal menghubungi server untuk menghapus.');
  }
};


  // Contoh filter berdasarkan nama saja (bisa diperluas)
  const filteredThemes = themes.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesColor = filterColor === '' || t.accent_color === filterColor;
    return matchesSearch && matchesColor;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 
                     bg-clip-text text-transparent mb-2"
        >
          Kelola Theme
        </h1>
        <p className="text-sm text-pink-600">
          Tambahkan dan kelola tema (nama, warna, dan gambar).
        </p>
      </div>

      {/* FORM UPLOAD THEME */}
      <UploadThemeForm onUploadSuccess={fetchThemes} />

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Cari nama tema..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-pink-200
                     focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                     placeholder:text-pink-400 text-pink-600 shadow-sm"
        />

        {/* (Optional) Dropdown Accent Color */}
        <select
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-pink-200
                     focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                     text-pink-600 shadow-sm"
        >
          <option value="">Semua Warna Aksen</option>
          {Array.from(new Set(themes.map((t) => t.accent_color)))
            .sort()
            .map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
        </select>
      </div>

      {/* DAFTAR THEME */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-pink-800 mb-3">Daftar Theme</h2>
        {loading && <p className="text-pink-600">Memuat daftar tema...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && filteredThemes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-pink-500 text-lg">Tidak ada tema yang sesuai pencarian.</p>
          </div>
        )}

        {filteredThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
