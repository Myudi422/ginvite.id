'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function CountdownPreview({ props, style }: P) {
  const label = props.label as string || 'Menuju Hari-H';
  const eventDate = props.event_date as string || '';
  const eventTime = props.event_time as string || '00:00';

  let diff = { d: 0, h: 0, m: 0, s: 0 };
  if (eventDate) {
    const target = new Date(`${eventDate}T${eventTime || '00:00'}:00`).getTime();
    const now = Date.now();
    const ms = Math.max(0, target - now);
    diff = { d: Math.floor(ms / 86400000), h: Math.floor((ms % 86400000) / 3600000), m: Math.floor((ms % 3600000) / 60000), s: Math.floor((ms % 60000) / 1000) };
  }

  const accent = style.accent_color as string || '#e879a0';
  const boxes = [
    { label: 'Hari', value: diff.d },
    { label: 'Jam', value: diff.h },
    { label: 'Menit', value: diff.m },
    { label: 'Detik', value: diff.s },
  ];

  return (
    <div className="py-12 px-8 flex flex-col items-center gap-6" style={{ backgroundColor: style.bg_color as string }}>
      <p className="text-xs tracking-widest uppercase text-gray-400">{label}</p>
      <div className="flex gap-3 flex-wrap justify-center">
        {boxes.map(b => (
          <div key={b.label} className="flex flex-col items-center gap-1">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}
            >
              {String(b.value).padStart(2, '0')}
            </div>
            <span className="text-[10px] text-gray-400">{b.label}</span>
          </div>
        ))}
      </div>
      {!eventDate && <p className="text-xs text-gray-300 italic">Tanggal belum diisi</p>}
    </div>
  );
}
