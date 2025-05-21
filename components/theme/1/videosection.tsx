import React from 'react';
import ReactPlayer from 'react-player';
import Image from 'next/image';

interface VideoSectionProps {
  youtubeLink?: string;
  defaultBgImage1?: string;
  horizontalPadding?: string; // Properti untuk mengatur jarak kiri dan kanan
}

const VideoSection: React.FC<VideoSectionProps> = ({
  youtubeLink,
  defaultBgImage1,
  horizontalPadding = 'mx-auto max-w-3xl', // Contoh padding menggunakan max-width
}) => {
  if (!youtubeLink) {
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
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg italic">
          Video tidak tersedia
        </div>
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
        {/* Anda bisa menghilangkan atau mengganti pesan ini jika tidak diperlukan */}
        {/* <div className="absolute inset-0 flex items-center justify-center text-white text-lg italic">
          Tautan YouTube tidak valid
        </div> */}
      </section>
    );
  }

  return (
    <section id="video" className="w-full bg-black overflow-hidden py-8"> {/* Tambahkan sedikit padding atas dan bawah */}
      <div className={`${horizontalPadding} overflow-hidden`}>
        <div className="relative aspect-video w-full">
          <ReactPlayer
            url={youtubeLink}
            width="100%"
            height="100%"
            controls={true}
            muted={true} // Aktifkan auto-mute
            playing={false}
            loop={false}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;