import { ReactNode } from 'react';

interface ThemeContainerProps {
  children: ReactNode;
  maxWidth?: string;
  className?: string; // Add className prop for more flexibility
}

export default function ThemeContainer({ children, maxWidth = '480px', className = '' }: ThemeContainerProps) {
  return (
    <div
      className={`bg-zinc-950 text-white mx-auto relative min-h-screen shadow-2xl ${className}`}
      style={{
        maxWidth,
        overflow: 'visible'
      }}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function ThemeSection({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-8 px-6 space-y-6 ${className}`}>
      {children}
    </section>
  );
}

interface ThemeHeaderProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function ThemeHeader({ children, size = 'xl', className = '', align = 'center' }: ThemeHeaderProps) {
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
    <h2 className={`${sizeClasses[size]} ${alignClasses[align]} font-serif font-bold text-amber-100 tracking-wide leading-tight ${className}`}>
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

  const colorClasses = {
    white: 'text-zinc-100',
    gray: 'text-zinc-400',
    gold: 'text-amber-200',
    black: 'text-zinc-900'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <p className={`${variantClasses[variant]} ${colorClasses[color]} ${alignClasses[align]} ${className}`}>
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
    primary: 'bg-gradient-to-r from-amber-200 to-amber-400 text-zinc-900 hover:shadow-lg hover:shadow-amber-500/20 border border-amber-300',
    outline: 'border border-amber-200/30 text-amber-100 hover:bg-amber-900/20 backdrop-blur-sm',
    ghost: 'text-amber-200 hover:text-amber-100'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
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
  const variantClasses = {
    primary: 'bg-amber-600 text-white',
    secondary: 'bg-zinc-800 text-zinc-300',
    outline: 'border border-amber-500/50 text-amber-200'
  };

  return (
    <span className={`py-1 px-3 rounded-full text-[10px] uppercase tracking-wider font-medium inline-block ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}