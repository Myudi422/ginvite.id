'use server';

import { revalidatePath } from 'next/cache';

const RSVP_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=rsmp';
const GET_RSVP_URL = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_rsmp';

export interface RsvpData {
  nama: string;
  wa: string;
  ucapan: string;
  konfirmasi: 'hadir' | 'tidak hadir';
  created_at: string;
}

/**
 * Fetch the RSVP list for a given content ID.
 */
export async function getRsvpList(contentId: number): Promise<RsvpData[]> {
  const res = await fetch(`${GET_RSVP_URL}&content_id=${contentId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Gagal mengambil daftar RSVP: ${res.status}`);
  }
  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal mengambil data RSVP');
  }
  // Reverse so newest first
  return json.data.reverse();
}

/**
 * Submit a new RSVP entry.
 * @param contentId ID of the content (invitation)
 * @param nama Full name
 * @param wa WhatsApp number
 * @param ucapan Message content
 * @param konfirmasi Attendance confirmation ('hadir' or 'tidak hadir')
 */
export async function submitRsvp(
  contentId: number,
  nama: string,
  wa: string,
  ucapan: string,
  konfirmasi: 'hadir' | 'tidak hadir',
  revalidatePathname?: string
): Promise<void> {
  const payload = {
    content_id: contentId,
    nama,
    wa,
    ucapan,
    konfirmasi,
  };

  const res = await fetch(RSVP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal mengirim RSVP');
  }

  // Optionally revalidate the page to show updated list
  if (revalidatePathname) {
    revalidatePath(revalidatePathname);
  }
}
