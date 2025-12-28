'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { getThemesFromServer, saveContentToServer } from '@/app/actions/getThemes'; // Pastikan path import benar

interface Theme {
  id: number;
  name: string;
  image_theme: string;
  kategory_theme_id: number;
  kategory_theme_nama: string;
  usage_count: number;
  is_popular: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface ThemeSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function ThemeSection({ userId, invitationId, slug, onSavedSlug }: ThemeSectionProps) {
  const { control, getValues, setValue } = useFormContext();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const THEMES_PER_PAGE = 8; // Jumlah tema per halaman
  const totalPages = Math.ceil(themes.length / THEMES_PER_PAGE);
  const startIndex = (currentPage - 1) * THEMES_PER_PAGE;
  const currentThemes = themes.slice(startIndex, startIndex + THEMES_PER_PAGE);

  useEffect(() => {
    const loadThemes = async () => {
      setLoading(true);
      const result = await getThemesFromServer();
      if (result.status === 'success' && Array.isArray(result.data)) {
        // Themes sudah diurutkan berdasarkan popularitas dari server
        setThemes(result.data);
      } else {
        console.error('Gagal load themes:', result);
        setError(result.message || 'Gagal memuat data tema.');
      }
      setLoading(false);
    };

    loadThemes();
  }, []);

  const autoSave = useCallback(async (selectedTheme: Theme) => {
    const data = getValues();
    // Update data dengan theme yang dipilih dan kategorinya
    data.theme = selectedTheme.id;
    data.themeCategory = selectedTheme.kategory_theme_id;
    
    const result = await saveContentToServer(userId, invitationId, slug, data, onSavedSlug);
    if (result?.error) {
      setError(result.error);
    } else {
      setError(null);
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?t=${Date.now()}`;
      }
    }
  }, [getValues, invitationId, onSavedSlug, slug, userId]);

  if (loading) {
    return <div>Loading themes...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header dengan informasi tema populer */}
      <div className="flex items-center justify-between">
        <FormLabel className="text-lg font-semibold">Pilih Tema</FormLabel>
      </div>

      {/* Grid Tema */}
      <FormField
        name="theme"
        control={control}
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentThemes.map(theme => (
                <div
                  key={theme.id}
                  className={`relative cursor-pointer rounded-lg border p-2 transition-all hover:shadow-lg \
                    ${field.value === theme.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => {
                    field.onChange(theme.id);
                    setValue('themeCategory', theme.kategory_theme_id);
                    autoSave(theme);
                  }}
                >
                  {/* Badge untuk tema populer */}
                  {theme.is_popular && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold z-10 shadow-sm">
                      ⭐
                    </div>
                  )}
                  
                  <img
                    src={theme.image_theme}
                    alt={theme.name}
                    className="h-24 w-full object-cover rounded"
                    loading="lazy"
                  />
                  
                  <div className="mt-2">
                    <p className="text-center text-sm font-medium truncate" title={theme.name}>
                      {theme.name}
                    </p>
                    <p className="text-center text-xs text-gray-500">
                      {theme.kategory_theme_nama}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <FormMessage />
            {error && <p className="text-red-600 mt-2">Error: {error}</p>}
          </FormItem>
        )}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Sebelumnya
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}