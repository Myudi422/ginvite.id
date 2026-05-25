'use client';

import React, { useState, useEffect } from 'react';
import { Field, Input, Textarea, Toggle, Select, ColorInput, FieldSection } from '../ui/EditorFields';
import ImagePicker from '../ui/ImagePicker';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';
import { ChevronDown, Quote, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import GradientAngleWheel from '../ui/GradientAngleWheel';
import { getQuotes, QuoteGroup } from '@/app/actions/quotes';

// Static fallback quotes in case the API fetch fails or is slow
const STATIC_FALLBACKS = [
  {
    category: 'Islam',
    quotes: [
      'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)',
      'Maha Suci Allah yang telah menciptakan makhluk-makhluk-Nya berpasang-pasangan, baik apa yang ditumbuhkan oleh bumi, dari diri mereka maupun dari apa yang tidak mereka ketahui. (QS. Yasin: 36)'
    ]
  },
  {
    category: 'Kristen',
    quotes: [
      'Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia. (Matius 19:6)',
      'Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan istrinya, sehingga keduanya menjadi satu daging. (Kejadian 2:24)'
    ]
  },
  {
    category: 'Formal / Umum',
    quotes: [
      'Cinta tidak terdiri dari saling memandang, tetapi sama-sama melihat ke satu arah yang sama.',
      'Dua jiwa namun satu pikiran, dua hati namun satu denyut nadi.'
    ]
  }
];

interface P {
  props: Record<string, unknown>;
  onChange: (p: Record<string, unknown>) => void;
}

export default function QuoteEditor({ props, onChange }: P) {
  const set = (key: string, val: unknown) => onChange({ ...props, [key]: val });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    quote: true,
    presets: false,
    bg: false,
  });

  const toggleGroup = (key: string) =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Preset Quote Fetching ────────────────────────────────────────────────
  const [categories, setCategories] = useState<QuoteGroup[]>(STATIC_FALLBACKS);
  const [selectedCatIdx, setSelectedCatIdx] = useState<number>(0);
  const [loadingPresets, setLoadingPresets] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    async function fetchPresets() {
      setLoadingPresets(true);
      try {
        const data = await getQuotes();
        if (active && data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.warn('Gagal memuat preset kutipan online, menggunakan fallback lokal:', err);
      } finally {
        if (active) setLoadingPresets(false);
      }
    }
    fetchPresets();
    return () => { active = false; };
  }, []);

  const handleApplyPreset = (quoteText: string) => {
    // Attempt to extract source if it is inside parentheses at the end
    let resolvedText = quoteText.trim();
    let resolvedSource = '';

    const sourceMatch = resolvedText.match(/\(([^)]+)\)$/);
    if (sourceMatch && sourceMatch[1]) {
      resolvedSource = sourceMatch[1];
      resolvedText = resolvedText.replace(/\s*\([^)]+\)$/, '').trim();
    }

    // Clean leading/trailing quotes
    if (resolvedText.startsWith('"') && resolvedText.endsWith('"')) {
      resolvedText = resolvedText.substring(1, resolvedText.length - 1);
    }

    onChange({
      ...props,
      text: resolvedText,
      source: resolvedSource,
    });
  };

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

  return (
    <div className="p-4 space-y-3">

      {/* ── GROUP: PENGATURAN KUTIPAN ── */}
      <div className="space-y-2">
        {renderHeader('quote', 'Pengaturan Kutipan', Quote)}
        {openGroups.quote && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            {/* Teks Kutipan */}
            <Field label="Teks Kutipan">
              <Textarea
                value={(props.text as string) || ''}
                onChange={v => set('text', v)}
                rows={4}
                placeholder="Masukkan kutipan..."
              />
            </Field>

            {/* Sumber Kutipan */}
            <Field label="Sumber Kutipan (Opsional)">
              <Input
                value={(props.source as string) || ''}
                onChange={v => set('source', v)}
                placeholder="QS. Ar-Rum: 21 / Kejadian 2:24 / dll"
              />
            </Field>

            {/* Template Layout */}
            <Field label="Template Layout">
              <Select
                value={(props.layout_template as string) || 'classic'}
                onChange={v => set('layout_template', v)}
                options={[
                  { value: 'classic', label: 'Klasik Terpusat' },
                  { value: 'card', label: 'Card Terpusat' },
                  { value: 'minimal', label: 'Minimalis Bersih' },
                  { value: 'floating', label: 'Floating Accent' },
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

            {/* Kustomisasi Desain & Warna */}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
              <FieldSection title="Desain & Warna Kustom" />

              {/* Warna Teks Kutipan */}
              <Field label="Warna Teks Kutipan" hint="Mengabaikan warna teks default halaman jika diatur">
                <ColorInput
                  value={(props.custom_text_color as string) || ''}
                  onChange={v => set('custom_text_color', v)}
                />
              </Field>

              {/* Warna Teks Sumber */}
              <Field label="Warna Teks Sumber" hint="Mengabaikan warna teks default halaman jika diatur">
                <ColorInput
                  value={(props.custom_source_color as string) || ''}
                  onChange={v => set('custom_source_color', v)}
                />
              </Field>

              {/* Bentuk Wadah Ikon */}
              <Field label="Bentuk Wadah Ikon Kutip">
                <Select
                  value={(props.quote_shape as string) || 'default'}
                  onChange={v => set('quote_shape', v)}
                  options={[
                    { value: 'default', label: 'Bawaan Layout' },
                    { value: 'circle', label: 'Lingkaran (Circle)' },
                    { value: 'square', label: 'Kotak (Square)' },
                    { value: 'rounded', label: 'Rounded Square' },
                    { value: 'none', label: 'Tanpa Ikon' },
                  ]}
                />
              </Field>

              {props.quote_shape !== 'none' && (
                <>
                  {/* Warna Ikon Kutip */}
                  <Field label="Warna Ikon Kutip">
                    <ColorInput
                      value={(props.custom_quote_color as string) || ''}
                      onChange={v => set('custom_quote_color', v)}
                    />
                  </Field>

                  {/* Kustomisasi Tambahan untuk Bentuk Wadah selain Default */}
                  {props.quote_shape !== 'default' && (
                    <>
                      <Field label="Tipe Background Wadah">
                        <Select
                          value={(props.quote_bg_type as string) || 'default'}
                          onChange={v => set('quote_bg_type', v)}
                          options={[
                            { value: 'default', label: 'Transparan (Bawaan)' },
                            { value: 'solid', label: 'Warna Solid' },
                          ]}
                        />
                      </Field>

                      {props.quote_bg_type === 'solid' && (
                        <Field label="Warna Background Wadah">
                          <ColorInput
                            value={(props.custom_quote_bg as string) || '#ffffff'}
                            onChange={v => set('custom_quote_bg', v)}
                          />
                        </Field>
                      )}

                      {/* Tipe Border Wadah */}
                      <Field label="Garis Tepi Wadah (Border)">
                        <Select
                          value={(props.quote_border_type as string) || 'none'}
                          onChange={v => set('quote_border_type', v)}
                          options={[
                            { value: 'none', label: 'Tanpa Garis' },
                            { value: 'solid', label: 'Garis Solid' },
                          ]}
                        />
                      </Field>

                      {props.quote_border_type === 'solid' && (
                        <Field label="Warna Garis Tepi Wadah">
                          <ColorInput
                            value={(props.custom_quote_border_color as string) || ''}
                            onChange={v => set('custom_quote_border_color', v)}
                          />
                        </Field>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── GROUP: PRESET KUTIPAN ── */}
      <div className="space-y-2">
        {renderHeader('presets', 'Daftar Preset Kutipan', Quote)}
        {openGroups.presets && (
          <div className="p-3 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
            
            {loadingPresets ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
                <span className="text-[10px] text-gray-400 font-medium">Memuat kutipan online...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <Field label="Kategori Preset">
                  <Select
                    value={String(selectedCatIdx)}
                    onChange={v => setSelectedCatIdx(Number(v))}
                    options={categories.map((c, idx) => ({ value: String(idx), label: c.category }))}
                  />
                </Field>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Pilih Kutipan untuk Diterapkan
                  </label>
                  {(categories[selectedCatIdx]?.quotes || []).map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(q)}
                      className="w-full text-left p-3 rounded-xl border border-gray-150 bg-gray-50/50 hover:bg-pink-50/30 hover:border-pink-200 transition-all text-xs text-gray-600 leading-relaxed shadow-sm font-medium focus:outline-none"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
