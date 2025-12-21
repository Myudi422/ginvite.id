import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  mapsLink?: string;
}

interface ImportantEventSectionProps {
  events: Event[];
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
}

export default function ImportantEventSection({
  events,
  theme,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
}: ImportantEventSectionProps) {
  
  if (!events || events.length === 0) return null;

  return (
    <section 
      className="py-20 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span 
              className="px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase"
              style={{ 
                backgroundColor: theme.accentColor + '20', 
                color: theme.accentColor,
                border: `2px solid ${theme.accentColor}`
              }}
            >
              Acara Penting
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ 
              color: theme.textColor,
              fontFamily: HeadingFontFamily || specialFontFamily || 'serif'
            }}
          >
            Rangkaian Acara
          </h2>
        </motion.div>

        {/* Events Timeline */}
        <div className="max-w-4xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative mb-8 last:mb-0"
            >
              {/* Timeline Line */}
              {index < events.length - 1 && (
                <div 
                  className="absolute left-8 top-20 w-0.5 h-16 opacity-30"
                  style={{ backgroundColor: theme.accentColor }}
                />
              )}

              <div className="flex items-start gap-6">
                {/* Timeline Dot */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                    style={{ 
                      backgroundColor: theme.cardColor,
                      borderColor: theme.accentColor
                    }}
                  >
                    <Calendar className="w-6 h-6" style={{ color: theme.accentColor }} />
                  </div>
                </div>

                {/* Event Card */}
                <div className="flex-grow">
                  <div 
                    className="rounded-2xl p-6 backdrop-blur-sm border border-opacity-20"
                    style={{ 
                      backgroundColor: theme.cardColor + '90',
                      borderColor: theme.accentColor + '30'
                    }}
                  >
                    {/* Event Title */}
                    <h3 
                      className="text-xl md:text-2xl font-bold mb-4"
                      style={{ 
                        color: theme.textColor,
                        fontFamily: HeadingFontFamily || specialFontFamily || 'serif'
                      }}
                    >
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5" style={{ color: theme.accentColor }} />
                        <span style={{ color: theme.textColor }}>{event.date}</span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5" style={{ color: theme.accentColor }} />
                        <span style={{ color: theme.textColor }}>{event.time} WIB</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5" style={{ color: theme.accentColor }} />
                        <div className="flex-1">
                          <span style={{ color: theme.textColor }}>{event.location}</span>
                          {event.mapsLink && (
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  let url = event.mapsLink;
                                  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                                    url = 'https://' + url;
                                  }
                                  window.open(url, '_blank', 'noopener,noreferrer');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                style={{
                                  backgroundColor: theme.accentColor,
                                  color: 'white'
                                }}
                              >
                                <MapPin className="w-4 h-4" />
                                Buka Maps
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}