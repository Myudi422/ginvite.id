'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pernikahanSchema, type FormValues } from './schema';
import { FontSection } from './FontSection';
import { EventSection } from './EventSection';
import { GallerySection } from './GallerySection';
import { ParentsSection } from './ParentsSection';
import { ChildrenSection } from './ChildrenSection';
import { StorySection } from './StorySection';
import { PluginSection } from './PluginSection';
import { BankTransferSection } from './BankTransferSection';
import { ThemeSection } from './ThemeSection';
import { MusicSection } from './MusicSection';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { FiCopy, FiExternalLink } from 'react-icons/fi'
import { QoutesSection } from './QoutesSection'; // Import QoutesSection
import { TurutSection } from './TurutSection';
import { saveContentAction, toggleStatusAction, midtransAction } from '@/app/actions/indexcontent';


interface Props {
  previewUrl: string;
  userId: number;
  invitationId: number;
  initialSlug: string;
  contentData: Partial<Omit<FormValues, 'event'>>;
  initialStatus: 0 | 1;
  initialEventData?: FormValues['event'];
}

export function PernikahanForm({
  previewUrl,
  userId,
  invitationId,
  initialSlug,
  contentData,
  initialStatus,
  initialEventData,
}: Props) {
  // default form values
  const defaultValues: Omit<FormValues, 'event'> = {
    font: { body: '', heading: '', special: '', color: { text_color: '#000000', accent_color: '#FFFFFF' } },
    gallery: { items: [] },
    parents: { bride: { father: '', mother: '' }, groom: { father: '', mother: '' } },
    children: [
      {
        name: 'nama lengkap pria',
        order: 'Pengantin Pria' as const,
        nickname: 'panggilan pria',
        profile: '',
        instagramUsername: ''
      },
      {
        name: 'nama lengkap wanita',
        order: 'Pengantin Wanita' as const,
        nickname: 'panggilan wanita',
        profile: '',
        instagramUsername: ''
      }
    ],
    our_story: [],
    plugin: { rsvp: false, navbar: false, gift: false, whatsapp_notif: false },
    bank_transfer: { enabled: false, account_name: '', account_number: '', bank_name: '' },
    music: { enabled: false, url: '' },
    quote: '',
    quoteCategory: '',
  };

  // initial event data
  const { resepsi: initResepsi, akad: initAkad } = initialEventData || {};

  // Ensure children has default values if empty or missing
  const processedContentData = {
    ...contentData,
    children: contentData.children && contentData.children.length > 0
      ? contentData.children
      : defaultValues.children
  };

  const initialValues: FormValues = {
    ...defaultValues,
    ...processedContentData,
    event: {
      resepsi: {
        date: initResepsi?.date ?? '',
        note: initResepsi?.note ?? '',
        time: initResepsi?.time ?? '',
        location: initResepsi?.location ?? '',
        mapsLink: initResepsi?.mapsLink ?? '',
      },
      akad: initAkad
        ? {
          date: initAkad.date,
          note: initAkad.note,
          time: initAkad.time,
          location: initAkad.location,
          mapsLink: initAkad.mapsLink,
        }
        : undefined,
    },
  };

  // component state
  const [slug, setSlug] = useState(initialSlug);
  const [inputSlug, setInputSlug] = useState(initialSlug);
  const [status, setStatus] = useState<0 | 1>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(pernikahanSchema),
    defaultValues: initialValues,
  });

  // Watch form changes for auto refresh
  const watchedValues = form.watch();

  // Only refresh iframe ONCE on mount, with debug log
  const didReloadRef = useRef(false);
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (didReloadRef.current) return;
    didReloadRef.current = true;
    console.log('RELOAD IFRAME SEKALI');
    // Initial load trigger for LivePreview component
    setTimeout(() => {
      refreshPreview();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refresh on form changes (excluding initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Trigger auto refresh when form data changes
    triggerAutoRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues]);

  useEffect(() => {
    return () => {
      console.log('UNMOUNT PernikahanForm');
    };
  }, []);

  // slug sanitization
  const onSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const newSlug = raw
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setInputSlug(newSlug);
  };

  // save content
  const onSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const data = form.getValues();
      console.log('Form data before save:', data); // Debug log
      console.log('Children data:', data.children); // Debug children specifically

      const jumlah = (data.plugin.gift || data.plugin.whatsapp_notif) ? 100000 : 40000;
      const payload = {
        user_id: userId,
        id: invitationId,
        title: inputSlug,
        theme_id: data.theme,
        content: JSON.stringify({ ...data, event: data.event, jumlah }),
      };

      console.log('Payload to save:', payload); // Debug payload
      const result = await saveContentAction(payload);
      setStatus(result.status as 0 | 1);
      setSlug(inputSlug);
      refreshPreview();
      router.replace(`/admin/formulir/${userId}/${encodeURIComponent(inputSlug)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // refresh preview iframe (now triggers LivePreview component)
  const refreshPreview = () => {
    // Trigger refresh event for LivePreview component
    window.dispatchEvent(new CustomEvent('refreshPreview'));
  };

  // trigger auto refresh on form changes
  const triggerAutoRefresh = () => {
    window.dispatchEvent(new CustomEvent('formDataChanged'));
  };

  const onToggle = async () => {
    setSaving(true);
    setError(null);

    try {
      if (status === 0) {
        const mjson = await midtransAction({
          user_id: userId,
          id_content: invitationId,
          title: slug,
        });

        if (mjson.status === 'paid') {
          const toggled = await toggleStatusAction({
            user_id: userId,
            id: invitationId,
            title: slug,
            status: 1,
          });
          setStatus(toggled.status);
          refreshPreview();
        } else {
          // pending -> buka Snap
          // @ts-ignore
          window.snap.pay(mjson.snap_token, {
            onSuccess: async () => {
              const toggled = await toggleStatusAction({
                user_id: userId,
                id: invitationId,
                title: slug,
                status: 1,
              });
              setStatus(toggled.status);
              refreshPreview();
            },
            onError: (e: any) => setError('Pembayaran gagal: ' + e),
          });
        }
      } else {
        // jika sudah aktif, langsung non-aktifkan
        const toggled = await toggleStatusAction({
          user_id: userId,
          id: invitationId,
          title: slug,
          status: 0,
        });
        setStatus(toggled.status);
        refreshPreview();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // helper: section header
  const SectionHeader = ({ num, title, desc }: { num: number; title: string; desc: string }) => (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{num}</div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={e => e.preventDefault()} className="space-y-1">

        {/* URL Undangan */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-blue-600 mb-1">🔗 Link Undangan</p>
          <FormField
            name="slug"
            control={form.control}
            render={() => (
              <FormItem>
                <FormLabel className="text-xs text-blue-700">URL yang dibagikan ke tamu</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="Masukkan slug undangan"
                      className="flex-1 text-sm bg-white"
                      value={inputSlug}
                      disabled
                      onChange={e => {
                        const raw = e.target.value;
                        const newSlug = raw.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
                        setInputSlug(newSlug);
                        form.setValue('slug', newSlug, { shouldValidate: true, shouldDirty: true });
                      }}
                    />
                  </FormControl>
                  <Button variant="outline" size="sm" disabled={!inputSlug}
                    onClick={() => { navigator.clipboard.writeText(`papunda.com/undang/${userId}/${encodeURIComponent(inputSlug)}`); alert('Tautan berhasil disalin!'); }}>
                    <FiCopy size={14} />
                  </Button>
                  <Button variant="outline" size="sm" disabled={!inputSlug}
                    onClick={() => window.open(`https://papunda.com/undang/${userId}/${encodeURIComponent(inputSlug)}`, '_blank')}>
                    <FiExternalLink size={14} />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl mb-4 text-sm font-medium ${status === 1 ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
          <span className={`w-2 h-2 rounded-full ${status === 1 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
          {status === 1 ? '✅ Undangan aktif & bisa diakses tamu' : '⏸ Belum aktif — klik "Aktifkan" setelah selesai mengisi'}
        </div>

        {/* 1. Tema */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={1} title="Pilih Tema" desc="Pilih desain tampilan undangan kamu" />
          <ThemeSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 2. Font */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={2} title="Gaya Tulisan" desc="Pilih font untuk judul, isi, dan nama pengantin" />
          <FontSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 3. Jadwal Acara */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={3} title="Jadwal Acara" desc="Tanggal, waktu, lokasi akad & resepsi" />
          <EventSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 4. Kutipan */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={4} title="Kutipan / Ayat" desc="Kata-kata indah yang ditampilkan di undangan" />
          <QoutesSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 5. Galeri Foto */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={5} title="Galeri Foto" desc="Foto-foto yang ditampilkan di undangan" />
          <GallerySection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 6. Orang Tua */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={6} title="Nama Orang Tua" desc="Nama ayah & ibu dari kedua mempelai" />
          <ParentsSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 7. Data Pengantin */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={7} title="Data Pengantin" desc="Nama lengkap, panggilan, dan foto mempelai" />
          <ChildrenSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 8. Cerita Kita */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={8} title="Cerita Kita" desc="Perjalanan kisah cinta hingga hari pernikahan" />
          <StorySection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 9. Gift / Transfer */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={9} title="Gift & Transfer" desc="Rekening untuk tamu yang ingin memberikan hadiah" />
          <BankTransferSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 10. Musik */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={10} title="Musik Latar" desc="Musik yang diputar saat tamu membuka undangan" />
          <MusicSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* 11. Plugin */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={11} title="Plugin & Fitur" desc="Aktifkan fitur tambahan: RSVP, QR, Notifikasi WA, dll" />
          <PluginSection
            userId={userId}
            invitationId={invitationId}
            slug={inputSlug}
            onSavedSlug={slug}
            onStatusChange={newStatus => { setStatus(newStatus); refreshPreview(); }}
          />
        </div>

        {/* 12. Turut Mengundang */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white mb-3">
          <SectionHeader num={12} title="Turut Mengundang" desc="Nama pihak lain yang turut mengundang (opsional)" />
          <TurutSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        </div>

        {/* ── Action Buttons ── */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 -mx-4 px-4 py-4 flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onSave}
            disabled={saving}
            className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl"
          >
            {saving ? '⏳ Menyimpan…' : '💾 Simpan Perubahan'}
          </Button>
          <Button
            onClick={onToggle}
            disabled={saving}
            className={`flex-1 rounded-xl font-semibold ${status === 1 ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-md'}`}
          >
            {status === 1 ? '⏸ Non-aktifkan' : '🚀 Aktifkan Undangan'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}
      </form>
    </FormProvider>
  );
}

