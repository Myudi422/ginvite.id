'use client';
import React from 'react';
import { Field, Input, FieldGroup, AddButton, ItemCard } from '../ui/EditorFields';
import { makeId } from '../defaults';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }
type Link = { id: string; platform: string; url: string; };

export default function SocialLinksEditor({ props, onChange }: P) {
  const links = (props.links as Link[]) || [];
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  const update = (id: string, key: keyof Link, val: string) =>
    set('links', links.map(l => l.id === id ? { ...l, [key]: val } : l));
  const add = () => set('links', [...links, { id: makeId(), platform: 'Instagram', url: '' }]);
  const remove = (id: string) => set('links', links.filter(l => l.id !== id));

  return (
    <FieldGroup>
      {links.map(l => (
        <ItemCard key={l.id} title={l.platform} onRemove={() => remove(l.id)}>
          <Field label="Platform"><Input value={l.platform} onChange={v => update(l.id, 'platform', v)} placeholder="Instagram, TikTok, dll" /></Field>
          <Field label="URL"><Input value={l.url} onChange={v => update(l.id, 'url', v)} placeholder="https://..." /></Field>
        </ItemCard>
      ))}
      <AddButton label="Tambah Tautan" onClick={add} />
    </FieldGroup>
  );
}
