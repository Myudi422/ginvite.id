'use client';
import React from 'react';
import { Field, Input, Select, FieldGroup, FieldSection } from '../ui/EditorFields';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

type Person = Record<string, string>;

export default function CoupleEditor({ props, onChange }: P) {
  const pA = (props.person_a as Person) || {};
  const pB = (props.person_b as Person) || {};
  const layout = (props.layout as string) || 'side_by_side';

  const setA = (key: string, val: string) => onChange({ ...props, person_a: { ...pA, [key]: val } });
  const setB = (key: string, val: string) => onChange({ ...props, person_b: { ...pB, [key]: val } });
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  const personFields = (person: Person, setter: (k: string, v: string) => void, label: string) => (
    <>
      <FieldSection title={label} />
      <Field label="Nama Lengkap"><Input value={person.name || ''} onChange={v => setter('name', v)} /></Field>
      <Field label="Nama Panggilan"><Input value={person.nickname || ''} onChange={v => setter('nickname', v)} /></Field>
      <Field label="URL Foto"><Input value={person.photo || ''} onChange={v => setter('photo', v)} placeholder="https://..." /></Field>
      <Field label="Nama Ayah"><Input value={person.parent_father || ''} onChange={v => setter('parent_father', v)} /></Field>
      <Field label="Nama Ibu"><Input value={person.parent_mother || ''} onChange={v => setter('parent_mother', v)} /></Field>
      <Field label="Instagram (tanpa @)"><Input value={person.instagram || ''} onChange={v => setter('instagram', v)} /></Field>
    </>
  );

  return (
    <FieldGroup>
      <Field label="Tata Letak">
        <Select
          value={layout}
          onChange={v => set('layout', v)}
          options={[
            { value: 'side_by_side', label: 'Sejajar (Kiri - Kanan)' },
            { value: 'stacked', label: 'Bertumpuk (Atas - Bawah)' },
          ]}
        />
      </Field>
      {personFields(pA, setA, 'Orang Pertama / Mempelai Pria')}
      {personFields(pB, setB, 'Orang Kedua / Mempelai Wanita')}
    </FieldGroup>
  );
}
