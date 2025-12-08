import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Event {
  key: string;
  title?: string;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}

interface EventSectionProps {
  events: Event[];
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
  sectionTitle?: string;
  specialFontFamily?: string;
}

export default function EventSection({
  events,
  theme,
  sectionTitle,
  specialFontFamily,
}: EventSectionProps) {
  
  if (!events || events.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <section 
      id="event"
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-block mb-6 sm:mb-8">
            <span 
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase border-2"
              style={{ 
                backgroundColor: theme.accentColor + '15', 
                color: theme.accentColor,
                borderColor: theme.accentColor + '60'
              }}
            >
              Acara
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
            style={{ 
              fontFamily: specialFontFamily || 'serif',
              color: theme.textColor,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.01em'
            }}
          >
            {sectionTitle || 'Detail Acara'}
          </h2>
        </motion.div>

        {/* Events Split Layout - Netflix Style */}
        <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-stretch gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={event.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group w-full lg:flex-1 lg:max-w-md xl:max-w-lg"
            >
              <div 
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-md border-2 hover:scale-[1.02] transition-all duration-500 h-full flex flex-col shadow-2xl"
                style={{ 
                  backgroundColor: theme.cardColor + 'CC',
                  borderColor: theme.accentColor + '40',
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                }}
              >
                {/* Event Title */}
                <div className="mb-6 sm:mb-8">
                  <h3 
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300"
                    style={{ 
                      color: theme.textColor,
                      fontFamily: specialFontFamily || 'serif',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {event.title}
                  </h3>
                  <div 
                    className="w-16 sm:w-20 md:w-24 h-1 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>

                {/* Event Details */}
                <div className="flex-grow space-y-5 sm:space-y-6 mb-6 sm:mb-8">
                  {/* Date */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div 
                      className="p-3 sm:p-4 rounded-xl flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: theme.accentColor + '20' }}
                    >
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-70 mb-1" style={{ color: theme.textColor }}>
                        Tanggal
                      </h4>
                      <p 
                        className="text-sm sm:text-base font-bold"
                        style={{ 
                          color: theme.textColor,
                          lineHeight: '1.5'
                        }}
                      >
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div 
                      className="p-3 sm:p-4 rounded-xl flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: theme.accentColor + '20' }}
                    >
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-70 mb-1" style={{ color: theme.textColor }}>
                        Waktu
                      </h4>
                      <p 
                        className="text-sm sm:text-base font-bold"
                        style={{ 
                          color: theme.textColor,
                          lineHeight: '1.5'
                        }}
                      >
                        {formatTime(event.time)} WIB
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div 
                      className="p-3 sm:p-4 rounded-xl flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: theme.accentColor + '20' }}
                    >
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-70 mb-1" style={{ color: theme.textColor }}>
                        Lokasi
                      </h4>
                      <p 
                        className="text-sm sm:text-base font-bold leading-relaxed break-words"
                        style={{ 
                          color: theme.textColor,
                          lineHeight: '1.6'
                        }}
                      >
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Maps Button */}
                {event.mapsLink && (
                  <div className="pt-6 sm:pt-8 border-t" style={{ borderColor: theme.accentColor + '30' }}>
                    <Link
                      href={event.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 w-full shadow-xl border-2 border-transparent"
                      style={{
                        backgroundColor: theme.accentColor,
                        color: 'white',
                        fontSize: '16px'
                      }}
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="text-base sm:text-lg">Lihat di Maps</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 lg:mt-20"
        >
          <div 
            className="inline-block px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-2xl backdrop-blur-md border-2 shadow-lg"
            style={{ 
              backgroundColor: theme.cardColor + '80',
              borderColor: theme.accentColor + '40'
            }}
          >
            <p 
              className="text-sm sm:text-base font-medium opacity-85"
              style={{ 
                color: theme.mutedText,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Mohon kehadiran Anda tepat waktu
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}