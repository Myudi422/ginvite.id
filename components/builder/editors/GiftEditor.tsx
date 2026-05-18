'use client';
import React from 'react';
import { Field, Input, Toggle, FieldGroup, AddButton, ItemCard } from '../ui/EditorFields';
import { makeId } from '../defaults';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }
type Bank = { id: string; bank_name: string; account_name: string; account_number: string; };

export default function GiftEditor({ props, onChange }: P) {
  const enabled = (props.enabled as boolean) ?? false;
  const banks = (props.banks as Bank[]) || [];

  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  const updateBank = (id: string, key: keyof Bank, val: string) => set('banks', banks.map(b => b.id === id ? { ...b, [key]: val } : b));
  const addBank = () => set('banks', [...banks, { id: makeId(), bank_name: '', account_name: '', account_number: '' }]);
  const removeBank = (id: string) => set('banks', banks.filter(b => b.id !== id));

  return (
    <FieldGroup>
      <Field label="Aktifkan Fitur Hadiah">
        <Toggle checked={enabled} onChange={v => set('enabled', v)} />
      </Field>
      {banks.map(b => (
        <ItemCard key={b.id} title={b.bank_name || 'Rekening'} onRemove={() => removeBank(b.id)}>
          <Field label="Nama Bank"><Input value={b.bank_name} onChange={v => updateBank(b.id, 'bank_name', v)} placeholder="BCA / Mandiri / dll" /></Field>
          <Field label="Nomor Rekening"><Input value={b.account_number} onChange={v => updateBank(b.id, 'account_number', v)} /></Field>
          <Field label="Nama Pemilik Rekening"><Input value={b.account_name} onChange={v => updateBank(b.id, 'account_name', v)} /></Field>
        </ItemCard>
      ))}
      <AddButton label="Tambah Rekening" onClick={addBank} />
    </FieldGroup>
  );
}
