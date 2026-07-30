'use server';

import { revalidatePath } from 'next/cache';
import B2 from 'backblaze-b2';

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

const B2_APP_KEY_ID = process.env.B2_APPLICATION_KEY_ID || '0057ba6d7a5725c0000000002';
const B2_APP_KEY = process.env.B2_APPLICATION_KEY || 'K005XvUqydtIZQvuNBYCM/UDhXfrWLQ';
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || 'ccgnimex';
const B2_BUCKET_ID_ENV = process.env.B2_BUCKET_ID || '775beaa6dd772a459742051c';
const B2_CUSTOM_DOMAIN = process.env.B2_CUSTOM_DOMAIN || 'https://file.legalpilar.id/file/ccgnimex';
const SAVE_URL = process.env.SAVE_CONTENT_URL;

let cachedBucketId: string | null = B2_BUCKET_ID_ENV || null;

async function getB2Client() {
  const b2 = new B2({
    applicationKeyId: B2_APP_KEY_ID,
    applicationKey: B2_APP_KEY,
  });
  await b2.authorize();
  return b2;
}

export async function uploadImageToBackblaze(
  formData: FormData,
  user_id: number,
  id: number
): Promise<string> {
  const file = (formData.get('image') as File) || (formData.get('file') as File);
  if (!file) {
    throw new Error('File gambar tidak ditemukan');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const orig = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitized = orig.replace(/[^A-Za-z0-9_\-]/g, '');
    const timestamp = Date.now();
    const fileName = `papunda/gallery/${user_id}/${sanitized}_${id}_${timestamp}.${ext}`;

    const b2 = await getB2Client();

    if (!cachedBucketId) {
      const bucketsRes = await b2.getBucket({ bucketName: B2_BUCKET_NAME });
      if (bucketsRes.data && bucketsRes.data.buckets && bucketsRes.data.buckets.length > 0) {
        cachedBucketId = bucketsRes.data.buckets[0].bucketId;
      } else {
        throw new Error('Bucket Backblaze tidak ditemukan');
      }
    }

    const uploadUrlRes = await b2.getUploadUrl({ bucketId: cachedBucketId! });
    const uploadUrl = uploadUrlRes.data.uploadUrl;
    const uploadAuthToken = uploadUrlRes.data.authorizationToken;

    const mimeType = file.type || 'image/jpeg';

    const uploadRes = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken,
      fileName,
      data: buffer,
      mime: mimeType,
    });

    if (!uploadRes.data || !uploadRes.data.fileName) {
      throw new Error('Gagal mengunggah gambar ke Backblaze');
    }

    const fileUrl = `${B2_CUSTOM_DOMAIN}/${uploadRes.data.fileName}`;
    return fileUrl;
  } catch (err: any) {
    console.error('Direct Backblaze upload failed, attempting fallback endpoint:', err);

    // Fallback: If direct B2 fails for any reason, try HTTP endpoint if defined
    const UPLOAD_URL = process.env.UPLOAD_URL;
    if (UPLOAD_URL) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg';
        const image_base64 = `data:${mimeType};base64,${base64}`;

        const payload = {
          user_id: user_id,
          id: id,
          filename: file.name,
          image_base64: image_base64,
        };

        const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
            'Accept': '*/*',
          },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        const json: UploadResult = JSON.parse(text);
        if (json.success && json.url) {
          return json.url;
        }
      } catch (fallbackErr) {
        console.error('Fallback UPLOAD_URL also failed:', fallbackErr);
      }
    }

    throw new Error(err.message || 'Gagal mengunggah gambar.');
  }
}

export async function deleteImageFromBackblaze(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    const b2 = await getB2Client();

    if (!cachedBucketId) {
      const bucketsRes = await b2.getBucket({ bucketName: B2_BUCKET_NAME });
      if (bucketsRes.data && bucketsRes.data.buckets && bucketsRes.data.buckets.length > 0) {
        cachedBucketId = bucketsRes.data.buckets[0].bucketId;
      }
    }

    let fileKey = imageUrl;
    if (fileKey.includes('/file/ccgnimex/')) {
      fileKey = fileKey.split('/file/ccgnimex/')[1];
    } else if (fileKey.includes('backblazeb2.com/file/ccgnimex/')) {
      fileKey = fileKey.split('backblazeb2.com/file/ccgnimex/')[1];
    } else {
      const match = fileKey.match(/(papunda\/.*|admin_uploads\/.*|background\/.*)$/);
      if (match) {
        fileKey = match[1];
      }
    }

    if (cachedBucketId && fileKey) {
      const list = await b2.listFileNames({
        bucketId: cachedBucketId,
        prefix: fileKey,
        maxFileCount: 1,
      });

      if (list.data && list.data.files && list.data.files.length > 0) {
        const fileId = list.data.files[0].fileId;
        await b2.deleteFileVersion({ fileId, fileName: fileKey });
        return;
      }
    }
  } catch (err: any) {
    console.error('Direct Backblaze delete failed:', err);
  }

  // Fallback to DELETE_URL if configured
  const DELETE_URL = process.env.DELETE_URL;
  if (DELETE_URL) {
    try {
      const body = new URLSearchParams({ imageUrl });
      await fetch(DELETE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
    } catch (e) {
      console.error('Fallback DELETE_URL failed:', e);
    }
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

