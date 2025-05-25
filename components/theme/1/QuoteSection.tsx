// components/theme/1/QuoteSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { sectionVariant, textVariant } from './animasi';

interface QuoteSectionProps {
  quote: string;
  theme: {
    defaultBgImage: string;
    accentColor: string;
    textColor: string;
  };
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
}

export default function QuoteSection({
  quote,
  theme,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
}: QuoteSectionProps) {
  // Split quote into lines for staggered animation
  const lines = quote.split('\n');

  return (
    <motion.section
      id="quote-section"
      className="home-section"
      style={{
        padding: '2rem 1rem',
        backgroundImage: `url(${theme.defaultBgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="home-inner mx-auto max-w-2xl"
        variants={sectionVariant}
      >
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: theme.accentColor,
            opacity: 0.8,
            backdropFilter: 'blur(8px)',
          }}
        >
          {lines.map((line, idx) => (
            <motion.p
              key={idx}
              className="text-lg leading-relaxed"
              style={{
                fontFamily: specialFontFamily,
                color: theme.textColor,
                marginBottom: '0.5rem',
              }}
              variants={textVariant}
              custom={idx}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}