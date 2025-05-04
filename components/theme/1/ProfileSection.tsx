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
  time: string;        // Tambahkan properti time
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
  time,        // Terima properti time
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

  const images = gallery.items.slice(0, 3); // Ambil maksimal 3 gambar
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Ganti gambar setiap 5 detik (bisa disesuaikan)

      return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
    }
  }, [images.length]);

  return (
    <section
      id="profile"
      className="relative overflow-hidden flex flex-col justify-between"
      style={{ minHeight: minHeight }}
    >
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            key={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 overflow-hidden" // Tambahkan overflow-hidden
          >
            <Image
              src={images[currentIndex]}
              alt="Background Gallery"
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </motion.div>
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

      {/* Judul di paling atas */}
      {opening.title && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative z-10 pt-20 text-center"
        >
          <div
            className={`font-semibold ${marginBottomWeddingText}`}
            style={{
              ...weddingTextFontSize, // Gabungkan weddingTextFontSize menggunakan spread operator
              fontFamily: HeadingFontFamily,
              color: theme.textColor,  // Tambahkan fontFamily setelahnya (atau sebelumnya)
            }}
          >
            {opening.title}
          </div>
        </motion.div>
      )}

      {/* ↓↓ INI BAGIAN BAWAH YANG DISesuaikan ↓↓ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 pb-20 text-center"
        style={{
          opacity: 1,
          transform: 'none',
          paddingBottom: '220px',
        }}
      >
        {/* Nama */}
        <div
          className="font-bold text-3xl md:text-5xl mb-4"
          style={{ color: theme.textColor, ...nameFontSize }}
        >
          {isWedding
            ? `${childrenData[0]?.nickname} & ${childrenData[1]?.nickname}`
            : childrenData[0]?.nickname}
        </div>
        <div
          className="text-white font-medium text-xl"
          style={{ paddingTop: '0px', fontFamily: BodyFontFamily}}
        >
          {waktu_acara} {/* Gunakan waktu_acara di sini */}
        </div>
      </motion.div>

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