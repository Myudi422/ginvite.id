"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Eye, ThumbsUp, TrashIcon, User, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  createColumnHelper,
} from '@tanstack/react-table';

// ––––––– Tipe Data –––––––
type RSVP = {
  id: number;
  nama: string;
  wa: string;
  ucapan: string;
  konfirmasi: string;
  created_at: string;
};

type Transfer = {
  id: number;
  nama_pemberi: string;
  nominal: number;
};

export default function DataTamuPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };
  const user_id = invitationId;

  // State untuk data, aggregates dan pagination
  const [rsvpData, setRsvpData] = useState<RSVP[]>([]);
  const [transferData, setTransferData] = useState<Transfer[]>([]);
  const [aggregates, setAggregates] = useState({
    bank_transfer_total_nominal: 0,
    rsvp_counts: { total: 0, hadir: 0, tidak_hadir: 0 },
  });
  const [rsvpPage, setRsvpPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fungsi ambil data dari API dengan parameter pagination
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

  // Fungsi hapus data (API delete)
  async function deleteData(id: number, type: string) {
    if (!confirm(`Yakin hapus data ${type} dengan id ${id}?`)) return;
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=delete_usermanage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, type }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        alert(json.message);
        fetchData();
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error deleting data', error);
      alert('Terjadi kesalahan saat menghapus data.');
    }
  }

  // Modifikasi komponen ResponsiveTable untuk tampilan mobile
  function ResponsiveTable<T>({ columns, data }: { columns: ColumnDef<T, any>[]; data: T[] }) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return (
      <div className="w-full">
        {/* Desktop view - tampil sebagai table normal */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-3 text-left text-sm font-medium text-gray-700"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-gray-200">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view - tampil sebagai cards */}
        <div className="md:hidden space-y-4">
          {data.length === 0 ? (
            <div className="text-center p-4 bg-white rounded-lg">
              Data tidak ditemukan.
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} className="bg-white p-4 rounded-lg shadow space-y-2">
                {row.getVisibleCells().map((cell) => {
                  const header = cell.column.columnDef.header as string;
                  if (header === 'Aksi') {
                    return (
                      <div key={cell.id} className="flex justify-end pt-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    );
                  }
                  return (
                    <div key={cell.id} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">{header}:</span>
                      <span className="text-sm text-right ml-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Modifikasi column definitions untuk RSVP
  const rsvpColumnHelper = createColumnHelper<RSVP>();
  const rsvpColumns = useMemo<ColumnDef<RSVP, any>[]>(() => [
    rsvpColumnHelper.accessor('created_at', {
      header: 'Tanggal',
      cell: info => <span className="whitespace-nowrap">{info.getValue() || '-'}</span>,
    }),
    rsvpColumnHelper.accessor('nama', {
      header: 'Nama',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    rsvpColumnHelper.accessor('wa', {
      header: 'No HP',
    }),
    rsvpColumnHelper.accessor('ucapan', {
      header: 'Ucapan',
      cell: info => <span className="line-clamp-2">{info.getValue()}</span>,
    }),
    rsvpColumnHelper.accessor('konfirmasi', {
      header: 'Konfirmasi',
      cell: info => <span>{info.getValue() === 'hadir' ? '✅' : '❌'}</span>,
    }),
    {
      id: 'aksi',
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => deleteData(row.original.id, 'rsvp')}>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </Button>
      ),
    },
  ], []);

  // Column definitions untuk tabel Transfer
  const transferColumnHelper = createColumnHelper<Transfer>();
  const transferColumns = useMemo<ColumnDef<Transfer, any>[]>(() => [
    transferColumnHelper.accessor('nama_pemberi', {
      header: 'Nama',
    }),
    transferColumnHelper.accessor('nominal', {
      header: 'Nominal',
      cell: info => <>Rp {Number(info.getValue()).toLocaleString('id-ID')}</>,
    }),
    {
      id: 'aksi',
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <Button variant="ghost" onClick={() => deleteData(row.original.id, 'transfer')}>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </Button>
      ),
    },
  ], []);

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="sticky top-0 z-10 flex items-center bg-white shadow p-4">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-pink-700 truncate">
          Data Tamu – {decodeURIComponent(title || '')}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="rsvp" className="space-y-2">
          <TabsList className="w-full bg-white shadow rounded-lg p-1">
            <TabsTrigger value="rsvp" className="flex-1">Tamu RSVP</TabsTrigger>
            <TabsTrigger value="transfer" className="flex-1">Tamu Transfer</TabsTrigger>
          </TabsList>

          {/* Tab Tamu RSVP */}
          <TabsContent value="rsvp">
            <div className="pb-6 grid grid-cols-3 sm:grid-cols-3 gap-4">
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
              <ResponsiveTable columns={rsvpColumns} data={rsvpData} />

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
                  <p className="text-xs text-gray-500 mt-1">
                    Ini hanya perkiraan, karena belum valid.
                  </p>
                </div>
              </div>

              <ResponsiveTable columns={transferColumns} data={transferData} />

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