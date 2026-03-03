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

  // debounce ref for input changes
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedAutoSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await autoSave();
        // also trigger refresh in LivePreview component
        window.dispatchEvent(new CustomEvent('formDataChanged'));
      } catch (e) {
        console.error('Auto-save (debounced) failed:', (e as Error).message);
      }
    }, 500);
  }, [autoSave]);

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

  // cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

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
    <Collapsible title="Cerita Kita / Our Story" defaultOpen={false}>
      {/* Toggle Header */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-xl mt-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Aktifkan Cerita Kita</h4>
          <p className="text-xs text-gray-400 mt-0.5">Ceritakan momen pertemuan hingga perjalanan cinta kalian</p>
        </div>
        <Controller
          name="our_story_enabled"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-pink-500"
            />
          )}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 space-y-4 mt-4 ${!enabled ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}>

        {fields.map((item, i) => (
          <div key={item.id} className="relative p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Header Item */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
              <h5 className="text-sm font-semibold flex items-center gap-2 text-pink-700">
                <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs">{i + 1}</span>
                Bagian Cerita
              </h5>
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={!enabled}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Hapus cerita ini"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-5">
              {/* Foto Cerita */}
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2">Foto Momen</label>
                {getValues(`our_story.${i}.pictures.0`) ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden group border border-gray-100">
                    <img
                      src={getValues(`our_story.${i}.pictures.0`)}
                      alt={`Story ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(i)}
                        disabled={!enabled || uploadingIdx === i}
                        className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transform hover:scale-110 shadow-sm"
                        title="Hapus Foto"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="relative w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    {uploadingIdx === i ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="animate-spin text-xl text-blue-500">⏳</span>
                        <span className="text-[10px] text-gray-400">Mengunggah...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-medium text-gray-500">Pilih Foto</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!enabled || uploadingIdx === i}
                      onChange={(e) => e.target.files && handleFileChange(e.target.files[0], i)}
                      className="hidden"
                    />
                  </label>
                )}
                {uploadError && uploadingIdx === i && <p className="text-[10px] text-red-500 mt-1 line-clamp-2">⚠️ {uploadError}</p>}
              </div>

              {/* Teks Cerita */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Judul Momen (Tahun/Tanggal)</label>
                  <Controller
                    name={`our_story.${i}.title`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Contoh: Awal Pertemuan (2020)"
                        disabled={!enabled}
                        className="bg-gray-50/50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
                        onChange={(e) => {
                          field.onChange(e);
                          if (enabled) debouncedAutoSave();
                        }}
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Isi Cerita</label>
                  <Controller
                    name={`our_story.${i}.description`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Ceritakan momen tersebut di sini..."
                        disabled={!enabled}
                        className="resize-none h-32 bg-gray-50/50 border-gray-200 text-sm leading-relaxed focus-visible:ring-1 focus-visible:ring-gray-300"
                        onChange={(e) => {
                          field.onChange(e);
                          if (enabled) debouncedAutoSave();
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ title: '', description: '', pictures: [] })}
          disabled={!enabled}
          className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 rounded-xl"
        >
          <span className="text-xl mr-2">+</span> Tambah Bagian Cerita Baru
        </Button>
      </div>
    </Collapsible>
  );
}
