// components/loading/WeddingLoading.tsx
import React from 'react';

const WeddingLoading = () => {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-accent border-l-transparent animate-spin duration-75 delay-150" />
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-secondary border-b-transparent animate-spin duration-100 delay-300" />
    </div>
  );
};

export default WeddingLoading;