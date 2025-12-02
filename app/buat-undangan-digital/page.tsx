import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Buat Undangan Digital - Platform Undangan Online Terbaik | Papunda',
  description: 'Buat undangan digital dengan mudah di Papunda. Undangan online untuk pernikahan, khitanan, ulang tahun. Gratis, cepat, dan elegan.',
  keywords: 'buat undangan digital, platform undangan online, undangan digital terbaik, buat undangan gratis',
  openGraph: {
    title: 'Buat Undangan Digital - Papunda',
    description: 'Platform terbaik untuk membuat undangan digital online dengan desain cantik.',
    url: 'https://papunda.com/buat-undangan-digital',
    siteName: 'Papunda',
    type: 'website',
  },
};

export default function Page() {
  redirect('/');
}