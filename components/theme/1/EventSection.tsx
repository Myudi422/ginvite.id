// EventSection.tsx
import { MapPin, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Event {
  key: string;
  title?: string;        // title kini optional, fallback bisa nama key
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}

interface EventSectionProps {
  /**
   * Array sesi acara dinamis dari API atau form
   */
  events?: Event[];

  // Judul section (opsional)
  sectionTitle?: string;

  theme: {
    accentColor: string;
    defaultBgImage: string;
  };
}

function EventCard({ event, accentColor }: { event: Event; accentColor: string }) {
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-soft">
      {children}
    </div>
  );

  return (
    <div className="relative bg-white rounded-2xl shadow-soft p-6 mb-8 last:mb-0">
      <IconWrapper>
        <CalendarDays size={32} color={accentColor} />
      </IconWrapper>

      {event.title && (
        <h3 className="mt-6 text-center font-serif text-xl text-gray-800">
          {event.title}
        </h3>
      )}
      <p className="text-center text-2xl font-bold" style={{ color: accentColor }}>
        {event.date}
      </p>
      <p className="text-center text-gray-600">
        {event.time}{' '}
      </p>

      <div className="mt-4 text-center">
        <IconWrapper>
          <MapPin size={32} color={accentColor} />
        </IconWrapper>
        <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
          {event.location}
        </p>
        <Link href={event.mapsLink} target="_blank">
          <Button
            className="mt-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: accentColor, color: '#fff' }}
          >
            Petunjuk Lokasi
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function EventSection(props: EventSectionProps) {
  const { events, sectionTitle, theme } = props;
  const list: Event[] = events ?? [];

  if (!list.length) return null;

  const sortedList = [...list].sort((a, b) => {
    try {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.error("Error parsing date:", error, a, b);
      return 0;
    }
  });

  return (
    <section
      id="event"
      className="py-16 px-4 md:px-8"
      style={{
        backgroundImage: `url(${theme.defaultBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-xl mx-auto bg-[rgba(0,0,0,0.7)] rounded-3xl p-8">
        {sectionTitle && (
          <h2
            className="text-4xl font-cursive text-center mb-8"
            style={{ color: theme.accentColor }}
          >
            {sectionTitle}
          </h2>
        )}

        {sortedList.map((ev) => (
          <EventCard
            key={ev.key}
            event={ev}
            accentColor={theme.accentColor}
          />
        ))}
      </div>
    </section>
  );
}