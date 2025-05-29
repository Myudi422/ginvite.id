'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

function FormulirContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentId, setContentId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace('/');
      return;
    }

    try {
      const decoded = atob(token);
      const payload = JSON.parse(decoded);
      if (!payload.contentId || isNaN(payload.contentId)) {
        throw new Error('Invalid token');
      }
      setContentId(payload.contentId);
    } catch (err) {
      router.replace('/');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !contentId) {
      alert('Nama dan content_id diperlukan.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr',
        { nama, content_id: contentId }
      );
      alert('Terima kasih, data Anda telah tercatat.');
    } catch (err: any) {
      alert('Gagal mengirim: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <FormulirContent />
      </Suspense>
    </div>
  );
}
