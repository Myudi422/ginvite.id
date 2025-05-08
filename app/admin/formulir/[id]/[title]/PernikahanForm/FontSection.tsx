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
import { SketchPicker } from 'react-color';

// Import Server Action
import { saveContentAction } from '@/app/actions/saveContent';

interface FontSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

const FONT_OPTIONS = [
  { label: 'Montserrat', css: "font-family: 'Montserrat', sans-serif;", family: "'Montserrat', sans-serif" },
  { label: 'Great Vibes', css: "font-family: 'Great Vibes', cursive;", family: "'Great Vibes', cursive" },
  { label: 'Handyrush', css: "font-family: 'Handyrush', cursive;", family: "'Handyrush', cursive" },
  { label: 'Balmy 2', css: "font-family: 'Balmy 2', serif;", family: "'Balmy 2', serif" },
  { label: 'Gloock', css: "font-family: 'Gloock', serif;", family: "'Gloock', serif" },
  { label: 'Faustina', css: "font-family: 'Faustina', serif;", family: "'Faustina', serif" },
];

export function FontSection({ userId, invitationId, slug, onSavedSlug }: FontSectionProps) {
  const { control, getValues, setValue } = useFormContext<FormValues>();
  const [displayTextColorPicker, setDisplayTextColorPicker] = useState(false);
  const [displayAccentColorPicker, setDisplayAccentColorPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Server Action wrapper
  const autoSave = useCallback(async () => {
    setError(null);
    try {
      const data = getValues();
      const contentPayload = { ...data, event: { ...data.event, title: slug } };
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
      // Panggil server action
      await saveContentAction(payload);
      // Refresh preview
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
    } catch (err: any) {
      setError(err.message);
      console.error('Server action saveContent gagal:', err);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug]);

  const handleTextColorChange = useCallback(
    (color: { hex: string }) => {
      setValue('font.color.text_color', color.hex);
      autoSave();
    },
    [setValue, autoSave]
  );

  const handleAccentColorChange = useCallback(
    (color: { hex: string }) => {
      setValue('font.color.accent_color', color.hex);
      autoSave();
    },
    [setValue, autoSave]
  );

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
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih font..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.label} value={opt.css} style={{ fontFamily: opt.family }}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormItem>
          <FormLabel>Warna Teks</FormLabel>
          <FormControl>
            <div className="relative">
              <div
                className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                style={{ backgroundColor: getValues('font.color.text_color') }}
                onClick={() => setDisplayTextColorPicker((v) => !v)}
              />
              {displayTextColorPicker && (
                <div className="absolute z-20 mt-2">
                  <div className="fixed inset-0" onClick={() => setDisplayTextColorPicker(false)} />
                  <SketchPicker color={getValues('font.color.text_color')} onChange={handleTextColorChange} />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Warna Aksen</FormLabel>
          <FormControl>
            <div className="relative">
              <div
                className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                style={{ backgroundColor: getValues('font.color.accent_color') }}
                onClick={() => setDisplayAccentColorPicker((v) => !v)}
              />
              {displayAccentColorPicker && (
                <div className="absolute z-20 mt-2">
                  <div className="fixed inset-0" onClick={() => setDisplayAccentColorPicker(false)} />
                  <SketchPicker color={getValues('font.color.accent_color')} onChange={handleAccentColorChange} />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>

      {error && <p className="text-red-600 mt-2">Error: {error}</p>}
    </Collapsible>
  );
}
