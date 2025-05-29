//* app/formulir/page.tsx */
export const dynamic = 'force-dynamic';
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function FormulirPage() {
  const params = useSearchParams();
  const router = useRouter();
  const contentId = params.get('content_id');

  // Redirect to home if content_id is missing
  useEffect(() => {
    if (!contentId) {
      router.replace('/');
    }
  }, [contentId, router]);

  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentId) return;
    setLoading(true);
    try {
      await axios.post(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr',
        { nama, content_id: contentId }
      );
      alert('Terima kasih, data Anda telah tercatat.');
      setNama('');
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