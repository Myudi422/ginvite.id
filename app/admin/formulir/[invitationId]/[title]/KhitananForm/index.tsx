'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { khitananSchema, type FormValues } from './schema';
import { FontSection } from './FontSection';
import { EventSection } from './EventSection';
import { GallerySection } from './GallerySection';
import { ParentsSection } from './ParentsSection';
import { ChildrenSection } from './ChildrenSection';
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

export function KhitananForm({
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
    plugin: { rsvp: false, navbar: false, gift: false,  whatsapp_notif: false },
    bank_transfer: { enabled: false, account_name: '', account_number: '', bank_name: '' },
    music: { enabled: false, url: '' },
    quote: '',
    quoteCategory: '',
  };

  // initial event data
  // Tambahkan log untuk debug
  console.log('initialEventData', initialEventData);

  const { khitanan: initKhitanan } = initialEventData || {};
  const initialValues: FormValues = {
    ...defaultValues,
    ...contentData,
    event: {
      khitanan: {
        date: initKhitanan?.date ?? '',
        note: initKhitanan?.note ?? '',
        time: initKhitanan?.time ?? '',
        location: initKhitanan?.location ?? '',
        mapsLink: initKhitanan?.mapsLink ?? '',
      },
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
    resolver: zodResolver(khitananSchema),
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
      console.log('UNMOUNT KhitananForm');
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
    const jumlah = (data.plugin.gift || data.plugin.whatsapp_notif) ? 100000 : 40000;
    const payload = {
      user_id: userId,
      id: invitationId,
      title: inputSlug,
      theme_id: data.theme,
      content: JSON.stringify({ ...data, event: data.event, jumlah }),
    };

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
                    disabled // <-- ADD THIS LINE TO DISABLE THE INPUT
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


        <ThemeSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <FontSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <EventSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug}/>
        <QoutesSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <GallerySection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <ParentsSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug}/>
        <ChildrenSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug} />
        <BankTransferSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug}/>
        <MusicSection userId={userId} invitationId={invitationId} slug={inputSlug} onSavedSlug={slug}/>
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
        <TurutSection 
          userId={userId} 
          invitationId={invitationId} 
          slug={inputSlug} 
          onSavedSlug={slug} 
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