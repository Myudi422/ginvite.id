import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ThemeSection, ThemeHeader } from './ThemeComponents';

const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });

interface VideoSectionProps {
    youtubeLink?: string;
    defaultBgImage1?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ youtubeLink, defaultBgImage1 }) => {
    const [hasError, setHasError] = useState(false);
    const [play, setPlay] = useState(false);

    if (!youtubeLink || hasError) {
        return null;
    }

    const isValidYouTubeLink = (url: string): boolean => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/;
        return youtubeRegex.test(url);
    };

    if (!isValidYouTubeLink(youtubeLink)) {
        return null;
    }

    const getYoutubeThumbnail = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    };

    const thumbnail = getYoutubeThumbnail(youtubeLink) || defaultBgImage1;

    return (
        <ThemeSection id="video">
            <ThemeHeader size="lg" className="mb-8 text-center uppercase tracking-widest text-[var(--t5-text-primary)]">
                Momen Spesial
            </ThemeHeader>

            <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-white/10 bg-black relative aspect-video group">
                {!play ? (
                    <button
                        className="w-full h-full flex items-center justify-center bg-zinc-900 absolute inset-0 z-10"
                        onClick={() => setPlay(true)}
                        aria-label="Play video"
                    >
                        {thumbnail ? (
                            <div className="absolute inset-0">
                                <Image unoptimized={process.env.NEXT_PUBLIC_UNOPTIMIZE_IMAGES === 'true'} src={thumbnail} alt="video preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-zinc-800" />
                        )}

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center flex-col gap-1 text-white group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                                <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ) : (
                    <ReactPlayer
                        url={youtubeLink}
                        width="100%"
                        height="100%"
                        controls={true}
                        muted={false}
                        playing={true}
                        loop={false}
                        onError={() => setHasError(true)}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                )}
            </div>
        </ThemeSection>
    );
};

export default VideoSection;
