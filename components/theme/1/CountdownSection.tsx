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
  theme,
}: CountdownSectionProps) {
  return (
    <section
      id="countdown"
      className="py-12 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16" // Penyesuaian padding responsif
    >
      <div className="max-w-md mx-auto rounded-lg shadow-md bg-white p-8 text-center">
        <div className="flex items-center justify-center mb-4 text-xl">
          <span>🌸</span>
          <h3 className="mx-2 font-semibold">Menuju Hari Bahagia</h3>
          <span>🌸</span>
        </div>
        <div
          className="text-2xl font-bold mb-6"
          style={{ color: theme.accentColor }}
        >
          <CountdownTimer targetDate={eventDate} />
        </div>
        <Link href={calendarUrl} target="_blank" className="inline-block">
          <Button className="px-6 py-3 rounded-full font-medium shadow-sm" style={{ backgroundColor: theme.accentColor, color: '#fff' }}>
            <CalendarDays className="mr-2 h-4 w-4" /> Simpan di Kalender
          </Button>
        </Link>
      </div>
    </section>
  );
}