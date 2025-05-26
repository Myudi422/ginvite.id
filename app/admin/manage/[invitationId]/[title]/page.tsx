'use client';

import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Eye,
  ThumbsUp,
  User,
  Calendar,
  ClipboardList,
  QrCode,
  Wallet, // <- Tambahkan ini
} from 'lucide-react';

export default function ManagePage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };
  const slug = encodeURIComponent(title!);

  // SAMPLE COUNTS
  const seenCount = 139;
  const attendingCount = 23;
  const notAttendingCount = 12;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center bg-white shadow p-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-800">
          Manage Undangan – {decodeURIComponent(title!)}
        </h1>
      </div>
      

      <div className="p-6 space-y-6">

        {/* ESTIMASI UANG YANG DIKIRIM */}
<div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
  <div className="flex-shrink-0">
    <Wallet className="h-8 w-8 text-pink-600" />
  </div>
  <div>
    <p className="text-sm text-gray-600">Gift yang Didapatkan</p>
    <p className="text-2xl font-bold text-gray-800">Rp2.000.000</p>
    <p className="text-xs text-gray-500 mt-1">
      Ini hanya perkiraan, karena belum valid. harap cek di atm yang dipakai & di menu data tamu.
    </p>
  </div>
</div>

        {/* STATS */}
        <div className="relative overflow-hidden rounded-2xl h-40 bg-white shadow">
          <div className="absolute inset-0 bg-[url('/sample-bg.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 flex justify-around items-center h-full">
            <div className="text-center">
              <Eye className="mx-auto h-8 w-8 text-pink-600" />
              <p className="mt-2 text-sm text-gray-600">Dilihat</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {seenCount}
              </p>
            </div>
            <div className="text-center">
              <ThumbsUp className="mx-auto h-8 w-8 text-pink-600" />
              <p className="mt-2 text-sm text-gray-600">Bersedia</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {attendingCount}
              </p>
            </div>
            <div className="text-center">
              <User className="mx-auto h-8 w-8 text-pink-600" />
              <p className="mt-2 text-sm text-gray-600">Tidak Hadir</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">
                {notAttendingCount}
              </p>
            </div>
          </div>
        </div>

        {/* NOTICE */}
        <div className="flex items-center gap-3 bg-pink-50 border-l-4 border-pink-400 text-pink-800 p-4 rounded">
          <Calendar className="h-5 w-5" />
          <p>
            Untuk Mengaktifkan Plugin yang terkunci, silahkan ubah di formulir
            dan lakukan payment.
          </p>
        </div>

        {/* ACTION GRID */}
        <div className="grid grid-cols-2 gap-4">
          {/* Row 1 */}
          <button
            onClick={() =>
              router.push(`/admin/formulir/${invitationId}/${slug}`)
            }
            className="flex flex-col items-center justify-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700 transition"
          >
            <ClipboardList className="h-8 w-8 mb-2" />
            <span className="font-semibold">Edit Formulir</span>
          </button>

          <button
            onClick={() =>
              router.push(`/admin/manage/${invitationId}/${slug}/data-tamu`)
            }
            className="flex flex-col items-center justify-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700 transition"
          >
            <User className="h-8 w-8 mb-2" />
            <span className="font-semibold">Data Tamu</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Row 2 */}
          <button
            onClick={() =>
              router.push(`/admin/manage/${invitationId}/${slug}/data-tamu`)
            }
            className="flex flex-col items-center justify-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700 transition"
          >
            <Calendar className="h-8 w-8 mb-2" />
            <span className="font-semibold">Bulk Undangan</span>
          </button>

          <button
            onClick={() =>
              router.push(`/admin/manage/${invitationId}/${slug}/rundown`)
            }
            className="flex flex-col items-center justify-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700 transition"
          >
            <ClipboardList className="h-8 w-8 mb-2" />
            <span className="font-semibold">Rundown Generate</span>
          </button>

          <button
            onClick={() =>
              router.push(`/admin/manage/${invitationId}/${slug}/qr-code`)
            }
            className="flex flex-col items-center justify-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700 transition"
          >
            <QrCode className="h-8 w-8 mb-2" />
            <span className="font-semibold">QR CODE Manage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
