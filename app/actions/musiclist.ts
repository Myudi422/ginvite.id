'use server';

const MUSIC_API_URL = process.env.USER_MANAGE_API_URL || 'https://dev.legalpilar.id/v2/android/ginvite/index.php';

export interface Music {
  Nama_lagu: string;
  link_lagu: string;
  kategori: string;
}

function normalizeCategory(cat: string): string {
  if (!cat) return '';
  const normalized = cat.toLowerCase().trim().replace(/_/g, ' ');
  if (normalized === 'ultah' || normalized === 'ulang tahun' || normalized === 'birthday') {
    return 'ulang tahun';
  }
  return normalized;
}

export async function getMusicList(category?: string): Promise<Music[]> {
  const res = await fetch(`${MUSIC_API_URL}?action=musiclist`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch music list: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Failed to fetch music list');
  }

  // Filter by category if specified
  if (category && category.trim() !== '') {
    const targetCat = normalizeCategory(category);
    const filtered = json.data.filter((music: Music) => {
      const musicCat = normalizeCategory(music.kategori);
      return musicCat === targetCat;
    });

    if (filtered.length > 0) {
      return filtered;
    }

    // Fallback: If no songs matched the specified category (e.g. custom event), return all songs
    return json.data;
  }

  return json.data;
}
