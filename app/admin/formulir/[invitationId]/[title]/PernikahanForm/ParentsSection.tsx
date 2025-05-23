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

  // watch semua field parents
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
        waktu_acara: data.event.date,
        time: data.event.time,
        location: data.event.location,
        mapsLink: data.event.mapsLink,
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
      {(['bride', 'groom'] as const).map((who) => (
        <div key={who} className="grid grid-cols-2 gap-4">
          {(['father','mother'] as const).map((p) => (
            <FormField
              key={p}
              control={control}
              name={`parents.${who}.${p}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {who === 'bride' ? 'Pengantin Wanita' : 'Pengantin Pria'} – {p}
                  </FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          ))}
        </div>
      ))}
    </Collapsible>
  );
}
