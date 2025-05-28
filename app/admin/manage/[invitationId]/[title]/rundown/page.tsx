
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ArrowDown } from 'lucide-react';
import jsPDF from 'jspdf';

// Define a type for a rundown item
type RundownItem = {
  time: string;
  activity: string;
};

export default function RundownPage() {
  const router = useRouter();
  const { eventId, title } = useParams() as { eventId: string; title: string };

  const [items, setItems] = useState<RundownItem[]>([
    { time: '', activity: '' },
  ]);

  // Add a new empty item
  const handleAddRow = () => {
    setItems((prev) => [...prev, { time: '', activity: '' }]);
  };

  // Remove a row by index
  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a specific field for an item
  const handleChange = (
    index: number,
    field: 'time' | 'activity',
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Export the current rundown to PDF as a neat table
  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const startY = 60;
    let currentY = startY;
    const rowHeight = 20;
    const colTimeWidth = 100;
    const colActivityWidth = 450 - colTimeWidth;

    // Title
    doc.setFontSize(18);
    const decodedTitle = decodeURIComponent(title || '');
    doc.text(`Rundown – ${decodedTitle}`, margin, currentY);
    currentY += rowHeight * 2;

    // Header background
    doc.setFillColor(249, 207, 217); // light pink
    doc.rect(margin, currentY - rowHeight + 4, colTimeWidth, rowHeight, 'F');
    doc.rect(margin + colTimeWidth, currentY - rowHeight + 4, colActivityWidth, rowHeight, 'F');

    // Table headers
    doc.setFontSize(12);
    doc.setTextColor(127, 17, 65); // dark pink
    doc.text('Waktu', margin + 5, currentY);
    doc.text('Kegiatan', margin + colTimeWidth + 5, currentY);
    currentY += rowHeight;

    // Draw header bottom border
    doc.setDrawColor(200);
    doc.line(margin, currentY - 5, margin + colTimeWidth + colActivityWidth, currentY - 5);

    // List items
    doc.setTextColor(0, 0, 0);
    items.forEach((item, index) => {
      // Page break
      if (currentY + rowHeight > 800) {
        doc.addPage();
        currentY = margin;
      }

      // Draw cell borders
      doc.rect(margin, currentY - rowHeight + 4, colTimeWidth, rowHeight);
      doc.rect(margin + colTimeWidth, currentY - rowHeight + 4, colActivityWidth, rowHeight);

      // Text
      doc.text(item.time, margin + 5, currentY);
      doc.text(item.activity, margin + colTimeWidth + 5, currentY);
      currentY += rowHeight;
    });

    doc.save(`${decodedTitle || 'rundown'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* HEADER */}
      <div className="flex items-center bg-white shadow p-4">
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

      <div className="p-6 space-y-6">
        {/* Rundown Input Section */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-gray-700">Daftar Rundown</h2>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3">
                  <Input
                    placeholder="Waktu (Contoh: 10:00)"
                    value={item.time}
                    onChange={(e) => handleChange(idx, 'time', e.target.value)}
                  />
                </div>
                <div className="col-span-8">
                  <Input
                    placeholder="Kegiatan"
                    value={item.activity}
                    onChange={(e) => handleChange(idx, 'activity', e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveRow(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleAddRow} className="text-pink-600 border-pink-600">
            Tambah Baris
          </Button>
        </div>

        {/* Export PDF Button */}
        <div className="bg-white shadow rounded-2xl p-6 flex justify-end">
          <Button className="bg-pink-600 hover:bg-pink-700 flex items-center" onClick={handleExportPDF}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
