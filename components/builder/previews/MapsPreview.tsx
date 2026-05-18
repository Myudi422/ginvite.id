'use client';
import React from 'react';
import { MapPinIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function MapsPreview({ props, style }: P) {
  const label = props.label as string || 'Lokasi';
  const embedUrl = props.embed_url as string || '';
  const mapsUrl = props.maps_url as string || '';
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-10 px-6 space-y-4" style={{ backgroundColor: style.bg_color as string }}>
      <div className="flex items-center gap-2 justify-center">
        <MapPinIcon className="h-4 w-4" style={{ color: accent }} />
        <p className="text-sm font-semibold" style={{ color: style.text_color as string }}>{label}</p>
      </div>
      {embedUrl ? (
        <div className="rounded-2xl overflow-hidden h-48">
          <iframe src={embedUrl} className="w-full h-full border-0" title="peta" loading="lazy" />
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 h-48 flex items-center justify-center">
          <p className="text-xs text-gray-400">Masukkan embed URL Google Maps</p>
        </div>
      )}
      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: accent + '18', color: accent }}>
          <MapPinIcon className="h-4 w-4" /> Buka Google Maps
        </a>
      )}
    </div>
  );
}
