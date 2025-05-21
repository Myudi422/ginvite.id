import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import '@/styles/font.css';

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
  };
  waktu_acara: string; // Ganti event.date dengan waktu_acara
  event?: Event; // Tambahkan properti event (opsional)
  childrenData: Array<{ nickname: string }>;
  isWedding: boolean;
  minHeight?: string;
  nameFontSize?: React.CSSProperties;
  weddingTextFontSize?: React.CSSProperties;
  marginBottomWeddingText?: string;
  marginBottomName?: string;
  topLeftDecoration?: string;
  topRightDecoration?: string;
  bottomLeftDecoration?: string;
  bottomRightDecoration?: string;
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
}

export default function ProfileSection({
  gallery,
  defaultBgImage1,
  opening,
  waktu_acara, // Gunakan waktu_acara
  childrenData,
  isWedding,
  minHeight = '100vh',
  nameFontSize = {},
  weddingTextFontSize = {},
  marginBottomWeddingText = 'mb-2',
  marginBottomName = 'mb-2',
  topLeftDecoration,
  topRightDecoration,
  bottomLeftDecoration,
  bottomRightDecoration,
  specialFontFamily,
  BodyFontFamily,
  theme,
  event, // Gunakan properti event
  HeadingFontFamily

}: ProfileSectionProps) {
  const nameStyle: React.CSSProperties = {
    ...nameFontSize,
    fontFamily: specialFontFamily,
    fontSize: '40px',
    minFontSize: '40px',
    '@media (min-width: 768px)': {
      fontSize: '40px',
      minFontSize: '40px',
    },
  };

  const hasGallery = gallery.items && gallery.items.length > 0;
  const images = hasGallery ? gallery.items.slice(0, 3) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Ganti gambar setiap 3 detik

      return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
    }
  }, [images.length]);

  return (
    <section
      id="profile"
      className="relative overflow-hidden flex flex-col items-center justify-center" // Ubah justify-start menjadi justify-center
      style={{ minHeight: minHeight }}
    >
      <AnimatePresence>
        {hasGallery ? (
          <motion.div
            key={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 overflow-hidden"
          >
            <Image
              src={images[currentIndex]}
              alt="Background Gallery"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={defaultBgImage1}
              alt="Default Background"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        )}
      </AnimatePresence>

      {/* Top-left decoration */}
      {topLeftDecoration && (
        <div className="absolute top-0 left-0 z-20">
          <Image
            src={topLeftDecoration}
            alt="Top Left Decoration"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      )}
      {/* Top-right decoration */}
      {topRightDecoration && (
        <div className="absolute top-0 right-0 z-20">
          <Image
            src={topRightDecoration}
            alt="Top Right Decoration"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      )}

      {/* Kontainer teks di tengah */}
      <div className="relative z-10 text-center">
        {/* Judul */}
        {opening.title && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`font-semibold ${marginBottomWeddingText}`}
            style={{
              ...weddingTextFontSize,
              fontFamily: HeadingFontFamily,
              color: theme.textColor,
            }}
          >
            {opening.title}
          </motion.div>
        )}

        {/* Nama */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`font-bold text-3xl md:text-5xl ${marginBottomName}`}
          style={{ color: theme.textColor, ...nameFontSize }}
        >
          {isWedding
            ? `${childrenData[0]?.nickname} & ${childrenData[1]?.nickname}`
            : childrenData[0]?.nickname}
        </motion.div>

        {/* Waktu Acara */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-white font-medium text-xl"
          style={{ paddingTop: '0px', fontFamily: BodyFontFamily }}
        >
          {event?.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Segera Dilaksanakan'}
        </motion.div>
      </div>

      {/* Bottom-left decoration */}
      {bottomLeftDecoration && (
        <div className="absolute bottom-0 left-0 z-20">
          <Image
            src={bottomLeftDecoration}
            alt="Bottom Left Decoration"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      )}
      {/* Bottom-right decoration */}
      {bottomRightDecoration && (
        <div className="absolute bottom-0 right-0 z-20">
          <Image
            src={bottomRightDecoration}
            alt="Bottom Right Decoration"
            width={100}
            height={100}
            objectFit="contain"
          />
        </div>
      )}
    </section>
  );
}