'use server';

const BASE_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

/**
 * Fetch QR attendance data.
 * @param params Query parameters for the API call.
 */
export async function fetchQRAttendanceData(params: Record<string, string>): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}?action=get_qr_attendance&${queryString}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data QR attendance: ${res.status}`);
  }

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal mengambil data QR attendance');
  }

  return json.data;
}

/**
 * Delete QR attendance data.
 * @param id ID of the QR attendance record to delete.
 */
export async function deleteQRAttendanceData(id: number): Promise<void> {
  const url = `${BASE_URL}?action=delete_qr_attendance`;

  const payload = { id };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Gagal menghapus data QR attendance');
  }
}
