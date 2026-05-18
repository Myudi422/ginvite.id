'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function GalleryPreview({ props, style }: P) {
  const images = (props.images as string[]) || [];
  const cols = (props.columns as number) || 3;

  return (
    <div className="py-12 px-4" style={{ backgroundColor: style.bg_color as string }}>
      <p className="text-center text-xs tracking-widest uppercase text-gray-400 mb-6">Galeri</p>
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl py-10 flex flex-col items-center gap-2">
          <span className="text-3xl">🖼️</span>
          <p className="text-xs text-gray-400">Belum ada foto</p>
        </div>
      ) : (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={img} alt={`gallery-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
