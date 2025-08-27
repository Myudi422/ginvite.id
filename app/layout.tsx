// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ConversionScript from '../components/ConversionScript';
import FacebookPixel from '../components/FacebookPixel';
import WhatsAppButton from './wa'; // Import the new component

// Google Tag Manager and Facebook Pixel Configuration
const GTM_ID = 'GTM-TBLT72Q4'; // Updated GTM ID

export const metadata: Metadata = {
  title: 'Papunda | Buat Undangan Digital Gratis',
  description: 'Papunda adalah platform pembuat undangan digital gratis. Uji coba gratis, admin bantu sampai beres, bayar nanti kalau sudah jadi!',
  keywords: [
    'undangan digital gratis',
    'undangan khitanan digital gratis',
    'undangan nikah digital gratis',
    'undangan aqiqah digital gratis',
    'digital invitation',
    'gratis',
    'Papunda undangan gratis',
  ],
  authors: [
    { name: 'Papunda', url: 'https://papunda.com' },
  ],
  creator: 'Papunda',
  publisher: 'Papunda',
  metadataBase: new URL('https://papunda.com'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://papunda.com',
    title: 'Papunda | Buat Undangan Digital Gratis',
    description: 'Papunda: platform undangan digital gratis dengan dukungan admin hingga selesai—bayar setelah jadi dan puas!',
    siteName: 'Papunda',
    images: [
      {
        url: 'https://papunda.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Papunda – Undangan Digital Gratis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papunda | Buat Undangan Digital Gratis – Uji Coba Gratis',
    description: 'Papunda adalah platform pembuat undangan digital gratis. Uji coba gratis, admin bantu sampai beres!',
    site: '@PapundaID',
    creator: '@PapundaID',
    images: ['https://papunda.com/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Midtrans Snap JS */}
        <Script
          src="https://app.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        {/* Google tag (gtag.js) for Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-674897184"
          strategy="afterInteractive"
          async
        />
        <Script id="google-ads-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-674897184');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>

        {/* Quill.js CSS */}
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />

        {/* Ganti Facebook Pixel dengan komponen baru */}
        {/* Google Ads Conversion Event Snippet hanya di halaman / */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}/>
        </noscript>

        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
          {children}
        </GoogleOAuthProvider>
        <ConversionScript />
        <FacebookPixel />

        {/* Floating WhatsApp Button ala plugin */}
        <WhatsAppButton /> {/* Use the new WhatsAppButton component here */}
      </body>
    </html>
  );
}