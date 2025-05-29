/* app/manage/[invitationId]/[title]/qrmanage.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Maximize } from 'lucide-react'; // Import Maximize icon
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

interface FullscreenModalProps {
  qrValue: string;
  onClose: () => void;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ qrValue, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-8">
      <QRCode value={qrValue} size={Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8)} />
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 rounded">
        Tutup
      </button>
    </div>
  </div>
);

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
          <GenerateTab contentId={contentId} />
        )}
        {tab === TabOption.Undangan && (
          <UndanganTab contentId={contentId} />
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
    <>
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Fitur Scan QR:</h2>
        <p className="text-sm text-gray-600">
          Perangkat akan menggunakan kamera untuk memindai kode QR yang ditunjukkan tamu setelah fitur kamera diaktifkan.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-medium mb-4 text-center">Scan QR Tamu</h2>
        <div id="qr-reader" className="w-full max-w-3xl aspect-video mx-auto" />
        {showModal && <Modal data={scanData!} onOK={handleOK} onClose={() => setShowModal(false)} />}
      </div>
    </>
  );
}


function GenerateTab({ contentId }: { contentId: number }) {
  const [name, setName] = useState('');

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Fitur Generate QR:</h2>
        <p className="text-sm text-gray-600">
          Memungkinkan pembuatan contoh kode QR dengan nama tamu untuk pengujian atau input manual.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-medium mb-4 text-center">Generate QR Berdasarkan Nama</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Masukkan nama tamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="w-full flex justify-center">
          {name ? (
            <div className="w-full flex justify-center">
              <QRCode
                value={name}
                size={Math.min(300, (document.querySelector('#generate-tab')?.clientWidth || 300) * 0.8)}
              />
            </div>
          ) : (
            <div className="w-full flex justify-center items-center bg-gray-100 rounded-lg aspect-square">
              <div className="text-gray-400">QR Preview</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


function UndanganTab({ contentId }: { contentId: number }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const payload = JSON.stringify({ contentId });
  const token = typeof window !== 'undefined' ? btoa(payload) : '';
  const qrValue = `${baseUrl}/formulir?token=${token}`;

  const handleFullscreenClick = () => setIsFullScreen(true);
  const handleCloseFullscreen = () => setIsFullScreen(false);

  return (
    <>
      {/* Box Deskripsi Fitur */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Fitur Undangan QR:</h2>
        <p className="text-sm text-gray-600">
          Menghasilkan kode QR yang dapat dipindai tamu untuk mengisi formulir undangan digital di perangkat mereka.
        </p>
      </div>

      {/* QR Code Box */}
      <div className="bg-white p-6 rounded-2xl shadow text-center relative">
        <h2 className="text-lg font-medium mb-4">QR Formulir</h2>
        <div className="w-full flex justify-center relative">
          <QRCode
            value={qrValue}
            size={Math.min(300, (document.querySelector('.shadow')?.clientWidth || 300) * 0.8)}
          />
          <button
            onClick={handleFullscreenClick}
            className="absolute top-0 right-0 p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Pindai kode QR ini untuk mengisi formulir undangan.
        </p>

        {isFullScreen && <FullscreenModal qrValue={qrValue} onClose={handleCloseFullscreen} />}
      </div>
    </>
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