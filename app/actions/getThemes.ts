'use server';

import { revalidatePath } from 'next/cache';

const SAVE_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=save_content_user';
const THEME_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme';

interface Theme {
  id: number;
  name: string;
  image_theme: string;
  kategory_theme_id: number;
  kategory_theme_nama: string;
}

export async function getThemesFromServer(): Promise<{ status: string; data?: Theme[]; message?: string }> {
  try {
    const res = await fetch(THEME_URL);
    if (!res.ok) {
      const errorData = await res.json();
      return { status: 'error', message: errorData?.message || `HTTP error! status: ${res.status}` };
    }
    return await res.json();
  } catch (error: any) {
    return { status: 'error', message: error.message || 'Terjadi kesalahan saat mengambil data tema.' };
  }
}

export async function saveContentToServer(
  userId: number,
  invitationId: number,
  slug: string,
  data: any,
  onSavedSlug: string
) {
  const { gift, whatsapp_notif } = data.plugin;
  const jumlah = gift || whatsapp_notif ? 100000 : 40000;

  const payload = {
    user_id: userId,
    id: invitationId,
    title: slug,
    theme_id: data.theme,
    kategory_theme_id: data.themeCategory,
    content: JSON.stringify({ ...data, event: data.event, jumlah }),
  };

  try {
    const res = await fetch(SAVE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.status !== 'success') {
      throw new Error(json.message || 'Gagal menyimpan theme');
    }
    revalidatePath(`/undang/${userId}/${encodeURIComponent(onSavedSlug)}`);
    return { success: true };
  } catch (error: any) {
    console.error('Gagal menyimpan:', error);
    return { error: error.message || 'Gagal menyimpan perubahan.' };
  }
}