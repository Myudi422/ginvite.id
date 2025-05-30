'use server';

// Mengambil SAVE_CONTENT_URL dari variabel lingkungan
const SAVE_URL = process.env.SAVE_CONTENT_URL;

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

  if (!res.ok) throw new Error('Auto-save plugin gagal');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Gagal menyimpan plugin.');
  return json.data;
}
