'use client';

import React from 'react';
import { useBuilder } from './BuilderContext';
import SectionPanel from './SectionPanel';
import BuilderCanvas from './BuilderCanvas';
import PropertiesPanel from './PropertiesPanel';
import {
  SaveIcon, ExternalLinkIcon, ArrowLeftIcon,
  Loader2Icon, CheckIcon, AlertCircleIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  userId: number;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  pernikahan: '💒 Pernikahan',
  ulang_tahun: '🎂 Ulang Tahun',
  khitanan: '🤲 Khitanan',
  custom: '✨ Custom',
};

export default function BuilderDashboard({ userId }: Props) {
  const { state, save } = useBuilder();
  const { page, isDirty, saving, saveError } = state;
  const router = useRouter();

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* ── Topbar ── */}
      <header className="h-14 flex items-center gap-4 px-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-30">
        {/* Back */}
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* Title & event type */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 hidden sm:inline">
              {EVENT_TYPE_LABELS[page.event_type] || page.event_type}
            </span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <h1 className="text-sm font-bold text-gray-800 truncate">{page.page_title || page.slug}</h1>
          </div>
          <p className="text-[10px] text-gray-400 hidden sm:block">/{page.slug}</p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isDirty && !saving && (
            <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Belum disimpan
            </span>
          )}
          {saving && (
            <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
              Menyimpan...
            </span>
          )}
          {!isDirty && !saving && (
            <span className="flex items-center gap-1.5 text-[11px] text-green-500">
              <CheckIcon className="h-3.5 w-3.5" />
              Tersimpan
            </span>
          )}
          {saveError && (
            <span className="flex items-center gap-1.5 text-[11px] text-red-500" title={saveError}>
              <AlertCircleIcon className="h-3.5 w-3.5" />
              Gagal simpan
            </span>
          )}
        </div>

        {/* Preview link */}
        <a
          href={`/undang/${userId}/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ExternalLinkIcon className="h-3.5 w-3.5" />
          Preview
        </a>

        {/* Save button */}
        <button
          onClick={save}
          disabled={saving || !isDirty}
          className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none"
        >
          <SaveIcon className="h-3.5 w-3.5" />
          Simpan
        </button>
      </header>

      {/* ── 3-column layout ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Sections */}
        <SectionPanel />

        {/* Center: Canvas */}
        <BuilderCanvas />

        {/* Right: Properties */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
