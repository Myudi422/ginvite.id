/* app/manage/[invitationId]/[title]/qrmanage.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';

interface ManageData {
  id_content_user: number;
}

enum TabOption {
  Scan = 'scan',
  Generate = 'generate',
  Undangan = 'undangan',
}

export default function QRManagePage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as { invitationId: string; title: string };
  const decodedTitle = decodeURIComponent(title!);
  const userId = parseInt(invitationId, 10);

  const [tab, setTab] = useState<TabOption>(TabOption.Scan);
  const [contentId, setContentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content_id saat mount
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

  if (loading) return <Spinner />;
  if (error) return <ErrorPlaceholder message={error} />;
  if (!contentId) return <EmptyPlaceholder />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={decodedTitle} onBack={() => router.back()} />
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <TabSwitcher current={tab} onChange={setTab} />
        {tab === TabOption.Scan && (
          <ScanTab contentId={contentId} userId={userId} title={decodedTitle} />
        )}
        {tab === TabOption.Generate && (
          <GenerateTab contentId={contentId} userId={userId} title={decodedTitle} />
        )}
        {tab === TabOption.Undangan && (
          <UndanganTab contentId={contentId} userId={userId} title={decodedTitle} />
        )}
      </main>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <button onClick={onBack} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-800">
          QR Manage – {title}
        </h1>
      </div>
    </header>
  );
}

function TabSwitcher({ current, onChange }: { current: TabOption; onChange: (t: TabOption) => void }) {
  return (
    <div className="mb-4 bg-white shadow p-3 rounded flex gap-2">
      {Object.values(TabOption).map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt as TabOption)}
          className={`px-4 py-2 rounded ${current === opt ? 'bg-pink-600 text-white' : ''}`}
        >
          {opt === TabOption.Scan
            ? 'Scan QR'
            : opt === TabOption.Generate
            ? 'Generate QR'
            : 'Undangan QR'}
        </button>
      ))}
    </div>
  );
}

function ScanTab({ contentId, userId, title }: { contentId: number; userId: number; title: string }) {
  const [scanData, setScanData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, rememberLastUsedCamera: false }, false);
    scanner.render(
      (decoded) => {
        setScanData(decoded);
        setShowModal(true);
      },
      (err) => console.warn(err)
    );
    return () => { scanner.clear().catch(console.error); };
  }, []);

  const handleOK = async () => {
    if (!scanData) return;
    await axios.post('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr', {
      nama: scanData,
      content_id: contentId,
      user_id: userId,
      title,
    });
    alert(`Absensi tercatat untuk ${scanData}`);
    setShowModal(false);
    setScanData(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-medium mb-4 text-center">Scan QR Tamu</h2>
      <div id="qr-reader" className="w-full max-w-md aspect-square mx-auto" />
      {showModal && <Modal data={scanData!} onOK={handleOK} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function GenerateTab({ contentId, userId, title }: { contentId: number; userId: number; title: string }) {
  const [name, setName] = useState('');

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">
      <h2 className="text-lg font-medium mb-4 text-center">Generate QR Berdasarkan Nama</h2>
      <div className="grid grid-cols-2 gap-8 items-start">
        <input
          type="text"
          placeholder="Masukkan nama tamu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <div className="flex justify-center">
          {name ? (
            <QRCode value={name} size={200} />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex justify-center items-center text-gray-400">
              QR Preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UndanganTab({ contentId, userId, title }: { contentId: number; userId: number; title: string }) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const qrValue = `${baseUrl}/formulir?content_id=${contentId}&user_id=${userId}&title=${encodeURIComponent(title)}`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto text-center">
      <h2 className="text-lg font-medium mb-4">Undangan QR ke Formulir</h2>
      <QRCode value={qrValue} size={200} />
    </div>
  );
}

function Spinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500" />
    </div>
  );
}

function ErrorPlaceholder({ message }: { message: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Terjadi Kesalahan</h2>
        <p className="text-gray-700">{message}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-pink-500 text-white rounded">Kembali</button>
      </div>
    </div>
  );
}

function EmptyPlaceholder() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-gray-700">Content ID tidak ditemukan.</p>
    </div>
  );
}

function Modal({ onClose, onOK, data }: { onClose: () => void; onOK: () => void; data: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <p className="text-xl mb-2">Hasil scan:</p>
        <p className="font-semibold mb-4">{data}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
          <button onClick={onOK} className="px-4 py-2 bg-pink-600 text-white rounded">OK</button>
        </div>
      </div>
    </div>
  );
}
