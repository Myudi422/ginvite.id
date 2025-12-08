import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';
import { useState } from 'react';

interface VideoSectionProps {
  youtubeLink: string;
  defaultBgImage1: string;
}

export default function VideoSection({ youtubeLink, defaultBgImage1 }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!youtubeLink) return null;

  const theme = {
    accentColor: '#e50914',
    textColor: '#ffffff',
    backgroundColor: '#0f0f0f',
    cardColor: '#1a1a1a',
    mutedText: '#b3b3b3'
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(youtubeLink);
  
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section 
      className="py-20 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span 
              className="px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase"
              style={{ 
                backgroundColor: theme.accentColor + '20', 
                color: theme.accentColor,
                border: `2px solid ${theme.accentColor}`
              }}
            >
              Video
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: theme.textColor }}
          >
            Momen Spesial
          </h2>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="relative aspect-video rounded-2xl overflow-hidden border-2 border-opacity-30 shadow-2xl"
            style={{ borderColor: theme.accentColor }}
          >
            {!isPlaying ? (
              /* Video Thumbnail with Play Button */
              <div 
                className="relative w-full h-full bg-black cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                {/* Thumbnail */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${thumbnailUrl}), url(${defaultBgImage1})`
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: theme.accentColor + '90' }}
                  >
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Video Icon Badge */}
                <div className="absolute top-4 left-4">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                  >
                    <Video className="w-4 h-4" style={{ color: theme.accentColor }} />
                    <span className="text-sm font-semibold text-white">
                      Video
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* YouTube Iframe */
              <iframe
                src={embedUrl}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </motion.div>

        {/* Video Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p 
            className="text-lg opacity-80 max-w-2xl mx-auto"
            style={{ color: theme.mutedText }}
          >
            Saksikan momen berharga dalam video spesial ini
          </p>
        </motion.div>
      </div>
    </section>
  );
}