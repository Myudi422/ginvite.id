import { motion } from 'framer-motion';

interface FooterSectionProps {
  textColor: string;
}

export default function FooterSection({ textColor }: FooterSectionProps) {
  const theme = {
    accentColor: '#e50914',
    textColor: '#ffffff',
    backgroundColor: '#0f0f0f',
    cardColor: '#1a1a1a',
    mutedText: '#b3b3b3'
  };

  return (
    <footer 
      className="py-8 sm:py-12 md:py-16 border-t-2"
      style={{ 
        backgroundColor: theme.backgroundColor,
        borderColor: theme.accentColor + '30'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div 
            className="inline-block px-6 sm:px-8 py-4 sm:py-5 rounded-2xl backdrop-blur-md border-2 shadow-lg"
            style={{
              backgroundColor: theme.cardColor + '80',
              borderColor: theme.accentColor + '40'
            }}
          >
            <div className="space-y-3">
              <p 
                className="text-sm sm:text-base opacity-80 font-medium"
                style={{ 
                  color: theme.textColor,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                © ginvite.id – By PT DIGITAL INTER NUSA
              </p>
              <div className="flex items-center justify-center gap-2">
                <span 
                  className="text-sm opacity-70"
                  style={{ color: theme.mutedText }}
                >
                  Powered by
                </span>
                <a 
                  href="https://papunda.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-1"
                  style={{ color: theme.accentColor }}
                >
                  <span>📱</span>
                  <span>Papunda.com</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}