'use client';
import React from 'react';
import { CheckSquareIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function RsvpPreview({ props, style }: P) {
  const enabled = props.enabled as boolean ?? true;
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-10 px-6 flex flex-col items-center gap-4" style={{ backgroundColor: style.bg_color as string }}>
      <CheckSquareIcon className="h-8 w-8" style={{ color: accent }} />
      <p className="text-sm font-semibold" style={{ color: style.text_color as string }}>Konfirmasi Kehadiran</p>
      {!enabled && <p className="text-xs text-gray-400">RSVP tidak aktif</p>}
      {enabled && (
        <div className="w-full space-y-3 max-w-xs">
          <input disabled placeholder="Nama Anda" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-400" />
          <div className="flex gap-2">
            {['Hadir', 'Tidak Hadir'].map(l => (
              <button key={l} disabled className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ backgroundColor: accent + '22', color: accent }}>{l}</button>
            ))}
          </div>
          <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: accent }}>Kirim</button>
        </div>
      )}
    </div>
  );
}
