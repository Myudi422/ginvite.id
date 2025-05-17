'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';

export function BankTransferSection() {
  const { control, watch } = useFormContext();
  const isBankTransferEnabled = watch('bank_transfer.enabled');

  return (
    <Collapsible title="Informasi Bank Transfer">
      <div className="grid gap-4 py-4">
        <FormField
          control={control}
          name="bank_transfer.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktifkan Bank Transfer</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        {isBankTransferEnabled && (
          <>
            <FormField
              control={control}
              name="bank_transfer.account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemilik Rekening</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="bank_transfer.account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rekening</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="bank_transfer.bank_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bank</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </Collapsible>
  );
}