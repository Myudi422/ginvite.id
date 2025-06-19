"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function ConversionScript() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <Script id="google-ads-conversion" strategy="afterInteractive">
      {`
        gtag('event', 'conversion', {
            'send_to': 'AW-674897184/BcVHCNOC-KkaEKC66MEC',
            'value': 1.0,
            'currency': 'IDR',
            'transaction_id': ''
        });
      `}
    </Script>
  );
}
