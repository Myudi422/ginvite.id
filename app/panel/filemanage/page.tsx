"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Trash2, File, Image as ImageIcon, Search, Folder, Download, Copy, RefreshCw, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FileItem {
    type: 'file';
    name: string;
    key: string;
    size: number;
    lastModified: string;
    url: string;
}

interface FolderItem {
    type: 'folder';
    name: string;
    path: string;
}

type SortField = 'name' | 'size' | 'date';
type SortOrder = 'asc' | 'desc';

export default function FileManagerPage() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [currentPrefix, setCurrentPrefix] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sorting and Filtering state
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');

    useEffect(() => {
        fetchFiles(currentPrefix);
    }, [currentPrefix]);

    const fetchFiles = async (prefix: string) => {
        setLoading(true);
        try {
            const url = new URL("https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_list.php");
            if (prefix) url.searchParams.append("prefix", prefix);

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error("Gagal mengambil daftar file");

            const data = await res.json();
            if (data.success) {
                setFiles(data.files || []);
                setFolders(data.folders || []);
            } else {
                toast.error(data.message || "Gagal memuat file");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan jaringan.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderPath", currentPrefix); // Upload to current folder

        try {
            const res = await fetch("https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_admin_upload.php", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                toast.success("File berhasil diunggah");
                fetchFiles(currentPrefix); // Refresh list
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                toast.error(data.message || "Gagal mengunggah file");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat mengunggah.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (url: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus file ini?")) return;

        try {
            const formData = new FormData();
            formData.append("imageUrl", url);

            const res = await fetch("https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_hapus.php", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                toast.success("File berhasil dihapus");
                setFiles(files.filter(f => f.url !== url));
            } else {
                toast.error(data.message || "Gagal menghapus file");
            }
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat menghapus.");
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("URL berhasil disalin!");
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const getFileExtension = (name: string) => name.split('.').pop()?.toLowerCase() || '';

    const isImage = (name: string) => {
        return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(getFileExtension(name));
    };

    const navigateToFolder = (path: string) => {
        setCurrentPrefix(path);
    };

    const navigateUp = () => {
        if (!currentPrefix) return;
        const parts = currentPrefix.split('/').filter(Boolean);
        parts.pop(); // remove last part
        const newPrefix = parts.length > 0 ? parts.join('/') + '/' : '';
        setCurrentPrefix(newPrefix);
    };

    // Build Breadcrumbs
    const breadcrumbs = [];
    let pathBuilder = "";
    const parts = currentPrefix.split('/').filter(Boolean);
    for (const part of parts) {
        pathBuilder += part + '/';
        breadcrumbs.push({ name: part, path: pathBuilder });
    }

    // Filter and Sort Folders
    const filteredFolders = folders.filter(folder => {
        const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = fileTypeFilter === 'all' || fileTypeFilter === 'folder';
        return matchesSearch && matchesType;
    });

    const sortedFolders = [...filteredFolders].sort((a, b) => {
        if (sortField === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return 0; // folders don't have size or date
    });

    // Filter and Sort Files
    const filteredFiles = files.filter(file => {
        // 1. Search term filter
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Type filter
        let matchesType = true;
        if (fileTypeFilter !== 'all') {
            if (fileTypeFilter === 'folder') {
                matchesType = false;
            } else {
                const ext = getFileExtension(file.name);
                if (fileTypeFilter === 'image') {
                    matchesType = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext);
                } else if (fileTypeFilter === 'document') {
                    matchesType = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'].includes(ext);
                } else if (fileTypeFilter === 'media') {
                    matchesType = ['mp3', 'mp4', 'wav', 'avi', 'mov'].includes(ext);
                } else if (fileTypeFilter === 'archive') {
                    matchesType = ['zip', 'rar', 'tar', 'gz', '7z'].includes(ext);
                }
            }
        }

        return matchesSearch && matchesType;
    });

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        if (sortField === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === 'size') {
            return sortOrder === 'asc' ? a.size - b.size : b.size - a.size;
        } else { // date
            const dateA = new Date(a.lastModified).getTime();
            const dateB = new Date(b.lastModified).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
    });

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder(field === 'name' ? 'asc' : 'desc'); // default asc for name, desc for others
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 inline" /> : <ArrowDown className="w-3 h-3 ml-1 inline" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4 md:p-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        File Manager
                    </h1>
                    <p className="text-sm text-pink-600 mt-1">
                        Kelola semua file dan folder di penyimpanan admin
                    </p>
                </div>
            </div>

            {/* Upload section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-500"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-pink-500" />
                        Unggah File Baru
                    </h2>
                    <div className="text-sm font-medium text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100 flex items-center">
                        <Folder className="w-4 h-4 mr-2" />
                        Target: {currentPrefix || 'Root /'}
                    </div>
                </div>

                <div className="w-full">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-pink-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : 'border-pink-300'}`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-6 h-6 text-pink-500 mb-2" />
                            <p className="text-sm text-gray-500">
                                {uploading ? "Sedang mengunggah..." : <><span className="font-semibold text-pink-600">Klik untuk unggah ke folder ini</span> atau seret dan lepas</>}
                            </p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Browser Controls */}
            <div className="bg-white rounded-t-3xl p-4 border-b border-pink-50 pb-4 shadow-sm relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm font-medium text-gray-600 overflow-x-auto whitespace-nowrap w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                        <button
                            onClick={() => navigateToFolder('')}
                            className="hover:text-pink-600 transition-colors flex items-center"
                        >
                            <Folder className="w-4 h-4 mr-1 text-pink-400" /> Root
                        </button>
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={crumb.path}>
                                <ChevronRight className="w-4 h-4 mx-1 text-gray-400 flex-shrink-0" />
                                <button
                                    onClick={() => navigateToFolder(crumb.path)}
                                    className="hover:text-pink-600 transition-colors flex-shrink-0"
                                >
                                    {crumb.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Tools & Filters */}
                    <div className="flex items-center gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
                        {/* File Type Filter */}
                        <select
                            value={fileTypeFilter}
                            onChange={(e) => setFileTypeFilter(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-1.5 outline-none"
                        >
                            <option value="all">Semua Tipe</option>
                            <option value="folder">Folder</option>
                            <option value="image">Gambar</option>
                            <option value="document">Dokumen</option>
                            <option value="media">Audio/Video</option>
                            <option value="archive">Zip/Archive</option>
                        </select>

                        {/* Sorter */}
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 text-sm flex-shrink-0">
                            <span className="text-gray-500 mr-2 text-xs uppercase font-bold tracking-wider hidden sm:inline">Urut:</span>
                            <button onClick={() => toggleSort('name')} className={`px-2 py-1.5 hover:text-pink-600 ${sortField === 'name' ? 'text-pink-600 font-semibold' : ''}`}>Nama <SortIcon field="name" /></button>
                            <button onClick={() => toggleSort('size')} className={`px-2 py-1.5 hover:text-pink-600 ${sortField === 'size' ? 'text-pink-600 font-semibold' : ''}`}>Size <SortIcon field="size" /></button>
                            <button onClick={() => toggleSort('date')} className={`px-2 py-1.5 hover:text-pink-600 ${sortField === 'date' ? 'text-pink-600 font-semibold' : ''}`}>Tgl <SortIcon field="date" /></button>
                        </div>

                        {/* Search */}
                        <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-lg flex-shrink-0 min-w-[120px] max-w-[160px]">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari file..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm px-2 py-1.5 w-full text-gray-700 outline-none"
                            />
                        </div>

                        {/* Refresh */}
                        <Button
                            onClick={() => fetchFiles(currentPrefix)}
                            variant="outline"
                            className="text-gray-500 hover:text-pink-600 border-gray-200 w-9 h-9 p-0 flex items-center justify-center flex-shrink-0"
                            disabled={loading}
                            title="Muat ulang folder ini"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* File & Folder Grid */}
            <div className="bg-white rounded-b-3xl p-6 shadow-sm min-h-[400px]">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-gray-50 animate-pulse rounded-2xl h-40 border border-gray-100"></div>
                        ))}
                    </div>
                ) : (sortedFolders.length === 0 && sortedFiles.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        {currentPrefix ? (
                            <>
                                <Folder className="w-16 h-16 mb-4 text-gray-200" />
                                <p>Folder ini kosong.</p>
                                <Button variant="link" onClick={navigateUp} className="text-pink-500 mt-2">Kembali ke folder sebelumnya</Button>
                            </>
                        ) : (
                            <>
                                <File className="w-16 h-16 mb-4 text-gray-200" />
                                <p>Belum ada file atau folder.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

                        {/* Render Back Button if not in root */}
                        {currentPrefix && (
                            <div
                                onClick={navigateUp}
                                className="bg-gray-50 hover:bg-pink-50 rounded-2xl border border-dashed border-gray-300 hover:border-pink-300 cursor-pointer flex flex-col items-center justify-center h-full min-h-[220px] transition-colors group"
                            >
                                <Folder className="w-12 h-12 text-gray-400 group-hover:text-pink-400 mb-2" />
                                <span className="font-medium text-gray-500 group-hover:text-pink-600">.. (Kembali)</span>
                            </div>
                        )}

                        {/* Render Folders */}
                        {sortedFolders.map((folder) => (
                            <div
                                key={folder.path}
                                onClick={() => navigateToFolder(folder.path)}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-pink-200 hover:shadow-md cursor-pointer group flex flex-col h-full min-h-[220px] transition-all"
                            >
                                <div className="flex-1 bg-gray-50/50 flex flex-col items-center justify-center rounded-t-2xl border-b border-gray-50">
                                    <Folder className="w-16 h-16 text-pink-300 group-hover:text-pink-400 transition-colors" />
                                </div>
                                <div className="p-4 h-16 flex items-center justify-center border-t border-gray-50 bg-white rounded-b-2xl">
                                    <p className="font-bold text-gray-700 text-center truncate w-full" title={folder.name}>
                                        {folder.name}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Render Files */}
                        {sortedFiles.map((file) => (
                            <div key={file.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full min-h-[220px]">
                                <div className="h-32 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                    {isImage(file.name) ? (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300">
                                            <File className="w-10 h-10 mb-2" />
                                            <span className="text-xs font-mono font-medium">{file.name.split('.').pop()?.toUpperCase()}</span>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                                            title="Buka / Unduh"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleCopyUrl(file.url)}
                                            className="w-9 h-9 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                                            title="Salin URL"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(file.url)}
                                            className="w-9 h-9 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug" title={file.name}>
                                            {file.name}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                        <span className="text-xs text-gray-500 font-medium">{formatBytes(file.size)}</span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(file.lastModified).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
