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

interface Props {
  previewUrl:    string;
  userId:        number;
  invitationId:  number;
  initialSlug:   string;           // NEW: the real slug/title
  contentData:   Partial<FormValues>;
  initialStatus: number;
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
  initialStatus
}: Props) {
  // defaults
  const defaultValues: FormValues = {
    font:           { body:'',heading:'',special:'' },
    event:          { iso:'',date:'',note:'',time:'',title:'',location:'',mapsLink:'' },
    gallery:        { items:[] },
    parents:        { bride:{father:'',mother:''}, groom:{father:'',mother:''} },
    children:       [],
    our_story:      [],
    invitationNote: ''
  };

  const isNew = Object.keys(contentData).length === 0;
  const initialValues = isNew
    ? defaultValues
    : { ...defaultValues, ...contentData } as FormValues;

  // initialize slug from record.title
  const [slug, setSlug]     = useState(initialSlug);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string|null>(null);

  const form = useForm<FormValues>({
    resolver: isNew ? undefined : zodResolver(pernikahanSchema),
    defaultValues: {
      ...initialValues,
      event: { ...initialValues.event, title: initialSlug }  // sync event.title
    },
  });

  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const data = form.getValues();
      // Make sure the event.title inside content matches the slug
      const contentPayload = {
        ...data,
        event: { ...data.event, title: slug },
      };
  
      const payload = {
        user_id: userId,
        id:      invitationId,    // still send content_user.id to API
        title:   slug,
        content: JSON.stringify(contentPayload),
      };
  
      console.log('Saving payload:', payload);
  
      const res = await fetch(SAVE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Unknown error');
      }
  
      // ——— Now refresh the browser URL with userId + slug ———
      window.history.replaceState(
        null,
        '',
        `/admin/formulir/${userId}/${encodeURIComponent(slug)}`
      );
  
      // ——— And reload the preview iframe with the same userId + slug ———
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(slug)}`;
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
        title:   slug,
        status:  status === 1 ? 0 : 1,
      };
      console.log('Toggling payload:', payload);

      const res = await fetch(TOGGLE_URL, {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify(payload),
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
          render={() => (
            <FormItem>
              <FormLabel>Title (Slug)</FormLabel>
              <FormControl>
                <Input value={slug} onChange={onSlugChange} />
              </FormControl>
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
