import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import Image from 'next/image';

interface StoryItem {
  title: string;
  date: string;
  story: string;
  image?: string;
}

interface OurStorySectionProps {
  ourStory: StoryItem[];
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
      id="story"
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
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {ourStory.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline Line */}
              {index < ourStory.length - 1 && (
                <div 
                  className="absolute left-8 top-20 w-0.5 h-20 opacity-30"
                  style={{ backgroundColor: theme.accentColor }}
                />
              )}

              <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="flex-shrink-0 relative order-2 lg:order-none">
                  <div 
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center border-4 shadow-2xl hover:scale-110 transition-transform duration-300"
                    style={{ 
                      backgroundColor: theme.cardColor,
                      borderColor: theme.accentColor
                    }}
                  >
                    <Heart className="w-6 h-6 lg:w-8 lg:h-8" style={{ color: theme.accentColor }} fill="currentColor" />
                  </div>
                </div>

                {/* Story Card */}
                <div className="flex-1 w-full max-w-2xl order-1 lg:order-none">
                  <div 
                    className="rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-10 backdrop-blur-md border-2 shadow-2xl hover:scale-[1.02] transition-all duration-500"
                    style={{ 
                      backgroundColor: theme.cardColor + 'CC',
                      borderColor: theme.accentColor + '40',
                      boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                    }}
                  >
                    {/* Date Badge */}
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: theme.accentColor + '20' }}>
                        <Calendar className="w-4 h-4" style={{ color: theme.accentColor }} />
                        <span className="text-sm font-semibold" style={{ color: theme.accentColor }}>
                          {story.date}
                        </span>
                      </div>
                    </div>

                    {/* Story Title */}
                    <h3 
                      className="text-xl md:text-2xl font-bold mb-4"
                      style={{ 
                        color: theme.textColor,
                        fontFamily: HeadingFontFamily || specialFontFamily || 'serif'
                      }}
                    >
                      {story.title}
                    </h3>

                    {/* Story Text */}
                    <p 
                      className="text-base md:text-lg leading-relaxed mb-6"
                      style={{ 
                        color: theme.mutedText,
                        fontFamily: BodyFontFamily || 'sans-serif'
                      }}
                    >
                      {story.story}
                    </p>

                    {/* Story Image */}
                    {story.image && (
                      <div className="rounded-xl overflow-hidden border border-opacity-20" style={{ borderColor: theme.accentColor }}>
                        <Image
                          src={story.image}
                          alt={story.title}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
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