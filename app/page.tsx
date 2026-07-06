// app/page.tsx - Server Component with homepage-specific metadata
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Papunda | Partner Kreatif Event Organizer, MC, WCC & Undangan Digital Indonesia',
  description: 'Papunda adalah partner kreatif terpercaya untuk semua acara spesialmu. Layanan Event Organizer, Wedding & Ceremony, MC Ulang Tahun, Pentas Seni, Ice Breaking, Content Creator, dan Undangan Digital. Konsultasi gratis!',
  keywords: [
    'papunda',
    'papunda.com',
    'event organizer indonesia',
    'event organizer bogor',
    'mc ulang tahun',
    'pentas seni',
    'wedding organizer',
    'wcc wedding ceremony',
    'content creator family gathering',
    'ice breaking games',
    'undangan digital gratis',
    'buat undangan digital',
    'undangan pernikahan digital',
    'jasa event organizer murah',
    'partner kreatif acara',
  ],
  alternates: {
    canonical: 'https://papunda.com',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://papunda.com',
    title: 'Papunda | Partner Kreatif untuk Semua Acara Spesialmu',
    description: 'Event Organizer, MC, WCC, Pentas Seni, Ice Breaking, Content Creator & Undangan Digital. Satu tim kreatif untuk semua momenmu. Konsultasi gratis sekarang!',
    siteName: 'Papunda',
    images: [
      {
        url: 'https://papunda.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Papunda – Partner Kreatif Event Organizer & Undangan Digital Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papunda | Partner Kreatif untuk Semua Acara Spesialmu',
    description: 'Event Organizer, MC, WCC, Pentas Seni & Undangan Digital. Konsultasi gratis sekarang!',
    images: ['https://papunda.com/og-image.png'],
  },
};

export default function Home() {
  return <HomeClient />;
}