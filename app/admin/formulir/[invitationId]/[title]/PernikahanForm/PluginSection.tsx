import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Crown, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug, onStatusChange]);

  const giftEnabled = useWatch({ control, name: 'plugin.gift' });
  const prevGiftEnabled = useRef(giftEnabled);
  useEffect(() => {
    if (prevGiftEnabled.current !== undefined && prevGiftEnabled.current !== giftEnabled && !giftEnabled) {
      setValue('plugin.youtube_link', '');
      const t = setTimeout(() => autoSave(), 500);
      return () => clearTimeout(t);
    }
    prevGiftEnabled.current = giftEnabled;
  }, [giftEnabled, setValue, autoSave]);

  const whatsappNotifEnabled = useWatch({ control, name: 'plugin.whatsapp_notif' });

  const handleToggle = useCallback((name: string, value: boolean) => {
    setValue(name as any, value);
    autoSave();
  }, [setValue, autoSave]);

  const handleLinkChange = useCallback((v: string) => setValue('plugin.youtube_link', v), [setValue]);

  const handleWaNumberChange = useCallback((v: string) => {
    let formatted = v.trim();
    if (/^0/.test(formatted)) formatted = '62' + formatted.replace(/^0+/, '');
    setValue('plugin.whatsapp_number', formatted);
  }, [setValue]);

  const handleBlur = useCallback(() => autoSave(), [autoSave]);

  const openInfo = (img: string) => { setInfoImage(img); setInfoOpen(true); };

  const pluginItems = [
    { name: 'plugin.rsvp', label: 'RSVP Tamu', desc: 'Tamu bisa konfirmasi kehadiran langsung dari undangan', icon: '✅', info: '/rsvp.jpg', premium: false },
    { name: 'plugin.navbar', label: 'Navigasi Bar', desc: 'Tampilkan tombol navigasi di undangan', icon: '🧭', info: '/navigasi.jpg', premium: false },
    { name: 'plugin.gift', label: 'Video', desc: 'Tampilkan video YouTube di halaman undangan', icon: '🎬', info: '/video.jpg', premium: true },
    { name: 'plugin.whatsapp_notif', label: 'Notifikasi WhatsApp', desc: 'Terima notifikasi WA saat tamu konfirmasi hadir', icon: '📱', info: '/wanotif.jpg', premium: true },
    { name: 'plugin.qrcode', label: 'QR Code', desc: 'Aktifkan fitur scan QR di acara', icon: '📷', info: '/qrcode.jpg', premium: false },
  ];

  return (
    <>
      {/* Pricing banner */}
      <div className="mb-4 rounded-xl overflow-hidden border border-amber-200">
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">💡 Informasi Biaya</p>
        </div>
        <div className="px-4 py-3 space-y-1.5 text-xs text-amber-800 bg-white">
          <div className="flex items-start gap-2"><span>🆓</span><p><strong>Gratis</strong> — ada watermark, tidak permanen</p></div>
          <div className="flex items-start gap-2"><span>⚡</span><p><strong>Rp 40.000</strong> — hapus watermark & aktifkan permanen</p></div>
          <div className="flex items-start gap-2"><span>👑</span><p><strong>Rp 100.000</strong> — semua fitur Premium (Video + WA Notif)</p></div>
        </div>
      </div>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <div className="flex justify-center p-4">
            <img src={infoImage} alt="Sample" className="max-h-64 object-contain" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Plugin cards */}
      <div className="space-y-2">
        {pluginItems.map(({ name, label, desc, icon, info, premium }) => (
          <FormField key={name} control={control} name={name} render={({ field }) => (
            <FormItem
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-white transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-xl w-8 text-center flex-shrink-0">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                  {premium && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5" /> Premium
                    </span>
                  )}
                  <button type="button" onClick={() => openInfo(info)} className="text-blue-400 hover:text-blue-600 transition-colors">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={val => handleToggle(name, val)} disabled={saving} className="flex-shrink-0" />
              </FormControl>
            </FormItem>
          )} />
        ))}
      </div>

      {/* Conditional extra inputs */}
      {giftEnabled && (
        <FormField control={control} name="plugin.youtube_link" render={({ field }) => (
          <FormItem className="mt-3">
            <FormLabel className="text-xs text-gray-500">🎬 Link YouTube</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://youtube.com/watch?v=..." disabled={saving} className="text-sm"
                onChange={e => handleLinkChange(e.target.value)} onBlur={handleBlur} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      )}

      {whatsappNotifEnabled && (
        <FormField control={control} name="plugin.whatsapp_number" render={({ field }) => (
          <FormItem className="mt-3">
            <FormLabel className="text-xs text-gray-500">📱 Nomor WhatsApp</FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="628xxxxxxxxxx" disabled={saving} className="text-sm"
                onChange={e => handleWaNumberChange(e.target.value)} onBlur={handleBlur} />
            </FormControl>
            <p className="text-xs text-gray-400 mt-1">💡 Awali dengan 62, contoh: 628123456789</p>
            <FormMessage />
          </FormItem>
        )} />
      )}

      {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 mt-2">⚠️ {error}</div>}
    </>
  );
}
