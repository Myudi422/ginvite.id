'use client';

import React, { useState } from 'react'; // Hapus useEffect sementara
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
import { useRouter } from 'next/navigation'; // Import useRouter

interface Props {
  previewUrl:      string;
  userId:          number;
  invitationId:    number;
  initialSlug:     string;         // NEW: the real slug/title
  contentData:     Partial<Omit<FormValues, 'event'>>; // Content tanpa event
  initialStatus:   number;
  initialEventData: Partial<FormValues['event']>; // Data event dari record
}

// endpoints
const SAVE_URL   = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';
const TOGGLE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status';

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
    font:           { body:'',heading:'',special:'' },
    gallery:        { items:[] },
    parents:        { bride:{father:'',mother:''}, groom:{father:'',mother:''} },
    children:       [],
    our_story:      [],
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
      title: initialSlug, // Atau ambil dari initialEventData jika perlu
      location: '',
      mapsLink: '',
      ...initialEventData, // Gabungkan dengan data event dari record
    },
  };

  // State untuk slug sebenarnya (untuk URL dan preview)
  const [slug, setSlug]       = useState(initialSlug);
  // State untuk nilai input slug (perubahan real-time)
  const [inputSlug, setInputSlug] = useState(initialSlug);
  const [status, setStatus]   = useState(initialStatus);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string|null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: isNew ? undefined : zodResolver(pernikahanSchema),
    defaultValues: initialValues,
  });

  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update inputSlug secara real-time
    const newSlug = e.target.value.toLowerCase().replace(/\s+/g, '-');
    setInputSlug(newSlug);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = form.getValues();
      // Gunakan inputSlug sebagai slug yang akan disimpan
      const slugToSave = inputSlug;
      // Make sure the event.title inside content matches the slug
      const contentPayload = {
        ...data,
        event: { ...data.event, title: slugToSave },
      };

      const payload = {
        user_id: userId,
        id:      invitationId,       // still send content_user.id to API
        title:   slugToSave,
        content: JSON.stringify(contentPayload),
        waktu_acara: data.event.date, // Kirim juga waktu_acara
        time: data.event.time,       // Kirim juga time
        location: data.event.location, // Kirim juga location
        mapsLink: data.event.mapsLink, // Kirim juga mapsLink
      };

      console.log('Saving payload:', payload);

      const res = await fetch(SAVE_URL, {
        method:   'POST',
        headers: { 'Content-Type': 'application/json' },
        body:     JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Unknown error');
      }

      // Update slug state setelah penyimpanan berhasil
      setSlug(slugToSave);

      // Refresh the current route to update the URL in the address bar
      router.replace(`/admin/formulir/${userId}/${encodeURIComponent(slugToSave)}`);

      // Reload the preview iframe with the new slug
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(slugToSave)}`;
      }

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
      const payload = {
        user_id: userId,
        id:      invitationId,
        title:   slug, // Gunakan slug yang terakhir disimpan
        status:  status === 1 ? 0 : 1,
      };
      console.log('Toggling payload:', payload);

      const res = await fetch(TOGGLE_URL, {
        method:   'POST',
        headers: { 'Content-Type':'application/json' },
        body:     JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Unknown error');
      }
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
          <Button variant="outline" onClick={() => {
            console.log('Pratinjau dengan slug:', slug, form.getValues());
            // Pratinjau seharusnya menggunakan slug yang terakhir disimpan
            const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
            if (iframe) {
              iframe.src = `/undang/${userId}/${encodeURIComponent(slug)}`;
            }
          }}>
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