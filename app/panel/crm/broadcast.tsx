"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  SendIcon, PlusIcon, PencilIcon, TrashIcon,
  CheckCircle2Icon, XCircleIcon, LoaderIcon,
  SaveIcon, EyeIcon, AlertCircleIcon, ZapIcon,
  UsersIcon, MessageSquareIcon, SettingsIcon,
} from "lucide-react";

// =============================================
// Types
// =============================================
interface Template {
  id: string;
  label: string;
  category: "followup" | "promo" | "reminder" | "ucapan" | "custom";
  message: string;
}

interface BroadcastTarget {
  phone: string;
  name: string;
}

interface SendResult {
  status: boolean;
  detail?: string;
  reason?: string;
  target?: string[];
}

interface BroadcastLog {
  id: string;
  time: string;
  targetCount: number;
  template: string;
  status: "success" | "failed" | "partial";
}

// =============================================
// Default Templates
// =============================================
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "followup_free",
    label: "Follow-up: Undangan Belum Aktif",
    category: "followup",
    message: `Halo Kak {nama} 👋

Kami dari *Papunda.com* mau menginfokan bahwa undangan digital Anda belum diaktifkan premium.

🔗 Link undangan: https://papunda.com

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
    id: "promo_umum",
    label: "Promosi: Diskon Spesial",
    category: "promo",
    message: `Halo Kak {nama} 🎉

Ada promo spesial dari *Papunda.com* khusus untuk Anda!

🎁 *Diskon Upgrade Premium* – terbatas waktu!

Nikmati semua fitur premium undangan digital:
• RSVP Online
• Amplop Digital
• QR Code Check-in
• Music Custom
• & masih banyak lagi!

🔗 Kunjungi: https://papunda.com

Jangan sampai ketinggalan ya Kak 🙌

*Tim Papunda.com* 💖`,
  },
  {
    id: "reminder_expired",
    label: "Reminder: Undangan Mau Expired",
    category: "reminder",
    message: `Halo Kak {nama} ⚠️

Undangan digital Anda di *Papunda.com* akan segera berakhir!

Perpanjang sekarang agar tamu masih bisa mengakses undangan Anda.

🔗 Masuk ke dashboard: https://papunda.com/panel

Butuh bantuan? Langsung chat kami ya Kak 😊

*Tim Papunda.com* 💖`,
  },
  {
    id: "welcome_new",
    label: "Sambutan: User Baru",
    category: "ucapan",
    message: `Halo Kak {nama} 🎊

Selamat datang di *Papunda.com*! 

Kami sangat senang Kak sudah mempercayai kami untuk membuat undangan digital yang indah.

Jika ada yang perlu dibantu, langsung chat kami ya!

🔗 Dashboard Anda: https://papunda.com/panel

Salam hangat,
*Tim Papunda.com* 💖`,
  },
  {
    id: "repeat_buyer",
    label: "Apresiasi: Repeat Customer",
    category: "promo",
    message: `Halo Kak {nama} 💖

Terima kasih sudah kembali menggunakan *Papunda.com*! 

Sebagai pelanggan setia kami, Anda berhak mendapat penawaran eksklusif 🎁

Hubungi kami untuk info promo khusus repeat customer ya!

Salam hangat,
*Tim Papunda.com* 💖`,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  followup: "bg-blue-100 text-blue-700",
  promo: "bg-amber-100 text-amber-700",
  reminder: "bg-rose-100 text-rose-700",
  ucapan: "bg-emerald-100 text-emerald-700",
  custom: "bg-purple-100 text-purple-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  followup: "Follow-up",
  promo: "Promosi",
  reminder: "Reminder",
  ucapan: "Ucapan",
  custom: "Custom",
};

function formatPhone(nomor: string): string {
  if (!nomor) return "";
  const cleaned = nomor.trim().replace(/\s+/g, "");
  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("+62")) return cleaned.slice(1);
  return cleaned;
}

// =============================================
// Main Broadcast Component
// =============================================
export default function BroadcastTab() {
  const [activeSection, setActiveSection] = useState<"broadcast" | "templates">("broadcast");

  // --- Template state ---
  const [templates, setTemplates] = useState<Template[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("crm_templates");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_TEMPLATES;
  });
  const [editDialog, setEditDialog] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // --- Broadcast state ---
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [message, setMessage] = useState("");
  const [targetMode, setTargetMode] = useState<"manual" | "users_all" | "users_free" | "users_premium">("manual");
  const [manualNumbers, setManualNumbers] = useState("");
  const [delay, setDelay] = useState("3");
  const [typing, setTyping] = useState(true);

  const [contacts, setContacts] = useState<BroadcastTarget[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // --- Send state ---
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendLog, setSendLog] = useState<{ phone: string; name: string; status: "ok" | "fail"; msg: string }[]>([]);
  const [broadcastLogs, setBroadcastLogs] = useState<BroadcastLog[]>([]);
  const [previewDialog, setPreviewDialog] = useState(false);

  // Save templates to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("crm_templates", JSON.stringify(templates));
    }
  }, [templates]);

  // Fetch contacts based on mode
  const fetchContacts = useCallback(async (mode: string) => {
    if (mode === "manual") {
      setContacts([]);
      return;
    }
    setLoadingContacts(true);
    try {
      const url = `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_undangan&page=1&limit=500&type=update`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        const raw = data.data as { nomor_wa: string; first_name: string; status: number }[];
        let filtered = raw.filter((u) => u.nomor_wa);
        if (mode === "users_free") filtered = filtered.filter((u) => u.status !== 1);
        if (mode === "users_premium") filtered = filtered.filter((u) => u.status === 1);
        setContacts(filtered.map((u) => ({ phone: formatPhone(u.nomor_wa), name: u.first_name || "" })));
      }
    } catch {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(targetMode);
  }, [targetMode, fetchContacts]);

  // Get final target list
  const getTargetList = (): BroadcastTarget[] => {
    if (targetMode === "manual") {
      return manualNumbers
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split("|");
          return { phone: formatPhone(parts[0]), name: parts[1] || "" };
        });
    }
    return contacts;
  };

  const targetList = getTargetList();

  // Apply template to message
  const applyTemplate = (tpl: Template) => {
    setSelectedTemplate(tpl);
    setMessage(tpl.message);
  };

  // Send broadcast
  const handleBroadcast = async () => {
    if (!message || targetList.length === 0) return;
    setSending(true);
    setSendProgress(0);
    setSendLog([]);

    const results: typeof sendLog = [];

    for (let i = 0; i < targetList.length; i++) {
      const target = targetList[i];
      let msg = message.replace(/{nama}/g, target.name || "Kak");

      try {
        const res = await fetch("/api/crm/send-wa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: target.phone,
            message: msg,
            typing,
            delay: i > 0 ? delay : "0",
          }),
        });
        const data: SendResult = await res.json();
        results.push({
          phone: target.phone,
          name: target.name,
          status: data.status ? "ok" : "fail",
          msg: data.status
            ? data.detail || "Terkirim"
            : data.reason || "Gagal",
        });
      } catch {
        results.push({ phone: target.phone, name: target.name, status: "fail", msg: "Error koneksi" });
      }

      setSendProgress(Math.round(((i + 1) / targetList.length) * 100));
      setSendLog([...results]);

      // Delay between sends (simulate)
      if (i < targetList.length - 1 && Number(delay) > 0) {
        await new Promise((r) => setTimeout(r, Number(delay) * 1000));
      }
    }

    const successCount = results.filter((r) => r.status === "ok").length;
    setBroadcastLogs((prev) => [
      {
        id: Date.now().toString(),
        time: new Date().toLocaleString("id-ID"),
        targetCount: targetList.length,
        template: selectedTemplate?.label || "Custom",
        status: successCount === targetList.length ? "success" : successCount === 0 ? "failed" : "partial",
      },
      ...prev.slice(0, 9),
    ]);

    setSending(false);
  };

  // Template CRUD
  const saveTemplate = (tpl: Template) => {
    if (tpl.id && templates.find((t) => t.id === tpl.id)) {
      setTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)));
    } else {
      setTemplates((prev) => [...prev, { ...tpl, id: Date.now().toString() }]);
    }
    setEditDialog(false);
    setEditTemplate(null);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const openNewTemplate = () => {
    setEditTemplate({
      id: "",
      label: "",
      category: "custom",
      message: "",
    });
    setEditDialog(true);
  };

  const openEditTemplate = (tpl: Template) => {
    setEditTemplate({ ...tpl });
    setEditDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 bg-pink-50/60 rounded-2xl p-1.5 w-fit">
        {[
          { key: "broadcast", label: "📢 Kirim Broadcast", icon: SendIcon },
          { key: "templates", label: "📝 Kelola Template", icon: MessageSquareIcon },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key as typeof activeSection)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeSection === s.key
                ? "bg-white shadow-sm text-pink-700"
                : "text-pink-500 hover:text-pink-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ===== BROADCAST SECTION ===== */}
      {activeSection === "broadcast" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT: Config */}
          <div className="xl:col-span-2 space-y-5">
            {/* Target Selection */}
            <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-pink-500" />
                Target Penerima
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { key: "manual", label: "Manual", desc: "Paste nomor sendiri" },
                  { key: "users_all", label: "Semua User", desc: "Yang ada nomor WA" },
                  { key: "users_free", label: "User Free", desc: "Belum premium" },
                  { key: "users_premium", label: "User Premium", desc: "Sudah premium" },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setTargetMode(m.key as typeof targetMode)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetMode === m.key
                        ? "bg-pink-50 border-pink-300 shadow-sm"
                        : "border-gray-200 hover:border-pink-200"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${targetMode === m.key ? "text-pink-700" : "text-gray-700"}`}>
                      {m.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>

              {targetMode === "manual" ? (
                <div>
                  <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                    Daftar Nomor (satu per baris, format: 628xxx atau 08xxx|Nama)
                  </label>
                  <Textarea
                    rows={5}
                    placeholder={"6281234567890|Budi\n6289876543210|Ani\n08123456789"}
                    value={manualNumbers}
                    onChange={(e) => setManualNumbers(e.target.value)}
                    className="rounded-xl border-pink-200 focus:ring-pink-300 text-sm font-mono resize-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  {loadingContacts ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                      Memuat kontak...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-pink-50 rounded-xl text-sm font-semibold text-pink-700 border border-pink-200">
                        {contacts.length} kontak ditemukan
                      </div>
                      {contacts.length === 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <AlertCircleIcon className="h-3 w-3" /> Tidak ada kontak dengan nomor WA
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Template Picker */}
            <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MessageSquareIcon className="h-4 w-4 text-pink-500" />
                Pilih Template Pesan
              </h3>
              <div className="grid gap-2 mb-4 max-h-64 overflow-y-auto pr-1">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl)}
                    className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                      selectedTemplate?.id === tpl.id
                        ? "bg-pink-50 border-pink-300 text-pink-700 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-pink-200 hover:bg-pink-50/50"
                    }`}
                  >
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${CATEGORY_COLORS[tpl.category]}`}>
                      {CATEGORY_LABELS[tpl.category]}
                    </span>
                    <span className="truncate">{tpl.label}</span>
                    {selectedTemplate?.id === tpl.id && (
                      <CheckCircle2Icon className="h-4 w-4 text-pink-500 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                Edit Pesan
                <span className="normal-case font-normal text-gray-400 ml-2">
                  Gunakan {"{nama}"} untuk nama otomatis
                </span>
              </label>
              <Textarea
                rows={10}
                placeholder="Pilih template di atas atau tulis pesan langsung..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-xl border-pink-200 focus:ring-pink-300 text-sm font-mono resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length} karakter</p>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <SettingsIcon className="h-4 w-4 text-pink-500" />
                Pengaturan Kirim
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                    Delay antar pesan (detik)
                  </label>
                  <Input
                    type="number"
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                    className="rounded-xl border-pink-200 focus:ring-pink-300"
                    min="0"
                    max="60"
                  />
                  <p className="text-xs text-gray-400 mt-1">Min 0, rekomen 3–5 detik</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                    Typing Indicator
                  </label>
                  <button
                    onClick={() => setTyping(!typing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      typing
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${typing ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
                      {typing && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    {typing ? "Aktif" : "Nonaktif"}
                  </button>
                  <p className="text-xs text-gray-400 mt-1">Terlihat seperti mengetik</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary + Send */}
          <div className="space-y-5">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4">Ringkasan Broadcast</h3>
              <div className="space-y-3">
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="text-xs text-white/70">Target</div>
                  <div className="text-2xl font-bold mt-0.5">{targetList.length}</div>
                  <div className="text-xs text-white/70">nomor WA</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="text-xs text-white/70">Template</div>
                  <div className="text-sm font-semibold mt-0.5 truncate">
                    {selectedTemplate?.label || <span className="italic opacity-60">Belum dipilih</span>}
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="text-xs text-white/70">Estimasi Durasi</div>
                  <div className="text-sm font-semibold mt-0.5">
                    {targetList.length > 0
                      ? `~${Math.ceil((targetList.length * Number(delay)) / 60)} menit`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50 gap-2"
                onClick={() => setPreviewDialog(true)}
                disabled={!message}
              >
                <EyeIcon className="h-4 w-4" />
                Preview Pesan
              </Button>
              <Button
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg gap-2 py-6 text-base font-semibold"
                onClick={handleBroadcast}
                disabled={sending || !message || targetList.length === 0}
              >
                {sending ? (
                  <>
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                    Mengirim... {sendProgress}%
                  </>
                ) : (
                  <>
                    <ZapIcon className="h-5 w-5" />
                    Kirim Broadcast ({targetList.length})
                  </>
                )}
              </Button>
            </div>

            {/* Progress */}
            {sending && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span>{sendProgress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${sendProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Send Log */}
            {sendLog.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm max-h-64 overflow-y-auto">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Log Pengiriman
                </h4>
                <div className="space-y-2">
                  {sendLog.map((log, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                        log.status === "ok"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {log.status === "ok" ? (
                        <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <XCircleIcon className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span className="font-mono font-medium">{log.phone}</span>
                      {log.name && <span className="text-gray-400">({log.name})</span>}
                      <span className="ml-auto">{log.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Broadcast History */}
            {broadcastLogs.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Riwayat Broadcast
                </h4>
                <div className="space-y-2">
                  {broadcastLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-2 text-xs text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          log.status === "success"
                            ? "bg-emerald-400"
                            : log.status === "failed"
                            ? "bg-red-400"
                            : "bg-amber-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{log.template}</div>
                        <div className="text-gray-400">{log.targetCount} target • {log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TEMPLATES SECTION ===== */}
      {activeSection === "templates" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">Template Pesan WA</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                Kelola template untuk follow-up, promosi, dan reminder
              </p>
            </div>
            <Button
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 gap-2"
              onClick={openNewTemplate}
            >
              <PlusIcon className="h-4 w-4" />
              Template Baru
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-400 to-purple-500" />
                <div className="pl-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[tpl.category]}`}>
                        {CATEGORY_LABELS[tpl.category]}
                      </span>
                      <h4 className="font-semibold text-gray-800 mt-1.5 text-sm">{tpl.label}</h4>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEditTemplate(tpl)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(tpl.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {tpl.message}
                  </p>
                  <button
                    onClick={() => {
                      applyTemplate(tpl);
                      setActiveSection("broadcast");
                    }}
                    className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                  >
                    <SendIcon className="h-3 w-3" />
                    Pakai untuk Broadcast
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-pink-700">Preview Pesan</DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Tampilan pesan yang akan diterima penerima
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 bg-[#E5DDD5] rounded-2xl p-4 min-h-[200px]">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm max-w-[80%] ml-auto">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {message.replace(/{nama}/g, "Kak Budi") || "Tulis pesan dulu..."}
              </p>
              <p className="text-right text-xs text-gray-400 mt-1">16:00 ✓✓</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 text-gray-500 mt-2"
            onClick={() => setPreviewDialog(false)}
          >
            Tutup
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-pink-700">
              {editTemplate?.id ? "Edit Template" : "Buat Template Baru"}
            </DialogTitle>
          </DialogHeader>
          {editTemplate && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                  Nama Template
                </label>
                <Input
                  value={editTemplate.label}
                  onChange={(e) => setEditTemplate({ ...editTemplate, label: e.target.value })}
                  placeholder="Contoh: Follow-up Undangan Belum Aktif"
                  className="rounded-xl border-pink-200 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                  Kategori
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["followup", "promo", "reminder", "ucapan", "custom"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEditTemplate({ ...editTemplate, category: cat })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        editTemplate.category === cat
                          ? CATEGORY_COLORS[cat] + " ring-2 ring-offset-1 ring-current"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1.5 block">
                  Isi Pesan
                  <span className="normal-case font-normal text-gray-400 ml-2">
                    Gunakan {"{nama}"}, {"{user_id}"}, {"{title}"} sebagai variabel
                  </span>
                </label>
                <Textarea
                  rows={10}
                  value={editTemplate.message}
                  onChange={(e) => setEditTemplate({ ...editTemplate, message: e.target.value })}
                  placeholder="Tulis isi pesan template..."
                  className="rounded-xl border-pink-200 focus:ring-pink-300 text-sm font-mono resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200 text-gray-500"
                  onClick={() => { setEditDialog(false); setEditTemplate(null); }}
                >
                  Batal
                </Button>
                <Button
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 gap-2"
                  onClick={() => editTemplate && saveTemplate(editTemplate)}
                  disabled={!editTemplate.label || !editTemplate.message}
                >
                  <SaveIcon className="h-4 w-4" />
                  Simpan Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Template?</DialogTitle>
            <DialogDescription>
              Template ini akan dihapus permanen dan tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setDeleteConfirm(null)}
            >
              Batal
            </Button>
            <Button
              className="rounded-xl bg-red-500 text-white hover:bg-red-600"
              onClick={() => deleteConfirm && deleteTemplate(deleteConfirm)}
            >
              <TrashIcon className="h-4 w-4 mr-1.5" />
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
