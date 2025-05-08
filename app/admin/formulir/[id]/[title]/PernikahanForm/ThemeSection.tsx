'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

// URL untuk fetch themes
const THEME_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme';

interface Theme {
  id: number;
  name: string;
  image_theme: string;
}

/**
 * ThemeSection: menampilkan pilihan theme dalam grid.
 * Menyimpan nilai theme (id) ke form RHF di key `theme`.
 */
export function ThemeSection() {
  const { control } = useFormContext();
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    fetch(THEME_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'success' && Array.isArray(json.data)) {
          setThemes(json.data);
        } else {
          console.error('Gagal load themes:', json);
        }
      })
      .catch((err) => console.error('Error fetch themes:', err));
  }, []);

  return (
    <FormField
      name="theme"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Pilih Theme</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((t) => (
              <div
                key={t.id}
                className={`cursor-pointer rounded-lg border p-2 transition-shadow hover:shadow-lg 
                  ${field.value === t.id ? 'border-blue-500 ring ring-blue-200' : 'border-gray-200'}`}
                onClick={() => field.onChange(t.id)}
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
        </FormItem>
      )}
    />
  );
}
