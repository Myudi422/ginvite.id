'use client';
import React from 'react';
import { GiftIcon, CopyIcon } from 'lucide-react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function GiftPreview({ props, style }: P) {
  const banks = (props.banks as Array<Record<string, string>>) || [];
  const accent = style.accent_color as string || '#e879a0';
  return (
    <div className="py-10 px-6 space-y-4" style={{ backgroundColor: style.bg_color as string }}>
      <div className="flex items-center gap-2 justify-center">
        <GiftIcon className="h-5 w-5" style={{ color: accent }} />
        <p className="text-sm font-semibold" style={{ color: style.text_color as string }}>Hadiah / Gift</p>
      </div>
      {banks.length === 0 && <p className="text-center text-xs text-gray-300 italic">Belum ada info rekening</p>}
      {banks.map((b, i) => (
        <div key={b.id || i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: accent + '33' }}>
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: accent }}>{b.bank_name || 'Nama Bank'}</p>
            <p className="text-sm font-semibold" style={{ color: style.text_color as string }}>{b.account_number || '0000000000'}</p>
            <p className="text-xs text-gray-400">{b.account_name || 'Nama Rekening'}</p>
          </div>
          <CopyIcon className="h-4 w-4 text-gray-300" />
        </div>
      ))}
    </div>
  );
}
