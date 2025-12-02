import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Undangan Digital Pernikahan - Undangan Online Elegan | Papunda',
  description: 'Buat undangan digital pernikahan yang cantik dan modern. Undangan online untuk resepsi pernikahan dengan tema elegan. Gratis dan mudah digunakan.',
  keywords: 'undangan digital pernikahan, undangan online pernikahan, undangan resepsi pernikahan, buat undangan pernikahan digital',
  openGraph: {
    title: 'Undangan Digital Pernikahan - Papunda',
    description: 'Undangan digital pernikahan yang elegan dan praktis untuk acara spesial Anda.',
    url: 'https://papunda.com/undangan-digital-pernikahan',
    siteName: 'Papunda',
    type: 'website',
  },
};

export default function Page() {
  redirect('/undangan-pernikahan');
}