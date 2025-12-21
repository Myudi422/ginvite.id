import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';

interface ClosingSectionProps {
  gallery: { items: string[] };
  childrenData: Array<{ name: string; nickname?: string }>;
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
  defaultBgImage1: string;
  category_type?: { id: number; name: string };
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
}

export default function ClosingSection({
  gallery,
  childrenData,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
  defaultBgImage1,
  category_type,
  theme,
}: ClosingSectionProps) {
  
  const bgImage = gallery?.items?.[0] || defaultBgImage1;
  const person1 = childrenData?.[0];
  const person2 = childrenData?.[1];
  
  // Determine event type
  const lowerCategory = (category_type?.name || '').toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');
  const isWedding = !!person2 && !isKhitan;
  
  const coupleNames = isKhitan ? 
    (person1?.name || person1?.nickname) : 
    [person1?.name || person1?.nickname, person2?.name || person2?.nickname]
      .filter(Boolean)
      .join(' & ');

  return (
    <section 
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 min-h-screen flex items-center justify-center"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Netflix-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center"
        >
          {/* Heart Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-10 flex justify-center"
          >
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: theme.accentColor + '20' }}
            >
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" style={{ color: theme.accentColor }} fill="currentColor" />
            </div>
          </motion.div>

          {/* Main Closing Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 w-full flex flex-col items-center"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 sm:mb-10 leading-tight text-center"
              style={{ 
                fontFamily: HeadingFontFamily || specialFontFamily || 'serif',
                color: theme.textColor,
                textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                letterSpacing: '-0.01em'
              }}
            >
              Terima Kasih
            </h2>
            
            <div 
              className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 backdrop-blur-md border-2 mb-8 sm:mb-10 w-full max-w-4xl shadow-2xl"
              style={{ 
                backgroundColor: theme.cardColor + 'CC',
                borderColor: theme.accentColor + '40',
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
              }}
            >
              <p 
                className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8"
                style={{ 
                  color: theme.textColor,
                  fontFamily: BodyFontFamily || 'sans-serif'
                }}
              >
                Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila 
                Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu kepada kami.
              </p>
              
              <p 
                className="text-base md:text-lg opacity-90 mb-8"
                style={{ 
                  color: theme.mutedText,
                  fontFamily: BodyFontFamily || 'sans-serif'
                }}
              >
                Atas do'a dan restunya, kami ucapkan terima kasih.
              </p>

              {/* Signature */}
              <div className="border-t border-opacity-20 pt-8" style={{ borderColor: theme.accentColor }}>
                <p 
                  className="text-sm uppercase tracking-wider mb-2 opacity-80"
                  style={{ color: theme.mutedText }}
                >
                  Wassalamualaikum Wr. Wb.
                </p>
                <p 
                  className="text-xl md:text-2xl font-bold"
                  style={{ 
                    color: theme.accentColor,
                    fontFamily: specialFontFamily || HeadingFontFamily || 'serif'
                  }}
                >
                  {coupleNames}
                </p>
              </div>
            </div>
          </motion.div>



          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="w-full flex justify-center mb-8"
          >
            <div 
              className="inline-block px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-2xl backdrop-blur-md border-2 shadow-xl"
              style={{ 
                backgroundColor: theme.accentColor + '20',
                borderColor: theme.accentColor + '60'
              }}
            >
              <p 
                className="text-base sm:text-lg md:text-xl font-bold text-center"
                style={{ 
                  color: theme.accentColor,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                ❤️ Dengan Cinta, {coupleNames} ❤️
              </p>
            </div>
          </motion.div>

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            viewport={{ once: true }}
            className="mt-4 flex justify-center"
          >
            <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} />
          </motion.div>

          {/* Footer credit */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-xs opacity-75 mt-4"
            style={{ 
              fontFamily: BodyFontFamily,
              color: theme.textColor 
            }}
          >
            Copyright © {new Date().getFullYear()} by papunda.com
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}