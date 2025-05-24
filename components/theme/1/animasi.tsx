// utils/animations.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';

// Basic section slide-up + fade-in
export const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

// Staggered text fade-in + slide-from-left
export const textVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.6 },
  }),
};

// Utility: wrap any component with common motion props
export function wrapWithAnimation<T>(
  Component: React.ComponentType<T>,
  variant: Variants = sectionVariant
) {
  return function AnimatedComponent(props: T) {
    return (
      <motion.div
        variants={variant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Component {...props} />
      </motion.div>
    );
  };
}
