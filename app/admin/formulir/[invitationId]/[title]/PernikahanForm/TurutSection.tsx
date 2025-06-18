'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';
import { Textarea } from '@/components/ui/textarea';
import { autoSaveContent } from '@/app/actions/saved';

interface TurutSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function TurutSection({
  userId, invitationId, slug, onSavedSlug,
}: TurutSectionProps) {
  const { control, setValue, getValues } = useFormContext<any>();
  const enabled = useWatch({ control, name: 'turut.enabled' });
  const list = useWatch({ control, name: 'turut.list' });

  // State untuk textarea agar Enter bisa digunakan dengan benar
  const [textValue, setTextValue] = useState('');

  // Sync dari form ke textarea saat enabled/list berubah
  useEffect(() => {
    if (enabled && Array.isArray(list)) {
      setTextValue(list.map(v => v.name).join('\n'));
    } else if (!enabled) {
      setTextValue('');
    }
  }, [enabled, list]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
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
        await autoSaveContent(payload);
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement|null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save Turut gagal:', (e as Error).message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enabled, list, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Turut Mengundang">
      <div className="grid gap-4 py-4">
        <FormField
          control={control}
          name="turut.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 border rounded">
              <div>
                <FormLabel>Aktifkan Turut Mengundang</FormLabel>
                <FormMessage/>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
            </FormItem>
          )}
        />
        {enabled && (
          <Controller
            control={control}
            name="turut.list"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Daftar Nama Tamu (satu nama per baris)</FormLabel>
                <FormControl>
                  <Textarea
                    value={textValue}
                    onChange={e => setTextValue(e.target.value)}
                    onBlur={() => {
                      const lines = textValue
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .map(name => ({ name }));
                      field.onChange(lines);
                    }}
                    rows={6}
                    placeholder="Contoh:&#10;Bpk/Ibu A&#10;Bpk/Ibu B"
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
        )}
      </div>
    </Collapsible>
  );
}