'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';

export function GallerySection() {
  const { control } = useFormContext();
  const fields = useFieldArray({ control, name: 'gallery.items' }).fields;

  return (
    <Collapsible title="Gallery">
      {fields.map((item, i) => (
        <Controller key={item.id} control={control} name={`gallery.items.${i}`} render={({ field }) => (
          <Input {...field} placeholder={`URL Gambar ${i+1}`} />
        )}/>
      ))}
    </Collapsible>
  );
}
