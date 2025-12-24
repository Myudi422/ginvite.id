import { ReactNode } from 'react';

interface NetflixContainerProps {
  children: ReactNode;
  maxWidth?: string;
}

export default function NetflixContainer({ children, maxWidth = '400px' }: NetflixContainerProps) {
  return (
    <div 
      className="bg-black text-white mx-auto relative"
      style={{ 
        maxWidth, 
        minHeight: '100vh',
        overflow: 'visible' // Ensure content can scroll naturally
      }}
    >
      <div className="relative w-full">
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

export function NetflixSection({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`space-y-4 ${className}`}>
      {children}
    </section>
  );
}

interface NetflixHeaderProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function NetflixHeader({ children, size = 'lg', className = '' }: NetflixHeaderProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg',
    xl: 'text-2xl'
  };

  return (
    <h2 className={`${sizeClasses[size]} font-bold text-white leading-tight ${className}`}>
      {children}
    </h2>
  );
}

interface NetflixTextProps {
  children: ReactNode;
  variant?: 'body' | 'caption' | 'meta';
  color?: 'white' | 'gray' | 'green' | 'red';
}

export function NetflixText({ children, variant = 'body', color = 'white' }: NetflixTextProps) {
  const variantClasses = {
    body: 'text-sm leading-relaxed',
    caption: 'text-xs leading-relaxed', 
    meta: 'text-sm'
  };

  const colorClasses = {
    white: 'text-white',
    gray: 'text-gray-400',
    green: 'text-green-500',
    red: 'text-red-600'
  };

  return (
    <p className={`${variantClasses[variant]} ${colorClasses[color]}`}>
      {children}
    </p>
  );
}

interface NetflixBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function NetflixBadge({ children, variant = 'secondary' }: NetflixBadgeProps) {
  const variantClasses = {
    primary: 'bg-red-600 text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-black'
  };

  return (
    <span className={`py-1 px-2 rounded text-xs font-bold inline-block ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}