'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { useRouter } from 'next/navigation';

// endpoints
const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';
const TOGGLE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status';

interface Props {
  previewUrl: string;
  userId: number;
  invitationId: number;
  initialSlug: string;
  contentData: Partial<Omit<FormValues, 'event'>>;
  initialStatus: number;
  initialEventData: Partial<FormValues['event']>;
}

export function PernikahanForm({
  previewUrl,
  userId,
  invitationId,
  initialSlug,
  contentData,
  initialStatus,
  initialEventData,
}: Props) {
  // defaults
  const defaultValues: Omit<FormValues, 'event'> = {
    font: { body: '', heading: '', special: '' },
    gallery: { items: [] },
    parents: { bride: { father: '', mother: '' }, groom: { father: '', mother: '' } },
    children: [],
    our_story: [],
    invitationNote: ''
  };

  const isNew = Object.keys(contentData).length === 0;
  const initialValuesWithoutEvent = isNew
    ? defaultValues
    : { ...defaultValues, ...contentData } as Omit<FormValues, 'event'>;

  const initialValues: FormValues = {
    ...initialValuesWithoutEvent,
    event: {
      iso: '',
      date: '',
      note: '',
      time: '',
      title: initialSlug,
      location: '',
      mapsLink: '',
      ...initialEventData,
    },
  };

  const [slug, setSlug] = useState(initialSlug);
  const [inputSlug, setInputSlug] = useState(initialSlug);
  const [toParam, setToParam] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: isNew ? undefined : zodResolver(pernikahanSchema),
    defaultValues: initialValues,
  });

  // Debounce updating preview iframe when slug or toParam changes
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        const param = toParam ? `?to=${encodeURIComponent(toParam)}` : '';
        iframe.src = `/undang/${userId}/${encodeURIComponent(slug)}${param}`;
      }
    }, 500); // delay 500ms after user stops typing
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [slug, toParam]);

  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const newSlug = raw
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setInputSlug(newSlug);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = form.getValues();
      const slugToSave = inputSlug;
      const contentPayload = { ...data, event: { ...data.event, title: slugToSave } };

      const payload = {
        user_id: userId,
        id: invitationId,
        title: slugToSave,
        content: JSON.stringify(contentPayload),
        waktu_acara: data.event.date,
        time: data.event.time,
        location: data.event.location,
        mapsLink: data.event.mapsLink,
      };

      const res = await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Unknown error');

      setSlug(slugToSave);
      router.replace(`/admin/formulir/${userId}/${encodeURIComponent(slugToSave)}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onToggle = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { user_id: userId, id: invitationId, title: slug, status: status === 1 ? 0 : 1 };
      const res = await fetch(TOGGLE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Unknown error');
      setStatus(json.data.status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {/* Slug Input */}
        <FormField
          name="slug"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul URL yang ditampilkan (Slug)</FormLabel>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 sm:text-sm">
                  ginvite.com/undang/{userId}/
                </span>
                <FormControl>
                  <Input value={inputSlug} onChange={onSlugChange} className="flex-1" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parameter "to" Input */}
        <FormItem>
          <FormLabel>Parameter Preview "to" (opsional)</FormLabel>
          <Input
            placeholder="Contoh: Rizki Wahyudi"
            value={toParam}
            onChange={e => setToParam(e.target.value)}
          />
        </FormItem>

        {/* Sections */}
        <FontSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <EventSection />
        <GallerySection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <ParentsSection />
        <ChildrenSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <StorySection />
        <InvitationNoteSection />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSave} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
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
