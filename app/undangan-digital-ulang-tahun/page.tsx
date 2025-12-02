import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Undangan Digital Ulang Tahun - Undangan Online Ulang Tahun | Papunda',
  description: 'Buat undangan digital ulang tahun yang fun dan kreatif. Undangan online untuk pesta ulang tahun dengan tema menarik. Gratis dan mudah.',
  keywords: 'undangan digital ulang tahun, undangan online ulang tahun, undangan pesta ulang tahun, buat undangan ulang tahun digital',
  openGraph: {
    title: 'Undangan Digital Ulang Tahun - Papunda',
    description: 'Undangan digital ulang tahun yang seru untuk pesta spesial Anda.',
    url: 'https://papunda.com/undangan-digital-ulang-tahun',
    siteName: 'Papunda',
    type: 'website',
  },
};

export default function Page() {
  redirect('/undangan-ulang-tahun');
}