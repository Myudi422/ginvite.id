// app/portofolio/page.tsx
import type { Metadata } from 'next';
import PortofolioClient from './PortofolioClient';

export const metadata: Metadata = {
  title: 'Portofolio Papunda | Event Organizer, Wedding, MC & Content Creator',
  description: 'Lihat portofolio lengkap Papunda — wedding, event organizer, pentas seni, family gathering, MC ulang tahun, dan ice breaking games. Momen berkesan yang telah kami wujudkan.',
  alternates: {
    canonical: 'https://papunda.com/portofolio',
  },
};

export default function PortofolioPage() {
  return <PortofolioClient />;
}
