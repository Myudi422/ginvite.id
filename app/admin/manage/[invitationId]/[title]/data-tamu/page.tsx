"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Eye,
  ThumbsUp,
  TrashIcon,
  UserX,
  Wallet,
  QrCode,
  Users,
  TrendingUp,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { fetchUserManageData, deleteUserManageData } from "@/app/actions/usermanage";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";

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

type QRAttendance = {
  id: number;
  nama: string;
  tanggal: string;
};

function formatToLocalTime(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

function formatDateShort(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

// ––– Stat Card –––
function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl p-4 text-white ${gradient} shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="bg-white/20 rounded-xl p-2">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs font-medium text-white/80 mt-1">{label}</p>
    </div>
  );
}

// ––– Search Input –––
function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari tamu..."
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-gray-50"
      />
    </div>
  );
}

// ––– RSVP Card (Mobile) –––
function RSVPCard({
  row,
  onDelete,
}: {
  row: RSVP;
  onDelete: () => void;
}) {
  const hadir = row.konfirmasi === "hadir";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`h-1.5 ${hadir ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-rose-400 to-pink-400"}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${hadir ? "bg-emerald-500" : "bg-rose-500"}`}>
              {row.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{row.nama}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {hadir ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">Hadir</span></>
                ) : (
                  <><XCircle className="h-3.5 w-3.5 text-rose-500" /><span className="text-xs text-rose-500 font-medium">Tidak Hadir</span></>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {row.ucapan && (
          <div className="mt-3 bg-pink-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 italic line-clamp-2">"{row.ucapan}"</p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Phone className="h-3.5 w-3.5" />
            <span>{row.wa || "-"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateShort(row.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ––– Transfer Card (Mobile) –––
function TransferCard({
  row,
  onDelete,
}: {
  row: Transfer;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-violet-400 to-purple-500" />
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
            {row.nama_pemberi.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{row.nama_pemberi}</p>
            <p className="text-sm font-bold text-violet-600 mt-0.5">
              Rp {Number(row.nominal).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ––– QR Card (Mobile) –––
function QRCard({
  row,
  onDelete,
}: {
  row: QRAttendance;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {row.nama.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{row.nama}</p>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDateShort(row.tanggal)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ––– Desktop Table –––
function DesktopTable<T>({
  columns,
  data,
}: {
  columns: ColumnDef<T, any>[];
  data: T[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Users className="mx-auto h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm">Belum ada data</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="bg-gradient-to-r from-pink-50 to-rose-50">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-pink-700 uppercase tracking-wide cursor-pointer select-none"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === "asc" ? " ↑" : h.column.getIsSorted() === "desc" ? " ↓" : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-t border-gray-100 hover:bg-pink-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ––– Pagination –––
function Pagination({
  page,
  onPrev,
  onNext,
  hasMore,
  loading,
}: {
  page: number;
  onPrev: () => void;
  onNext: () => void;
  hasMore: boolean;
  loading: boolean;
}) {
  if (page <= 1 && !hasMore) return null;
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={page <= 1 || loading}
        className="rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
      >
        ← Sebelumnya
      </Button>
      <span className="text-sm text-gray-500 font-medium">Halaman {page}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasMore || loading}
        className="rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
      >
        Berikutnya →
      </Button>
    </div>
  );
}

// ––––––– Main Page –––––––
export default function DataTamuPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };
  const user_id = invitationId;

  const [rsvpData, setRsvpData] = useState<RSVP[]>([]);
  const [transferData, setTransferData] = useState<Transfer[]>([]);
  const [qrAttendanceData, setQrAttendanceData] = useState<QRAttendance[]>([]);
  const [aggregates, setAggregates] = useState({
    bank_transfer_total_nominal: 0,
    rsvp_counts: { total: 0, hadir: 0, tidak_hadir: 0 },
    qr_attendance_total: 0,
  });
  const [rsvpPage, setRsvpPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);
  const [qrAttendancePage, setQrAttendancePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rsvpSearch, setRsvpSearch] = useState("");
  const [transferSearch, setTransferSearch] = useState("");
  const [qrSearch, setQrSearch] = useState("");

  async function fetchData() {
    setLoading(true);
    try {
      const params = {
        user_id: String(user_id),
        title: title || "",
        rsvp_page: String(rsvpPage),
        transfer_page: String(transferPage),
        qr_attendance_page: String(qrAttendancePage),
      };
      const data = await fetchUserManageData(params);
      setRsvpData(data.rsmp);
      setTransferData(data.bank_transfer);
      setQrAttendanceData(data.qr_attendance || []);
      setAggregates({
        ...data.aggregates,
        qr_attendance_total: data.qr_attendance_total || 0,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [rsvpPage, transferPage, qrAttendancePage, title, user_id]);

  async function deleteData(id: number, type: string) {
    if (!confirm(`Yakin hapus data ${type} ini?`)) return;
    try {
      await deleteUserManageData(id, type);
      fetchData();
    } catch (error) {
      console.error("Error deleting data", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  }

  // Filtered data
  const filteredRsvp = useMemo(
    () => rsvpData.filter((r) => r.nama.toLowerCase().includes(rsvpSearch.toLowerCase())),
    [rsvpData, rsvpSearch]
  );
  const filteredTransfer = useMemo(
    () => transferData.filter((r) => r.nama_pemberi.toLowerCase().includes(transferSearch.toLowerCase())),
    [transferData, transferSearch]
  );
  const filteredQr = useMemo(
    () => qrAttendanceData.filter((r) => r.nama.toLowerCase().includes(qrSearch.toLowerCase())),
    [qrAttendanceData, qrSearch]
  );

  // Column defs
  const rsvpColumnHelper = createColumnHelper<RSVP>();
  const rsvpColumns = useMemo<ColumnDef<RSVP, any>[]>(
    () => [
      rsvpColumnHelper.accessor("created_at", {
        header: "Tanggal",
        cell: (info) => (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDateShort(info.getValue() || "")}
          </span>
        ),
      }),
      rsvpColumnHelper.accessor("nama", {
        header: "Nama",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {info.getValue().charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-800">{info.getValue()}</span>
          </div>
        ),
      }),
      rsvpColumnHelper.accessor("wa", {
        header: "No HP",
        cell: (info) => (
          <span className="text-xs text-gray-600">{info.getValue() || "-"}</span>
        ),
      }),
      rsvpColumnHelper.accessor("ucapan", {
        header: "Ucapan",
        cell: (info) => (
          <span className="text-xs text-gray-600 line-clamp-2 max-w-[180px] block">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      rsvpColumnHelper.accessor("konfirmasi", {
        header: "Status",
        cell: (info) =>
          info.getValue() === "hadir" ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="h-3 w-3" /> Hadir
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-medium">
              <XCircle className="h-3 w-3" /> Tidak Hadir
            </span>
          ),
      }),
      {
        id: "aksi",
        header: "Aksi",
        enableSorting: false,
        cell: ({ row }: any) => (
          <button
            onClick={() => deleteData(row.original.id, "rsvp")}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ),
      },
    ],
    []
  );

  const transferColumnHelper = createColumnHelper<Transfer>();
  const transferColumns = useMemo<ColumnDef<Transfer, any>[]>(
    () => [
      transferColumnHelper.accessor("nama_pemberi", {
        header: "Nama",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {info.getValue().charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-800">{info.getValue()}</span>
          </div>
        ),
      }),
      transferColumnHelper.accessor("nominal", {
        header: "Nominal",
        cell: (info) => (
          <span className="font-semibold text-violet-600">
            Rp {Number(info.getValue()).toLocaleString("id-ID")}
          </span>
        ),
      }),
      {
        id: "aksi",
        header: "Aksi",
        enableSorting: false,
        cell: ({ row }: any) => (
          <button
            onClick={() => deleteData(row.original.id, "transfer")}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ),
      },
    ],
    []
  );

  const qrAttendanceColumnHelper = createColumnHelper<QRAttendance>();
  const qrAttendanceColumns = useMemo<ColumnDef<QRAttendance, any>[]>(
    () => [
      qrAttendanceColumnHelper.accessor("tanggal", {
        header: "Tanggal",
        cell: (info) => (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDateShort(info.getValue() || "")}
          </span>
        ),
      }),
      qrAttendanceColumnHelper.accessor("nama", {
        header: "Nama",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {info.getValue().charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-800">{info.getValue()}</span>
          </div>
        ),
      }),
      {
        id: "aksi",
        header: "Aksi",
        enableSorting: false,
        cell: ({ row }: any) => (
          <button
            onClick={() => deleteData(row.original.id, "qr_attendance")}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center p-4 max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-pink-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-pink-600" />
          </button>
          <div className="ml-3 min-w-0">
            <h1 className="text-base font-bold text-gray-800 truncate">Data Tamu</h1>
            <p className="text-xs text-pink-500 truncate">{decodeURIComponent(title || "")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:px-8 space-y-5 pb-10">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            label="Total RSVP"
            value={aggregates.rsvp_counts.total}
            gradient="bg-gradient-to-br from-pink-500 to-rose-500"
          />
          <StatCard
            icon={CheckCircle2}
            label="Bersedia Hadir"
            value={aggregates.rsvp_counts.hadir}
            gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
          />
          <StatCard
            icon={QrCode}
            label="Check-in QR"
            value={aggregates.qr_attendance_total}
            gradient="bg-gradient-to-br from-blue-400 to-cyan-500"
          />
          <StatCard
            icon={Wallet}
            label="Gift Terkumpul"
            value={`Rp ${Number(aggregates.bank_transfer_total_nominal).toLocaleString("id-ID")}`}
            gradient="bg-gradient-to-br from-violet-500 to-purple-500"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rsvp" className="space-y-4">
          <TabsList className="w-full bg-white shadow-sm rounded-2xl p-1.5 border border-gray-100">
            <TabsTrigger
              value="rsvp"
              className="flex-1 rounded-xl text-xs sm:text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-all"
            >
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              RSVP
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="flex-1 rounded-xl text-xs sm:text-sm data-[state=active]:bg-violet-500 data-[state=active]:text-white transition-all"
            >
              <Wallet className="h-3.5 w-3.5 mr-1" />
              Transfer
            </TabsTrigger>
            <TabsTrigger
              value="qr_attendance"
              className="flex-1 rounded-xl text-xs sm:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
            >
              <QrCode className="h-3.5 w-3.5 mr-1" />
              QR
            </TabsTrigger>
          </TabsList>

          {/* ───── Tab RSVP ───── */}
          <TabsContent value="rsvp" className="space-y-4">
            {/* Hadir/Tidak card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-gray-500">Hadir</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600">{aggregates.rsvp_counts.hadir}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-rose-500" />
                  <span className="text-xs text-gray-500">Tidak Hadir</span>
                </div>
                <p className="text-2xl font-bold text-rose-500">{aggregates.rsvp_counts.tidak_hadir}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Daftar Tamu RSVP</h2>
              <SearchInput value={rsvpSearch} onChange={setRsvpSearch} />

              {/* Mobile */}
              <div className="md:hidden space-y-3">
                {filteredRsvp.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">Belum ada data</p>
                  </div>
                ) : (
                  filteredRsvp.map((row) => (
                    <RSVPCard
                      key={row.id}
                      row={row}
                      onDelete={() => deleteData(row.id, "rsvp")}
                    />
                  ))
                )}
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <DesktopTable columns={rsvpColumns} data={filteredRsvp} />
              </div>

              <Pagination
                page={rsvpPage}
                onPrev={() => setRsvpPage(rsvpPage - 1)}
                onNext={() => setRsvpPage(rsvpPage + 1)}
                hasMore={rsvpData.length === 20}
                loading={loading}
              />
            </div>
          </TabsContent>

          {/* ───── Tab Transfer ───── */}
          <TabsContent value="transfer" className="space-y-4">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <p className="text-sm text-white/80 mb-1">Total Gift Terkumpul</p>
              <p className="text-3xl font-bold">
                Rp {Number(aggregates.bank_transfer_total_nominal).toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-white/60 mt-1">*Perkiraan, belum divalidasi</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Daftar Tamu Transfer</h2>
              <SearchInput value={transferSearch} onChange={setTransferSearch} />

              {/* Mobile */}
              <div className="md:hidden space-y-3">
                {filteredTransfer.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Wallet className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">Belum ada data</p>
                  </div>
                ) : (
                  filteredTransfer.map((row) => (
                    <TransferCard
                      key={row.id}
                      row={row}
                      onDelete={() => deleteData(row.id, "transfer")}
                    />
                  ))
                )}
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <DesktopTable columns={transferColumns} data={filteredTransfer} />
              </div>

              <Pagination
                page={transferPage}
                onPrev={() => setTransferPage(transferPage - 1)}
                onNext={() => setTransferPage(transferPage + 1)}
                hasMore={transferData.length === 20}
                loading={loading}
              />
            </div>
          </TabsContent>

          {/* ───── Tab QR ───── */}
          <TabsContent value="qr_attendance" className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg">
              <p className="text-sm text-white/80 mb-1">Total Check-in via QR</p>
              <p className="text-3xl font-bold">{aggregates.qr_attendance_total} Tamu</p>
              <p className="text-xs text-white/60 mt-1">Semua tamu yang sudah scan QR</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Daftar Tamu QR</h2>
              <SearchInput value={qrSearch} onChange={setQrSearch} />

              {/* Mobile */}
              <div className="md:hidden space-y-3">
                {filteredQr.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <QrCode className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">Belum ada data</p>
                  </div>
                ) : (
                  filteredQr.map((row) => (
                    <QRCard
                      key={row.id}
                      row={row}
                      onDelete={() => deleteData(row.id, "qr_attendance")}
                    />
                  ))
                )}
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <DesktopTable columns={qrAttendanceColumns} data={filteredQr} />
              </div>

              <Pagination
                page={qrAttendancePage}
                onPrev={() => setQrAttendancePage(qrAttendancePage - 1)}
                onNext={() => setQrAttendancePage(qrAttendancePage + 1)}
                hasMore={qrAttendanceData.length === 20}
                loading={loading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}