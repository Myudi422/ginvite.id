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
  TrendingUp,
  Lock,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getManageData, type ManageData } from '@/app/actions/manage';

// ─── Stat Card ───
function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl p-4 text-white ${gradient} shadow-md`}>
      <div className="bg-white/20 rounded-xl p-2 w-fit mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/75 mt-1">{label}</p>
    </div>
  );
}

// ─── Action Button ───
function ActionButton({
  icon: Icon,
  label,
  sublabel,
  onClick,
  locked,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  onClick: () => void;
  locked?: boolean;
  gradient?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`group relative flex items-center gap-4 w-full rounded-2xl p-4 text-left shadow-sm border transition-all duration-200
        ${locked
          ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
          : `${gradient ?? 'bg-white border-gray-100'} hover:shadow-md hover:-translate-y-0.5`
        }`}
    >
      <div className={`rounded-xl p-3 flex-shrink-0 ${locked ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${locked ? 'text-gray-400' : 'text-gray-800'}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
        {locked && (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
            <Lock className="h-3 w-3" /> Fitur terkunci
          </span>
        )}
      </div>
      {!locked && <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-pink-500 flex-shrink-0 transition-colors" />}
    </button>
  );
}

export default function ManagePage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-pink-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md max-w-sm w-full mx-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Terjadi Kesalahan</h2>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!manageData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-pink-50">
        <p className="text-gray-500">Data tidak ditemukan.</p>
      </div>
    );
  }

  const { view, total_nominal_bank_transfer, jumlah_konfirmasi, invitation_type } = manageData;
  const isPernikahan = !invitation_type || invitation_type === 'pernikahan';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center p-4 max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-pink-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-pink-600" />
          </button>
          <div className="ml-3 min-w-0">
            <h1 className="text-base font-bold text-gray-800 truncate">Manage Undangan</h1>
            <p className="text-xs text-pink-500 truncate">{decodeURIComponent(title!)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:px-8 pb-10 space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={Eye}
            label="Total Dilihat"
            value={view}
            gradient="bg-gradient-to-br from-pink-500 to-rose-500"
          />
          <StatCard
            icon={ThumbsUp}
            label="Bersedia Hadir"
            value={jumlah_konfirmasi.hadir}
            gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
          />
          <StatCard
            icon={User}
            label="Tidak Hadir"
            value={jumlah_konfirmasi.tidak_hadir}
            gradient="bg-gradient-to-br from-orange-400 to-amber-500"
          />
          <StatCard
            icon={Wallet}
            label="Gift Terkumpul"
            value={`Rp ${total_nominal_bank_transfer.toLocaleString('id-ID')}`}
            gradient="bg-gradient-to-br from-violet-500 to-purple-500"
          />
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl">
          <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            Untuk mengaktifkan plugin yang terkunci, silahkan ubah di <strong>Edit Formulir</strong> dan lakukan pembayaran.
          </p>
        </div>

        {/* Action Buttons */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Menu Utama</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionButton
              icon={ClipboardList}
              label="Edit Formulir"
              sublabel="Ubah data, tema, dan konten undangan"
              onClick={() => router.push(`/admin/formulir/${invitationId}/${slug}`)}
            />
            <ActionButton
              icon={User}
              label="Data Tamu"
              sublabel="Lihat RSVP, transfer, dan kehadiran"
              onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/data-tamu`)}
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Fitur Plugin</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ActionButton
              icon={Mails}
              label="Bulk Undangan"
              sublabel="Kirim undangan ke banyak tamu"
              onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/bulk`)}
            />
            <ActionButton
              icon={ListChecks}
              label="Rundown Generate"
              sublabel="Buat susunan acara otomatis"
              onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/rundown`)}
            />
            <ActionButton
              icon={QrCode}
              label="QR Code Manage"
              sublabel="Scan kehadiran tamu via QR"
              locked={!manageData.QR}
              onClick={async () => {
                if (!manageData.QR) return;
                try {
                  const res = await fetch(
                    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_manage&user_id=${userId}&title=${slug}`
                  );
                  const json = await res.json();
                  if (json.status === 'success' && json.data?.QR) {
                    router.push(`/admin/manage/${invitationId}/${slug}/qr-code`);
                  } else {
                    alert('Fitur QR Code belum diaktifkan');
                  }
                } catch {
                  alert('Terjadi kesalahan saat mengakses QR Code');
                }
              }}
            />
          </div>
        </div>

        {/* Wedding Planner — only for pernikahan */}
        {isPernikahan && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">💒 Wedding Planner</p>
            <button
              onClick={() => router.push(`/admin/manage/${invitationId}/${slug}/wedding-planner`)}
              className="group w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-4 text-left shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
              <div className="relative flex items-center gap-4">
                <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white">Wedding Planner</p>
                  <p className="text-xs text-rose-100 mt-0.5">Budget, vendor, seserahan &amp; lainnya</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white flex-shrink-0 transition-colors" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}