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
  SearchIcon, PhoneIcon, SendIcon, CopyIcon,
  ExternalLinkIcon, CheckCircle2Icon, XCircleIcon,
  LoaderIcon, ChevronDownIcon, FilterIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface UserContact {
  id: number;
  user_id: number;
  title: string;
  status: number;
  updated_at: string;
  view: number;
  email: string;
  nomor_wa: string;
  first_name: string;
}

interface SendResult {
  status: boolean;
  detail?: string;
  reason?: string;
}

const DEFAULT_TEMPLATES = [
  {
    id: "followup_free",
    label: "Follow-up: Undangan Belum Aktif",
    message: `Halo Kak {nama} 👋

Kami dari *Papunda.com* mau menginfokan bahwa undangan digital Anda belum diaktifkan.

🔗 Link undangan: https://papunda.com/undang/{user_id}/{title}

✨ Aktifkan sekarang untuk dapatkan:
• ✅ RSVP & Konfirmasi Kehadiran
• 💰 Amplop Digital / Transfer
• 📱 QR Code Check-in
• 🎵 Custom Music

Hubungi kami untuk info lebih lanjut ya Kak 😊

Salam hangat,
*Tim Papunda.com* 💖`,
  },
  {
    id: "promo_blast",
    label: "Promosi: Diskon Spesial",
    message: `Halo Kak {nama} 🎉

Ada promo spesial dari *Papunda.com* khusus untuk Anda!

🎁 *Diskon Upgrade Premium* – terbatas waktu!
Nikmati semua fitur premium undangan digital dengan harga spesial.

🔗 Cek sekarang: https://papunda.com

Jangan sampai ketinggalan ya Kak 🙌

*Tim Papunda.com* 💖`,
  },
  {
    id: "reminder_expired",
    label: "Reminder: Undangan Segera Expired",
    message: `Halo Kak {nama} ⚠️

Undangan digital Anda di *Papunda.com* akan segera berakhir!

Perpanjang sekarang agar tamu masih bisa mengakses undangan Anda.

🔗 Link undangan: https://papunda.com/undang/{user_id}/{title}

Butuh bantuan? Chat kami langsung ya Kak 😊

*Tim Papunda.com* 💖`,
  },
];

function formatPhone(nomor: string): string {
  if (!nomor) return "";
  if (nomor.startsWith("0")) return "62" + nomor.slice(1);
  if (nomor.startsWith("+62")) return nomor.slice(1);
  return nomor;
}

export default function ContactsTab() {
  const [users, setUsers] = useState<UserContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "1" | "0">("all");
  const [visibleCount, setVisibleCount] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  // Send WA dialog
  const [sendDialog, setSendDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserContact | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_undangan&page=1&limit=200&type=update`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setUsers(data.data);
        setTotalRecords(data.pagination?.total_records ?? data.data.length);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => fetchContacts(), 400);
    return () => clearTimeout(t);
  }, [fetchContacts]);

  const filtered = users.filter((u) => {
    if (filterStatus === "1" && u.status !== 1) return false;
    if (filterStatus === "0" && u.status !== 0) return false;
    return true;
  });

  const handleCopy = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopied(phone);
    setTimeout(() => setCopied(null), 2000);
  };

  const openSendDialog = (user: UserContact) => {
    setSelectedUser(user);
    setMessage("");
    setSelectedTemplate("");
    setSendResult(null);
    setSendDialog(true);
  };

  const applyTemplate = (templateId: string) => {
    const tpl = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl || !selectedUser) return;
    let msg = tpl.message;
    msg = msg.replace(/{nama}/g, selectedUser.first_name || "Kak");
    msg = msg.replace(/{user_id}/g, String(selectedUser.user_id));
    msg = msg.replace(/{title}/g, selectedUser.title || "");
    setMessage(msg);
    setSelectedTemplate(templateId);
  };

  const handleSend = async () => {
    if (!selectedUser || !message) return;
    setSending(true);
    setSendResult(null);
    try {
      const phone = formatPhone(selectedUser.nomor_wa);
      const res = await fetch("/api/crm/send-wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: phone, message, typing: true, delay: "2" }),
      });
      const data = await res.json();
      setSendResult(data);
    } catch (err) {
      setSendResult({ status: false, reason: "Gagal terhubung ke server" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400" />
          <Input
            placeholder="Cari nama, email, WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-pink-200 focus:ring-pink-300"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "1", "0"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === s
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
              }`}
            >
              {s === "all" ? "Semua" : s === "1" ? "Premium" : "Free"}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-gray-400 font-medium">
          {filtered.length} kontak
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-pink-100 overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-pink-50/50">
              <TableHead className="text-pink-700 font-semibold">Nama / Email</TableHead>
              <TableHead className="text-pink-700 font-semibold">Nomor WA</TableHead>
              <TableHead className="text-pink-700 font-semibold">Status</TableHead>
              <TableHead className="text-pink-700 font-semibold">Update</TableHead>
              <TableHead className="text-pink-700 font-semibold text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                  <LoaderIcon className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Memuat kontak...
                </TableCell>
              </TableRow>
            ) : filtered.slice(0, visibleCount).map((user) => (
              <TableRow key={user.id} className="hover:bg-pink-50/40 transition-colors">
                <TableCell>
                  <div className="font-medium text-gray-800 truncate max-w-[180px]">
                    {user.first_name || "—"}
                  </div>
                  <div className="text-xs text-gray-400 truncate max-w-[180px]">{user.email}</div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono text-gray-700">
                    {user.nomor_wa || <span className="text-gray-300 italic">tidak ada</span>}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      user.status === 1
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {user.status === 1 ? "Premium" : "Free"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-400">
                  {user.updated_at
                    ? format(parseISO(user.updated_at), "dd MMM yy HH:mm")
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1.5 justify-end">
                    {user.nomor_wa && (
                      <>
                        <button
                          onClick={() => handleCopy(formatPhone(user.nomor_wa))}
                          title="Copy nomor"
                          className="p-1.5 rounded-lg hover:bg-pink-100 text-pink-400 hover:text-pink-600 transition-colors"
                        >
                          {copied === formatPhone(user.nomor_wa) ? (
                            <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openSendDialog(user)}
                          title="Kirim WA"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                        >
                          <SendIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <a
                      href={`https://papunda.com/undang/${user.user_id}/${user.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Load More */}
      {filtered.length > visibleCount && (
        <div className="text-center">
          <Button
            variant="outline"
            className="rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50"
            onClick={() => setVisibleCount((v) => v + 15)}
          >
            Tampilkan Lebih Banyak <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
      <p className="text-center text-xs text-gray-400">
        Menampilkan {Math.min(visibleCount, filtered.length)} dari {filtered.length} kontak
      </p>

      {/* Send WA Dialog */}
      <Dialog open={sendDialog} onOpenChange={setSendDialog}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-pink-700">
              Kirim Pesan ke {selectedUser?.first_name || selectedUser?.email}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              {selectedUser?.nomor_wa && (
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {formatPhone(selectedUser.nomor_wa)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Template Picker */}
            <div>
              <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                Pilih Template
              </label>
              <div className="grid gap-2">
                {DEFAULT_TEMPLATES.map((tpl) => (
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

            {/* Message Editor */}
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
              <p className="text-xs text-gray-400 mt-1 text-right">
                {message.length} karakter
              </p>
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
                <span>{sendResult.status ? (sendResult.detail || "Pesan berhasil dikirim!") : (sendResult.reason || "Gagal mengirim pesan")}</span>
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
