'use client';

import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Collapsible } from './Collapsible';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

const UPLOAD_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze.php';
const DELETE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_hapus.php';
const SAVE_URL  = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

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

  // pakai useWatch utk rerender otomatis
  const showInstagramAll = useWatch({
    control,
    name: 'showInstagramAll',
    defaultValue: false,
  });

  const [localPreviews, setLocalPreviews] = useState<string[]>([
    getValues('children.0.profile') || '',
    getValues('children.1.profile') || '',
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string|null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string|null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [currentChildIndex, setCurrentChildIndex] = useState<number|null>(null);

  const autoSave = async () => {
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
    try {
      const res = await fetch(SAVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.status !== 'success') console.error('Auto-save gagal:', json.message);
      const frm = document.getElementById('previewFrame') as HTMLIFrameElement;
      if (frm) frm.src = `/undang/${userId}/${encodeURIComponent(onSavedSlug)}`;
    } catch (err) {
      console.error('Error auto-save:', err);
    }
  };

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const files = e.target.files; if (!files?.length) return;
    setUploading(true); setUploadError(null);
    const fd = new FormData(); fd.append('image', files[0]);
    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal mengunggah.');
      const children: ChildForm[] = getValues('children');
      children[idx].profile = data.url;
      setValue('children', children);
      await autoSave();
      const reader = new FileReader();
      reader.onloadend = () => setLocalPreviews(p => {
        const u = [...p]; u[idx] = reader.result as string; return u;
      });
      reader.readAsDataURL(files[0]);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false); e.target.value = '';
    }
  }, [getValues, setValue]);

  const openDelete = (i: number) => { setCurrentChildIndex(i); setDeleteConfirmationOpen(true); };
  const closeDelete = () => { setCurrentChildIndex(null); setDeleteConfirmationOpen(false); };
  const confirmDelete = useCallback(async () => {
    if (currentChildIndex === null) return;
    setDeleting(true); setDeleteError(null); setDeleteConfirmationOpen(false);
    const children: ChildForm[] = getValues('children');
    const url = children[currentChildIndex].profile;
    if (!url) { setDeleting(false); setCurrentChildIndex(null); return; }
    try {
      const res = await fetch(DELETE_URL, {
        method: 'POST',
        headers: { 'Content-Type':'application/x-www-form-urlencoded' },
        body: `imageUrl=${encodeURIComponent(url)}`,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      children[currentChildIndex].profile = '';
      setValue('children', children);
      await autoSave();
      setLocalPreviews(p => {
        const u = [...p]; u[currentChildIndex] = ''; return u;
      });
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus.');
    } finally {
      setDeleting(false); setCurrentChildIndex(null);
    }
  }, [currentChildIndex, getValues, setValue]);

  return (
    <Collapsible title="Pengantin">
      {/* FORM NAMA & NICKNAME */}
      <div className="grid grid-cols-1 gap-4 mt-6 mb-6">
        {['Pria','Wanita'].map((who, i) => (
          <div key={i} className="border p-4 rounded">
            <Label htmlFor={`${who}-name`} className="block text-sm font-medium text-gray-700">
              Nama {who}
            </Label>
            <Controller
              name={`children.${i}.name`}
              control={control}
              defaultValue={getValues(`children.${i}.name`)}
              render={({ field }) => (
                <Input {...field} id={`${who}-name`} placeholder={`Nama ${who}`} />
              )}
            />
            <Label htmlFor={`${who}-nick`} className="block mt-4 text-sm font-medium text-gray-700">
              Nickname {who}
            </Label>
            <Controller
              name={`children.${i}.nickname`}
              control={control}
              defaultValue={getValues(`children.${i}.nickname`)}
              render={({ field }) => (
                <Input {...field} id={`${who}-nick`} placeholder={`Nickname ${who}`} />
              )}
            />

            {/* ———————————————————————————————— */}
            {/* Jarak sebelum Foto */}
            <Label htmlFor={`${who}-image`} className="block mt-6 text-sm font-medium text-gray-700">
              Foto {who}
            </Label>
            <div className="mt-1 flex items-center space-x-4">
              {localPreviews[i] ? (
                <div className="relative w-24 h-24">
                  <img
                    src={localPreviews[i]}
                    alt={`Foto ${who}`}
                    className="object-cover w-full h-full rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => openDelete(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transform translate-x-1/4 -translate-y-1/4"
                  >×</button>
                </div>
              ) : (
                <label
                  htmlFor={`${who}-image`}
                  className="cursor-pointer bg-white py-2 px-3 border rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                >
                  {uploading ? 'Mengunggah...' : 'Unggah Foto'}
                  <input
                    id={`${who}-image`}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={e => handleImageChange(e, i)}
                    disabled={uploading}
                  />
                </label>
              )}
              {uploadError && <p className="text-red-600">{uploadError}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ———————————————————————————————— */}
      {/* Jarak sebelum Toggle Instagram */}
      <div className="mt-6 mb-4 flex items-center space-x-2">
        <Controller
          name="showInstagramAll"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={val => field.onChange(val)}
              id="instagram-all-switch"
            />
          )}
        />
        <Label htmlFor="instagram-all-switch" className="text-sm font-medium text-gray-700">
          Tampilkan Instagram Pengantin
        </Label>
      </div>

      {showInstagramAll && (
        <div className="grid grid-cols-1 gap-4 mt-6 mb-6">
          {['Pria','Wanita'].map((who, i) => (
            <div key={i}>
              <Label htmlFor={`instagram-${who.toLowerCase()}`} className="block text-sm font-medium text-gray-700">
                Username Instagram {who}
              </Label>
              <Input
                id={`instagram-${who.toLowerCase()}`}
                {...register(`children.${i}.instagramUsername`, {
                  required: `Username Instagram ${who} wajib diisi`,
                })}
                placeholder="Username Instagram"
              />
              {errors.children?.[i]?.instagramUsername && (
                <p className="text-red-600 text-sm">
                  {errors.children[i].instagramUsername.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog hapus foto */}
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
