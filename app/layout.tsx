import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script';
import { GoogleOAuthProvider } from "@react-oauth/google"

export const metadata: Metadata = {
  title: 'Undangan Digital Khitanan - Rafa & FAIZAN',
  description: 'Undangan Digital Khitanan & Aqiqah',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Snap JS */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-Hq-oZXhBhWzOSZzD"
          strategy="beforeInteractive"
        />
      </head>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <body>{children}</body>
      </GoogleOAuthProvider>
    </html>
  )
}
