'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';

// Server Actions
import {
  uploadImageToBackblaze,
  deleteImageFromBackblaze,
  saveGalleryContent, // reuse auto‐save helper
} from '@/app/actions/backblaze';

interface StoryItem {
  title: string;
  description: string;
  pictures: string[];
}

interface StorySectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function StorySection({
  userId,
  invitationId,
  slug,
  onSavedSlug,
}: StorySectionProps) {
  const { control, watch, setValue, getValues } = useFormContext();
  const enabled = watch('our_story_enabled', false);
  const { fields, append, remove } = useFieldArray({ control, name: 'our_story' });

  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // auto‐save helper
  const autoSave = useCallback(async () => {
    const data = getValues();
    const payload = {
      user_id: userId,
      id: invitationId,
      title: slug,
      content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
      waktu_acara: data.event.date,
      time: data.event.time,
      location: data.event.location,
      mapsLink: data.event.mapsLink,
    };
    await saveGalleryContent(payload);
    const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
    if (iframe) {
      // tambahkan param time agar iframe reload benar
      iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
    }
  }, [getValues, invitationId, onSavedSlug, slug, userId]);

  // Add useEffect for auto-save when enabled changes
  const prevEnabled = useRef(enabled);
  useEffect(() => {
    // Only auto-save when enabled actually changes, not on every render
    if (prevEnabled.current !== enabled) {
      const timer = setTimeout(async () => {
        try {
          await autoSave();
        } catch (e) {
          console.error('Auto-save Story gagal:', (e as Error).message);
        }
      }, 500);
      
      prevEnabled.current = enabled;
      return () => clearTimeout(timer);
    }
    prevEnabled.current = enabled;
  }, [enabled]);

  // handle upload foto cerita
  const handleFileChange = useCallback(async (file: File, idx: number) => {
    if (!enabled) return;
    setUploadingIdx(idx);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const url = await uploadImageToBackblaze(formData, userId, invitationId);

      // update our_story[idx].pictures
      const current = getValues('our_story') as StoryItem[];
      current[idx].pictures = [url];
      setValue('our_story', current);

      await autoSave();
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploadingIdx(null);
    }
  }, [enabled, getValues, invitationId, setValue, autoSave, userId]);

  // handle delete foto cerita
  const handleDeleteImage = useCallback(async (idx: number) => {
    if (!enabled) return;
    const url = getValues(`our_story.${idx}.pictures.0`);
    if (!url) return;

    setUploadingIdx(idx);
    setUploadError(null);

    try {
      await deleteImageFromBackblaze(url);

      const current = getValues('our_story') as StoryItem[];
      current[idx].pictures = [];
      setValue('our_story', current);

      await autoSave();
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploadingIdx(null);
    }
  }, [enabled, getValues, setValue, autoSave]);

  return (
    <Collapsible title="Our Story">
      {/* toggle enable/disable */}
      <div className="pt-4 flex items-center space-x-2 mb-4">
        <Controller
          name="our_story_enabled"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <span className="text-sm font-medium">
          {enabled ? 'Aktif' : 'Nonaktif'}
        </span>
      </div>

      {/* list cerita */}
      <div className="space-y-6">
        {fields.map((item, i) => (
          <div
            key={item.id}
            className={`border p-4 rounded-lg space-y-4 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}
          >
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
                <Input {...field} placeholder="Judul Cerita" disabled={!enabled} />
              )}
            />

            <Controller
              name={`our_story.${i}.description`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Textarea {...field} placeholder="Deskripsi" disabled={!enabled} className="resize-none" />
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
                    onClick={() => handleDeleteImage(i)}
                    disabled={!enabled || uploadingIdx === i}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  disabled={!enabled || uploadingIdx === i}
                  onChange={(e) => e.target.files && handleFileChange(e.target.files[0], i)}
                  className="block"
                />
              )}
              {uploadingIdx === i && <p className="text-sm text-yellow-600 mt-1">Mengunggah…</p>}
              {uploadError && uploadingIdx === i && (
                <p className="text-sm text-red-600 mt-1">{uploadError}</p>
              )}
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
