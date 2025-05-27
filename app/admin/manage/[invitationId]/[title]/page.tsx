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
    Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ManageData {
    id_content_user: number;
    view: string | null;
    total_nominal_bank_transfer: number;
    jumlah_konfirmasi: {
        hadir: number;
        tidak_hadir: number;
    };
}

export default function ManagePage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as {
        invitationId: string;
        title: string;
    };
    const slug = encodeURIComponent(title!);
    const userId = invitationId; // Asumsi invitationId adalah user_id

    const [manageData, setManageData] = useState<ManageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchManageData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_manage&user_id=${userId}&title=${slug}` // Sesuaikan path API jika perlu
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengambil data.');
                }
                const data = await response.json();
                if (data.status === 'success' && data.data) {
                    setManageData(data.data as ManageData);
                } else {
                    setError(data.message || 'Data tidak valid.');
                }
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
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 border-solid"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-500 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-gray-700">{error}</p>
                    <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400">
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    if (!manageData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
                    <p className="text-gray-700">Tidak ada informasi yang tersedia untuk undangan ini.</p>
                    <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400">
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

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
                        <p className="text-2xl font-bold text-gray-800">
                            Rp{manageData.total_nominal_bank_transfer?.toLocaleString('id-ID') || 0}
                        </p>
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
                                {manageData.view || 0}
                            </p>
                        </div>
                        <div className="text-center">
                            <ThumbsUp className="mx-auto h-8 w-8 text-pink-600" />
                            <p className="mt-2 text-sm text-gray-600">Bersedia</p>
                            <p className="mt-1 text-2xl font-bold text-gray-800">
                                {manageData.jumlah_konfirmasi.hadir}
                            </p>
                        </div>
                        <div className="text-center">
                            <User className="mx-auto h-8 w-8 text-pink-600" />
                            <p className="mt-2 text-sm text-gray-600">Tidak Hadir</p>
                            <p className="mt-1 text-2xl font-bold text-gray-800">
                                {manageData.jumlah_konfirmasi.tidak_hadir}
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
    router.push(`/admin/manage/${invitationId}/${slug}/bulk`)
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