'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Trash2, Plus, Edit3 } from 'lucide-react';
import { getSeragamItems, addSeragamItem, updateSeragamItem, deleteSeragamItem, type SeragamItem } from '@/app/actions/weddingPlanner';

const fmt = (n: number) => 'Rp ' + Number(n).toLocaleString('id-ID');

const BLANK: Omit<SeragamItem, 'id'> = { kelompok: '', warna: '', bahan: '', jumlah: 1, biaya_per_pcs: 0, note: '' };

export default function SeragamPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };

    const [items, setItems] = useState<SeragamItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<SeragamItem | null>(null);
    const [form, setForm] = useState<Omit<SeragamItem, 'id'>>(BLANK);

    const load = useCallback(async () => {
        try { setItems(await getSeragamItems(invitationId, title)); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const totalBiaya = items.reduce((s, i) => s + Number(i.jumlah) * Number(i.biaya_per_pcs), 0);
    const totalPcs = items.reduce((s, i) => s + Number(i.jumlah), 0);

    const handleAdd = async () => {
        if (!form.kelompok.trim()) return;
        setSaving(true);
        try { await addSeragamItem(invitationId, title, form); setForm(BLANK); setShowForm(false); await load(); }
        catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleEdit = (item: SeragamItem) => { setEditingId(item.id); setEditForm({ ...item }); };
    const handleCancelEdit = () => { setEditingId(null); setEditForm(null); };
    const setEdit = (patch: Partial<SeragamItem>) => setEditForm(p => p ? { ...p, ...patch } : p);

    const handleSaveEdit = async () => {
        if (!editForm) return;
        setSaving(true);
        try { await updateSeragamItem(editForm); setEditingId(null); setEditForm(null); await load(); }
        catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus item seragam ini?')) return;
        await deleteSeragamItem(id); await load();
    };

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-200 border-t-rose-500" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-rose-50"><ChevronLeft className="h-5 w-5 text-rose-500" /></button>
                        <div>
                            <h1 className="text-base font-bold text-gray-800">👗 Seragam</h1>
                            <p className="text-xs text-rose-400 truncate">{decodeURIComponent(title)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        <Plus className="h-4 w-4" /> Tambah
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 pb-10 space-y-4">
                {/* Summary cards */}
                {items.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm text-center">
                            <p className="text-2xl font-bold text-rose-500">{totalPcs}</p>
                            <p className="text-xs text-gray-400 mt-1">Total Pcs Seragam</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm text-center">
                            <p className="text-lg font-bold text-rose-500">{fmt(totalBiaya)}</p>
                            <p className="text-xs text-gray-400 mt-1">Estimasi Total Biaya</p>
                        </div>
                    </div>
                )}

                {/* Add form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Tambah Seragam</h3>
                        <input value={form.kelompok} onChange={e => setForm(p => ({ ...p, kelompok: e.target.value }))} placeholder="Nama kelompok (mis: Keluarga A)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        <div className="grid grid-cols-2 gap-3">
                            <input value={form.warna || ''} onChange={e => setForm(p => ({ ...p, warna: e.target.value }))} placeholder="Warna (mis: Tosca)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                            <input value={form.bahan || ''} onChange={e => setForm(p => ({ ...p, bahan: e.target.value }))} placeholder="Bahan (mis: Maxmara)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-xs text-gray-500 mb-1 block">Jumlah (pcs)</label>
                                <input type="number" min="1" value={form.jumlah} onChange={e => setForm(p => ({ ...p, jumlah: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                            </div>
                            <div><label className="text-xs text-gray-500 mb-1 block">Biaya / pcs (Rp)</label>
                                <input type="number" value={form.biaya_per_pcs || ''} onChange={e => setForm(p => ({ ...p, biaya_per_pcs: Number(e.target.value) }))} placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                            </div>
                        </div>
                        <input value={form.note || ''} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Catatan (opsional)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl disabled:opacity-50">{saving ? 'Menyimpan...' : '✓ Simpan'}</button>
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50">Batal</button>
                        </div>
                    </div>
                )}

                {/* Item list */}
                {items.length === 0 && !showForm ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">👗</p>
                        <p className="text-gray-500 text-sm">Belum ada rencana seragam.</p>
                        <button onClick={() => setShowForm(true)} className="mt-4 text-rose-500 text-sm font-medium">+ Tambah sekarang</button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map(item => {
                            const isEditing = editingId === item.id;
                            return (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                    {isEditing && editForm ? (
                                        <div className="p-4 space-y-3">
                                            <input value={editForm.kelompok} onChange={e => setEdit({ kelompok: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input value={editForm.warna || ''} onChange={e => setEdit({ warna: e.target.value })} placeholder="Warna" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                                <input value={editForm.bahan || ''} onChange={e => setEdit({ bahan: e.target.value })} placeholder="Bahan" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div><label className="text-xs text-gray-500 mb-1 block">Jumlah (pcs)</label>
                                                    <input type="number" min="1" value={editForm.jumlah} onChange={e => setEdit({ jumlah: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                                </div>
                                                <div><label className="text-xs text-gray-500 mb-1 block">Biaya / pcs</label>
                                                    <input type="number" value={editForm.biaya_per_pcs || ''} onChange={e => setEdit({ biaya_per_pcs: Number(e.target.value) })} placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                                </div>
                                            </div>
                                            <input value={editForm.note || ''} onChange={e => setEdit({ note: e.target.value })} placeholder="Catatan" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            <div className="flex gap-2">
                                                <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-rose-500 text-white text-sm py-2 rounded-xl disabled:opacity-50">{saving ? '...' : '✓ Simpan'}</button>
                                                <button onClick={handleCancelEdit} className="flex-1 border border-gray-200 text-sm py-2 rounded-xl">Batal</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 flex items-start gap-3">
                                            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">👗</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800">{item.kelompok}</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {item.warna && <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">{item.warna}</span>}
                                                    {item.bahan && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.bahan}</span>}
                                                </div>
                                                <div className="flex gap-4 mt-2">
                                                    <span className="text-xs text-gray-500">{item.jumlah} pcs</span>
                                                    {Number(item.biaya_per_pcs) > 0 && <span className="text-xs text-rose-600 font-medium">{fmt(Number(item.jumlah) * Number(item.biaya_per_pcs))}</span>}
                                                </div>
                                                {item.note && <p className="text-xs text-gray-400 mt-1 italic">{item.note}</p>}
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button onClick={() => handleEdit(item)} className="text-gray-300 hover:text-rose-500 transition-colors p-1"><Edit3 className="h-4 w-4" /></button>
                                                <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
