"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FooterSection() {
  return (
    <footer className="bg-white border-t">
      <Card className="rounded-none shadow-none bg-white">
        <CardContent className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 py-8">
          {/* Logo */}
          <div className="flex flex-col items-center sm:items-start">
            <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} />
          </div>

          {/* Metode Pembayaran */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Metode Pembayaran</h3>
            <div className="flex items-center space-x-4">
              <Image src="/icons/visa.png" alt="Visa" width={40} height={24} />
              <Image src="/icons/mastercard.png" alt="Mastercard" width={40} height={24} />
              <Image src="/icons/amex.png" alt="American Express" width={40} height={24} />
              <Image src="/icons/paypal.png" alt="PayPal" width={40} height={24} />
            </div>
          </div>

          {/* Kontak Admin */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Kontak Admin</h3>
            <p className="text-slate-700 mb-1">
              Telp: <a href="tel:+628123456789" className="underline hover:text-slate-900">+62 812-3456-789</a>
            </p>
            <p className="text-slate-700">
              Email: <a href="mailto:admin@papunda.id" className="underline hover:text-slate-900">admin@papunda.id</a>
            </p>
          </div>
        </CardContent>
        <Separator />
        <div className="text-center text-sm text-slate-500 py-4">
          Copyright © 2025 PT Digital Inter Nusa. All Right Reserved
        </div>
      </Card>
    </footer>
  );
}
