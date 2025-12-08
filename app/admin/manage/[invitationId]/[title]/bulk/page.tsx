'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveBulkDraft, loadBulkDraft } from '@/app/actions/bulkDrafts';
import {
    ClipboardCopy,
    LinkIcon,
    ChevronLeft,
    CopyCheckIcon,
    MailCheck,
    Check,
    Save,
} from 'lucide-react';

type Item = {
    link: string;
    invitation: string;
};

export default function BulkUndanganPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { invitationId, title } = useParams() as {
        invitationId: string;
        title: string;
    };

    const [names, setNames] = useState('');
    const [template, setTemplate] = useState(''); // Initialize as empty string
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(1);
    const limit = 50; // Increased from 10 to 50 untuk better UX
    const [loadingTemplate, setLoadingTemplate] = useState(true);
    const [errorLoadingTemplate, setErrorLoadingTemplate] = useState<string | null>(null);
    const [isDraftSaving, setIsDraftSaving] = useState(false);
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
    const [invitationChecklist, setInvitationChecklist] = useState<Set<string>>(new Set());

    // Auto-save draft function (optimized untuk high traffic)
    const saveDraft = useCallback(async (namesText: string, templateText: string) => {
        if (!namesText.trim() && !templateText.trim()) return;
        
        setIsDraftSaving(true);
        try {
            const result = await saveBulkDraft({
                user_id: invitationId,
                invitation_title: title,
                names_list: namesText,
                template_text: templateText,
                checklist_data: JSON.stringify(Array.from(invitationChecklist)),
            });
            
            if (!result.success) {
                throw new Error(result.message || 'Save failed');
            }

            // Hanya tampilkan success toast sesekali untuk mengurangi spam
            if (Math.random() < 0.2) { // 20% chance
                toast({
                    title: "💾 Draft tersimpan",
                    duration: 1500,
                });
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            toast({
                title: "❌ Error",
                description: "Gagal menyimpan draft",
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setIsDraftSaving(false);
        }
    }, [invitationId, title, toast, invitationChecklist]);

    // Load draft and template on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoadingTemplate(true);
            setErrorLoadingTemplate(null);

            try {
                // Load draft first
                const draftData = await loadBulkDraft(invitationId, title);
                
                if (draftData) {
                    setNames(draftData.names_list || '');
                    
                    // Restore checklist state
                    if (draftData.checklist_data) {
                        try {
                            const checklistArray = JSON.parse(draftData.checklist_data);
                            setInvitationChecklist(new Set(checklistArray));
                        } catch (e) {
                            console.warn('Failed to parse checklist data:', e);
                        }
                    }
                    
                    if (draftData.template_text) {
                        setTemplate(draftData.template_text);
                        setLoadingTemplate(false);
                        
                        // Auto-generate if both names and template exist
                        if (draftData.names_list && draftData.names_list.trim()) {
                            setTimeout(() => {
                                autoGenerateFromDraft(draftData.names_list, draftData.template_text);
                            }, 500); // Small delay to ensure state is set
                        }
                        
                        return; // Use draft template, don't fetch from server
                    }
                }

                // If no draft template, fetch from server
                const templateResponse = await fetch(
                    `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_bulk&user_id=${invitationId}&title=${encodeURIComponent(title)}`
                );
                
                if (!templateResponse.ok) {
                    const errorData = await templateResponse.json();
                    throw new Error(errorData?.message || `Failed to fetch template: ${templateResponse.status}`);
                }

                const templateData = await templateResponse.json();
                if (templateData?.status === 'success' && Array.isArray(templateData.data) && templateData.data.length > 0) {
                    let raw = templateData.data[0].text_undangan as string;
                    // Clean HTML
                    raw = raw.replace(/<br\s*\/?>/gi, '\n');
                    raw = raw.replace(/<\/?[^>]+(>|$)/g, '');
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
            fetchData();
        }
    }, [invitationId, title]);

    // Auto-save draft when names or template changes (optimized for high traffic)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (names || template) {
                saveDraft(names, template);
            }
        }, 5000); // Increased to 5 seconds untuk mengurangi load server

        return () => clearTimeout(timeoutId);
    }, [names, template, saveDraft]);

    // Auto-save checklist when it changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (invitationChecklist.size > 0 || names || template) {
                saveDraft(names, template);
            }
        }, 2000); // Save checklist changes after 2 seconds

        return () => clearTimeout(timeoutId);
    }, [invitationChecklist, names, template, saveDraft]);

    // Auto-generate from draft data
    const autoGenerateFromDraft = (namesText: string, templateText: string) => {
        const nameList = namesText
            .split('\n')
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        const newItems = nameList.map((n) => {
            const encoded = encodeURIComponent(n);
            const link = `${window.location.origin}/undang/${invitationId}/${title}?to=${encoded}`;
            const invitation = templateText
                .replace(/{nama}/g, n)
                .replace(/{link_undangan}/g, link);
            return { link, invitation };
        });

        setItems(newItems);
        setPage(1);
        
        toast({
            title: "🎉 Draft Loaded!",
            description: `${newItems.length} undangan siap dari draft tersimpan`,
            duration: 3000,
        });
    };

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

    // Copy functions with feedback
    const handleCopyLink = async (link: string, index: number) => {
        try {
            await navigator.clipboard.writeText(link);
            const key = `link-${index}`;
            setCopiedItems(prev => new Set([...prev, key]));
            
            toast({
                title: "✅ Link Disalin!",
                description: "Link undangan berhasil disalin ke clipboard",
                duration: 2000,
            });
            
            // Remove checkmark after 3 seconds
            setTimeout(() => {
                setCopiedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
            }, 3000);
        } catch (error) {
            toast({
                title: "❌ Gagal Menyalin",
                description: "Gagal menyalin link ke clipboard",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const handleCopyInvitation = async (inv: string, index: number) => {
        try {
            await navigator.clipboard.writeText(inv);
            const key = `invitation-${index}`;
            setCopiedItems(prev => new Set([...prev, key]));
            
            toast({
                title: "✅ Teks Undangan Disalin!",
                description: "Teks undangan berhasil disalin ke clipboard",
                duration: 2000,
            });
            
            // Remove checkmark after 3 seconds
            setTimeout(() => {
                setCopiedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
            }, 3000);
        } catch (error) {
            toast({
                title: "❌ Gagal Menyalin",
                description: "Gagal menyalin teks undangan ke clipboard",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    // Toggle invitation checklist
    const toggleInvitationCheck = (index: number) => {
        const key = `invitation-${index}`;
        setInvitationChecklist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleCopyAllLinks = async () => {
        try {
            const pageLinks = currentItems.map((i) => i.link).join('\n');
            await navigator.clipboard.writeText(pageLinks);
            
            toast({
                title: "✅ Semua Link Disalin!",
                description: `${currentItems.length} link berhasil disalin ke clipboard`,
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: "❌ Gagal Menyalin",
                description: "Gagal menyalin semua link ke clipboard",
                variant: "destructive",
                duration: 2000,
            });
        }
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
                <h1 className="ml-4 text-lg font-semibold text-pink-700 flex items-center gap-2">
                    Bulk Undangan – {decodeURIComponent(title!)}
                    {isDraftSaving && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Save className="h-3 w-3 animate-spin" />
                            Menyimpan...
                        </span>
                    )}
                </h1>
            </div>

            <div className="p-4 space-y-4">
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
                                    {currentItems.map((it, idx) => {
                                        const linkKey = `link-${start + idx}`;
                                        const invitationKey = `invitation-${start + idx}`;
                                        return (
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
                                                    onClick={() => handleCopyLink(it.link, start + idx)}
                                                >
                                                    {copiedItems.has(linkKey) ? (
                                                        <Check className="h-4 w-4 text-green-300" />
                                                    ) : (
                                                        <ClipboardCopy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCopyInvitation(it.invitation, start + idx)}
                                                >
                                                    {copiedItems.has(invitationKey) ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <MailCheck className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={invitationChecklist.has(invitationKey) ? "default" : "outline"}
                                                    className={invitationChecklist.has(invitationKey) ? "bg-green-600 hover:bg-green-700" : ""}
                                                    onClick={() => toggleInvitationCheck(start + idx)}
                                                    title="Tandai sudah dikirim"
                                                >
                                                    <Check className={`h-4 w-4 ${
                                                        invitationChecklist.has(invitationKey) 
                                                            ? "text-white" 
                                                            : "text-gray-400"
                                                    }`} />
                                                </Button>
                                            </div>
                                        );
                                    })}
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