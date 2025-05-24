// components/theme/1/CountdownSection.tsx
import React from 'react';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/countdown-timer';
import { motion } from 'framer-motion';
import { sectionVariant, textVariant } from './animasi';

interface CountdownSectionProps {
  eventDate: Date;
  calendarUrl: string;
  theme: {
    accentColor: string;
    defaultBgImage: string;
  };
}

export default function CountdownSection({
  eventDate,
  calendarUrl,
  theme: { accentColor, defaultBgImage },
}: CountdownSectionProps) {
  return (
    <motion.section
      id="countdown"
      className="py-6 px-4 md:px-8"
      style={{ backgroundImage: `url(${defaultBgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-soft p-8 text-center"
        variants={textVariant}
        custom={0}
      >
        <motion.div
          className="flex items-center justify-center gap-2 mb-4 text-lg font-medium text-gray-700"
          variants={textVariant}
          custom={1}
        >
          <span>🌸</span>
          <span>Menuju Hari Bahagia</span>
          <span>🌸</span>
        </motion.div>

        <motion.div variants={textVariant} custom={2}>
          <CountdownTimer
            targetDate={eventDate}
            containerClassName="flex justify-center gap-3 mb-6"
            numberClassName="w-14 h-14 rounded-lg shadow flex items-center justify-center text-xl font-bold"
            labelClassName="text-xs mt-1 text-gray-500"
            accentColor={accentColor}
          />
        </motion.div>

        <motion.div variants={textVariant} custom={3}>
          <Link href={calendarUrl} target="_blank" className="inline-block">
            <Button
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-full font-medium shadow-sm"
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              <CalendarDays size={16} /> Simpan di Kalender
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}