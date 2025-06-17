"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Eye, ThumbsUp, TrashIcon, User, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Data types
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

type Aggregates = {
  bank_transfer_total_nominal: number;
  rsvp_counts: { total: number; hadir: number; tidak_hadir: number };
};

// TableResponsive: generic, mobile-first, scrollable
function TableResponsive<T>({
  columns,
  data,
  emptyText = "Data tidak ditemukan.",
}: {
  columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
  data: T[];
  emptyText?: string;
}) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <Table className="min-w-[600px] text-sm">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key as string} className="whitespace-nowrap">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    {emptyText}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell key={col.key as string} className="whitespace-nowrap">
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default function DataTamuPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as { invitationId: string; title: string };
  const user_id = invitationId;

  const [rsvpData, setRsvpData] = useState<RSVP[]>([]);
  const [transferData, setTransferData] = useState<Transfer[]>([]);
  const [aggregates, setAggregates] = useState<Aggregates>({
    bank_transfer_total_nominal: 0,
    rsvp_counts: { total: 0, hadir: 0, tidak_hadir: 0 },
  });
  const [rsvpPage, setRsvpPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch data
  async function fetchData() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        user_id: String(user_id),
        title: title || "",
        rsvp_page: String(rsvpPage),
        transfer_page: String(transferPage),
      });
      const url = `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_usermanage&${params.toString()}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === "success") {
        setRsvpData(json.data.rsmp);
        setTransferData(json.data.bank_transfer);
        setAggregates(json.data.aggregates);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching data", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rsvpPage, transferPage, title, user_id]);

  // Delete data
  async function deleteData(id: number, type: string) {
    if (!confirm(`Yakin hapus data ${type} dengan id ${id}?`)) return;
    try {
      const res = await fetch(
        "https://ccgnimex.my.id/v2/android/ginvite/index.php?action=delete_usermanage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, type }),
        }
      );
      const json = await res.json();
      alert(json.message);
      if (json.status === "success") fetchData();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting data", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  }

  // Table columns
  const rsvpColumns = [
    {
      key: "created_at",
      label: "Tanggal",
      render: (row: RSVP) => <span>{row.created_at || "-"}</span>,
    },
    { key: "nama", label: "Nama" },
    { key: "wa", label: "No HP" },
    { key: "ucapan", label: "Ucapan" },
    {
      key: "konfirmasi",
      label: "Konfirmasi",
      render: (row: RSVP) => (row.konfirmasi === "hadir" ? "✅" : "❌"),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (row: RSVP) => (
        <Button variant="ghost" size="icon" onClick={() => deleteData(row.id, "rsvp")}>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </Button>
      ),
    },
  ];

  const transferColumns = [
    { key: "nama_pemberi", label: "Nama" },
    {
      key: "nominal",
      label: "Nominal",
      render: (row: Transfer) => <>Rp {Number(row.nominal).toLocaleString("id-ID")}</>,
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (row: Transfer) => (
        <Button variant="ghost" size="icon" onClick={() => deleteData(row.id, "transfer")}>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="flex items-center bg-white shadow p-4 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
          <ChevronLeft className="h-6 w-6 text-pink-600" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-pink-700 truncate">
          Data Tamu – {decodeURIComponent(title || "")}
        </h1>
      </div>

      <div className="px-2 sm:px-4 py-4 space-y-4">
        <Tabs defaultValue="rsvp" className="space-y-2">
          <TabsList className="mb-4 bg-white shadow p-3 rounded flex gap-2">
            <TabsTrigger value="rsvp">Tamu RSVP</TabsTrigger>
            <TabsTrigger value="transfer">Tamu Transfer</TabsTrigger>
          </TabsList>

          {/* RSVP Tab */}
          <TabsContent value="rsvp">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6">
              <StatCard
                icon={<Eye className="mx-auto h-8 w-8 text-pink-600" />}
                label="Total RSVP"
                value={aggregates.rsvp_counts.total}
              />
              <StatCard
                icon={<ThumbsUp className="mx-auto h-8 w-8 text-pink-600" />}
                label="Hadir"
                value={aggregates.rsvp_counts.hadir}
              />
              <StatCard
                icon={<User className="mx-auto h-8 w-8 text-pink-600" />}
                label="Tidak Hadir"
                value={aggregates.rsvp_counts.tidak_hadir}
              />
            </div>
            <div className="bg-white shadow rounded-2xl p-4">
              <h2 className="text-lg font-semibold text-pink-700 mb-4">Daftar Tamu RSVP</h2>
              <div className="w-full">
                <TableResponsive columns={rsvpColumns} data={rsvpData} />
              </div>
              <Pagination
                page={rsvpPage}
                setPage={setRsvpPage}
                hasNext={rsvpData.length === 20}
                loading={loading}
              />
            </div>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer">
            <div className="bg-white shadow rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-semibold text-pink-700">Daftar Tamu Transfer</h2>
              <div className="bg-white shadow rounded-2xl p-4 flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <Wallet className="h-8 w-8 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gift yang Didapatkan</p>
                  <p className="text-2xl font-bold text-gray-800">
                    Rp {Number(aggregates.bank_transfer_total_nominal).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ini hanya perkiraan, karena belum valid.
                  </p>
                </div>
              </div>
              <div className="w-full">
                <TableResponsive columns={transferColumns} data={transferData} />
              </div>
              <Pagination
                page={transferPage}
                setPage={setTransferPage}
                hasNext={transferData.length === 20}
                loading={loading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// StatCard component
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white shadow rounded p-4 text-center flex flex-col items-center">
      {icon}
      <p className="mt-2 text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

// Pagination component
function Pagination({
  page,
  setPage,
  hasNext,
  loading,
}: {
  page: number;
  setPage: (n: number) => void;
  hasNext: boolean;
  loading: boolean;
}) {
  return (
    <div className="flex justify-between mt-4">
      <Button onClick={() => setPage(page - 1)} disabled={loading || page <= 1}>
        Prev Page
      </Button>
      <Button onClick={() => setPage(page + 1)} disabled={loading || !hasNext}>
        Next Page
      </Button>
    </div>
  );
}