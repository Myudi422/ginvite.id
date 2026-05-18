'use client';
import React from 'react';
import { MusicIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function MusicPreview({ props, style }: P) {
  const url = props.url as string || '';
  const autoplay = props.autoplay as boolean ?? true;
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-6 px-6 flex items-center gap-3" style={{ backgroundColor: style.bg_color as string, borderTop: `1px solid ${accent}22` }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: accent + '22' }}>
        <MusicIcon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold" style={{ color: style.text_color as string }}>Musik Latar</p>
        <p className="text-[11px] text-gray-400">{url ? url.split('/').pop() : 'Belum ada musik'} • {autoplay ? 'Autoplay' : 'Manual'}</p>
      </div>
    </div>
  );
}
