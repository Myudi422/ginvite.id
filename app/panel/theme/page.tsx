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
  background: string;
  image_theme: string;
  kategory_theme_id: number;
  kategory_theme_name?: string; // opsional, jika ada di API
}

export default function ThemePage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pengaturan state untuk search/filter (jika nanti mau ditambah)
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>(''); // ganti dari filterColor

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/theme_list.php'
      );
      const data = await res.json();
      if (data.status === 'success') {
        // Map kategori jika belum ada nama kategori
        const themesWithCategory = data.data.map((t: any) => ({
          ...t,
          kategory_theme_name: t.kategory_theme_name || `Kategori ${t.kategory_theme_id}`,
        }));
        setThemes(themesWithCategory);
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

  // Filter berdasarkan kategori
  const filteredThemes = themes.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === '' || String(t.kategory_theme_id) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Ambil daftar kategori unik
  const categories = Array.from(
    new Map(themes.map((t) => [String(t.kategory_theme_id), t.kategory_theme_name])).entries()
  );

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

        {/* Dropdown Kategori */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-pink-200
                     focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/50 backdrop-blur-md
                     text-pink-600 shadow-sm"
        >
          <option value="">Semua Kategori</option>
          {categories.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
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

      {/* Perbaiki grid agar gambar lebih proporsional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
