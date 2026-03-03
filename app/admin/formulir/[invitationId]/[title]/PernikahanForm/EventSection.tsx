// EventSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { autoSaveContent } from '@/app/actions/saved';

interface EventSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

function EventFields({ prefix, label }: { prefix: string; label: string }) {
  const { control } = useFormContext<any>();
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <FormField name={`${prefix}.date`} control={control} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-gray-500">📅 Tanggal</FormLabel>
            <FormControl><Input type="date" {...field} className="text-sm" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name={`${prefix}.time`} control={control} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-gray-500">⏰ Waktu</FormLabel>
            <FormControl><Input type="time" {...field} className="text-sm" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField name={`${prefix}.location`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-gray-500">📍 Lokasi</FormLabel>
          <FormControl><Input {...field} placeholder="Nama gedung / tempat acara" className="text-sm" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField name={`${prefix}.mapsLink`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-gray-500">🗺️ Link Google Maps</FormLabel>
          <FormControl><Input {...field} placeholder="https://maps.google.com/..." className="text-sm" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}

export function EventSection({ userId, invitationId, slug, onSavedSlug }: EventSectionProps) {
  const { control, getValues, setValue } = useFormContext<any>();
  const resepsi = useWatch({ control, name: 'event.resepsi' });
  const akad = useWatch({ control, name: 'event.akad' });
  const quoteCategory = useWatch({ control, name: 'quoteCategory' }) as string | undefined;

  const isKristen = quoteCategory?.toLowerCase().includes('kristen') ?? false;
  const secondEventLabel = isKristen ? 'Pemberkatan' : 'Akad Nikah';
  const showAkad = Boolean(akad);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const data = getValues();
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
        waktu_acara: data.event.resepsi.date,
        time: data.event.resepsi.time,
        location: data.event.resepsi.location,
        mapsLink: data.event.resepsi.mapsLink,
      };
      try {
        await autoSaveContent(payload);
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save Event gagal:', (e as Error).message);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [resepsi, akad, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <div className="space-y-5">
      {/* Resepsi */}
      <EventFields prefix="event.resepsi" label="🎊 Resepsi" />

      {/* Divider + toggle Akad */}
      <div className="border-t border-gray-100 pt-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showAkad}
              onChange={e => {
                if (e.target.checked) {
                  setValue('event.akad', { date: '', time: '', location: '', mapsLink: '' });
                } else {
                  setValue('event.akad', undefined);
                }
              }}
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${showAkad ? 'bg-pink-500' : 'bg-gray-200'}`} />
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showAkad ? 'translate-x-5' : ''}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">Tampilkan {secondEventLabel}?</span>
        </label>
      </div>

      {/* Akad / Pemberkatan */}
      {showAkad && (
        <div className="bg-pink-50/50 rounded-xl p-4 border border-pink-100">
          <EventFields prefix="event.akad" label={`💍 ${secondEventLabel}`} />
        </div>
      )}
    </div>
  );
}
