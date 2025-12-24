import Image from 'next/image';
import { ReactNode } from 'react';

interface NetflixStyleImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
  children?: ReactNode;
}

export default function NetflixStyleImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'video',
  children 
}: NetflixStyleImageProps) {
  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video', 
    portrait: 'aspect-[3/4]'
  };

  return (
    <div className={`relative ${aspectClass[aspectRatio]} ${className} overflow-hidden rounded`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 400px"
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}