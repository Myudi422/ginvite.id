// app/actions/backblaze.ts
'use server';

import { revalidatePath } from 'next/cache';

interface UploadResult {
  success: boolean;
  url?: string;
  message?: string;
}

interface DeleteResult {
  success: boolean;
  message?: string;
}

interface SavePayload {
  user_id: number;
  id: number;
  title: string;
  content: string;
  waktu_acara: string;
  time: string;
  location: string;
  mapsLink: string;
}

// Endpoints
const UPLOAD_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze.php';
const DELETE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/page/backblaze_hapus.php';
const SAVE_URL   = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

export async function uploadImageToBackblaze(formData: FormData): Promise<string> {
  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });
  const json: UploadResult = await res.json();
  if (!json.success || !json.url) {
    throw new Error(json.message || 'Gagal mengunggah gambar');
  }
  return json.url;
}

export async function deleteImageFromBackblaze(imageUrl: string): Promise<void> {
  const body = new URLSearchParams({ imageUrl });
  const res = await fetch(DELETE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const json: DeleteResult = await res.json();
  if (!json.success) {
    throw new Error(json.message || 'Gagal menghapus gambar');
  }
}

export async function saveGalleryContent(payload: SavePayload) {
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Auto-save gagal');
  }
  // optionally revalidate preview path
  revalidatePath(`/undang/${payload.user_id}/${encodeURIComponent(payload.title)}`);
  return json;
}
