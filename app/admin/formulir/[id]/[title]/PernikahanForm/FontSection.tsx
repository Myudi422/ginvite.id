'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function FontSection() {
  const { control } = useFormContext();
  return (
    <Collapsible title="Font">
      {(['body', 'heading', 'special'] as const).map((k) => (
        <FormField key={k} control={control} name={`font.${k}`} render={({ field }) => (
          <FormItem>
            <FormLabel className="capitalize">{k}</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
      ))}
    </Collapsible>
  );
}
