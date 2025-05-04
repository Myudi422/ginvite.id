'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pernikahanSchema, type FormValues } from './schema';
import { FontSection } from './FontSection';
import { EventSection } from './EventSection';
import { GallerySection } from './GallerySection';
import { ParentsSection } from './ParentsSection';
import { ChildrenSection } from './ChildrenSection';
import { StorySection } from './StorySection';
import { InvitationNoteSection } from './InvitationNoteSection';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  previewUrl: string;
  userId: number;
  contentData: FormValues;
  initialStatus: number;
}

export function PernikahanForm({ previewUrl, userId, contentData, initialStatus }: Props) {
  const params = useParams();
  const router = useRouter();
  const invId = Number(params.id);
  const initialSlug = params.title;
  const [slug, setSlug] = useState(initialSlug);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default values
  const defaultFormValues: FormValues = {
    font: { body: '', heading: '', special: '' },
    event: { iso: '', date: '', note: '', time: '', title: '', location: '', mapsLink: '' },
    gallery: { items: [] },
    parents: { bride: { father: '', mother: '' }, groom: { father: '', mother: '' } },
    children: [],
    our_story: [],
    invitationNote: '',
  };

  const isNew = Object.keys(contentData).length === 0;

  const form = useForm<FormValues>({
    resolver: isNew ? undefined : zodResolver(pernikahanSchema),
    defaultValues: isNew ? defaultFormValues : contentData,
  });

  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value);

  // Bypass validation: always get current values, even if fields blank
  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = form.getValues();
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, id: invId, title: slug, content: JSON.stringify(data) }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);

      const newPath = `/admin/formulir/${invId}/${encodeURIComponent(slug)}`;
      router.replace(newPath);
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) iframe.src = `/undang/${invId}/${slug}?cb=${Date.now()}`;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onToggle = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, id: invId, title: slug, status: status === 1 ? 0 : 1 }),
        }
      );
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      setStatus(json.data.status);
    } catch (e: any) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <FormField name="slug" control={form.control} render={() => (
          <FormItem>
            <FormLabel>Title (Slug)</FormLabel>
            <FormControl>
              <Input value={slug} onChange={onSlugChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FontSection />
        <EventSection />
        <GallerySection />
        <ParentsSection />
        <ChildrenSection />
        <StorySection />
        <InvitationNoteSection />

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSave} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
          <Button variant="outline" onClick={() => console.log('Preview', form.getValues())}>
            Pratinjau
          </Button>
          <Button onClick={onToggle} disabled={saving}>
            {status === 1 ? 'Non-aktifkan' : 'Aktifkan'}
          </Button>
        </div>
        {error && <p className="text-red-600">Error: {error}</p>}
      </form>
    </FormProvider>
  );
}
