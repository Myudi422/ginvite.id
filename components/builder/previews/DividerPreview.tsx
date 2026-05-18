'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function DividerPreview({ props, style }: P) {
  const divStyle = (props.style as string) || 'line';
  const color = (props.color as string) || style.accent_color as string || '#e879a0';

  const renders: Record<string, React.ReactElement> = {
    line: <hr style={{ borderColor: color + '55', borderTopWidth: 1 }} />,
    dots: <div className="flex justify-center gap-2">{[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color + '66' }} />)}</div>,
    floral: <p className="text-center text-lg" style={{ color: color + '88' }}>✿ ✦ ✿</p>,
    wave: <svg viewBox="0 0 200 20" className="w-full h-4"><path d="M0,10 C50,0 100,20 200,10" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.5" /></svg>,
  };

  return (
    <div className="py-4 px-6" style={{ backgroundColor: style.bg_color as string }}>
      {renders[divStyle] || renders.line}
    </div>
  );
}
