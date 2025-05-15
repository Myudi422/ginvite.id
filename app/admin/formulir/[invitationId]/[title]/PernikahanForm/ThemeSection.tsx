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

const THEME_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme';
const SAVE_URL  = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

interface Theme {
  id: number;
  name: string;
  image_theme: string;
}

interface ThemeSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function ThemeSection({
  userId,
  invitationId,
  slug,
  onSavedSlug,
}: ThemeSectionProps) {
  const { control, getValues } = useFormContext();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [error, setError] = useState<string | null>(null);

  // load daftar theme
  useEffect(() => {
    fetch(THEME_URL)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success' && Array.isArray(json.data)) {
          setThemes(json.data);
        } else {
          console.error('Gagal load themes:', json);
        }
      })
      .catch(err => console.error('Error fetch themes:', err));
  }, []);

  // auto–save & refresh preview
  const autoSave = useCallback(async () => {
    setError(null);
    try {
      const data = getValues();
      const { gift, whatsapp_notif } = data.plugin;
      const jumlah = gift || whatsapp_notif ? 100000 : 40000;

      const payload = {
        user_id:  userId,
        id:       invitationId,
        title:    slug,
        theme_id: data.theme,
        content:  JSON.stringify({ ...data, event: data.event, jumlah }),
      };

      const res = await fetch(SAVE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Gagal menyimpan theme');
      }

      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Auto–save theme gagal:', err);
    }
  }, [getValues, invitationId, onSavedSlug, slug, userId]);

  return (
    <FormField
      name="theme"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Pilih Theme</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            {themes.map(t => (
              <div
                key={t.id}
                className={`
                  cursor-pointer rounded-lg border p-2 transition-shadow hover:shadow-lg
                  ${field.value === t.id
                    ? 'border-blue-500 ring ring-blue-200'
                    : 'border-gray-200'}
                `}
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
  );
}
