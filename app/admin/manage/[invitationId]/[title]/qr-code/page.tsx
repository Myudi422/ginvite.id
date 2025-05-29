'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';

const QrReader = dynamic(
  () =>
    import('react-qr-reader').then((mod) => mod.QrReader),
  { ssr: false }
);

export default function QRManagePage() {
  const router = useRouter();
  const { invitationId, slug } = useParams() as { invitationId: string; slug: string };
  const [tab, setTab] = useState<'scan' | 'generate'>('scan');
  const [scanData, setScanData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nameToGen, setNameToGen] = useState('');
  const qrRef = useRef<any>(null);

  const handleScan = (result: any, error: any) => {
    if (result && !scanData) {
      const text = result?.text || result;
      setScanData(text);
      setShowModal(true);
      qrRef.current?.stop();
    }
    if (error) {
      console.info(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.refresh();
    setScanData(null);
  };

  const handleOK = async () => {
    try {
      await axios.post('/api/postAttendance', {
        nama: scanData,
        content_id: parseInt(invitationId, 10),
      });
      alert('Absensi tercatat: ' + scanData);
    } catch (err: any) {
      alert('Gagal kirim: ' + err.message);
    } finally {
      handleCloseModal();
    }
  };

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
          Manage Undangan – {decodeURIComponent(slug)}
        </h1>
      </div>

      <div className="p-6">
        {/* INTRO */}
        <p className="mb-6 text-gray-700">
          Tamu cukup tampilkan QR (isi nama mereka) untuk dicatat kehadirannya.  
          Tab <strong>Scan QR</strong> untuk scan & kirim,  
          tab <strong>Generate QR</strong> untuk contoh QR per nama.
        </p>

        {/* TABS */}
        <div className="flex mb-6 space-x-4">
          {(['scan','generate'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded ${
                tab === t
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 shadow'
              }`}
            >
              {t === 'scan' ? 'Scan QR' : 'Generate QR'}
            </button>
          ))}
        </div>

        {/* SCAN TAB */}
        {tab === 'scan' && (
          <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">
            <h2 className="text-lg font-medium mb-4">Scan QR Tamu</h2>
            <div className="mx-auto">
              <QrReader
                ref={qrRef}
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                // atur ukuran container & video
                containerStyle={{ width: '300px', margin: '0 auto' }}
                videoContainerStyle={{ overflow: 'hidden', borderRadius: '1rem' }}
                videoStyle={{ width: '100%', height: 'auto' }}
              />
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
                  <p className="text-xl mb-2">Hasil scan:</p>
                  <p className="font-semibold mb-4">{scanData}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleOK}
                      className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GENERATE TAB */}
        {tab === 'generate' && (
          <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">
            <h2 className="text-lg font-medium mb-4">Generate QR Berdasarkan Nama</h2>
            <input
              type="text"
              placeholder="Masukkan nama tamu"
              value={nameToGen}
              onChange={(e) => setNameToGen(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg"
            />
            {nameToGen && (
              <div className="flex justify-center">
                <QRCode value={nameToGen} size={200} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
