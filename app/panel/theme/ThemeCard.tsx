// app/admin/theme/ThemeCard.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Theme {
  id: number;
  name: string;
  text_color: string;
  accent_color: string;
  background: string;
  image_theme: string;
  kategory_theme_id: number;
  kategory_theme_name?: string;
}

interface ThemeCardProps {
  theme: Theme;
  onDelete: (id: number) => void;
}

export default function ThemeCard({ theme, onDelete }: ThemeCardProps) {
  const handleDelete = () => {
    if (confirm(`Hapus theme "${theme.name}"?`)) {
      onDelete(theme.id);
    }
  };

  return (
    <Card className="bg-white/80 shadow-sm rounded-2xl overflow-hidden border border-pink-200">
      <CardHeader className="p-0">
        {/* Tampilkan background sebagai background card */}
        <div
          className="h-48 bg-center bg-cover"
          style={{ backgroundImage: `url(${theme.background})` }}
        />
      </CardHeader>
      <CardContent className="px-4 py-3">
        <CardTitle className="text-lg font-semibold text-pink-800 mb-2">
          {theme.name}
        </CardTitle>
        {/* Tampilkan kategori */}
        <div className="mb-2">
          <span className="inline-block bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full">
            {theme.kategory_theme_name || `Kategori ${theme.kategory_theme_id}`}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-3">
          {/* Kotak kecil untuk contoh warna text dan accent */}
          <div className="flex items-center gap-1">
            <span
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.text_color }}
            />
            <span className="text-sm text-gray-600">Text</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.accent_color }}
            />
            <span className="text-sm text-gray-600">Accent</span>
          </div>
        </div>
        {/* Tombol untuk edit atau hapus */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-pink-400 text-pink-600 hover:bg-pink-50"
            onClick={() => alert('Fungsi edit belum diimplementasi')}
          >
            Edit
          </Button>
          <Button size="sm" variant="destructive" className="flex-1" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
