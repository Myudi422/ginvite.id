'use client';

import React from 'react';
import { useBuilder } from './BuilderContext';
import SectionPanel from './SectionPanel';
import BuilderCanvas from './BuilderCanvas';
import PropertiesPanel from './PropertiesPanel';
import ReconnectingOverlay from './ui/ReconnectingOverlay';
import {
  SaveIcon, ExternalLinkIcon, ArrowLeftIcon,
  Loader2Icon, CheckIcon, AlertCircleIcon,
  Undo2 as UndoIcon,
  Redo2 as RedoIcon,
  RotateCcw as RotateCcwIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Smartphone as SmartphoneIcon,
  Layout as LayoutIcon,
  Settings as SettingsIcon,
  MoreVertical as MoreVerticalIcon,
  Palette as PaletteIcon,
  Wand2 as WandIcon,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import TemplateSelectorModal from './ui/TemplateSelectorModal';
import QuickFormModal from './ui/QuickFormModal';
import WelcomeModal from './ui/WelcomeModal';

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
  const { state, save, undo, redo, resetPage, importPage, retryLoad, isTemplate, setShowQuickForm } = useBuilder();
  const { page, isDirty, saving, saveError, past, future, selectedSectionId, connectionError, isLoading, showQuickForm } = state;
  const router = useRouter();

  const [mobileTab, setMobileTab] = React.useState<'sections' | 'canvas' | 'properties'>('canvas');
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showTemplateModal, setShowTemplateModal] = React.useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);
  const [isOnboarding, setIsOnboarding] = React.useState(false);

  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === '1';

  React.useEffect(() => {
    if (isNew) {
      setShowWelcomeModal(true);
      setIsOnboarding(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isNew]);

  React.useEffect(() => {
    if (selectedSectionId) {
      setMobileTab('properties');
    }
  }, [selectedSectionId]);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      const confirmLeave = confirm(
        'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar tanpa menyimpan?'
      );
      if (!confirmLeave) return;
    }
    router.push(isTemplate ? '/panel/template' : '/admin');
  }, [isDirty, router, isTemplate]);

  function handleExport() {
    try {
      const exportData = {
        style: page.style,
        sections: page.sections,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(exportData, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `ginvite_builder_${page.slug}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      alert('Gagal mengekspor desain.');
    }
  }

  function handleImportClick() {
    const fileInput = document.getElementById('import-builder-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleImportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          alert('Format file JSON tidak valid.');
          return;
        }
        if (!parsed.sections || !parsed.style) {
          alert('File JSON tidak mengandung data desain builder (sections/style) yang valid.');
          return;
        }
        if (confirm('Apakah Anda yakin ingin mengimpor desain ini? Ini akan menggantikan seluruh layout dan gaya saat ini (dapat dibatalkan dengan tombol Undo).')) {
          importPage(parsed);
          e.target.value = '';
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  }

  function handleReset() {
    if (confirm('Apakah Anda yakin ingin menyetel ulang (reset) seluruh halaman ini ke template awal? Semua seksi kustom dan perubahan Anda saat ini akan dihapus (dapat dibatalkan dengan tombol Undo).')) {
      resetPage();
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {connectionError && (
        <ReconnectingOverlay isLoading={isLoading} onRetry={retryLoad} />
      )}
      {/* ── Topbar ── */}
      <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-30 relative">
        <div className="flex items-center gap-4 min-w-0">
          {/* Back */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{isTemplate ? 'Kembali' : 'Dashboard'}</span>
          </button>

          <div className="hidden md:block w-px h-6 bg-gray-200" />

          {/* Title & event type */}
          <div className="flex-1 min-w-0 hidden md:block">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isTemplate ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                {isTemplate ? 'Template Builder' : (EVENT_TYPE_LABELS[page.event_type] || page.event_type)}
              </span>
              <span className="text-gray-300">·</span>
              <h1 className="text-sm font-bold text-gray-800 truncate">{page.page_title || page.slug}</h1>
            </div>
            {!isTemplate && <p className="text-[10px] text-gray-400">/{page.slug}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-2">
            {isDirty && !saving && (
              <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Belum disimpan
              </span>
            )}
            {saving && (
              <span className={`flex items-center gap-1.5 text-[11px] ${saveError ? 'text-amber-500 font-medium' : 'text-gray-500'}`} title={saveError || undefined}>
                <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                {saveError ? 'Menghubungkan kembali...' : 'Menyimpan...'}
              </span>
            )}
            {!isDirty && !saving && (
              <span className="flex items-center gap-1.5 text-[11px] text-green-500">
                <CheckIcon className="h-3.5 w-3.5" />
                Tersimpan
              </span>
            )}
            {saveError && !saving && (
              <span className="flex items-center gap-1.5 text-[11px] text-red-500" title={saveError}>
                <AlertCircleIcon className="h-3.5 w-3.5" />
                Gagal
              </span>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl p-1 flex-shrink-0">
              <button onClick={undo} disabled={past.length === 0} className="p-1.5 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all" title="Batal (Undo)">
                <UndoIcon className="h-4 w-4" />
              </button>
              <button onClick={redo} disabled={future.length === 0} className="p-1.5 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all" title="Ulangi (Redo)">
                <RedoIcon className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-gray-250 mx-0.5" />
              <button onClick={handleExport} className="p-1.5 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-white active:scale-95 transition-all" title="Ekspor Desain (JSON)">
                <DownloadIcon className="h-4 w-4" />
              </button>
              <button onClick={handleImportClick} className="p-1.5 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-white active:scale-95 transition-all" title="Impor Desain (JSON)">
                <UploadIcon className="h-4 w-4" />
              </button>
              <input type="file" id="import-builder-file" accept=".json" onChange={handleImportChange} className="hidden" />
              <div className="w-px h-4 bg-gray-250 mx-0.5" />
              <button onClick={handleReset} className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all" title="Reset Halaman ke Template Awal">
                <RotateCcwIcon className="h-4 w-4" />
              </button>
            </div>
            
            {!isTemplate && (
              <button
                onClick={() => setShowQuickForm(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100/50 text-xs font-semibold text-pink-700 transition-colors active:scale-95 transition-all animate-pulse"
                title="Isi Formulir Kilat"
              >
                <WandIcon className="h-3.5 w-3.5 text-pink-500" />
                Formulir Cepat
              </button>
            )}
            
            {!isTemplate && (
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100/50 text-xs font-semibold text-purple-700 transition-colors active:scale-95 transition-all"
              >
                <PaletteIcon className="h-3.5 w-3.5" />
                Template
              </button>
            )}
            
            {!isTemplate && (
              <a href={`/undang/${userId}/${page.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                Preview
              </a>
            )}
          </div>

          {/* Mobile Template button */}
          {!isTemplate && (
            <button
              onClick={() => setShowTemplateModal(true)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white shadow-sm active:scale-95 transition-all mr-1.5"
              title="Pilih Template"
            >
              <PaletteIcon className="h-4 w-4" />
            </button>
          )}

          {/* Mobile More Button */}
          <button 
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MoreVerticalIcon className="h-5 w-5" />
          </button>

          {/* Save button (Always visible) */}
          <button
            onClick={save}
            disabled={saving || !isDirty}
            className="flex items-center gap-1.5 py-1.5 px-3 md:px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            <SaveIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simpan</span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="absolute top-14 right-4 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-50 flex flex-col gap-1 md:hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-1">
              <span className="text-xs font-bold text-gray-600">Menu Tambahan</span>
            </div>
            {!isTemplate && (
              <button onClick={() => { setShowQuickForm(true); setShowMobileMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-pink-600 hover:bg-pink-50 rounded-xl font-semibold">
                <WandIcon className="h-4 w-4 text-pink-500" /> Formulir Cepat
              </button>
            )}
            {!isTemplate && (
              <button onClick={() => { setShowTemplateModal(true); setShowMobileMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-purple-600 hover:bg-purple-50 rounded-xl font-semibold">
                <PaletteIcon className="h-4 w-4" /> Pilih Template
              </button>
            )}
            <button onClick={() => { undo(); setShowMobileMenu(false); }} disabled={past.length === 0} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-50">
              <UndoIcon className="h-4 w-4" /> Batal (Undo)
            </button>
            <button onClick={() => { redo(); setShowMobileMenu(false); }} disabled={future.length === 0} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-50">
              <RedoIcon className="h-4 w-4" /> Ulangi (Redo)
            </button>
            <button onClick={() => { handleExport(); setShowMobileMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 rounded-xl">
              <DownloadIcon className="h-4 w-4" /> Ekspor Desain
            </button>
            <button onClick={() => { handleImportClick(); setShowMobileMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 rounded-xl">
              <UploadIcon className="h-4 w-4" /> Impor Desain
            </button>
            <button onClick={() => { handleReset(); setShowMobileMenu(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 rounded-xl">
              <RotateCcwIcon className="h-4 w-4" /> Reset Template
            </button>
            {!isTemplate && (
              <a href={`/undang/${userId}/${page.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 rounded-xl mt-1 border-t border-gray-100">
                <ExternalLinkIcon className="h-4 w-4" /> Buka Preview Web
              </a>
            )}
          </div>
        )}
      </header>

      {/* ── 3-column layout (Responsive) ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left: Sections */}
        <div className={`
          absolute inset-0 z-20 bg-white transition-transform duration-300
          md:relative md:z-auto md:translate-x-0 md:flex
          ${mobileTab === 'sections' ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'}
        `}>
          <SectionPanel />
        </div>

        {/* Center: Canvas */}
        <div className={`
          flex-1 min-w-0 flex flex-col relative z-10 bg-gray-50
          ${mobileTab === 'canvas' ? 'flex' : 'hidden md:flex'}
        `}>
          <BuilderCanvas />
        </div>

        {/* Right: Properties */}
        <div className={`
          absolute inset-0 z-20 bg-white transition-transform duration-300
          md:relative md:z-auto md:translate-x-0 md:flex
          ${mobileTab === 'properties' ? 'translate-x-0 flex' : 'translate-x-full hidden md:flex'}
        `}>
          <PropertiesPanel />
        </div>
      </div>

      {/* ── Bottom Navigation (Mobile Only) ── */}
      <div className="md:hidden border-t border-gray-200 bg-white flex items-center justify-around px-2 py-1.5 z-30 flex-shrink-0">
        <button
          onClick={() => setMobileTab('sections')}
          className={`flex flex-col items-center justify-center gap-1 w-full rounded-lg py-1 transition-colors ${mobileTab === 'sections' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <LayoutIcon className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Seksi</span>
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex flex-col items-center justify-center gap-1 w-full rounded-lg py-1 transition-colors ${mobileTab === 'canvas' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <SmartphoneIcon className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Preview</span>
        </button>
        <button
          onClick={() => setMobileTab('properties')}
          className={`flex flex-col items-center justify-center gap-1 w-full rounded-lg py-1 transition-colors ${mobileTab === 'properties' ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Edit</span>
        </button>
      </div>

      {showTemplateModal && (
        <TemplateSelectorModal 
          onClose={() => {
            setShowTemplateModal(false);
            if (isOnboarding) {
              setShowWelcomeModal(true);
            }
          }} 
          onImportSuccess={() => {
            setShowTemplateModal(false);
            setIsOnboarding(false);
            setShowQuickForm(true);
          }}
        />
      )}
      {showQuickForm && (
        <QuickFormModal onClose={() => {
          setShowQuickForm(false);
          setIsOnboarding(false);
        }} />
      )}
      {showWelcomeModal && (
        <WelcomeModal
          onSelectTemplate={() => {
            setShowWelcomeModal(false);
            setShowTemplateModal(true);
          }}
          onSelectBlank={() => {
            setShowWelcomeModal(false);
            setShowQuickForm(true);
          }}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}
    </div>
  );
}
