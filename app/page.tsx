// app/page.tsx - Server Component with homepage-specific metadata
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Papunda | Buat Undangan Digital Gratis – Pernikahan, Khitanan & Ulang Tahun',
  description: 'Papunda adalah platform undangan digital gratis #1 di Indonesia. Buat undangan pernikahan, khitanan, dan ulang tahun online dalam 5 menit. Uji coba gratis, admin siap bantu!',
  keywords: [
    'papunda',
    'papunda.com',
    'undangan digital gratis',
    'buat undangan digital',
    'undangan pernikahan digital',
    'undangan online gratis',
    'undangan digital pernikahan gratis',
    'undangan digital khitanan gratis',
    'undangan digital ulang tahun gratis',
    'platform undangan digital indonesia',
  ],
  alternates: {
    canonical: 'https://papunda.com',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://papunda.com',
    title: 'Papunda | Buat Undangan Digital Gratis',
    description: 'Platform undangan digital gratis #1 di Indonesia. Buat undangan online untuk pernikahan, khitanan, dan ulang tahun dalam 5 menit. Admin siap bantu hingga selesai!',
    siteName: 'Papunda',
    images: [
      {
        url: 'https://papunda.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Papunda – Buat Undangan Digital Gratis untuk Pernikahan, Khitanan & Ulang Tahun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papunda | Buat Undangan Digital Gratis',
    description: 'Platform undangan digital gratis #1 di Indonesia. Coba gratis sekarang!',
    images: ['https://papunda.com/og-image.png'],
  },
};

export default function Home() {
  return <HomeClient />;
}