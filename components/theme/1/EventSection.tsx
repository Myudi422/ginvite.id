import { MapPin, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Event {
  key: string;
  title?: string;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}

interface EventSectionProps {
  events?: Event[];
  sectionTitle?: string;
  theme: {
    accentColor: string;
    background: string;
  };
}

function EventCard({ event, accentColor }: { event: Event; accentColor: string }) {
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-soft">
      {children}
    </div>
  );

  const formatDateWithTime = (dateString: string, timeString: string): string => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('id-ID', options);
      return `${formattedDate} ${timeString}`;
    } catch (error) {
      console.error("Error formatting date and time:", error, dateString, timeString);
      return `${dateString} ${timeString}`;
    }
  };

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
        {formatDateWithTime(event.date, event.time)}
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

export default function EventSection({ events = [], sectionTitle, theme }: EventSectionProps) {
  if (!events.length) return null;

  const sortedList = [...events].sort((a, b) => {
    try {
      return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
    } catch {
      return 0;
    }
  });

  return (
    <section
      id="event"
      className="py-16 px-4 md:px-8"
      style={{
        backgroundImage: `url(${theme.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Main Title outside card */}
      <h2
        className="text-4xl font-cursive text-center mb-12"
        style={{ color: theme.accentColor }}
      >
        Save The Date
      </h2>

      <div className="max-w-xl mx-auto bg-[rgba(0,0,0,0.7)] rounded-3xl p-8">
        {/* Optional Subsection Title */}
        {sectionTitle && (
          <h2
            className="text-3xl font-cursive text-center mb-8"
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
