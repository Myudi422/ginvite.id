// components/WhatsAppButton.tsx
'use client'; // This directive makes it a Client Component

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WhatsAppButton() {

  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/undang') || pathname === '/login' || pathname.startsWith('/admin/')) {
      setVisible(false);
      return;
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, lastScrollY]);

  if (!visible) return null;

  return (
    <a
      href="https://wa.me/6289654728249"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        background: '#25D366',
        color: '#fff',
        borderRadius: '999px',
        padding: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '16px',
        gap: '0px',
        transition: 'box-shadow 0.2s, opacity 0.4s',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        width: '48px',
        minWidth: '48px',
        justifyContent: 'center',
      }}
      aria-label="WhatsApp"
    >
      <img
        src="/wa.svg"
        alt="WhatsApp"
        width={28}
        height={28}
        style={{ display: 'block' }}
      />
    </a>
  );
}