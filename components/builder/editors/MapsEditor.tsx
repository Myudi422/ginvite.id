'use client';
import React, { useState } from 'react';
import { Field, Input, ColorInput, Select, Toggle } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { ChevronDown, MapPin, Image as ImageIcon, Trash2 } from 'lucide-react';
import GradientAngleWheel from '../ui/GradientAngleWheel';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }

export default function MapsEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  // On-the-fly migration fallback
  const rawLocations = props.locations as Array<{
    id: string;
    label: string;
    venue_name: string;
    venue_address: string;
    maps_url: string;
    button_text: string;
  }> | undefined;

  const locations = rawLocations && rawLocations.length > 0
    ? rawLocations
    : [
        {
          id: 'default',
          label: (props.label as string) || 'Lokasi Acara',
          venue_name: (props.venue_name as string) || '',
          venue_address: (props.venue_address as string) || '',
          maps_url: (props.maps_url as string) || '',
          button_text: (props.button_text as string) || 'Buka Google Maps'
        }
      ];

  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(locations[0]?.id || null);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    maps: true,
    bg: false,
  });

  const toggleGroup = (key: string) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const updateLocations = (newLocs: typeof locations) => {
    onChange({
      ...props,
      locations: newLocs
    });
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
      {/* ── GROUP: DETAIL MAPS & LOKASI ── */}
      <div className="space-y-2">
        {renderHeader('maps', 'Lokasi Acara', MapPin)}
        {openGroups.maps && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            <Field label="Template Layout Peta">
              <Select
                value={(props.layout_template as string) || 'modern_card'}
                onChange={v => set('layout_template', v)}
                options={[
                  { value: 'modern_card', label: 'Centered Modern Card' },
                  { value: 'split_landscape', label: 'Split Column Landscape' },
                  { value: 'minimalist', label: 'Minimalist Card' },
                  { value: 'magazine_full', label: 'Magazine Full Map (Floating Card)' },
                ]}
              />
            </Field>

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

            <div className="border-t border-gray-100 pt-3 space-y-3">
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Daftar Lokasi Acara</p>
              
              <div className="space-y-2.5">
                {locations.map((loc, idx) => {
                  const isExpanded = expandedLocationId === loc.id;
                  return (
                    <div key={loc.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      {/* Card Title Bar */}
                      <button
                        type="button"
                        onClick={() => setExpandedLocationId(isExpanded ? null : loc.id)}
                        className="w-full flex items-center justify-between py-2 px-3 bg-gray-50/50 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all focus:outline-none"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-[10px] flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{loc.label || `Lokasi #${idx + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {locations.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newLocs = locations.filter(l => l.id !== loc.id);
                                if (expandedLocationId === loc.id) {
                                  setExpandedLocationId(newLocs[0]?.id || null);
                                }
                                updateLocations(newLocs);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                              title="Hapus Lokasi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <ChevronDown
                            className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </div>
                      </button>

                      {/* Card Body */}
                      {isExpanded && (
                        <div className="p-3 bg-white border-t border-gray-100 space-y-4">
                          <Field label="Label Lokasi" hint="Contoh: Akad Nikah, Resepsi, Acara Khitan">
                            <Input
                              value={loc.label}
                              onChange={v => {
                                const newLocs = [...locations];
                                newLocs[idx] = { ...newLocs[idx], label: v };
                                updateLocations(newLocs);
                              }}
                              placeholder="e.g. Akad Nikah"
                            />
                          </Field>

                          <Field label="Nama Tempat / Gedung">
                            <Input
                              value={loc.venue_name}
                              onChange={v => {
                                const newLocs = [...locations];
                                newLocs[idx] = { ...newLocs[idx], venue_name: v };
                                updateLocations(newLocs);
                              }}
                              placeholder="e.g. Gedung Serbaguna Amanda"
                            />
                          </Field>

                          <Field label="Alamat Lengkap Venue">
                            <textarea
                              value={loc.venue_address}
                              onChange={e => {
                                const newLocs = [...locations];
                                newLocs[idx] = { ...newLocs[idx], venue_address: e.target.value };
                                updateLocations(newLocs);
                              }}
                              placeholder="Jl. Raya Indah No. 45, Kebayoran Baru, Jakarta Selatan"
                              className="w-full px-3 py-2 text-xs text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 transition-all"
                              rows={3}
                            />
                          </Field>

                          <Field label="Link Google Maps (HP)" hint="Link petunjuk arah tombol navigasi">
                            <Input
                              value={loc.maps_url}
                              onChange={v => {
                                const newLocs = [...locations];
                                newLocs[idx] = { ...newLocs[idx], maps_url: v };
                                updateLocations(newLocs);
                              }}
                              placeholder="https://maps.app.goo.gl/..."
                            />
                          </Field>

                          <Field label="Teks Tombol Arah">
                            <Input
                              value={loc.button_text}
                              onChange={v => {
                                const newLocs = [...locations];
                                newLocs[idx] = { ...newLocs[idx], button_text: v };
                                updateLocations(newLocs);
                              }}
                              placeholder="Buka Google Maps"
                            />
                          </Field>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = Math.random().toString(36).substring(2, 9);
                  const newLocs = [
                    ...locations,
                    {
                      id: newId,
                      label: `Lokasi #${locations.length + 1}`,
                      venue_name: '',
                      venue_address: '',
                      maps_url: '',
                      button_text: 'Buka Google Maps'
                    }
                  ];
                  setExpandedLocationId(newId);
                  updateLocations(newLocs);
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-pink-200 text-pink-500 font-bold text-xs hover:bg-pink-50 transition-all flex items-center justify-center gap-1.5"
              >
                + Tambah Lokasi Baru
              </button>
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
                              const newUploadedList = (props.bg_new_uploaded_images as string[]) || [];
                              const isNew = newUploadedList.includes(slideUrl);

                              if (slideUrl && isNew) {
                                try {
                                  await deleteImageFromBackblaze(slideUrl);
                                } catch (err) {
                                  console.warn("Gagal menghapus gambar dari server:", err);
                                }
                              }

                              const newImages = ((props.bg_slideshow_images as string[]) || []).filter((_, i) => i !== idx);
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

                {/* Solid Overlay Settings */}
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

                {/* Gradient Overlay Settings */}
                {props.overlay_type === 'gradient' && (
                  <div className="space-y-4">
                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                      <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Gradasi Titik Awal (Atas)</p>
                      <Field label="Warna Awal">
                        <ColorInput
                          value={(props.overlay_color as string) || '#000000'}
                          onChange={v => set('overlay_color', v)}
                        />
                      </Field>
                      <Field label={`Kegelapan Awal: ${(props.overlay_opacity as number) ?? 50}%`}>
                        <input
                          type="range" min={0} max={100} step={5}
                          value={(props.overlay_opacity as number) ?? 50}
                          onChange={e => set('overlay_opacity', parseInt(e.target.value))}
                          className="w-full accent-pink-500 cursor-pointer"
                        />
                      </Field>
                    </div>

                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                      <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Gradasi Titik Akhir (Bawah)</p>
                      <Field label="Warna Akhir">
                        <ColorInput
                          value={(props.overlay_color2 as string) || '#000000'}
                          onChange={v => set('overlay_color2', v)}
                        />
                      </Field>
                      <Field label={`Kegelapan Akhir: ${(props.overlay_opacity2 as number) ?? 0}%`}>
                        <input
                          type="range" min={0} max={100} step={5}
                          value={(props.overlay_opacity2 as number) ?? 0}
                          onChange={e => set('overlay_opacity2', parseInt(e.target.value))}
                          className="w-full accent-pink-500 cursor-pointer"
                        />
                      </Field>
                    </div>

                    <div className="p-2.5 bg-white border border-gray-100 rounded-xl space-y-3 shadow-sm">
                      <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">Arah & Sudut Gradasi</p>
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
