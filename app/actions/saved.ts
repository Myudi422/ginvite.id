// app/actions/saved.ts
'use server';

import { revalidatePath } from 'next/cache';

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

const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

export async function autoSaveContent(payload: SavePayload) {
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Auto-save gagal');
  }
  // revalidate preview
  revalidatePath(`/undang/${payload.user_id}/${encodeURIComponent(payload.title)}`);
  return json;
}
