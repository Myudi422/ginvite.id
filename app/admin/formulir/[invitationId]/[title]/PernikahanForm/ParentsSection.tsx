// ParentsSection.tsx
'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext, useWatch } from 'react-hook-form';
import { autoSaveContent } from '@/app/actions/saved';
import React from 'react';

interface ParentsSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function ParentsSection({ userId, invitationId, slug, onSavedSlug }: ParentsSectionProps) {
  const { control, getValues } = useFormContext();
  const parents = useWatch({ control, name: 'parents' });

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      const data = getValues();
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
        waktu_acara: data.event?.resepsi?.date ?? data.event?.date ?? '',
        time: data.event?.resepsi?.time ?? data.event?.time ?? '',
        location: data.event?.resepsi?.location ?? data.event?.location ?? '',
        mapsLink: data.event?.resepsi?.mapsLink ?? data.event?.mapsLink ?? '',
      };
      try {
        await autoSaveContent(payload);
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save Parents gagal:', (e as Error).message);
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [parents, getValues, invitationId, slug, onSavedSlug, userId]);

  const sides = [
    { key: 'groom' as const, label: '🤵 Pria', color: 'blue' },
    { key: 'bride' as const, label: '👰 Wanita', color: 'pink' },
  ];

  return (
    <div className="space-y-5">
      {sides.map(({ key, label, color }) => (
        <div key={key}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${color === 'blue' ? 'text-blue-500' : 'text-pink-500'}`}>{label}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['father', 'mother'] as const).map((role) => (
              <FormField
                key={role}
                control={control}
                name={`parents.${key}.${role}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-500">
                      {role === 'father' ? '👨 Nama Ayah' : '👩 Nama Ibu'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={role === 'father' ? 'Bpk. ...' : 'Ibu. ...'}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-400 italic">💡 Contoh: Bpk. Ahmad Suharto / Ibu. Siti Rahayu</p>
    </div>
  );
}
