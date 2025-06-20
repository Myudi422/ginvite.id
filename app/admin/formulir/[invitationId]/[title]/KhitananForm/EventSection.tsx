// components/EventSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
  const { control, getValues } = useFormContext<any>();
  const khitanan = useWatch({ control, name: 'event.khitanan' });

  // auto-save kapanpun khitanan berubah
  useEffect(() => {
    const timer = setTimeout(async () => {
      const data = getValues();
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
        waktu_acara: data.event.khitanan?.date,
        time: data.event.khitanan?.time,
        location: data.event.khitanan?.location,
        mapsLink: data.event.khitanan?.mapsLink,
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
  }, [khitanan, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Detail Acara Khitanan">
      <h4 className="font-semibold mt-2">Khitanan</h4>
      <FormField name="event.khitanan.date" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Tanggal</FormLabel>
          <FormControl><Input type="date" {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.khitanan.time" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Waktu</FormLabel>
          <FormControl><Input type="time" {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.khitanan.location" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Lokasi</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.khitanan.mapsLink" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Link Maps</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </Collapsible>
  );
}
