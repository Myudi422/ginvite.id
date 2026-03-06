// app/admin/music/MusicCard.tsx
'use client';

import React from 'react';
import { PlayIcon } from 'lucide-react';

interface Music {
  Nama_lagu: string;
  link_lagu: string;
  kategori: string;
}

interface MusicCardProps {
  music: Music;
}

export default function MusicCard({ music }: MusicCardProps) {
  return (
    <div
      className="bg-white rounded-3xl p-6 relative border border-pink-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full"
    >
      <div className="pr-12">
        <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2" title={music.Nama_lagu}>
          {music.Nama_lagu}
        </h3>
        <span className="inline-flex items-center px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-wider">
          {music.kategori}
        </span>
      </div>
      <button
        onClick={() => window.open(music.link_lagu, '_blank')}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-pink-50 text-pink-500 rounded-2xl hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500 hover:text-white transition-all shadow-sm group-hover:shadow-md hover:scale-105"
        title="Putar lagu"
      >
        <PlayIcon className="h-6 w-6 ml-1" />
      </button>
    </div>
  );
}