'use client';

import React, { useState } from 'react';
import { XIcon, Loader2Icon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import type { EventType } from './types';
import { makeDefaultPage } from './defaults';

interface Props {
  userId: number;
  onClose: () => void;
  onCreated: (slug: string, eventType: string, pageTitle: string) => void;
}

const EVENT_TYPES: Array<{ type: EventType; emoji: string; label: string; desc: string }> = [
  { type: 'pernikahan', emoji: '💒', label: 'Pernikahan', desc: 'Akad nikah, resepsi, dan seluruh rangkaian acara pernikahan.' },
  { type: 'ulang_tahun', emoji: '🎂', label: 'Ulang Tahun', desc: 'Pesta ulang tahun anak, dewasa, sweet seventeen, dll.' },
  { type: 'khitanan', emoji: '🤲', label: 'Khitanan', desc: 'Undangan syukuran dan perayaan khitanan.' },
  { type: 'custom', emoji: '✨', label: 'Custom / Lainnya', desc: 'Seminar, reunian, wisuda, arisan, atau acara apapun.' },
];

type Step = 1 | 2;

export default function CreateBuilderPopup({ userId, onClose, onCreated }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [slug, setSlug] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.toLowerCase().replace(/\s+/g, '-');
    v = v.replace(/[^a-z0-9-]/g, '');
    setSlug(v);
  };

  async function handleCreate() {
    if (!eventType || !slug) { setError('Harap isi semua kolom.'); return; }
    setError('');
    setLoading(true);
    try {
      const defaultPage = makeDefaultPage({ slug, user_id: userId, event_type: eventType, page_title: pageTitle || slug });
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/builder_create.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, slug, event_type: eventType, page_title: pageTitle || slug, page: defaultPage }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        onCreated(slug, eventType, pageTitle || slug);
        onClose();
      } else {
        setError(json.message || 'Gagal membuat undangan.');
      }
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800">
                {step === 1 ? '✨ Pilih Jenis Acara' : '📝 Detail Undangan'}
              </h2>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2].map(s => (
                  <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? 'bg-pink-500 w-8' : 'bg-gray-200 w-4'}`} />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">Langkah {step}/2</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Step 1: Event Type */}
        {step === 1 && (
          <div className="p-6 space-y-3">
            {EVENT_TYPES.map(et => (
              <button
                key={et.type}
                onClick={() => setEventType(et.type)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all ${eventType === et.type
                  ? 'border-pink-400 bg-pink-50 shadow-sm'
                  : 'border-gray-100 hover:border-pink-200 hover:bg-pink-50/30'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{et.emoji}</span>
                  <div>
                    <p className={`text-sm font-bold ${eventType === et.type ? 'text-pink-700' : 'text-gray-800'}`}>{et.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{et.desc}</p>
                  </div>
                </div>
              </button>
            ))}
            <button
              disabled={!eventType}
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none mt-2"
            >
              Lanjut <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Slug + Title */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <strong>Penting:</strong> Slug (URL) tidak bisa diubah setelah dibuat.
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">{error}</div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Slug / URL Undangan *</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-pink-200">
                <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-400 border-r border-gray-200 flex-shrink-0">papunda.com/undang/id/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="nama-acara-kamu"
                  className="flex-1 px-3 py-2.5 text-sm text-gray-700 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400">Gunakan huruf kecil, angka, dan tanda hubung (-). Contoh: pernikahan-andi-siti</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Judul Tampilan (opsional)</label>
              <input
                type="text"
                value={pageTitle}
                onChange={e => setPageTitle(e.target.value)}
                placeholder={`Undangan ${EVENT_TYPES.find(e => e.type === eventType)?.label || ''}`}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
              <p className="text-[10px] text-gray-400">Nama yang tampil di halaman dan browser tab.</p>
            </div>

            <button
              disabled={!slug || loading}
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? <><Loader2Icon className="h-4 w-4 animate-spin" /> Membuat...</> : '🚀 Buka Builder'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
