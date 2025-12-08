import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface QuoteSectionProps {
  quote: string;
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

export default function QuoteSection({
  quote,
  theme,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
}: QuoteSectionProps) {
  
  if (!quote) return null;

  return (
    <section 
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center flex justify-center"
        >
          <div 
            className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 backdrop-blur-md border-2 relative overflow-hidden w-full shadow-2xl"
            style={{ 
              backgroundColor: theme.cardColor + 'CC',
              borderColor: theme.accentColor + '40',
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
            }}
          >
            {/* Quote Icon */}
            <div className="mb-8 sm:mb-10 flex justify-center">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: theme.accentColor + '20' }}
              >
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" style={{ color: theme.accentColor }} />
              </div>
            </div>

            {/* Quote Text */}
            <blockquote 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed italic mb-8 sm:mb-10 text-center"
              style={{ 
                color: theme.textColor,
                fontFamily: specialFontFamily || HeadingFontFamily || 'serif'
              }}
            >
              "{quote}"
            </blockquote>

            {/* Decorative Line */}
            <div className="flex justify-center">
              <div 
                className="w-24 h-1 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}