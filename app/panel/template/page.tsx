'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutTemplate as TemplateIcon,
  Search as SearchIcon,
  SlidersHorizontal as FilterIcon,
  Check as CheckIcon,
  Flame as FlameIcon,
  Sparkles as SparklesIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Edit2 as EditIcon,
  Eye as EyeIcon,
  RotateCcw as ResetIcon,
  AlertCircle as AlertIcon,
  Loader2 as LoaderIcon,
  Settings as SettingsIcon
} from 'lucide-react';

interface TemplateItem {
  id: number;
  name: string;
  event_type: string;
  text_color: string;
  accent_color: string;
  image_theme: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  pernikahan: '💍 Pernikahan',
  khitanan: '👶 Khitanan',
  ulang_tahun: '🎂 Ulang Tahun',
  custom: '✨ Custom',
};

const COLOR_PRESETS = [
  { name: 'Pink', hex: '#ec4899', class: 'bg-pink-500' },
  { name: 'Red', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Purple', hex: '#a855f7', class: 'bg-purple-500' },
  { name: 'Green', hex: '#10b981', class: 'bg-emerald-500' },
  { name: 'Gold', hex: '#eab308', class: 'bg-amber-500' },
  { name: 'Dark', hex: '#1f2937', class: 'bg-gray-800' },
  { name: 'Light', hex: '#f3f4f6', class: 'bg-gray-200 border border-gray-350' },
];

function getRgb(hex: string) {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function isColorMatch(themeHex: string, filterHex: string): boolean {
  try {
    const rgb1 = getRgb(themeHex);
    const rgb2 = getRgb(filterHex);
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    return distance < 150;
  } catch (err) {
    return false;
  }
}

export default function TemplateAdminPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'usage' | 'latest'>('usage');

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEventTypes, setNewEventTypes] = useState<string[]>(['pernikahan']);
  const [newTextColor, setNewTextColor] = useState('#1f2937');
  const [newAccentColor, setNewAccentColor] = useState('#db2777');
  const [newImageTheme, setNewImageTheme] = useState('');

  // Selected for Inspect Modal
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);

  // Edit Metadata Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTemplateId, setEditTemplateId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEventTypes, setEditEventTypes] = useState<string[]>([]);
  const [editTextColor, setEditTextColor] = useState('#1f2937');
  const [editAccentColor, setEditAccentColor] = useState('#db2777');
  const [editImageTheme, setEditImageTheme] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const handleOpenEditModal = (item: TemplateItem) => {
    setEditTemplateId(item.id);
    setEditName(item.name);
    setEditEventTypes(item.event_type.split(',').map(c => c.trim()));
    setEditTextColor(item.text_color);
    setEditAccentColor(item.accent_color);
    setEditImageTheme(item.image_theme);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://dev.legalpilar.id/v2/android/ginvite/page/template_list.php');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setTemplates(data.data);
      } else {
        setError('Gagal mengambil daftar template.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan koneksi saat menghubungkan ke database server.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleToggleColor = (hex: string) => {
    if (selectedColors.includes(hex)) {
      setSelectedColors(selectedColors.filter(h => h !== hex));
    } else {
      setSelectedColors([...selectedColors, hex]);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedColors([]);
    setSortBy('usage');
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newEventTypes.length === 0) {
      alert('Nama template dan minimal satu kategori wajib diisi.');
      return;
    }

    setCreateLoading(true);
    try {
      // Default JSON template layout
      const defaultLayout = {
        style: {
          bg_color: '#ffffff',
          text_color: newTextColor,
          accent_color: newAccentColor,
          font_body: 'Outfit',
          font_heading: 'Outfit',
          page_width: 700
        },
        sections: [
          {
            id: 'sec-opening',
            type: 'opening',
            label: 'Cover Pembuka',
            visible: true,
            order: 0,
            group: 'opening',
            props: {
              title: newEventTypes.includes('pernikahan') ? 'The Wedding Of' : newEventTypes.includes('ulang_tahun') ? 'Birthday Invitation' : 'Undangan Walimatul Khitan',
              name_primary: newEventTypes.includes('pernikahan') ? 'Groom' : newEventTypes.includes('khitanan') ? 'Putra' : 'Nama',
              name_secondary: newEventTypes.includes('pernikahan') ? 'Bride' : '',
              button_text: 'Buka Undangan'
            }
          },
          {
            id: 'sec-couple',
            type: 'couple',
            label: 'Profil Utama',
            visible: true,
            order: 1,
            group: 'inner',
            props: {
              greeting: 'Assalamu\'alaikum Wr. Wbr.',
              couple_text: 'Dengan memohon rahmat Allah SWT, kami mengundang Anda sekalian...'
            }
          }
        ]
      };

      const res = await fetch('https://dev.legalpilar.id/v2/android/ginvite/page/template_save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          event_type: newEventTypes.join(','),
          text_color: newTextColor,
          accent_color: newAccentColor,
          image_theme: newImageTheme || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop',
          page_data: defaultLayout
        })
      });

      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      if (data.status === 'success' && data.id) {
        setShowCreateModal(false);
        // Reset fields
        setNewName('');
        setNewImageTheme('');
        setNewEventTypes(['pernikahan']);
        // Redirect to new template builder
        router.push(`/admin/builder/template/${data.id}`);
      } else {
        alert(data.message || 'Gagal menyimpan template baru.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTemplateId || !editName.trim() || editEventTypes.length === 0) {
      alert('Nama template dan minimal satu kategori wajib diisi.');
      return;
    }

    setEditLoading(true);
    try {
      const res = await fetch('https://dev.legalpilar.id/v2/android/ginvite/page/template_save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editTemplateId,
          name: editName.trim(),
          event_type: editEventTypes.join(','),
          text_color: editTextColor,
          accent_color: editAccentColor,
          image_theme: editImageTheme || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop'
        })
      });

      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      if (data.status === 'success') {
        setShowEditModal(false);
        fetchTemplates();
      } else {
        alert(data.message || 'Gagal memperbarui properti template.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: number, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus template "${name}"? Tindakan ini permanen.`)) return;

    try {
      const res = await fetch('https://dev.legalpilar.id/v2/android/ginvite/page/template_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchTemplates();
      } else {
        alert(data.message || 'Gagal menghapus template.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghubungi server.');
    }
  };

  // Filter & Sort logic
  const filteredTemplates = templates
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => {
        const itemCats = item.event_type.split(',').map(c => c.trim());
        return itemCats.includes(cat);
      });
      const matchesColor = selectedColors.length === 0 || selectedColors.some(filterHex =>
        isColorMatch(item.accent_color, filterHex) || isColorMatch(item.text_color, filterHex)
      );
      return matchesSearch && matchesCategory && matchesColor;
    })
    .sort((a, b) => {
      if (sortBy === 'usage') {
        return b.usage_count - a.usage_count;
      }
      return b.id - a.id;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/50 backdrop-blur-md border border-purple-100/50 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md">
              <TemplateIcon className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              Kelola Template Builder
            </h1>
          </div>
          <p className="text-xs md:text-sm text-purple-600/80 mt-1.5 ml-1">
            Buat, kelola, dan rancang template JSON untuk seksi kanvas undangan digital Anda.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-sm font-bold shadow-md active:scale-95 transition-all w-full sm:w-auto"
        >
          <PlusIcon className="h-4.5 w-4.5" />
          Template Baru
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 bg-white/70 backdrop-blur-md border border-purple-100/50 p-6 rounded-3xl shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-purple-50 pb-3">
            <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
              <FilterIcon className="h-4 w-4 text-purple-500" />
              <span>Filter & Cari</span>
            </div>
            {(search || selectedCategories.length > 0 || selectedColors.length > 0) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-pink-500 hover:text-pink-700 font-semibold flex items-center gap-1 transition-colors"
              >
                <ResetIcon className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Cari Nama</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari template..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200 text-xs bg-white text-gray-700 transition-shadow shadow-inner placeholder:text-gray-400"
              />
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Urutan</label>
            <div className="grid grid-cols-2 gap-2 bg-purple-50/50 p-1 rounded-2xl border border-purple-100/30">
              <button
                onClick={() => setSortBy('usage')}
                className={`py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  sortBy === 'usage'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-600/70 hover:text-purple-800 hover:bg-white/40'
                }`}
              >
                <FlameIcon className="h-3.5 w-3.5" /> Terpopuler
              </button>
              <button
                onClick={() => setSortBy('latest')}
                className={`py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                  sortBy === 'latest'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-600/70 hover:text-purple-800 hover:bg-white/40'
                }`}
              >
                <SparklesIcon className="h-3.5 w-3.5" /> Terbaru
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block">Kategori Acara</label>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => {
                const isActive = selectedCategories.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleToggleCategory(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between w-fit lg:w-full ${
                      isActive
                        ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm font-bold'
                        : 'bg-white hover:bg-purple-50/20 border-gray-150 text-gray-600'
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && <CheckIcon className="h-3.5 w-3.5 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Presets */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block">Warna Aksen</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map(color => {
                const isActive = selectedColors.includes(color.hex);
                return (
                  <button
                    key={color.name}
                    onClick={() => handleToggleColor(color.hex)}
                    className={`w-full aspect-square rounded-full ${color.class} transition-all duration-200 active:scale-90 hover:scale-105 shadow-sm relative flex items-center justify-center ${
                      isActive ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : 'hover:ring-1 hover:ring-purple-300'
                    }`}
                    title={color.name}
                  >
                    {isActive && (
                      <CheckIcon className={`h-4 w-4 ${color.name === 'Light' ? 'text-gray-800' : 'text-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Templates Display Grid */}
        <section className="flex-1 w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/65 backdrop-blur-md rounded-3xl border border-purple-100 shadow-sm">
              <LoaderIcon className="h-9 w-9 text-purple-500 animate-spin mb-4" />
              <p className="text-xs text-purple-700 font-medium">Memuat Daftar Template...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 bg-rose-50 rounded-3xl border border-rose-100 shadow-sm text-center">
              <AlertIcon className="h-10 w-10 text-rose-500 mb-3" />
              <h3 className="text-base font-bold text-rose-800">Gagal Memuat</h3>
              <p className="text-xs text-rose-600 mt-1 max-w-sm">{error}</p>
              <button
                onClick={fetchTemplates}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              {/* Count stats */}
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100/50 px-3 py-1 rounded-full">
                  Total {filteredTemplates.length} Template Builder
                </span>
                {sortBy === 'usage' && (
                  <span className="text-[10px] text-pink-500 font-medium">
                    🔥 Diurutkan berdasar terpopuler
                  </span>
                )}
              </div>

              {/* Grid List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map(item => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl border border-purple-100/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col relative"
                  >
                    {/* Populer Badge */}
                    {item.usage_count >= 5 && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold z-10 shadow-sm flex items-center gap-0.5">
                        ⭐ Populer ({item.usage_count})
                      </div>
                    )}

                    {/* Preview Image Container */}
                    <div className="h-44 w-full bg-purple-50 overflow-hidden relative border-b border-purple-50">
                      <img
                        src={item.image_theme}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[1px]">
                        <button
                          onClick={() => setSelectedTemplate(item)}
                          className="p-2.5 rounded-full bg-white text-purple-600 hover:bg-purple-50 active:scale-95 transition-all shadow-md"
                          title="Lihat Detail Properti"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2.5 rounded-full bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all shadow-md"
                          title="Edit Properti Template"
                        >
                          <SettingsIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/builder/template/${item.id}`)}
                          className="p-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all shadow-md"
                          title="Edit Layout Seksi"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(item.id, item.name)}
                          className="p-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all shadow-md"
                          title="Hapus"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex flex-wrap gap-1 max-w-[170px]">
                            {item.event_type.split(',').map(cat => (
                              <span key={cat} className="text-[9px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/50">
                                {EVENT_TYPE_LABELS[cat.trim()] || cat.trim()}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            Dipakai: <strong className="text-gray-600 font-bold">{item.usage_count}x</strong>
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 truncate" title={item.name}>
                          {item.name}
                        </h3>
                      </div>

                      {/* Color Palette Indicators */}
                      <div className="flex items-center justify-between border-t border-purple-50/50 pt-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.text_color }} title="Warna Teks" />
                            <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.accent_color }} title="Warna Aksen" />
                          </div>
                          <span className="text-[9px] text-gray-400 font-mono">ID: {item.id}</span>
                        </div>

                        {/* Action buttons directly accessible */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                            title="Edit Properti"
                          >
                            <SettingsIcon className="h-2.5 w-2.5" /> Edit
                          </button>
                          <button
                            onClick={() => router.push(`/admin/builder/template/${item.id}`)}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                          >
                            <EditIcon className="h-2.5 w-2.5" /> Design
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-purple-100 shadow-sm p-8">
                  <AlertIcon className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-xs font-bold text-purple-800">Tidak ada Template yang Cocok</h4>
                  <p className="text-[11px] text-purple-600/70 mt-1 max-w-xs mx-auto">
                    Kombinasi filter pencarian Anda tidak membuahkan hasil. Silakan reset filter.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* ── Create New Template Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTemplate}
            className="bg-white rounded-3xl border border-purple-100 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-purple-50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Buat Template Builder Baru</h3>
                <p className="text-[10px] text-purple-600 mt-0.5">Mulai dengan layout dasar kemudian rancang seksi di kanvas builder.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Nama Template *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Netflix Premium Elegant"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Kategori / Tipe Acara (Pilih minimal satu) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => {
                    const isChecked = newEventTypes.includes(key);
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => {
                          if (isChecked) {
                            if (newEventTypes.length > 1) {
                              setNewEventTypes(newEventTypes.filter(t => t !== key));
                            }
                          } else {
                            setNewEventTypes([...newEventTypes, key]);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold'
                            : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{label}</span>
                        {isChecked && <CheckIcon className="h-3.5 w-3.5 text-purple-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Warna Teks Awal</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newTextColor}
                      onChange={e => setNewTextColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-purple-100 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newTextColor}
                      onChange={e => setNewTextColor(e.target.value)}
                      className="w-full px-2 py-1 border border-purple-100 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Warna Aksen Awal</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newAccentColor}
                      onChange={e => setNewAccentColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-purple-100 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newAccentColor}
                      onChange={e => setNewAccentColor(e.target.value)}
                      className="w-full px-2 py-1 border border-purple-100 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">URL Gambar Preview (Opsional)</label>
                <input
                  type="text"
                  placeholder="URL https://..."
                  value={newImageTheme}
                  onChange={e => setNewImageTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-xs"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-white active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {createLoading ? (
                  <>
                    <LoaderIcon className="h-3 w-3 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-3.5 w-3.5" />
                    Buat & Edit Seksi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Inspect Template Info Modal ── */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-purple-100 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-purple-50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {selectedTemplate.event_type.split(',').map(cat => (
                    <span key={cat} className="text-[9px] font-extrabold uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100/50 tracking-wider">
                      {EVENT_TYPE_LABELS[cat.trim()] || cat.trim()}
                    </span>
                  ))}
                </div>
                <h3 className="text-sm font-bold text-gray-800">{selectedTemplate.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-150">
                <img
                  src={selectedTemplate.image_theme}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Warna Teks</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: selectedTemplate.text_color }} />
                    <span className="text-xs font-mono font-bold text-gray-700">{selectedTemplate.text_color}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Warna Aksen</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: selectedTemplate.accent_color }} />
                    <span className="text-xs font-mono font-bold text-gray-700">{selectedTemplate.accent_color}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[9px] text-gray-400 font-bold block uppercase">Informasi Lain</span>
                <div className="flex justify-between py-1 text-xs border-b border-purple-50/50">
                  <span className="text-gray-400">Total Pemakaian</span>
                  <span className="font-bold text-gray-750">{selectedTemplate.usage_count} Kali</span>
                </div>
                <div className="flex justify-between py-1 text-xs border-b border-purple-50/50">
                  <span className="text-gray-400">Dibuat Pada</span>
                  <span className="text-gray-750 font-mono text-[10px]">{new Date(selectedTemplate.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-400">Terakhir Update</span>
                  <span className="text-gray-750 font-mono text-[10px]">{new Date(selectedTemplate.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-white active:scale-95 transition-all"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const temp = selectedTemplate;
                  setSelectedTemplate(null);
                  handleOpenEditModal(temp);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1"
              >
                <SettingsIcon className="h-3.5 w-3.5" /> Edit Properti
              </button>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  router.push(`/admin/builder/template/${selectedTemplate.id}`);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1 hover:brightness-110"
              >
                <EditIcon className="h-3.5 w-3.5" /> Edit Layout Seksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Template Metadata Modal ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMetadata}
            className="bg-white rounded-3xl border border-purple-100 shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-purple-50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Edit Properti Template</h3>
                <p className="text-[10px] text-purple-600 mt-0.5">Perbarui nama, warna palet, tipe kategori, atau gambar preview template.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Nama Template *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Netflix Premium Elegant"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Kategori / Tipe Acara (Pilih minimal satu) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => {
                    const isChecked = editEventTypes.includes(key);
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => {
                          if (isChecked) {
                            if (editEventTypes.length > 1) {
                              setEditEventTypes(editEventTypes.filter(t => t !== key));
                            }
                          } else {
                            setEditEventTypes([...editEventTypes, key]);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-purple-50 border-purple-200 text-purple-700 font-bold'
                            : 'bg-white border-gray-150 text-gray-650 hover:bg-gray-50'
                        }`}
                      >
                        <span>{label}</span>
                        {isChecked && <CheckIcon className="h-3.5 w-3.5 text-purple-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Warna Teks</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editTextColor}
                      onChange={e => setEditTextColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-purple-100 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editTextColor}
                      onChange={e => setEditTextColor(e.target.value)}
                      className="w-full px-2 py-1 border border-purple-100 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Warna Aksen</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editAccentColor}
                      onChange={e => setEditAccentColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-purple-100 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editAccentColor}
                      onChange={e => setEditAccentColor(e.target.value)}
                      className="w-full px-2 py-1 border border-purple-100 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">URL Gambar Preview (Opsional)</label>
                <input
                  type="text"
                  placeholder="URL https://..."
                  value={editImageTheme}
                  onChange={e => setEditImageTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 text-xs"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-white active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {editLoading ? (
                  <>
                    <LoaderIcon className="h-3 w-3 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-3.5 w-3.5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
