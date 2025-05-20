'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Collapsible } from './Collapsible';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { FormValues } from './schema';

interface QuoteGroup {
  category: string;
  quotes: string[];
}

export function QoutesSection() {
  const { control, watch, setValue } = useFormContext<FormValues>();
  const enabled = watch('quote_enabled', false);
  const selectedCategory = watch('quoteCategory');
  const selectedQuote = watch('quote');

  const [quoteOptions, setQuoteOptions] = useState<QuoteGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qoute')
      .then(res => res.json())
      .then(body => {
        if (body.status !== 'success') {
          throw new Error(body.message || 'Gagal memuat kutipan');
        }
        setQuoteOptions(body.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Collapsible title="Kutipan">
      <div className="pt-4 grid gap-4">
        {/* Toggle enable/disable */}
        <div className="flex items-center space-x-2">
          <Controller
            name="quote_enabled"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v)}
              />
            )}
          />
          <span className="text-sm font-medium">
            {enabled ? 'Kutipan Aktif' : 'Kutipan Nonaktif'}
          </span>
        </div>

        {/* Category Selector */}
        <FormField
          control={control}
          name="quoteCategory"
          render={({ field }) => (
            <FormItem className={!enabled ? 'opacity-50' : ''}>
              <FormLabel>Kategori Kutipan</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  disabled={!enabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto w-full">
                    {quoteOptions.map(opt => (
                      <SelectItem key={opt.category} value={opt.category}>
                        {opt.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quote Cards */}
        {enabled && selectedCategory && (
          <FormField
            control={control}
            name="quote"
            render={() => (
              <FormItem>
                <FormLabel>Pilih Kutipan</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quoteOptions
                      .find(o => o.category === selectedCategory)
                      ?.quotes.map((q, idx) => {
                        const isActive = q === selectedQuote;
                        return (
                          <Card
                            key={idx}
                            className={`${isActive ? 'border-blue-500 shadow-lg' : ''} cursor-pointer hover:shadow-md transition`}
                            onClick={() => setValue('quote', q)}
                          >
                            <CardContent className="whitespace-normal break-words text-left line-clamp-5">
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

        {/* Loading & Error */}
        {loading && <p>Memuat...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Collapsible>
  );
}
