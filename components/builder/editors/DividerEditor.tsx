'use client';
import React, { useState } from 'react';
import { Field, Select, ColorInput, FieldGroup, Input, ImageUploadField } from '../ui/EditorFields';
import { ChevronDown, Sliders, Paintbrush, Sparkles } from 'lucide-react';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

const COLOR_TYPES = [
  { value: 'solid',       label: '⬛ Solid (Warna Pemisah)' },
  { value: 'gradient',    label: '🌈 Gradient (Gradasi Warna)' },
  { value: 'image',       label: '🖼️ Gambar / Pattern' },
];

const BG_TYPES = [
  { value: 'transparent', label: '— Transparan (Bawaan Tema)' },
  { value: 'solid',       label: '⬛ Solid (Warna Tunggal)' },
  { value: 'gradient',    label: '🌈 Gradient (Gradasi Warna)' },
  { value: 'image',       label: '🖼️ Gambar / Foto (URL)' },
];

const ANIMATION_TYPES = [
  { value: 'none',      label: '— Tanpa Animasi' },
  { value: 'fade',      label: '✨ Fade In (Masuk Mulus)' },
  { value: 'pulse',     label: '🌬️ Breathing Pulse (Napas Perlahan)' },
  { value: 'slide',     label: '➡️ Slide In (Geser Kiri ke Kanan)' },
  { value: 'bounce',    label: '🦘 Bounce (Memantul Lembut)' },
  { value: 'wave-flow', label: '🌊 Gelombang Berjalan (Horizontal)' },
];

export default function DividerEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });
  
  const bgType = (props.bg_type as string) || 'transparent';
  const colorType = (props.color_type as string) || 'solid';
  const animType = (props.anim_type as string) || 'none';
  const animDuration = (props.anim_duration as number) ?? 2;
  const animDelay = (props.anim_delay as number) ?? 0;

  // Accordion Group State
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    design: true,
    background: false,
    animation: false,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
      {/* ── GROUP 1: GAYA & DESAIN ── */}
      <div className="space-y-2">
        {renderHeader('design', 'Gaya & Desain', Sliders)}
        {openGroups.design && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Gaya Pemisah">
              <Select value={(props.style as string) || 'line'} onChange={v => set('style', v)} options={[
                { value: 'line', label: 'Garis Lurus' },
                { value: 'dots', label: 'Titik-Titik' },
                { value: 'floral', label: 'Floral ✿' },
                { value: 'wave', label: 'Gelombang' },
              ]} />
            </Field>

            <Field label="Tipe Warna Pemisah">
              <Select value={colorType} onChange={v => set('color_type', v)} options={COLOR_TYPES} />
            </Field>

            {colorType === 'solid' && (
              <Field label="Warna Pemisah">
                <ColorInput value={(props.color as string) || '#e879a0'} onChange={v => set('color', v)} />
              </Field>
            )}

            {colorType === 'gradient' && (
              <div className="space-y-3">
                <Field label="Warna Pemisah Gradient 1 (Dari)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(props.color_grad_1 as string) || '#e879a0'}
                      onChange={e => set('color_grad_1', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input 
                      value={(props.color_grad_1 as string) || ''} 
                      onChange={v => set('color_grad_1', v)} 
                    />
                  </div>
                </Field>

                <Field label="Warna Pemisah Gradient 2 (Ke)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(props.color_grad_2 as string) || '#9333ea'}
                      onChange={e => set('color_grad_2', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input 
                      value={(props.color_grad_2 as string) || ''} 
                      onChange={v => set('color_grad_2', v)} 
                    />
                  </div>
                </Field>

                <Field label={`Sudut Gradient Pemisah: ${(props.color_grad_angle as number) ?? 90}°`}>
                  <input
                    type="range" min={0} max={360} step={15}
                    value={(props.color_grad_angle as number) ?? 90}
                    onChange={e => set('color_grad_angle', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {colorType === 'image' && (
              <Field label="Gambar / Pattern Pemisah">
                <ImageUploadField value={(props.color_image as string) || ''} onChange={v => set('color_image', v)} placeholder="https://..." />
              </Field>
            )}
          </div>
        )}
      </div>

      {/* ── GROUP 2: LATAR BELAKANG ── */}
      <div className="space-y-2">
        {renderHeader('background', 'Latar Belakang', Paintbrush)}
        {openGroups.background && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tipe Latar Belakang">
              <Select value={bgType} onChange={v => set('bg_type', v)} options={BG_TYPES} />
            </Field>

            {bgType === 'solid' && (
              <Field label="Warna Background">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(props.bg_solid_color as string) || '#ffffff'}
                    onChange={e => set('bg_solid_color', e.target.value)}
                    className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <Input 
                    value={(props.bg_solid_color as string) || ''} 
                    onChange={v => set('bg_solid_color', v)} 
                    placeholder="Default: #ffffff" 
                  />
                </div>
              </Field>
            )}

            {bgType === 'gradient' && (
              <div className="space-y-3">
                <Field label="Warna Background Gradient 1 (Dari)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(props.bg_color as string) || '#e879a0'}
                      onChange={e => set('bg_color', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input 
                      value={(props.bg_color as string) || ''} 
                      onChange={v => set('bg_color', v)} 
                    />
                  </div>
                </Field>

                <Field label="Warna Background Gradient 2 (Ke)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(props.bg_color2 as string) || '#9333ea'}
                      onChange={e => set('bg_color2', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input 
                      value={(props.bg_color2 as string) || ''} 
                      onChange={v => set('bg_color2', v)} 
                    />
                  </div>
                </Field>

                <Field label={`Sudut Gradient Background: ${(props.bg_angle as number) ?? 135}°`}>
                  <input
                    type="range" min={0} max={360} step={15}
                    value={(props.bg_angle as number) ?? 135}
                    onChange={e => set('bg_angle', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {bgType === 'image' && (
              <Field label="URL Foto Background">
                <ImageUploadField value={(props.bg_image as string) || ''} onChange={v => set('bg_image', v)} placeholder="https://..." />
              </Field>
            )}
          </div>
        )}
      </div>

      {/* ── GROUP 3: ANIMASI & EFEK ── */}
      <div className="space-y-2">
        {renderHeader('animation', 'Animasi & Efek', Sparkles)}
        {openGroups.animation && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tipe Animasi">
              <Select value={animType} onChange={v => set('anim_type', v)} options={ANIMATION_TYPES} />
            </Field>

            {animType !== 'none' && (
              <div className="space-y-3">
                <Field label={`Durasi Animasi: ${animDuration} detik`}>
                  <input
                    type="range" min={0.5} max={5} step={0.1}
                    value={animDuration}
                    onChange={e => set('anim_duration', parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>

                <Field label={`Delay Animasi: ${animDelay} detik`}>
                  <input
                    type="range" min={0} max={3} step={0.1}
                    value={animDelay}
                    onChange={e => set('anim_delay', parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
