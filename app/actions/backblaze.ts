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

// Endpoints diambil dari variabel lingkungan
const UPLOAD_URL = process.env.UPLOAD_URL;
const DELETE_URL = process.env.DELETE_URL;
const SAVE_URL = process.env.SAVE_CONTENT_URL; // Menggunakan kembali SAVE_CONTENT_URL yang sudah ada

export async function uploadImageToBackblaze(
  formData: FormData,
  user_id: number,
  id: number
): Promise<string> {
  // Pastikan UPLOAD_URL telah diatur
  if (!UPLOAD_URL) {
    console.error('UPLOAD_URL is not defined in environment variables.');
    throw new Error('Server configuration error: UPLOAD_URL is missing.');
  }

  // append user and id ke FormData
  formData.append('user_id', String(user_id));
  formData.append('id', String(id));

  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
    },
    body: formData,
  });
  const text = await res.text();
  try {
    const json: UploadResult = JSON.parse(text);
    if (!json.success || !json.url) {
      throw new Error(json.message || 'Gagal mengunggah gambar');
    }
    return json.url;
  } catch (err) {
    console.error("Backblaze upload returned non-JSON:", text.substring(0, 500));
    throw new Error('Server merespons dengan format tidak valid (HTML/Error).');
  }
  return json.url;
}

export async function deleteImageFromBackblaze(imageUrl: string): Promise<void> {
  // Pastikan DELETE_URL telah diatur
  if (!DELETE_URL) {
    console.error('DELETE_URL is not defined in environment variables.');
    throw new Error('Server configuration error: DELETE_URL is missing.');
  }

  const body = new URLSearchParams({ imageUrl });
  const res = await fetch(DELETE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
    },
    body: body.toString(),
  });
  const text = await res.text();
  try {
    const json: DeleteResult = JSON.parse(text);
    if (!json.success) {
      throw new Error(json.message || 'Gagal menghapus gambar');
    }
  } catch (err) {
    console.error("Backblaze delete returned non-JSON:", text.substring(0, 500));
    throw new Error('Server merespons dengan format tidak valid (HTML/Error).');
  }
}

export async function saveGalleryContent(payload: SavePayload) {
  // Pastikan SAVE_URL telah diatur
  if (!SAVE_URL) {
    console.error('SAVE_CONTENT_URL is not defined in environment variables.');
    throw new Error('Server configuration error: SAVE_CONTENT_URL is missing.');
  }

  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Auto-save gagal');
  }
  revalidatePath(`/undang/${payload.user_id}/${encodeURIComponent(payload.title)}`);
  return json;
}
