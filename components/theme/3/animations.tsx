"use client";

import React, { useEffect, useRef, useState } from "react";

// ─── useScrollReveal hook ────────────────────────────────────
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Animation class builders ────────────────────────────────

export function fadeUpClass(inView: boolean) {
  return [
    "transition-all duration-700 ease-out",
    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
  ].filter(Boolean).join(" ");
}

export function fadeInClass(inView: boolean) {
  return [
    "transition-opacity duration-700 ease-out",
    inView ? "opacity-100" : "opacity-0",
  ].filter(Boolean).join(" ");
}

export function slideLeftClass(inView: boolean) {
  return [
    "transition-all duration-700 ease-out",
    inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
  ].filter(Boolean).join(" ");
}

export function slideRightClass(inView: boolean) {
  return [
    "transition-all duration-700 ease-out",
    inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
  ].filter(Boolean).join(" ");
}

export function scaleUpClass(inView: boolean) {
  return [
    "transition-all duration-700 ease-out",
    inView ? "opacity-100 scale-100" : "opacity-0 scale-95",
  ].filter(Boolean).join(" ");
}

// ─── ScrollReveal wrapper component ─────────────────────────
interface ScrollRevealProps {
  children: React.ReactNode;
  animClass?: (inView: boolean) => string;
  className?: string;
  threshold?: number;
  delay?: number;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  animClass = fadeUpClass,
  className = "",
  threshold = 0.15,
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const { ref, inView } = useScrollReveal(threshold);
  return (
    <Tag
      ref={ref}
      className={`${animClass(inView)} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}