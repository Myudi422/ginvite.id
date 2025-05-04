'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';

export function ChildrenSection() {
  const { control } = useFormContext();
  const fields = useFieldArray({ control, name: 'children' }).fields;

  return (
    <Collapsible title="Pengantin">
      {fields.map((item, i) => (
        <div key={item.id} className="grid grid-cols-3 gap-2">
          <Controller name={`children.${i}.name`} control={control} render={({ field }) => <Input {...field} placeholder="Nama"/>}/>
          <Controller name={`children.${i}.order`} control={control} render={({ field }) => <Input {...field} placeholder="Order"/>}/>
          <Controller name={`children.${i}.profile`} control={control} render={({ field }) => <Input {...field} placeholder="URL Foto"/>}/>
        </div>
      ))}
    </Collapsible>
  );
}
