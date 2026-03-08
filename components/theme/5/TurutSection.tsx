import React from 'react';
import { ThemeSection, ThemeHeader, ThemeText } from './ThemeComponents';

interface TurutSectionProps {
  enabled?: boolean;
  list?: { name: string }[];
}

export default function TurutSection({ enabled, list }: TurutSectionProps) {
  if (!enabled || !list || list.length === 0) return null;

  return (
    <ThemeSection className="bg-white mx-4 rounded-3xl p-6 border border-black/5 shadow-xl mt-12 mb-12">
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        <div className="w-12 h-12 rounded-full border border-[var(--t5-border-glass)] flex items-center justify-center mb-2 bg-[var(--t5-bg-main)]">
          <span className="text-xl">🤍</span>
        </div>
        <ThemeHeader size="lg" className="text-[var(--t5-text-primary)] font-bold">Turut Mengundang</ThemeHeader>
        <ThemeText variant="caption" color="gray">
          Keluarga Besar yang Berbahagia
        </ThemeText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-black/5 hover:border-black/10 transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm bg-[var(--t5-text-primary)]">
              {item.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1">
              <ThemeText variant="body" color="black" className="font-medium tracking-wide">
                {item.name}
              </ThemeText>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-black/10">
        <ThemeText variant="meta" color="gray" className="text-center italic text-sm">
          Dan segenap keluarga besar lainnya
        </ThemeText>
      </div>
    </ThemeSection>
  );
}