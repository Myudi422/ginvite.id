'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveBulkDraft, loadBulkDraft } from '@/app/actions/bulkDrafts';
import {
    ClipboardCopy,
    LinkIcon,
    ChevronLeft,
    Send,
    Check,
    Save,
    Upload,
    Users,
    Zap,
    ChevronRight,
    CheckCircle2,
    Circle,
    CopyCheck,
    FileText,
} from 'lucide-react';

type Item = {
    link: string;
    invitation: string;
    name: string;
    phone?: string;
};

// ─── Step Badge ───
function StepBadge({ n, label }: { n: number; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {n}
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
    );
}

export default function BulkUndanganPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { invitationId, title } = useParams() as {
        invitationId: string;
        title: string;
    };

    const [names, setNames] = useState('');
    const [template, setTemplate] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [loadingTemplate, setLoadingTemplate] = useState(true);
    const [errorLoadingTemplate, setErrorLoadingTemplate] = useState<string | null>(null);
    const [isDraftSaving, setIsDraftSaving] = useState(false);
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
    const [invitationChecklist, setInvitationChecklist] = useState<Set<string>>(new Set());

    const saveDraft = useCallback(async (namesText: string, templateText: string) => {
        if (!namesText.trim() && !templateText.trim()) return;
        setIsDraftSaving(true);
        try {
            const result = await saveBulkDraft({
                user_id: invitationId,
                invitation_title: title,
                names_list: namesText,
                template_text: templateText,
                checklist_data: JSON.stringify(Array.from(invitationChecklist)),
            });
            if (!result.success) throw new Error(result.message || 'Save failed');
        } catch (error) {
            console.error('Error saving draft:', error);
        } finally {
            setIsDraftSaving(false);
        }
    }, [invitationId, title, invitationChecklist]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingTemplate(true);
            setErrorLoadingTemplate(null);
            try {
                const draftData = await loadBulkDraft(invitationId, title);
                if (draftData) {
                    setNames(draftData.names_list || '');
                    if (draftData.checklist_data) {
                        try {
                            setInvitationChecklist(new Set(JSON.parse(draftData.checklist_data)));
                        } catch { }
                    }
                    if (draftData.template_text) {
                        setTemplate(draftData.template_text);
                        setLoadingTemplate(false);
                        if (draftData.names_list?.trim()) {
                            setTimeout(() => autoGenerateFromDraft(draftData.names_list, draftData.template_text), 500);
                        }
                        return;
                    }
                }
                const res = await fetch(
                    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_bulk&user_id=${invitationId}&title=${encodeURIComponent(title)}`
                );
                if (!res.ok) throw new Error(`Gagal memuat template: ${res.status}`);
                const data = await res.json();
                if (data?.status === 'success' && data.data?.length > 0) {
                    let raw = data.data[0].text_undangan as string;
                    raw = raw.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '').replace(/\r\n/g, '\n');
                    setTemplate(raw);
                } else {
                    setErrorLoadingTemplate('Template undangan tidak ditemukan.');
                }
            } catch (e: any) {
                setErrorLoadingTemplate(e.message);
            } finally {
                setLoadingTemplate(false);
            }
        };
        if (invitationId && title) fetchData();
    }, [invitationId, title]);

    useEffect(() => {
        const id = setTimeout(() => { if (names || template) saveDraft(names, template); }, 5000);
        return () => clearTimeout(id);
    }, [names, template, saveDraft]);

    useEffect(() => {
        const id = setTimeout(() => { if (invitationChecklist.size > 0 || names || template) saveDraft(names, template); }, 2000);
        return () => clearTimeout(id);
    }, [invitationChecklist, names, template, saveDraft]);

    const parseNameAndPhone = (text: string) => {
        const match = text.match(/^(.+?)\s*-\s*([0-9\s\+]+)$/);
        if (match) return { name: match[1].trim(), phone: match[2].trim().replace(/\s/g, '') };
        return { name: text.trim(), phone: undefined };
    };

    const formatPhoneNumber = (phone: string): string => {
        let cleaned = phone.replace(/[^\d]/g, '');
        if (cleaned.startsWith('62')) cleaned = '0' + cleaned.substring(2);
        else if (!cleaned.startsWith('0')) cleaned = '0' + cleaned;
        return cleaned;
    };

    const parseCSVContacts = (csvText: string) => {
        const lines = csvText.trim().split('\n');
        const contacts: string[] = [];
        if (!lines.length) return contacts;
        const headers = lines[0].split(',').map(h => h.trim());
        const nameIndex = headers.findIndex(h => ['first name', 'name', 'given name'].includes(h.toLowerCase()));
        const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone') && h.toLowerCase().includes('value'));
        for (let i = 1; i < lines.length; i++) {
            const cells = lines[i].trim().split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            const name = nameIndex >= 0 ? cells[nameIndex] : '';
            const phone = phoneIndex >= 0 ? cells[phoneIndex]?.replace(/\s/g, '') : '';
            if (name) {
                const fp = phone ? formatPhoneNumber(phone) : '';
                contacts.push(fp ? `${name} - ${fp}` : name);
            }
        }
        return contacts;
    };

    const handleContactFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            if (file.name.endsWith('.csv')) {
                const contacts = parseCSVContacts(text);
                if (!contacts.length) {
                    toast({ title: '❌ Tidak Ada Kontak', description: 'File CSV tidak memiliki kontak valid', variant: 'destructive', duration: 2000 });
                    return;
                }
                setNames(prev => prev ? `${prev}\n${contacts.join('\n')}` : contacts.join('\n'));
                toast({ title: `✅ ${contacts.length} kontak diimport!`, duration: 2000 });
            } else {
                toast({ title: '❌ Format Tidak Didukung', description: 'Hanya file CSV', variant: 'destructive', duration: 2000 });
            }
        } catch {
            toast({ title: '❌ Gagal Import', variant: 'destructive', duration: 2000 });
        }
        if (e.target) e.target.value = '';
    };

    const autoGenerateFromDraft = (namesText: string, templateText: string) => {
        const nameList = namesText.split('\n').map(n => n.trim()).filter(Boolean);
        const newItems = nameList.map(n => {
            const { name, phone } = parseNameAndPhone(n);
            const link = `${window.location.origin}/undang/${invitationId}/${title}?to=${encodeURIComponent(name)}`;
            const invitation = templateText.replace(/{nama}/g, name).replace(/{link_undangan}/g, link);
            return { link, invitation, name, phone };
        });
        setItems(newItems);
        setPage(1);
        toast({ title: '🎉 Draft Loaded!', description: `${newItems.length} undangan siap`, duration: 2000 });
    };

    const handleGenerate = () => {
        const nameList = names.split('\n').map(n => n.trim()).filter(Boolean);
        const newItems = nameList.map(n => {
            const { name, phone } = parseNameAndPhone(n);
            const link = `${window.location.origin}/undang/${invitationId}/${title}?to=${encodeURIComponent(name)}`;
            const invitation = template.replace(/{nama}/g, name).replace(/{link_undangan}/g, link);
            return { link, invitation, name, phone };
        });
        setItems(newItems);
        setPage(1);
        toast({ title: '✅ Link Berhasil Dibuat!', description: `${newItems.length} undangan siap dikirim`, duration: 2500 });
    };

    const handleCopyLink = async (link: string, index: number) => {
        try {
            await navigator.clipboard.writeText(link);
            const key = `link-${index}`;
            setCopiedItems(prev => new Set([...prev, key]));
            toast({ title: '✅ Link Disalin!', duration: 1500 });
            setTimeout(() => setCopiedItems(prev => { const s = new Set(prev); s.delete(key); return s; }), 3000);
        } catch {
            toast({ title: '❌ Gagal Menyalin', variant: 'destructive', duration: 1500 });
        }
    };

    const handleCopyInvitation = async (inv: string, index: number, phone?: string) => {
        try {
            await navigator.clipboard.writeText(inv);
            const key = `invitation-${index}`;
            setCopiedItems(prev => new Set([...prev, key]));
            const waMessage = encodeURIComponent(inv);
            let waUrl = `https://wa.me/?text=${waMessage}`;
            if (phone) {
                let p = phone.replace(/\s/g, '');
                if (p.startsWith('0')) p = '62' + p.substring(1);
                if (!p.startsWith('+')) p = '+' + p;
                waUrl = `https://wa.me/${p.replace(/\D/g, '')}?text=${waMessage}`;
            }
            window.open(waUrl, '_blank');
            toast({ title: '✅ Teks Disalin & Buka WA!', duration: 1500 });
            setTimeout(() => setCopiedItems(prev => { const s = new Set(prev); s.delete(key); return s; }), 3000);
        } catch {
            toast({ title: '❌ Gagal', variant: 'destructive', duration: 1500 });
        }
    };

    const toggleCheck = (index: number) => {
        const key = `invitation-${index}`;
        setInvitationChecklist(prev => {
            const s = new Set(prev);
            s.has(key) ? s.delete(key) : s.add(key);
            return s;
        });
    };

    const handleCopyAllLinks = async () => {
        try {
            await navigator.clipboard.writeText(currentItems.map(i => i.link).join('\n'));
            toast({ title: `✅ ${currentItems.length} link disalin!`, duration: 2000 });
        } catch {
            toast({ title: '❌ Gagal', variant: 'destructive', duration: 1500 });
        }
    };

    const toCapitalized = (t: string) => t.split('\n').map(l => l.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())).join('\n');

    const totalPages = Math.ceil(items.length / limit);
    const start = (page - 1) * limit;
    const currentItems = items.slice(start, start + limit);
    const sentCount = invitationChecklist.size;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
            {/* ── Header ── */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
                <div className="flex items-center p-4 max-w-5xl mx-auto">
                    <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-pink-50 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-pink-600" />
                    </button>
                    <div className="ml-3 min-w-0 flex-1">
                        <h1 className="text-base font-bold text-gray-800 truncate">Bulk Undangan</h1>
                        <p className="text-xs text-pink-500 truncate">{decodeURIComponent(title!)}</p>
                    </div>
                    {isDraftSaving && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                            <Save className="h-3 w-3 animate-spin" />
                            Menyimpan...
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 md:px-8 pb-10 space-y-5">

                {loadingTemplate && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-200 border-t-pink-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Memuat template undangan...</p>
                    </div>
                )}

                {errorLoadingTemplate && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-600 font-medium">Gagal memuat template</p>
                        <p className="text-sm text-red-400 mt-1">{errorLoadingTemplate}</p>
                    </div>
                )}

                {!loadingTemplate && !errorLoadingTemplate && (
                    <>
                        {/* Progress Summary (jika sudah generate) */}
                        {items.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 text-white shadow-sm">
                                    <Users className="h-5 w-5 mb-2 opacity-80" />
                                    <p className="text-2xl font-bold">{items.length}</p>
                                    <p className="text-xs text-white/75">Total Tamu</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 text-white shadow-sm">
                                    <CheckCircle2 className="h-5 w-5 mb-2 opacity-80" />
                                    <p className="text-2xl font-bold">{sentCount}</p>
                                    <p className="text-xs text-white/75">Sudah Dikirim</p>
                                </div>
                                <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl p-4 text-white shadow-sm">
                                    <Circle className="h-5 w-5 mb-2 opacity-80" />
                                    <p className="text-2xl font-bold">{items.length - sentCount}</p>
                                    <p className="text-xs text-white/75">Belum Dikirim</p>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Daftar Nama */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                            <StepBadge n={1} label="Masukkan Daftar Nama Tamu" />

                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                {/* Case buttons */}
                                {[
                                    { label: 'Az', fn: () => setNames(toCapitalized(names)), title: 'Capitalize' },
                                    { label: 'AZ', fn: () => setNames(names.toUpperCase()), title: 'Uppercase' },
                                    { label: 'az', fn: () => setNames(names.toLowerCase()), title: 'Lowercase' },
                                ].map(b => (
                                    <button
                                        key={b.label}
                                        onClick={b.fn}
                                        title={b.title}
                                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all"
                                    >
                                        {b.label}
                                    </button>
                                ))}
                                <div className="flex-1" />
                                {/* Import CSV */}
                                <label className="cursor-pointer">
                                    <input type="file" accept=".csv" onChange={handleContactFileImport} className="hidden" />
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all">
                                        <Upload className="h-3.5 w-3.5" />
                                        Import CSV
                                    </div>
                                </label>
                            </div>

                            <Textarea
                                rows={6}
                                placeholder={"Contoh:\nBudi\nSiti - 08123456789\nYudi - +62 812 3456 7890"}
                                value={names}
                                onChange={e => setNames(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 resize-none"
                            />

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-1">
                                <p className="text-xs font-semibold text-blue-700">💡 Format: satu nama per baris</p>
                                <p className="text-xs text-blue-500">Tambahkan nomor HP setelah tanda dash (–) agar bisa kirim langsung ke WhatsApp</p>
                                <p className="text-xs text-blue-400">Import dari Google Contacts: contacts.google.com → Export → Google CSV</p>
                            </div>
                        </div>

                        {/* Step 2: Template */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                            <StepBadge n={2} label="Edit Template Pesan" />
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                <p className="text-xs text-amber-700">
                                    Gunakan <code className="bg-amber-100 px-1 rounded">{'{nama}'}</code> untuk nama tamu dan{' '}
                                    <code className="bg-amber-100 px-1 rounded">{'{link_undangan}'}</code> untuk link personal
                                </p>
                            </div>
                            <Textarea
                                rows={10}
                                value={template}
                                onChange={e => setTemplate(e.target.value)}
                                className="rounded-xl border-gray-200 text-sm focus:ring-2 focus:ring-pink-300 resize-none font-mono"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={!names.trim() || !template.trim()}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-sm shadow-md hover:shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap className="h-4 w-4" />
                                Generate {names.split('\n').filter(n => n.trim()).length} Undangan
                            </button>
                        </div>

                        {/* Step 3: Hasil */}
                        {items.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <StepBadge n={3} label={`Kirim Undangan (Hal. ${page}/${totalPages})`} />
                                    <button
                                        onClick={handleCopyAllLinks}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-600 text-xs font-semibold hover:bg-pink-100 transition-colors"
                                    >
                                        <CopyCheck className="h-3.5 w-3.5" />
                                        Salin Semua Link
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {currentItems.map((it, idx) => {
                                        const absIdx = start + idx;
                                        const invKey = `invitation-${absIdx}`;
                                        const linkKey = `link-${absIdx}`;
                                        const isChecked = invitationChecklist.has(invKey);
                                        const isCopiedLink = copiedItems.has(linkKey);
                                        const isCopiedInv = copiedItems.has(invKey);

                                        return (
                                            <div
                                                key={idx}
                                                className={`rounded-2xl border p-4 transition-all ${isChecked
                                                    ? 'bg-emerald-50 border-emerald-200'
                                                    : 'bg-gray-50 border-gray-100'
                                                    }`}
                                            >
                                                {/* Name row */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${isChecked ? 'bg-emerald-500' : 'bg-pink-400'
                                                            }`}>
                                                            {it.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-800">{it.name}</p>
                                                            {it.phone && <p className="text-xs text-gray-400">{it.phone}</p>}
                                                        </div>
                                                    </div>
                                                    {/* Checklist toggle */}
                                                    <button
                                                        onClick={() => toggleCheck(absIdx)}
                                                        title={isChecked ? 'Tandai belum dikirim' : 'Tandai sudah dikirim'}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isChecked
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-white border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600'
                                                            }`}
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                        {isChecked ? 'Terkirim' : 'Tandai'}
                                                    </button>
                                                </div>

                                                {/* Link row */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 truncate font-mono">
                                                        {it.link}
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopyLink(it.link, absIdx)}
                                                        title="Salin link"
                                                        className={`p-2 rounded-xl border transition-all flex-shrink-0 ${isCopiedLink
                                                            ? 'bg-green-100 border-green-200 text-green-600'
                                                            : 'bg-white border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-500'
                                                            }`}
                                                    >
                                                        {isCopiedLink ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                                                    </button>
                                                </div>

                                                {/* Send WA button */}
                                                <button
                                                    onClick={() => handleCopyInvitation(it.invitation, absIdx, it.phone)}
                                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${isCopiedInv
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-sm'
                                                        }`}
                                                >
                                                    {isCopiedInv ? (
                                                        <><Check className="h-4 w-4" /> Dibuka di WhatsApp</>
                                                    ) : (
                                                        <><Send className="h-4 w-4" /> Kirim via WhatsApp {it.phone ? `(${it.phone})` : ''}</>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => { setPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-pink-200 text-pink-600 text-sm font-medium hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Sebelumnya
                                        </button>
                                        <span className="text-sm text-gray-500 font-medium">
                                            {page} / {totalPages}
                                        </span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => { setPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-pink-200 text-pink-600 text-sm font-medium hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            Berikutnya <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}