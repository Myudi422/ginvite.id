import { ReactNode } from 'react';

interface ThemeContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string; // Add className prop for more flexibility
}

export default function ThemeContainer({ children, maxWidth = '480px', className = '' }: ThemeContainerProps) {
  return (
    <div
      className={`text-white mx-auto relative min-h-screen shadow-2xl ${className}`}
      style={{
        maxWidth,
        overflow: 'visible',
        backgroundColor: 'var(--t4-bg-main, #09090b)'
      }}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function ThemeSection({ children, className = '', id, style }: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`py-8 px-6 space-y-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}

interface ThemeHeaderProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

export function ThemeHeader({ children, size = 'xl', className = '', align = 'center', style }: ThemeHeaderProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
    '2xl': 'text-3xl md:text-4xl'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <h2
      className={`${sizeClasses[size]} ${alignClasses[align]} font-serif font-bold tracking-wide leading-tight ${className}`}
      style={{ color: 'var(--t4-text-primary, #fef3c7)', ...style }}
    >
      {children}
    </h2>
  );
}

interface ThemeTextProps {
  children: ReactNode;
  variant?: 'body' | 'caption' | 'meta' | 'quote';
  color?: 'white' | 'gray' | 'gold' | 'black';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function ThemeText({ children, variant = 'body', color = 'white', align = 'center', className = '' }: ThemeTextProps) {
  const variantClasses = {
    body: 'text-sm leading-relaxed font-light',
    caption: 'text-xs leading-relaxed uppercase tracking-wider',
    meta: 'text-xs italic',
    quote: 'text-lg font-serif italic leading-relaxed'
  };

  const colorThemeMap = {
    white: 'var(--t4-text-white, #f4f4f5)', // zinc-100
    gray: 'var(--t4-text-secondary, #a1a1aa)', // zinc-400
    gold: 'var(--t4-text-accent, #fde68a)', // amber-200
    black: 'var(--t4-text-black, #18181b)' // zinc-900
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <p
      className={`${variantClasses[variant]} ${alignClasses[align]} ${className}`}
      style={{ color: colorThemeMap[color] }}
    >
      {children}
    </p>
  );
}

interface ThemeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  disabled?: boolean;
}

export function ThemeButton({ children, onClick, variant = 'primary', className = '', disabled }: ThemeButtonProps) {
  const baseClasses = "py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest";

  const variantClasses = {
    primary: 'text-zinc-900 hover:shadow-lg border',
    outline: 'border backdrop-blur-sm hover:bg-black/20',
    ghost: 'hover:opacity-80'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--t4-grad-button, linear-gradient(to right, #fde68a, #fbbf24))',
          borderColor: 'var(--t4-border-button, #fcd34d)',
          boxShadow: '0 0 15px var(--t4-shadow-button, rgba(245, 158, 11, 0.2))'
        };
      case 'outline':
        return {
          borderColor: 'var(--t4-border-glass, rgba(253, 230, 138, 0.3))',
          color: 'var(--t4-text-primary, #fef3c7)'
        };
      case 'ghost':
        return {
          color: 'var(--t4-text-accent, #fde68a)'
        };
      default:
        return {};
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={getVariantStyles()}
    >
      {children}
    </button>
  );
}

interface ThemeBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function ThemeBadge({ children, variant = 'secondary' }: ThemeBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--t4-text-accent, #d97706)',
          color: 'var(--t4-bg-main, #ffffff)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--t4-border-glass, #27272a)',
          color: 'var(--t4-text-primary, #d4d4d8)'
        };
      case 'outline':
        return {
          border: '1px solid var(--t4-border-glass, rgba(245, 158, 11, 0.5))',
          color: 'var(--t4-text-accent, #fde68a)'
        };
      default:
        return {};
    }
  };

  return (
    <span
      className={`py-1 px-3 rounded-full text-[10px] uppercase tracking-wider font-medium inline-block`}
      style={getVariantStyles()}
    >
      {children}
    </span>
  );
}