'use client';
import React, { useState } from 'react';
import { Field, FieldGroup, Input, ImageUploadField, ColorInput, Select, Toggle } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { ChevronDown, Type, Image as ImageIcon, Settings, Trash2 } from 'lucide-react';
import type { OpeningProps } from '../types';
import GradientAngleWheel from '../ui/GradientAngleWheel';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function OpeningEditor({ props, onChange }: P) {
  const typedProps = props as unknown as OpeningProps;
  const set = (key: keyof OpeningProps, val: unknown) => onChange({ ...props, [key]: val });


  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    text: true,
    bg: false,
    settings: false,
  });

  const presets = [
    'THE WEDDING OF',
    'WALIMATUL KHITAN',
    'HAPPY BIRTHDAY',
    'GRADUATION PARTY',
    'GRAND OPENING',
    'SPECIAL EVENT'
  ];

  const [selectedSelectValue, setSelectedSelectValue] = useState<string>(() => {
    const currentTitle = (typedProps.title || '').trim().toUpperCase();
    if (presets.includes(currentTitle)) {
      return currentTitle;
    }
    return 'custom';
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
            <Field label="Template Layout Sampul">
              <Select
                value={typedProps.layout_template || 'classic'}
                onChange={v => set('layout_template', v)}
                options={[
                  { value: 'classic', label: 'Classic Symmetrical Stack' },
                  { value: 'modern_split', label: 'Modern Asymmetrical Split' },
                  { value: 'card_glass', label: 'Glassmorphism Floating Card' },
                  { value: 'elegant_bottom', label: 'Minimalistic Bottom Anchor' },
                  { value: 'netflix_style', label: 'Netflix Cinematic Style' },
                  { value: 'royal_vintage', label: 'Royal Vintage / Classic Ornate' },
                  { value: 'minimal_top', label: 'Minimalistic Top Anchor' },
                  { value: 'block_asymmetric', label: 'Asymmetric Block Accent' },
                  { value: 'luxury_magazine', label: 'Luxury Editorial Magazine Cover' },
                ]}
              />
            </Field>

            <Field label="Animasi Masuk Teks">
              <Select
                value={typedProps.animation_preset || 'none'}
                onChange={v => set('animation_preset', v)}
                options={[
                  { value: 'none', label: 'Tanpa Animasi (Statis)' },
                  { value: 'fade_in', label: '✨ Smooth Fade In' },
                  { value: 'fade_up', label: '🚀 Elegant Fade Up' },
                  { value: 'fade_down', label: '⬇️ Smooth Fade Down' },
                  { value: 'zoom_in', label: '🔍 Gentle Zoom In' },
                  { value: 'tracking_wide', label: '🎬 Cinematic Letter Expansion' },
                  { value: 'slide_left', label: '⬅️ Slide In Left' },
                  { value: 'slide_right', label: '➡️ Slide In Right' },
                  { value: 'blur_reveal', label: '🌫️ Soft Focus Blur Reveal' },
                  { value: 'bounce_soft', label: '🎈 Soft Elastic Bounce' },
                ]}
              />
            </Field>

            {/* Teks Judul Acara Dropdown & Custom Input */}
            <div className="space-y-2">
              <Field label="Pilihan Acara (Teks Judul)">
                <Select
                  value={selectedSelectValue}
                  onChange={v => {
                    setSelectedSelectValue(v);
                    if (v !== 'custom') {
                      set('title', v);
                    }
                  }}
                  options={[
                    { value: 'THE WEDDING OF', label: 'The Wedding Of' },
                    { value: 'WALIMATUL KHITAN', label: 'Walimatul Khitan' },
                    { value: 'HAPPY BIRTHDAY', label: 'Happy Birthday' },
                    { value: 'GRADUATION PARTY', label: 'Graduation Party' },
                    { value: 'GRAND OPENING', label: 'Grand Opening' },
                    { value: 'SPECIAL EVENT', label: 'Special Event' },
                    { value: 'custom', label: '✏️ Kustom / Tulis Sendiri' },
                  ]}
                />
              </Field>

              {selectedSelectValue === 'custom' && (
                <div className="pt-1">
                  <Input
                    value={typedProps.title || ''}
                    onChange={v => set('title', v)}
                    placeholder="Ketik judul acara kustom Anda..."
                  />
                </div>
              )}
            </div>

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
            <Field label="Tipe Latar Belakang">
              <Select
                value={typedProps.bg_type || 'image'}
                onChange={v => set('bg_type', v)}
                options={[
                  { value: 'solid', label: 'Warna Solid' },
                  { value: 'gradient', label: 'Gradasi Warna' },
                  { value: 'image', label: 'Foto Single' },
                  { value: 'slideshow', label: 'Foto Slideshow' },
                ]}
              />
            </Field>

            {typedProps.bg_type === 'solid' && (
              <Field label="Warna Latar Belakang">
                <ColorInput
                  value={typedProps.bg_color || '#ffffff'}
                  onChange={v => set('bg_color', v)}
                />
              </Field>
            )}

            {typedProps.bg_type === 'gradient' && (
              <div className="space-y-4">
                <Field label="Warna Gradasi 1">
                  <ColorInput
                    value={typedProps.bg_color || '#ff7e5f'}
                    onChange={v => set('bg_color', v)}
                  />
                </Field>
                <Field label="Warna Gradasi 2">
                  <ColorInput
                    value={typedProps.bg_color2 || '#feb47b'}
                    onChange={v => set('bg_color2', v)}
                  />
                </Field>
              </div>
            )}

            {(typedProps.bg_type === 'image' || !typedProps.bg_type) && (
              <Field label="Foto Background Sampul">
                <ImagePicker
                  value={typedProps.bg_image || ''}
                  onChange={v => set('bg_image', v)}
                />
              </Field>
            )}

            {typedProps.bg_type === 'slideshow' && (
              <div className="space-y-4">
                <Field label="Daftar Foto Slideshow">
                  <div className="space-y-3">
                    {(typedProps.bg_slideshow_images || []).map((imgUrl, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                        <div className="flex-1 min-w-0">
                          <ImagePicker
                            value={imgUrl}
                            onChange={(v, isNew) => {
                              const newImages = [...(typedProps.bg_slideshow_images || [])];
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

                              const newImages = (typedProps.bg_slideshow_images || []).filter((_, i) => i !== idx);
                              const updatedUploaded = newUploadedList.filter(u => u !== slideUrl);

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

                    {(typedProps.bg_slideshow_images || []).length < 3 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...(typedProps.bg_slideshow_images || []), ''];
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
                    value={typedProps.bg_slideshow_animation || 'fade'}
                    onChange={v => set('bg_slideshow_animation', v)}
                    options={[
                      { value: 'fade', label: 'Fade (Pudar)' },
                      { value: 'zoom', label: 'Zoom (Ken Burns Effect)' },
                      { value: 'slide', label: 'Slide (Geser)' },
                    ]}
                  />
                </Field>

                <Field label={`Durasi per Slide: ${typedProps.bg_slideshow_duration ?? 5} detik`}>
                  <input
                    type="range" min={2} max={10} step={1}
                    value={typedProps.bg_slideshow_duration ?? 5}
                    onChange={e => set('bg_slideshow_duration', parseInt(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </Field>
              </div>
            )}

            {(typedProps.bg_type === 'image' || typedProps.bg_type === 'slideshow' || !typedProps.bg_type) && (
              <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 mt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Efek Foto Latar Belakang</p>
                <Field label={`Efek Blur: ${typedProps.bg_image_blur ?? 0}px`}>
                  <input
                    type="range" min={0} max={20} step={1}
                    value={typedProps.bg_image_blur ?? 0}
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
                    checked={typedProps.bg_image_grayscale ?? false}
                    onChange={v => set('bg_image_grayscale', v)}
                  />
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-4 mt-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kustomisasi Overlay</p>

              <Field label="Tipe Overlay">
                <Select
                  value={typedProps.overlay_type || 'solid'}
                  onChange={v => set('overlay_type', v)}
                  options={[
                    { value: 'solid', label: 'Warna Solid' },
                    { value: 'gradient', label: 'Gradasi Warna' },
                  ]}
                />
              </Field>

              {/* Solid Overlay Settings */}
              {(typedProps.overlay_type === 'solid' || !typedProps.overlay_type) && (
                <div className="space-y-4">
                  <Field label="Warna Overlay">
                    <ColorInput
                      value={typedProps.overlay_color || '#000000'}
                      onChange={v => set('overlay_color', v)}
                    />
                  </Field>

                  <Field label={`Kegelapan Overlay: ${typedProps.overlay_opacity ?? 50}%`}>
                    <input
                      type="range" min={0} max={100} step={5}
                      value={typedProps.overlay_opacity ?? 50}
                      onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </Field>
                </div>
              )}

              {/* Gradient Overlay Settings */}
              {typedProps.overlay_type === 'gradient' && (
                <div className="space-y-4">
                  <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                    <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Gradasi Titik Awal (Atas)</p>
                    <Field label="Warna Awal">
                      <ColorInput
                        value={typedProps.overlay_color || '#000000'}
                        onChange={v => set('overlay_color', v)}
                      />
                    </Field>
                    <Field label={`Kegelapan Awal: ${typedProps.overlay_opacity ?? 50}%`}>
                      <input
                        type="range" min={0} max={100} step={5}
                        value={typedProps.overlay_opacity ?? 50}
                        onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </Field>
                  </div>

                  <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                    <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Gradasi Titik Akhir (Bawah)</p>
                    <Field label="Warna Akhir">
                      <ColorInput
                        value={typedProps.overlay_color2 || '#000000'}
                        onChange={v => set('overlay_color2', v)}
                      />
                    </Field>
                    <Field label={`Kegelapan Akhir: ${typedProps.overlay_opacity2 ?? 0}%`}>
                      <input
                        type="range" min={0} max={100} step={5}
                        value={typedProps.overlay_opacity2 ?? 0}
                        onChange={e => set('overlay_opacity2', parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </Field>
                  </div>

                  <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                    <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Arah & Sudut Gradasi</p>
                    <GradientAngleWheel
                      value={typedProps.overlay_gradient_angle ?? 180}
                      onChange={v => set('overlay_gradient_angle', v)}
                    />
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-400 mt-1">
                Overlay membantu meredupkan latar belakang agar teks undangan kontras dan lebih mudah terbaca.
              </p>
            </div>
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

            <Field label="Animasi Buka Undangan">
              <Select
                value={typedProps.open_animation || 'slide_up'}
                onChange={v => set('open_animation', v)}
                options={[
                  { value: 'none', label: 'Tanpa Animasi (Langsung Terbuka)' },
                  { value: 'slide_up', label: '🚀 Slide Up (Ke Atas)' },
                  { value: 'slide_down', label: '⬇️ Slide Down (Ke Bawah)' },
                  { value: 'fade_out', label: '✨ Fade Out (Pudar)' },
                  { value: 'zoom_fade', label: '🔍 Zoom Out & Fade (Mengecil & Pudar)' },
                  { value: 'zoom_in_fade', label: '🔎 Zoom In & Fade (Membesar & Pudar)' },
                  { value: 'split_vertical', label: '🚪 Split Slide Up & Down (Belah Atas-Bawah)' },
                  { value: 'split_horizontal', label: '↔️ Split Slide Left & Right (Belah Kiri-Kanan)' },
                  { value: 'door_open', label: '🚪 Door Open (Buka Pintu 3D)' },
                ]}
              />
            </Field>
          </div>
        )}
      </div>

    </div>
  );
}
