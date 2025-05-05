'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { Button } from '@/components/ui/button';
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

// Endpoints
const UPLOAD_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze.php';
const DELETE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_hapus.php';
const SAVE_URL   = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

interface GallerySectionProps {
  userId: number;
  invitationId: number;
  slug: string;
  onSavedSlug: string;
}

export function GallerySection({ userId, invitationId, slug, onSavedSlug }: GallerySectionProps) {
  const { control, setValue, getValues } = useFormContext();
  const { fields } = useFieldArray({ control, name: 'gallery.items' });

  const [previewImages, setPreviewImages] = useState<string[]>(getValues('gallery.items') || []);
  const [localPreviews, setLocalPreviews]   = useState<string[]>([]);
  const [uploading, setUploading]           = useState(false);
  const [uploadError, setUploadError]       = useState<string | null>(null);
  const [deleting, setDeleting]             = useState(false);
  const [deleteError, setDeleteError]       = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex]         = useState<number | null>(null);

  // Auto-save seluruh form setiap update gallery
  const autoSave = async (updatedGallery: string[]) => {
    const data = getValues();
    const contentPayload = {
      ...data,
      gallery: { items: updatedGallery },
      event: { ...data.event, title: slug },
    };
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

    try {
      const res = await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') {
        console.error('Auto-save gagal:', json.message);
      }
      // Refresh preview iframe
      const iframe = document.getElementById('previewFrame') as HTMLIFrameElement;
      if (iframe) iframe.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
    } catch (err) {
      console.error('Error auto-save:', err);
    }
  };

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (previewImages.length + files.length + localPreviews.length > 6) {
      return alert('Maksimum 6 gambar diperbolehkan.');
    }

    setUploading(true);
    setUploadError(null);

    const newLocal: string[] = [];
    const uploadTasks: Promise<void>[] = [];

    for (let file of Array.from(files)) {
      // Local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newLocal.push(reader.result as string);
        if (newLocal.length === files.length) {
          setLocalPreviews(prev => [...prev, ...newLocal]);
        }
      };
      reader.readAsDataURL(file);

      // Upload
      const formData = new FormData();
      formData.append('image', file);
      const task = fetch(UPLOAD_URL, { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            throw new Error(data.message || 'Gagal mengunggah gambar.');
          }
          const updated = [...getValues('gallery.items'), data.url].slice(0, 6);
          setValue('gallery.items', updated);
          setPreviewImages(updated);
          autoSave(updated);
        })
        .catch(err => { throw err; });

      uploadTasks.push(task);
    }

    try {
      await Promise.all(uploadTasks);
    } catch (err: any) {
      setUploadError(err.message);
    }

    setUploading(false);
    setLocalPreviews([]);
    event.target.value = '';
  }, [previewImages, localPreviews, setValue, getValues, slug, onSavedSlug]);

  const handleOpenDeleteConfirmation = (index: number) => {
    setImageToDeleteIndex(index);
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
      const res = await fetch(DELETE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `imageUrl=${encodeURIComponent(urlToDelete)}`,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const updated = previewImages.filter((_, i) => i !== imageToDeleteIndex);
      setValue('gallery.items', updated);
      setPreviewImages(updated);
      autoSave(updated);
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus gambar.');
    } finally {
      setDeleting(false);
      setImageToDeleteIndex(null);
    }
  }, [imageToDeleteIndex, previewImages, setValue, slug, onSavedSlug]);

  return (
    <Collapsible title="Gallery">
      <div className="mb-4">
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
          Unggah Gambar (Maksimum 6)
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {uploading && <p className="text-yellow-500">Mengunggah gambar...</p>}
        {uploadError && <p className="text-red-600">{uploadError}</p>}
        {deleting && <p className="text-yellow-500">Menghapus gambar...</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[...previewImages, ...localPreviews].map((url, idx) => (
          <div key={`preview-${idx}`} className="relative">
            <img
              src={url}
              alt={`Gambar ${idx + 1}`}
              className="w-full h-auto rounded-md object-cover aspect-square"
              style={{ maxHeight: '150px' }}
            />
            <button
              type="button"
              onClick={() => {
                if (idx < previewImages.length) {
                  handleOpenDeleteConfirmation(idx);
                } else {
                  // hanya remove local
                  const lp = [...localPreviews]; lp.splice(idx - previewImages.length, 1);
                  setLocalPreviews(lp);
                }
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs focus:outline-none"
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
            render={({ field }) => <Input {...field} placeholder={`URL Gambar ${previewImages.length + localPreviews.length + i + 1}`} />}
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
