// components/WhatsAppButton.tsx
'use client'; // This directive makes it a Client Component

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the button on /undang and /login paths
    if (pathname === '/undang' || pathname === '/login') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

  if (!isVisible) {
    return null; // Don't render the button
  }

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
        padding: '10px 18px 10px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '16px',
        gap: '10px',
        transition: 'box-shadow 0.2s',
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
      <span style={{ fontWeight: 600, letterSpacing: 0.2 }}>Butuh Bantuan?</span>
    </a>
  );
}