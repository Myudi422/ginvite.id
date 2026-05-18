'use client';
import React from 'react';
import { Field, Input, Textarea, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function QuoteEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="Teks Kutipan">
        <Textarea value={(props.text as string) || ''} onChange={v => set('text', v)} rows={4} placeholder='Masukkan kutipan...' />
      </Field>
      <Field label="Sumber (opsional)">
        <Input value={(props.source as string) || ''} onChange={v => set('source', v)} placeholder="QS. Ar-Rum: 21" />
      </Field>
    </FieldGroup>
  );
}
