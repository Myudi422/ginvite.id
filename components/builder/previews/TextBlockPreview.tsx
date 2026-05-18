'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function TextBlockPreview({ props, style }: P) {
  const heading = props.heading as string || '';
  const body = props.body as string || '';
  const align = (props.align as string) || 'center';
  return (
    <div className="py-10 px-8 space-y-3" style={{ backgroundColor: style.bg_color as string, textAlign: align as 'left' | 'center' | 'right' }}>
      {heading && <h2 className="text-lg font-bold" style={{ fontFamily: `'${style.font_heading}', serif`, color: style.text_color as string }}>{heading}</h2>}
      {body && <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{body}</p>}
      {!heading && !body && <p className="text-xs text-gray-300 italic">Teks belum diisi</p>}
    </div>
  );
}
