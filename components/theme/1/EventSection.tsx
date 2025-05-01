// components/theme/1/EventSection.tsx
import { MapPin, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EventSectionProps {
  content: {
    event: {
      title: string;
      date: string;
      time: string;
      note?: string;
      location: string;
      mapsLink: string;
    };
  };
  theme: {
    accentColor: string;
    defaultBgImage: string;
  };
}

export default function EventSection({ content, theme }: EventSectionProps) {
  const { title, date, time, note, location, mapsLink } = content.event;

  return (
    <section
      id="event"
      className="home-section"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.95), rgba(255,245,240,0.97)), url(${theme.defaultBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div className="home-inner">
        <h2
          className="text-4xl md:text-5xl font-cursive mb-4"
          style={{ color: theme.accentColor }}
        >
          {title}
        </h2>

        {/* Date & Time Card */}
        <div className="relative p-6 bg-white rounded-lg shadow-soft mb-8">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full">
            <CalendarDays style={{ color: theme.accentColor }} size={36} />
          </div>
          <div className="pt-6">
            <h3 className="text-xl font-serif text-gray-700">Waktu &amp; Tanggal</h3>
            <p className="text-2xl font-bold" style={{ color: theme.accentColor }}>
              {date}
            </p>
            <p className="text-lg text-gray-600">
              Pukul {time} {note && <span style={{ color: theme.accentColor }}>({note})</span>}
            </p>
          </div>
        </div>

        {/* Location Card */}
        <div className="relative p-6 bg-white rounded-lg shadow-soft">
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full">
            <MapPin style={{ color: theme.accentColor }} size={36} />
          </div>
          <div className="pt-6">
            <h3 className="text-xl font-serif text-gray-700">Lokasi Acara</h3>
            <p className="text-gray-600 leading-relaxed">{location}</p>
            <div className="mt-4">
              <Link href={mapsLink} target="_blank">
                <Button style={{ backgroundColor: theme.accentColor, color: '#fff' }}>
                  Petunjuk Lokasi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
);
}
