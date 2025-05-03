// components/qoutes-nikah.tsx
'use client';

import React, { useEffect } from 'react';
import { Control, useController } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface QuotesNikahProps<T> {
  control: Control<T>;
  name: keyof T;
}

// Predefined quotes berdasarkan agama/formal
const quotesMap: Record<string, string> = {
  islam: `Dan diantara tanda-tanda kekuasaannya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikannya diantaramu rasa kasih dan sayang.

(Qs. Ar. Rum (30) : 21)`,
  kristen: `"Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan istrinya, sehingga keduanya menjadi satu daging."

(Kejadian 2:24)`,
  formal: `Dengan segala kerendahan hati dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk berbagi kebahagiaan dalam acara pernikahan kami. Semoga kehadiran Anda menjadi berkah dan kenangan indah bagi kami.`,
};

export default function QoutesNikah<T>({ control, name }: QuotesNikahProps<T>) {
  const { field, fieldState } = useController({ control, name });

  // Handle perubahan selection untuk memperbarui quote
  const handleSelect = (value: string) => {
    const selectedQuote = quotesMap[value] || '';
    field.onChange(selectedQuote);
  };

  // Jika value awal kosong, set default islam
  useEffect(() => {
    if (!field.value) {
      handleSelect('islam');
    }
  }, []);

  return (
    <FormItem>
      <FormLabel>Pilih Template Qoutes</FormLabel>
      <FormControl>
        <Select
          onValueChange={handleSelect}
          defaultValue="islam"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih agama/formal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="islam">Islam</SelectItem>
            <SelectItem value="kristen">Kristen</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <FormControl className="mt-4">
        <Textarea
          readOnly
          rows={6}
          value={field.value || ''}
        />
      </FormControl>
      {fieldState.error && (
        <FormMessage>{fieldState.error.message}</FormMessage>
      )}
    </FormItem>
  );
}
