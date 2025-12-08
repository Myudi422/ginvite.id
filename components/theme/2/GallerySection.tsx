import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface GallerySectionProps {
  gallery: {
    items: string[];
  };
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
}

export default function GallerySection({ gallery, theme }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (!gallery?.items || gallery.items.length === 0) return null;

  return (
    <section 
      id="gallery"
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
              Galeri
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
            Momen Berharga
          </h2>
        </motion.div>

        {/* Gallery Masonry Layout - Netflix Style */}
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 lg:gap-6 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto">
          {gallery.items.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group cursor-pointer break-inside-avoid mb-3 sm:mb-4 lg:mb-6 hover:z-10 relative"
              onClick={() => setSelectedImage(image)}
            >
              <div 
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 hover:border-opacity-80 transition-all duration-500 shadow-lg hover:shadow-2xl group-hover:scale-[1.02]"
                style={{ 
                  borderColor: theme.accentColor + '30',
                  boxShadow: `0 10px 25px -5px rgba(0,0,0,0.4)`
                }}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <div 
                      className="p-4 rounded-full backdrop-blur-sm"
                      style={{ backgroundColor: theme.accentColor + '80' }}
                    >
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 z-20 p-3 sm:p-4 rounded-full backdrop-blur-md border-2 text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl"
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderColor: theme.accentColor + '60'
              }}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Gallery image"
                width={1200}
                height={800}
                className="rounded-2xl max-w-full max-h-full object-contain shadow-2xl"
                sizes="90vw"
              />
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}