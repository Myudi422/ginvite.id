'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getWpSummary, type WpSummary } from '@/app/actions/weddingPlanner';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

function MiniProgressBar({ pct, color }: { pct: number; color: string }) {
    return (
        <div className="w-full bg-rose-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
    );
}

export default function WeddingPlannerPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };
    const base = `/admin/manage/${invitationId}/${title}/wedding-planner`;

    const [summary, setSummary] = useState<WpSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try { setSummary(await getWpSummary(invitationId, title)); }
        catch { /* graceful */ }
        finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const budgetPct = summary && summary.budget_total > 0 ? Math.min(100, Math.round((summary.budget_spent / summary.budget_total) * 100)) : 0;
    const adminPct = summary && summary.admin_total > 0 ? Math.round((summary.admin_done / summary.admin_total) * 100) : 0;
    const seserPct = summary && (summary.seserahan_total ?? 0) > 0 ? Math.round(((summary.seserahan_bought ?? 0) / (summary.seserahan_total ?? 1)) * 100) : 0;
    const vendorPct = summary && summary.vendor_count > 0 ? Math.round(((summary.vendor_lunas ?? 0) / summary.vendor_count) * 100) : 0;

    // Overall: budget + admin + seserahan + vendor
    const overallPct = summary
        ? Math.round((budgetPct + adminPct + seserPct + vendorPct) / 4)
        : 0;

    const modules = [
        {
            emoji: '💰', label: 'Budget', path: 'budget',
            stat: summary ? `${fmt(summary.budget_spent)} / ${fmt(summary.budget_total || summary.budget_spent || 0)}` : '—',
            substat: summary ? `${budgetPct}% terpakai` : 'Belum ada data',
            pct: budgetPct,
            barColor: budgetPct >= 100 ? 'bg-red-400' : budgetPct >= 80 ? 'bg-amber-400' : 'bg-emerald-400',
        },
        {
            emoji: '🤝', label: 'Vendor', path: 'vendor',
            stat: summary ? `${summary.vendor_count} vendor` : '—',
            substat: summary ? `${summary.vendor_lunas ?? 0} lunas · ${summary.vendor_booking ?? 0} booking` : 'Belum ada data',
            pct: vendorPct,
            barColor: 'bg-violet-400',
        },
        {
            emoji: '📋', label: 'Administrasi', path: 'administrasi',
            stat: summary ? `${summary.admin_done}/${summary.admin_total} tugas` : '—',
            substat: summary ? `${adminPct}% selesai` : 'Belum ada data',
            pct: adminPct,
            barColor: 'bg-amber-400',
        },
        {
            emoji: '👗', label: 'Seragam', path: 'seragam',
            stat: summary ? `${summary.seragam_total_pcs ?? 0} pcs` : '—',
            substat: summary ? fmt(summary.seragam_total_biaya ?? 0) : 'Belum ada data',
            pct: null,
            barColor: '',
        },
        {
            emoji: '🎁', label: 'Seserahan', path: 'seserahan',
            stat: summary ? `${summary.seserahan_bought ?? 0}/${summary.seserahan_total ?? 0} item` : '—',
            substat: summary ? `Est. ${fmt(summary.seserahan_est ?? 0)}` : 'Belum ada data',
            pct: seserPct,
            barColor: 'bg-orange-400',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="flex items-center p-4 max-w-2xl mx-auto">
                    <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-rose-50 transition-colors">
                        <ChevronLeft className="h-5 w-5 text-rose-500" />
                    </button>
                    <div className="ml-3 min-w-0">
                        <h1 className="text-base font-bold text-gray-800">💒 Wedding Planner</h1>
                        <p className="text-xs text-rose-400 truncate">{decodeURIComponent(title)}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 pb-10 space-y-5">

                {/* Hero Summary Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 p-6 text-white shadow-lg shadow-rose-200">
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />

                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-widest text-rose-200 mb-1">Kesiapan Pernikahan</p>
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-5xl font-black">{loading ? '—' : `${overallPct}%`}</span>
                            <span className="text-rose-200 text-sm mb-1.5">overall progress</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-4">
                            <div className="h-2.5 rounded-full bg-white transition-all duration-1000" style={{ width: `${overallPct}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
                                <p className="text-lg font-bold">{loading ? '—' : (summary?.vendor_count ?? 0)}</p>
                                <p className="text-[10px] text-rose-200 mt-0.5">Vendor</p>
                            </div>
                            <div className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
                                <p className="text-lg font-bold">{loading ? '—' : `${summary?.admin_done ?? 0}/${summary?.admin_total ?? 0}`}</p>
                                <p className="text-[10px] text-rose-200 mt-0.5">Tugas Done</p>
                            </div>
                            <div className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
                                <p className="text-lg font-bold">{loading ? '—' : `${summary?.seserahan_bought ?? 0}/${summary?.seserahan_total ?? 0}`}</p>
                                <p className="text-[10px] text-rose-200 mt-0.5">Seserahan</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget featured card */}
                <button
                    onClick={() => router.push(`${base}/budget`)}
                    className="group w-full bg-white rounded-2xl p-4 border border-rose-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">💰</span>
                            <p className="text-sm font-semibold text-gray-800">Budget Pernikahan</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-rose-400 transition-colors" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-lg font-bold text-rose-600">{loading ? '—' : fmt(summary?.budget_spent ?? 0)}</p>
                        <p className="text-xs text-gray-400">dari {loading ? '—' : fmt(summary?.budget_total ?? 0)}</p>
                    </div>
                    <MiniProgressBar pct={budgetPct} color={budgetPct >= 100 ? 'bg-red-400' : budgetPct >= 80 ? 'bg-amber-400' : 'bg-emerald-400'} />
                    <p className="text-[11px] text-gray-400 mt-1.5">{budgetPct}% terpakai · Sisa {fmt(Math.max(0, (summary?.budget_total ?? 0) - (summary?.budget_spent ?? 0)))}</p>
                </button>

                {/* Other modules */}
                <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">Detail Persiapan</p>
                    {modules.slice(1).map(m => (
                        <button key={m.path} onClick={() => router.push(`${base}/${m.path}`)}
                            className="group w-full bg-white rounded-2xl px-4 py-3.5 border border-rose-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4 text-left">
                            <div className="w-11 h-11 bg-gradient-to-br from-rose-100 to-pink-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                                {m.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                                    <p className="text-xs font-medium text-rose-500">{loading ? '...' : m.stat}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{loading ? '...' : m.substat}</p>
                                {m.pct !== null && m.pct > 0 && <MiniProgressBar pct={m.pct} color={m.barColor} />}
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-rose-400 flex-shrink-0 transition-colors" />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
