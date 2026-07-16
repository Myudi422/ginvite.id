// app/page.tsx - Server Component dengan SEO fokus Undangan Digital
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Papunda | Buat Undangan Digital Gratis — Pernikahan, Khitanan, Ulang Tahun',
  description: 'Buat undangan digital premium untuk pernikahan, khitanan, ulang tahun & berbagai acara lainnya. Uji coba GRATIS, ratusan tema cantik, RSVP online, buku tamu digital. Dibantu admin sampai selesai!',
  keywords: [
    'papunda',
    'papunda undangan digital',
    'buat undangan digital gratis',
    'undangan digital pernikahan',
    'undangan digital khitanan',
    'undangan digital ulang tahun',
    'undangan digital aqiqah',
    'undangan pernikahan online',
    'undangan online gratis',
    'undangan digital premium',
    'undangan website pernikahan',
    'undangan digital indonesia',
    'buat undangan online',
    'platform undangan digital',
    'undangan digital rsvp',
    'undangan digital murah',
    'tema undangan pernikahan',
    'undangan digital cantik',
    'kirim undangan via whatsapp',
    'undangan digital gratis indonesia',
  ],
  alternates: {
    canonical: 'https://papunda.com',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://papunda.com',
    title: 'Papunda | Buat Undangan Digital Gratis — Premium & Elegan',
    description: 'Buat undangan digital pernikahan, khitanan & ulang tahun yang elegan. Uji coba gratis, ratusan tema premium, RSVP online, nama tamu otomatis. Dibantu admin Papunda!',
    siteName: 'Papunda',
    images: [
      {
        url: 'https://papunda.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Papunda – Platform Undangan Digital Gratis untuk Pernikahan, Khitanan & Ulang Tahun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papunda | Buat Undangan Digital Gratis — Pernikahan, Khitanan, Ulang Tahun',
    description: 'Undangan digital premium, uji coba GRATIS, ratusan tema cantik, RSVP online. Dibantu admin Papunda sampai selesai!',
    images: ['https://papunda.com/og-image.png'],
  },
};

export default function Home() {
  return <HomeClient />;
}