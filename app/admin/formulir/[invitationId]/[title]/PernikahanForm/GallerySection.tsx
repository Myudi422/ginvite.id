'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
import { uploadImageToBackblaze, deleteImageFromBackblaze, saveGalleryContent } from '@/app/actions/backblaze';

interface GallerySectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function GallerySection({ userId, invitationId, slug, onSavedSlug }: GallerySectionProps) {
  const { control, setValue, getValues, watch } = useFormContext();
  const enabled = watch('gallery_enabled', false);
  const { fields } = useFieldArray({ control, name: 'gallery.items' });

  const [previewImages, setPreviewImages] = useState<string[]>(getValues('gallery.items') || []);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(null);

  const autoSave = useCallback(async (updatedGallery: string[]) => {
    const data = getValues();
    const contentPayload = { ...data, gallery: { items: updatedGallery }, event: { ...data.event, title: slug } };
    const payload = {
      user_id: userId,
      id: invitationId,
      title: slug,
      content: JSON.stringify(contentPayload),
      waktu_acara: data.event.date,
      time: data.event.time,
      location: data.event.location,
      mapsLink: data.event.mapsLink,
    };
    await saveGalleryContent(payload);
    const iframe = document.getElementById('previewFrame') as HTMLIFrameElement | null;
    if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
  }, [getValues, invitationId, onSavedSlug, slug, userId]);

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!enabled) return;
    const files = event.target.files;
    if (!files?.length) return;
    if (previewImages.length + files.length > 6) {
      return alert('Maksimum 6 gambar diperbolehkan.');
    }

    setUploading(true);
    setUploadError(null);
    setLocalPreviews([]);

    try {
      for (let file of Array.from(files)) {
        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);

        // Upload via Server Action
        const formData = new FormData();
        formData.append('image', file);
        const url = await uploadImageToBackblaze(formData, userId, invitationId);

        // Update gallery items
        const updated = [...getValues('gallery.items'), url].slice(0, 6);
        setValue('gallery.items', updated);
        setPreviewImages(updated);
        await autoSave(updated);
      }
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      setLocalPreviews([]);
      event.target.value = '';
    }
  }, [autoSave, enabled, getValues, previewImages.length, setValue]);

  const handleOpenDeleteConfirmation = (idx: number) => {
    if (!enabled) return;
    setImageToDeleteIndex(idx);
    setDeleteConfirmationOpen(true);
  };
  const handleCloseDeleteConfirmation = () => {
    setImageToDeleteIndex(null);
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (imageToDeleteIndex === null) return;
    setDeleting(true);
    setDeleteError(null);
    setDeleteConfirmationOpen(false);
    try {
      const urlToDelete = previewImages[imageToDeleteIndex];
      await deleteImageFromBackblaze(urlToDelete);
      const updated = previewImages.filter((_, i) => i !== imageToDeleteIndex);
      setValue('gallery.items', updated);
      setPreviewImages(updated);
      await autoSave(updated);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
      setImageToDeleteIndex(null);
    }
  }, [autoSave, imageToDeleteIndex, previewImages, setValue]);

  return (
    <Collapsible title="Galeri Foto" defaultOpen={false}>
      {/* Toggle Header */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-xl mt-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Aktifkan Galeri Foto</h4>
          <p className="text-xs text-gray-400 mt-0.5">Tampilkan foto-foto prewedding atau momen berharga</p>
        </div>
        <Controller
          name="gallery_enabled"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-pink-500"
            />
          )}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 mt-4 ${!enabled ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}>

        {/* Upload Area */}
        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={!enabled || uploading}
          />
          <div className="space-y-2">
            <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Klik atau seret gambar ke sini</p>
            <p className="text-xs text-gray-400">Maksimal 6 foto (JPG, PNG)</p>
          </div>

          {/* Status Messages */}
          {(uploading || deleting || uploadError || deleteError) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-2">
              {uploading && <p className="text-xs font-medium text-blue-500 flex items-center gap-1"><span className="animate-spin text-lg leading-none">⏳</span> Mengunggah foto...</p>}
              {deleting && <p className="text-xs font-medium text-amber-500 flex items-center gap-1"><span className="animate-spin text-lg leading-none">⏳</span> Menghapus foto...</p>}
              {uploadError && <p className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-md">⚠️ {uploadError}</p>}
              {deleteError && <p className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-md">⚠️ {deleteError}</p>}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {([...previewImages, ...localPreviews].length > 0) && (
          <div className="mt-6">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Foto Tersimpan</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...previewImages, ...localPreviews].map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (idx < previewImages.length) handleOpenDeleteConfirmation(idx);
                        else {
                          setLocalPreviews(prev => {
                            const newArr = [...prev];
                            newArr.splice(idx - previewImages.length, 1);
                            return newArr;
                          });
                        }
                      }}
                      className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transform hover:scale-110 shadow-sm"
                      title="Hapus foto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL Inputs (Fallback) */}
        <div className="mt-6 space-y-3">
          <p className="text-xs text-gray-400 italic">Atau masukkan URL gambar secara manual:</p>
          {fields.slice(previewImages.length + localPreviews.length).map((item, i) => (
            <Controller
              key={item.id}
              control={control}
              name={`gallery.items.${previewImages.length + localPreviews.length + i}`}
              render={({ field }) => (
                <Input {...field} className="text-sm bg-gray-50 border-gray-200" placeholder={`URL Gambar ${previewImages.length + localPreviews.length + i + 1}`} />
              )}
            />
          ))}
        </div>

      </div>

      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto ini akan dihapus secara permanen dari galeri undangan Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmation} className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deleting} className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
              {deleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
}
