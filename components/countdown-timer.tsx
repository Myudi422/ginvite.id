// components/countdown-timer.tsx
'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  /** 
   * Saya set default container ke grid 3 kolom 
   * supaya selalu muat, tidak overflow. 
   **/
  containerClassName?: string; 
  numberClassName?: string;
  labelClassName?: string;
  accentColor?: string;
}

export default function CountdownTimer({
  targetDate,
  containerClassName = 'grid grid-cols-3 gap-4',
  numberClassName = 'w-full h-12 rounded-lg shadow flex items-center justify-center text-xl font-bold',
  labelClassName = 'text-xs mt-1 text-gray-500',
  accentColor,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    const update = () => {
      const delta = targetDate.getTime() - Date.now();
      if (delta > 0) {
        setTimeLeft({
          days: Math.floor(delta / 86400000),
          hours: Math.floor((delta % 86400000) / 3600000),
          minutes: Math.floor((delta % 3600000) / 60000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        clearInterval(timerId);
      }
    };
    update();
    timerId = setInterval(update, 1000);
    return () => clearInterval(timerId);
  }, [targetDate]);

  const labels = { days: 'Hari', hours: 'Jam', minutes: 'Menit' } as const;

  return (
    <div className={containerClassName}>
      {(['days', 'hours', 'minutes'] as const).map((unit) => (
        <div key={unit} className="flex flex-col items-center">
          <div
            className={numberClassName}
            style={accentColor ? { color: accentColor } : undefined}
          >
            {String(timeLeft[unit]).padStart(2, '0')}
          </div>
          <span className={labelClassName}>{labels[unit]}</span>
        </div>
      ))}
    </div>
  );
}
