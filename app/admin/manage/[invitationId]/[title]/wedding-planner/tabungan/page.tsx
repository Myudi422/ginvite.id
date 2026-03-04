'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Trash2, Plus, Edit3, Check, X } from 'lucide-react';
import {
    getSavingsData,
    saveSavingsGoal,
    addSavingsEntry,
    deleteSavingsEntry,
    type SavingsEntry,
} from '@/app/actions/weddingPlanner';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function TabunganPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };

    const [entries, setEntries] = useState<SavingsEntry[]>([]);
    const [goal, setGoal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(false);
    const [goalInput, setGoalInput] = useState('');
    const [form, setForm] = useState({ entry_date: new Date().toISOString().slice(0, 10), amount: '', note: '' });

    const load = useCallback(async () => {
        try {
            const data = await getSavingsData(invitationId, title);
            setEntries(data.entries || []);
            setGoal(data.goal || 0);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const totalSaved = entries.reduce((s, e) => s + Number(e.amount), 0);
    const pct = goal > 0 ? Math.min(100, Math.round((totalSaved / goal) * 100)) : 0;
    const barColor = pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-sky-400';

    const handleAdd = async () => {
        if (!form.amount) return;
        setSaving(true);
        try {
            await addSavingsEntry(invitationId, title, { entry_date: form.entry_date, amount: Number(form.amount), note: form.note });
            setForm({ entry_date: new Date().toISOString().slice(0, 10), amount: '', note: '' });
            setShowForm(false);
            await load();
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus entri ini?')) return;
        await deleteSavingsEntry(id);
        await load();
    };

    const handleSaveGoal = async () => {
        await saveSavingsGoal(invitationId, title, Number(goalInput) || 0);
        setGoal(Number(goalInput) || 0);
        setEditingGoal(false);
    };

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-500" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
                <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-blue-50"><ChevronLeft className="h-5 w-5 text-blue-600" /></button>
                        <div>
                            <h1 className="text-base font-bold text-gray-800">💵 Tabungan Nikah</h1>
                            <p className="text-xs text-blue-500 truncate">{decodeURIComponent(title)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        <Plus className="h-4 w-4" /> Tambah
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 pb-10 space-y-4">
                {/* Progress Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100">
                    <div className="flex justify-between mb-3">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Target Tabungan</p>
                            {editingGoal ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)} className="w-40 text-lg font-bold border-b-2 border-blue-400 focus:outline-none bg-transparent text-gray-800" placeholder="0" />
                                    <button onClick={handleSaveGoal} className="text-blue-600"><Check className="h-5 w-5" /></button>
                                    <button onClick={() => setEditingGoal(false)} className="text-gray-400"><X className="h-5 w-5" /></button>
                                </div>
                            ) : (
                                <button onClick={() => { setGoalInput(String(goal)); setEditingGoal(true); }} className="flex items-center gap-1.5 mt-1">
                                    <span className="text-lg font-bold text-gray-800">{fmt(goal)}</span>
                                    <Edit3 className="h-3.5 w-3.5 text-blue-500" />
                                </button>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Terkumpul</p>
                            <p className="text-lg font-bold text-blue-600">{fmt(totalSaved)}</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className={`h-3 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between mt-2">
                        <p className="text-xs text-gray-400">{pct}% tercapai</p>
                        <p className="text-xs text-gray-400">Kurang: {fmt(Math.max(0, goal - totalSaved))}</p>
                    </div>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Catat Tabungan Baru</h3>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Tanggal</label>
                            <input type="date" value={form.entry_date} onChange={e => setForm(p => ({ ...p, entry_date: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Jumlah (Rp)</label>
                            <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="500000" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        </div>
                        <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Catatan (opsional)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        <div className="flex gap-2">
                            <button onClick={handleAdd} disabled={saving} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">{saving ? 'Menyimpan...' : '✓ Simpan'}</button>
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Batal</button>
                        </div>
                    </div>
                )}

                {/* Entries */}
                {entries.length === 0 && !showForm ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">🐷</p>
                        <p className="text-gray-500 text-sm">Belum ada catatan tabungan.</p>
                        <button onClick={() => setShowForm(true)} className="mt-4 text-blue-600 text-sm font-medium">+ Catat sekarang</button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {[...entries].reverse().map(entry => (
                            <div key={entry.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">💵</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-blue-700">{fmt(Number(entry.amount))}</p>
                                    <p className="text-xs text-gray-400">{entry.entry_date}{entry.note ? ` · ${entry.note}` : ''}</p>
                                </div>
                                <button onClick={() => handleDelete(entry.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
