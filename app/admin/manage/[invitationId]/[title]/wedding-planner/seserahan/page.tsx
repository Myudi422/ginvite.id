'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Trash2, Plus, Check, Edit3 } from 'lucide-react';
import { getSeserahanItems, addSeserahanItem, updateSeserahanItem, toggleSeserahanItem, deleteSeserahanItem, type SeserahanItem } from '@/app/actions/weddingPlanner';
import { RupiahInput } from '@/components/RupiahInput';

const SUGGESTIONS = ['Cincin pernikahan', 'Al-Quran & mukena', 'Parfum', 'Perlengkapan sholat', 'Pakaian', 'Tas kulit', 'Sepatu', 'Perhiasan set', 'Peralatan make-up', 'Buah-buahan', 'Kue & coklat', 'Uang mahar', 'Bunga segar'];
const fmt = (n: number) => 'Rp ' + Number(n).toLocaleString('id-ID');

export default function SeserahanPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };

    const [items, setItems] = useState<SeserahanItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<SeserahanItem | null>(null);
    const [form, setForm] = useState<Omit<SeserahanItem, 'id'>>({ item_name: '', estimasi_harga: 0, is_bought: false, note: '' });

    const load = useCallback(async () => {
        try { setItems(await getSeserahanItems(invitationId, title)); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const totalAll = items.reduce((s, i) => s + Number(i.estimasi_harga), 0);
    const totalBought = items.filter(i => i.is_bought).reduce((s, i) => s + Number(i.estimasi_harga), 0);
    const pct = totalAll > 0 ? Math.round((totalBought / totalAll) * 100) : 0;

    const handleAdd = async (name?: string) => {
        const itemName = name || form.item_name;
        if (!itemName.trim()) return;
        setSaving(true);
        try { await addSeserahanItem(invitationId, title, { item_name: itemName, estimasi_harga: name ? 0 : form.estimasi_harga, is_bought: false, note: form.note }); setForm({ item_name: '', estimasi_harga: 0, is_bought: false, note: '' }); setShowForm(false); await load(); }
        catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        await toggleSeserahanItem(id, !current);
        setItems(prev => prev.map(i => i.id === id ? { ...i, is_bought: !current } : i));
    };

    const handleEdit = (item: SeserahanItem) => { setEditingId(item.id); setEditForm({ ...item }); };
    const handleCancelEdit = () => { setEditingId(null); setEditForm(null); };

    const handleSaveEdit = async () => {
        if (!editForm) return;
        setSaving(true);
        try { await updateSeserahanItem(editForm); setEditingId(null); setEditForm(null); await load(); }
        catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus item seserahan ini?')) return;
        await deleteSeserahanItem(id); await load();
    };

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-200 border-t-rose-500" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white overflow-x-hidden">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-rose-50"><ChevronLeft className="h-5 w-5 text-rose-500" /></button>
                        <div>
                            <h1 className="text-base font-bold text-gray-800">🎁 Seserahan</h1>
                            <p className="text-xs text-rose-400 truncate">{decodeURIComponent(title)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        <Plus className="h-4 w-4" /> Tambah
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 pb-10 space-y-4">
                {/* Summary */}
                {items.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100">
                        <div className="flex justify-between mb-2">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Estimasi Total</p>
                                <p className="text-lg font-bold text-rose-500">{fmt(totalAll)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Sudah Dibeli</p>
                                <p className="text-lg font-bold text-emerald-600">{fmt(totalBought)}</p>
                            </div>
                        </div>
                        <div className="w-full bg-rose-100 rounded-full h-2.5 overflow-hidden">
                            <div className="h-2.5 rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">{items.filter(i => i.is_bought).length}/{items.length} item dibeli · {pct}%</p>
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100 space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Tambah Item Seserahan</h3>
                        <input value={form.item_name} onChange={e => setForm(p => ({ ...p, item_name: e.target.value }))} placeholder="Nama item (mis: Cincin pernikahan)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Estimasi Harga (Rp)</label>
                            <RupiahInput value={form.estimasi_harga} onChange={val => setForm(p => ({ ...p, estimasi_harga: val }))} placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        </div>
                        <input value={form.note || ''} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Catatan (opsional)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                        <div className="flex gap-2">
                            <button onClick={() => handleAdd()} disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl disabled:opacity-50">{saving ? 'Menyimpan...' : '✓ Simpan'}</button>
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50">Batal</button>
                        </div>
                    </div>
                )}

                {/* Quick suggestions — selalu tampil sebagai referensi */}
                {(() => {
                    const addedNames = items.map(i => i.item_name.toLowerCase());
                    const remaining = SUGGESTIONS.filter(s => !addedNames.includes(s.toLowerCase()));
                    if (remaining.length === 0) return null;
                    return (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">💡 Saran Seserahan — Klik untuk tambah</p>
                            <div className="flex flex-wrap gap-2">
                                {remaining.map(s => (
                                    <button key={s} onClick={() => handleAdd(s)} disabled={saving}
                                        className="text-sm bg-white border border-rose-200 text-rose-500 px-3 py-1.5 rounded-full hover:bg-rose-50 hover:border-rose-400 transition-colors shadow-sm disabled:opacity-50">
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Item list */}
                {items.length > 0 && (
                    <div className="space-y-2">
                        {items.map(item => {
                            const isEditing = editingId === item.id;
                            return (
                                <div key={item.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${item.is_bought ? 'border-emerald-100 opacity-80' : 'border-gray-100'}`}>
                                    {isEditing && editForm ? (
                                        <div className="p-4 space-y-3">
                                            <input value={editForm.item_name} onChange={e => setEditForm(p => p ? { ...p, item_name: e.target.value } : p)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Estimasi Harga (Rp)</label>
                                                <RupiahInput value={editForm.estimasi_harga} onChange={val => setEditForm(p => p ? { ...p, estimasi_harga: val } : p)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            </div>
                                            <input value={editForm.note || ''} onChange={e => setEditForm(p => p ? { ...p, note: e.target.value } : p)} placeholder="Catatan" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                                            <div className="flex gap-2">
                                                <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-rose-500 text-white text-sm py-2 rounded-xl disabled:opacity-50">{saving ? '...' : '✓ Simpan'}</button>
                                                <button onClick={handleCancelEdit} className="flex-1 border border-gray-200 text-sm py-2 rounded-xl">Batal</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 flex items-center gap-3">
                                            <button onClick={() => handleToggle(item.id, item.is_bought)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.is_bought ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-rose-400'}`}>
                                                {item.is_bought && <Check className="h-3.5 w-3.5 text-white" />}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${item.is_bought ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.item_name}</p>
                                                <div className="flex gap-3 mt-0.5">
                                                    {Number(item.estimasi_harga) > 0 && <span className="text-xs text-rose-600 font-medium">{fmt(Number(item.estimasi_harga))}</span>}
                                                    {item.note && <span className="text-xs text-gray-400">{item.note}</span>}
                                                </div>
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
