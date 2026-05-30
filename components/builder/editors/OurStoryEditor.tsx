'use client';

import React, { useState } from 'react';
import { Field, Input, Textarea, Toggle, Select, ColorInput, AddButton, ItemCard, FieldSection } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { ChevronDown, Calendar, Heart, Image as ImageIcon, Trash2 } from 'lucide-react';
import GradientAngleWheel from '../ui/GradientAngleWheel';
import { makeId } from '../defaults';

interface P {
  props: Record<string, unknown>;
  onChange: (p: Record<string, unknown>) => void;
}

type StoryItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
};

export default function OurStoryEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    settings: true,
    items: false,
    bg: false,
  });

  const toggleGroup = (key: string) =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const renderHeader = (
    key: string,
    title: string,
    Icon: React.ComponentType<{ className?: string }>
  ) => {
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

  const items = (props.items as StoryItem[]) || [];

  const updateItem = (id: string, key: keyof StoryItem, val: string) =>
    set('items', items.map(item => item.id === id ? { ...item, [key]: val } : item));
  const addItem = () =>
    set('items', [...items, { id: makeId(), date: '', title: '', description: '', image: '' }]);
  const removeItem = (id: string) =>
    set('items', items.filter(item => item.id !== id));

  return (
    <div className="p-4 space-y-3">

      {/* ── GROUP: PENGATURAN KISAH KAMI ── */}
      <div className="space-y-2">
        {renderHeader('settings', 'Pengaturan Kisah Kami', Calendar)}
        {openGroups.settings && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            {/* Judul Section */}
            <Field label="Judul Section" hint="Biarkan kosong untuk judul default">
              <Input
                value={(props.title as string) || ''}
                onChange={v => set('title', v)}
                placeholder="Kisah Kami"
              />
            </Field>

            {/* Deskripsi Section */}
            <Field label="Deskripsi Pengantar">
              <Textarea
                value={(props.description as string) || ''}
                onChange={v => set('description', v)}
                placeholder="Tulis ringkasan perjalanan kisah Anda di sini..."
              />
            </Field>

            {/* Template Layout */}
            <Field label="Template Layout">
              <Select
                value={(props.layout_template as string) || 'classic'}
                onChange={v => set('layout_template', v)}
                options={[
                  { value: 'classic', label: 'Klasik (Timeline Vertikal)' },
                  { value: 'card', label: 'Card Terpusat' },
                  { value: 'minimal', label: 'Minimalis Bersih' },
                  { value: 'floating', label: 'Floating Cards' },
                ]}
              />
            </Field>

            {/* Animasi Masuk */}
            <Field label="Animasi Masuk Elemen">
              <Select
                value={(props.animation_preset as string) || 'none'}
                onChange={v => set('animation_preset', v)}
                options={[
                  { value: 'none', label: 'Tanpa Animasi' },
                  { value: 'fade_in', label: 'Pudar Masuk (Fade In)' },
                  { value: 'fade_up', label: 'Pudar ke Atas (Fade Up)' },
                  { value: 'fade_down', label: 'Pudar ke Bawah (Fade Down)' },
                  { value: 'zoom_in', label: 'Perbesar (Zoom In)' },
                  { value: 'tracking_wide', label: 'Perenggangan Huruf (Tracking Wide)' },
                  { value: 'slide_left', label: 'Geser dari Kiri (Slide Left)' },
                  { value: 'slide_right', label: 'Geser dari Kanan (Slide Right)' },
                  { value: 'blur_reveal', label: 'Efek Blur Muncul (Blur Reveal)' },
                  { value: 'bounce_soft', label: 'Memantul Lembut (Bounce Soft)' },
                ]}
              />
            </Field>
          </div>
        )}
      </div>

      {/* ── GROUP: ISI MOMEN KISAH KAMI ── */}
      <div className="space-y-2">
        {renderHeader('items', 'Isi Momen Kisah Kami', Heart)}
        {openGroups.items && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b pb-1">Daftar Momen Perjalanan Cinta</p>
              {items.map(item => (
                <ItemCard key={item.id} title={item.title || 'Momen Kisah'} onRemove={() => removeItem(item.id)}>
                  <Field label="Tanggal / Waktu Momen">
                    <Input value={item.date} onChange={v => updateItem(item.id, 'date', v)} placeholder="Contoh: 12 Januari 2024 / Awal 2021" />
                  </Field>
                  <Field label="Judul Momen">
                    <Input value={item.title} onChange={v => updateItem(item.id, 'title', v)} placeholder="Contoh: Pertama Kali Bertemu" />
                  </Field>
                  <Field label="Deskripsi / Cerita">
                    <Textarea value={item.description} onChange={v => updateItem(item.id, 'description', v)} placeholder="Ceritakan bagaimana momen indah tersebut terjadi..." />
                  </Field>
                  <Field label="URL Foto / Gambar Momen">
                    <ImagePicker
                      value={item.image || ''}
                      onChange={v => updateItem(item.id, 'image', v)}
                    />
                  </Field>
                </ItemCard>
              ))}
              {items.length < 3 ? (
                <AddButton label="Tambah Momen Kisah" onClick={addItem} />
              ) : (
                <p className="text-[10px] text-gray-400 font-medium italic text-center py-2.5 bg-gray-50 rounded-xl border border-dashed border-gray-200 select-none">
                  Batas maksimal momen tercapai (Maksimal 3 momen).
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── GROUP: LATAR BELAKANG ── */}
      <div className="space-y-2">
        {renderHeader('bg', 'Latar Belakang', ImageIcon)}
        {openGroups.bg && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">

            <Field label="Tipe Latar Belakang">
              <Select
                value={(props.bg_type as string) || 'solid'}
                onChange={v => set('bg_type', v)}
                options={[
                  { value: 'solid', label: 'Warna Solid (Inherit)' },
                  { value: 'gradient', label: 'Gradasi Warna' },
                  { value: 'image', label: 'Foto Single' },
                  { value: 'slideshow', label: 'Foto Slideshow' },
                ]}
              />
            </Field>

            {props.bg_type === 'solid' && (
              <Field label="Warna Latar Belakang">
                <ColorInput
                  value={(props.bg_color as string) || '#ffffff'}
                  onChange={v => set('bg_color', v)}
                />
              </Field>
            )}

            {props.bg_type === 'gradient' && (
              <div className="space-y-4">
                <Field label="Warna Gradasi 1">
                  <ColorInput
                    value={(props.bg_color as string) || '#ff7e5f'}
                    onChange={v => set('bg_color', v)}
                  />
                </Field>
                <Field label="Warna Gradasi 2">
                  <ColorInput
                    value={(props.bg_color2 as string) || '#feb47b'}
                    onChange={v => set('bg_color2', v)}
                  />
                </Field>
                <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                  <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Arah & Sudut Gradasi Background</p>
                  <GradientAngleWheel
                    value={(props.bg_gradient_angle as number) ?? 135}
                    onChange={v => set('bg_gradient_angle', v)}
                  />
                </div>
              </div>
            )}

            {props.bg_type === 'image' && (
              <Field label="Foto Background">
                <ImagePicker
                  value={(props.bg_image as string) || ''}
                  onChange={v => set('bg_image', v)}
                />
              </Field>
            )}

            {props.bg_type === 'slideshow' && (
              <div className="space-y-4">
                <Field label="Daftar Foto Slideshow">
                  <div className="space-y-3">
                    {((props.bg_slideshow_images as string[]) || []).map((imgUrl, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <ImagePicker
                            value={imgUrl}
                            onChange={(v, isNew) => {
                              const newImages = [...((props.bg_slideshow_images as string[]) || [])];
                              newImages[idx] = v;
                              if (isNew) {
                                const newUploaded = [...((props.bg_new_uploaded_images as string[]) || [])];
                                newUploaded.push(v);
                                onChange({ ...props, bg_slideshow_images: newImages, bg_new_uploaded_images: newUploaded });
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
                              const newUploadedList = (props.bg_new_uploaded_images as string[]) || [];
                              const isNew = newUploadedList.includes(slideUrl);
                              if (slideUrl && isNew) {
                                try { await deleteImageFromBackblaze(slideUrl); } catch { /* ignore */ }
                              }
                              const newImages = ((props.bg_slideshow_images as string[]) || []).filter((_, i) => i !== idx);
                              const updatedUploaded = newUploadedList.filter(u => u !== slideUrl);
                              onChange({ ...props, bg_slideshow_images: newImages, bg_new_uploaded_images: updatedUploaded });
                            }}
                            className="p-2.5 text-red-500 hover:text-red-700 bg-white border border-gray-100 rounded-xl flex-shrink-0 transition-colors"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {((props.bg_slideshow_images as string[]) || []).length < 3 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...((props.bg_slideshow_images as string[]) || []), ''];
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
                    value={(props.bg_slideshow_animation as string) || 'fade'}
                    onChange={v => set('bg_slideshow_animation', v)}
                    options={[
                      { value: 'fade', label: 'Fade (Pudar)' },
                      { value: 'zoom', label: 'Zoom (Ken Burns Effect)' },
                      { value: 'slide', label: 'Slide (Geser)' },
                    ]}
                  />
                </Field>

                <Field label={`Durasi per Slide: ${(props.bg_slideshow_duration as number) ?? 5} detik`}>
                  <input
                    type="range" min={2} max={10} step={1}
                    value={(props.bg_slideshow_duration as number) ?? 5}
                    onChange={e => set('bg_slideshow_duration', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {(props.bg_type === 'image' || props.bg_type === 'slideshow') && (
              <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 mt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Efek Foto Latar Belakang</p>
                <Field label={`Efek Blur: ${(props.bg_image_blur as number) ?? 0}px`}>
                  <input
                    type="range" min={0} max={20} step={1}
                    value={(props.bg_image_blur as number) ?? 0}
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
                    checked={(props.bg_image_grayscale as boolean) ?? false}
                    onChange={v => set('bg_image_grayscale', v)}
                  />
                </div>
              </div>
            )}

            {props.bg_type !== 'solid' && !!props.bg_type && (
              <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 mt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kustomisasi Overlay</p>

                <Field label="Tipe Overlay">
                  <Select
                    value={(props.overlay_type as string) || 'solid'}
                    onChange={v => set('overlay_type', v)}
                    options={[
                      { value: 'solid', label: 'Warna Solid' },
                      { value: 'gradient', label: 'Gradasi Warna' },
                    ]}
                  />
                </Field>

                {(props.overlay_type === 'solid' || !props.overlay_type) && (
                  <div className="space-y-4">
                    <Field label="Warna Overlay">
                      <ColorInput
                        value={(props.overlay_color as string) || '#000000'}
                        onChange={v => set('overlay_color', v)}
                      />
                    </Field>
                    <Field label={`Kegelapan Overlay: ${(props.overlay_opacity as number) ?? 50}%`}>
                      <input
                        type="range" min={0} max={100} step={5}
                        value={(props.overlay_opacity as number) ?? 50}
                        onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </Field>
                  </div>
                )}

                {props.overlay_type === 'gradient' && (
                  <div className="space-y-4">
                    <Field label="Warna Overlay 1">
                      <ColorInput
                        value={(props.overlay_color as string) || '#000000'}
                        onChange={v => set('overlay_color', v)}
                      />
                    </Field>
                    <Field label={`Kegelapan Overlay 1: ${(props.overlay_opacity as number) ?? 50}%`}>
                      <input
                        type="range" min={0} max={100} step={5}
                        value={(props.overlay_opacity as number) ?? 50}
                        onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </Field>
                    <Field label="Warna Overlay 2">
                      <ColorInput
                        value={(props.overlay_color2 as string) || '#000000'}
                        onChange={v => set('overlay_color2', v)}
                      />
                    </Field>
                    <Field label={`Kegelapan Overlay 2: ${(props.overlay_opacity2 as number) ?? 0}%`}>
                      <input
                        type="range" min={0} max={100} step={5}
                        value={(props.overlay_opacity2 as number) ?? 0}
                        onChange={e => set('overlay_opacity2', parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </Field>
                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                      <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Arah & Sudut Gradasi Overlay</p>
                      <GradientAngleWheel
                        value={(props.overlay_gradient_angle as number) ?? 180}
                        onChange={v => set('overlay_gradient_angle', v)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
