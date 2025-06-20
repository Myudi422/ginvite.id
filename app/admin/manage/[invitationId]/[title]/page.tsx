'use client';

import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Eye,
  ThumbsUp,
  User,
  Calendar,
  ClipboardList,
  ListChecks,
  QrCode,
  Wallet,
  Mails,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getManageData, type ManageData } from '@/app/actions/manage';

export default function ManagePage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };
  // Kita perlu encodeURIComponent untuk dipakai di URL fetch & route‐link
  const slug = encodeURIComponent(title!);
  const userId = invitationId;

  const [manageData, setManageData] = useState<ManageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getManageData(userId, slug);
        setManageData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchManageData();
  }, [userId, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }
  if (!manageData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Data Tidak Ditemukan
      </div>
    );
  }

  const { id_content_user, view, total_nominal_bank_transfer, jumlah_konfirmasi } = manageData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center bg-white shadow p-4">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-800">
          Manage Undangan – {decodeURIComponent(title!)}
        </h1>
      </div>

      <div className="p-6 space-y-6">

        <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
          <Wallet className="h-8 w-8 text-pink-600" />
          <div>
            <p className="text-sm text-gray-600">Gift yang Didapatkan</p>
            <p className="text-2xl font-bold text-gray-800">
              Rp{total_nominal_bank_transfer.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl h-40 bg-white shadow">
          <div className="absolute inset-0 bg-[url('/sample-bg.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 flex justify-around items-center h-full">
            {[
              { icon: Eye, label: 'Dilihat', value: view },
              { icon: ThumbsUp, label: 'Bersedia', value: jumlah_konfirmasi.hadir },
              { icon: User, label: 'Tidak Hadir', value: jumlah_konfirmasi.tidak_hadir },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="mx-auto h-8 w-8 text-pink-600" />
                <p className="mt-2 text-sm text-gray-600">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-pink-50 border-l-4 border-pink-400 text-pink-800 p-4 rounded">
          <Calendar className="h-5 w-5" />
          <p>Untuk Mengaktifkan Plugin yang terkunci, silahkan ubah di formulir dan lakukan payment.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/admin/formulir/${invitationId}/${slug}`)}
            className="flex flex-col items-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700"
          >
            <ClipboardList className="h-8 w-8 mb-2" />
            <span className="font-semibold">Edit Formulir</span>
          </button>
          <button
            onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/data-tamu`)}
            className="flex flex-col items-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700"
          >
            <User className="h-8 w-8 mb-2" />
            <span className="font-semibold">Data Tamu</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/bulk`)}
            className="flex flex-col items-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700"
          >
            <Mails className="h-8 w-8 mb-2" />
            <span className="font-semibold">Bulk Undangan</span>
          </button>
          <button
            onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/rundown`)}
            className="flex flex-col items-center bg-pink-600 text-white rounded-lg p-6 hover:bg-pink-700"
          >
            <ListChecks className="h-8 w-8 mb-2" />
            <span className="font-semibold">Rundown Generate</span>
          </button>
          <button
            onClick={async () => {
              if (!manageData.QR) return;
              
              try {
                // Verify QR access again before navigation
                const res = await fetch(
                  `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_manage&user_id=${userId}&title=${slug}`
                );
                const json = await res.json();
                
                if (json.status === 'success' && json.data?.QR) {
                  router.push(`/admin/manage/${invitationId}/${slug}/qr-code`);
                } else {
                  alert('Fitur QR Code belum diaktifkan');
                }
              } catch (err) {
                alert('Terjadi kesalahan saat mengakses QR Code');
              }
            }}
            className={`flex flex-col items-center rounded-lg p-6 ${
              manageData.QR 
                ? 'bg-pink-600 text-white hover:bg-pink-700' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <QrCode className="h-8 w-8 mb-2" />
            <span className="font-semibold">QR CODE Manage</span>
            {!manageData.QR && (
              <span className="text-xs mt-1">🔒 Terkunci</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}