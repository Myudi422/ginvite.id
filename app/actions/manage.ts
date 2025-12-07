'use server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const MANAGE_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';
const SECRET = 'very-secret-key';

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
  // Get current user email from token
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  let currentUserEmail = '';
  if (token) {
    try {
      const payload: any = jwt.verify(token, SECRET);
      currentUserEmail = payload.data?.email || '';
    } catch (error) {
      // Token invalid, continue without current user
    }
  }
  
  const url = new URL(`${MANAGE_API_URL}?action=get_manage`);
  url.searchParams.append('user_id', userId);
  url.searchParams.append('title', title);
  if (currentUserEmail) {
    url.searchParams.append('current_user_email', currentUserEmail);
  }
  
  const res = await fetch(url.toString());

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
