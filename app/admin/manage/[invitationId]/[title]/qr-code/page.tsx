/* app/manage/[invitationId]/[title]/qr-code/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Maximize2,
  QrCode,
  ScanLine,
  Sparkles,
  CheckCircle2,
  X,
  UserCheck,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';

interface ManageData { id_content_user: number; }
enum TabOption { Scan = 'scan', Generate = 'generate', Undangan = 'undangan' }

/* ─── Fullscreen Modal ─── */
function FullscreenModal({ qrValue, onClose }: { qrValue: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <QRCode value={qrValue} size={Math.min(window.innerWidth * 0.7, 320)} />
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-2xl text-sm font-semibold text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" /> Tutup
        </button>
      </div>
    </div>
  );
}

/* ─── Scan Result Modal ─── */
function ScanModal({ data, onOK, onClose }: { data: string; onOK: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserCheck className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-center text-gray-800 mb-1">QR Terdeteksi!</h3>
        <p className="text-sm text-gray-500 text-center mb-2">Nama tamu:</p>
        <p className="text-center font-bold text-pink-600 text-xl mb-5">{data}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onOK}
            className="flex-1 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
          >
            Catat Kehadiran ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function QRManagePage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as { invitationId: string; title: string };
  const decodedTitle = decodeURIComponent(title!);
  const userId = parseInt(invitationId, 10);

  const [tab, setTab] = useState<TabOption>(TabOption.Scan);
  const [contentId, setContentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_manage&user_id=${userId}&title=${encodeURIComponent(decodedTitle)}`
        );
        const json = await res.json();
        if (json.status === 'success') {
          setContentId((json.data as ManageData).id_content_user);
        } else {
          throw new Error(json.message || 'Data invalid');
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId, decodedTitle]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex flex-col items-center justify-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500" />
      <p className="text-sm text-gray-500">Memuat data QR...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-md text-center max-w-sm w-full">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Terjadi Kesalahan</h2>
        <p className="text-sm text-gray-500 mb-5">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-pink-500 text-white rounded-2xl text-sm font-semibold hover:bg-pink-600 transition-colors"
        >
          Kembali
        </button>
      </div>
    </div>
  );

  if (!contentId) return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-gray-500">Content ID tidak ditemukan.</p>
    </div>
  );

  const tabs = [
    { key: TabOption.Scan, label: 'Scan QR', icon: ScanLine, desc: 'Scan kehadiran tamu' },
    { key: TabOption.Generate, label: 'Generate QR', icon: Sparkles, desc: 'Buat QR per nama' },
    { key: TabOption.Undangan, label: 'QR Formulir', icon: QrCode, desc: 'QR untuk tamu isi RSVP' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center p-4 max-w-5xl mx-auto">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-pink-50 transition-colors">
            <ChevronLeft className="h-5 w-5 text-pink-600" />
          </button>
          <div className="ml-3 min-w-0">
            <h1 className="text-base font-bold text-gray-800 truncate">QR Code Manage</h1>
            <p className="text-xs text-pink-500 truncate">{decodedTitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:px-8 pb-10 space-y-5">

        {/* ── Tab Switcher ── */}
        <div className="grid grid-cols-3 gap-3">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all text-center ${tab === t.key
                  ? 'bg-pink-500 border-pink-500 text-white shadow-md'
                  : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200 hover:text-pink-500'
                }`}
            >
              <t.icon className={`h-5 w-5 ${tab === t.key ? 'text-white' : ''}`} />
              <span className="text-xs font-semibold leading-tight">{t.label}</span>
              <span className={`text-[10px] leading-tight hidden sm:block ${tab === t.key ? 'text-white/75' : 'text-gray-400'}`}>
                {t.desc}
              </span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {tab === TabOption.Scan && <ScanTab contentId={contentId} userId={userId} title={decodedTitle} />}
        {tab === TabOption.Generate && <GenerateTab contentId={contentId} />}
        {tab === TabOption.Undangan && <UndanganTab contentId={contentId} />}

      </div>
    </div>
  );
}

/* ─── Scan Tab ─── */
function ScanTab({ contentId, userId, title }: { contentId: number; userId: number; title: string }) {
  const [scanData, setScanData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [recorded, setRecorded] = useState<string[]>([]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, rememberLastUsedCamera: false }, false);
    scanner.render(
      decoded => { setScanData(decoded); setShowModal(true); },
      err => console.warn(err)
    );
    return () => { scanner.clear().catch(console.error); };
  }, []);

  const handleOK = async () => {
    if (!scanData) return;
    await axios.post('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr', {
      nama: scanData, content_id: contentId, user_id: userId, title,
    });
    setRecorded(prev => [scanData, ...prev]);
    setShowModal(false);
    setScanData(null);
  };

  return (
    <div className="space-y-5">
      {/* Info card */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <ScanLine className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700">Cara Kerja</p>
          <p className="text-xs text-blue-500 mt-0.5">
            Perangkat akan menggunakan kamera untuk memindai QR tamu. Setelah QR terdeteksi, konfirmasi kehadiran tamu.
          </p>
        </div>
      </div>

      {/* Scanner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 text-center">Arahkan kamera ke QR tamu</h2>
        <div id="qr-reader" className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden" />
      </div>

      {/* Recently recorded */}
      {recorded.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Baru Tercatat ({recorded.length})
          </h2>
          <div className="space-y-2">
            {recorded.map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && <ScanModal data={scanData!} onOK={handleOK} onClose={() => setShowModal(false)} />}
    </div>
  );
}

/* ─── Generate Tab ─── */
function GenerateTab({ contentId }: { contentId: number }) {
  const [name, setName] = useState('');

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700">Generate QR Per Nama</p>
          <p className="text-xs text-amber-500 mt-0.5">
            Buat QR code berdasarkan nama tamu untuk pengujian atau untuk dicetak dan diberikan ke tamu secara manual.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <input
          type="text"
          placeholder="Masukkan nama tamu..."
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
        />

        <div className="flex justify-center">
          {name ? (
            <div className="bg-white p-6 rounded-2xl border-2 border-pink-100 shadow-sm inline-block">
              <QRCode value={name} size={220} />
              <p className="text-center text-sm font-semibold text-pink-600 mt-3">{name}</p>
            </div>
          ) : (
            <div className="w-56 h-56 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
              <QrCode className="h-10 w-10 text-gray-300" />
              <p className="text-xs text-gray-400">QR akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Undangan Tab ─── */
function UndanganTab({ contentId }: { contentId: number }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrValue = `${baseUrl}/formulir?token=${typeof window !== 'undefined' ? btoa(JSON.stringify({ contentId })) : ''}`;

  return (
    <div className="space-y-5">
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
        <QrCode className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-700">QR Formulir Undangan</p>
          <p className="text-xs text-purple-500 mt-0.5">
            Tamu cukup scan QR ini untuk langsung mengisi formulir RSVP di perangkat mereka. Tampilkan di meja registrasi.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="bg-white p-6 rounded-2xl border-2 border-pink-100 shadow-md inline-block">
            <QRCode value={qrValue} size={220} />
          </div>
          <button
            onClick={() => setIsFullScreen(true)}
            className="absolute -top-2 -right-2 w-9 h-9 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">Scan untuk isi formulir RSVP</p>
          <p className="text-xs text-gray-400 mt-1">Tekan ikon full screen untuk tampilan lebih besar</p>
        </div>
      </div>

      {isFullScreen && <FullscreenModal qrValue={qrValue} onClose={() => setIsFullScreen(false)} />}
    </div>
  );
}