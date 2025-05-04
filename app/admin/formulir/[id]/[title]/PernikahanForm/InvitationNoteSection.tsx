'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function InvitationNoteSection() {
  const { control } = useFormContext();
  return (
    <Collapsible title="Catatan Undangan">
      <FormField control={control} name="invitationNote" render={({ field }) => (
        <FormItem>
          <FormControl><Textarea {...field}/></FormControl>
          <FormMessage/>
        </FormItem>
      )}/>
    </Collapsible>
  );
}
