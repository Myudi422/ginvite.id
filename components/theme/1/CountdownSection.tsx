// components/theme/1/CountdownSection.tsx
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/countdown-timer';

interface CountdownSectionProps {
  eventDate: Date;
  calendarUrl: string;
  theme: {
    accentColor: string;
  };
}

export default function CountdownSection({
  eventDate,
  calendarUrl,
  theme: { accentColor },
}: CountdownSectionProps) {
  return (
    <section
      id="countdown"
      className="py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-to-b from-white/80 to-white/90"
    >
      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-lg font-medium text-gray-700">
          <span>🌸</span>
          <span>Menuju Hari Bahagia</span>
          <span>🌸</span>
        </div>

        <CountdownTimer
          targetDate={eventDate}
          containerClassName="flex justify-center gap-3 mb-6"
          numberClassName="w-14 h-14 rounded-lg shadow flex items-center justify-center text-xl font-bold"
          labelClassName="text-xs mt-1 text-gray-500"
          accentColor={accentColor}
        />

        <Link href={calendarUrl} target="_blank" className="inline-block">
          <Button
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-full font-medium shadow-sm"
            style={{ backgroundColor: accentColor, color: '#fff' }}
          >
            <CalendarDays size={16} /> Simpan di Kalender
          </Button>
        </Link>
      </div>
    </section>
  );
}
