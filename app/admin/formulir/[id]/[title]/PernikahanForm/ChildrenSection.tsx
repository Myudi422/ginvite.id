'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback } from 'react';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // Import Switch dari Shadcn UI
import { cn } from '@/lib/utils'; // Utility function untuk class names

// Endpoints (pastikan URL ini sesuai dengan endpoint upload gambar Anda)
const UPLOAD_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze.php';
const DELETE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_hapus.php';
const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user'; // Pastikan URL ini digunakan dengan benar

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
  showInstagram: boolean;
  instagramUsername: string;
  order: 'Pengantin Pria' | 'Pengantin Wanita';
}

export function ChildrenSection({ userId, invitationId, slug, onSavedSlug }: ChildrenSectionProps) {
  const { control, setValue, getValues } = useFormContext();
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

  // Auto-save seluruh form setiap update data pengantin
  const autoSave = async (updatedChildren: ChildForm[]) => {
    const data = getValues();
    const contentPayload = {
      ...data,
      children: updatedChildren.map(
        ({ name, nickname, profile, showInstagram, instagramUsername, order }) => ({
          name,
          nickname,
          profile,
          showInstagram,
          instagramUsername,
          order,
        })
      ),
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

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Gagal mengunggah gambar.');
      }

      const updatedChildren = getValues('children').map((child, i) =>
        i === index ? { ...child, profile: data.url } : child
      ) as ChildForm[];
      setValue('children', updatedChildren);
      autoSave(updatedChildren);

      // Update local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPreviews(prev => {
          const updatedPreviews = [...prev];
          updatedPreviews[index] = reader.result as string;
          return updatedPreviews;
        });
      };
      reader.readAsDataURL(file);

    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input file
    }
  }, [setValue, getValues, slug, onSavedSlug, autoSave]);

  const handleOpenDeleteConfirmation = (childIndex: number) => {
    setCurrentChildIndex(childIndex);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setCurrentChildIndex(null);
    setDeleteConfirmationOpen(false);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (currentChildIndex === null) return;

    setDeleting(true);
    setDeleteError(null);
    setDeleteConfirmationOpen(false);

    const childrenData = getValues('children') as ChildForm[];
    const urlToDelete = childrenData[currentChildIndex]?.profile;

    if (urlToDelete) {
      try {
        const res = await fetch(DELETE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `imageUrl=${encodeURIComponent(urlToDelete)}`,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const updatedChildren = childrenData.map((child, i) =>
          i === currentChildIndex ? { ...child, profile: '' } : child
        );
        setValue('children', updatedChildren);
        autoSave(updatedChildren);
        setLocalPreviews(prev => {
          const updatedPreviews = [...prev];
          updatedPreviews[currentChildIndex] = '';
          return updatedPreviews;
        });
      } catch (err: any) {
        setDeleteError(err.message || 'Gagal menghapus gambar.');
      } finally {
        setDeleting(false);
        setCurrentChildIndex(null);
      }
    } else {
      setDeleting(false);
      setCurrentChildIndex(null);
    }
  }, [currentChildIndex, getValues, setValue, slug, onSavedSlug, autoSave]);

  return (
    <Collapsible title="Pengantin">
      <div className="grid grid-cols-1 gap-4 mb-6 mt-6"> {/* Ubah grid-cols menjadi 1 */}
        {/* Form untuk Pengantin Pria (index 0) */}
        <div className="border p-4 rounded">
          <Label htmlFor="groom-name" className="block text-sm font-medium text-gray-700">Nama Pria</Label>
          <Controller
            name="children.0.name"
            control={control}
            defaultValue={getValues('children.0.name')}
            render={({ field }) => <Input {...field} id="groom-name" placeholder="Nama Pria" />}
          />
          <Label htmlFor="groom-nickname" className="block mt-4 text-sm font-medium text-gray-700">Nickname Pria</Label>
          <Controller
            name="children.0.nickname"
            control={control}
            defaultValue={getValues('children.0.nickname')}
            render={({ field }) => <Input {...field} id="groom-nickname" placeholder="Nickname Pria" />}
          />
          <Label htmlFor="groom-image" className="block mt-4 text-sm font-medium text-gray-700">Foto Pria</Label>
          <div className="mt-1 flex items-center space-x-4">
            {localPreviews[0] ? (
              <div className="relative w-24 h-24">
                <img src={localPreviews[0]} alt="Foto Pria" className="object-cover w-full h-full rounded-full" />
                <button
                  type="button"
                  onClick={() => handleOpenDeleteConfirmation(0)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs focus:outline-none transform translate-x-1/4 -translate-y-1/4"
                >
                  ×
                </button>
              </div>
            ) : (
              <label htmlFor="groom-image" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {uploading ? 'Mengunggah...' : 'Unggah Foto'}
                <input
                  id="groom-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleImageChange(e, 0)}
                  disabled={uploading}
                />
              </label>
            )}
            {uploadError && <p className="text-red-600">{uploadError}</p>}
          </div>
          {/* Toggle Instagram Pria */}
          <div className="mt-4 flex items-center space-x-2">
            <Controller
              name="children.0.showInstagram"
              control={control}
              defaultValue={getValues('children.0.showInstagram') ?? false}
              render={({ field }) => (
                <Switch id="groom-instagram-switch" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="groom-instagram-switch" className="text-sm font-medium text-gray-700">Tampilkan Instagram</Label>
          </div>
          {getValues('children.0.showInstagram') && (
            <div className="mt-2">
              <Label htmlFor="groom-instagram-username" className="block text-sm font-medium text-gray-700">Username Instagram Pria</Label>
              <Controller
                name="children.0.instagramUsername"
                control={control}
                defaultValue={getValues('children.0.instagramUsername')}
                render={({ field }) => <Input {...field} id="groom-instagram-username" placeholder="Username Instagram" />}
              />
            </div>
          )}
        </div>

        {/* Form untuk Pengantin Wanita (index 1) */}
        <div className="border p-4 rounded">
          <Label htmlFor="bride-name" className="block text-sm font-medium text-gray-700">Nama Wanita</Label>
          <Controller
            name="children.1.name"
            control={control}
            defaultValue={getValues('children.1.name')}
            render={({ field }) => <Input {...field} id="bride-name" placeholder="Nama Wanita" />}
          />
          <Label htmlFor="bride-nickname" className="block mt-4 text-sm font-medium text-gray-700">Nickname Wanita</Label>
          <Controller
            name="children.1.nickname"
            control={control}
            defaultValue={getValues('children.1.nickname')}
            render={({ field }) => <Input {...field} id="bride-nickname" placeholder="Nickname Wanita" />}
          />
          <Label htmlFor="bride-image" className="block mt-4 text-sm font-medium text-gray-700">Foto Wanita</Label>
          <div className="mt-1 flex items-center space-x-4">
            {localPreviews[1] ? (
              <div className="relative w-24 h-24">
                <img src={localPreviews[1]} alt="Foto Wanita" className="object-cover w-full h-full rounded-full" />
                <button
                  type="button"
                  onClick={() => handleOpenDeleteConfirmation(1)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs focus:outline-none transform translate-x-1/4 -translate-y-1/4"
                >
                  ×
                </button>
              </div>
            ) : (
              <label htmlFor="bride-image" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {uploading ? 'Mengunggah...' : 'Unggah Foto'}
                <input
                  id="bride-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleImageChange(e, 1)}
                  disabled={uploading}
                />
              </label>
            )}
            {uploadError && <p className="text-red-600">{uploadError}</p>}
          </div>
          {/* Toggle Instagram Wanita */}
          <div className="mt-4 flex items-center space-x-2">
            <Controller
              name="children.1.showInstagram"
              control={control}
              defaultValue={getValues('children.1.showInstagram') ?? false}
              render={({ field }) => (
                <Switch id="bride-instagram-switch" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="bride-instagram-switch" className="text-sm font-medium text-gray-700">Tampilkan Instagram</Label>
          </div>
          {getValues('children.1.showInstagram') && (
            <div className="mt-2">
              <Label htmlFor="bride-instagram-username" className="block text-sm font-medium text-gray-700">Username Instagram Wanita</Label>
              <Controller
                name="children.1.instagramUsername"
                control={control}
                defaultValue={getValues('children.1.instagramUsername')}
                render={({ field }) => <Input {...field} id="bride-instagram-username" placeholder="Username Instagram" />}
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Foto</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.
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