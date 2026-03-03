'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ArrowDown,
  Eye,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Clock,
  FileText,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { saveRundownDraft, loadRundownDraft, scheduleAutoSaveRundown } from '@/app/actions/rundownDrafts';

type RundownItem = {
  start: string;
  end: string;
  activity: string;
};

async function getBackgroundBase64FromJSON(): Promise<string> {
  const response = await fetch('/base64.json');
  const data = await response.json();
  return data.pdfBackground;
}

export default function RundownPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as { invitationId: string; title: string };

  const [items, setItems] = useState<RundownItem[]>([{ start: '', end: '', activity: '' }]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    const loadDraft = async () => {
      if (!invitationId || !title) { setIsLoading(false); return; }
      try {
        setIsLoading(true);
        const draft = await loadRundownDraft(invitationId, title);
        if (draft?.rundown_data) {
          const d = JSON.parse(draft.rundown_data);
          if (d.items?.length > 0) setItems(d.items);
          if (d.customTitle) setCustomTitle(d.customTitle);
        }
      } catch (e) {
        console.error('Failed to load rundown draft:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadDraft();
  }, [invitationId, title]);

  useEffect(() => {
    if (!invitationId || !title || isLoading) return;
    const hasContent = items.some(i => i.start || i.end || i.activity);
    if (!hasContent) return;
    setSaveStatus('saving');
    setIsSaving(true);
    scheduleAutoSaveRundown({
      user_id: invitationId,
      invitation_title: title,
      rundown_data: JSON.stringify({ items, customTitle }),
    }).then(result => {
      setIsSaving(false);
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
      }
    }).catch(() => { setIsSaving(false); setSaveStatus('error'); });
  }, [items, customTitle, invitationId, title, isLoading]);

  const handleManualSave = async () => {
    if (!invitationId || !title) return;
    try {
      setIsSaving(true); setSaveStatus('saving');
      const result = await saveRundownDraft({
        user_id: invitationId,
        invitation_title: title,
        rundown_data: JSON.stringify({ items, customTitle }),
      });
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch { setSaveStatus('error'); }
    finally { setIsSaving(false); }
  };

  const handleAddRow = () => setItems(prev => [...prev, { start: '', end: '', activity: '' }]);
  const handleRemoveRow = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const handleChange = (index: number, field: keyof RundownItem, value: string) =>
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

  const generatePDFDoc = async () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const backgroundBase64 = await getBackgroundBase64FromJSON();
    const margin = 40, paddingTop = 80, paddingBottom = 130;
    const tableWidth = 450, colStartWidth = 70, colEndWidth = 70;
    const colActivityWidth = tableWidth - (colStartWidth + colEndWidth);
    const headerHeight = 24, cellPadding = 5, lineHeight = 12;
    const decodedTitle = decodeURIComponent(title || '');
    const dynamicMargin = (pageWidth - tableWidth) / 2;

    doc.addImage(backgroundBase64, 'PNG', 0, 0, pageWidth, pageHeight);
    let currentY = margin + paddingTop;

    doc.setFontSize(30);
    const titleText = customTitle.trim() || `Rundown – ${decodedTitle.replace(/-/g, ' ')}`;
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, (pageWidth - titleWidth) / 2, currentY);
    currentY += headerHeight + 10;

    const drawHeader = (y: number) => {
      doc.setFillColor(249, 207, 217);
      doc.rect(dynamicMargin, y, colStartWidth, headerHeight, 'F');
      doc.rect(dynamicMargin + colStartWidth, y, colEndWidth, headerHeight, 'F');
      doc.rect(dynamicMargin + colStartWidth + colEndWidth, y, colActivityWidth, headerHeight, 'F');
      doc.setFontSize(12); doc.setTextColor(127, 17, 65);
      const hY = y + headerHeight / 2 + 4;
      doc.text('Mulai', dynamicMargin + cellPadding, hY);
      doc.text('Berakhir', dynamicMargin + colStartWidth + cellPadding, hY);
      doc.text('Kegiatan', dynamicMargin + colStartWidth + colEndWidth + cellPadding, hY);
      doc.setDrawColor(200);
      doc.line(dynamicMargin, y + headerHeight, dynamicMargin + tableWidth, y + headerHeight);
      return y + headerHeight;
    };

    currentY = drawHeader(currentY);

    items.forEach(item => {
      const activityLines = doc.splitTextToSize(item.activity, colActivityWidth - 2 * cellPadding);
      const cellHeight = Math.max(headerHeight, activityLines.length * lineHeight + 2 * cellPadding);
      if (currentY + cellHeight + paddingBottom > pageHeight) {
        doc.addPage();
        doc.addImage(backgroundBase64, 'PNG', 0, 0, pageWidth, pageHeight);
        currentY = drawHeader(margin + paddingTop);
      }
      doc.rect(dynamicMargin, currentY, tableWidth, cellHeight);
      doc.line(dynamicMargin + colStartWidth, currentY, dynamicMargin + colStartWidth, currentY + cellHeight);
      doc.line(dynamicMargin + colStartWidth + colEndWidth, currentY, dynamicMargin + colStartWidth + colEndWidth, currentY + cellHeight);
      doc.setTextColor(0, 0, 0); doc.setFontSize(12);
      doc.text(item.start, dynamicMargin + cellPadding, currentY + cellPadding + lineHeight);
      doc.text(item.end, dynamicMargin + colStartWidth + cellPadding, currentY + cellPadding + lineHeight);
      activityLines.forEach((line: string, i: number) => {
        doc.text(line, dynamicMargin + colStartWidth + colEndWidth + cellPadding, currentY + cellPadding + lineHeight * (i + 1));
      });
      currentY += cellHeight;
    });
    return doc;
  };

  const handlePreviewPDF = async () => {
    const doc = await generatePDFDoc();
    setPreviewUrl(doc.output('datauristring'));
    setShowPreview(true);
  };

  const handleExportPDF = async () => {
    const doc = await generatePDFDoc();
    const decoded = decodeURIComponent(title || '');
    const filename = customTitle.trim()
      ? customTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')
      : decoded || 'rundown';
    doc.save(`${filename}.pdf`);
  };

  const filledCount = items.filter(i => i.activity.trim()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">

      {/* ── Preview Modal ── */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-pink-500" />
                <h2 className="font-bold text-gray-800">Preview PDF Rundown</h2>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <iframe src={previewUrl} title="PDF Preview" className="w-full h-[500px]" />
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="flex items-center gap-3 p-4 max-w-5xl mx-auto">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-pink-50 transition-colors">
            <ChevronLeft className="h-5 w-5 text-pink-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-800 truncate">Rundown Generate</h1>
            <p className="text-xs text-pink-500 truncate">{decodeURIComponent(title || '')}</p>
          </div>
          {/* Save status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan...
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <CheckCircle className="h-3 w-3" /> Tersimpan
              </div>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full">Gagal simpan</span>
            )}
            {lastSaved && !saveStatus && (
              <span className="text-xs text-gray-400 hidden sm:block">
                {lastSaved.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={handleManualSave}
              disabled={isSaving || isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-pink-200 text-pink-600 text-xs font-semibold hover:bg-pink-50 disabled:opacity-50 transition-all"
            >
              <Save className="h-3.5 w-3.5" /> Simpan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:px-8 pb-10 space-y-5">

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 text-white shadow-sm">
            <FileText className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{items.length}</p>
            <p className="text-xs text-white/75">Total Sesi</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 text-white shadow-sm">
            <CheckCircle className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{filledCount}</p>
            <p className="text-xs text-white/75">Terisi</p>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl p-4 text-white shadow-sm">
            <Clock className="h-5 w-5 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{items.filter(i => i.start).length}</p>
            <p className="text-xs text-white/75">Waktu Diisi</p>
          </div>
        </div>

        {/* Judul PDF */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">1</div>
            <span className="text-sm font-semibold text-gray-700">Judul PDF (Opsional)</span>
          </div>
          <Input
            placeholder={`Default: Rundown – ${decodeURIComponent(title || '').replace(/-/g, ' ')}`}
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            className="rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-300"
          />
          <p className="text-xs text-gray-400">Kosongkan untuk gunakan judul default dari nama undangan.</p>
        </div>

        {/* Daftar Rundown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm font-semibold text-gray-700">Daftar Rundown</span>
            </div>
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Loader2 className="h-3 w-3 animate-spin" /> Memuat draft...
              </div>
            )}
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3 hover:border-pink-200 transition-colors"
              >
                {/* No. & hapus */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-pink-500">Sesi {idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(idx)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Waktu */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Mulai</label>
                    <Input
                      type="time"
                      value={item.start}
                      onChange={e => handleChange(idx, 'start', e.target.value)}
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Berakhir</label>
                    <Input
                      type="time"
                      value={item.end}
                      onChange={e => handleChange(idx, 'end', e.target.value)}
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-300 text-sm"
                    />
                  </div>
                </div>
                {/* Kegiatan */}
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Kegiatan / Keterangan</label>
                  <Input
                    placeholder="Contoh: Akad Nikah, Resepsi, Hiburan..."
                    value={item.activity}
                    onChange={e => handleChange(idx, 'activity', e.target.value)}
                    className="rounded-xl border-gray-200 focus:ring-2 focus:ring-pink-300 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddRow}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-pink-200 text-pink-500 text-sm font-semibold hover:bg-pink-50 hover:border-pink-400 transition-all"
          >
            <Plus className="h-4 w-4" /> Tambah Sesi
          </button>
        </div>

        {/* Export */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">3</div>
            <span className="text-sm font-semibold text-gray-700">Export PDF</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handlePreviewPDF}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition-all"
            >
              <Eye className="h-4 w-4" /> Preview PDF
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-sm shadow-md hover:shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              <ArrowDown className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}