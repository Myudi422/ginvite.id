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
      className="bg-white/30 backdrop-blur-md rounded-2xl p-4 relative
                 border border-white/20 shadow-md hover:shadow-lg transition-all
                 hover:border-pink-200 group"
    >
      <h3 className="text-lg font-semibold text-pink-800 mb-2">
        {music.Nama_lagu}
      </h3>
      <div className="inline-block mb-4">
        <span className="px-2 py-1 bg-pink-500 text-white rounded-full text-sm">
          {music.kategori}
        </span>
      </div>
      <button
        onClick={() => window.open(music.link_lagu, '_blank')}
        className="absolute top-4 right-4 text-pink-500 hover:text-pink-600"
        title="Putar lagu"
      >
        <PlayIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
