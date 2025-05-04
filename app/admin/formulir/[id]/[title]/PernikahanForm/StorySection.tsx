'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible } from './Collapsible';

export function StorySection() {
  const { control } = useFormContext();
  const fields = useFieldArray({ control, name: 'our_story' }).fields;

  return (
    <Collapsible title="Our Story">
      {fields.map((item, i) => (
        <div key={item.id} className="border p-4 rounded-lg space-y-2">
          <Controller name={`our_story.${i}.title`} control={control} render={({ field }) => <Input {...field} placeholder="Judul Cerita"/>}/>
          <Controller name={`our_story.${i}.description`} control={control} render={({ field }) => <Textarea {...field} placeholder="Deskripsi"/>}/>
          <Controller name={`our_story.${i}.pictures.0`} control={control} render={({ field }) => <Input {...field} placeholder="URL Gambar"/>}/>
        </div>
      ))}
    </Collapsible>
  );
}
