'use client';

import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, TrashIcon, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function DataTamuPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };
  const slug = encodeURIComponent(title!);

  // Data dummy untuk tampilan UI
  const totalNominal = 5000000;

  return (
    <div className="min-h-screen bg-pink-50">
      {/* HEADER */}
      <div className="flex items-center bg-white shadow p-4">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-pink-700">
          Data Tamu – {decodeURIComponent(title)}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="rsvp" className="space-y-4">
          <TabsList className="flex space-x-2 bg-white shadow p-3 rounded">
            <TabsTrigger value="rsvp">Tamu RSVP</TabsTrigger>
            <TabsTrigger value="transfer">Tamu Transfer</TabsTrigger>
          </TabsList>

          {/* Tab Tamu RSVP */}
          <TabsContent value="rsvp">
            <div className="bg-white shadow rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-pink-700 mb-4">Daftar Tamu RSVP</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">No WA</th>
                    <th className="p-3 text-left">Ucapan</th>
                    <th className="p-3 text-left">Konfirmasi</th>
                    <th className="p-3 text-left">Upload Date</th>
                    <th className="p-3 text-left">Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">John Doe</td>
                    <td className="p-3">+62 812 3456 7890</td>
                    <td className="p-3">Selamat Menikah!</td>
                    <td className="p-3">✅</td>
                    <td className="p-3">2025-05-28</td>
                    <td className="p-3">
                      <Button variant="ghost">
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                  {/* Tambahkan baris RSVP lain sesuai kebutuhan */}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Tab Tamu Transfer */}
          <TabsContent value="transfer">
            <div className="bg-white shadow rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-pink-700">Daftar Tamu Transfer</h2>

              {/* Card Total Nominal */}
              <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Wallet className="h-8 w-8 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gift yang Didapatkan</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rp {totalNominal.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ini hanya perkiraan, karena belum valid.
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Nominal</th>
                    <th className="p-3 text-left">Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Jane Smith</td>
                    <td className="p-3">Rp 500.000</td>
                    <td className="p-3">
                      <Button variant="ghost">
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                  {/* Tambahkan baris transfer lain sesuai kebutuhan */}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}