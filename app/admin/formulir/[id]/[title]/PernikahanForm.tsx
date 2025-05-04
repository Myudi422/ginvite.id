'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Schema definition
const pernikahanSchema = z.object({
  font: z.object({
    body: z.string(),
    heading: z.string(),
    special: z.string(),
  }),
  event: z.object({
    iso: z.string(),
    date: z.string(),
    note: z.string(),
    time: z.string(),
    title: z.string(),
    location: z.string(),
    mapsLink: z.string().url(),
  }),
  gallery: z.object({ items: z.array(z.string().url()).min(1) }),
  parents: z.object({
    bride: z.object({ father: z.string().min(2), mother: z.string().min(2) }),
    groom: z.object({ father: z.string().min(2), mother: z.string().min(2) }),
  }),
  children: z
    .array(
      z.object({
        name: z.string().min(1),
        order: z.enum(['Pengantin Pria', 'Pengantin Wanita']),
        nickname: z.string().optional(),
        profile: z.string().url().optional(),
      })
    )
    .min(2),
  our_story: z
    .array(
      z.object({
        title: z.string().min(1),
        pictures: z.array(z.string().url()).min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
  invitationNote: z.string().optional(),
});
type FormValues = z.infer<typeof pernikahanSchema>;

interface PernikahanFormProps {
  previewUrl: string;
  userId: number;
  invitation: any;
  contentData: FormValues;
}

export default function PernikahanForm({ previewUrl, userId }: PernikahanFormProps) {
  const router = useRouter();
  const params = useParams();
  const invId = Number(params.id);
  const title = params.title;

  const [status, setStatus] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(pernikahanSchema),
  });

  const galleryFields = useFieldArray({ control: form.control, name: 'gallery.items' });
  const childrenFields = useFieldArray({ control: form.control, name: 'children' });
  const storyFields = useFieldArray({ control: form.control, name: 'our_story' });

  // Fetch initial data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://ccgnimex.my.id/v2/android/ginvite/index.php` +
            `?action=get_content_user&user_id=${userId}` +
            `&id=${invId}&title=${encodeURIComponent(title)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.status !== 'success' || !json.data.length) {
          throw new Error(json.message || 'Data tidak ditemukan');
        }
        const rec = json.data[0];
        const content = JSON.parse(rec.content);
        setStatus(rec.status);
        form.reset(content);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, invId, title, form]);

  // Save handler
  const onSave = form.handleSubmit(async (data) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        user_id: userId,
        id: invId,
        title,
        content: JSON.stringify(data),
      };
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      alert('Data berhasil disimpan');

      // Reload iframe preview
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `${previewUrl}?cb=${Date.now()}`;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  });

  // Toggle status handler
  const onToggle = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            id: invId,
            title,
            status: status === 1 ? 0 : 1,
          }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      setStatus(json.data.status);
      alert('Status telah diubah');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* FONT */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Font</legend>
          {(['body', 'heading', 'special'] as const).map((k) => (
            <FormField key={k} control={form.control} name={`font.${k}`} render={({ field }) => (
              <FormItem>
                <FormLabel>{k}</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          ))}
        </fieldset>

        {/* EVENT */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Detail Acara</legend>
          {/* hidden fields */}
          <Controller name="event.iso" control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
          <Controller name="event.note" control={form.control} render={({ field }) => <input type="hidden" {...field} />} />

          <FormField control={form.control} name="event.date" render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="event.time" render={({ field }) => (
            <FormItem>
              <FormLabel>Waktu</FormLabel>
              <FormControl><Input type="time" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="event.title" render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Acara</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="event.location" render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="event.mapsLink" render={({ field }) => (
            <FormItem>
              <FormLabel>Link Maps</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </fieldset>

        {/* GALLERY */}
        <fieldset className="space-y-2">
          <legend className="text-lg font-semibold">Gallery</legend>
          {galleryFields.fields.map((item, i) => (
            <Controller key={item.id} control={form.control} name={`gallery.items.${i}`} render={({ field }) => <Input {...field} />} />
          ))}
        </fieldset>

        {/* PARENTS */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Orang Tua</legend>
          {(['bride', 'groom'] as const).map((who) => (
            <div key={who} className="grid grid-cols-2 gap-4">
              {(['father', 'mother'] as const).map((r) => (
                <FormField key={r} control={form.control} name={`parents.${who}.${r}`} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{who === 'bride' ? 'Pengantin Wanita' : 'Pengantin Pria'} – {r}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
            </div>
          ))}
        </fieldset>

        {/* CHILDREN */}
        <fieldset className="space-y-2">
          <legend className="text-lg font-semibold">Pengantin</legend>
          {childrenFields.fields.map((item, i) => (
            <div key={item.id} className="grid grid-cols-3 gap-2">
              <Controller name={`children.${i}.name`} control={form.control} render={({ field }) => <Input placeholder="Nama" {...field} />} />
              <Controller name={`children.${i}.order`} control={form.control} render={({ field }) => <Input placeholder="Order" {...field} />} />
              <Controller name={`children.${i}.profile`} control={form.control} render={({ field }) => <Input placeholder="URL Foto" {...field} />} />
            </div>
          ))}
        </fieldset>

        {/* OUR STORY */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Our Story</legend>
          {storyFields.fields.map((item, i) => (
            <div key={item.id} className="border p-4 rounded-lg space-y-2">
              <Controller name={`our_story.${i}.title`} control={form.control} render={({ field }) => <Input placeholder="Judul Cerita" {...field} />} />
              <Controller name={`our_story.${i}.description`} control={form.control} render={({ field }) => <Textarea placeholder="Deskripsi" {...field} />} />
              <Controller name={`our_story.${i}.pictures.0`} control={form.control} render={({ field }) => <Input placeholder="URL Gambar 1" {...field} />} />
            </div>
          ))}
        </fieldset>

        {/* INVITATION NOTE */}
        <FormField control={form.control} name="invitationNote" render={({ field }) => (
          <FormItem>
            <FormLabel>Catatan Undangan</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSave} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
          <Button variant="outline" onClick={() => form.handleSubmit((d) => console.log('Preview', d))()}>
            Pratinjau
          </Button>
          <Button onClick={onToggle} disabled={saving}>
            {status === 1 ? 'Non‑aktifkan' : 'Aktifkan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
