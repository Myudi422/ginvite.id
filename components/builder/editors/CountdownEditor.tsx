'use client';
import React from 'react';
import { Field, Input, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function CountdownEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="Label Hitung Mundur">
        <Input value={(props.label as string) || ''} onChange={v => set('label', v)} placeholder="Menuju Hari Bahagia" />
      </Field>
      <Field label="Tanggal Acara">
        <Input type="date" value={(props.event_date as string) || ''} onChange={v => set('event_date', v)} />
      </Field>
      <Field label="Jam Acara">
        <Input type="time" value={(props.event_time as string) || ''} onChange={v => set('event_time', v)} />
      </Field>
    </FieldGroup>
  );
}
