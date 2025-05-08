import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';

// Endpoint untuk auto-save konten
const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

export function PluginSection({ userId, invitationId, slug, onSavedSlug }) {
  const { control, getValues, setValue } = useFormContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const autoSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const data = getValues();
      // Hitung jumlah berdasarkan plugin
      const { gift, whatsapp_notif } = data.plugin;
      const jumlah = gift || whatsapp_notif ? 100000 : 40000;

      const contentPayload = {
        ...data,
        event: { ...data.event, title: slug },
        jumlah,
      };
      const payload = {
        user_id: userId,
        id: invitationId,
        title: slug,
        content: JSON.stringify(contentPayload),
        waktu_acara: data.event.date,
        time: data.event.time,
        location: data.event.location,
        mapsLink: data.event.mapsLink,
      };

      const res = await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Auto-save gagal');
      }
      // Refresh preview iframe
      const iframe = document.getElementById('previewFrame');
      if (iframe) {
        iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
      }
    } catch (err) {
      setError(err.message);
      console.error('Error auto-save PluginSection:', err);
    } finally {
      setSaving(false);
    }
  }, [getValues, userId, invitationId, slug, onSavedSlug]);

  // handler to update field and auto-save
  const handleToggle = useCallback((name, value) => {
    setValue(name, value);
    autoSave();
  }, [setValue, autoSave]);

  return (
    <Collapsible title="Plugin Undangan">
      <div className="grid gap-4 py-4">
        {[
          { name: 'plugin.rsvp', label: 'RSVP (Hadir/Tidak)' },
          { name: 'plugin.gift', label: 'Gift' },
          { name: 'plugin.whatsapp_notif', label: 'Whatsapp Notif' },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{label}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(val) => handleToggle(name, val)}
                    disabled={saving}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>
    </Collapsible>
  );
}
