"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function FooterSection() {
  return (
    <footer className="bg-white border-t">
      <Card className="rounded-none shadow-none bg-white">
        <CardContent className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-4 gap-8 py-8">
          {/* Logo & About */}
          <div className="flex flex-col items-center sm:items-start">
            <Image src="/logo.svg" alt="Papunda - Undangan Digital Online" width={120} height={40} />
            <p className="text-sm text-slate-600 mt-4 text-center sm:text-left max-w-xs">
              Papunda adalah platform terdepan untuk membuat undangan digital pernikahan, khitanan, dan ulang tahun. Buat undangan online gratis dengan desain elegan dalam 5 menit!
            </p>
          </div>

          {/* Layanan */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Layanan Kami</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/undangan-pernikahan" className="hover:text-pink-600 transition-colors">Undangan Pernikahan Digital</a></li>
              <li><a href="/undangan-khitanan" className="hover:text-blue-600 transition-colors">Undangan Khitanan Online</a></li>
              <li><a href="/undangan-ulang-tahun" className="hover:text-purple-600 transition-colors">Undangan Ulang Tahun Digital</a></li>
              <li><a href="/admin" className="hover:text-green-600 transition-colors">Buat Undangan Gratis</a></li>
            </ul>
          </div>

          {/* Metode Pembayaran */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Metode Pembayaran</h3>
            <Image src="/payment.svg" alt="Metode Pembayaran BCA, Mandiri, BRI, BNI" width={240} height={60} className="object-contain" />
          </div>

          {/* Kontak Admin */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Hubungi Kami</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">
              <span className="font-medium">WhatsApp:</span> <a href="https://wa.me/6289654728249" className="text-green-600 hover:text-green-800 transition-colors">+62 896-5472-8249</a>
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Email:</span> <a href="mailto:papundacare@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">papundacare@gmail.com</a>
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Website:</span> <a href="https://papunda.com" className="text-pink-600 hover:text-pink-800 transition-colors">papunda.com</a>
            </p>
          </div>
        </div>
        </CardContent>
        <Separator />
        <div className="text-center text-sm text-slate-500 py-4">
          Copyright © 2025 PT Digital Inter Nusa. All Rights Reserved
        </div>
      </Card>
    </footer>
  );
}
