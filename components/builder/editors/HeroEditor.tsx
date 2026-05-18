'use client';
import React, { useState } from 'react';
import { Field, Input, Toggle, FieldGroup, Select, AddButton, ImageUploadField } from '../ui/EditorFields';
import { 
  ChevronDown, 
  Type, 
  Image as ImageIcon, 
  Maximize2, 
  Sparkles, 
  Settings 
} from 'lucide-react';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

const OVERLAY_TYPES = [
  { value: 'none',     label: '— Tidak Ada' },
  { value: 'solid',    label: '⬛ Solid (Warna Tunggal)' },
  { value: 'gradient', label: '🌈 Gradient (2 Warna)' },
  { value: 'pattern',  label: '🖼️ Custom URL Gambar / Pattern' },
];

const HEIGHT_OPTIONS = [
  { value: '400',  label: 'Pendek (400px)' },
  { value: '480',  label: 'Sedang (480px) — default' },
  { value: '560',  label: 'Tinggi (560px)' },
  { value: '640',  label: 'Sangat Tinggi (640px)' },
  { value: '100vh',label: 'Layar Penuh (100vh)' },
  { value: 'custom', label: '✏️ Custom...' },
];

const ROUNDED_TYPES = [
  { value: 'all', label: '🔄 Sama Semua Sisi' },
  { value: 'custom', label: '📐 Kustom per Sisi' },
];

const ANIMATION_TYPES = [
  { value: 'none',     label: '— Tanpa Animasi' },
  { value: 'fade',     label: '✨ Fade In (Masuk Perlahan)' },
  { value: 'fade-out', label: '🌑 Fade Out (Menghilang Perlahan)' },
  { value: 'breath',   label: '🌬️ Breathing Pulse (Napas Lambat)' },
];

const TEXT_ANIM_TYPES = [
  { value: 'none',      label: '— Tanpa Animasi' },
  { value: 'fade',      label: '✨ Fade In (Muncul Mulus)' },
  { value: 'slide-up',  label: '⬆️ Slide Up (Geser Ke Atas)' },
  { value: 'zoom',      label: '🔍 Zoom In (Membesar)' },
  { value: 'tracking',  label: '↔️ Letter Spacing (Peregangan Teks)' },
];

const ALIGN_V_OPTIONS = [
  { value: 'top',    label: '🔼 Atas (Top)' },
  { value: 'center', label: '↕️ Tengah (Center) — default' },
  { value: 'bottom', label: '🔽 Bawah (Bottom)' },
];

const ALIGN_H_OPTIONS = [
  { value: 'left',   label: '⬅️ Kiri (Left)' },
  { value: 'center', label: '↔️ Tengah (Center) — default' },
  { value: 'right',  label: '➡️ Kanan (Right)' },
];

const BG_TYPES = [
  { value: 'solid',    label: '⬛ Solid (Warna Tunggal)' },
  { value: 'gradient', label: '🌈 Gradient (Gradasi Warna)' },
  { value: 'image',    label: '🖼️ Gambar / Foto (Satu / Slideshow)' },
];

const IMAGE_MODES = [
  { value: 'single', label: '🖼️ Satu Foto' },
  { value: 'multi',  label: '🎞️ Slideshow (Banyak Foto)' },
];

const SLIDE_EFFECTS = [
  { value: 'fade', label: '✨ Cross Fade (Mulus)' },
  { value: 'slide',label: '➡️ Slide Horizontal (Kiri-Kanan)' },
  { value: 'zoom', label: '🔍 Ken Burns Zoom (Estetik/Premium)' },
];

export default function HeroEditor({ props, onChange }: P) {
  const p = <T,>(key: string) => props[key] as T;
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  // State untuk collapsible group
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    text: true,
    media: false,
    layout: false,
    overlay: false,
    misc: false,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const rawBgType      = p<string>('bg_type')         ?? 'solid';
  const bgImage        = p<string>('bg_image')        ?? '';
  const bgImages       = p<string[]>('bg_images')     ?? [''];
  const bgSlideEffect  = p<string>('bg_slide_effect') ?? 'fade';
  const bgSlideSpeed   = p<number>('bg_slide_speed')  ?? 5;

  // Resolve bgType for UI dropdown selector (support legacy single/multi)
  let bgType = rawBgType;
  if (bgType === 'single') {
    bgType = bgImage ? 'image' : 'gradient';
  } else if (bgType === 'multi') {
    bgType = 'image';
  }

  // Resolve image mode for UI dropdown selector
  const bgImageMode = p<string>('bg_image_mode') || (rawBgType === 'multi' ? 'multi' : 'single');

  const overlayType    = p<string>('overlay_type')    ?? 'solid';
  const overlayOpacity = p<number>('overlay_opacity') ?? 0.4;
  const overlayColor   = p<string>('overlay_color')   ?? '#000000';
  const overlayColor2  = p<string>('overlay_color2')  ?? '#9333ea';
  const overlayAngle   = p<number>('overlay_angle')   ?? 135;
  const overlayPattern = p<string>('overlay_pattern') ?? '';
  const heightValue    = p<string>('height')          ?? '480';
  const isCustomHeight = !HEIGHT_OPTIONS.slice(0, -1).map(o => o.value).includes(heightValue);

  // Border Radius state
  const roundedType    = p<string>('rounded_type')    ?? 'all';
  const roundedAll     = p<number>('rounded_all')     ?? 0;
  const roundedTL      = p<number>('rounded_tl')      ?? 0;
  const roundedTR      = p<number>('rounded_tr')      ?? 0;
  const roundedBL      = p<number>('rounded_bl')      ?? 0;
  const roundedBR      = p<number>('rounded_br')      ?? 0;

  // Animation state
  const overlayAnim    = p<string>('overlay_anim')    ?? 'none';
  const overlaySpeed   = p<number>('overlay_speed')   ?? 3;

  // Update image inside array list
  const handleBgImageChange = (index: number, val: string) => {
    const list = [...bgImages];
    list[index] = val;
    set('bg_images', list);
  };

  // Add image item
  const handleAddBgImage = () => {
    set('bg_images', [...bgImages, '']);
  };

  // Remove image item
  const handleRemoveBgImage = (index: number) => {
    const list = bgImages.filter((_, idx) => idx !== index);
    set('bg_images', list.length > 0 ? list : ['']);
  };

  // Render Accordion Header Helper dengan Lucide Icons
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
      {/* ── GROUP 1: KONTEN TEKS ── */}
      <div className="space-y-2">
        {renderHeader('text', 'Konten Teks', Type)}
        {openGroups.text && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Teks Salam">
              <Input value={p<string>('greeting') || ''} onChange={v => set('greeting', v)} placeholder="The Wedding of" />
            </Field>
            <Field label="Nama Utama">
              <Input value={p<string>('name_primary') || ''} onChange={v => set('name_primary', v)} placeholder="Nama Pengantin Pria" />
            </Field>
            <Field label="Nama Kedua" hint="Kosongkan jika hanya 1 orang">
              <Input value={p<string>('name_secondary') || ''} onChange={v => set('name_secondary', v)} placeholder="Nama Pengantin Wanita" />
            </Field>

            {/* Custom Sizes & Text Entrance Animations */}
            <div className="p-3 bg-gray-50/50 border border-gray-150 rounded-2xl space-y-3 mt-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Ukuran & Gaya Teks</p>
              
              <Field label={`Ukuran Teks Salam: ${p<number>('greeting_size') ?? 12}px`}>
                <input
                  type="range" min={10} max={32} step={1}
                  value={p<number>('greeting_size') ?? 12}
                  onChange={e => set('greeting_size', parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Field>

              <Field label={`Ukuran Teks Nama: ${p<number>('names_size') ?? 36}px`}>
                <input
                  type="range" min={24} max={72} step={1}
                  value={p<number>('names_size') ?? 36}
                  onChange={e => set('names_size', parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Field>

              <div className="w-full h-px bg-gray-200/50 my-1" />

              <Field label="Penyelarasan Vertikal Teks">
                <Select value={p<string>('align_vertical') || 'center'} onChange={v => set('align_vertical', v)} options={ALIGN_V_OPTIONS} />
              </Field>

              <Field label="Penyelarasan Horizontal Teks">
                <Select value={p<string>('align_horizontal') || 'center'} onChange={v => set('align_horizontal', v)} options={ALIGN_H_OPTIONS} />
              </Field>

              <div className="w-full h-px bg-gray-200/50 my-1" />

              <Field label="Efek Animasi Masuk Teks">
                <Select value={p<string>('text_anim') || 'none'} onChange={v => set('text_anim', v)} options={TEXT_ANIM_TYPES} />
              </Field>

              {(p<string>('text_anim') || 'none') !== 'none' && (
                <Field label={`Durasi Animasi: ${p<number>('text_anim_duration') ?? 1} detik`}>
                  <input
                    type="range" min={0.5} max={3} step={0.1}
                    value={p<number>('text_anim_duration') ?? 1}
                    onChange={e => set('text_anim_duration', parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── GROUP 2: MEDIA & BACKGROUND ── */}
      <div className="space-y-2">
        {renderHeader('media', 'Background & Media', ImageIcon)}
        {openGroups.media && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tipe Latar Belakang">
              <Select value={bgType} onChange={v => set('bg_type', v)} options={BG_TYPES} />
            </Field>

            {/* 1. SOLID COLOR MODE */}
            {bgType === 'solid' && (
              <Field label="Warna Background">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={p<string>('bg_solid_color') || '#e879a0'}
                    onChange={e => set('bg_solid_color', e.target.value)}
                    className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <Input 
                    value={p<string>('bg_solid_color') || ''} 
                    onChange={v => set('bg_solid_color', v)} 
                    placeholder="Default: #e879a0" 
                  />
                </div>
              </Field>
            )}

            {/* 2. GRADIENT MODE */}
            {bgType === 'gradient' && (
              <div className="p-3 bg-gray-50/50 border border-gray-150 rounded-2xl space-y-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Warna Latar Belakang Gradient</p>
                
                <Field label="Warna Gradient 1 (Dari)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={p<string>('bg_color') || '#e879a0'}
                      onChange={e => set('bg_color', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input 
                      value={p<string>('bg_color') || ''} 
                      onChange={v => set('bg_color', v)} 
                      placeholder="Default: Aksen Halaman" 
                    />
                  </div>
                </Field>

                <Field label="Warna Gradient 2 (Ke)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={p<string>('bg_color2') || '#9333ea'}
                      onChange={e => set('bg_color2', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input 
                      value={p<string>('bg_color2') || ''} 
                      onChange={v => set('bg_color2', v)} 
                      placeholder="Default: #9333ea" 
                    />
                  </div>
                </Field>

                <Field label={`Sudut Gradient: ${p<number>('bg_angle') ?? 135}°`}>
                  <input
                    type="range" min={0} max={360} step={15}
                    value={p<number>('bg_angle') ?? 135}
                    onChange={e => set('bg_angle', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {/* 3. IMAGE MODE */}
            {bgType === 'image' && (
              <div className="space-y-4">
                <Field label="Tipe Gambar">
                  <Select 
                    value={bgImageMode} 
                    onChange={v => set('bg_image_mode', v)} 
                    options={IMAGE_MODES} 
                  />
                </Field>

                {bgImageMode === 'single' ? (
                  <Field label="URL Foto Background">
                    <ImageUploadField value={bgImage} onChange={v => set('bg_image', v)} placeholder="https://..." />
                  </Field>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-600 block">Daftar Foto Slideshow</label>
                    <div className="space-y-2">
                      {bgImages.map((imgUrl, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex-1">
                            <ImageUploadField 
                              value={imgUrl} 
                              onChange={v => handleBgImageChange(idx, v)} 
                              placeholder={`Foto URL ${idx + 1}`} 
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveBgImage(idx)}
                            className="p-2 border border-red-100 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 font-bold transition-all text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <AddButton label="Tambah Foto Slideshow" onClick={handleAddBgImage} />

                    <Field label="Efek Transisi Slideshow">
                      <Select value={bgSlideEffect} onChange={v => set('bg_slide_effect', v)} options={SLIDE_EFFECTS} />
                    </Field>

                    <Field label={`Durasi Per Slide: ${bgSlideSpeed} detik`}>
                      <input
                        type="range" min={2} max={10} step={1}
                        value={bgSlideSpeed}
                        onChange={e => set('bg_slide_speed', parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </Field>
                  </div>
                )}
              </div>
            )}

            <Field label={`Blur Background: ${p<number>('bg_blur') ?? 0}px`} hint="Efek blur pada foto background">
              <input
                type="range" min={0} max={20} step={1}
                value={p<number>('bg_blur') ?? 0}
                onChange={e => set('bg_blur', parseInt(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </Field>
          </div>
        )}
      </div>

      {/* ── GROUP 3: DIMENSI & SUDUT ── */}
      <div className="space-y-2">
        {renderHeader('layout', 'Ukuran & Sudut', Maximize2)}
        {openGroups.layout && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tinggi Cover">
              <Select
                value={isCustomHeight ? 'custom' : heightValue}
                onChange={v => {
                  if (v === 'custom') return;
                  set('height', v);
                }}
                options={HEIGHT_OPTIONS}
              />
              {(heightValue === 'custom' || isCustomHeight) && (
                <div className="mt-2">
                  <Input
                    value={heightValue}
                    onChange={v => set('height', v)}
                    placeholder="mis: 520px atau 75vh"
                  />
                </div>
              )}
            </Field>

            <Field label="Tipe Sudut Melengkung (Rounded)">
              <Select value={roundedType} onChange={v => set('rounded_type', v)} options={ROUNDED_TYPES} />
            </Field>

            {roundedType === 'all' ? (
              <Field label={`Semua Sisi: ${roundedAll}px`}>
                <input
                  type="range" min={0} max={120} step={2}
                  value={roundedAll}
                  onChange={e => set('rounded_all', parseInt(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </Field>
            ) : (
              <div className="space-y-3 pl-3 border-l-2 border-pink-200">
                <Field label={`Kiri Atas (Top-Left): ${roundedTL}px`}>
                  <input
                    type="range" min={0} max={120} step={2}
                    value={roundedTL}
                    onChange={e => set('rounded_tl', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
                <Field label={`Kanan Atas (Top-Right): ${roundedTR}px`}>
                  <input
                    type="range" min={0} max={120} step={2}
                    value={roundedTR}
                    onChange={e => set('rounded_tr', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
                <Field label={`Kiri Bawah (Bottom-Left): ${roundedBL}px`}>
                  <input
                    type="range" min={0} max={120} step={2}
                    value={roundedBL}
                    onChange={e => set('rounded_bl', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
                <Field label={`Kanan Bawah (Bottom-Right): ${roundedBR}px`}>
                  <input
                    type="range" min={0} max={120} step={2}
                    value={roundedBR}
                    onChange={e => set('rounded_br', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── GROUP 4: OVERLAY & EFEK ── */}
      <div className="space-y-2">
        {renderHeader('overlay', 'Overlay & Efek', Sparkles)}
        {openGroups.overlay && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tipe Overlay">
              <Select value={overlayType} onChange={v => set('overlay_type', v)} options={OVERLAY_TYPES} />
            </Field>

            {overlayType !== 'none' && (
              <>
                <Field label={`Transparansi Overlay: ${Math.round(overlayOpacity * 100)}%`}>
                  <input
                    type="range" min={0} max={1} step={0.05}
                    value={overlayOpacity}
                    onChange={e => set('overlay_opacity', parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>

                <Field label="Animasi Efek Transisi Opacity">
                  <Select value={overlayAnim} onChange={v => set('overlay_anim', v)} options={ANIMATION_TYPES} />
                </Field>

                {overlayAnim !== 'none' && (
                  <Field label={`Durasi Animasi: ${overlaySpeed} detik`}>
                    <input
                      type="range" min={1} max={10} step={0.5}
                      value={overlaySpeed}
                      onChange={e => set('overlay_speed', parseFloat(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </Field>
                )}
              </>
            )}

            {overlayType === 'solid' && (
              <Field label="Warna Overlay">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={overlayColor}
                    onChange={e => set('overlay_color', e.target.value)}
                    className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <Input value={overlayColor} onChange={v => set('overlay_color', v)} placeholder="#000000" />
                </div>
              </Field>
            )}

            {overlayType === 'pattern' && (
              <Field label="URL Gambar / Pattern Overlay" hint="Masukkan URL gambar transparan / png motif / pattern grid">
                <ImageUploadField value={overlayPattern} onChange={v => set('overlay_pattern', v)} placeholder="https://example.com/overlay-pattern.png" />
              </Field>
            )}

            {overlayType === 'gradient' && (
              <>
                <Field label="Warna Gradient 1 (Dari)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={overlayColor}
                      onChange={e => set('overlay_color', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input value={overlayColor} onChange={v => set('overlay_color', v)} placeholder="#000000" />
                  </div>
                </Field>
                <Field label="Warna Gradient 2 (Ke)">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={overlayColor2}
                      onChange={e => set('overlay_color2', e.target.value)}
                      className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                    />
                    <Input value={overlayColor2} onChange={v => set('overlay_color2', v)} placeholder="#9333ea" />
                  </div>
                </Field>
                <Field label={`Sudut Gradient: ${overlayAngle}°`}>
                  <input
                    type="range" min={0} max={360} step={15}
                    value={overlayAngle}
                    onChange={e => set('overlay_angle', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── GROUP 5: LAINNYA ── */}
      <div className="space-y-2">
        {renderHeader('misc', 'Fitur Tambahan', Settings)}
        {openGroups.misc && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Tampilkan Hint Scroll">
              <Toggle checked={p<boolean>('show_scroll_hint') ?? true} onChange={v => set('show_scroll_hint', v)} />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
