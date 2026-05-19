'use client';
import React, { useState } from 'react';
import { Field, FieldGroup, Input, ImageUploadField } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { ChevronDown, Type, Image as ImageIcon, Settings } from 'lucide-react';
import type { OpeningProps } from '../types';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function OpeningEditor({ props, onChange }: P) {
  const typedProps = props as unknown as OpeningProps;
  const set = (key: keyof OpeningProps, val: unknown) => onChange({ ...props, [key]: val });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    text: true,
    bg: false,
    settings: false,
  });

  const toggleGroup = (key: string) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const renderHeader = (key: string, title: string, Icon: React.ComponentType<{ className?: string }>) => {
    const isOpen = openGroups[key];
    return (
      <button
        type="button"
        onClick={() => toggleGroup(key)}
        className="w-full flex items-center justify-between py-2.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-bold text-[10px] text-gray-500 hover:text-gray-700 transition-all select-none focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-gray-400" />
          <span className="tracking-wider uppercase">{title}</span>
        </div>
        <ChevronDown 
          className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ease-in-out" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    );
  };

  return (
    <div className="p-4 space-y-3">
      {/* ── GROUP: TEKS ── */}
      <div className="space-y-2">
        {renderHeader('text', 'Teks & Label', Type)}
        {openGroups.text && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Teks Judul Acara">
              <Input 
                value={typedProps.title || ''} 
                onChange={v => set('title', v)} 
                placeholder="Misal: The Wedding Of" 
              />
            </Field>

            <Field label="Nama Pengantin Utama / Acara">
              <Input 
                value={typedProps.name_primary || ''} 
                onChange={v => set('name_primary', v)} 
                placeholder="Misal: Romeo" 
              />
            </Field>

            <Field label="Nama Pengantin Kedua (Opsional)">
              <Input 
                value={typedProps.name_secondary || ''} 
                onChange={v => set('name_secondary', v)} 
                placeholder="Misal: Juliet" 
              />
            </Field>

            <Field label={`Ukuran Teks Nama: ${typedProps.names_size ?? 36}px`}>
              <input
                type="range" min={20} max={80} step={2}
                value={typedProps.names_size ?? 36}
                onChange={e => set('names_size', parseInt(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </Field>

            <Field label="Teks Sapaan / Pengantar">
              <textarea
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 min-h-[60px]"
                value={typedProps.greeting_text || ''}
                onChange={e => set('greeting_text', e.target.value)}
                placeholder="Misal: Tanpa Mengurangi Rasa Hormat..."
              />
            </Field>

            <Field label="Label Tujuan / Kepada">
              <Input 
                value={typedProps.to_label || ''} 
                onChange={v => set('to_label', v)} 
                placeholder="Misal: Kepada Yth. Bapak/Ibu/Saudara/i" 
              />
            </Field>

            <Field label="Teks Tombol Masuk">
              <Input 
                value={typedProps.button_text || ''} 
                onChange={v => set('button_text', v)} 
                placeholder="Misal: Buka Undangan" 
              />
            </Field>
          </div>
        )}
      </div>

      {/* ── GROUP: LATAR BELAKANG ── */}
      <div className="space-y-2">
        {renderHeader('bg', 'Latar Belakang', ImageIcon)}
        {openGroups.bg && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Foto Background Sampul">
              <ImagePicker 
                value={typedProps.bg_image || ''} 
                onChange={v => set('bg_image', v)} 
              />
            </Field>

            <Field label={`Kegelapan Overlay: ${typedProps.overlay_opacity ?? 50}%`}>
              <input
                type="range" min={0} max={100} step={5}
                value={typedProps.overlay_opacity ?? 50}
                onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Fungsinya untuk meredupkan foto agar teks undangan lebih mudah terbaca.
              </p>
            </Field>
          </div>
        )}
      </div>

      {/* ── GROUP: SETTINGS ── */}
      <div className="space-y-2">
        {renderHeader('settings', 'Pengaturan Lain', Settings)}
        {openGroups.settings && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tombol QR Code">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-pink-500"
                  checked={typedProps.show_qr ?? true}
                  onChange={e => set('show_qr', e.target.checked)}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-700">Tampilkan Tombol QR</p>
                  <p className="text-[10px] text-gray-400">Tamu dengan custom nama (via link) dapat check-in via QR</p>
                </div>
              </label>
            </Field>
          </div>
        )}
      </div>

    </div>
  );
}
