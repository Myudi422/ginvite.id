'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const { control, getValues, setValue } = useFormContext<FormValues>();
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Capture initial defaults
  const initialTextColor = useRef(getValues('font.color.text_color') || '');
  const initialAccentColor = useRef(getValues('font.color.accent_color') || '');
  const [useDefaultText, setUseDefaultText] = useState(() => initialTextColor.current === '');
  const [useDefaultAccent, setUseDefaultAccent] = useState(() => initialAccentColor.current === '');

  // Reset when toggled to default (after render)
  useEffect(() => {
    if (useDefaultText) resetText();
  }, [useDefaultText]);

  useEffect(() => {
    if (useDefaultAccent) resetAccent();
  }, [useDefaultAccent]);

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
      if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
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

  const resetText = useCallback(() => {
    setValue('font.color.text_color', initialTextColor.current);
    autoSave();
  }, [setValue, autoSave]);

  const resetAccent = useCallback(() => {
    setValue('font.color.accent_color', initialAccentColor.current);
    autoSave();
  }, [setValue, autoSave]);

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
                <div>
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
                </div>
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
              <div className="flex items-center space-x-2">
                <input
                  id="useDefaultText"
                  type="checkbox"
                  checked={useDefaultText}
                  onChange={() => setUseDefaultText(prev => !prev)}
                />
                <label htmlFor="useDefaultText">Pakai warna default</label>
              </div>
              {!useDefaultText && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="relative inline-block">
                    <div
                      className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                      style={{ backgroundColor: getValues('font.color.text_color') || initialTextColor.current }}
                      onClick={() => setShowTextPicker(v => !v)}
                    />
                    {showTextPicker && (
                      <div className="absolute z-20 mt-2">
                        <div className="fixed inset-0" onClick={() => setShowTextPicker(false)} />
                        <SketchPicker
                          color={getValues('font.color.text_color')}
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
              <div className="flex items-center space-x-2">
                <input
                  id="useDefaultAccent"
                  type="checkbox"
                  checked={useDefaultAccent}
                  onChange={() => setUseDefaultAccent(prev => !prev)}
                />
                <label htmlFor="useDefaultAccent">Pakai warna default</label>
              </div>
              {!useDefaultAccent && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="relative inline-block">
                    <div
                      className="w-8 h-8 rounded-md shadow-md cursor-pointer"
                      style={{ backgroundColor: getValues('font.color.accent_color') || initialAccentColor.current }}
                      onClick={() => setShowAccentPicker(v => !v)}
                    />
                    {showAccentPicker && (
                      <div className="absolute z-20 mt-2">
                        <div className="fixed inset-0" onClick={() => setShowAccentPicker(false)} />
                        <SketchPicker
                          color={getValues('font.color.accent_color')}
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
