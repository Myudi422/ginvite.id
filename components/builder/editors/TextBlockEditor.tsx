'use client';
import React from 'react';
import { Field, Input, Textarea, Select, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function TextBlockEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="Judul"><Input value={(props.heading as string) || ''} onChange={v => set('heading', v)} /></Field>
      <Field label="Isi Teks"><Textarea value={(props.body as string) || ''} onChange={v => set('body', v)} rows={5} /></Field>
      <Field label="Perataan">
        <Select value={(props.align as string) || 'center'} onChange={v => set('align', v)} options={[
          { value: 'left', label: 'Kiri' },
          { value: 'center', label: 'Tengah' },
          { value: 'right', label: 'Kanan' },
        ]} />
      </Field>
    </FieldGroup>
  );
}
