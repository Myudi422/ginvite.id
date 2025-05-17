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

// URL endpoints
const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';
const TOGGLE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=toggle_status';
const MIDTRANS_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=midtrans';

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
    children: [],
    our_story: [],
    plugin: { rsvp: false, gift: false, whatsapp_notif: false },
    bank_transfer: { enabled: false, account_name: '', account_number: '', bank_name: '' },
    music: { enabled: false, url: '' },
  };

  // initial event data
  const { resepsi: initResepsi, akad: initAkad } = initialEventData || {};
  const initialValues: FormValues = {
    ...defaultValues,
    ...contentData,
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
  const [toParam, setToParam] = useState('');
  const [status, setStatus] = useState<0 | 1>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(pernikahanSchema),
    defaultValues: initialValues,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        const param = toParam ? `?to=${encodeURIComponent(toParam)}&time=${Date.now()}` : `?time=${Date.now()}`;
        iframe.src = `/undang/${userId}/${encodeURIComponent(slug)}${param}`;
      }
    }, 500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [slug, toParam]);

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
      const slugToSave = inputSlug;
      const { gift, whatsapp_notif } = data.plugin;
      const jumlah = gift || whatsapp_notif ? 100000 : 40000;
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slugToSave,
        theme_id: data.theme,
        content: JSON.stringify({ ...data, event: data.event, jumlah }),
      };

      const res = await fetch(SAVE_URL, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);

      // langsung gunakan status server
      const serverStatus = json.data.status as 0 | 1;
      setStatus(serverStatus);
      refreshPreview();
      setSlug(slugToSave);
      router.replace(`/admin/formulir/${userId}/${encodeURIComponent(slugToSave)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // refresh preview iframe
  const refreshPreview = () => {
    const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
    if (iframe) {
      const param = toParam ? `?to=${encodeURIComponent(toParam)}&time=${Date.now()}` : `?time=${Date.now()}`;
      iframe.src = `/undang/${userId}/${encodeURIComponent(slug)}${param}`;
    }
  };

  // finalize toggle: toggle_status API
  const finalizeToggle = async (newStatus: 0 | 1) => {
    const res = await fetch(TOGGLE_URL, {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ user_id: userId, id: invitationId, title: slug, status: newStatus }),
    });
    const j = await res.json();
    if (j.status !== 'success') throw new Error(j.message);
    setStatus(j.data.status);
  };

  // handler toggle aktif/non-aktif
  const onToggle = async () => {
    setSaving(true);
    setError(null);
    try {
      if (status === 0) {
        const mid = await fetch(MIDTRANS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, id_content: invitationId, title: slug }) });
        const mjson = await mid.json();
        if (mjson.status === 'paid') {
          await finalizeToggle(1);
          refreshPreview();
        } else if (mjson.status === 'pending') {
          // @ts-ignore
          window.snap.pay(mjson.snap_token, {
            onSuccess: async () => {
              await finalizeToggle(1);
              refreshPreview();
            },
            onError: (e: any) => setError('Pembayaran gagal: ' + e),
          });
        } else {
          throw new Error(mjson.message || 'Midtrans error');
        }
      } else {
        await finalizeToggle(0);
        refreshPreview();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
      <FormField
  name="slug"
  control={form.control}
  render={() => (
    <FormItem>
      <FormLabel>Judul URL (Yang dibagikan)</FormLabel>
      <div className="flex items-center space-x-2">
        <FormControl>
          <Input
            placeholder="Masukkan slug undangan Anda"
            className="flex-1"
            required                         // <-- HTML5 required
            value={inputSlug}
            onChange={e => {
              const raw = e.target.value
              const newSlug = raw
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
              setInputSlug(newSlug)
              form.setValue('slug', newSlug, {
                shouldValidate: true,
                shouldDirty: true
              })
            }}
          />
        </FormControl>

        {/* Copy */}
        <Button
          variant="outline"
          size="sm"
          disabled={!inputSlug}            // <-- disable if empty
          onClick={() => {
            const slugVal = inputSlug
            const url = `papunda.com/undang/${userId}/${encodeURIComponent(slugVal)}`
            navigator.clipboard.writeText(url)
            alert('Tautan berhasil disalin!')
          }}
        >
          <FiCopy size={16} />
        </Button>

        {/* Open in new tab */}
        <Button
          variant="outline"
          size="sm"
          disabled={!inputSlug}            // <-- disable if empty
          onClick={() => {
            const slugVal = inputSlug
            const fullUrl = `https://papunda.com/undang/${userId}/${encodeURIComponent(slugVal)}`
            window.open(fullUrl, '_blank')
          }}
        >
          <FiExternalLink size={16} />
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>


        <FormItem>
          <FormLabel>Mengundang Preview “to”</FormLabel>
          <Input placeholder="Contoh: Nama Tamu" value={toParam} onChange={e => setToParam(e.target.value)} />
        </FormItem>

        <ThemeSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <FontSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <EventSection />
        <GallerySection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <ParentsSection />
        <ChildrenSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <StorySection />
        <BankTransferSection />
        <MusicSection />
        <PluginSection
          userId={userId}
          invitationId={invitationId}
          slug={inputSlug}
          onSavedSlug={slug}
          onStatusChange={newStatus => {
            setStatus(newStatus);
            refreshPreview();
          }}
        />

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onSave} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
          <Button onClick={onToggle} disabled={saving}>{status === 1 ? 'Non-aktifkan' : 'Aktifkan'}</Button>
        </div>

        {error && <p className="text-red-600">Error: {error}</p>}
      </form>
    </FormProvider>
  );
}
