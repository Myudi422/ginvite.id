import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Undangan Digital Gratis - Buat Undangan Online Tanpa Biaya | Papunda',
  description: 'Buat undangan digital gratis untuk pernikahan, khitanan, ulang tahun. Undangan online yang elegan dan mudah dibagikan. Coba gratis sekarang!',
  keywords: 'undangan digital gratis, undangan online gratis, buat undangan digital, undangan pernikahan gratis, undangan khitanan gratis',
  openGraph: {
    title: 'Undangan Digital Gratis - Papunda',
    description: 'Buat undangan digital gratis untuk acara spesial Anda. Undangan online yang cantik dan praktis.',
    url: 'https://papunda.com/undangan-digital-gratis',
    siteName: 'Papunda',
    type: 'website',
  },
};

export default function Page() {
  redirect('/');
}