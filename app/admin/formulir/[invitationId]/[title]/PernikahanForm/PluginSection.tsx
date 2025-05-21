import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';
import { Crown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PluginSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
  onStatusChange?: (newStatus: 0 | 1) => void;
}

// Endpoint untuk auto-save konten
const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

export function PluginSection({ userId, invitationId, slug, onSavedSlug, onStatusChange }: PluginSectionProps) {
  const { control, getValues, setValue } = useFormContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Watch the gift and whatsapp_notif toggles
  const giftEnabled = useWatch({ control, name: 'plugin.gift' });
  const whatsappNotifEnabled = useWatch({ control, name: 'plugin.whatsapp_notif' });

  const autoSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const data = getValues();
      const { gift, whatsapp_notif } = data.plugin;
      const jumlah = gift || whatsapp_notif ? 100000 : 40000;

      const contentPayload = {
        ...data,
        event: { ...data.event },
        jumlah,
      };
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

      const res = await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message || 'Auto-save gagal');

      // Gunakan status yang dikembalikan server
      const serverStatus = json.data.status as 0 | 1;
      if (onStatusChange) onStatusChange(serverStatus);

      // Refresh preview iframe
      const iframe = document.getElementById('previewFrame');
      if (iframe) {
        const param = `?time=${Date.now()}`;
        iframe.setAttribute('src', `/undang/${userId}/${encodeURIComponent(onSavedSlug)}${param}`);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error auto-save PluginSection:', err);
    } finally {
      setSaving(false);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug, onStatusChange]);

  // Efek untuk mereset youtube_link dan auto-save ketika gift dimatikan
  useEffect(() => {
    if (!giftEnabled) {
      setValue('plugin.youtube_link', '');
      autoSave(); // Panggil autoSave di sini
    }
  }, [giftEnabled, setValue, autoSave]);

  // Efek untuk memastikan whatsapp_number ada saat whatsapp_notif aktif
  useEffect(() => {
    if (whatsappNotifEnabled && !getValues('plugin.whatsapp_number')) {
      // Anda bisa set nilai default di sini jika diperlukan
      // setValue('plugin.whatsapp_number', '');
    }
  }, [whatsappNotifEnabled, setValue, getValues]);

  const handleToggle = useCallback((name: string, value: boolean) => {
    setValue(name as any, value);
    autoSave();
  }, [setValue, autoSave]);

  const handleLinkChange = useCallback((value: string) => {
    setValue('plugin.youtube_link', value);
  }, [setValue]);

  const handleWaNumberChange = useCallback((value: string) => {
    setValue('plugin.whatsapp_number', value);
  }, [setValue]);

  const handleInputChangeBlur = useCallback(() => {
    autoSave();
  }, [autoSave]);

  return (
    <Collapsible title="Plugin Undangan">
      <div className="grid gap-4 py-4">
        {[
          { name: 'plugin.rsvp', label: 'RSVP (Hadir/Tidak)' },
          { name: 'plugin.gift', label: <>Video <Crown className="inline-block w-4 h-4 text-yellow-500 ml-1" /></> },
          { name: 'plugin.whatsapp_notif', label: <>Whatsapp Notif <Crown className="inline-block w-4 h-4 text-yellow-500 ml-1" /></> },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4" onClick={e => e.stopPropagation()}>
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{label}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={val => handleToggle(name, val)} disabled={saving} />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

       {/* Render input for YouTube link when gift is enabled */}
        {giftEnabled && (
          <FormField
            control={control}
            name="plugin.youtube_link"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1">
                <FormLabel>Link YouTube</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''} // Ensure value is always provided
                    placeholder="Masukkan link YouTube video..."
                    disabled={saving}
                    onChange={e => handleLinkChange(e.target.value)}
                    onBlur={handleInputChangeBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Render input for WhatsApp number when whatsapp_notif is enabled */}
        {whatsappNotifEnabled && (
          <FormField
            control={control}
            name="plugin.whatsapp_number"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-1">
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    value={field.value || ''} // Ensure value is always provided
                    placeholder="Masukkan nomor WhatsApp..."
                    disabled={saving}
                    onChange={e => handleWaNumberChange(e.target.value)}
                    onBlur={handleInputChangeBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>
    </Collapsible>
  );
}