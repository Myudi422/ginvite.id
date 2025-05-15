'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function MusicSection() {
  const { control } = useFormContext();

  return (
    <Collapsible title="Latar Belakang Musik">
      <div className="grid gap-4 py-4">
        <FormField
          control={control}
          name="music.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktifkan Latar Musik</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="music.url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Musik</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Contoh: https://soundcloud.com/user/tracks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Collapsible>
  );
}