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
    Send,
    Check,
    Save,
    Upload,
} from 'lucide-react';

type Item = {
    link: string;
    invitation: string;
    name: string;
    phone?: string;
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

    // Parse nama dan nomor dari format "nama" atau "nama - nomor"
    const parseNameAndPhone = (text: string) => {
        const match = text.match(/^(.+?)\s*-\s*([0-9\s\+]+)$/);
        if (match) {
            return {
                name: match[1].trim(),
                phone: match[2].trim().replace(/\s/g, ''),
            };
        }
        return {
            name: text.trim(),
            phone: undefined,
        };
    };

    // Format nomor telepon dengan rapi
    const formatPhoneNumber = (phone: string): string => {
        if (!phone) return '';
        
        // Hapus semua karakter selain angka
        let cleaned = phone.replace(/[^\d]/g, '');
        
        // Jika mulai dengan 62, convert ke 0
        if (cleaned.startsWith('62')) {
            cleaned = '0' + cleaned.substring(2);
        }
        
        // Jika belum start dengan 0, tambahkan
        if (!cleaned.startsWith('0')) {
            // Assume it's Indonesian number, convert 62 prefix to 0
            if (cleaned.startsWith('62')) {
                cleaned = '0' + cleaned.substring(2);
            } else {
                cleaned = '0' + cleaned;
            }
        }
        
        return cleaned;
    };
    const parseCSVContacts = (csvText: string) => {
        const lines = csvText.trim().split('\n');
        const contacts: string[] = [];

        if (lines.length === 0) return contacts;

        // Parse header untuk menemukan indeks kolom
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Cari indeks First Name atau Name
        let nameIndex = headers.findIndex(h => 
            h.toLowerCase() === 'first name' || 
            h.toLowerCase() === 'name' ||
            h.toLowerCase() === 'given name'
        );
        
        // Cari indeks Phone - bisa "Phone 1 - Value" atau variasi lainnya
        let phoneIndex = headers.findIndex(h => 
            h.toLowerCase().includes('phone') && 
            h.toLowerCase().includes('value')
        );

        // Parse setiap baris data
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Split dengan hati-hati untuk menangani quotes dan spaces
            const cells = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
            
            let name = '';
            let phone = '';

            if (nameIndex >= 0 && cells[nameIndex]) {
                name = cells[nameIndex];
            }

            if (phoneIndex >= 0 && cells[phoneIndex]) {
                phone = cells[phoneIndex].replace(/\s/g, ''); // Remove all spaces from phone
            }

            if (name) {
                const formattedPhone = phone ? formatPhoneNumber(phone) : '';
                const contactLine = formattedPhone ? `${name} - ${formattedPhone}` : name;
                contacts.push(contactLine);
            }
        }

        return contacts;
    };

    const handleContactFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            const text = await file.text();
            
            if (file.name.endsWith('.csv')) {
                const contacts = parseCSVContacts(text);
                
                if (contacts.length === 0) {
                    toast({
                        title: "❌ Tidak Ada Kontak",
                        description: "File CSV tidak memiliki kontak yang valid",
                        variant: "destructive",
                        duration: 2000,
                    });
                    return;
                }

                const newNamesText = contacts.join('\n');
                setNames(prev => prev ? `${prev}\n${newNamesText}` : newNamesText);

                toast({
                    title: "✅ Kontak Diimport!",
                    description: `${contacts.length} kontak berhasil diimport`,
                    duration: 2000,
                });
            } else {
                toast({
                    title: "❌ Format Tidak Didukung",
                    description: "Hanya file CSV yang didukung",
                    variant: "destructive",
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error('Error importing contacts:', error);
            toast({
                title: "❌ Gagal Import",
                description: "Terjadi kesalahan saat mengimport kontak",
                variant: "destructive",
                duration: 2000,
            });
        }

        // Reset input
        if (event.target) {
            event.target.value = '';
        }
    };

    const autoGenerateFromDraft = (namesText: string, templateText: string) => {
        const nameList = namesText
            .split('\n')
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        const newItems = nameList.map((n) => {
            const { name, phone } = parseNameAndPhone(n);
            const encoded = encodeURIComponent(name);
            const link = `${window.location.origin}/undang/${invitationId}/${title}?to=${encoded}`;
            const invitation = templateText
                .replace(/{nama}/g, name)
                .replace(/{link_undangan}/g, link);
            return { link, invitation, name, phone };
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
            const { name, phone } = parseNameAndPhone(n);
            const encoded = encodeURIComponent(name);
            const link = `${window.location.origin}/undang/${invitationId}/${title}?to=${encoded}`;
            // replace both {nama} and {link_undangan}
            const invitation = template
                .replace(/{nama}/g, name)
                .replace(/{link_undangan}/g, link);
            return { link, invitation, name, phone };
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

    const handleCopyInvitation = async (inv: string, index: number, phone?: string) => {
        try {
            await navigator.clipboard.writeText(inv);
            const key = `invitation-${index}`;
            setCopiedItems(prev => new Set([...prev, key]));
            
            // Open WhatsApp with the text
            const waMessage = encodeURIComponent(inv);
            let waUrl: string;
            
            if (phone) {
                // Normalize phone number (remove spaces, ensure it starts with country code or 0)
                let normalizedPhone = phone.replace(/\s/g, '');
                // If starts with 0, replace with 62
                if (normalizedPhone.startsWith('0')) {
                    normalizedPhone = '62' + normalizedPhone.substring(1);
                }
                // If doesn't start with +, add it
                if (!normalizedPhone.startsWith('+')) {
                    normalizedPhone = '+' + normalizedPhone;
                }
                waUrl = `https://wa.me/${normalizedPhone.replace(/\D/g, '')}?text=${waMessage}`;
            } else {
                waUrl = `https://wa.me/?text=${waMessage}`;
            }
            
            window.open(waUrl, '_blank');
            
            toast({
                title: "✅ Teks Undangan Disalin!",
                description: phone ? `Dikirim ke ${phone}` : "Teks undangan disalin & dibuka di WhatsApp",
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
                title: "❌ Gagal",
                description: "Gagal menyalin dan membuka WhatsApp",
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
                                <div className="text-xs text-gray-500 italic">
                                    Format: nama atau nama - nomor telepon
                                </div>
                            </div>
                            <div className="flex space-x-2 mb-4">
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
                                <div className="flex-1"></div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleContactFileImport}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                            input?.click();
                                        }}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Import Kontak
                                    </Button>
                                </label>
                            </div>
                            <Textarea
                                rows={6}
                                placeholder="Contoh:&#10;Budi&#10;Yudi - 082125182347&#10;Siti - +62 812 3456 7890"
                                value={names}
                                onChange={(e) => setNames(e.target.value)}
                            />
                            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
                                <p className="font-semibold mb-2">💡 Cara import dari Google Contacts:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Buka <span className="font-mono text-blue-600">contacts.google.com</span></li>
                                    <li>Pilih kontak yang ingin diexport</li>
                                    <li>Klik menu ⋮ → Export → Google CSV (.csv)</li>
                                    <li>Klik tombol "Import Kontak" dan pilih file CSV</li>
                                </ol>
                            </div>
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
                                                    onClick={() => handleCopyInvitation(it.invitation, start + idx, it.phone)}
                                                    title="Salin dan kirim ke WhatsApp"
                                                >
                                                    {copiedItems.has(invitationKey) ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Send className="h-4 w-4" />
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