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
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThemes = async () => {
      setLoading(true);
      const result = await getThemesFromServer();
      if (result.status === 'success' && Array.isArray(result.data)) {
        setThemes(result.data);
        const map = new Map<number, string>();
        result.data.forEach(t => {
          if (t.kategory_theme_id != null && !map.has(t.kategory_theme_id)) {
            map.set(t.kategory_theme_id, t.kategory_theme_nama);
          }
        });
        const cats = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0].id);
          setValue('themeCategory', cats[0].id);
        }
      } else {
        console.error('Gagal load themes:', result);
        setError(result.message || 'Gagal memuat data tema.');
      }
      setLoading(false);
    };

    loadThemes();
  }, [setValue]);

  const autoSave = useCallback(async () => {
    const data = getValues();
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
    <>
      {/* Dropdown Kategori Theme */}
      <FormField
        name="themeCategory"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pilih Style Theme</FormLabel>
            <FormControl>
              <select
                {...field}
                value={selectedCategory ?? ''}
                onChange={e => {
                  const catId = parseInt(e.target.value, 10);
                  setSelectedCategory(catId);
                  field.onChange(catId);
                  setValue('theme', undefined);
                }}
                className="w-full rounded-md border p-2"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Pilihan Theme berdasarkan Kategori */}
      <FormField
        name="theme"
        control={control}
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-3 gap-4">
              {themes
                .filter(t => t.kategory_theme_id === selectedCategory)
                .map(t => (
                  <div
                    key={t.id}
                    className={`cursor-pointer rounded-lg border p-2 transition-shadow hover:shadow-lg \
                      ${field.value === t.id ? 'border-blue-500 ring ring-blue-200' : 'border-gray-200'}`}
                    onClick={() => {
                      field.onChange(t.id);
                      autoSave();
                    }}
                  >
                    <img
                      src={t.image_theme}
                      alt={t.name}
                      className="h-24 w-full object-cover rounded"
                    />
                    <p className="mt-2 text-center text-sm font-medium">{t.name}</p>
                  </div>
                ))}
            </div>
            <FormMessage />
            {error && <p className="text-red-600 mt-2">Error: {error}</p>}
          </FormItem>
        )}
      />
    </>
  );
}