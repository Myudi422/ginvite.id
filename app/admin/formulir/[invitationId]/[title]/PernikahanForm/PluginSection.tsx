import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';
import { Crown, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { pluginSaveAction } from '@/app/actions/pluginsaved';

interface PluginSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
  onStatusChange?: (newStatus: 0 | 1) => void;
}

export function PluginSection({ userId, invitationId, slug, onSavedSlug, onStatusChange }: PluginSectionProps) {
  const { control, getValues, setValue } = useFormContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoImage, setInfoImage] = useState<string>('');

  const autoSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const data = getValues();
      const { gift, whatsapp_notif } = data.plugin;
      const jumlah = gift || whatsapp_notif ? 100000 : 40000;
      const contentPayload = { ...data, event: { ...data.event }, jumlah };
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify(contentPayload),
        waktu_acara: data.event.resepsi?.date,
        time: data.event.resepsi?.time,
        location: data.event.resepsi?.location,
        mapsLink: data.event.resepsi?.mapsLink,
      };

      const result = await pluginSaveAction(payload);
      onStatusChange?.(result.status as 0 | 1);

      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error auto-save:', err);
    } finally {
      setSaving(false);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug, onStatusChange]);

  const giftEnabled = useWatch({ control, name: 'plugin.gift' });
  const prevGiftEnabled = useRef(giftEnabled);
  
  useEffect(() => {
    // Only run when giftEnabled actually changes, not on initial mount
    if (prevGiftEnabled.current !== undefined && prevGiftEnabled.current !== giftEnabled && !giftEnabled) {
      setValue('plugin.youtube_link', '');
      // Debounce the auto save to prevent loops
      const timeoutId = setTimeout(() => {
        autoSave();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
    prevGiftEnabled.current = giftEnabled;
  }, [giftEnabled, setValue]);

  const whatsappNotifEnabled = useWatch({ control, name: 'plugin.whatsapp_notif' });
  useEffect(() => {
    if (whatsappNotifEnabled && !getValues('plugin.whatsapp_number')) {
      // You can set default or prompt user here
    }
  }, [whatsappNotifEnabled, getValues, setValue]);

  const handleToggle = useCallback(
    (name: string, value: boolean) => {
      setValue(name as any, value);
      autoSave();
    },
    [setValue, autoSave]
  );

  const handleLinkChange = useCallback((v: string) => {
    setValue('plugin.youtube_link', v);
  }, [setValue]);

  const handleWaNumberChange = useCallback(
    (v: string) => {
      let formatted = v.trim();
      if (/^0/.test(formatted)) {
        formatted = '62' + formatted.replace(/^0+/, '');
      }
      setValue('plugin.whatsapp_number', formatted);
    },
    [setValue]
  );

  const handleBlur = useCallback(() => autoSave(), [autoSave]);

  const pluginItems = [
    { name: 'plugin.rsvp', label: 'RSVP (Hadir/Tidak)', info: '/rsvp.jpg' },
    { name: 'plugin.navbar', label: 'Navigasi Bar', info: '/navigasi.jpg' },
    { name: 'plugin.gift', label: (<><span>Video</span> <Crown className="inline-block w-4 h-4 text-yellow-500 ml-1" /></>), info: '/video.jpg' },
    { name: 'plugin.whatsapp_notif', label: (<><span>Whatsapp Notif</span> <Crown className="inline-block w-4 h-4 text-yellow-500 ml-1" /></>), info: '/wanotif.jpg' },
    { name: 'plugin.qrcode', label: 'QR CODE', info: '/qrcode.jpg' },
  ];

  const openInfo = (img: string) => {
    setInfoImage(img);
    setInfoOpen(true);
  };

  return (
    <>
      {/* Pricing / info banner */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
        <div className="font-semibold text-yellow-900 mb-1">Informasi Biaya</div>
        <p className="mb-1">Intinya: bikin undangan GRATIS, tetapi ada watermark (WM) dan tidak permanen.</p>
        <p className="mb-1">Untuk menghapus watermark dan mengaktifkan undangan secara permanen, pelanggan wajib melakukan pembayaran minimal <strong>Rp 40.000</strong> (aktivasi).</p>
        <p className="mb-0">Tersedia juga paket <strong>Premium Rp 100.000</strong> — paket ini memberikan fitur tambahan dan ditandai dengan ikon <span className="inline-flex items-center"><Crown className="w-4 h-4 text-yellow-500 mr-1" />Premium</span>.</p>
      </div>
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <div className="flex justify-center p-4">
            <img src={infoImage} alt="Sample" className="max-h-64 object-contain" />
          </div>
        </DialogContent>
      </Dialog>

      <Collapsible title="Plugin Undangan">
        <div className="grid gap-4 py-4">
          {pluginItems.map(({ name, label, info }) => (
            <FormField key={name} control={control} name={name} render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-md border p-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center space-x-2">
                  <FormLabel className="text-base flex items-center space-x-1">{label}</FormLabel>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="cursor-pointer"
                    onClick={() => openInfo(info)}
                  >
                    <Info className="w-4 h-4 text-blue-500" />
                  </motion.div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={val => handleToggle(name, val)} disabled={saving} />
                </FormControl>
              </FormItem>
            )} />
          ))}

          {giftEnabled && (
            <FormField control={control} name="plugin.youtube_link" render={({ field }) => (
              <FormItem className="flex flex-col space-y-1">
                <FormLabel>Link YouTube</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan link YouTube..."
                    disabled={saving}
                    onChange={e => handleLinkChange(e.target.value)}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {whatsappNotifEnabled && (
            <FormField control={control} name="plugin.whatsapp_number" render={({ field }) => (
              <FormItem className="flex flex-col space-y-1">
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Masukkan nomor WhatsApp..."
                    disabled={saving}
                    onChange={e => handleWaNumberChange(e.target.value)}
                    onBlur={handleBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {error && <p className="text-red-600 mt-2">Error: {error}</p>}
        </div>
      </Collapsible>
    </>
  );
}
