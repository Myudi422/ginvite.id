'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Eye, ThumbsUp, TrashIcon, User, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function DataTamuPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };

  // Diasumsikan invitationId sama dengan user_id
  const user_id = invitationId;

  // State untuk data RSVP, Transfer, aggregates, dan pagination
  const [rsvpData, setRsvpData] = useState<any[]>([]);
  const [transferData, setTransferData] = useState<any[]>([]);
  const [aggregates, setAggregates] = useState({
    bank_transfer_total_nominal: 0,
    rsvp_counts: { total: 0, hadir: 0, tidak_hadir: 0 },
  });
  const [rsvpPage, setRsvpPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fungsi fetch data dari API GET dengan parameter pagination
  async function fetchData() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('user_id', String(user_id));
      params.append('title', title || '');
      params.append('rsvp_page', String(rsvpPage));
      params.append('transfer_page', String(transferPage));

      const url = `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_usermanage&${params.toString()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'success') {
        setRsvpData(json.data.rsmp);
        setTransferData(json.data.bank_transfer);
        setAggregates(json.data.aggregates);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [rsvpPage, transferPage, title, user_id]);

  // Fungsi hapus data (memanggil API delete)
  async function deleteData(id: number, type: string) {
    if (!confirm(`Yakin hapus data ${type} dengan id ${id}?`)) return;
    try {
      const res = await fetch('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=delete_usermanage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, type }),
      });
      const json = await res.json();
      if (json.status === 'success') {
        alert(json.message);
        fetchData(); // refresh data setelah hapus
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error deleting data', error);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* HEADER */}
      <div className="flex items-center bg-white shadow p-4">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-pink-700">
          Data Tamu – {decodeURIComponent(title || '')}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="rsvp" className="space-y-2">
          <TabsList className="mb-4 bg-white shadow p-3 rounded">
            <TabsTrigger value="rsvp">Tamu RSVP</TabsTrigger>
            <TabsTrigger value="transfer">Tamu Transfer</TabsTrigger>
          </TabsList>

          {/* Tab Tamu RSVP */}
          <TabsContent value="rsvp">
            {/* Card Aggregates RSVP */}
            <div className="pb-6 grid grid-cols-3 gap-4">
              <div className="bg-white shadow rounded p-4 text-center">
                <Eye className="mx-auto h-8 w-8 text-pink-600" />
                <p className="mt-2 text-sm text-gray-600">Total RSVP</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {aggregates.rsvp_counts.total}
                </p>
              </div>
              <div className="bg-white shadow rounded p-4 text-center">
                <ThumbsUp className="mx-auto h-8 w-8 text-pink-600" />
                <p className="mt-2 text-sm text-gray-600">Hadir</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {aggregates.rsvp_counts.hadir}
                </p>
              </div>
              <div className="bg-white shadow rounded p-4 text-center">
                <User className="mx-auto h-8 w-8 text-pink-600" />
                <p className="mt-2 text-sm text-gray-600">Tidak Hadir</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {aggregates.rsvp_counts.tidak_hadir}
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-2xl p-4">
              <h2 className="text-lg font-semibold text-pink-700 mb-4">Daftar Tamu RSVP</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">No HP</th>
                    <th className="p-3 text-left">Ucapan</th>
                    <th className="p-3 text-left">Konfirmasi</th>
                    <th className="p-3 text-left">Tanggal</th>
                    <th className="p-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpData.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.nama}</td>
                      <td className="p-3">{item.wa}</td>
                      <td className="p-3">{item.ucapan}</td>
                      <td className="p-3">{item.konfirmasi === 'hadir' ? '✅' : '❌'}</td>
                      <td className="p-3">{item.created_at || '-'}</td>
                      <td className="p-3">
                        <Button variant="ghost" onClick={() => deleteData(item.id, 'rsvp')}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {rsvpData.length === 0 && (
                    <tr>
                      <td className="p-3" colSpan={6}>Data tidak ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination untuk RSVP */}
              <div className="flex justify-between mt-4">
                {rsvpPage > 1 && (
                  <Button onClick={() => setRsvpPage(rsvpPage - 1)} disabled={loading}>
                    Prev Page
                  </Button>
                )}
                {rsvpData.length === 20 && (
                  <Button onClick={() => setRsvpPage(rsvpPage + 1)} disabled={loading}>
                    Next Page
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab Tamu Transfer */}
          <TabsContent value="transfer">
            <div className="bg-white shadow rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-pink-700">Daftar Tamu Transfer</h2>
              {/* Card Total Nominal */}
              <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Wallet className="h-8 w-8 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gift yang Didapatkan</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rp {Number(aggregates.bank_transfer_total_nominal).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Ini hanya perkiraan, karena belum valid.</p>
                </div>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Nominal</th>
                    <th className="p-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transferData.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3">{item.nama_pemberi}</td>
                      <td className="p-3">Rp {Number(item.nominal).toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <Button variant="ghost" onClick={() => deleteData(item.id, 'transfer')}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {transferData.length === 0 && (
                    <tr>
                      <td className="p-3" colSpan={3}>Data tidak ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination untuk Transfer */}
              <div className="flex justify-between mt-4">
                {transferPage > 1 && (
                  <Button onClick={() => setTransferPage(transferPage - 1)} disabled={loading}>
                    Prev Page
                  </Button>
                )}
                {transferData.length === 20 && (
                  <Button onClick={() => setTransferPage(transferPage + 1)} disabled={loading}>
                    Next Page
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}