'use client';
import React from 'react';
import { Field, Input, FieldGroup, AddButton, ItemCard } from '../ui/EditorFields';
import { makeId } from '../defaults';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }
type StoryItem = { id: string; date: string; title: string; description: string; image: string; };

export default function OurStoryEditor({ props, onChange }: P) {
  const items = (props.items as StoryItem[]) || [];
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  const update = (id: string, key: keyof StoryItem, val: string) =>
    set('items', items.map(i => i.id === id ? { ...i, [key]: val } : i));
  const add = () => set('items', [...items, { id: makeId(), date: '', title: '', description: '', image: '' }]);
  const remove = (id: string) => set('items', items.filter(i => i.id !== id));

  return (
    <FieldGroup>
      {items.map(item => (
        <ItemCard key={item.id} title={item.title || 'Kisah'} onRemove={() => remove(item.id)}>
          <Field label="Tanggal"><Input type="date" value={item.date} onChange={v => update(item.id, 'date', v)} /></Field>
          <Field label="Judul Momen"><Input value={item.title} onChange={v => update(item.id, 'title', v)} /></Field>
          <Field label="Deskripsi"><Input value={item.description} onChange={v => update(item.id, 'description', v)} /></Field>
          <Field label="URL Foto (opsional)"><Input value={item.image} onChange={v => update(item.id, 'image', v)} placeholder="https://..." /></Field>
        </ItemCard>
      ))}
      <AddButton label="Tambah Momen" onClick={add} />
    </FieldGroup>
  );
}
