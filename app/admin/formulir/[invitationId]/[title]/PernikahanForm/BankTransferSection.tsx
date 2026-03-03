/// components/BankTransferSection.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch, useFieldArray, Controller } from 'react-hook-form';
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

  // watch semua akun bank (watch the whole accounts array so changes trigger autosave)
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
        const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
        if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save BankTransfer gagal:', (e as Error).message);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enabled, accounts, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Informasi Bank Transfer" defaultOpen={false}>
      {/* Toggle Header */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-xl mt-4 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Aktifkan Bank Transfer / Amplop Digital</h4>
          <p className="text-xs text-gray-400 mt-0.5">Berikan opsi bagi tamu untuk memberikan hadiah secara transfer</p>
        </div>
        <Controller
          name="bank_transfer.enabled"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-pink-500"
            />
          )}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 space-y-4 ${!enabled ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}>
        {fields.map((field, idx) => (
          <div key={field.id} className="relative p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Header Item */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
              <h5 className="text-sm font-semibold flex items-center gap-2 text-pink-700">
                <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs">🏦</span>
                Rekening {idx + 1}
              </h5>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  disabled={!enabled}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Hapus rekening ini"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name={`bank_transfer.accounts.${idx}.bank_name`} control={control} render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs text-gray-600 font-medium whitespace-nowrap">Nama Bank / E-Wallet</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Contoh: BCA / GoPay" className="bg-gray-50/50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-300" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField name={`bank_transfer.accounts.${idx}.account_number`} control={control} render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs text-gray-600 font-medium whitespace-nowrap">Nomor Rekening</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Contoh: 1234567890"
                        className="bg-gray-50/50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
                        onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>

              <FormField name={`bank_transfer.accounts.${idx}.account_name`} control={control} render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs text-gray-600 font-medium whitespace-nowrap">Nama Pemilik Rekening</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Romeo Montague" className="bg-gray-50/50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-300" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
          </div>
        ))}

        {fields.length < 2 && (
          <button
            type="button"
            onClick={() => append({ account_name: '', account_number: '', bank_name: '' })}
            disabled={!enabled}
            className="w-full border-dashed border-2 py-4 text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Tambah Rekening Lain
          </button>
        )}
      </div>
    </Collapsible>
  );
}
