/* components/InvitationForm.tsx */
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { CalendarIcon, UploadIcon } from 'lucide-react';

// Schema definitions remain the same...
const eventSchema = z.discriminatedUnion('eventType', [
  z.object({
    eventType: z.literal('khitanan'),
    content: z.object({ parents: z.object({ father: z.string(), mother: z.string() }), children: z.array(z.object({ name: z.string(), order: z.string(), nickname: z.string() })) }),
  }),
  z.object({
    eventType: z.literal('pernikahan'),
    content: z.object({
      parents: z.object({ bride: z.object({ father: z.string(), mother: z.string() }), groom: z.object({ father: z.string(), mother: z.string() }) }),
      children: z.array(z.object({ name: z.string(), order: z.string(), nickname: z.string(), profile: z.string().url().optional() })),
    }),
  }),
]);

const baseSchema = z.object({
  eventType: z.union([z.literal('khitanan'), z.literal('pernikahan')]),
  theme: z.object({ textColor: z.string(), accentColor: z.string(), defaultBgImage: z.string().url(), defaultBgImage1: z.string().url() }),
  content: z.object({
    event: z.object({ iso: z.string().datetime(), date: z.string(), note: z.string(), time: z.string(), title: z.string(), location: z.string(), mapsLink: z.string().url() }),
    quotes: z.object({ latin: z.string(), arabic: z.string(), importantEvent: z.string() }),
    gallery: z.object({ items: z.array(z.string().url()) }),
    invitation: z.string(), parents: z.any(), children: z.array(z.any()),
  }),
});

const formSchema = baseSchema.and(eventSchema);

type FormValues = z.infer<typeof formSchema>;

export default function InvitationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: 'khitanan',
      theme: { textColor: '#000', accentColor: '#4a281e', defaultBgImage: '', defaultBgImage1: '' },
      content: { event: { iso: new Date().toISOString(), date: '', note: 'WIB', time: '', title: '', location: '', mapsLink: '' }, quotes: { latin: 'Bismillahirrahmanirrahim', arabic: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ', importantEvent: '' }, gallery: { items: [] }, invitation: '', parents: {}, children: [] },
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    onDrop: (files) => {
      const urls = files.map((file) => URL.createObjectURL(file));
      form.setValue('content.gallery.items', urls);
    },
  });

  const eventType = form.watch('eventType');

  const onSubmit = (values: FormValues) => {
    const payload = { /* transform into NNATI format */ };
    console.log(JSON.stringify(payload, null, 2));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">

        {/* Jenis Acara */}
        <FormField name="eventType" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Acara</FormLabel>
            <FormControl>
              <Select {...field}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Pilih jenis acara" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="khitanan">Khitanan</SelectItem>
                  <SelectItem value="pernikahan">Pernikahan</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Detail Acara */}
        <Card>
          <CardHeader><CardTitle>Detail Acara</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul */}
            <FormField name="content.event.title" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Acara</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Tanggal */}
            <FormField name="content.event.iso" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {field.value ? new Date(field.value).toLocaleDateString() : 'Pilih tanggal'}
                        <CalendarIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar mode="single" selected={new Date(field.value)} onSelect={(d) => field.onChange(d?.toISOString()!)} />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Waktu */}
            <FormField name="content.event.time" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu</FormLabel>
                <FormControl><Input {...field} placeholder="HH:MM" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Lokasi */}
            <FormField name="content.event.location" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Maps Link */}
            <FormField name="content.event.mapsLink" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Link Maps</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Orang Tua */}
        <Card>
          <CardHeader><CardTitle>{eventType === 'khitanan' ? 'Orang Tua' : 'Orang Tua Pengantin'}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventType === 'khitanan' ? (
              <>
                <FormField name="content.parents.father" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Ayah</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="content.parents.mother" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Ibu</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </>
            ) : (
              <>
                {/* Groom Parents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Pengantin Pria</h4>
                  <FormField name="content.parents.groom.father" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ayah</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="content.parents.groom.mother" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ibu</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                {/* Bride Parents */}
                <div className="space-y-4">
                  <h4 className="font-medium">Pengantin Wanita</h4>
                  <FormField name="content.parents.bride.father" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ayah</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="content.parents.bride.mother" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ibu</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
          <CardContent>
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
              <input {...getInputProps()} />
              <UploadIcon className="mx-auto mb-2 h-6 w-6" />
              <p className="text-sm">Drop files atau klik untuk upload</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {form.watch('content.gallery.items').map((url, i) => (
                <img key={i} src={url} alt={`preview-${i}`} className="rounded-lg h-32 w-full object-cover" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Generate JSON</Button>
      </form>
    </Form>
  );
}
