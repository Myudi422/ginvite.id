'use client';
import React from 'react';
import { Field, Input, FieldGroup, AddButton, ItemCard } from '../ui/EditorFields';
import { makeId } from '../defaults';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }
type Event = { id: string; name: string; date: string; time: string; location: string; maps_link: string; note: string; };

export default function EventDetailsEditor({ props, onChange }: P) {
  const events = (props.events as Event[]) || [];

  const updateEvent = (id: string, key: keyof Event, val: string) => {
    onChange({ ...props, events: events.map(e => e.id === id ? { ...e, [key]: val } : e) });
  };
  const addEvent = () => {
    onChange({ ...props, events: [...events, { id: makeId(), name: 'Nama Acara', date: '', time: '', location: '', maps_link: '', note: '' }] });
  };
  const removeEvent = (id: string) => {
    onChange({ ...props, events: events.filter(e => e.id !== id) });
  };

  return (
    <FieldGroup>
      {events.map(ev => (
        <ItemCard key={ev.id} title={ev.name || 'Sesi Acara'} onRemove={() => removeEvent(ev.id)}>
          <Field label="Nama Acara"><Input value={ev.name} onChange={v => updateEvent(ev.id, 'name', v)} /></Field>
          <Field label="Tanggal"><Input type="date" value={ev.date} onChange={v => updateEvent(ev.id, 'date', v)} /></Field>
          <Field label="Waktu"><Input type="time" value={ev.time} onChange={v => updateEvent(ev.id, 'time', v)} /></Field>
          <Field label="Lokasi"><Input value={ev.location} onChange={v => updateEvent(ev.id, 'location', v)} /></Field>
          <Field label="Link Google Maps"><Input value={ev.maps_link} onChange={v => updateEvent(ev.id, 'maps_link', v)} placeholder="https://maps.app.goo.gl/..." /></Field>
          <Field label="Catatan (opsional)"><Input value={ev.note} onChange={v => updateEvent(ev.id, 'note', v)} /></Field>
        </ItemCard>
      ))}
      <AddButton label="Tambah Sesi Acara" onClick={addEvent} />
    </FieldGroup>
  );
}
