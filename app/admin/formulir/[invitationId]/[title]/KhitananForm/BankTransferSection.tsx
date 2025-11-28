/// components/BankTransferSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Collapsible } from './Collapsible';
import { autoSaveContent } from '@/app/actions/saved';

interface BankTransferSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function BankTransferSection({
  userId, invitationId, slug, onSavedSlug,
}: BankTransferSectionProps) {
  const { control, getValues, register, watch } = useFormContext<any>();
  const enabled = watch('bank_transfer.enabled');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bank_transfer.accounts',
  });

  // watch semua akun bank agar perubahan pada array accounts memicu autosave
  const accounts = useWatch({ control, name: 'bank_transfer.accounts', defaultValue: [] });

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const data = getValues();
        const payload = {
          user_id: userId,
          id: invitationId,
          title: slug,
          content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
          waktu_acara: data.event.date,
          time: data.event.time,
          location: data.event.location,
          mapsLink: data.event.mapsLink,
        };
        await autoSaveContent(payload);
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement|null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save BankTransfer gagal:', (e as Error).message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enabled, accounts, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Informasi Bank Transfer">
      <div className="grid gap-4 py-4">
        <FormField
          control={control}
          name="bank_transfer.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 border rounded">
              <div>
                <FormLabel>Aktifkan Bank Transfer</FormLabel>
                <FormMessage/>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
            </FormItem>
          )}
        />
        {enabled && (
          <>
            {fields.map((field, idx) => (
              <div key={field.id} className="p-4 border rounded mb-4">
                <FormField name={`bank_transfer.accounts.${idx}.account_name`} control={control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pemilik Rekening</FormLabel>
                    <FormControl><Input {...field}/></FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField name={`bank_transfer.accounts.${idx}.account_number`} control={control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Rekening</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField name={`bank_transfer.accounts.${idx}.bank_name`} control={control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Bank</FormLabel>
                    <FormControl><Input {...field}/></FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} className="text-red-500">
                    Hapus Rekening
                  </button>
                )}
              </div>
            ))}
            {fields.length < 2 && (
              <button
                type="button"
                onClick={() => append({ account_name: '', account_number: '', bank_name: '' })}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Tambah Rekening
              </button>
            )}
          </>
        )}
      </div>
    </Collapsible>
  );
}
