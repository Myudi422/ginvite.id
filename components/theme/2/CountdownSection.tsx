import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CountdownSectionProps {
  eventDate: Date;
  calendarUrl: string;
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownSection({ eventDate, calendarUrl, theme }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const eventTime = new Date(eventDate).getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

  return (
    <section 
      id="countdown"
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
              Countdown
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6"
            style={{ 
              color: theme.textColor,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.01em'
            }}
          >
            Menuju Hari Bahagia
          </h2>
          
          <p 
            className="text-base sm:text-lg md:text-xl opacity-85 font-medium"
            style={{ 
              color: theme.mutedText,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {eventDate.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-12 sm:mb-16"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group flex-shrink-0"
              >
                <div 
                  className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-md border-2 hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl"
                  style={{ 
                    backgroundColor: theme.cardColor + 'CC',
                    borderColor: theme.accentColor + '40',
                    boxShadow: `0 20px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                  }}
                >
                  <div 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      color: theme.accentColor,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      fontFamily: 'monospace'
                    }}
                  >
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div 
                    className="text-xs sm:text-sm md:text-base uppercase tracking-wider font-bold opacity-85"
                    style={{ 
                      color: theme.textColor,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {unit.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Calendar Button */}
        {calendarUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl border-2 border-transparent"
              style={{
                backgroundColor: theme.accentColor,
                color: 'white',
                minWidth: '250px'
              }}
            >
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg md:text-xl">Simpan ke Kalender</span>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}