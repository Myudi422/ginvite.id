'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
import { saveContentAction } from '@/app/actions/SaveContent';

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
  const { control, getValues, setValue, watch } = useFormContext<FormValues>();
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track whether default colors are used
  const [useDefaultText, setUseDefaultText] = useState(() => !getValues('font.color.text_color'));
  const [useDefaultAccent, setUseDefaultAccent] = useState(() => !getValues('font.color.accent_color'));

  // Keep last picked colors
  const textColor = watch('font.color.text_color');
  const accentColor = watch('font.color.accent_color');
  const [lastTextColor, setLastTextColor] = useState(textColor || '');
  const [lastAccentColor, setLastAccentColor] = useState(accentColor || '');

  // Sync last picked when user selects a new color
  useEffect(() => {
    if (textColor) {
      setLastTextColor(textColor);
    }
  }, [textColor]);

  useEffect(() => {
    if (accentColor) {
      setLastAccentColor(accentColor);
    }
  }, [accentColor]);

  const autoSave = useCallback(async () => {
    setError(null);
    try {
      const data = getValues();
      const contentPayload = { ...data, event: { ...data.event, title: slug } };
      await saveContentAction({
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify(contentPayload),
        waktu_acara: data.event.date,
        time: data.event.time,
        location: data.event.location,
        mapsLink: data.event.mapsLink,
      });
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
      }
    } catch (err: any) {
      console.error('SaveContent gagal:', err);
      setError(err.message);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug]);

  const handleTextComplete = useCallback((color: { hex: string }) => {
    setValue('font.color.text_color', color.hex);
    autoSave();
  }, [setValue, autoSave]);

  const handleAccentComplete = useCallback((color: { hex: string }) => {
    setValue('font.color.accent_color', color.hex);
    autoSave();
  }, [setValue, autoSave]);

  // Toggle default text color
  const onToggleDefaultText = () => {
    const next = !useDefaultText;
    setUseDefaultText(next);
    if (next) {
      setValue('font.color.text_color', '');
    } else {
      setValue('font.color.text_color', lastTextColor);
    }
    autoSave();
  };

  // Toggle default accent color
  const onToggleDefaultAccent = () => {
    const next = !useDefaultAccent;
    setUseDefaultAccent(next);
    if (next) {
      setValue('font.color.accent_color', '');
    } else {
      setValue('font.color.accent_color', lastAccentColor);
    }
    autoSave();
  };

  return (
    <Collapsible title="Tampilan (Font & Warna)">
      {/* Font selectors */}
      {(['body', 'heading', 'special'] as const).map((fieldKey) => (
        <FormField
          key={fieldKey}
          control={control}
          name={`font.${fieldKey}`}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Text Color */}
        <FormItem>
          <FormLabel>Warna Teks</FormLabel>
          <FormControl>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useDefaultText}
                  onChange={onToggleDefaultText}
                />
                <span>Pakai warna default</span>
              </label>
              {!useDefaultText && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="relative inline-block">
                    <div
                      className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                      style={{ backgroundColor: textColor || lastTextColor || '#fff' }}
                      onClick={() => setShowTextPicker((v) => !v)}
                    />
                    {showTextPicker && (
                      <div className="absolute z-20 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => setShowTextPicker(false)}
                        />
                        <SketchPicker
                          color={textColor || lastTextColor}
                          onChangeComplete={handleTextComplete}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Accent Color */}
        <FormItem>
          <FormLabel>Warna Aksen</FormLabel>
          <FormControl>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useDefaultAccent}
                  onChange={onToggleDefaultAccent}
                />
                <span>Pakai warna default</span>
              </label>
              {!useDefaultAccent && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="relative inline-block">
                    <div
                      className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                      style={{ backgroundColor: accentColor || lastAccentColor || '#fff' }}
                      onClick={() => setShowAccentPicker((v) => !v)}
                    />
                    {showAccentPicker && (
                      <div className="absolute z-20 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => setShowAccentPicker(false)}
                        />
                        <SketchPicker
                          color={accentColor || lastAccentColor}
                          onChangeComplete={handleAccentComplete}
                        />
                      </div>
                    )}
                  </div>
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
