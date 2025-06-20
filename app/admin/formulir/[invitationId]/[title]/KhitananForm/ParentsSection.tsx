// components/ParentsSection.tsx
'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext, useWatch } from 'react-hook-form';
import { Collapsible } from './Collapsible';

// panggil helper autosave (Server Action)
import { autoSaveContent } from '@/app/actions/saved';
import React from 'react';

interface ParentsSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function ParentsSection({
  userId,
  invitationId,
  slug,
  onSavedSlug,
}: ParentsSectionProps) {
  const { control, getValues } = useFormContext();

  // watch field parents
  const parents = useWatch({ control, name: 'parents' });

  // debounce sederhana sebelum autosave
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
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
        // optionally refresh iframe
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement|null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save Parents gagal:', (e as Error).message);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [parents, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Orang Tua">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="parents.father"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ayah</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="parents.mother"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ibu</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      </div>
    </Collapsible>
  );
}
