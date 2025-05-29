'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function FormulirPage() {
  const searchParams = useSearchParams();
  const contentId = searchParams.get('content_id');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contentIdNumber = parseInt(contentId || '', 10);

    if (!nama || isNaN(contentIdNumber)) {
      alert('Nama dan content_id diperlukan.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr',
        {
          nama,
          content_id: contentIdNumber,
        }
      );
      alert('Terima kasih, data Anda telah tercatat.');
    } catch (err: any) {
      alert('Gagal mengirim: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Formulir Absensi</h1>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400' : 'bg-pink-600'
          }`}
        >
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
      </form>
    </div>
  );
}
