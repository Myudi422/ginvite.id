import React from 'react';

interface TurutSectionProps {
  enabled?: boolean;
  list: { name: string }[];
  accentColor: string;
}

export default function TurutSection({ enabled, list, accentColor }: TurutSectionProps) {
  if (!enabled || !list || list.length === 0) return null;

  return (
    <section
      className="py-6 px-4 flex flex-col items-center gap-2"
      style={{ background: 'white' }}
    >
      <div className="text-lg font-semibold mb-2" style={{ color: accentColor }}>
        Turut Mengundang
      </div>
      <div className="flex flex-col gap-1 w-full max-w-xs mx-auto">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="text-sm text-gray-700 text-center flex items-start gap-2"
            style={{ fontWeight: 500 }}
          >
            <span
              className="inline-block mt-1"
              style={{
                width: 7,
                height: 7,
                backgroundColor: accentColor,
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 8,
                flexShrink: 0,
              }}
            />
            <span className="flex-1 text-left">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
