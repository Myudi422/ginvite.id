'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function QuotePreview({ props, style }: P) {
  const text = props.text as string || '';
  const source = props.source as string || '';
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-12 px-8 flex flex-col items-center gap-3 text-center" style={{ backgroundColor: style.bg_color as string }}>
      <span className="text-5xl" style={{ color: accent + '44' }}>"</span>
      <p className="text-sm italic leading-relaxed" style={{ fontFamily: `'${style.font_heading}', serif`, color: style.text_color as string }}>{text || 'Kutipan akan tampil di sini...'}</p>
      {source && <p className="text-xs text-gray-400">— {source}</p>}
    </div>
  );
}
