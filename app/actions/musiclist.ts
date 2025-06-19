'use server';

const MUSIC_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface Music {
  Nama_lagu: string;
  link_lagu: string;
  kategori: string;
}

export async function getMusicList(): Promise<Music[]> {
  const res = await fetch(`${MUSIC_API_URL}?action=musiclist`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch music list: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch music list');
  }

  return json.data;
}
