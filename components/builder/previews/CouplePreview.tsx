'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function CouplePreview({ props, style }: P) {
  const pA = (props.person_a as Record<string, string>) || {};
  const pB = (props.person_b as Record<string, string>) || {};
  const accent = style.accent_color as string || '#e879a0';

  function Avatar({ person }: { person: Record<string, string> }) {
    return (
      <div className="flex flex-col items-center gap-3 flex-1">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: accent + '55' }}>
          {person.photo
            ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: accent + '22' }}>👤</div>}
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">{person.nickname || 'Panggilan'}</p>
          <p className="font-semibold text-sm" style={{ color: style.text_color as string }}>{person.name || 'Nama Lengkap'}</p>
          {(person.parent_father || person.parent_mother) && (
            <p className="text-[10px] text-gray-400 mt-1">
              Putra/i: {person.parent_father} & {person.parent_mother}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6" style={{ backgroundColor: style.bg_color as string }}>
      <p className="text-center text-xs tracking-widest uppercase text-gray-400 mb-8">Pasangan</p>
      <div className="flex items-center gap-4">
        <Avatar person={pA} />
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl" style={{ color: accent }}>♥</span>
        </div>
        <Avatar person={pB} />
      </div>
    </div>
  );
}
