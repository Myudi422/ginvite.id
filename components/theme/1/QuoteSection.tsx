// components/theme/1/QuoteSection.tsx
import React from 'react';

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
  specialFontFamily = 'sans-serif',
  BodyFontFamily = 'sans-serif',
  HeadingFontFamily = 'sans-serif',
}: QuoteSectionProps) {
  return (
    <section
      id="quote-section"
      className="home-section"
      style={{
        padding: '2rem 1rem',
        backgroundImage: `url(${theme.defaultBgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="home-inner mx-auto max-w-2xl">
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: theme.accentColor,
            opacity: 0.8,
            backdropFilter: 'blur(8px)',
          }}
        >
          <p
            className="text-lg leading-relaxed"
            style={{
              fontFamily: BodyFontFamily,
              color: theme.textColor,
            }}
            dangerouslySetInnerHTML={{ __html: quote.replace(/\n/g, '<br/>') }}
          />
        </div>
      </div>
    </section>
  );
}
