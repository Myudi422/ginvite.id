import React, { useState } from 'react';
import dynamic from 'next/dynamic';
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
        <ThemeSection id="video" className="py-20 relative overflow-hidden bg-white/50">
            <ThemeHeader size="lg" className="mb-12 text-center text-[var(--t7-text-primary)] relative z-10" style={{ fontFamily: 'var(--t7-font-heading)', fontSize: '3rem', textTransform: 'none' }}>
                Momen Spesial
            </ThemeHeader>

            <div className="w-[90%] sm:w-full max-w-2xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border-8 border-white bg-white relative aspect-video group">
                {!play ? (
                    <button
                        className="w-full h-full flex items-center justify-center bg-zinc-100 absolute inset-0 z-10 overflow-hidden rounded-[24px]"
                        onClick={() => setPlay(true)}
                        aria-label="Play video"
                    >
                        {thumbnail ? (
                            <img src={thumbnail} alt="video preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="absolute inset-0 bg-blue-50" />
                        )}

                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/90 shadow-lg flex items-center justify-center flex-col gap-1 text-[var(--t7-text-primary)] group-hover:scale-110 transition-all duration-300 pointer-events-none">
                                <svg className="w-8 h-8 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className="rounded-[24px] overflow-hidden w-full h-full bg-black">
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
                    </div>
                )}
            </div>
        </ThemeSection>
    );
};

export default VideoSection;
