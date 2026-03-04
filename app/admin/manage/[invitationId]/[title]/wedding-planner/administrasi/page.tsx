'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Trash2, Plus, Check } from 'lucide-react';
import { getAdminTasks, addAdminTask, toggleAdminTask, deleteAdminTask, type AdminTask } from '@/app/actions/weddingPlanner';

const DEFAULT_TASKS = [
    'Urus surat lamaran',
    'Daftarkan ke KUA / Catatan Sipil',
    'Urus buku nikah / akta perkawinan',
    'Surat keterangan dari RT/RW',
    'Izin penggunaan venue / lokasi',
    'Cetak undangan',
    'Kirim undangan ke tamu',
    'Siapkan dokumen seserahan',
    'Tes baju pengantin',
    'Rapat koordinasi panitia',
];

export default function AdministrasiPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };

    const [tasks, setTasks] = useState<AdminTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState('');

    const load = useCallback(async () => {
        try { setTasks(await getAdminTasks(invitationId, title)); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    }, [invitationId, title]);

    useEffect(() => { load(); }, [load]);

    const doneTasks = tasks.filter(t => t.is_done).length;
    const pct = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

    const handleAdd = async (taskName: string) => {
        if (!taskName.trim()) return;
        setSaving(true);
        try {
            await addAdminTask(invitationId, title, { task_name: taskName, is_done: false, due_date: dueDate || undefined });
            setNewTask(''); setDueDate(''); setShowForm(false);
            await load();
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const handleToggle = async (id: number, current: boolean) => {
        await toggleAdminTask(id, !current);
        setTasks(prev => prev.map(t => t.id === id ? { ...t, is_done: !current } : t));
    };

    const handleDelete = async (id: number) => {
        await deleteAdminTask(id);
        await load();
    };

    if (loading) return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-200 border-t-amber-500" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm">
                <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-amber-50"><ChevronLeft className="h-5 w-5 text-amber-600" /></button>
                        <div>
                            <h1 className="text-base font-bold text-gray-800">📋 Administrasi</h1>
                            <p className="text-xs text-amber-500 truncate">{decodeURIComponent(title)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                        <Plus className="h-4 w-4" /> Tugas
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 pb-10 space-y-4">
                {/* Progress */}
                {tasks.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
                        <div className="flex justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-700">Progres Persiapan</p>
                            <p className="text-sm font-bold text-amber-600">{doneTasks}/{tasks.length}</p>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="h-3 rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">{pct}% selesai</p>
                    </div>
                )}

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Tambah Tugas</h3>
                        <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nama tugas (mis: Urus buku nikah)" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Tenggat Waktu (opsional)</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleAdd(newTask)} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50">{saving ? 'Menyimpan...' : '✓ Simpan'}</button>
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50">Batal</button>
                        </div>
                    </div>
                )}

                {/* Quick-add defaults — selalu tampil sebagai referensi */}
                {(() => {
                    const addedNames = tasks.map(t => t.task_name.toLowerCase());
                    const remaining = DEFAULT_TASKS.filter(dt => !addedNames.includes(dt.toLowerCase()));
                    if (remaining.length === 0) return null;
                    return (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">💡 Saran Tugas — Klik untuk tambah</p>
                            <div className="grid grid-cols-1 gap-2">
                                {remaining.map(dt => (
                                    <button key={dt} onClick={() => handleAdd(dt)} disabled={saving}
                                        className="text-left bg-white rounded-xl px-4 py-3 border border-amber-100 shadow-sm text-sm text-gray-700 hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center justify-between group disabled:opacity-50">
                                        <span>{dt}</span>
                                        <Plus className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Task list */}
                {tasks.length > 0 && (
                    <div className="space-y-2">
                        {tasks.map(task => (
                            <div key={task.id} className={`bg-white rounded-xl px-4 py-3 border shadow-sm flex items-center gap-3 transition-all ${task.is_done ? 'border-emerald-100 opacity-75' : 'border-gray-100'}`}>
                                <button onClick={() => handleToggle(task.id, task.is_done)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.is_done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-amber-400'}`}>
                                    {task.is_done && <Check className="h-3.5 w-3.5 text-white" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${task.is_done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.task_name}</p>
                                    {task.due_date && <p className="text-xs text-amber-600 mt-0.5">📅 {task.due_date}</p>}
                                </div>
                                <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0">
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
