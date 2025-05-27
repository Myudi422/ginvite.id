'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, LinkIcon, ChevronLeft, CopyCheckIcon } from 'lucide-react';

export default function BulkUndanganPage() {
    const router = useRouter();
    const { invitationId, title } = useParams() as { invitationId: string; title: string };

    const [names, setNames] = useState('');
    const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const limit = 10;

    const handleGenerate = () => {
        const nameList = names
            .split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        const links = nameList.map(name => {
            const encodedName = encodeURIComponent(name);
            return `${window.location.origin}/undang/${invitationId}/${title}?to=${encodedName}`;
        });

        setGeneratedLinks(links);
        setPage(1);
    };

    const handleCopyOne = (link: string) => {
        navigator.clipboard.writeText(link);
    };

    const handleCopyAll = () => {
        if (generatedLinks.length > 0) {
            const allText = generatedLinks.join('\n');
            navigator.clipboard.writeText(allText);
        }
    };

    const totalPages = Math.ceil(generatedLinks.length / limit);
    const startIndex = (page - 1) * limit;
    const currentItems = generatedLinks.slice(startIndex, startIndex + limit);

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
                <div className="bg-white shadow rounded-2xl p-6 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Masukkan daftar nama (satu per baris)
                    </label>
                    <Textarea
                        rows={8}
                        placeholder="Contoh:\nBudi\nSiti\nAndi"
                        value={names}
                        onChange={e => setNames(e.target.value)}
                    />
                    <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleGenerate}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Generate Link
                    </Button>
                </div>

                {generatedLinks.length > 0 && (
                    <div className="bg-white shadow rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-pink-700">Hasil Link</h2>
                            <Button
                                size="sm"
                                className="bg-pink-600 hover:bg-pink-700 flex items-center"
                                onClick={handleCopyAll}
                            >
                                <CopyCheckIcon className="mr-1 h-4 w-4" />
                                Copy All
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {currentItems.map((link, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={link}
                                        className="flex-1 p-2 border rounded"
                                    />
                                    <Button
                                        size="sm"
                                        className="bg-pink-600 hover:bg-pink-700"
                                        onClick={() => handleCopyOne(link)}
                                    >
                                        <ClipboardCopy className="h-4 w-4" />
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
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
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
                                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
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
