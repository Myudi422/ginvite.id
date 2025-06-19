'use server';

const MANAGE_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface ManageData {
  id_content_user: number;
  view: number;
  total_nominal_bank_transfer: number;
  jumlah_konfirmasi: {
    hadir: number;
    tidak_hadir: number;
  };
  QR: boolean;
}

export async function getManageData(userId: string, title: string): Promise<ManageData> {
  const res = await fetch(
    `${MANAGE_API_URL}?action=get_manage&user_id=${userId}&title=${encodeURIComponent(title)}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal mengambil data.');
  }

  const json = await res.json();
  if (json.status === 'success' && json.data) {
    return json.data as ManageData;
  }

  throw new Error(json.message || 'Data tidak valid.');
}
