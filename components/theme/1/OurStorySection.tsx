'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { sectionVariant, textVariant } from './animasi';

interface StoryItem {
  title: string;
  date?: string;
  description: string;
  pictures?: string[];
}

interface OurStorySectionProps {
  ourStory: StoryItem[];
  theme: {
    textColor: string;
    bgColor: string;
    accentColor: string;
    background: string;
  };
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
}

export default function OurStorySection({
  ourStory,
  theme,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
}: OurStorySectionProps) {
  return (
    <section
      id="ourstory"
      className="py-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${theme.background})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-center"
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span
            className="h-px flex-grow"
            style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
          />
          <h2
            className="mx-4 text-3xl font-bold whitespace-nowrap"
            style={{
              color: theme.accentColor,
              fontFamily: HeadingFontFamily,
            }}
          >
            ✨ Our Story ✨
          </h2>
          <span
            className="h-px flex-grow"
            style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {ourStory.map((item, idx) => (
            <motion.div
              key={idx}
              className="relative"
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={idx}
            >
              {/* Title and Date */}
              <div className="mb-6 relative">
                <h3
                  className="inline-block text-2xl font-semibold"
                  style={{ color: theme.textColor, fontFamily: specialFontFamily }}
                >
                  <span
                    className="inline-block px-4 py-2 rounded-md"
                    style={{ backgroundColor: theme.accentColor, opacity: 0.8 }}
                  >
                    {item.title}
                  </span>
                </h3>
                {item.date && (
                  <span
                    className="absolute top-0 right-0 text-sm italic"
                    style={{ color: theme.textColor, fontFamily: BodyFontFamily }}
                  >
                    {item.date}
                  </span>
                )}
              </div>

              {/* Image with square aspect and description overlay */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={item.pictures?.[0] || theme.bgColor}
                  alt={item.title}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition duration-300"
                />
                {/* Description Box Overlay */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full p-4">
                    {/* Background box behind text */}
                    <div
                      className="inline-block w-full max-w-full px-3 py-2 rounded-md"
                      style={{ backgroundColor: theme.accentColor, opacity: 0.8 }}
                    >
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: theme.textColor }}
                      >
                        {item.description}
                      </p>
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
