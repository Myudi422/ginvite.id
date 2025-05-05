'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';
import type { FormValues } from './schema';

// Daftar font yang sudah di-import di styles/font.css
// Tambahkan properti family untuk styling preview di dropdown
const FONT_OPTIONS: { label: string; css: string; family: string }[] = [
  { label: 'Montserrat', css: "font-family: 'Montserrat', sans-serif;", family: "'Montserrat', sans-serif" },
  { label: 'Great Vibes', css: "font-family: 'Great Vibes', cursive;", family: "'Great Vibes', cursive" },
  { label: 'Handyrush', css: "font-family: 'Handyrush', cursive;", family: "'Handyrush', cursive" },
  { label: 'Balmy 2', css: "font-family: 'Balmy 2', serif;", family: "'Balmy 2', serif" },
  { label: 'Gloock', css: "font-family: 'Gloock', serif;", family: "'Gloock', serif" },
  { label: 'Faustina', css: "font-family: 'Faustina', serif;", family: "'Faustina', serif" },
];

export function FontSection() {
  const { control } = useFormContext<FormValues>();

  return (
    <Collapsible title="Font">
      {(['body', 'heading', 'special'] as const).map((fieldKey) => (
        <FormField
          key={fieldKey}
          control={control}
          name={`font.${fieldKey}` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{fieldKey}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih font..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.label}
                        value={opt.css}
                        style={{ fontFamily: opt.family }}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </Collapsible>
  );
}
