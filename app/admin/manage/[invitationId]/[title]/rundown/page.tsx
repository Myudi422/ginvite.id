'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ArrowDown, Eye, Save, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { saveRundownDraft, loadRundownDraft, scheduleAutoSaveRundown } from '@/app/actions/rundownDrafts';

// Define type untuk rundown item
type RundownItem = {
  start: string;
  end: string;
  activity: string;
};

// Fungsi untuk mendapatkan data Base64 dari file JSON secara asinkron
async function getBackgroundBase64FromJSON(): Promise<string> {
  const response = await fetch('/base64.json');
  const data = await response.json();
  return data.pdfBackground; // Pastikan key di file JSON adalah "pdfBackground"
}

export default function RundownPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as { invitationId: string; title: string };

  const [items, setItems] = useState<RundownItem[]>([
    { start: '', end: '', activity: '' },
  ]);

  // State untuk preview PDF
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // State untuk draft management
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // State untuk custom PDF title
  const [customTitle, setCustomTitle] = useState<string>('');

  // Load draft saat component mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!invitationId || !title) {
        console.log('Missing params:', { invitationId, title });
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Loading draft for:', { invitationId, title });
        setIsLoading(true);
        const draft = await loadRundownDraft(invitationId, title);
        
        if (draft && draft.rundown_data) {
          const draftData = JSON.parse(draft.rundown_data);
          if (draftData.items && draftData.items.length > 0) {
            setItems(draftData.items);
            console.log('Draft loaded:', draftData.items);
          }
          if (draftData.customTitle) {
            setCustomTitle(draftData.customTitle);
          }
        } else {
          console.log('No draft found');
        }
      } catch (error) {
        console.error('Failed to load rundown draft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [invitationId, title]);

  // Auto-save dengan debouncing
  useEffect(() => {
    if (!invitationId || !title || isLoading) return;
    
    // Skip auto-save jika hanya ada satu item kosong
    const hasContent = items.some(item => 
      item.start.trim() || item.end.trim() || item.activity.trim()
    );
    
    if (!hasContent) return;

    setSaveStatus('saving');
    setIsSaving(true);
    
    scheduleAutoSaveRundown({
      user_id: invitationId,
      invitation_title: title,
      rundown_data: JSON.stringify({
        items: items,
        customTitle: customTitle
      })
    }).then((result) => {
      setIsSaving(false);
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        // Clear status setelah 3 detik
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        console.error('Auto-save failed:', result.message);
      }
    }).catch((error) => {
      setIsSaving(false);
      setSaveStatus('error');
      console.error('Auto-save error:', error);
    });
  }, [items, customTitle, invitationId, title, isLoading]);

  // Manual save function
  const handleManualSave = async () => {
    if (!invitationId || !title) return;
    
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      const result = await saveRundownDraft({
        user_id: invitationId,
        invitation_title: title,
        rundown_data: JSON.stringify({
          items: items,
          customTitle: customTitle
        })
      });
      
      if (result.success) {
        setSaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        console.error('Manual save failed:', result.message);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Manual save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Tambah baris rundown baru
  const handleAddRow = () => {
    setItems((prev) => [...prev, { start: '', end: '', activity: '' }]);
  };

  // Hapus baris berdasarkan index
  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update field dari rundown item
  const handleChange = (
    index: number,
    field: 'start' | 'end' | 'activity',
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Fungsi untuk generate PDF dengan background, header/footer padding, dan page break otomatis
  const generatePDFDoc = async () => {
    // Buat dokumen PDF baru dengan jsPDF
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Dapatkan string Base64 dari JSON (bukan dengan getBase64FromUrl)
    const backgroundBase64 = await getBackgroundBase64FromJSON();

    // Margin dan padding untuk header & footer
    const margin = 40;
    const paddingTop = 80; // Ruangan atas untuk header/logo
    const paddingBottom = 130; // Ruangan bawah untuk footer
    const tableWidth = 450;
    const colStartWidth = 70;
    const colEndWidth = 70;
    const colActivityWidth = tableWidth - (colStartWidth + colEndWidth);
    const headerHeight = 24;
    const cellPadding = 5;
    const lineHeight = 12;
    const decodedTitle = decodeURIComponent(title || '');
    const dynamicMargin = (pageWidth - tableWidth) / 2; // Dynamically calculate margin to center the table

    // Tambahkan background pada halaman pertama
    doc.addImage(backgroundBase64, 'PNG', 0, 0, pageWidth, pageHeight);

    // Mulai konten dari posisi margin + paddingTop
    let currentY = margin + paddingTop;

    // Judul dokumen
    doc.setFontSize(30);
    const defaultTitle = `Rundown – ${decodedTitle.replace(/-/g, ' ')}`;
    const titleText = customTitle.trim() || defaultTitle;
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2; // Calculate centered position
    doc.text(titleText, titleX, currentY);
    currentY += headerHeight + 10;

    // Header tabel
    doc.setFillColor(249, 207, 217); // light pink
    doc.rect(dynamicMargin, currentY, colStartWidth, headerHeight, 'F');
    doc.rect(dynamicMargin + colStartWidth, currentY, colEndWidth, headerHeight, 'F');
    doc.rect(
      dynamicMargin + colStartWidth + colEndWidth,
      currentY,
      colActivityWidth,
      headerHeight,
      'F'
    );
    doc.setFontSize(12);
    doc.setTextColor(127, 17, 65); // dark pink
    const headerTextY = currentY + headerHeight / 2 + 4;
    doc.text('Mulai', dynamicMargin + cellPadding, headerTextY);
    doc.text('Berakhir', dynamicMargin + colStartWidth + cellPadding, headerTextY);
    doc.text(
      'Kegiatan',
      dynamicMargin + colStartWidth + colEndWidth + cellPadding,
      headerTextY
    );
    currentY += headerHeight;
    doc.setDrawColor(200);
    doc.line(dynamicMargin, currentY, dynamicMargin + tableWidth, currentY);

    // Loop tiap item rundown
    items.forEach((item) => {
      // Pecah teks "Kegiatan" jika panjang agar membungkus
      const activityLines = doc.splitTextToSize(
        item.activity,
        colActivityWidth - 2 * cellPadding
      );
      const textHeight = activityLines.length * lineHeight;
      const cellHeight = Math.max(headerHeight, textHeight + 2 * cellPadding);

      // Jika ruang tidak cukup (dengan padding bawah), pindah ke halaman baru
      if (currentY + cellHeight + paddingBottom > pageHeight) {
        doc.addPage();
        // Tambahkan background di halaman baru
        doc.addImage(backgroundBase64, 'PNG', 0, 0, pageWidth, pageHeight);
        currentY = margin + paddingTop;
        // Gambar ulang header tabel di halaman baru
        doc.setFillColor(249, 207, 217);
        doc.rect(dynamicMargin, currentY, colStartWidth, headerHeight, 'F');
        doc.rect(dynamicMargin + colStartWidth, currentY, colEndWidth, headerHeight, 'F');
        doc.rect(
          dynamicMargin + colStartWidth + colEndWidth,
          currentY,
          colActivityWidth,
          headerHeight,
          'F'
        );
        doc.setTextColor(127, 17, 65);
        const newHeaderY = currentY + headerHeight / 2 + 4;
        doc.text('Mulai', dynamicMargin + cellPadding, newHeaderY); // Use consistent text
        doc.text('Berakhir', dynamicMargin + colStartWidth + cellPadding, newHeaderY); // Use consistent text
        doc.text(
          'Kegiatan',
          dynamicMargin + colStartWidth + colEndWidth + cellPadding,
          newHeaderY
        );
        currentY += headerHeight;
        doc.setDrawColor(200);
        doc.line(dynamicMargin, currentY, dynamicMargin + tableWidth, currentY);
      }

      // Gambar border baris sebagai satu rectangle dan garis vertikal pembagi
      doc.rect(dynamicMargin, currentY, tableWidth, cellHeight);
      doc.line(
        dynamicMargin + colStartWidth,
        currentY,
        dynamicMargin + colStartWidth,
        currentY + cellHeight
      );
      doc.line(
        dynamicMargin + colStartWidth + colEndWidth,
        currentY,
        dynamicMargin + colStartWidth + colEndWidth,
        currentY + cellHeight
      );

      // Isi tiap sel dengan teks, memastikan teks tetap berada dalam batas sel
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(
        item.start,
        dynamicMargin + cellPadding,
        currentY + cellPadding + lineHeight
      );
      doc.text(
        item.end,
        dynamicMargin + colStartWidth + cellPadding,
        currentY + cellPadding + lineHeight
      );
      activityLines.forEach((line, index) => {
        doc.text(
          line,
          dynamicMargin + colStartWidth + colEndWidth + cellPadding,
          currentY + cellPadding + lineHeight * (index + 1)
        );
      });

      currentY += cellHeight;
    });

    // Footer (jika diperlukan) bisa ditambahkan di halaman terakhir, misalnya:
    // doc.setFontSize(10);
    // doc.text('Footer text here', margin, pageHeight - paddingBottom / 2);

    return doc;
  };

  // Fungsi preview PDF: generate PDF, konversi ke Data URI, dan tampilkan di modal
  const handlePreviewPDF = async () => {
    const doc = await generatePDFDoc();
    const dataUrl = doc.output('datauristring');
    setPreviewUrl(dataUrl);
    setShowPreview(true);
  };

  // Fungsi export PDF: generate dan simpan file PDF ke perangkat pengguna
  const handleExportPDF = async () => {
    const doc = await generatePDFDoc();
    const decodedTitle = decodeURIComponent(title || '');
    const filename = customTitle.trim() ? 
      customTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-') : 
      decodedTitle || 'rundown';
    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Modal untuk preview PDF */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Preview PDF</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>
            <iframe
              src={previewUrl}
              title="PDF Preview"
              className="w-full h-[500px]"
            />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between bg-white shadow p-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6 text-pink-600" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-pink-700">
            Rundown – {decodeURIComponent(title || '')}
          </h1>
        </div>
        
        {/* Save Status & Manual Save */}
        <div className="flex items-center space-x-4">
          {/* Save Status Indicator */}
          {saveStatus && (
            <div className="flex items-center space-x-2">
              {saveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                  <span className="text-sm text-gray-600">Menyimpan...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Tersimpan</span>
                </>
              )}
              {saveStatus === 'error' && (
                <span className="text-sm text-red-600">Gagal menyimpan</span>
              )}
            </div>
          )}
          
          {/* Last Saved Time */}
          {lastSaved && !saveStatus && (
            <span className="text-xs text-gray-500">
              Terakhir disimpan: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          {/* Manual Save Button */}
          <Button
            onClick={handleManualSave}
            disabled={isSaving || isLoading}
            variant="outline"
            size="sm"
            className="text-pink-600 border-pink-600 hover:bg-pink-50"
          >
            <Save className="h-4 w-4 mr-1" />
            Simpan
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Section Custom Title */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700">
            Judul PDF (Opsional)
          </h2>
          <div className="space-y-2">
            <Input
              placeholder={`Default: Rundown – ${decodeURIComponent(title || '').replace(/-/g, ' ')}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Kosongkan untuk menggunakan judul default. Judul ini akan muncul di PDF yang diexport.
            </p>
          </div>
        </div>

        {/* Section Input Rundown */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">
              Daftar Rundown
            </h2>
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                <span className="text-sm text-gray-600">Memuat draft...</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="space-y-2 p-3 border border-gray-200 rounded-md"
              >
                {/* Baris 1: Input waktu (Start dan End) */}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    placeholder="Start"
                    value={item.start}
                    onChange={(e) => handleChange(idx, 'start', e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="time"
                    placeholder="End"
                    value={item.end}
                    onChange={(e) => handleChange(idx, 'end', e.target.value)}
                    className="w-full"
                  />
                </div>
                {/* Baris 2: Input keterangan */}
                <div className="relative">
                  <Input
                    placeholder="Keterangan"
                    value={item.activity}
                    onChange={(e) =>
                      handleChange(idx, 'activity', e.target.value)
                    }
                    className="w-full"
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(idx)}
                      className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="text-pink-600 border-pink-600"
          >
            Tambah Baris
          </Button>
        </div>

        {/* Tombol Preview & Export PDF */}
        <div className="bg-white shadow rounded-2xl p-6 flex justify-end space-x-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={handlePreviewPDF}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview PDF
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700 flex items-center"
            onClick={handleExportPDF}
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}