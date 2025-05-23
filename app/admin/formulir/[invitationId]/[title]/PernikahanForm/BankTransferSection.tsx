// components/BankTransferSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
  const { control, getValues } = useFormContext<any>();
  
  // watch semua field bank transfer
  const enabled       = useWatch({ control, name: 'bank_transfer.enabled' });
  const accountName   = useWatch({ control, name: 'bank_transfer.account_name' });
  const accountNumber = useWatch({ control, name: 'bank_transfer.account_number' });
  const bankName      = useWatch({ control, name: 'bank_transfer.bank_name' });

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
  }, [enabled, accountName, accountNumber, bankName, getValues, invitationId, slug, onSavedSlug, userId]);

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
            <FormField name="bank_transfer.account_name" control={control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pemilik Rekening</FormLabel>
                <FormControl><Input {...field}/></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField name="bank_transfer.account_number" control={control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Rekening</FormLabel>
                <FormControl>
                  <Input {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField name="bank_transfer.bank_name" control={control} render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Bank</FormLabel>
                <FormControl><Input {...field}/></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </>
        )}
      </div>
    </Collapsible>
  );
}
