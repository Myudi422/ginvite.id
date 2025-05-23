// components/EventSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { autoSaveContent } from '@/app/actions/saved';

interface EventSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function EventSection({
  userId,
  invitationId,
  slug,
  onSavedSlug,
}: EventSectionProps) {
  const { control, getValues, setValue } = useFormContext<any>();
  const resepsi = useWatch({ control, name: 'event.resepsi' });
  const akad    = useWatch({ control, name: 'event.akad' });

  // auto-save kapanpun resepsi atau akad berubah
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
        if (iframe) {
          iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
        }
      } catch (e) {
        console.error('Auto-save Event gagal:', (e as Error).message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [resepsi, akad, getValues, invitationId, slug, onSavedSlug, userId]);

  const showAkad = Boolean(useWatch({ control, name: 'event.akad' }));

  return (
    <Collapsible title="Detail Acara">
      {/* Resepsi */}
      <h4 className="font-semibold mt-2">Resepsi</h4>
      <FormField name="event.resepsi.date" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Tanggal</FormLabel>
          <FormControl><Input type="date" {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.resepsi.time" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Waktu</FormLabel>
          <FormControl><Input type="time" {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.resepsi.location" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Lokasi</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.resepsi.mapsLink" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Link Maps</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>

      {/* Toggle Akad */}
      <div className="mt-4 flex items-center">
        <label className="mr-2">Tampilkan Akad?</label>
        <input
          type="checkbox"
          checked={showAkad}
          onChange={e => {
            if (e.target.checked) {
              setValue('event.akad', {
                date: '',
                time: '',
                location: '',
                mapsLink: '',
              });
            } else {
              setValue('event.akad', undefined);
            }
          }}
        />
      </div>

      {/* Akad */}
      {showAkad && (
        <>
          <h4 className="font-semibold mt-4">Akad</h4>
          <FormField name="event.akad.date" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="event.akad.time" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu</FormLabel>
              <FormControl><Input type="time" {...field} /></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="event.akad.location" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="event.akad.mapsLink" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Link Maps</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
        </>
      )}
    </Collapsible>
  );
}
