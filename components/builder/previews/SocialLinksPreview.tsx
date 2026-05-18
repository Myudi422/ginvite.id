'use client';
import React from 'react';
import { LinkIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function SocialLinksPreview({ props, style }: P) {
  const links = (props.links as Array<Record<string, string>>) || [];
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-8 px-6 flex flex-col items-center gap-3" style={{ backgroundColor: style.bg_color as string }}>
      <p className="text-xs tracking-widest uppercase text-gray-400">Sosial Media</p>
      <div className="flex flex-wrap justify-center gap-2">
        {links.length === 0 && <p className="text-xs text-gray-300 italic">Belum ada tautan</p>}
        {links.map((l, i) => (
          <div key={l.id || i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium" style={{ backgroundColor: accent + '18', color: accent }}>
            <LinkIcon className="h-3 w-3" />
            {l.platform || 'Platform'}
          </div>
        ))}
      </div>
    </div>
  );
}
