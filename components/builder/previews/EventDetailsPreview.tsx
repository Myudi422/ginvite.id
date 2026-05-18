'use client';
import React from 'react';
import { MapPinIcon, ClockIcon, CalendarIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function EventDetailsPreview({ props, style }: P) {
  const events = (props.events as Array<Record<string, string>>) || [];
  const accent = style.accent_color as string || '#e879a0';

  return (
    <div className="py-12 px-6 space-y-6" style={{ backgroundColor: style.bg_color as string }}>
      <p className="text-center text-xs tracking-widest uppercase text-gray-400">Detail Acara</p>
      {events.length === 0 && <p className="text-center text-xs text-gray-300 italic">Belum ada acara</p>}
      {events.map((ev, i) => (
        <div key={ev.id || i} className="rounded-2xl border p-4 space-y-2" style={{ borderColor: accent + '33', backgroundColor: accent + '08' }}>
          <p className="font-bold text-sm" style={{ color: accent, fontFamily: `'${style.font_heading}', serif` }}>{ev.name || 'Nama Acara'}</p>
          {ev.date && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarIcon className="h-3.5 w-3.5" />
              {new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
          {ev.time && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ClockIcon className="h-3.5 w-3.5" />
              {ev.time} WIB
            </div>
          )}
          {ev.location && (
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <MapPinIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>{ev.location}</span>
            </div>
          )}
          {ev.note && <p className="text-[11px] text-gray-400 italic">{ev.note}</p>}
          {ev.maps_link && (
            <a
              href={ev.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl mt-1"
              style={{ backgroundColor: accent + '20', color: accent }}
            >
              <MapPinIcon className="h-3 w-3" /> Lihat Peta
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
