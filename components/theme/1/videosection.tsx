import React, { useState } from 'react';
import Image from 'next/image';
import ReactPlayer from 'react-player/youtube';

interface VideoSectionProps {
  youtubeLink?: string;
  defaultBgImage1?: string;
  horizontalPadding?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  youtubeLink,
  defaultBgImage1,
  horizontalPadding = 'mx-auto max-w-3xl',
}) => {
  const [hasError, setHasError] = useState(false);

  if (!youtubeLink || hasError) {
    return (
      <section
        id="video"
        className="w-full bg-black overflow-hidden relative"
        style={{ minHeight: '300px' }}
      >
        {defaultBgImage1 && (
          <Image
            src={defaultBgImage1}
            alt="Background Video"
            layout="fill"
            objectFit="cover"
          />
        )}
      </section>
    );
  }

  const isValidYouTubeLink = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  if (!isValidYouTubeLink(youtubeLink)) {
    return (
      <section id="video" className="w-full bg-black overflow-hidden relative" style={{ minHeight: '300px' }}>
        {defaultBgImage1 && (
          <Image
            src="/1.jpg"
            alt="Background Video Error"
            layout="fill"
            objectFit="cover"
          />
        )}
      </section>
    );
  }

  return (
    <section id="video" className="w-full bg-black overflow-hidden py-8">
      <div className={`${horizontalPadding} overflow-hidden`}>
        <div className="relative aspect-video w-full">
          <ReactPlayer
            url={youtubeLink}
            width="100%"
            height="100%"
            controls={true}
            muted={true}
            playing={false}
            loop={false}
            onError={() => setHasError(true)}
            fallback={
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                Error loading video
              </div>
            }
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;