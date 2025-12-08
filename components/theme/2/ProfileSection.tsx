import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ProfileSectionProps {
  gallery: { items: string[] };
  defaultBgImage1: string;
  opening: {
    title: string;
    toLabel: string;
    to: string;
    wedding_text?: string;
  };
  theme: {
    defaultBgImage: string;
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
  waktu_acara: string;
  event?: any;
  childrenData: Array<{ name: string; nickname?: string }>;
  isWedding: boolean;
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
  id?: string;
  category_type?: { id: number; name: string };
}

export default function ProfileSection({
  gallery,
  defaultBgImage1,
  opening,
  theme,
  waktu_acara,
  event,
  childrenData,
  isWedding,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
  id,
  category_type,
}: ProfileSectionProps) {
  
  const bgImage = gallery?.items?.[0] || defaultBgImage1;
  const person1 = childrenData?.[0];
  const person2 = childrenData?.[1];
  
  // Determine event type
  const lowerCategory = (category_type?.name || '').toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');
  const eventTypeText = isKhitan ? 'Khitanan' : (isWedding ? 'Pernikahan' : 'Acara');

  return (
    <section 
      id={id || "home"}
      className="min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Background with Netflix-style gradient */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Type Header */}
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
              {eventTypeText}
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 leading-tight"
            style={{ 
              fontFamily: HeadingFontFamily || specialFontFamily || 'serif',
              color: theme.textColor,
              textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
              letterSpacing: '-0.01em'
            }}
          >
            {isKhitan ? `${person1?.name || person1?.nickname}` : 
             (person1 && person2 ? `${person1.nickname || person1.name} & ${person2.nickname || person2.name}` :
              'Mempelai')}
          </h2>
          
          {waktu_acara && (
            <p 
              className="text-base sm:text-lg md:text-xl opacity-85 font-medium max-w-2xl mx-auto"
              style={{ 
                color: theme.mutedText,
                fontFamily: BodyFontFamily || 'sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
              }}
            >
              {waktu_acara}
            </p>
          )}
        </motion.div>

        {/* Profile Cards - Netflix Style Split Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20 xl:gap-32 max-w-7xl mx-auto relative">
          
          {/* Person 1 Card */}
          {person1 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center group flex-1 max-w-md"
            >
              <div 
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-md border-2 hover:scale-[1.02] transition-all duration-500 shadow-2xl"
                style={{ 
                  backgroundColor: theme.cardColor + 'CC',
                  borderColor: theme.accentColor + '40',
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                }}
              >
                {gallery?.items?.[1] && (
                  <div className="mb-6 sm:mb-8">
                    <div 
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto rounded-full overflow-hidden border-4 shadow-xl group-hover:scale-105 transition-transform duration-500" 
                      style={{ borderColor: theme.accentColor + '80' }}
                    >
                      <Image
                        src={gallery.items[1]}
                        alt={person1.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 180px, (max-width: 1200px) 220px, 260px"
                      />
                    </div>
                  </div>
                )}
                
                <h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
                  style={{ 
                    color: theme.textColor,
                    fontFamily: HeadingFontFamily || specialFontFamily || 'serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {person1.name}
                </h3>
                
                {person1.nickname && person1.nickname !== person1.name && (
                  <p 
                    className="text-base sm:text-lg md:text-xl mb-4 opacity-90 font-medium"
                    style={{ 
                      color: theme.accentColor,
                      fontFamily: BodyFontFamily || 'sans-serif',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    "{person1.nickname}"
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Heart Divider for Wedding */}
          {isWedding && person1 && person2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex lg:flex-shrink-0 justify-center items-center z-20 my-8 lg:my-0"
            >
              <div 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center backdrop-blur-md border-4 shadow-2xl hover:scale-110 transition-transform duration-300"
                style={{ 
                  backgroundColor: theme.accentColor,
                  borderColor: 'rgba(255,255,255,0.3)'
                }}
              >
                <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" />
              </div>
            </motion.div>
          )}

          {/* Person 2 Card (for wedding) */}
          {person2 && isWedding && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center group flex-1 max-w-md"
            >
              <div 
                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-md border-2 hover:scale-[1.02] transition-all duration-500 shadow-2xl"
                style={{ 
                  backgroundColor: theme.cardColor + 'CC',
                  borderColor: theme.accentColor + '40',
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                }}
              >
                {gallery?.items?.[2] && (
                  <div className="mb-6 sm:mb-8">
                    <div 
                      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto rounded-full overflow-hidden border-4 shadow-xl group-hover:scale-105 transition-transform duration-500" 
                      style={{ borderColor: theme.accentColor + '80' }}
                    >
                      <Image
                        src={gallery.items[2]}
                        alt={person2.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 180px, (max-width: 1200px) 220px, 260px"
                      />
                    </div>
                  </div>
                )}
                
                <h3 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4"
                  style={{ 
                    color: theme.textColor,
                    fontFamily: HeadingFontFamily || specialFontFamily || 'serif',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {person2.name}
                </h3>
                
                {person2.nickname && person2.nickname !== person2.name && (
                  <p 
                    className="text-base sm:text-lg md:text-xl mb-4 opacity-90 font-medium"
                    style={{ 
                      color: theme.accentColor,
                      fontFamily: BodyFontFamily || 'sans-serif',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    "{person2.nickname}"
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Quote or Wedding Text */}
        {opening.wedding_text && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12 sm:mt-16 lg:mt-20 max-w-4xl mx-auto"
          >
            <div 
              className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-md border-2 shadow-xl"
              style={{ 
                backgroundColor: theme.cardColor + '80',
                borderColor: theme.accentColor + '40',
                boxShadow: `0 20px 40px -12px rgba(0,0,0,0.4)`
              }}
            >
              <p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed italic font-medium"
                style={{ 
                  color: theme.mutedText,
                  fontFamily: BodyFontFamily || 'sans-serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  lineHeight: '1.7'
                }}
              >
                "{opening.wedding_text}"
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}