import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QRModal from '@/components/QRModal';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

interface OpeningSectionProps {
  opening: {
    title: string;
    toLabel: string;
    // to: string; // Tidak perlu lagi karena kita akan mengambil dari query params
  };
  gallery: { items: string[] };
  decorations: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  theme: {
    defaultBgImage1: string; // Pastikan properti ini ada di theme
    accentColor: string;
    textColor: string;
  };
  isWedding: boolean;
  childrenData: Array<{ nickname: string }>;
  onOpen: () => void;
  onShowQr: () => void;
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
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
  HeadingFontFamily
}: OpeningSectionProps) {
  const searchParams = useSearchParams();
  const toName = searchParams?.get("to") || "Bapak/Ibu/Saudara/i";

  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
      gallery?.items?.length > 0 ? gallery.items[0] : theme.defaultBgImage1
    })`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-6 z-40"
      style={backgroundImageStyle}
    >
      {/* Decoration Elements */}
  {[
    decorations.topLeft,
    decorations.topRight,
    decorations.bottomLeft,
    decorations.bottomRight,
  ]
    .filter(src => src) // Filter out null, undefined, and empty strings
    .map((src, i) => (
      <img
        key={i}
        src={src}
        className={`absolute ${
          [
            'top-0 left-0',
            'top-0 right-0',
            'bottom-0 left-0',
            'bottom-0 right-0',
          ][i % 4] // Gunakan modulo untuk index yang benar setelah filter
        } w-24 h-24 md:w-48 md:h-48 animate-pulse pointer-events-none z-0`}
        alt=""
      />
    ))}

      {/* Main Content */}
      <div className="text-center space-y-6 relative z-10 max-w-2xl mx-auto">
        {/* Titles */}
        <h1 className="text-2xl font-bold" style={{ color: theme.textColor,  fontFamily: HeadingFontFamily }}>{opening.title}</h1>

        <div className="mt-2 space-y-1">
          {isWedding ? (
            <h2
              className="text-2xl md:text-4xl font-extrabold"
              style={{ color: theme.textColor, fontFamily: specialFontFamily}}
            >
              {childrenData[0].nickname} &amp; {childrenData[1].nickname}
            </h2>
          ) : (
            childrenData.map((c, i) => (
              <h2
                key={i}
                className="text-2xl md:text-4xl font-extrabold"
                style={{ color: theme.textColor, fontFamily: specialFontFamily}}
              >
                {c.nickname}
              </h2>
            ))
          )}
        </div>

        {/* Invitation Text */}
        <p className="text-sm"style={{ color: theme.textColor,  fontFamily: BodyFontFamily }}>
          Tanpa Mengurangi Rasa Hormat, Kami Mengundang
        </p>

        {/* Recipient Section */}
        <div className="my-8 py-4 border-t border-b border-white/30" style={{ color: theme.textColor,  fontFamily: BodyFontFamily }}>
          <h2 className="text-lg mb-2">{opening.toLabel}</h2>
          <p className="text-xl font-semibold">{toName}</p> {/* Menggunakan toName dari query params */}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 items-center">
          <Button
            onClick={onOpen}
            className="px-8 py-4 rounded-full font-medium shadow-lg transform transition-transform hover:scale-105"
            style={{ backgroundColor: theme.accentColor, color: theme.textColor, }}
          >
            Buka Undangan
          </Button>

          {isWedding && (
            <Button
              onClick={onShowQr}
              className="px-6 py-3 rounded-full font-medium shadow-lg transform transition-transform hover:scale-105"
              style={{ backgroundColor: theme.accentColor, color: theme.textColor, }}
            >
              QR CHECK-IN
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}