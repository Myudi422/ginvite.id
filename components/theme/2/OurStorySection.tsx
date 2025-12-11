import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import Image from 'next/image';

interface StoryItem {
  title: string;
  date?: string;
  description?: string;
  story?: string;
  pictures?: string[];
  image?: string;
}

interface OurStorySectionProps {
  ourStory: StoryItem[];
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor?: string;
    mutedText?: string;
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
  
  if (!ourStory || ourStory.length === 0) return null;

  return (
    <section 
      id="ourstory"
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
              Kisah Kami
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
            style={{ 
              color: theme.textColor,
              fontFamily: HeadingFontFamily || specialFontFamily || 'serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.01em'
            }}
          >
            Perjalanan Cinta
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          {ourStory.map((story, index) => {
            const text = story.description || story.story || '';
            const images = story.pictures || (story.image ? [story.image] : []);
            const hasImage = images.length > 0 && images[0]?.trim();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="mb-12 last:mb-0"
              >
                <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-12">
                  
                  {/* Timeline Dot - Hidden on mobile, visible on lg */}
                  <div className="hidden lg:flex flex-shrink-0 pt-2">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-2xl flex-shrink-0"
                      style={{ 
                        backgroundColor: theme.cardColor || theme.accentColor + '10',
                        borderColor: theme.accentColor
                      }}
                    >
                      <Heart className="w-6 h-6" style={{ color: theme.accentColor }} fill="currentColor" />
                    </div>
                  </div>

                  {/* Story Card */}
                  <div className="flex-1 w-full">
                    <div 
                      className="rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 backdrop-blur-md border-2 shadow-2xl"
                      style={{ 
                        backgroundColor: theme.cardColor ? theme.cardColor + 'CC' : theme.accentColor + '10',
                        borderColor: theme.accentColor + '40',
                        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                      }}
                    >
                      {/* Date Badge */}
                      {story.date && (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: theme.accentColor + '20' }}>
                            <Calendar className="w-4 h-4" style={{ color: theme.accentColor }} />
                            <span className="text-sm font-semibold" style={{ color: theme.accentColor }}>
                              {story.date}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Story Title */}
                      <h3 
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-4"
                        style={{ 
                          color: theme.textColor,
                          fontFamily: HeadingFontFamily || specialFontFamily || 'serif'
                        }}
                      >
                        {story.title}
                      </h3>

                      {/* Story Text */}
                      {text && (
                        <p 
                          className="text-sm sm:text-base md:text-lg leading-relaxed mb-6"
                          style={{ 
                            color: theme.mutedText || '#b3b3b3',
                            fontFamily: BodyFontFamily || 'sans-serif'
                          }}
                        >
                          {text}
                        </p>
                      )}

                      {/* Story Image */}
                      {hasImage && (
                        <div className="rounded-xl overflow-hidden border border-opacity-20 mt-6" style={{ borderColor: theme.accentColor }}>
                          <div className="relative w-full aspect-video">
                            <Image
                              src={images[0]}
                              alt={story.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}