// components/QoutesSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Collapsible } from './Collapsible';
import {
  Select, SelectTrigger, SelectContent, SelectValue, SelectItem,
} from '@/components/ui/select';
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { autoSaveContent } from '@/app/actions/saved';
import { getQuotes } from '@/app/actions/quotes';
import { FormValues } from './schema';

interface QoutesSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

interface QuoteGroup {
  category: string;
  quotes: string[];
}

export function QoutesSection({
  userId, invitationId, slug, onSavedSlug,
}: QoutesSectionProps) {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  // watch state
  const enabled = useWatch({ control, name: 'quote_enabled' });
  const category = useWatch({ control, name: 'quoteCategory' });
  const quote    = useWatch({ control, name: 'quote' });

  const [opts, setOpts] = useState<QuoteGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string|null>(null);

  // load quotes once
  useEffect(() => {
    getQuotes('khitanan')
      .then(data => setOpts(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Set default quote/category when enabled and none is selected
  useEffect(() => {
    if (enabled && opts.length > 0 && (!category || !quote)) {
      const firstCat = opts[0];
      if (firstCat) {
        setValue('quoteCategory', firstCat.category);
        if (firstCat.quotes && firstCat.quotes.length > 0) {
          setValue('quote', firstCat.quotes[0]);
        }
      }
    }
    // Do not clear quote/category when disabled
    // eslint-disable-next-line
  }, [enabled, opts, category, quote, setValue]);

  // auto‐save on any change
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
        const fr = document.getElementById('previewFrame') as HTMLIFrameElement|null;
        if (fr) fr.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}?time=${Date.now()}`;
      } catch (e) {
        console.error('Auto-save Quotes gagal:', (e as Error).message);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [enabled, category, quote, getValues, invitationId, slug, onSavedSlug, userId]);

  return (
    <Collapsible title="Kutipan">
      <div className="pt-4 grid gap-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="quote_enabled"
            control={control}
            defaultValue={false}
            render={({ field: { value, onChange, ...field } }) => (
              <Switch
                checked={value || false}
                onCheckedChange={onChange}
                {...field}
              />
            )}
          />
          <span className="text-sm font-medium">
            {enabled ? 'Kutipan Aktif' : 'Kutipan Nonaktif'}
          </span>
        </div>

        <FormField
          control={control}
          name="quoteCategory"
          render={({ field }) => (
            <FormItem className={!enabled ? 'opacity-50' : ''}>
              <FormLabel>Kategori Kutipan</FormLabel>
              <FormControl>
                <Select
                  disabled={!enabled}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto w-full">
                    {opts.map(o => (
                      <SelectItem key={o.category} value={o.category}>
                        {o.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {enabled && category && (
          <FormField
            control={control}
            name="quote"
            render={() => (
              <FormItem>
                <FormLabel>Pilih Kutipan</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opts.find(o => o.category===category)?.quotes.map((q, i) => {
                      const active = q === quote;
                      return (
                        <Card
                          key={i}
                          className={`${active?'border-blue-500 shadow-lg':''} cursor-pointer`}
                          onClick={() => setValue('quote', q)}
                        >
                          <CardContent className="line-clamp-5 break-words">
                            {q}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {loading && <p>Memuat…</p>}
        {error   && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Collapsible>
  );
}