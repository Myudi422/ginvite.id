// components/MusicSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Collapsible } from './Collapsible';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { autoSaveContent } from '@/app/actions/saved';
import { getMusicList } from '@/app/actions/musiclist';

interface Music { Nama_lagu: string; link_lagu: string; kategori: string; }

interface MusicSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function MusicSection({
  userId, invitationId, slug, onSavedSlug,
}: MusicSectionProps) {
  const { control, setValue, getValues } = useFormContext<any>();
  const [musicList, setMusicList] = useState<Music[]>([]);
  
  // watch toggles & selected URL
  const enabled = useWatch({ control, name: 'music.enabled' });
  const url     = useWatch({ control, name: 'music.url' });

  // fetch daftar musik
  useEffect(() => {
    getMusicList()
      .then(data => setMusicList(data))
      .catch(console.error);
  }, []);

  // auto-save setiap enable atau url berubah
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
        console.error('Auto-save Music gagal:', (e as Error).message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enabled, url, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Latar Belakang Musik">
      <div className="grid gap-4 py-4">
        <FormField
          name="music.enabled"
          control={control}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 border rounded">
              <div><FormLabel>Aktifkan Latar Musik</FormLabel><FormMessage/></div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
            </FormItem>
          )}
        />

        {enabled && (
          <FormField
            name="music.url"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Musik</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={v => setValue('music.url', v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Pilih lagu…"/></SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {musicList.map(m => (
                        <SelectItem key={m.link_lagu} value={m.link_lagu}>
                          {m.Nama_lagu} <span className="text-xs text-muted-foreground">({m.kategori})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        )}
      </div>
    </Collapsible>
  );
}
