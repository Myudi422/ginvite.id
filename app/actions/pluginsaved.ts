// app/actions/pluginsaved.ts
'use server';

const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';

interface PluginSavePayload {
  user_id: number;
  id: number;
  title: string;
  content: string;
  waktu_acara?: string;
  time?: string;
  location?: string;
  mapsLink?: string;
}

/**
 * Action server untuk auto-save plugin section.
 * Mengirim data plugin beserta metadata event resepsi.
 */
export async function pluginSaveAction(payload: PluginSavePayload) {
  const res = await fetch(SAVE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Auto-save plugin gagal');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Gagal menyimpan plugin.');
  return json.data;
}
