'use client';

import React, { useRef } from 'react';

interface WheelProps {
  value: number; // 0 to 360
  onChange: (angle: number) => void;
}

export default function GradientAngleWheel({ value, onChange }: WheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpdateAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dy = clientY - centerY;
    const dx = clientX - centerX;
    const angleRad = Math.atan2(dy, dx);
    
    // CSS gradient angles: 
    // 0deg = to top
    // 90deg = to right
    // 180deg = to bottom
    // 270deg = to left
    // Math.atan2(dy, dx) returns angle clockwise starting from positive X-axis (right)
    // Positive X-axis is 90deg in CSS. Negative Y-axis (up) is 0deg.
    // So CSS Angle = Math Angle (in degrees) + 90
    let angleDeg = Math.round(angleRad * (180 / Math.PI) + 90);
    if (angleDeg < 0) angleDeg += 360;
    if (angleDeg >= 360) angleDeg -= 360;
    
    onChange(angleDeg);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleUpdateAngle(e.clientX, e.clientY);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleUpdateAngle(moveEvent.clientX, moveEvent.clientY);
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleUpdateAngle(e.touches[0].clientX, e.touches[0].clientY);
    }
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches[0]) {
        handleUpdateAngle(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
      }
    };
    
    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Convert angle back to standard layout direction
  const visualAngleRad = ((value - 90) * Math.PI) / 180;
  const radius = 24; // 24px radius inside 56px container (28px boundary)
  const indicatorX = Math.cos(visualAngleRad) * radius;
  const indicatorY = Math.sin(visualAngleRad) * radius;

  return (
    <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/80">
      {/* Visual Dial */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="w-14 h-14 rounded-full border border-gray-200 bg-white shadow-inner flex items-center justify-center cursor-pointer relative select-none hover:border-pink-300 transition-colors flex-shrink-0"
        title="Klik dan geser untuk memutar arah gradasi"
      >
        {/* Center dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 z-10" />
        
        {/* Pointer line */}
        <div 
          className="absolute h-[1.5px] bg-pink-400 origin-left"
          style={{
            width: `${radius}px`,
            transform: `rotate(${value - 90}deg)`,
            left: '28px', // center of 56px
            top: '27.25px', // center height
          }}
        />

        {/* Dial handle dot */}
        <div 
          className="absolute w-3.5 h-3.5 rounded-full bg-pink-500 border border-white shadow flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(${indicatorX}px, ${indicatorY}px)`,
          }}
        >
          <div className="w-1 h-1 rounded-full bg-white opacity-80" />
        </div>
        
        {/* Direction indicators */}
        <div className="absolute top-0.5 text-[7px] text-gray-400/80 font-extrabold select-none">U</div>
        <div className="absolute bottom-0.5 text-[7px] text-gray-400/80 font-extrabold select-none">S</div>
        <div className="absolute right-0.5 text-[7px] text-gray-400/80 font-extrabold select-none">T</div>
        <div className="absolute left-0.5 text-[7px] text-gray-400/80 font-extrabold select-none">B</div>
      </div>

      {/* Inputs & presets */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={360}
            value={value}
            onChange={(e) => {
              let v = parseInt(e.target.value);
              if (isNaN(v)) v = 0;
              v = Math.max(0, Math.min(360, v));
              onChange(v);
            }}
            className="w-14 px-1.5 py-1 border border-gray-200 rounded-lg text-xs font-bold text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          <span className="text-xs text-gray-500 font-semibold select-none">derajat (°)</span>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-1">
          {[
            { label: '⬇️ Bawah', angle: 180 },
            { label: '➡️ Kanan', angle: 90 },
            { label: '↘️ Diagonal', angle: 135 },
            { label: '⬆️ Atas', angle: 0 },
          ].map((preset) => (
            <button
              key={preset.angle}
              type="button"
              onClick={() => onChange(preset.angle)}
              className={`px-2 py-0.5 rounded-md text-[9px] font-bold border transition-all ${
                value === preset.angle
                  ? 'bg-pink-500 border-pink-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
