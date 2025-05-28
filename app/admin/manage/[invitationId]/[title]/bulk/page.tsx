'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    ClipboardCopy,
    LinkIcon,
    ChevronLeft,
    CopyCheckIcon,
    MailCheck,
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
    const [template, setTemplate] = useState(''); // Initialize as empty string
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [loadingTemplate, setLoadingTemplate] = useState(true);
    const [errorLoadingTemplate, setErrorLoadingTemplate] = useState<string | null>(null);

    useEffect(() => {
  const fetchBulkTemplate = async () => {
    setLoadingTemplate(true);
    setErrorLoadingTemplate(null);

    try {
      const response = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_bulk&user_id=${invitationId}&title=${encodeURIComponent(
          title
        )}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || `Failed to fetch template: ${response.status}`
        );
      }

      const data = await response.json();
      if (
        data?.status === 'success' &&
        Array.isArray(data.data) &&
        data.data.length > 0
      ) {
        let raw = data.data[0].text_undangan as string;

        // 1. Ganti semua <br>, <br/> atau <br /> jadi newline
        raw = raw.replace(/<br\s*\/?>/gi, '\n');

        // 2. Strip tag HTML apapun selain teks
        raw = raw.replace(/<\/?[^>]+(>|$)/g, '');

        // 3. Normalize CRLF (\r\n) ke LF (\n)
        raw = raw.replace(/\r\n/g, '\n');

        setTemplate(raw);
      } else {
        setErrorLoadingTemplate('Template undangan tidak ditemukan.');
      }
    } catch (error: any) {
      setErrorLoadingTemplate(error.message);
    } finally {
      setLoadingTemplate(false);
    }
  };

  if (invitationId && title) {
    fetchBulkTemplate();
  }
}, [invitationId, title]);


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

    // Copy functions (unchanged)
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

    // Pagination (unchanged)
    const totalPages = Math.ceil(items.length / limit);
    const start = (page - 1) * limit;
    const currentItems = items.slice(start, start + limit);

    // Case-change helpers (unchanged)
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
                {loadingTemplate && (
                    <div className="bg-white shadow rounded-2xl p-6 text-center text-gray-600">
                        Memuat template undangan...
                    </div>
                )}

                {errorLoadingTemplate && (
                    <div className="bg-white shadow rounded-2xl p-6 text-center text-red-500">
                        Error: {errorLoadingTemplate}
                    </div>
                )}

                {!loadingTemplate && !errorLoadingTemplate && (
                    <>
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
                                                <MailCheck className="h-4 w-4" />
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
                    </>
                )}
            </div>
        </div>
    );
}