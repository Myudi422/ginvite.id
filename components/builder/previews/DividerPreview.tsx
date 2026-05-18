'use client';
import React from 'react';

interface P { props: Record<string, unknown>; style: Record<string, string | number>; }

export default function DividerPreview({ props, style }: P) {
  const divStyle = (props.style as string) || 'line';
  const bgType = (props.bg_type as string) || 'transparent';

  // Latar belakang container
  let containerStyle: React.CSSProperties = {
    backgroundColor: style.bg_color as string,
  };

  if (bgType === 'solid') {
    containerStyle.backgroundColor = (props.bg_solid_color as string) || '#ffffff';
  } else if (bgType === 'gradient') {
    const c1 = (props.bg_color as string) || style.accent_color as string || '#e879a0';
    const c2 = (props.bg_color2 as string) || '#9333ea';
    const angle = (props.bg_angle as number) ?? 135;
    containerStyle.background = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`;
  } else if (bgType === 'image') {
    if (props.bg_image) {
      containerStyle.backgroundImage = `url(${props.bg_image})`;
      containerStyle.backgroundSize = 'cover';
      containerStyle.backgroundPosition = 'center';
      containerStyle.backgroundColor = 'transparent';
    }
  }

  // Desain warna pemisah
  const colorType = (props.color_type as string) || 'solid';
  const colorSolid = (props.color as string) || style.accent_color as string || '#e879a0';

  let svgStroke = '';
  let svgDefs: React.ReactNode = null;

  if (colorType === 'solid') {
    svgStroke = colorSolid;
  } else if (colorType === 'gradient') {
    const cg1 = (props.color_grad_1 as string) || style.accent_color as string || '#e879a0';
    const cg2 = (props.color_grad_2 as string) || '#9333ea';
    const cangle = (props.color_grad_angle as number) ?? 90;
    
    // Convert angle to SVG gradient coordinates
    const angleRad = (cangle * Math.PI) / 180;
    const x1 = Math.round(50 - Math.cos(angleRad) * 50) + '%';
    const y1 = Math.round(50 + Math.sin(angleRad) * 50) + '%';
    const x2 = Math.round(50 + Math.cos(angleRad) * 50) + '%';
    const y2 = Math.round(50 - Math.sin(angleRad) * 50) + '%';

    svgStroke = 'url(#dividerGradient)';
    svgDefs = (
      <defs>
        <linearGradient id="dividerGradient" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0%" stopColor={cg1} />
          <stop offset="100%" stopColor={cg2} />
        </linearGradient>
      </defs>
    );
  } else if (colorType === 'image') {
    const cimg = (props.color_image as string) || '';
    svgStroke = 'url(#dividerPattern)';
    svgDefs = (
      <defs>
        <pattern id="dividerPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <image href={cimg} x="0" y="0" width="60" height="60" preserveAspectRatio="xMidYMid slice" />
        </pattern>
      </defs>
    );
  }

  // Animasi Pemisah
  const animType = (props.anim_type as string) || 'none';
  const animDuration = (props.anim_duration as number) ?? 2;
  const animDelay = (props.anim_delay as number) ?? 0;

  const animationStyle: React.CSSProperties = {};
  if (animType !== 'none') {
    animationStyle.animationName = `dividerAnim_${animType}`;
    animationStyle.animationDuration = `${animDuration}s`;
    animationStyle.animationDelay = `${animDelay}s`;
    animationStyle.animationTimingFunction = animType === 'bounce' ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease-in-out';
    animationStyle.animationIterationCount = (animType === 'pulse' || animType === 'wave-flow') ? 'infinite' : 1;
    animationStyle.animationFillMode = 'both';
  }

  // Menggunakan SVG penuh untuk semua gaya pemisah agar 100% responsif, 
  // tajam di layar HD, dan aman dari bug background-clip box.
  const renders: Record<string, React.ReactElement> = {
    line: (
      <svg viewBox="0 0 200 2" className="w-full h-[2px]" preserveAspectRatio="none" style={{ display: 'block', opacity: 0.8 }}>
        {svgDefs}
        <rect x="0" y="0" width="200" height="2" fill={svgStroke} />
      </svg>
    ),
    dots: (
      <svg viewBox="0 0 200 20" className="w-full h-4" style={{ display: 'block', opacity: 0.9 }}>
        {svgDefs}
        {/* 5 Dots simetris di tengah (x=100) */}
        <circle cx="76" cy="10" r="4" fill={svgStroke} />
        <circle cx="88" cy="10" r="4" fill={svgStroke} />
        <circle cx="100" cy="10" r="4" fill={svgStroke} />
        <circle cx="112" cy="10" r="4" fill={svgStroke} />
        <circle cx="124" cy="10" r="4" fill={svgStroke} />
      </svg>
    ),
    floral: (
      <svg viewBox="0 0 200 30" className="w-full h-8" style={{ display: 'block', opacity: 0.95 }}>
        {svgDefs}
        <text 
          x="50%" 
          y="50%" 
          textAnchor="middle" 
          dominantBaseline="central" 
          fill={svgStroke}
          fontSize="22"
          fontWeight="bold"
          style={{ fontFamily: 'sans-serif', userSelect: 'none' }}
        >
          ✿ ✦ ✿
        </text>
      </svg>
    ),
    wave: (
      <svg viewBox="0 0 200 20" className="w-full h-5" preserveAspectRatio="none" style={{ display: 'block' }}>
        {svgDefs}
        <path 
          d="M0,10 C50,0 100,20 200,10" 
          stroke={svgStroke} 
          strokeWidth="3.5" 
          fill="none" 
          strokeOpacity="0.9" 
        />
      </svg>
    ),
  };

  return (
    <div className="py-5 px-6 relative overflow-hidden flex items-center justify-center min-h-[50px]" style={containerStyle}>
      {animType !== 'none' && (
        <style>{`
          @keyframes dividerAnim_fade {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 0.95; transform: scale(1); }
          }
          @keyframes dividerAnim_pulse {
            0% { transform: scale(1); opacity: 0.85; }
            50% { transform: scale(1.06); opacity: 1; }
            100% { transform: scale(1); opacity: 0.85; }
          }
          @keyframes dividerAnim_slide {
            from { opacity: 0; transform: translateX(-40px); }
            to { opacity: 0.95; transform: translateX(0); }
          }
          @keyframes dividerAnim_bounce {
            0% { transform: translateY(25px); opacity: 0; }
            60% { transform: translateY(-8px); opacity: 0.95; }
            80% { transform: translateY(3px); }
            100% { transform: translateY(0); }
          }
          @keyframes dividerAnim_wave-flow {
            0% { transform: translateX(0); }
            50% { transform: translateX(-12px); }
            100% { transform: translateX(0); }
          }
        `}</style>
      )}
      <div className="relative z-10 w-full" style={animationStyle}>
        {renders[divStyle] || renders.line}
      </div>
    </div>
  );
}
