// components/WhatsAppButton.tsx
'use client'; // This directive makes it a Client Component

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WhatsAppButton() {

  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/undang') || pathname === '/login') {
      setVisible(false);
      return;
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setVisible(true);
        if (currentScrollY > lastScrollY) {
          setMinimized(false); // show full when scrolling down
        } else {
          setMinimized(true); // minimize when scrolling up
        }
      } else {
        setVisible(false);
        setMinimized(false);
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
        padding: minimized ? '10px' : '10px 18px 10px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '16px',
        gap: minimized ? '0px' : '10px',
        transition: 'box-shadow 0.2s, opacity 0.4s, padding 0.3s, gap 0.3s',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        width: minimized ? '48px' : 'auto',
        minWidth: minimized ? '48px' : 'unset',
        justifyContent: 'center',
      }}
      aria-label="Butuh Bantuan via WhatsApp"
    >
      <img
        src="/wa.svg"
        alt="WhatsApp"
        width={28}
        height={28}
        style={{ display: 'block' }}
      />
      {!minimized && (
        <span style={{ fontWeight: 600, letterSpacing: 0.2, transition: 'opacity 0.3s' }}>Butuh Bantuan?</span>
      )}
    </a>
  );
}