//app\layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import { GoogleOAuthProvider } from '@react-oauth/google'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        {/* Midtrans Snap JS */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        {/* Google Analytics (optional) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_TRACKING_ID"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_GA_TRACKING_ID', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <body>{children}</body>
      </GoogleOAuthProvider>
    </html>
  )
}