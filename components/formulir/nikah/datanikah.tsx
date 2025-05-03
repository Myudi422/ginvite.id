// components/formulir/nikah/datanikah.tsx
'use client';

import React from 'react';
import { Control } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PernikahanDataProps<T> {
  control: Control<T>;
}

// Placeholder untuk komponen Upload Builder
const UploadBuilder = ({ onChange }: { onChange: (value: string) => void }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Di sini Anda akan mengintegrasikan logika upload file yang sebenarnya
      // Misalnya, menggunakan API untuk mengunggah file ke server atau cloud storage
      // Setelah upload berhasil, Anda akan mendapatkan URL file dan memanggil onChange
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string); // Mengirimkan URL data: atau URL server
      };
      reader.readAsDataURL(file); // Atau kirimkan URL dari server setelah upload
    }
  };

  return (
    <input type="file" accept="image/*" onChange={handleFileChange} />
  );
};

export default function DataNikah<T>({ control }: PernikahanDataProps<T>) {
  return (
    <>
      {/* Data Pengantin Pria */}
      <div>
        <h3 className="text-lg font-medium">Data Pengantin Pria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <FormField
            control={control}
            name="children.0.name" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap pengantin pria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="children.0.nickname" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Panggilan</FormLabel>
                <FormControl>
                  <Input placeholder="Nama panggilan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="children.0.profile" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto Profil</FormLabel>
                <FormControl>
                  <UploadBuilder onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Data Orang Tua Pengantin Pria */}
      <div>
        <h3 className="text-lg font-medium">Data Orang Tua Pengantin Pria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <FormField
            control={control}
            name="parents.groom.father" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ayah</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap ayah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="parents.groom.mother" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ibu</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap ibu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Data Pengantin Wanita */}
      <div>
        <h3 className="text-lg font-medium">Data Pengantin Wanita</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <FormField
            control={control}
            name="children.1.name" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap pengantin wanita" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="children.1.nickname" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Panggilan</FormLabel>
                <FormControl>
                  <Input placeholder="Nama panggilan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="children.1.profile" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto Profil</FormLabel>
                <FormControl>
                  <UploadBuilder onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Data Orang Tua Pengantin Wanita */}
      <div>
        <h3 className="text-lg font-medium">Data Orang Tua Pengantin Wanita</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <FormField
            control={control}
            name="parents.bride.father" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ayah</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap ayah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="parents.bride.mother" as any
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ibu</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap ibu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}