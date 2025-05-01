// components/theme/1/GallerySection.tsx
import Image from 'next/image';

interface GallerySectionProps {
  gallery: { items: string[] };
  theme: {
    defaultBgImage: string;
  };
}

export default function GallerySection({ gallery, theme }: GallerySectionProps) {
  return (
    <section
      id="gallery"
      className="home-section text-center"
      style={{
        backgroundImage: `url(${theme.defaultBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div className="home-inner">
        <h2 className="text-2xl font-bold mb-6">Galeri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gallery.items.map((src, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-md overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={src}
                  alt={`Gallery ${idx}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
