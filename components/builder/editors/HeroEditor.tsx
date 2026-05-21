'use client';
import React, { useState } from 'react';
import { Field, Input, Toggle, FieldGroup, Select, AddButton, ImageUploadField, ColorInput } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';
import GradientAngleWheel from '../ui/GradientAngleWheel';
import { 
  ChevronDown, 
  Type, 
  Image as ImageIcon, 
  Maximize2, 
  Sparkles, 
  Settings,
  Trash2
} from 'lucide-react';
import type { HeroProps } from '../types';

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

  const typedProps = props as unknown as any;

  const bgType = typedProps.bg_type || 'image';
  const bgColor = typedProps.bg_color || '';
  const bgColor2 = typedProps.bg_color2 || '';
  const bgImage = typedProps.bg_image || '';
  
  // Blur & Grayscale
  const bgImageBlur = typedProps.bg_image_blur ?? (typedProps.bg_blur as number ?? 0);
  const bgImageGrayscale = typedProps.bg_image_grayscale ?? false;

  // Slideshow
  const slideshowImages = typedProps.bg_slideshow_images || (typedProps.bg_images as string[]) || [];
  const slideshowAnimation = typedProps.bg_slideshow_animation || (typedProps.bg_slide_effect as any) || 'fade';
  const slideshowDuration = typedProps.bg_slideshow_duration ?? (typedProps.bg_slide_speed as number ?? 5);

  const overlayType = (typedProps.overlay_type || 'solid') as 'solid' | 'gradient';
  const overlayColor = typedProps.overlay_color || '#000000';
  const overlayColor2 = typedProps.overlay_color2 || '#000000';
  
  const rawOverlayOpacity = typedProps.overlay_opacity ?? 40;
  const overlayOpacity = typeof rawOverlayOpacity === 'number'
    ? (rawOverlayOpacity <= 1 && rawOverlayOpacity > 0 ? Math.round(rawOverlayOpacity * 100) : rawOverlayOpacity)
    : 40;

  const overlayOpacity2 = typedProps.overlay_opacity2 ?? 0;
  const overlayGradientAngle = typedProps.overlay_gradient_angle ?? (typedProps.overlay_angle as number ?? 180);
  const overlayPattern = typedProps.overlay_pattern ?? '';

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
              <Select
                value={bgType || 'image'}
                onChange={v => set('bg_type', v)}
                options={[
                  { value: 'solid', label: 'Warna Solid' },
                  { value: 'gradient', label: 'Gradasi Warna' },
                  { value: 'image', label: 'Foto Single' },
                  { value: 'slideshow', label: 'Foto Slideshow' },
                ]}
              />
            </Field>

            {bgType === 'solid' && (
              <Field label="Warna Latar Belakang">
                <ColorInput
                  value={bgColor || '#ffffff'}
                  onChange={v => set('bg_color', v)}
                />
              </Field>
            )}

            {bgType === 'gradient' && (
              <div className="space-y-4">
                <Field label="Warna Gradasi 1">
                  <ColorInput
                    value={bgColor || '#ff7e5f'}
                    onChange={v => set('bg_color', v)}
                  />
                </Field>
                <Field label="Warna Gradasi 2">
                  <ColorInput
                    value={bgColor2 || '#feb47b'}
                    onChange={v => set('bg_color2', v)}
                  />
                </Field>
                <Field label={`Sudut Gradasi: ${typedProps.bg_angle ?? 135}°`}>
                  <input
                    type="range" min={0} max={360} step={15}
                    value={typedProps.bg_angle ?? 135}
                    onChange={e => set('bg_angle', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {(bgType === 'image' || !bgType) && (
              <Field label="Foto Background Cover">
                <ImagePicker
                  value={bgImage || ''}
                  onChange={v => set('bg_image', v)}
                />
              </Field>
            )}

            {bgType === 'slideshow' && (
              <div className="space-y-4">
                <Field label="Daftar Foto Slideshow">
                  <div className="space-y-3">
                    {(slideshowImages || []).map((imgUrl: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <ImagePicker
                            value={imgUrl}
                            onChange={(v: string, isNew?: boolean) => {
                              const newImages = [...(slideshowImages || [])];
                              newImages[idx] = v;

                              if (isNew) {
                                const newUploaded = [...(typedProps.bg_new_uploaded_images || [])];
                                newUploaded.push(v);
                                onChange({
                                  ...props,
                                  bg_slideshow_images: newImages,
                                  bg_new_uploaded_images: newUploaded
                                });
                              } else {
                                set('bg_slideshow_images', newImages);
                              }
                            }}
                            label={`Foto #${idx + 1}`}
                          />
                        </div>
                        {!imgUrl && (
                          <button
                            type="button"
                            onClick={async () => {
                              const slideUrl = imgUrl;
                              const newUploadedList = typedProps.bg_new_uploaded_images || [];
                              const isNew = newUploadedList.includes(slideUrl);

                              if (slideUrl && isNew) {
                                try {
                                  await deleteImageFromBackblaze(slideUrl);
                                } catch (err) {
                                  console.warn("Gagal menghapus gambar dari server:", err);
                                }
                              }

                              const newImages = (slideshowImages || []).filter((_: string, i: number) => i !== idx);
                              const updatedUploaded = newUploadedList.filter((u: string) => u !== slideUrl);

                              onChange({
                                ...props,
                                bg_slideshow_images: newImages,
                                bg_new_uploaded_images: updatedUploaded
                              });
                            }}
                            className="p-2.5 text-red-500 hover:text-red-700 bg-white border border-gray-100 rounded-xl flex-shrink-0 transition-colors"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {(slideshowImages || []).length < 3 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...(slideshowImages || []), ''];
                          set('bg_slideshow_images', newImages);
                        }}
                        className="w-full py-2.5 rounded-xl border border-dashed border-pink-200 text-pink-500 font-bold text-xs hover:bg-pink-50 transition-all flex items-center justify-center gap-1.5"
                      >
                        + Tambah Foto Slideshow
                      </button>
                    ) : (
                      <p className="text-[10px] text-gray-400 font-medium italic text-center py-1 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        Batas maksimal slideshow tercapai (Maksimal 3 foto).
                      </p>
                    )}
                  </div>
                </Field>

                <Field label="Pilihan Animasi Slideshow">
                  <Select
                    value={slideshowAnimation || 'fade'}
                    onChange={v => set('bg_slideshow_animation', v)}
                    options={[
                      { value: 'fade', label: 'Fade (Pudar)' },
                      { value: 'zoom', label: 'Zoom (Ken Burns Effect)' },
                      { value: 'slide', label: 'Slide (Geser)' },
                    ]}
                  />
                </Field>

                <Field label={`Durasi per Slide: ${slideshowDuration ?? 5} detik`}>
                  <input
                    type="range" min={2} max={10} step={1}
                    value={slideshowDuration ?? 5}
                    onChange={e => set('bg_slideshow_duration', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {(bgType === 'image' || bgType === 'slideshow' || !bgType) && (
              <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 mt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Efek Foto Latar Belakang</p>
                <Field label={`Efek Blur: ${bgImageBlur ?? 0}px`}>
                  <input
                    type="range" min={0} max={20} step={1}
                    value={bgImageBlur ?? 0}
                    onChange={e => set('bg_image_blur', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Hitam & Putih (Black & White)</p>
                    <p className="text-[10px] text-gray-400">Ubah foto menjadi grayscale</p>
                  </div>
                  <Toggle
                    checked={bgImageGrayscale ?? false}
                    onChange={v => set('bg_image_grayscale', v)}
                  />
                </div>
              </div>
            )}
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
              <Select
                value={overlayType || 'solid'}
                onChange={v => set('overlay_type', v)}
                options={[
                  { value: 'solid', label: 'Warna Solid' },
                  { value: 'gradient', label: 'Gradasi Warna' },
                ]}
              />
            </Field>

            {/* Solid Overlay Settings */}
            {(overlayType === 'solid' || !overlayType) && (
              <div className="space-y-4">
                <Field label="Warna Overlay">
                  <ColorInput
                    value={overlayColor || '#000000'}
                    onChange={v => set('overlay_color', v)}
                  />
                </Field>

                <Field label={`Kegelapan Overlay: ${overlayOpacity ?? 50}%`}>
                  <input
                    type="range" min={0} max={100} step={5}
                    value={overlayOpacity ?? 50}
                    onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {/* Gradient Overlay Settings */}
            {overlayType === 'gradient' && (
              <div className="space-y-4">
                <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Gradasi Titik Awal (Atas)</p>
                  <Field label="Warna Awal">
                    <ColorInput
                      value={overlayColor || '#000000'}
                      onChange={v => set('overlay_color', v)}
                    />
                  </Field>
                  <Field label={`Kegelapan Awal: ${overlayOpacity ?? 50}%`}>
                    <input
                      type="range" min={0} max={100} step={5}
                      value={overlayOpacity ?? 50}
                      onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </Field>
                </div>

                <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Gradasi Titik Akhir (Bawah)</p>
                  <Field label="Warna Akhir">
                    <ColorInput
                      value={overlayColor2 || '#000000'}
                      onChange={v => set('overlay_color2', v)}
                    />
                  </Field>
                  <Field label={`Kegelapan Akhir: ${overlayOpacity2 ?? 0}%`}>
                    <input
                      type="range" min={0} max={100} step={5}
                      value={overlayOpacity2 ?? 0}
                      onChange={e => set('overlay_opacity2', parseInt(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </Field>
                </div>

                <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Arah & Sudut Gradasi</p>
                  <GradientAngleWheel
                    value={overlayGradientAngle ?? 180}
                    onChange={v => set('overlay_gradient_angle', v)}
                  />
                </div>
              </div>
            )}

            {/* Legacy Animations & Speed */}
            <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 mt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Animasi & Transisi Overlay</p>
              
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
            </div>

            <p className="text-[10px] text-gray-400 mt-1">
              Overlay membantu meredupkan latar belakang agar teks undangan kontras dan lebih mudah terbaca.
            </p>
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
