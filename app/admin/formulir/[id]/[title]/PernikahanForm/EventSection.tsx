// components/PernikahanForm/EventSection.tsx
'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function EventSection() {
  const { control, watch, setValue } = useFormContext<any>();
  const showAkad = Boolean(watch('event.akad'));

  return (
    <Collapsible title="Detail Acara">
      {/* Resepsi */}
      <h4 className="font-semibold mt-2">Resepsi</h4>
      <FormField name="event.resepsi.date" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Tanggal</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.resepsi.time" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Waktu</FormLabel>
          <FormControl><Input type="time" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.resepsi.location" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Lokasi</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField name="event.resepsi.mapsLink" control={control} render={({ field }) => (
        <FormItem>
          <FormLabel>Link Maps</FormLabel>
          <FormControl><Input {...field}/></FormControl>
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
                note: '',
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
              <FormControl><Input type="date" {...field}/></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="event.akad.time" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu</FormLabel>
              <FormControl><Input type="time" {...field}/></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="event.akad.location" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl><Input {...field}/></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField name="event.akad.mapsLink" control={control} render={({ field }) => (
            <FormItem>
              <FormLabel>Link Maps</FormLabel>
              <FormControl><Input {...field}/></FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
        </>
      )}
    </Collapsible>
  );
}
