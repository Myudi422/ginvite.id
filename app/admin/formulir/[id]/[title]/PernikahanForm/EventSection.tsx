'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function EventSection() {
  const { control } = useFormContext();
  return (
    <Collapsible title="Detail Acara">
      <Controller name="event.iso" control={control} render={({ field }) => <input type="hidden" {...field}/>} />
      <Controller name="event.note" control={control} render={({ field }) => <input type="hidden" {...field}/>} />

      <FormField control={control} name="event.date" render={({ field }) => (
        <FormItem>
          <FormLabel>Tanggal</FormLabel>
          <FormControl><Input type="date" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={control} name="event.time" render={({ field }) => (
        <FormItem>
          <FormLabel>Waktu</FormLabel>
          <FormControl><Input type="time" {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={control} name="event.title" render={({ field }) => (
        <FormItem>
          <FormLabel>Judul Acara</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={control} name="event.location" render={({ field }) => (
        <FormItem>
          <FormLabel>Lokasi</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
      <FormField control={control} name="event.mapsLink" render={({ field }) => (
        <FormItem>
          <FormLabel>Link Maps</FormLabel>
          <FormControl><Input {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </Collapsible>
  );
}
