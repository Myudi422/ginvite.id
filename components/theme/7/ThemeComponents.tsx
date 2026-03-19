import { ReactNode } from 'react';

interface ThemeContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string; // Add className prop for more flexibility
}

export default function ThemeContainer({ children, maxWidth = '420px', className = '' }: ThemeContainerProps) {
  return (
    <div
      className={`mx-auto relative min-h-screen shadow-2xl overflow-hidden bg-[var(--t7-bg-main)] ${className}`}
      style={{
        maxWidth,
        color: 'var(--t7-text-secondary, #555555)'
      }}
    >
      {/* 
        The background of the 'body' will be handled outside or implicitly default to a grey/pattern on desktop.
        Here we define the actual mobile "frame". 
      */}
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
      className={`${sizeClasses[size]} ${alignClasses[align]} font-bold tracking-wide leading-tight ${className}`}
      style={{
        color: 'var(--t7-text-primary, #4A719C)',
        fontFamily: 'var(--t7-font-heading)',
        ...style
      }}
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

export function ThemeText({ children, variant = 'body', color, align = 'center', className = '' }: ThemeTextProps) {
  const variantClasses = {
    body: 'text-sm leading-relaxed font-light',
    caption: 'text-xs leading-relaxed uppercase tracking-wider',
    meta: 'text-xs italic',
    quote: 'text-lg font-serif italic leading-relaxed'
  };

  const colorThemeMap: Record<string, string> = {
    white: 'var(--t7-text-white, #FFFFFF)',
    gray: 'var(--t7-text-secondary, #555555)',
    gold: 'var(--t7-text-accent, #F9EFCB)',
    black: 'var(--t7-text-primary, #4A719C)'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <p
      className={`${variantClasses[variant]} ${alignClasses[align]} ${className}`}
      style={color ? { color: colorThemeMap[color] } : undefined}
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
          background: 'var(--t7-grad-button, #4A719C)',
          color: 'var(--t7-text-white, #ffffff)',
          border: 'none',
          boxShadow: '0 4px 15px rgba(74, 113, 156, 0.3)'
        };
      case 'outline':
        return {
          border: '1px solid var(--t7-border-glass, #4A719C)',
          color: 'var(--t7-text-primary, #4A719C)',
          background: 'transparent'
        };
      case 'ghost':
        return {
          color: 'var(--t7-text-primary, #4A719C)',
          background: 'transparent'
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
