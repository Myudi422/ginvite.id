import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

interface TurutSectionProps {
  enabled: boolean;
  list: { name: string }[];
  accentColor: string;
}

export default function TurutSection({ enabled, list, accentColor }: TurutSectionProps) {
  if (!enabled || !list || list.length === 0) return null;

  const theme = {
    accentColor,
    textColor: '#ffffff',
    backgroundColor: '#0f0f0f',
    cardColor: '#1a1a1a',
    mutedText: '#b3b3b3'
  };

  return (
    <section 
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
              Turut Mengundang
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
            style={{ 
              color: theme.textColor,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              letterSpacing: '-0.01em'
            }}
          >
            Keluarga Besar
          </h2>
        </motion.div>

        {/* Turut List */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div 
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-md border-2 shadow-2xl"
            style={{ 
              backgroundColor: theme.cardColor + 'CC',
              borderColor: theme.accentColor + '40',
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
            }}
          >
            {/* Icon */}
            <div className="text-center mb-8 sm:mb-10">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: theme.accentColor + '20' }}
              >
                <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: theme.accentColor }} />
              </div>
            </div>

            {/* Names Flex Layout */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {list.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="text-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 flex-shrink-0 min-w-0"
                  style={{ 
                    backgroundColor: theme.accentColor + '15',
                    borderColor: theme.accentColor + '30'
                  }}
                >
                  <p 
                    className="font-bold text-sm sm:text-base md:text-lg"
                    style={{ 
                      color: theme.textColor,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      lineHeight: '1.5'
                    }}
                  >
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}