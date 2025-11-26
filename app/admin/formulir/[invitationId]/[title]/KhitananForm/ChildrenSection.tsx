'use client';

import React, { useState, useCallback } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { Switch } from '@/components/ui/switch';
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

  const showInstagramAll = useWatch({
    control,
    name: 'showInstagramAll',
    defaultValue: false,
  });

  const [localPreviews, setLocalPreviews] = useState<string[]>([
    getValues('children.0.profile') || '',
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string|null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string|null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [currentChildIndex, setCurrentChildIndex] = useState<number|null>(null);

  const autoSave = useCallback(async () => {
    const data = getValues();
    const payload = {
      user_id: userId,
      id: invitationId,
      title: slug,
      content: JSON.stringify({ ...data, event: { ...data.event, title: slug } }),
      waktu_acara: data.event.khitanan?.date,
      time: data.event.khitanan?.time,
      location: data.event.khitanan?.location,
      mapsLink: data.event.khitanan?.mapsLink,
    };
    await saveGalleryContent(payload);
    const frm = document.getElementById('previewFrame') as HTMLIFrameElement|null;
    if (frm) frm.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
  }, [getValues, invitationId, onSavedSlug, slug, userId]);

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
    <Collapsible title="Data Anak">
      {/* NAMA & NICKNAME */}
      <div className="grid grid-cols-1 gap-4 mt-6 mb-6">
        <div className="border p-4 rounded">
          <Label htmlFor="anak-name">Nama Anak</Label>
          <Controller
            name="children.0.name"
            control={control}
            render={({ field }) => <Input {...field} id="anak-name" />}
          />
          <Label htmlFor="anak-nick" className="mt-4">Nickname Anak</Label>
          <Controller
            name="children.0.nickname"
            control={control}
            render={({ field }) => <Input {...field} id="anak-nick" />}
          />

          {/* FOTO */}
          <Label className="mt-6">Foto Anak</Label>
          <div className="mt-1 flex items-center space-x-4">
            {localPreviews[0] ? (
              <div className="relative w-24 h-24">
                <img
                  src={localPreviews[0]}
                  alt="Foto Anak"
                  className="object-cover w-full h-full rounded-full"
                />
                <button
                  type="button"
                  onClick={() => openDelete(0)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/4 -translate-y-1/4"
                >×</button>
              </div>
            ) : (
              <label className="cursor-pointer bg-white py-2 px-3 border rounded-md shadow-sm text-sm font-medium">
                {uploading ? 'Mengunggah...' : 'Unggah Foto'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => handleImageChange(e, 0)}
                  disabled={uploading}
                />
              </label>
            )}
            {uploadError && <p className="text-red-600">{uploadError}</p>}
          </div>
        </div>
      </div>


      {/* DIALOG HAPUS */}
      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Foto</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDelete}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
}