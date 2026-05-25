'use client';
import React, { useState } from 'react';
import { Field, Input, Textarea, Toggle, Select, ColorInput, AddButton, ItemCard } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { ChevronDown, Gift, Image as ImageIcon, Trash2 } from 'lucide-react';
import GradientAngleWheel from '../ui/GradientAngleWheel';
import { makeId } from '../defaults';

interface P { props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void; }
type Bank = { id: string; bank_name: string; account_name: string; account_number: string; };

export default function GiftEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    gift: true,
    accounts: false,
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

  const enabled = (props.enabled as boolean) ?? false;
  const banks = (props.banks as Bank[]) || [];

  const updateBank = (id: string, key: keyof Bank, val: string) =>
    set('banks', banks.map(b => b.id === id ? { ...b, [key]: val } : b));
  const addBank = () =>
    set('banks', [...banks, { id: makeId(), bank_name: '', account_name: '', account_number: '' }]);
  const removeBank = (id: string) =>
    set('banks', banks.filter(b => b.id !== id));

  return (
    <div className="p-4 space-y-3">

      {/* ── GROUP: PENGATURAN HADIAH ── */}
      <div className="space-y-2">
        {renderHeader('gift', 'Pengaturan Hadiah', Gift)}
        {openGroups.gift && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            {/* Aktifkan Fitur */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-semibold text-gray-700">Aktifkan Fitur Hadiah</p>
                <p className="text-[10px] text-gray-400">Tampilkan info amplop / kado fisik</p>
              </div>
              <Toggle
                checked={enabled}
                onChange={v => set('enabled', v)}
              />
            </div>

            {/* Judul Section */}
            <Field label="Judul Section" hint="Biarkan kosong untuk judul default">
              <Input
                value={(props.title as string) || ''}
                onChange={v => set('title', v)}
                placeholder="Hadiah / Gift"
              />
            </Field>

            {/* Template Layout */}
            <Field label="Template Layout">
              <Select
                value={(props.layout_template as string) || 'classic'}
                onChange={v => set('layout_template', v)}
                options={[
                  { value: 'classic', label: 'Klasik (Tab Rekening/Alamat)' },
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

      {/* ── GROUP: REKENING & ALAMAT ── */}
      <div className="space-y-2">
        {renderHeader('accounts', 'Isi Rekening & Alamat', Gift)}
        {openGroups.accounts && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            
            {/* Bank Accounts Section */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b pb-1">Daftar Rekening / Dompet Digital</p>
              {banks.map(b => (
                <ItemCard key={b.id} title={b.bank_name || 'Rekening'} onRemove={() => removeBank(b.id)}>
                  <Field label="Nama Bank / E-Wallet">
                    <Input value={b.bank_name} onChange={v => updateBank(b.id, 'bank_name', v)} placeholder="BCA / Mandiri / GoPay / dll" />
                  </Field>
                  <Field label="Nomor Rekening">
                    <Input value={b.account_number} onChange={v => updateBank(b.id, 'account_number', v)} placeholder="Masukkan nomor rekening/HP" />
                  </Field>
                  <Field label="Nama Pemilik Rekening">
                    <Input value={b.account_name} onChange={v => updateBank(b.id, 'account_name', v)} placeholder="Masukkan nama pemilik" />
                  </Field>
                </ItemCard>
              ))}
              <AddButton label="Tambah Rekening" onClick={addBank} />
            </div>

            {/* Physical Gift Address Section */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-semibold text-gray-700 font-bold">Kirim Kado Fisik (Alamat)</p>
                  <p className="text-[10px] text-gray-400">Aktifkan alamat pengiriman kado fisik</p>
                </div>
                <Toggle
                  checked={(props.address_enabled as boolean) ?? false}
                  onChange={v => set('address_enabled', v)}
                />
              </div>

              {props.address_enabled && (
                <div className="space-y-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                  <Field label="Label / Tempat Alamat">
                    <Input
                      value={(props.address_title as string) || ''}
                      onChange={v => set('address_title', v)}
                      placeholder="Contoh: Rumah Mempelai Wanita"
                    />
                  </Field>
                  <Field label="Nama Penerima">
                    <Input
                      value={(props.address_recipient as string) || ''}
                      onChange={v => set('address_recipient', v)}
                      placeholder="Masukkan nama penerima paket"
                    />
                  </Field>
                  <Field label="Nomor HP Penerima">
                    <Input
                      value={(props.address_phone as string) || ''}
                      onChange={v => set('address_phone', v)}
                      placeholder="Masukkan nomor telepon penerima"
                    />
                  </Field>
                  <Field label="Alamat Lengkap Pengiriman">
                    <Textarea
                      value={(props.address_text as string) || ''}
                      onChange={v => set('address_text', v)}
                      placeholder="Tulis alamat pengiriman secara lengkap..."
                    />
                  </Field>
                </div>
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
