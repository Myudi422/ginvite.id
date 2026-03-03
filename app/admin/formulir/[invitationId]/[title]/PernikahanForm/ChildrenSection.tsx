'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Server Actions
import {
  uploadImageToBackblaze,
  deleteImageFromBackblaze,
  saveGalleryContent, // reuse untuk auto-save
} from '@/app/actions/backblaze';

interface ChildrenSectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}
interface ChildForm {
  name: string;
  nickname: string;
  profile: string;
  instagramUsername: string;
  order: 'Pengantin Pria' | 'Pengantin Wanita';
}

export function ChildrenSection({
  userId, invitationId, slug, onSavedSlug,
}: ChildrenSectionProps) {
  const {
    control, register, setValue, getValues,
    formState: { errors },
  } = useFormContext();

  const [localPreviews, setLocalPreviews] = useState<string[]>([
    getValues('children.0.profile') || '',
    getValues('children.1.profile') || '',
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [currentChildIndex, setCurrentChildIndex] = useState<number | null>(null);

  const autoSave = useCallback(async () => {
    const data = getValues();
    const payload = {
      user_id: userId,
      id: invitationId,
      title: slug,
      content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
      waktu_acara: data.event.date,
      time: data.event.time,
      location: data.event.location,
      mapsLink: data.event.mapsLink,
    };
    await saveGalleryContent(payload);
    const frm = document.getElementById('previewFrame') as HTMLIFrameElement | null;
    if (frm) frm.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
  }, [getValues, invitationId, onSavedSlug, slug, userId]);

  // Debounced auto save for name changes - defined after autoSave
  const debouncedAutoSave = useCallback(() => {
    const timeoutId = setTimeout(async () => {
      try {
        await autoSave();
      } catch (error) {
        console.error('Auto save failed:', error);
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timeoutId);
  }, [autoSave]);

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setUploadError(null);

    try {
      // 1. Local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPreviews(prev => {
          const copy = [...prev];
          copy[idx] = reader.result as string;
          return copy;
        });
      };
      reader.readAsDataURL(files[0]);

      // 2. Upload ke Backblaze lewat helper
      const formData = new FormData();
      formData.append('image', files[0]);
      const url = await uploadImageToBackblaze(formData, userId, invitationId);

      // 3. Update form state & auto-save
      const children: ChildForm[] = getValues('children');
      children[idx].profile = url;
      setValue('children', children);
      await autoSave();
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [getValues, invitationId, setValue, autoSave, userId]);

  const openDelete = (i: number) => {
    setCurrentChildIndex(i);
    setDeleteConfirmationOpen(true);
  };
  const closeDelete = () => {
    setCurrentChildIndex(null);
    setDeleteConfirmationOpen(false);
  };
  const confirmDelete = useCallback(async () => {
    if (currentChildIndex === null) return;
    setDeleting(true);
    setDeleteError(null);
    setDeleteConfirmationOpen(false);

    try {
      const children: ChildForm[] = getValues('children');
      const url = children[currentChildIndex].profile;
      await deleteImageFromBackblaze(url);

      // clear & autosave
      children[currentChildIndex].profile = '';
      setValue('children', children);
      await autoSave();
      setLocalPreviews(prev => {
        const copy = [...prev];
        copy[currentChildIndex] = '';
        return copy;
      });
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
      setCurrentChildIndex(null);
    }
  }, [currentChildIndex, getValues, setValue, autoSave]);

  return (
    <Collapsible title="Data Pengantin" defaultOpen={true}>
      <div className="grid grid-cols-1 gap-5 mt-4 mb-2 max-w-2xl mx-auto">
        {['Pria', 'Wanita'].map((who, i) => (
          <div key={i} className={`relative p-5 rounded-2xl border ${who === 'Pria' ? 'bg-blue-50/50 border-blue-100' : 'bg-pink-50/50 border-pink-100'}`}>
            <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${who === 'Pria' ? 'text-blue-700' : 'text-pink-700'}`}>
              {who === 'Pria' ? '🤵' : '👰'} Mempelai {who}
            </h4>

            <div className="space-y-4">
              {/* NAMA LENGKAP */}
              <div className="space-y-1.5">
                <Label htmlFor={`${who}-name`} className="text-xs text-gray-600 font-medium whitespace-nowrap">Nama Lengkap</Label>
                <Controller
                  name={`children.${i}.name`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id={`${who}-name`}
                      className="bg-white border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
                      placeholder={`Contoh: Romeo ${who === 'Pria' ? 'Montague' : 'Capulet'}`}
                      onChange={(e) => {
                        field.onChange(e);
                        setTimeout(() => window.dispatchEvent(new CustomEvent('formDataChanged')), 500);
                        debouncedAutoSave();
                      }}
                    />
                  )}
                />
              </div>

              {/* NAMA PANGGILAN */}
              <div className="space-y-1.5">
                <Label htmlFor={`${who}-nick`} className="text-xs text-gray-600 font-medium whitespace-nowrap">Nama Panggilan</Label>
                <Controller
                  name={`children.${i}.nickname`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id={`${who}-nick`}
                      className="bg-white border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-gray-300"
                      placeholder={`Contoh: ${who === 'Pria' ? 'Romeo' : 'Juliet'}`}
                      onChange={(e) => {
                        field.onChange(e);
                        setTimeout(() => window.dispatchEvent(new CustomEvent('formDataChanged')), 500);
                        debouncedAutoSave();
                      }}
                    />
                  )}
                />
              </div>

              {/* FOTO */}
              <div className="pt-2">
                <Label className="text-xs text-gray-600 font-medium block mb-2">Foto Profil</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-200 bg-white overflow-hidden group">
                    {localPreviews[i] ? (
                      <>
                        <img
                          src={localPreviews[i]}
                          alt={`Foto ${who}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => openDelete(i)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transform hover:scale-110 shadow-sm transition-all"
                            title="Hapus Foto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        {uploading ? (
                          <span className="animate-spin text-xl">⏳</span>
                        ) : (
                          <>
                            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span className="text-[10px] text-gray-500 font-medium">Unggah</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageChange(e, i)}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 leading-tight">Gunakan foto potret dengan rasio 1:1 (kotak) agar terlihat rapi.</p>
                    {uploadError && <p className="text-[11px] font-medium text-red-500 mt-1 line-clamp-2">⚠️ {uploadError}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DIALOG HAPUS */}
      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto Profil?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto profil pengantin ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDelete} className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting} className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
}
