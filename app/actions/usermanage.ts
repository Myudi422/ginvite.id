'use server';

import { revalidatePath } from 'next/cache';

const BASE_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

/**
 * Fetch user management data.
 * @param params Query parameters for the API call.
 */
export async function fetchUserManageData(params: Record<string, string>): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}?action=get_usermanage&${queryString}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data user manage: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal mengambil data user manage');
  }

  return json.data;
}

/**
 * Delete user management data.
 * @param id ID of the data to delete.
 * @param type Type of the data (e.g., 'rsvp', 'transfer', 'qr_attendance').
 */
export async function deleteUserManageData(id: number, type: string): Promise<void> {
  const url = `${BASE_URL}?action=delete_usermanage`;

  const payload = { id, type };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal menghapus data user manage');
  }
}

/**
 * Revalidate a specific path after data changes.
 * @param path Path to revalidate.
 */
export async function revalidateUserManagePath(path: string): Promise<void> {
  revalidatePath(path);
}
