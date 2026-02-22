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
        <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--t4-border-glass, rgba(245, 158, 11, 0.2))', borderColor: 'var(--t4-border-glass, rgba(245, 158, 11, 0.3))' }}>
          <span className="text-xl" style={{ color: 'var(--t4-text-accent, #f59e0b)' }}>✨</span>
        </div>
        <ThemeHeader size="lg" className="text-amber-100" style={{ color: 'var(--t4-text-accent, #fef3c7)' }}>Turut Mengundang</ThemeHeader>
        <ThemeText variant="caption" color="gray">
          Keluarga Besar yang Berbahagia
        </ThemeText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50 hover:border-white/20 transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-serif font-bold shadow-lg" style={{ background: 'var(--t4-grad-button, linear-gradient(to bottom right, #d97706, #92400e))' }}>
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