'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Trash2, Plus, Edit3, Check, X } from 'lucide-react';
import { getVendors, addVendor, updateVendor, deleteVendor, type Vendor } from '@/app/actions/weddingPlanner';
import { RupiahInput } from '@/components/RupiahInput';

const CATEGORIES = ['Gedung/Venue', 'Catering', 'Fotografi', 'Videografi', 'Dekorasi', 'Gaun Pengantin', 'MUA / Rias', 'Hiburan/Live Music', 'MC', 'Percetakan', 'Lainnya'];
const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    survey: { label: 'Survey', bg: 'bg-gray-100', text: 'text-gray-600' },
    booking: { label: 'Booking', bg: 'bg-blue-100', text: 'text-blue-700' },
    dp: { label: 'DP Dibayar', bg: 'bg-amber-100', text: 'text-amber-700' },
    lunas: { label: 'Lunas ✓', bg: 'bg-emerald-100', text: 'text-emerald-700' },
};
const fmt = (n: number) => 'Rp ' + Number(n).toLocaleString('id-ID');

export default function VendorPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Vendor | null>(null);

    const [form, setForm] = useState<Omit<Vendor, 'id'>>({ vendor_name: '', category: CATEGORIES[0], price: 0, contact: '', status: 'survey', note: '' });

    const load = useCallback(async () => {
        try { setVendors(await getVendors(invitationId, title)); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async () => {
        if (!form.vendor_name.trim()) return;
        setSaving(true);
        try { await addVendor(invitationId, title, form); setForm({ vendor_name: '', category: CATEGORIES[0], price: 0, contact: '', status: 'survey', note: '' }); setShowForm(false); await load(); }
        catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleEdit = (v: Vendor) => { setEditingId(v.id); setEditForm({ ...v }); };
    const handleCancelEdit = () => { setEditingId(null); setEditForm(null); };

    const handleSaveEdit = async () => {
        if (!editForm) return;
        setSaving(true);
        try { await updateVendor(editForm); setEditingId(null); setEditForm(null); await load(); }
        catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus vendor ini?')) return;
        await deleteVendor(id); await load();
    };

    const filtered = filterStatus === 'all' ? vendors : vendors.filter(v => v.status === filterStatus);

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-200 border-t-rose-500" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white overflow-x-hidden">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-rose-50"><ChevronLeft className="h-5 w-5 text-rose-500" /></button>
                        <div>
                            <h1 className="text-base font-bold text-gray-800">🤝 Vendor</h1>
                            <p className="text-xs text-rose-400 truncate">{decodeURIComponent(title)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        <Plus className="h-4 w-4" /> Tambah
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 pb-10 space-y-4">
                {/* Status Filter */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                        const count = vendors.filter(v => v.status === key).length;
                        return (
                            <button key={key} onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
                                className={`rounded-xl p-3 text-center border transition-all ${filterStatus === key ? `${cfg.bg} border-current ${cfg.text} shadow-sm` : 'bg-white border-gray-100'}`}>
                                <p className={`text-lg font-bold ${filterStatus === key ? cfg.text : 'text-gray-700'}`}>{count}</p>
                                <p className={`text-[10px] ${filterStatus === key ? cfg.text : 'text-gray-400'}`}>{cfg.label}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Tambah Vendor Baru</h3>
                        <input value={form.vendor_name} onChange={e => setForm(p => ({ ...p, vendor_name: e.target.value }))} placeholder="Nama vendor" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        <div className="grid grid-cols-2 gap-3">
                            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300">
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Vendor['status'] }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300">
                                {Object.entries(STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <RupiahInput value={form.price} onChange={val => setForm(p => ({ ...p, price: val }))} placeholder="Harga (Rp)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                            <input value={form.contact || ''} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="Kontak (WA)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        </div>
                        <input value={form.note || ''} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Catatan" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">{saving ? 'Menyimpan...' : '✓ Simpan'}</button>
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50">Batal</button>
                        </div>
                    </div>
                )}

                {/* Vendor List */}
                {filtered.length === 0 && !showForm ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">🤝</p>
                        <p className="text-gray-500 text-sm">{filterStatus === 'all' ? 'Belum ada vendor.' : 'Tidak ada vendor dengan status ini.'}</p>
                        {filterStatus === 'all' && <button onClick={() => setShowForm(true)} className="mt-4 text-rose-500 text-sm font-medium">+ Tambah sekarang</button>}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(v => {
                            const cfg = STATUS_CONFIG[v.status];
                            const isEditing = editingId === v.id;
                            return (
                                <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                    {isEditing && editForm ? (
                                        <div className="p-4 space-y-3">
                                            <input value={editForm.vendor_name} onChange={e => setEditForm(p => p ? { ...p, vendor_name: e.target.value } : p)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <select value={editForm.category} onChange={e => setEditForm(p => p ? { ...p, category: e.target.value } : p)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300">
                                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                                <select value={editForm.status} onChange={e => setEditForm(p => p ? { ...p, status: e.target.value as Vendor['status'] } : p)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300">
                                                    {Object.entries(STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <RupiahInput value={editForm.price} onChange={val => setEditForm(p => p ? { ...p, price: val } : p)} placeholder="Harga (Rp)" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                                <input value={editForm.contact || ''} onChange={e => setEditForm(p => p ? { ...p, contact: e.target.value } : p)} placeholder="Kontak" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            </div>
                                            <input value={editForm.note || ''} onChange={e => setEditForm(p => p ? { ...p, note: e.target.value } : p)} placeholder="Catatan" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            <div className="flex gap-2">
                                                <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-rose-500 text-white text-sm py-2 rounded-xl disabled:opacity-50">{saving ? '...' : '✓ Simpan'}</button>
                                                <button onClick={handleCancelEdit} className="flex-1 border border-gray-200 text-sm py-2 rounded-xl">Batal</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-gray-800">{v.vendor_name}</p>
                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">{v.category}</p>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    {Number(v.price) > 0 && <span className="text-xs text-rose-600 font-medium">{fmt(Number(v.price))}</span>}
                                                    {v.contact && <span className="text-xs text-gray-500">📱 {v.contact}</span>}
                                                </div>
                                                {v.note && <p className="text-xs text-gray-400 mt-1 italic">{v.note}</p>}
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button onClick={() => handleEdit(v)} className="text-gray-300 hover:text-rose-500 transition-colors p-1"><Edit3 className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(v.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <p className="text-center text-xs text-gray-400 pt-1">Total: {fmt(vendors.reduce((s, v) => s + Number(v.price), 0))}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
