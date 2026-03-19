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
  description: 'Papunda adalah platform pembuat undangan digital pernikahan, khitanan, dan ulang tahun secara gratis. Uji coba gratis, admin bantu sampai beres, bayar nanti kalau sudah jadi!',
  keywords: [
    'papunda',
    'papunda.com',
    'papunda undangan digital',
    'undangan digital gratis',
    'undangan digital pernikahan gratis',
    'undangan khitanan digital gratis',
    'undangan nikah digital gratis',
    'undangan aqiqah digital gratis',
    'undangan ulang tahun digital gratis',
    'buat undangan digital gratis',
    'undangan online gratis',
    'digital invitation indonesia',
  ],
  authors: [
    { name: 'Papunda', url: 'https://papunda.com' },
  ],
  creator: 'Papunda',
  publisher: 'Papunda',
  metadataBase: new URL('https://papunda.com'),
  alternates: {
    canonical: 'https://papunda.com',
  },
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
        alt: 'Papunda – Buat Undangan Digital Gratis untuk Pernikahan, Khitanan & Ulang Tahun',
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

        {/* Chunk Loading Error Handler */}
        <Script id="chunk-error-handler" strategy="beforeInteractive">
          {`
            window.addEventListener('error', function(e) {
              if (e.message && e.message.includes('Loading chunk')) {
                console.warn('Chunk loading failed, will retry once:', e.message);
                // Don't auto-reload immediately, let the error boundary handle it
              }
            });

            // Register service worker for cache management
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>

        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1587740600496860"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* Ganti Facebook Pixel dengan komponen baru */}
        {/* Google Ads Conversion Event Snippet hanya di halaman / */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>

        {/* JSON-LD Structured Data: Organization + WebSite */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://papunda.com/#organization',
                name: 'Papunda',
                url: 'https://papunda.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://papunda.com/logo.svg',
                  width: 200,
                  height: 60,
                },
                description: 'Platform pembuat undangan digital gratis untuk pernikahan, khitanan, dan ulang tahun di Indonesia. Buat undangan online dengan mudah dan gratis bersama Papunda.',
                foundingDate: '2023',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Ciampea',
                  addressRegion: 'Jawa Barat',
                  addressCountry: 'ID',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+62-896-5472-8249',
                  contactType: 'customer service',
                  availableLanguage: 'Indonesian',
                },
                sameAs: [
                  'https://www.instagram.com/papunda.id',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': 'https://papunda.com/#website',
                url: 'https://papunda.com',
                name: 'Papunda',
                description: 'Buat undangan digital gratis untuk pernikahan, khitanan, dan ulang tahun',
                publisher: {
                  '@id': 'https://papunda.com/#organization',
                },
                inLanguage: 'id-ID',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://papunda.com/katalog?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
          strategy="beforeInteractive"
        />

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