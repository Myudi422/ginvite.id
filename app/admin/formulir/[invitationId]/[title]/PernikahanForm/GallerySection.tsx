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
        const url = await uploadImageToBackblaze(formData);

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
    <Collapsible title="Gallery">
      <div className="pt-4 mb-4 flex items-center space-x-2">
        <Controller
          name="gallery_enabled"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(v) => field.onChange(v)}
            />
          )}
        />
        <span className="text-sm font-medium">
          {enabled ? 'Gallery Aktif' : 'Gallery Nonaktif'}
        </span>
      </div>

      <div className={`mb-4 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>  
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
          Unggah Gambar (Maksimum 6)
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
          disabled={!enabled || uploading}
        />
        {uploading && <p className="text-yellow-500">Mengunggah gambar...</p>}
        {uploadError && <p className="text-red-600">{uploadError}</p>}
        {deleting && <p className="text-yellow-500">Menghapus gambar...</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
      </div>

      <div className={`grid grid-cols-3 gap-4 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>  
        {[...previewImages, ...localPreviews].map((url, idx) => (
          <div key={idx} className="relative">
            <img
              src={url}
              alt={`Gambar ${idx + 1}`}
              className="w-full h-auto rounded-md object-cover aspect-square"
              style={{ maxHeight: '150px' }}
            />
            <button
              type="button"
              onClick={() => {
                if (idx < previewImages.length) handleOpenDeleteConfirmation(idx);
                else {
                  setLocalPreviews(prev => {
                    const newArr = [...prev];
                    newArr.splice(idx - previewImages.length, 1);
                    return newArr;
                  });
                }
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        {fields.slice(previewImages.length + localPreviews.length).map((item, i) => (
          <Controller
            key={item.id}
            control={control}
            name={`gallery.items.${previewImages.length + localPreviews.length + i}`}
            render={({ field }) => (
              <Input {...field} placeholder={`URL Gambar ${previewImages.length + localPreviews.length + i + 1}`} />
            )}
          />
        ))}
      </div>

      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmation}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
}
