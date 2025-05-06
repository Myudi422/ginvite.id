'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible } from './Collapsible';
import type { FormValues } from './schema';
import { SketchPicker } from 'react-color'; // Import SketchPicker

// Endpoint untuk auto-save konten
const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

interface FontSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

// Daftar font yang sudah di-import di styles/font.css
const FONT_OPTIONS: { label: string; css: string; family: string }[] = [
  { label: 'Montserrat', css: "font-family: 'Montserrat', sans-serif;", family: "'Montserrat', sans-serif" },
  { label: 'Great Vibes', css: "font-family: 'Great Vibes', cursive;", family: "'Great Vibes', cursive" },
  { label: 'Handyrush', css: "font-family: 'Handyrush', cursive;", family: "'Handyrush', cursive" },
  { label: 'Balmy 2', css: "font-family: 'Balmy 2', serif;", family: "'Balmy 2', serif" },
  { label: 'Gloock', css: "font-family: 'Gloock', serif;", family: "'Gloock', serif" },
  { label: 'Faustina', css: "font-family: 'Faustina', serif;", family: "'Faustina', serif" },
];

export function FontSection({ userId, invitationId, slug, onSavedSlug }: FontSectionProps) {
  const { control, getValues, setValue } = useFormContext<FormValues>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayTextColorPicker, setDisplayTextColorPicker] = useState(false);
  const [displayAccentColorPicker, setDisplayAccentColorPicker] = useState(false);

  // Fungsi auto-save yang mengirim seluruh konten form ke server
  const autoSave = useCallback(async () => { // Tambahkan useCallback di sini juga untuk dependensi yang benar
    setSaving(true);
    setError(null);
    try {
      const data = getValues();
      const contentPayload = {
        ...data,
        event: { ...data.event, title: slug },
      };
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify(contentPayload),
        waktu_acara: data.event.date,
        time: data.event.time,
        location: data.event.location,
        mapsLink: data.event.mapsLink,
      };

      const res = await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Auto-save gagal');
      }
      // Refresh preview iframe
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error auto-save FontSection:', err);
    } finally {
      setSaving(false);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug, setValue]); // Tambahkan dependensi yang digunakan di dalam autoSave

  const handleTextColorChange = useCallback((color: { hex: string }) => {
    setValue('font.color.text_color', color.hex);
    autoSave();
  }, [setValue, autoSave]);

  const handleAccentColorChange = useCallback((color: { hex: string }) => {
    setValue('font.color.accent_color', color.hex);
    autoSave();
  }, [setValue, autoSave]);

  const handleClickTextColorPicker = useCallback(() => {
    setDisplayTextColorPicker(prev => !prev);
  }, []);

  const handleCloseTextColorPicker = useCallback(() => {
    setDisplayTextColorPicker(false);
  }, []);

  const handleClickAccentColorPicker = useCallback(() => {
    setDisplayAccentColorPicker(prev => !prev);
  }, []);

  const handleCloseAccentColorPicker = useCallback(() => {
    setDisplayAccentColorPicker(false);
  }, []);

  const textColorPopover = {
    position: 'absolute' as 'absolute',
    zIndex: 2,
    marginTop: '8px',
  };

  const accentColorPopover = {
    position: 'absolute' as 'absolute',
    zIndex: 2,
    marginTop: '8px',
  };

  const cover = {
    position: 'fixed' as 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  return (
    <Collapsible title="Tampilan (Font & Warna)">
      {(['body', 'heading', 'special'] as const).map((fieldKey) => (
        <FormField
          key={fieldKey}
          control={control}
          name={`font.${fieldKey}` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{fieldKey}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    autoSave();
                  }}
                  disabled={saving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih font..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.label}
                        value={opt.css}
                        style={{ fontFamily: opt.family }}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {/* Color Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <FormItem>
            <FormLabel>Warna Teks</FormLabel>
            <FormControl>
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                  style={{ backgroundColor: getValues('font.color.text_color') }}
                  onClick={handleClickTextColorPicker}
                />
                {displayTextColorPicker ? (
                  <div style={textColorPopover}>
                    <div style={cover} onClick={handleCloseTextColorPicker} />
                    <SketchPicker color={getValues('font.color.text_color')} onChange={handleTextColorChange} />
                  </div>
                ) : null}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div>
          <FormItem>
            <FormLabel>Warna Aksen</FormLabel>
            <FormControl>
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                  style={{ backgroundColor: getValues('font.color.accent_color') }}
                  onClick={handleClickAccentColorPicker}
                />
                {displayAccentColorPicker ? (
                  <div style={accentColorPopover}>
                    <div style={cover} onClick={handleCloseAccentColorPicker} />
                    <SketchPicker color={getValues('font.color.accent_color')} onChange={handleAccentColorChange} />
                  </div>
                ) : null}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      </div>

      {error && <p className="text-red-600 mt-2">Error: {error}</p>}
    </Collapsible>
  );
}