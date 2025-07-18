import { FaInstagram, FaGlobe, FaMusic } from 'react-icons/fa';
import Image from 'next/image';

interface ClosingSectionProps {
  gallery: { items: string[] };
  childrenData: Array<{ name: string; nickname?: string }>;
  specialFontFamily?: string;
  BodyFontFamily?: string;
  HeadingFontFamily?: string;
  defaultBgImage1: string; // Tambahkan properti defaultBgImage1
  category_type?: { id: number; name: string }; // Tambahkan prop category_type opsional
}

export default function ClosingSection({
  gallery,
  childrenData,
  specialFontFamily,
  BodyFontFamily,
  HeadingFontFamily,
  defaultBgImage1,
  category_type,
}: ClosingSectionProps) {
  // Use first image in gallery as background, or default if gallery is empty
  const bgImage = gallery?.items?.length > 0 ? gallery.items[0] : defaultBgImage1;

  // Tentukan apakah pernikahan
  const isWeddingCategory = category_type?.name?.toLowerCase() === "pernikahan";

  return (
    <section
      id="penutup"
      className="home-section text-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="home-inner relative z-10 max-w-3xl mx-auto px-6 space-y-6">
        {/* Lead text */}
        <p
          className="text-sm lg:text-base text-white leading-relaxed"
          style={{ fontFamily: BodyFontFamily }}
        >
          Suatu kebahagiaan &amp; kehormatan bagi kami,<br />
          apabila Bapak/Ibu/Saudara/i berkenan hadir<br />
          dan memberikan do'a restu kepada kami
        </p>

        {/* Subheading */}
        <h3
          className="text-base lg:text-lg font-medium text-white"
          style={{ fontFamily:  HeadingFontFamily}}
        >
          Kami Yang Berbahagia,
        </h3>

        {/* Names */}
        <div className="space-y-2">
          {isWeddingCategory ? (
            <h2
              className="text-2xl md:text-4xl font-extrabold text-white italic tracking-wide"
              style={{ fontFamily: specialFontFamily }}
            >
              {childrenData[0]?.nickname} &amp; {childrenData[1]?.nickname}
            </h2>
          ) : (
            <h2
              className="text-2xl md:text-4xl font-extrabold text-white italic tracking-wide"
              style={{ fontFamily: specialFontFamily }}
            >
              {childrenData[0]?.name}
            </h2>
          )}
        </div>

       {/* Brand */}
       <div className="mt-4 flex justify-center">
        <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} />
       </div>
        {/* Footer credit */}
<p
  className="text-xs text-white opacity-75"
  style={{ fontFamily: BodyFontFamily }}
>
  Copyright © {new Date().getFullYear()} by papunda.com
</p>
      </div>
    </section>
  );
}