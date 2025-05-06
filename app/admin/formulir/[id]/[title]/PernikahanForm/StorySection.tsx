'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';

// reuse the same upload endpoints as in GallerySection
const UPLOAD_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze.php';
const DELETE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_hapus.php';

interface StoryItem {
  title: string;
  description: string;
  pictures: string[];
}

export function StorySection() {
  const { control, watch, setValue, getValues } = useFormContext();
  const enabled = watch('our_story_enabled', false);
  const { fields, append, remove } = useFieldArray({ control, name: 'our_story' });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleToggle = (checked: boolean) => {
    setValue('our_story_enabled', checked);
  };

  const handleFileChange = useCallback(async (file: File, index: number) => {
    if (!enabled) return;
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Upload gagal');
      const current = getValues('our_story') as StoryItem[];
      current[index].pictures = [data.url];
      setValue('our_story', current);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }, [enabled, getValues, setValue]);

  const handleDeleteImage = async (index: number) => {
    if (!enabled) return;
    const urlToDelete = getValues(`our_story.${index}.pictures.0`);
    try {
      await fetch(DELETE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `imageUrl=${encodeURIComponent(urlToDelete)}`,
      });
      const current = getValues('our_story') as StoryItem[];
      current[index].pictures = [];
      setValue('our_story', current);
    } catch (err) {
      console.error('Hapus gambar gagal', err);
    }
  };

  return (
    <Collapsible title="Our Story">
      {/* Toggle enable/disable dengan padding atas */}
      <div className="pt-4 flex items-center space-x-2 mb-4">
        <Controller
          name="our_story_enabled"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(v) => { field.onChange(v); handleToggle(v); }}
            />
          )}
        />
        <span className="text-sm font-medium">{enabled ? 'Aktif' : 'Nonaktif'}</span>
      </div>

      {/* Story items */}
      <div className="space-y-6">
        {fields.map((item, i) => (
          <div key={item.id} className={`border p-4 rounded-lg space-y-4 ${!enabled ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Cerita {i + 1}</h4>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => remove(i)}
                disabled={!enabled}
              >
                ×
              </Button>
            </div>

            <Controller
              name={`our_story.${i}.title`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Judul Cerita"
                  disabled={!enabled}
                />
              )}
            />

            <Controller
              name={`our_story.${i}.description`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Deskripsi"
                  disabled={!enabled}
                  className="resize-none"
                />
              )}
            />

            <div>
              {getValues(`our_story.${i}.pictures.0`) ? (
                <div className="relative inline-block">
                  <img
                    src={getValues(`our_story.${i}.pictures.0`)}
                    alt={`Story ${i + 1}`}
                    className="w-32 h-32 object-cover rounded mb-2"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    onClick={() => handleDeleteImage(i)}
                    disabled={!enabled}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  disabled={!enabled}
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0], i)}
                  className="block"
                />
              )}
              {uploading && <p className="text-sm text-yellow-600 mt-1">Mengunggah…</p>}
              {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
            </div>
          </div>
        ))}

        <Button onClick={() => append({ title: '', description: '', pictures: [] })} disabled={!enabled}>
          Tambahkan Kisah
        </Button>
      </div>
    </Collapsible>
  );
}
