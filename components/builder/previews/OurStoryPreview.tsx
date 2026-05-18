'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function OurStoryPreview({ props, style }: P) {
  const items = (props.items as Array<Record<string, string>>) || [];
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-10 px-6 space-y-5" style={{ backgroundColor: style.bg_color as string }}>
      <p className="text-center text-xs tracking-widest uppercase text-gray-400">Kisah Kami</p>
      {items.length === 0 && <p className="text-center text-xs text-gray-300 italic">Belum ada kisah</p>}
      <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {items.map((item, i) => (
          <div key={item.id || i} className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 rounded-full border-2" style={{ backgroundColor: style.bg_color as string, borderColor: accent }} />
            {item.image && <img src={item.image} alt={item.title} className="w-full rounded-xl mb-2 aspect-video object-cover" />}
            <p className="text-[10px] text-gray-400">{item.date}</p>
            <p className="text-sm font-semibold" style={{ color: style.text_color as string }}>{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
