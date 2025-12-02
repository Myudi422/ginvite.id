import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Undangan Digital Khitanan - Undangan Online Khitanan | Papunda',
  description: 'Buat undangan digital khitanan yang unik dan menarik. Undangan online untuk acara khitanan anak dengan desain khusus. Gratis dan cepat.',
  keywords: 'undangan digital khitanan, undangan online khitanan, undangan khitanan anak, buat undangan khitanan digital',
  openGraph: {
    title: 'Undangan Digital Khitanan - Papunda',
    description: 'Undangan digital khitanan yang kreatif untuk acara sunatan anak Anda.',
    url: 'https://papunda.com/undangan-digital-khitanan',
    siteName: 'Papunda',
    type: 'website',
  },
};

export default function Page() {
  redirect('/undangan-khitanan');
}