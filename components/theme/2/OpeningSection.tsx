import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface OpeningSectionProps {
  opening: {
    title: string;
    toLabel: string;
  };
  gallery: { items: string[] };
  decorations: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  theme: {
    defaultBgImage1: string;
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
  };
  isWedding: boolean;
  childrenData: Array<{ name: string; nickname?: string }>;
  onOpen: () => void;
  onShowQr: () => void;
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
  plugin?: any;
  category_type?: { id: number; name: string };
  toName?: string;
}

export default function OpeningSection({
  opening,
  gallery,
  decorations,
  theme,
  isWedding,
  childrenData,
  onOpen,
  onShowQr,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
  plugin,
  category_type,
  toName,
}: OpeningSectionProps) {

  const bgImage = gallery?.items?.[0] || theme.defaultBgImage1;
  const nickname1 = childrenData?.[0]?.nickname || childrenData?.[0]?.name || '';
  const nickname2 = childrenData?.[1]?.nickname || childrenData?.[1]?.name || '';
  const coupleNames = [nickname1, nickname2].filter(Boolean).join(' & ');

  // Determine event type
  const lowerCategory = (category_type?.name || '').toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');
  const eventType = isKhitan ? 'Khitanan' : (isWedding ? 'Pernikahan' : 'Acara');

  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.5)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: theme.backgroundColor
      }}
    >
      {/* Netflix-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
      
      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full py-20"
      >
        {/* Event Type Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-block mb-6 sm:mb-8"
        >
          <span 
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-opacity-90 backdrop-blur-sm border-2"
            style={{ 
              backgroundColor: theme.accentColor + '15', 
              color: theme.accentColor,
              borderColor: theme.accentColor + '60'
            }}
          >
            Undangan {eventType}
          </span>
        </motion.div>

        {/* Couple Names - Netflix Style Large Text */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight"
          style={{ 
            fontFamily: specialFontFamily || HeadingFontFamily || 'serif',
            color: theme.textColor,
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            letterSpacing: '-0.02em'
          }}
        >
          {coupleNames}
        </motion.h1>

        {/* Invitation To */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8 sm:mb-10"
        >
          <p 
            className="text-base sm:text-lg md:text-xl mb-3 opacity-90 font-medium"
            style={{ 
              fontFamily: BodyFontFamily || 'sans-serif',
              color: theme.textColor 
            }}
          >
            {opening.toLabel || 'Kepada Yth.'}
          </p>
          <p 
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{ 
              fontFamily: BodyFontFamily || 'sans-serif',
              color: theme.accentColor,
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
            }}
          >
            {toName || 'Bapak/Ibu/Saudara/i'}
          </p>
        </motion.div>

        {/* Title/Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl mb-10 sm:mb-12 opacity-85 max-w-3xl mx-auto leading-relaxed px-4"
          style={{ 
            fontFamily: BodyFontFamily || 'sans-serif',
            color: theme.textColor 
          }}
        >
        </motion.p>

        {/* Action Buttons - Netflix Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md sm:max-w-lg mx-auto"
        >
          <Button
            onClick={onOpen}
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl border-2 border-transparent"
            style={{
              backgroundColor: theme.accentColor,
              color: 'white',
              minWidth: '200px'
            }}
          >
            <Play className="w-6 h-6" fill="currentColor" />
            Buka Undangan
          </Button>

          <Button
            onClick={onShowQr}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md border-2"
            style={{
              borderColor: theme.textColor + '60',
              color: theme.textColor,
              backgroundColor: 'rgba(255,255,255,0.15)',
              minWidth: '200px'
            }}
          >
            <QrCode className="w-5 h-5" />
            QR Code
          </Button>
        </motion.div>


      </motion.div>

      {/* Decorative Elements */}
      {decorations?.topLeft && (
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 opacity-40 z-5">
          <Image
            src={decorations.topLeft}
            alt="Decoration"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>
      )}
      {decorations?.topRight && (
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-40 z-5">
          <Image
            src={decorations.topRight}
            alt="Decoration"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>
      )}
    </div>
  );
}