'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Check, X, Plus, Trash2 } from 'lucide-react';
import {
    getFullBudgetBreakdown,
    saveBudgetTotal,
    addMiscBudgetItem,
    deleteMiscBudgetItem,
    type BudgetBreakdown,
} from '@/app/actions/weddingPlanner';
import { RupiahInput } from '@/components/RupiahInput';

const fmt = (n: number) => 'Rp ' + Number(n).toLocaleString('id-ID');

const SOURCE_ROUTES: Record<string, string> = {
    vendor: 'vendor',
    seragam: 'seragam',
    seserahan: 'seserahan',
};

export default function BudgetPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };
    const base = `/admin/manage/${invitationId}/${title}/wedding-planner`;

    const [data, setData] = useState<BudgetBreakdown | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingTotal, setEditingTotal] = useState(false);
    const [totalInput, setTotalInput] = useState('');
    const [showMiscForm, setShowMiscForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [miscForm, setMiscForm] = useState({ item_name: '', actual_amount: 0, note: '' });

    const load = useCallback(async () => {
        try { setData(await getFullBudgetBreakdown(invitationId, title)); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const budgetTotal = data?.budget_total ?? 0;
    const totalSpent = data?.total_spent ?? 0;
    const pct = budgetTotal > 0 ? Math.min(100, Math.round((totalSpent / budgetTotal) * 100)) : 0;
    const remaining = budgetTotal - totalSpent;
    const barColor = pct >= 100 ? 'bg-red-500' : pct >= 85 ? 'bg-amber-500' : 'bg-emerald-500';

    const handleSaveTotal = async () => {
        const val = Number(totalInput.replace(/\D/g, ''));
        await saveBudgetTotal(invitationId, title, val);
        setEditingTotal(false);
        await load();
    };

    const handleAddMisc = async () => {
        if (!miscForm.item_name.trim()) return;
        setSaving(true);
        try {
            await addMiscBudgetItem(invitationId, title, {
                category: 'Lainnya', item_name: miscForm.item_name,
                budget_amount: 0, actual_amount: Number(miscForm.actual_amount) || 0, note: miscForm.note,
            });
            setMiscForm({ item_name: '', actual_amount: 0, note: '' });
            setShowMiscForm(false);
            await load();
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleDeleteMisc = async (id: number) => {
        await deleteMiscBudgetItem(id);
        await load();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-200 border-t-rose-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white overflow-x-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="flex items-center p-4 max-w-5xl mx-auto">
                    <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-rose-50 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-rose-500" />
                    </button>
                    <div className="ml-3 min-w-0">
                        <h1 className="text-base font-bold text-gray-800">💰 Budget Pernikahan</h1>
                        <p className="text-xs text-rose-400 truncate">{decodeURIComponent(title)}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 pb-10 space-y-4">

                {/* Hero Budget Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 p-6 text-white shadow-lg shadow-rose-200">
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-widest text-rose-200 mb-1">Total Anggaran</p>

                        {editingTotal ? (
                            <div className="flex items-center gap-2 mt-1 mb-4">
                                <span className="text-rose-200 text-lg">Rp</span>
                                <RupiahInput
                                    value={Number(totalInput.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0}
                                    onChange={val => setTotalInput(String(val))}
                                    placeholder="50.000.000"
                                    autoFocus
                                    className="flex-1 bg-white/20 border-b-2 border-white text-white placeholder-rose-200 text-2xl font-black focus:outline-none"
                                />
                                <button onClick={handleSaveTotal} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"><Check className="h-5 w-5" /></button>
                                <button onClick={() => setEditingTotal(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"><X className="h-5 w-5" /></button>
                            </div>
                        ) : (
                            <button onClick={() => { setTotalInput(String(budgetTotal)); setEditingTotal(true); }} className="flex items-center gap-2 mt-1 mb-4 group">
                                <span className="text-3xl font-black">{fmt(budgetTotal)}</span>
                                <span className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors"><Edit3 className="h-3.5 w-3.5" /></span>
                            </button>
                        )}

                        {/* Progress bar */}
                        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-3">
                            <div className="h-2.5 rounded-full bg-white transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
                                <p className="text-base font-bold">{fmt(totalSpent)}</p>
                                <p className="text-[10px] text-rose-200 mt-0.5">Terpakai</p>
                            </div>
                            <div className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
                                <p className="text-base font-bold">{pct}%</p>
                                <p className="text-[10px] text-rose-200 mt-0.5">Digunakan</p>
                            </div>
                            <div className={`rounded-2xl p-3 text-center backdrop-blur-sm ${remaining < 0 ? 'bg-red-400/40' : 'bg-white/15'}`}>
                                <p className="text-base font-bold">{remaining < 0 ? '-' : ''}{fmt(Math.abs(remaining))}</p>
                                <p className="text-[10px] text-rose-200 mt-0.5">{remaining < 0 ? 'Melebihi!' : 'Tersisa'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info note */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                    <span className="text-lg flex-shrink-0">💡</span>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        Total terpakai dihitung <strong>otomatis</strong> dari Vendor, Seragam, dan Seserahan yang kamu isi. Klik kartu di bawah untuk langsung mengedit masing-masing modul.
                    </p>
                </div>

                {/* Sections */}
                {(data?.sections ?? []).map(section => {
                    const route = SOURCE_ROUTES[section.source];
                    const isMisc = section.source === 'misc';

                    return (
                        <div key={section.source} className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                            {/* Section header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{section.label}</p>
                                    <p className="text-xs text-rose-500 font-medium">{fmt(section.total)}</p>
                                </div>
                                {route ? (
                                    <button onClick={() => router.push(`${base}/${route}`)} className="flex items-center gap-1 text-xs text-rose-600 font-medium hover:text-rose-800 transition-colors">
                                        Edit <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                ) : (
                                    <button onClick={() => setShowMiscForm(true)} className="flex items-center gap-1 text-xs text-rose-600 font-medium hover:text-rose-800 transition-colors">
                                        <Plus className="h-3.5 w-3.5" /> Tambah
                                    </button>
                                )}
                            </div>

                            {/* Section items */}
                            {section.items.length === 0 ? (
                                <div className="px-4 py-5 text-center">
                                    <p className="text-xs text-gray-400 italic">Belum ada data.</p>
                                    {route && (
                                        <button onClick={() => router.push(`${base}/${route}`)} className="mt-2 text-xs text-rose-500 font-medium">
                                            + Tambah di modul {section.label.split(' ').slice(1).join(' ')}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {section.items.map((item, idx) => {
                                        const name = (item.name || item.item_name || item.vendor_name || item.kelompok || '—') as string;
                                        const amount = Number(item.amount ?? item.actual_amount ?? item.estimasi_harga ?? 0);

                                        return (
                                            <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-rose-50/40 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-700 truncate">{name}</p>
                                                    {item.category && <p className="text-xs text-gray-400">{String(item.category)}</p>}
                                                    {item.status && (
                                                        <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' :
                                                            item.status === 'dp' ? 'bg-amber-100 text-amber-700' :
                                                                item.status === 'booking' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                            }`}>{String(item.status)}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className="text-sm font-semibold text-rose-600">{amount > 0 ? fmt(amount) : '—'}</span>
                                                    {isMisc && (
                                                        <button onClick={() => handleDeleteMisc(item.id as number)} className="text-gray-300 hover:text-red-500 transition-colors p-0.5">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Misc add form */}
                            {isMisc && showMiscForm && (
                                <div className="px-4 py-4 border-t border-rose-100 space-y-2.5">
                                    <input
                                        value={miscForm.item_name}
                                        onChange={e => setMiscForm(p => ({ ...p, item_name: e.target.value }))}
                                        placeholder="Nama item (mis: Dana darurat)"
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    />
                                    <RupiahInput
                                        value={miscForm.actual_amount}
                                        onChange={val => setMiscForm(p => ({ ...p, actual_amount: val }))}
                                        placeholder="Jumlah (Rp)"
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleAddMisc} disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">
                                            {saving ? 'Menyimpan...' : '✓ Simpan'}
                                        </button>
                                        <button onClick={() => setShowMiscForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {budgetTotal === 0 && (
                    <div className="text-center py-6">
                        <p className="text-xs text-gray-400">Tap angka anggaran di atas untuk mengatur total budget kamu 👆</p>
                    </div>
                )}
            </div>
        </div>
    );
}
