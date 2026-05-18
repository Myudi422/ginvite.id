'use client';
import React from 'react';
import { Field, Input, FieldGroup } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function MapsEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <FieldGroup>
      <Field label="Label Peta"><Input value={(props.label as string) || ''} onChange={v => set('label', v)} placeholder="Lokasi Acara" /></Field>
      <Field label="Link Google Maps (buka di HP)" hint="Untuk tombol 'Buka Google Maps'">
        <Input value={(props.maps_url as string) || ''} onChange={v => set('maps_url', v)} placeholder="https://maps.app.goo.gl/..." />
      </Field>
      <Field label="URL Embed Google Maps" hint="Dari Share > Embed a map > ambil src iframe-nya">
        <Input value={(props.embed_url as string) || ''} onChange={v => set('embed_url', v)} placeholder="https://www.google.com/maps/embed?..." />
      </Field>
    </FieldGroup>
  );
}
