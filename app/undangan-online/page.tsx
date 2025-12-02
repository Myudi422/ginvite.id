import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Undangan Online - Undangan Digital Modern | Papunda',
  description: 'Undangan online modern untuk semua acara. Buat undangan digital gratis dan bagikan dengan mudah. Undangan pernikahan, khitanan, ulang tahun.',
  keywords: 'undangan online, undangan digital modern, undangan online gratis, undangan digital acara',
  openGraph: {
    title: 'Undangan Online - Papunda',
    description: 'Undangan online yang praktis dan elegan untuk acara Anda.',
    url: 'https://papunda.com/undangan-online',
    siteName: 'Papunda',
    type: 'website',
  },
};

export default function Page() {
  redirect('/');
}