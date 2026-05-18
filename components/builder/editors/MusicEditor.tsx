'use client';
import React from 'react';
import { Field, Input, Toggle, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function MusicEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="URL Musik" hint="Link langsung ke file .mp3">
        <Input value={(props.url as string) || ''} onChange={v => set('url', v)} placeholder="https://..." />
      </Field>
      <Field label="Autoplay">
        <Toggle checked={(props.autoplay as boolean) ?? true} onChange={v => set('autoplay', v)} />
      </Field>
    </FieldGroup>
  );
}
