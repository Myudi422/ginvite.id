/* app/formulir/page.tsx */
'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function FormulirPage() {
  const params = useSearchParams();
  const contentId = params.get('content_id');
  const userId    = params.get('user_id');
  const title     = params.get('title');

  const [nama, setNama] = useState('');
  const [email,setEmail] = useState('');
  const [status,setStatus] = useState<'Hadir'|'Tidak Hadir'>('Hadir');
  const [loading,setLoading]=useState(false);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!contentId||!userId){ alert('Parameter tidak lengkap'); return; }
    setLoading(true);
    try {
      await axios.post('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=qr',{
        nama,email,status,content_id:contentId,user_id:userId,title
      });
      alert('Terima kasih, data Anda telah tercatat.');
    } catch(err:any){ alert('Gagal mengirim: '+err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow max-w-md w-full space-y-4">
        <h1 className="text-xl font-semibold text-center">Formulir Absensi</h1>
        <input type="text" placeholder="Nama" value={nama} onChange={e=>setNama(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
        <input type="email" placeholder="Email (opsional)" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        <select value={status} onChange={e=>setStatus(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
          <option value="Hadir">Hadir</option>
          <option value="Tidak Hadir">Tidak Hadir</option>
        </select>
        <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg text-white ${loading?'bg-gray-400':'bg-pink-600'}`}>
          {loading?'Mengirim...':'Kirim'}
        </button>
      </form>
    </div>
  );
}
