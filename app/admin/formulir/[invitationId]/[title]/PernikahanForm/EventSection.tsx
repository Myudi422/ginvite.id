// components/EventSection.tsx
'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
// dynamic import to disable SSR
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });
import { autoSaveContent } from '@/app/actions/saved';

interface EventSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function EventSection({ userId, invitationId, slug, onSavedSlug }: EventSectionProps) {
  const { control, getValues, setValue } = useFormContext<any>();
  const resepsi = useWatch({ control, name: 'event.resepsi' });
  const akad = useWatch({ control, name: 'event.akad' });

  useEffect(() => {
    const timer = setTimeout(async () => {
      const data = getValues();
      const payload: any = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
        // resepsi fields
        resepsi_date: data.event.resepsi.date,
        resepsi_time: data.event.resepsi.time,
        resepsi_location_desc: data.event.resepsi.locationDesc,
        resepsi_mapsLink: data.event.resepsi.mapsLink,
        resepsi_lat: data.event.resepsi.coords?.lat,
        resepsi_lng: data.event.resepsi.coords?.lng,
      };
      if (data.event.akad) {
        payload.akad_date = data.event.akad.date;
        payload.akad_time = data.event.akad.time;
        payload.akad_location_desc = data.event.akad.locationDesc;
        payload.akad_mapsLink = data.event.akad.mapsLink;
        payload.akad_lat = data.event.akad.coords?.lat;
        payload.akad_lng = data.event.akad.coords?.lng;
      }
      try {
        await autoSaveContent(payload);
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save Event gagal:', (e as Error).message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [resepsi, akad, getValues, invitationId, slug, onSavedSlug, userId]);

  const showAkad = Boolean(useWatch({ control, name: 'event.akad' }));

  const renderEventFields = (prefix: 'resepsi' | 'akad') => (
    <>
      <h4 className="font-semibold mt-4">{prefix === 'resepsi' ? 'Resepsi' : 'Akad'}</h4>
      <FormField name={`event.${prefix}.date`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Tanggal</FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField name={`event.${prefix}.time`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Waktu</FormLabel>
          <FormControl>
            <Input type="time" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      {/* Deskripsi custom lokasi */}
      <FormField name={`event.${prefix}.locationDesc`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Nama Lokasi (bebas)</FormLabel>
          <FormControl>
            <Input
              placeholder="Contoh: Gedung Serbaguna"
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      {/* Peta dan pencarian */}
      <FormField name={`event.${prefix}.coords`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Pilih Lokasi di Peta</FormLabel>
          <FormControl>
            {typeof window !== 'undefined' && (
              <MapPicker
                value={field.value}
                onChange={coords => {
                  field.onChange(coords);
                  const link = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
                  setValue(`event.${prefix}.mapsLink`, link);
                }}
                height={200}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      {/* Link Maps otomatis */}
      <FormField name={`event.${prefix}.mapsLink`} control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Link Maps</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              readOnly
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );

  return (
    <Collapsible title="Detail Acara">
      {renderEventFields('resepsi')}

      {/* Toggle Akad */}
      <div className="mt-4 flex items-center">
        <label className="mr-2">Tampilkan Akad?</label>
        <input
          type="checkbox"
          checked={showAkad}
          onChange={e => {
            if (e.target.checked) {
              setValue('event.akad', { date: '', time: '', locationDesc: '', mapsLink: '', coords: { lat: 0, lng: 0 } });
            } else {
              setValue('event.akad', undefined);
            }
          }}
        />
      </div>

      {showAkad && renderEventFields('akad')}
    </Collapsible>
  );
}
