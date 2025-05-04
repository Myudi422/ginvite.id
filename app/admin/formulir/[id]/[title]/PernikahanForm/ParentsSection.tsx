'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function ParentsSection() {
  const { control } = useFormContext();
  return (
    <Collapsible title="Orang Tua">
      {(['bride', 'groom'] as const).map((who) => (
        <div key={who} className="grid grid-cols-2 gap-4">
          {(['father','mother'] as const).map((p) => (
            <FormField key={p} control={control} name={`parents.${who}.${p}`} render={({ field }) => (
              <FormItem>
                <FormLabel>{who==='bride' ? 'Pengantin Wanita' : 'Pengantin Pria'} – {p}</FormLabel>
                <FormControl><Input {...field}/></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          ))}
        </div>
      ))}
    </Collapsible>
  );
}
