'use client';
import React from 'react';
import { Field, Input, Select, FieldGroup, AddButton } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function GalleryEditor({ props, onChange }: P) {
  const images = (props.images as string[]) || [];
  const layout = (props.layout as string) || 'grid';
  const columns = (props.columns as number) || 3;

  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  const setImage = (i: number, val: string) => {
    const imgs = [...images]; imgs[i] = val;
    set('images', imgs);
  };
  const removeImage = (i: number) => set('images', images.filter((_, idx) => idx !== i));
  const addImage = () => set('images', [...images, '']);

  return (
    <FieldGroup>
      <Field label="Layout">
        <Select value={layout} onChange={v => set('layout', v)} options={[
          { value: 'grid', label: 'Grid' },
          { value: 'masonry', label: 'Masonry' },
          { value: 'slider', label: 'Slider' },
        ]} />
      </Field>
      <Field label="Kolom">
        <Select value={String(columns)} onChange={v => set('columns', Number(v))} options={[
          { value: '2', label: '2 Kolom' },
          { value: '3', label: '3 Kolom' },
        ]} />
      </Field>
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">URL Foto ({images.length})</p>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input value={img} onChange={v => setImage(i, v)} placeholder={`Foto ${i + 1}`} />
            <button onClick={() => removeImage(i)} className="text-red-400 text-xs font-bold flex-shrink-0 hover:text-red-600">✕</button>
          </div>
        ))}
      </div>
      <AddButton label="Tambah Foto" onClick={addImage} />
    </FieldGroup>
  );
}
