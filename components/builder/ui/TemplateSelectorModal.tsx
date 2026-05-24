'use client';

import React, { useEffect, useState } from 'react';
import { useBuilder } from '../BuilderContext';
import {
  X as XIcon,
  Search as SearchIcon,
  Flame as FlameIcon,
  Sparkles as SparklesIcon,
  Check as CheckIcon,
  Download as DownloadIcon,
  RotateCcw as ResetIcon,
  Loader2 as LoaderIcon,
  SlidersHorizontal as FilterIcon,
  Palette as PaletteIcon
} from 'lucide-react';

interface TemplateItem {
  id: number;
  name: string;
  event_type: 'pernikahan' | 'khitanan' | 'ulang_tahun' | 'custom';
  text_color: string;
  accent_color: string;
  image_theme: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  onClose: () => void;
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
  { name: 'Light', hex: '#f3f4f6', class: 'bg-gray-200 border border-gray-300' },
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

export default function TemplateSelectorModal({ onClose }: Props) {
  const { state, importPage } = useBuilder();
  
  const [themes, setThemes] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<number | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'usage' | 'latest'>('usage');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://ccgnimex.my.id/v2/android/ginvite/page/template_list.php');
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setThemes(data.data);
      } else {
        setError('Gagal memuat daftar template dari database.');
      }
    } catch {
      setError('Gagal menghubungi server.');
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

  const availableCategories = ['pernikahan', 'khitanan', 'ulang_tahun', 'custom'];

  const filteredThemes = themes
    .filter(theme => {
      const matchesSearch = theme.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => {
        const itemCats = theme.event_type.split(',').map(c => c.trim());
        return itemCats.includes(cat);
      });
      const matchesColor = selectedColors.length === 0 || selectedColors.some(filterHex => 
        isColorMatch(theme.accent_color, filterHex) || isColorMatch(theme.text_color, filterHex)
      );
      return matchesSearch && matchesCategory && matchesColor;
    })
    .sort((a, b) => {
      if (sortBy === 'usage') {
        return b.usage_count - a.usage_count;
      } else {
        return b.id - a.id;
      }
    });

  const handleImport = async (theme: TemplateItem) => {
    setImportingId(theme.id);
    try {
      const res = await fetch(`https://ccgnimex.my.id/v2/android/ginvite/page/template_get.php?id=${theme.id}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      
      const json = await res.json();
      if (json.status !== 'success' || !json.data) {
        alert(json.message || 'Gagal mengambil data struktur template.');
        return;
      }

      const pageData = json.data;
      if (confirm(`Apakah Anda yakin ingin mengimpor template "${theme.name}"? Ini akan menggantikan seluruh bagian halaman dan gaya tulisan saat ini (tindakan ini dapat dibatalkan dengan Undo).`)) {
        importPage(pageData);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengimpor data template karena gangguan koneksi.');
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[85vh] flex flex-col overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50/30 to-purple-50/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-pink-500 text-white">
              <PaletteIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Pilih Template Halaman</h2>
              <p className="text-[10px] text-gray-400">Pilih & import gaya serta struktur seksi langsung ke editor builder.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all active:scale-90">
            <XIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Filters Sidebar */}
          <aside className={`w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0 md:flex ${showFiltersMobile ? 'flex' : 'hidden md:flex'}`}>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <FilterIcon className="h-3.5 w-3.5" /> Filter
              </span>
              {(search || selectedCategories.length > 0 || selectedColors.length > 0) && (
                <button onClick={handleResetFilters} className="text-[10px] font-bold text-pink-500 hover:text-pink-600 flex items-center gap-0.5">
                  <ResetIcon className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            {/* Search */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cari</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari tema..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-pink-300 focus:outline-none"
                />
                <SearchIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Urutan</label>
              <div className="grid grid-cols-2 gap-1 bg-gray-150 p-0.5 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => setSortBy('usage')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-0.5 ${sortBy === 'usage' ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <FlameIcon className="h-3 w-3" /> Terpopuler
                </button>
                <button
                  onClick={() => setSortBy('latest')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-0.5 ${sortBy === 'latest' ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <SparklesIcon className="h-3 w-3" /> Terbaru
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kategori</label>
              <div className="flex flex-wrap md:flex-col gap-1">
                {availableCategories.map(cat => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => handleToggleCategory(cat)}
                      className={`px-2.5 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border w-fit md:w-full ${active ? 'bg-pink-50 border-pink-200 text-pink-700 font-bold' : 'bg-white border-gray-150 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <span>{EVENT_TYPE_LABELS[cat] || cat}</span>
                      {active && <CheckIcon className="h-3 w-3 text-pink-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Swatches */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Warna Aksen</label>
              <div className="grid grid-cols-4 gap-1.5">
                {COLOR_PRESETS.map(color => {
                  const active = selectedColors.includes(color.hex);
                  return (
                    <button
                      key={color.name}
                      onClick={() => handleToggleColor(color.hex)}
                      className={`w-full aspect-square rounded-full ${color.class} relative flex items-center justify-center transition-all ${active ? 'ring-2 ring-pink-500 ring-offset-1 scale-105' : 'hover:scale-105'}`}
                      title={color.name}
                    >
                      {active && <CheckIcon className={`h-3 w-3 ${color.name === 'Light' ? 'text-gray-800' : 'text-white'}`} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Grid Gallery */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col min-h-0">
            {/* Mobile filters toggler */}
            <div className="md:hidden flex gap-2 mb-4">
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="flex-1 py-2 bg-white border border-pink-200 rounded-xl text-xs font-bold text-pink-500 flex items-center justify-center gap-1.5"
              >
                <FilterIcon className="h-4 w-4" /> {showFiltersMobile ? 'Tutup Filter' : 'Buka Filter'}
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <LoaderIcon className="h-8 w-8 text-pink-500 animate-spin mb-3" />
                <p className="text-xs text-gray-500">Memuat Galeri Template...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <p className="text-xs text-red-500 font-bold mb-2">{error}</p>
                <button onClick={fetchThemes} className="px-3 py-1.5 bg-pink-500 text-white text-[10px] font-bold rounded-lg">Coba Lagi</button>
              </div>
            ) : (
              <>
                <div className="text-[10px] text-gray-400 font-semibold mb-3 px-1">
                  Menampilkan {filteredThemes.length} dari {themes.length} template
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredThemes.map(theme => {
                    const isImporting = importingId === theme.id;
                    return (
                      <div
                        key={theme.id}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative"
                      >
                        {/* Image Preview */}
                        <div className="h-28 sm:h-36 w-full bg-gray-50 overflow-hidden relative border-b border-gray-55">
                          <img src={theme.image_theme} alt={theme.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                          
                          {/* Popular Badge */}
                          {theme.usage_count >= 5 && (
                            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[8px] px-1.5 py-0.5 rounded-full font-extrabold shadow-sm">
                              ⭐ Populer
                            </div>
                          )}
                          
                          {/* Hover Quick Import Overlay (Desktop Only) */}
                          <div className="absolute inset-0 bg-pink-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <button
                              onClick={() => handleImport(theme)}
                              disabled={importingId !== null}
                              className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-[10px] font-extrabold shadow-md flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50"
                            >
                              {isImporting ? (
                                <LoaderIcon className="h-3 w-3 animate-spin" />
                              ) : (
                                <DownloadIcon className="h-3 w-3" />
                              )}
                              <span>Import</span>
                            </button>
                          </div>
                        </div>

                        {/* Info Body */}
                        <div className="p-2 flex-1 flex flex-col justify-between gap-2.5">
                          <div>
                            <div className="flex items-center justify-between gap-1 text-[8px] text-gray-400 font-extrabold uppercase mb-1">
                              <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                                {theme.event_type.split(',').map(cat => (
                                  <span key={cat} className="text-pink-500 bg-pink-50 px-1 rounded">
                                    {EVENT_TYPE_LABELS[cat.trim()] || cat.trim()}
                                  </span>
                                ))}
                              </div>
                              <span>Dipakai {theme.usage_count}x</span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 truncate" title={theme.name}>{theme.name}</h4>
                          </div>

                          {/* Color chips & action on mobile */}
                          <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                            <div className="flex gap-1">
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: theme.accent_color }} title={`Accent: ${theme.accent_color}`} />
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: theme.text_color }} title={`Text: ${theme.text_color}`} />
                            </div>

                            <button
                              onClick={() => handleImport(theme)}
                              disabled={importingId !== null}
                              className="md:hidden px-2.5 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-[9px] font-bold flex items-center gap-0.5 active:scale-95 transition-all disabled:opacity-50"
                            >
                              {isImporting ? 'Loading...' : 'Import'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredThemes.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-xs text-gray-400 font-semibold">Tidak ada template yang cocok dengan filter Anda.</p>
                    <button onClick={handleResetFilters} className="mt-3 px-3 py-1.5 bg-gray-150 border border-gray-250 hover:bg-gray-200 rounded-xl text-xs font-bold">Reset Filter</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
