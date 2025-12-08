import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface InvitationTextSectionProps {
  invitation: string;
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
}

export default function InvitationTextSection({ invitation, theme }: InvitationTextSectionProps) {
  
  if (!invitation) return null;

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
              Undangan
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="rounded-2xl p-10 backdrop-blur-sm border border-opacity-20 text-center"
            style={{ 
              backgroundColor: theme.cardColor + '90',
              borderColor: theme.accentColor + '30'
            }}
          >
            {/* Mail Icon */}
            <div className="mb-8">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: theme.accentColor + '20' }}
              >
                <Mail className="w-8 h-8" style={{ color: theme.accentColor }} />
              </div>
            </div>

            {/* Invitation Text */}
            <div 
              className="text-lg md:text-xl leading-relaxed whitespace-pre-line"
              style={{ color: theme.textColor }}
              dangerouslySetInnerHTML={{ __html: invitation }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}