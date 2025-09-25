"use client";

import React, { useEffect, useRef, useState } from 'react';

interface LazyHydrateProps {
  children: React.ReactNode;
  rootMargin?: string;
}

export default function LazyHydrate({ children, rootMargin = '200px' }: LazyHydrateProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMounted(true);
            io.disconnect();
          }
        });
      },
      { root: null, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  return <div ref={ref}>{mounted ? children : null}</div>;
}
