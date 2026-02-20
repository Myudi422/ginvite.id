import React from 'react';
import { ThemeSection, ThemeHeader, ThemeText } from './ThemeComponents';

interface TurutSectionProps {
  enabled?: boolean;
  list?: { name: string }[];
}

export default function TurutSection({ enabled, list }: TurutSectionProps) {
  if (!enabled || !list || list.length === 0) return null;

  return (
    <ThemeSection className="bg-zinc-900/50 backdrop-blur-sm mx-4 rounded-xl border border-zinc-800">
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-900/20 border border-amber-500/30 flex items-center justify-center mb-2">
          <span className="text-amber-500 text-xl">✨</span>
        </div>
        <ThemeHeader size="lg" className="text-amber-100">Turut Mengundang</ThemeHeader>
        <ThemeText variant="caption" color="gray">
          Keluarga Besar yang Berbahagia
        </ThemeText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50 hover:border-amber-900/50 transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-xs font-serif font-bold shadow-lg">
              {item.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1">
              <ThemeText variant="body" color="white" className="font-medium tracking-wide">
                {item.name}
              </ThemeText>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-zinc-800/50">
        <ThemeText variant="meta" color="gray" className="text-center italic opacity-60">
          Dan segenap keluarga besar lainnya
        </ThemeText>
      </div>
    </ThemeSection>
  );
}