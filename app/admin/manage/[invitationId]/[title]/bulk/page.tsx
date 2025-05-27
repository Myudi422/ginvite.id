'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  ClipboardCopy,
  LinkIcon,
  ChevronLeft,
  CopyCheckIcon,
} from 'lucide-react';

type Item = {
  link: string;
  invitation: string;
};

export default function BulkUndanganPage() {
  const router = useRouter();
  const { invitationId, title } = useParams() as {
    invitationId: string;
    title: string;
  };

  const [names, setNames] = useState('');
  const [template, setTemplate] = useState(`Assalamu’alaikum Warahmatullahi Wabarakatuh.

Yth. {nama},

Dengan segala hormat, kami mengundang Anda untuk hadir dan memberikan doa restu pada acara pernikahan putra dan putri kami:

**Rizki & Nisya**

Insya Allah akan dilaksanakan pada:

Hari/Tanggal: [TGL] ([ISO_DATE])
Waktu Akad: [JAM]
Tempat Akad: [LOKASI]

Hari/Tanggal Resepsi: Senin, 2 Juni 2025
Waktu Resepsi: 12:11 WIB
Tempat Resepsi: Masjid Al Maidah

Kehadiran Anda merupakan kehormatan dan kebahagiaan bagi kami.
Untuk konfirmasi kehadiran & informasi lebih lanjut, silakan kunjungi: {link_undangan}

Wassalamu’alaikum Warahmatullahi Wabarakatuh.

Hormat kami,
Keluarga Ahmad & Siti
Keluarga ORTU KAMU & Ibu Ani`);
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Generate links + personalized invitation
  const handleGenerate = () => {
    const nameList = names
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const newItems = nameList.map((n) => {
      const encoded = encodeURIComponent(n);
      const link = `${window.location.origin}/undang/${invitationId}/${title}?to=${encoded}`;
      // replace both {nama} and {link_undangan}
      const invitation = template
        .replace(/{nama}/g, n)
        .replace(/{link_undangan}/g, link);
      return { link, invitation };
    });

    setItems(newItems);
    setPage(1);
  };

  // Copy functions
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };
  const handleCopyInvitation = (inv: string) => {
    navigator.clipboard.writeText(inv);
  };
  const handleCopyAllLinks = () => {
    const pageLinks = currentItems.map((i) => i.link).join('\n');
    navigator.clipboard.writeText(pageLinks);
  };

  // Pagination
  const totalPages = Math.ceil(items.length / limit);
  const start = (page - 1) * limit;
  const currentItems = items.slice(start, start + limit);

  // Case-change helpers
  const toCapitalized = (text: string) =>
    text
      .split('\n')
      .map((line) =>
        line.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join('\n');
  const toUpperCase = (text: string) => text.toUpperCase();
  const toLowerCase = (text: string) => text.toLowerCase();
  const handleCaseChange = (type: 'capital' | 'upper' | 'lower') => {
    if (type === 'capital') setNames(toCapitalized(names));
    if (type === 'upper') setNames(toUpperCase(names));
    if (type === 'lower') setNames(toLowerCase(names));
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
          Bulk Undangan – {decodeURIComponent(title!)}
        </h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Nama + Case Buttons */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Masukkan daftar nama (satu per baris)
            </label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCaseChange('capital')}
              >
                Az
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCaseChange('upper')}
              >
                AZ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCaseChange('lower')}
              >
                az
              </Button>
            </div>
          </div>
          <Textarea
            rows={6}
            placeholder="Contoh:\nBudi\nSiti\nAndi"
            value={names}
            onChange={(e) => setNames(e.target.value)}
          />
        </div>

        {/* Template Undangan */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Template Undangan (gunakan {'{nama}'} dan {'{link_undangan}'} untuk placeholder)
            </label>
          </div>
          <Textarea
            rows={10}
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
          <Button
            className="bg-pink-600 hover:bg-pink-700"
            onClick={handleGenerate}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Generate Link
          </Button>
        </div>

        {/* Hasil Link */}
        {items.length > 0 && (
          <div className="bg-white shadow rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-pink-700">
                Hasil Link (Page {page} / {totalPages})
              </h2>
              <Button
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 flex items-center"
                onClick={handleCopyAllLinks}
              >
                <CopyCheckIcon className="mr-1 h-4 w-4" />
                Copy All
              </Button>
            </div>

            <div className="space-y-3">
              {currentItems.map((it, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={it.link}
                    className="flex-1 p-2 border rounded"
                  />
                  <Button
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={() => handleCopyLink(it.link)}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyInvitation(it.invitation)}
                  >
                    Copy Undangan
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  className="text-pink-600 border-pink-600"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Prev
                </Button>
                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="text-pink-600 border-pink-600"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
