'use client';
import React from 'react';
import { Field, Input, Toggle, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function RsvpEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="Aktifkan RSVP">
        <Toggle checked={(props.enabled as boolean) ?? true} onChange={v => set('enabled', v)} />
      </Field>
      <Field label="Batas Konfirmasi (opsional)">
        <Input type="date" value={(props.deadline as string) || ''} onChange={v => set('deadline', v)} />
      </Field>
    </FieldGroup>
  );
}
