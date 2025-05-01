// components/profile/ProfileSection.tsx
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileSectionProps {
  gallery: { items: string[] };
  defaultBgImage1: string;
  opening: {
    title: string;
    toLabel: string;
    to: string;
  };
  childrenData: Array<{ nickname: string }>;
  isWedding: boolean;
  minHeight?: string;
  nameFontSize?: React.CSSProperties; // Menerima objek style CSS
  weddingTextFontSize?: React.CSSProperties; // Menerima objek style CSS
  marginBottomWeddingText?: string;
  marginBottomName?: string;
}

export default function ProfileSection({
  gallery,
  defaultBgImage1,
  opening,
  childrenData,
  isWedding,
  minHeight = '100vh',
  nameFontSize = {}, // Nilai default objek style kosong
  weddingTextFontSize = {}, // Nilai default objek style kosong
  marginBottomWeddingText = 'mb-2',
  marginBottomName = 'mb-2',
}: ProfileSectionProps) {
  return (
    <section
      id="profile"
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(${gallery.items[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: minHeight,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 flex flex-col items-center justify-center"
      >
        {isWedding && (
          <div className={`text-white font-semibold ${marginBottomWeddingText} text-center`} style={weddingTextFontSize}>
            The Wedding Of
          </div>
        )}
        <div className={`text-white font-semibold ${marginBottomName} text-center`} style={nameFontSize}>
          {isWedding ? `${childrenData[0]?.nickname} & ${childrenData[1]?.nickname}` : childrenData[0]?.nickname}
        </div>
        <div className="text-white text-sm md:text-base text-center">
          {/* Anda bisa menambahkan informasi tanggal atau teks lain di sini */}
        </div>
      </motion.div>
    </section>
  );
}