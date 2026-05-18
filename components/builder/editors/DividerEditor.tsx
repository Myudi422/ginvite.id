'use client';
import React from 'react';
import { Field, Select, ColorInput, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function DividerEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="Gaya Pemisah">
        <Select value={(props.style as string) || 'line'} onChange={v => set('style', v)} options={[
          { value: 'line', label: 'Garis Lurus' },
          { value: 'dots', label: 'Titik-Titik' },
          { value: 'floral', label: 'Floral ✿' },
          { value: 'wave', label: 'Gelombang' },
        ]} />
      </Field>
      <Field label="Warna">
        <ColorInput value={(props.color as string) || '#e879a0'} onChange={v => set('color', v)} />
      </Field>
    </FieldGroup>
  );
}
