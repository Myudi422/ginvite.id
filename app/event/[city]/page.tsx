import { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { partnersData } from "@/lib/partner-data";
import { Button } from "@/components/ui/button";
import CityClient from "./CityClient";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const partner = partnersData[city.toLowerCase()];

  if (!partner) {
    return {
      title: "Layanan Tidak Ditemukan | Event Papunda",
      description: "Layanan Event Papunda belum tersedia untuk kota ini."
    };
  }

  return {
    title: `Layanan Event Papunda ${partner.cityName} - Rencana Pernikahan Terpadu`,
    description: `Dapatkan paket pernikahan terbaik dari Event Papunda ${partner.cityName}. Mulai dari WO, katering, dekorasi, hingga undangan digital.`,
    alternates: {
      canonical: `https://papunda.com/event/${city.toLowerCase()}`
    }
  };
}

export default async function CityPartnerPage({ params }: PageProps) {
  const { city } = await params;
  const partner = partnersData[city.toLowerCase()];

  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-pink-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-pink-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Layanan Belum Tersedia</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Saat ini kami belum melayani area <strong>&ldquo;{city}&rdquo;</strong>. Tim kami sedang mengurasi opsi terbaik untuk segera hadir di sana.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/event">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full py-3 font-semibold text-sm">
                Kembali ke Pilih Kota
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CityClient partner={partner} />;
}
