"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  SearchIcon, SendIcon, CopyIcon, CheckCircle2Icon,
  XCircleIcon, LoaderIcon,
  UserCheckIcon, UserXIcon, ExternalLinkIcon,
  RefreshCwIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
interface RsvpEntry {
  id: number;
  content_id: number;
  nama: string;
  wa: string;
  ucapan: string;
  konfirmasi: "hadir" | "tidak hadir";
  created_at: string;
  judul_undangan: string;
  user_id: number;
  nama_pemilik: string;
  email_pemilik: string;
  wa_pemilik: string;
}

interface Stats {
  total_rsvp: number;
  hadir: number;
  tidak_hadir: number;
}

interface SendResult {
  status: boolean;
  detail?: string;
  reason?: string;
}

// ────────────────────────────────────────────
// Template pesan untuk tamu RSVP
// ────────────────────────────────────────────
const RSVP_TEMPLATES = [
  {
    id: "thanks_hadir",
    label: "✅ Terima Kasih — Hadir",
    message: `Halo Kak *{nama}* 🎉

Terima kasih sudah mengkonfirmasi kehadiran Anda! Kami sangat senang bisa bertemu Anda nanti di acara ini.

Sampai jumpa ya Kak! 🥳

Salam hangat,
*[Nama Penyelenggara]*`,
  },
  {
    id: "thanks_tidak",
    label: "🙏 Maklum — Tidak Hadir",
    message: `Halo Kak *{nama}* 🙏

Terima kasih sudah meluangkan waktu untuk memberikan konfirmasi. Kami sangat menghargainya.

Doa dan ucapan Anda sudah sangat berarti bagi kami 💛

Salam hangat,
*[Nama Penyelenggara]*`,
  },
  {
    id: "reminder_hadir",
    label: "🔔 Reminder Hari H",
    message: `Halo Kak *{nama}* 👋

Mengingatkan bahwa acara kami *sudah sangat dekat*! Kami sangat menantikan kehadiran Anda 🎊

Jangan lupa hadir ya Kak! 😊

Salam hangat,
*[Nama Penyelenggara]*`,
  },
  {
    id: "ucapan_balik",
    label: "💬 Balas Ucapan",
    message: `Halo Kak *{nama}* 😊

Terima kasih atas doa dan ucapan indahnya! 💖

Kami sangat terharu membacanya. Semoga kebaikan selalu kembali kepada Kakak dan keluarga 🙏

Salam hangat,
*[Nama Penyelenggara]*`,
  },
];

// ────────────────────────────────────────────
// Utils
// ────────────────────────────────────────────
const API_BASE = "https://ccgnimex.my.id/v2/android/ginvite/index.php";
const LIMIT = 25;

function formatPhone(nomor: string): string {
  if (!nomor) return "";
  const cleaned = nomor.trim().replace(/\s+/g, "");
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("+62")) return cleaned.slice(1);
  return cleaned;
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────
export default function RsvpTab() {
  const [rsvpList, setRsvpList] = useState<RsvpEntry[]>([]);
  const [stats, setStats] = useState<Stats>({ total_rsvp: 0, hadir: 0, tidak_hadir: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterKonfirmasi, setFilterKonfirmasi] = useState<"all" | "hadir" | "tidak hadir">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);


  const [copied, setCopied] = useState<string | null>(null);

  // Send dialog
  const [sendDialog, setSendDialog] = useState(false);
  const [selectedRsvp, setSelectedRsvp] = useState<RsvpEntry | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // ── Fetch ─────────────────────────────────
  const fetchRsvp = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        action: "get_rsvp",
        page: String(page),
        limit: String(LIMIT),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filterKonfirmasi !== "all") params.set("konfirmasi", filterKonfirmasi);

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data = await res.json();

      if (data.status === "success") {
        setRsvpList(data.data);
        setStats(data.stats ?? { total_rsvp: 0, hadir: 0, tidak_hadir: 0 });
        setTotalPages(data.pagination?.total_pages ?? 1);
        setTotalRecords(data.pagination?.total_records ?? 0);
      } else {
        setError(data.message ?? "Gagal memuat data RSVP");
      }
    } catch (e) {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterKonfirmasi]);

  // Debounce search input → update debouncedSearch setelah 400ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchRsvp(), 0);
    return () => clearTimeout(t);
  }, [fetchRsvp]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, filterKonfirmasi]);

  // ── Actions ───────────────────────────────
  const handleCopy = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopied(phone);
    setTimeout(() => setCopied(null), 2000);
  };

  const openSendDialog = (rsvp: RsvpEntry) => {
    setSelectedRsvp(rsvp);
    setMessage("");
    setSelectedTemplate("");
    setSendResult(null);
    setSendDialog(true);
    // Auto-select template berdasarkan konfirmasi
    const autoTpl = rsvp.konfirmasi === "hadir" ? "thanks_hadir" : "thanks_tidak";
    const tpl = RSVP_TEMPLATES.find((t) => t.id === autoTpl);
    if (tpl) {
      setMessage(tpl.message.replace(/{nama}/g, rsvp.nama || "Kak"));
      setSelectedTemplate(tpl.id);
    }
  };

  const applyTemplate = (templateId: string) => {
    const tpl = RSVP_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl || !selectedRsvp) return;
    setMessage(tpl.message.replace(/{nama}/g, selectedRsvp.nama || "Kak"));
    setSelectedTemplate(templateId);
  };

  const handleSend = async () => {
    if (!selectedRsvp || !message) return;
    setSending(true);
    setSendResult(null);
    try {
      const phone = formatPhone(selectedRsvp.wa);
      const res = await fetch("/api/crm/send-wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: phone, message, typing: true }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch {
      setSendResult({ status: false, reason: "Gagal terhubung ke server" });
    } finally {
      setSending(false);
    }
  };

  // ── Render ────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total RSVP (ada WA)",
            value: stats.total_rsvp,
            color: "from-violet-500 to-purple-600",
            sub: `${totalRecords} hasil filter`,
          },
          {
            label: "Konfirmasi Hadir",
            value: stats.hadir,
            color: "from-emerald-400 to-teal-500",
            sub: `${stats.total_rsvp ? Math.round((stats.hadir / stats.total_rsvp) * 100) : 0}% dari total`,
          },
          {
            label: "Tidak Hadir",
            value: stats.tidak_hadir,
            color: "from-rose-400 to-pink-500",
            sub: `${stats.total_rsvp ? Math.round((stats.tidak_hadir / stats.total_rsvp) * 100) : 0}% dari total`,
          },
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-md`}>
            <p className="text-2xl font-bold">{stat.value ?? "—"}</p>
            <p className="text-xs font-semibold text-white/90 mt-0.5">{stat.label}</p>
            <p className="text-xs text-white/60 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
          <Input
            placeholder="Cari nama tamu atau nomor WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-pink-200 focus:ring-pink-300"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "hadir", "tidak hadir"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilterKonfirmasi(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${
                filterKonfirmasi === k
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
              }`}
            >
              {k === "hadir" && <UserCheckIcon className="h-3 w-3" />}
              {k === "tidak hadir" && <UserXIcon className="h-3 w-3" />}
              {k === "all" ? "Semua" : k === "hadir" ? "Hadir" : "Tidak Hadir"}
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchRsvp()}
          className="p-2 rounded-xl border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors"
          title="Refresh"
        >
          <RefreshCwIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 flex items-center gap-2">
          <XCircleIcon className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-pink-100 overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-pink-50/50">
              <TableHead className="text-pink-700 font-semibold">Nama Tamu</TableHead>
              <TableHead className="text-pink-700 font-semibold">Nomor WA</TableHead>
              <TableHead className="text-pink-700 font-semibold">Konfirmasi</TableHead>
              <TableHead className="text-pink-700 font-semibold">Undangan</TableHead>
              <TableHead className="text-pink-700 font-semibold">Ucapan</TableHead>
              <TableHead className="text-pink-700 font-semibold">Tgl RSVP</TableHead>
              <TableHead className="text-pink-700 font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-gray-400">
                  <LoaderIcon className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Memuat data RSVP...
                </TableCell>
              </TableRow>
            ) : rsvpList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-gray-400">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm font-medium">Belum ada data RSVP dengan nomor WA</p>
                  <p className="text-xs mt-1 text-gray-300">
                    Data akan muncul saat tamu mengisi RSVP dengan nomor WA
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              rsvpList.map((rsvp) => (
                <TableRow key={rsvp.id} className="hover:bg-pink-50/40 transition-colors">
                  {/* Nama */}
                  <TableCell>
                    <div className="font-medium text-gray-800">{rsvp.nama}</div>
                  </TableCell>

                  {/* WA */}
                  <TableCell>
                    <span className="text-sm font-mono text-gray-600">{rsvp.wa}</span>
                  </TableCell>

                  {/* Konfirmasi */}
                  <TableCell>
                    <Badge
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        rsvp.konfirmasi === "hadir"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {rsvp.konfirmasi === "hadir" ? "✅ Hadir" : "❌ Tidak Hadir"}
                    </Badge>
                  </TableCell>

                  {/* Undangan */}
                  <TableCell>
                    <div className="text-xs">
                      {rsvp.judul_undangan ? (
                        <a
                          href={`https://papunda.com/undang/${rsvp.user_id}/${rsvp.judul_undangan}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-[120px]">{rsvp.judul_undangan}</span>
                          <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gray-300 italic">—</span>
                      )}
                      {rsvp.nama_pemilik && (
                        <div className="text-gray-400 mt-0.5">oleh: {rsvp.nama_pemilik}</div>
                      )}
                    </div>
                  </TableCell>

                  {/* Ucapan */}
                  <TableCell className="max-w-[180px]">
                    <p className="text-xs text-gray-400 italic truncate">
                      {rsvp.ucapan ? `"${rsvp.ucapan}"` : "—"}
                    </p>
                  </TableCell>

                  {/* Tanggal */}
                  <TableCell className="text-xs text-gray-400 whitespace-nowrap">
                    {rsvp.created_at
                      ? format(parseISO(rsvp.created_at), "dd MMM yy HH:mm")
                      : "—"}
                  </TableCell>

                  {/* Aksi */}
                  <TableCell className="text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => handleCopy(formatPhone(rsvp.wa))}
                        title="Copy nomor WA"
                        className="p-1.5 rounded-lg hover:bg-pink-100 text-pink-400 hover:text-pink-600 transition-colors"
                      >
                        {copied === formatPhone(rsvp.wa) ? (
                          <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openSendDialog(rsvp)}
                        title="Kirim WA"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                      >
                        <SendIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Halaman {page} dari {totalPages} · {totalRecords} data
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* Send WA Dialog */}
      <Dialog open={sendDialog} onOpenChange={setSendDialog}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-pink-700 flex items-center gap-2">
              <SendIcon className="h-4 w-4" />
              Kirim Pesan WA ke {selectedRsvp?.nama}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 flex items-center gap-2 flex-wrap mt-1">
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                {selectedRsvp?.wa && formatPhone(selectedRsvp.wa)}
              </span>
              {selectedRsvp?.konfirmasi && (
                <Badge
                  className={`text-xs ${
                    selectedRsvp.konfirmasi === "hadir"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {selectedRsvp.konfirmasi === "hadir" ? "✅ Hadir" : "❌ Tidak Hadir"}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Ucapan tamu (read-only preview) */}
            {selectedRsvp?.ucapan && (
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">Ucapan tamu:</p>
                <p className="text-sm text-gray-600 italic">"{selectedRsvp.ucapan}"</p>
              </div>
            )}

            {/* Template Picker */}
            <div>
              <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                Pilih Template
              </label>
              <div className="grid gap-2">
                {RSVP_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl.id)}
                    className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${
                      selectedTemplate === tpl.id
                        ? "bg-pink-50 border-pink-300 text-pink-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50"
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message editor */}
            <div>
              <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                Pesan
              </label>
              <Textarea
                rows={8}
                placeholder="Tulis pesan atau pilih template di atas..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-xl border-pink-200 focus:ring-pink-300 text-sm font-mono resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length} karakter</p>
            </div>

            {/* Result */}
            {sendResult && (
              <div
                className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                  sendResult.status
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {sendResult.status ? (
                  <CheckCircle2Icon className="h-4 w-4 mt-0.5 shrink-0" />
                ) : (
                  <XCircleIcon className="h-4 w-4 mt-0.5 shrink-0" />
                )}
                <span>
                  {sendResult.status
                    ? sendResult.detail || "Pesan berhasil dikirim!"
                    : sendResult.reason || "Gagal mengirim pesan"}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 text-gray-500"
                onClick={() => setSendDialog(false)}
              >
                Tutup
              </Button>
              <Button
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 gap-2"
                onClick={handleSend}
                disabled={!message || sending}
              >
                {sending ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                {sending ? "Mengirim..." : "Kirim WA"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
