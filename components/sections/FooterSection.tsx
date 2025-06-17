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
            <p className="text-sm text-slate-600 mt-4 text-center sm:text-left max-w-xs">
              Papunda hadir sebagai solusi cerdas dan praktis untuk membuat undangan online. Dengan antarmuka yang mudah digunakan, Anda dapat merancang undangan yang cantik dan profesional untuk berbagai acara spesial Anda dalam hitungan menit. Lupakan kerumitan, sambut kemudahan bersama Papunda!
            </p>
          </div>

          {/* Metode Pembayaran */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Metode Pembayaran</h3>
            <Image src="/payment.svg" alt="Metode Pembayaran" width={240} height={60} className="object-contain" />
          </div>

          {/* Kontak Admin */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Kontak Admin</h3>
          <p className="text-slate-700 mb-1">
            Telp: <a href="https://wa.me/6289654728249" className="underline hover:text-slate-900">+62 896-5472-8249</a>
          </p>
          <p className="text-slate-700">
            Email: <a href="mailto:papundacare@gmail.com" className="underline hover:text-slate-900">papundacare@gmail.com</a>
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
