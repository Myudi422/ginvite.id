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

export default function QRManagePage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };

  // Kita butuh meng‐encode title sebelum dikirim ke API
  const slug = encodeURIComponent(title!);
  const userId = invitationId;
  // Dekode title untuk ditampilkan di UI
  const decodedTitle = decodeURIComponent(title!);

  // State untuk menampung contentId (id_content_user)
  const [contentId, setContentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk QR Scanner / Generator
  const [tab, setTab] = useState<'scan' | 'generate'>('scan');
  const [scanData, setScanData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nameToGen, setNameToGen] = useState('');

  // Fetch manageData hanya untuk mendapatkan id_content_user
  useEffect(() => {
    const fetchManageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_manage&user_id=${userId}&title=${slug}`
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Gagal mengambil data.');
        }
        const json = await res.json();
        if (json.status === 'success' && json.data) {
          const manageData = json.data as ManageData;
          setContentId(manageData.id_content_user);
        } else {
          throw new Error(json.message || 'Data tidak valid.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchManageData();
  }, [userId, slug]);

  // Setup QR Scanner hanya jika tab = 'scan' dan contentId sudah tersedia
  useEffect(() => {
    if (tab === 'scan' && contentId !== null) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, rememberLastUsedCamera: false },
        false
      );
      scanner.render(
        (decoded) => {
          if (decoded && !scanData) {
            setScanData(decoded);
            setShowModal(true);
          }
        },
        (err) => console.info(err)
      );
      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [tab, scanData, contentId]);

  const handleCloseModal = () => {
    setShowModal(false);
    setScanData(null);
  };

  const handleOK = async () => {
    if (!contentId) {
      return alert('Content ID tidak ditemukan.');
    }
    try {
      await axios.post('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr', {
        nama: scanData,
        content_id: contentId,
        user_id: parseInt(invitationId, 10),
        title: decodedTitle,
      });
      alert(`Absensi tercatat untuk ${scanData}`);
    } catch (e: any) {
      alert('Gagal kirim: ' + e.message);
    } finally {
      handleCloseModal();
    }
  };

  // Jika masih loading data contentId
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    );
  }
  // Jika error saat fetch
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
  // Jika contentId tidak ditemukan
  if (contentId === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-700">Content ID tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
            <ChevronLeft className="h-6 w-6 text-pink-600" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">
            QR Manage – {decodedTitle}
          </h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6">
        <div className="text-sm text-gray-600">
          Content ID: {contentId} • User ID: {invitationId}
        </div>

        <div className="flex gap-4 mb-6">
          {(['scan', 'generate'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded ${
                tab === t ? 'bg-pink-600 text-white' : 'bg-white shadow'
              }`}
            >
              {t === 'scan' ? 'Scan QR' : 'Generate QR'}
            </button>
          ))}
        </div>

        {tab === 'scan' ? (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-medium mb-4 text-center">Scan QR Tamu</h2>
            <div id="qr-reader" className="w-full max-w-md aspect-square mx-auto" />
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                  <p className="text-xl mb-2">Hasil scan:</p>
                  <p className="font-semibold mb-4">{scanData}</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-200 rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleOK}
                      className="px-4 py-2 bg-pink-600 text-white rounded"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">
            <h2 className="text-lg font-medium mb-4 text-center">
              Generate QR Berdasarkan Nama
            </h2>
            <div className="grid grid-cols-2 gap-8 items-start">
              <input
                type="text"
                placeholder="Masukkan nama tamu"
                value={nameToGen}
                onChange={(e) => setNameToGen(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex justify-center">
                {nameToGen ? (
                  <QRCode value={nameToGen} size={200} />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex justify-center items-center text-gray-400">
                    QR Preview
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
