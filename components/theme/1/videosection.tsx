import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });

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

  // show a light preview (thumbnail) first to avoid loading iframe until user clicks
  const [play, setPlay] = useState(false);

  return (
    <section id="video" className="w-full bg-black overflow-hidden py-8">
      <div className={`${horizontalPadding} overflow-hidden`}>
        <div className="relative aspect-video w-full bg-black">
          {!play ? (
            <button
              className="w-full h-full flex items-center justify-center text-white bg-black"
              onClick={() => setPlay(true)}
              aria-label="Play video"
            >
              <div className="relative w-full h-full">
                {defaultBgImage1 ? (
                  <Image src={defaultBgImage1} alt="video preview" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">▶</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/60 p-4">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <ReactPlayer
              url={youtubeLink}
              width="100%"
              height="100%"
              controls={true}
              muted={true}
              playing={true}
              loop={false}
              onError={() => setHasError(true)}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;